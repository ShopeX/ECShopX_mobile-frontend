import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtActionSheet, AtActionSheetItem, AtSegmentedControl, AtImagePicker, AtTag, AtButton, AtTextarea } from 'taro-ui'
import { SpCell, SpToast } from '@/components'
import api from '@/api'
import req from '@/api/req'
import { log, pickBy } from '@/utils'
import S from '@/spx'
// import * as qiniu from 'qiniu-js'
import qiniuUploader from '@/utils/qiniu'

import './refund.scss'
import DetailItem from "./detail";

export default class TradeRefund extends Component {
  constructor (props) {
    super(props)

    this.state = {
      // reason: ['多拍/拍错/不想要', '缺货', '买多了', '质量问题', '卖家发错货', '商品破损', '描述不符', '其他'],
      description: '',
      imgs: [],
      // isSameReason: false,
      // isRefundType: false,
      reason: ['多拍/拍错/不想要', '缺货'],
      curReasonIdx: null,
      isShowSegReasonSheet: false,
      isSameCurSegReason: false,
      curSegReasonValue: null,
      segTypes: [{ key: 'ONLY_REFUND', value: '仅退款' }, { key: 'REFUND_GOODS', value: '退货退款' }],
      curSegIdx: null,
      isShowSegTypeSheet: false,
      isSameCurSegType: false,
      curSegTypeValue: null,
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
    Taro.showLoading({
      mask: true
    })

    const { aftersales_bn, item_id, order_id } = this.$router.params
    const res = await api.aftersales.info({
      aftersales_bn,
      item_id,
      order_id
    })
    Taro.hideLoading()

    if (!res.aftersales) return

    const params = pickBy(res.aftersales, {
      curSegIdx: ({ aftersales_type }) => this.state.segTypes.findIndex(t => t.key === aftersales_type) || 0,
      curSegTypeValue: ({ aftersales_type }) => this.state.segTypes[this.state.segTypes.findIndex(t => t.key === aftersales_type)].value,
      curReasonIdx: ({ reason }) => this.state.reason.indexOf(reason) || 0,
      curSegReasonValue: 'reason',
      description: 'description',
      imgs: ({ evidence_pic }) => evidence_pic.map(url => ({ url }))
    })

    console.log(params, 70)

    this.setState(params)
  }


  /*handleClickTag = (data) => {
    const idx = this.state.reason.indexOf(data.name)

    if (idx >= 0) {
      this.setState({
        curReasonIdx: idx
      })
    }
  }*/

  handleTextChange = (e) => {
    const { value } = e.target
    this.setState({
      description: value
    })
  }

  handleImageChange = (data, type) => {

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
    qiniuUploader.uploadImageFn(imgFiles, '/espier/image_upload_token', 'qiniu', 'aftersales')
      .then(res => {
        this.setState({
          imgs: res
        })
      })

    // this.uploadImageFn(imgFiles, '/espier/image_upload_token', 'qiniu', 'aftersales')

  }

  handleImageClick = () => {
  }

  handleChangeRefundOptions = (type) => {
    if (type === 'type') {
      this.setState({
        isShowSegTypeSheet: true,
      })
    }

    if (type === 'reason') {
      this.setState({
        isShowSegReasonSheet: true,
      })
    }
  }

  handleClickSheet = (index, item, type) => {
    if (type === 'type') {
      this.setState({
        curSegIdx: index === this.state.curSegIdx ? null : index,
        isSameCurSegType:  index === this.state.curSegIdx ? !this.state.isSameCurSegType : true,
        isShowSegTypeSheet: false,
        curSegTypeValue: index === this.state.curSegIdx ? null : item.value
      })
    }

    if (type === 'reason') {
      this.setState({
        curReasonIdx: index === this.state.curReasonIdx ? null : index,
        isSameCurSegReason:  index === this.state.curReasonIdx ? !this.state.isSameCurSegReason : true,
        isShowSegReasonSheet: false,
        curSegReasonValue: index === this.state.curReasonIdx ? null : item
      })
    }
  }

  handleSubmit = async () => {
    const { segTypes, curSegIdx, curReasonIdx, description } = this.state
    const reason = this.state.reason[curReasonIdx]
    const aftersales_type = segTypes[curSegIdx].key
    const evidence_pic = this.state.imgs.map(({ url }) => url)
    const { item_id, order_id, aftersales_bn } = this.$router.params
    const data = {
      item_id,
      order_id,
      aftersales_bn,
      aftersales_type,
      reason,
      description,
      evidence_pic
    }

    console.log(data, 244)
    const method = aftersales_bn ? 'modify' : 'apply'
    await api.aftersales[method](data)

    S.toast('操作成功')
    // setTimeout(() => {
    //   Taro.redirectTo({
    //     url: '/pages/trade/after-sale'
    //   })
    // }, 700)
  }

  render () {
    const { segTypes, curSegIdx, isShowSegTypeSheet, isSameCurSegType, curSegTypeValue,
      reason, curReasonIdx, isShowSegReasonSheet, isSameCurSegReason, curSegReasonValue, description, imgs } = this.state
    return (
      <View className='page-trade-refund'>
        {/*<View className='trade-detail-goods'>
          <DetailItem
            info={info}
          />
        </View>*/}
        {/*<View className='refund-info'>*/}
          {/*<View className='refund-info__num'>*/}
            {/*<Text className='refund-info__text'>商品数量：</Text>*/}
            {/*<Text className='refund-info__text text-primary'>3</Text>*/}
          {/*</View>*/}
          {/*<View className='refund-info__num'>*/}
            {/*<Text className='refund-info__text'>退款金额：</Text>*/}
            {/*<View>*/}
              {/*<Text className='refund-info__text text-primary'>300</Text>*/}
              {/*<Text className='refund-info__text'>(含发货邮费￥300)</Text>*/}
            {/*</View>*/}
          {/*</View>*/}
        {/*</View>*/}
        <SpCell
          title='退款类型'
          isLink
          onClick={this.handleChangeRefundOptions.bind(this, 'type')}
          value={curSegTypeValue ? curSegTypeValue : '请选择'}
        />
        <AtActionSheet
          className='refund-reason'
          isOpened={isShowSegTypeSheet}
          cancelText='关闭'
          title='退款类型'
        >
          {
            segTypes.map((item, index) => {
              return(
                <AtActionSheetItem key={index} onClick={this.handleClickSheet.bind(this, index, item, 'type')}>
                  <View className='refund-reason__item'>
                    <Text>{item.value}</Text>
                    {
                      curSegTypeValue === item.value || (curSegIdx === index && isSameCurSegType)
                        ? <Text className='in-icon in-icon-check default__icon default__checked'> </Text>
                        : <Text className='in-icon in-icon-check default__icon'> </Text>
                    }
                  </View>
                </AtActionSheetItem>
              )
            })
          }
        </AtActionSheet>

        <SpCell
          title='退款原因'
          isLink
          onClick={this.handleChangeRefundOptions.bind(this, 'reason')}
          value={curSegReasonValue ? curSegReasonValue : '请选择'}
        />
        <AtActionSheet
          className='refund-reason'
          isOpened={isShowSegReasonSheet}
          cancelText='关闭'
          title='退款原因'
        >
          {
            reason.map((item, t_index) => {
              return(
                <AtActionSheetItem key={t_index} onClick={this.handleClickSheet.bind(this, t_index, item, 'reason')}>
                  <View className='refund-reason__item'>
                    <Text>{item}</Text>
                    {
                      curSegReasonValue === item || (curReasonIdx === t_index && isSameCurSegReason)
                        ? <Text className='in-icon in-icon-check default__icon default__checked'> </Text>
                        : <Text className='in-icon in-icon-check default__icon'> </Text>
                    }
                  </View>
                </AtActionSheetItem>
              )
            })
          }
        </AtActionSheet>

        <View className='refund-describe'>
          <AtTextarea
            value={description}
            onChange={this.handleTextChange}
            placeholder='退款说明（选填）'
          > </AtTextarea>
          {
            curSegIdx === 1
              ? <View className='refund-describe__img'>
                  <Text className='refund-describe__text'>上传凭证</Text>
                  <View className='refund-describe__imgupload'>
                    <Text className='refund-describe__imgupload_text'>您可以上传最多3张图片</Text>
                    <AtImagePicker
                      multiple
                      mode='aspectFill'
                      length={5}
                      files={imgs}
                      onChange={this.handleImageChange}
                      onImageClick={this.handleImageClick}
                    > </AtImagePicker>
                  </View>
                </View>
              : null
          }

        </View>
        <View className='refund-btn' onClick={this.handleSubmit}>提交</View>
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
