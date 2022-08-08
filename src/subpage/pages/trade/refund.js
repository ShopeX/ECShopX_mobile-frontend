import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtImagePicker, AtTag, AtTextarea, AtTabsPane, AtTabs } from 'taro-ui'
import { SpCell, SpToast, SpHtml, SpImgPicker } from '@/components'
import { connect } from 'react-redux'
import api from '@/api'
// import req from '@/api/req'
import { Tracker } from '@/service'
import { pickBy, classNames } from '@/utils'
import S from '@/spx'
import imgUploader from '@/utils/upload'

import './refund.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
export default class TradeRefund extends Component {
  $instance = getCurrentInstance()
  constructor(props) {
    super(props)

    this.state = {
      // reason: ['多拍/拍错/不想要', '缺货', '买多了', '质量问题', '卖家发错货', '商品破损', '描述不符', '其他'],
      description: '',
      imgs: [],
      reason: [],
      curReasonIdx: null,
      goodStatus: ['未收到货', '已收到货'],
      curGoodIdx: null,
      isShowSegGoodSheet: false,
      isSameCurSegGood: false,
      curSegGoodValue: null,
      segTypes: [
        { title: '仅退款', status: 'ONLY_REFUND' },
        { title: '退货退款', status: 'REFUND_GOODS' }
      ],
      curSegIdx: 0,
      isShowSegTypeSheet: false,
      isSameCurSegType: false,
      curSegTypeValue: null,
      remind: {},
      isInvalid: true
    }
  }

  componentDidMount() {
    this.fetch()
    const { status } = this.$instance.router.params
    const { segTypes, curSegIdx } = this.state
    let curIndex = 0
    segTypes.map((item, index) => {
      item.status == status && (curIndex = index)
    })
    this.setState({
      curSegIdx: curIndex
    })
  }

  async fetch() {
    Taro.showLoading({
      mask: true
    })

    const { aftersales_bn, order_id, isDelivery, delivery_status, deliverData } =
      this.$instance.router.params
    let detail = deliverData ? JSON.parse(deliverData) : null
    // 获取售后原因
    const reasonList = await api.aftersales.reasonList()
    let params = null
    if (aftersales_bn) {
      const res = await api.aftersales.info({
        aftersales_bn,
        detail,
        order_id
      })
      if (!res) {
        this.setState({
          reason: newReason,
          remind
        })
        return
      }
      params = pickBy(res, {
        curSegIdx: ({ aftersales_type }) =>
          this.state.segTypes.findIndex((t) => t.status === aftersales_type) || 0,
        curSegTypeValue: ({ aftersales_type }) =>
          this.state.segTypes[this.state.segTypes.findIndex((t) => t.status === aftersales_type)]
            .title,
        curReasonIdx: ({ reason }) => reasonList.indexOf(reason) || 0,
        curSegReasonValue: 'reason',
        description: 'description',
        imgs: ({ evidence_pic }) => evidence_pic.map((url) => ({ url }))
      })
    }

    Taro.hideLoading()
    const { reason: oldReason } = this.state

    const newReason = [...oldReason, ...reasonList]
    let remind = await api.aftersales.remindDetail()
    if (isDelivery === 'false' && delivery_status !== 'DONE') {
      this.setState({
        segTypes: [{ title: '仅退款', status: 'ONLY_REFUND' }]
      })
    }

    this.setState({
      ...params,
      remind,
      reason: newReason
    })
  }

  handleClickTag = (data) => {
    const idx = this.state.reason.indexOf(data.name)

    if (idx >= 0) {
      this.setState({
        curReasonIdx: idx
      })
    }
  }

  handleTextChange = (e) => {
    this.setState({
      description: e
    })
  }

  handleImageChange = async (data, type) => {
    if (type === 'remove') {
      this.setState({
        imgs: data
      })

      return
    }

    if (data.length > 3) {
      S.toast('最多上传3张图片')
    }
    const imgFiles = data.slice(0, 3)

    imgUploader.uploadImageFn(imgFiles).then((res) => {
      this.setState({
        imgs: res
      })
    })
  }

  handleImageClick = () => {}

  handleClickTab = (idx) => {
    this.setState({
      curSegIdx: idx
    })
  }

  handleChangeRefundOptions = (type) => {
    if (type === 'type') {
      this.setState({
        isShowSegTypeSheet: true
      })
    }

    if (type === 'goods') {
      this.setState({
        isShowSegGoodSheet: true
      })
    }
  }

  handleClickSheet = (index, item, type) => {
    if (type === 'type') {
      this.setState({
        curSegIdx: index === this.state.curSegIdx ? null : index,
        isSameCurSegType: index === this.state.curSegIdx ? !this.state.isSameCurSegType : true,
        isShowSegTypeSheet: false,
        curSegTypeValue: index === this.state.curSegIdx ? null : item.value
      })
    }

    if (type === 'goods') {
      this.setState({
        curGoodIdx: index === this.state.curGoodIdx ? null : index,
        isSameCurSegGood: index === this.state.curGoodIdx ? !this.state.isSameCurSegGood : true,
        isShowSegGoodSheet: false,
        curSegGoodValue: index === this.state.curGoodIdx ? null : item
      })
    }
  }

  aftersalesAxios = async () => {
    await this.setState({ isInvalid: false })
    const { segTypes, curSegIdx, curReasonIdx, description } = this.state
    const reason = this.state.reason[curReasonIdx]
    const aftersales_type = segTypes[curSegIdx].status
    const evidence_pic = this.state.imgs.map(({ url }) => url)
    const { order_id, aftersales_bn, deliverData } = this.$instance.router.params
    let detail = deliverData
    const data = {
      detail,
      order_id,
      aftersales_bn,
      aftersales_type,
      reason,
      description,
      evidence_pic
    }

    // console.log(data, 244)
    const method = aftersales_bn ? 'modify' : 'apply'
    await api.aftersales[method](data)

    // 退款退货
    const { orderInfo } = await api.trade.detail(order_id)
    Tracker.dispatch('ORDER_REFUND', orderInfo)

    try {
      S.toast('操作成功')
      setTimeout(() => {
        Taro.redirectTo({
          url: `/subpage/pages/trade/detail?id=${order_id}`
        })

        this.setState({ isInvalid: true })
      }, 100)
    } catch (e) {
      this.setState({ isInvalid: true })
    }
  }

  handleSubmit = () => {
    let _this = this
    let templeparams = {
      'temp_name': 'yykweishop',
      'source_type': 'after_refund'
    }
    if (this.state.isInvalid) this.aftersalesAxios()
    // api.user.newWxaMsgTmpl(templeparams).then(tmlres => {
    //   if (tmlres.template_id && tmlres.template_id.length > 0) {
    //     wx.requestSubscribeMessage({
    //       tmplIds: tmlres.template_id,
    //       success () {
    //         _this.aftersalesAxios()
    //       },
    //       fail () {
    //         _this.aftersalesAxios()
    //       }
    //     })
    //   } else {
    //     _this.aftersalesAxios()
    //   }
    // }, () => {
    //   _this.aftersalesAxios()
    // })
  }

  render() {
    const { colors } = this.props
    const {
      segTypes,
      curSegIdx,
      reason,
      curReasonIdx,
      goodStatus,
      curGoodIdx,
      isShowSegGoodSheet,
      isSameCurSegGood,
      curSegGoodValue,
      description,
      imgs,
      remind
    } = this.state
    return (
      <View className='page-trade-refund'>
        <AtTabs
          className={`trade-refund__tabs ${colors.data[0].primary ? 'customTabsStyle' : ''}`}
          current={curSegIdx}
          tabList={segTypes}
          onClick={this.handleClickTab}
          customStyle={{ color: colors.data[0].primary, backgroundColor: colors.data[0].primary }}
        >
          {/* {segTypes.map((panes, pIdx) => (
            <AtTabsPane current={curSegIdx} key={panes.status} index={pIdx}></AtTabsPane>
          ))} */}
        </AtTabs>
        <SpCell className='trade-refund__reason' title='请选择退款理由'>
          {reason &&
            reason.map((item, idx) => {
              return (
                <AtTag
                  key={item}
                  className={classNames(
                    'refund-reason',
                    idx === curReasonIdx ? 'refund-reason__checked' : ''
                  )}
                  name={item}
                  onClick={this.handleClickTag}
                >
                  {item}
                </AtTag>
              )
            })}
        </SpCell>
        {/*<SpCell
          className='trade-refund__goods'
          title='货物状态'
          isLink
          onClick={this.handleChangeRefundOptions.bind(this, 'goods')}
          value={curSegGoodValue ? curSegGoodValue : '请选择'}
        />
        <AtActionSheet
          className='refund-goods'
          isOpened={isShowSegGoodSheet}
          cancelText='关闭'
          title='货物状态'
        >
          {
            goodStatus.map((item, t_index) => {
              return(
                <AtActionSheetItem key={t_index} onClick={this.handleClickSheet.bind(this, t_index, item, 'goods')}>
                  <View className='refund-goods__item'>
                    <Text>{item}</Text>
                    {
                      curSegGoodValue === item || (curGoodIdx === t_index && isSameCurSegGood)
                        ? <Text className='in-icon in-icon-check default__icon default__checked'> </Text>
                        : <Text className='in-icon in-icon-check default__icon'> </Text>
                    }
                  </View>
                </AtActionSheetItem>
              )
            })
          }
        </AtActionSheet>*/}

        <View className='refund-describe'>
          <AtTextarea
            value={description}
            onChange={this.handleTextChange}
            placeholder='退款说明（选填）'
          >
            {' '}
          </AtTextarea>
          {/* {curSegIdx === 1 ? ( */}
          <View className='refund-describe__img'>
            <Text className='refund-describe__text'>上传凭证</Text>
            <View className='refund-describe__imgupload'>
              <Text className='refund-describe__imgupload_text'>您可以上传最多3张图片</Text>
              <View className='refund-describe__imgupload_picker'>
                <AtImagePicker
                  multiple
                  mode='aspectFill'
                  showAddBtn={imgs.length < 3}
                  length={3}
                  count={3}
                  files={imgs}
                  onChange={this.handleImageChange}
                  onImageClick={this.handleImageClick}
                >
                  {' '}
                </AtImagePicker>
              </View>
            </View>
          </View>
          {/* ) : null} */}
        </View>

        {remind && remind.is_open && (
          <View className='remind-wrap'>
            <Text className='biao-icon biao-icon-tishi'> 售后提醒</Text>

            <View className='remind-text'>
              <SpHtml className='goods-detail__content' content={remind.intro} />
            </View>
          </View>
        )}
        <View
          className='refund-btn'
          style={`background: ${colors.data[0].primary}`}
          onClick={this.handleSubmit}
        >
          提交
        </View>
        {/*<SpCell border={false}>
          <AtSegmentedControl
            onClick={this.handleChangeType}
            values={segTypeVals}
            current={curSegIdx}
          >
          </AtSegmentedControl>
        </SpCell>

        <SpCell title='请选择退款理由'>
          {reason.map((item, idx) => {
            return (
              <AtTag
                className='refund-reason'
                key={item}
                active={idx === curReasonIdx}
                name={item}
                onClick={this.handleClickTag}
              >{item}</AtTag>
            )
          })}
        </SpCell>

        <SpCell title='详情描述'>
          <AtTextarea
            value={description}
            onChange={this.handleTextChange}
            maxLength={255}
            placeholder='请输入您的理由...'
          ></AtTextarea>
        </SpCell>

        {curSegIdx === 1 && (
          <SpCell title='上传图片' border={false}>
            <AtImagePicker
              multiple
              mode='aspectFill'
              length={5}
              files={imgs}
              onChange={this.handleImageChange}
              onImageClick={this.handleImageClick}
            ></AtImagePicker>
          </SpCell>
        )}

        <View className='toolbar toolbar-inline'>
          <AtButton
            type='primary'
            circle
            onClick={this.handleSubmit}
          >提交申请</AtButton>
        </View>*/}

        <SpToast />
      </View>
    )
  }
}
