import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtActionSheet, AtActionSheetItem, AtSegmentedControl, AtImagePicker, AtTag, AtButton, AtTextarea } from 'taro-ui'
import { SpCell, SpToast } from '@/components'
import api from '@/api'
import req from '@/api/req'
import { log, pickBy } from '@/utils'
import S from '@/spx'
import * as qiniu from 'qiniu-js'

import './refund.scss'

function resolveBlobFromFile (url, type) {
  return fetch(url)
    .then(res => res.blob())
    .then(blob => blob.slice(0, blob.size, type))
}

export default class TradeRefund extends Component {
  constructor (props) {
    super(props)

    this.state = {
      curSegIdx: 0,
      curReasonIdx: 0,
      segTypes: [{ key: 'ONLY_REFUND', value: '仅退款' }, { key: 'REFUND_GOODS', value: '退货退款' }],
      reason: ['多拍/拍错/不想要', '缺货'],
      // reason: ['多拍/拍错/不想要', '缺货', '买多了', '质量问题', '卖家发错货', '商品破损', '描述不符', '其他'],
      description: '',
      imgs: [],
      isRefundReason: false
    }
  }

  componentDidMount () {
    // this.fetch()
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
      curReasonIdx: ({ reason }) => this.state.reason.indexOf(reason) || 0,
      description: 'description',
      imgs: ({ evidence_pic }) => evidence_pic.map(url => ({ url }))
    })

    this.setState(params)
  }

  handleChangeType = (idx) => {
    this.setState({
      curSegIdx: idx
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
    const { value } = e.target
    this.setState({
      description: value
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
    let promises = []

    for (let item of imgFiles) {
      const promise = new Promise(async (resolve, reject) => {
        if (!item.file) {
          resolve(item)
        } else {
          const filename = item.url.slice(item.url.lastIndexOf('/') + 1)
          const { region, token, key, domain } = await req.get('/espier/image_upload_token', {
            filesystem: 'qiniu',
            filetype: 'aftersales',
            filename
          })

          let observable
          try {
            const blobImg = await resolveBlobFromFile(item.url, item.file.type)
            observable = qiniu.upload(blobImg, key, token, {}, {
              region: qiniu.region[region]
            })
          } catch (e) {
            console.log(e)
          }

          observable.subscribe({
            next (res) {},
            error (err) {
              reject(err)
            },
            complete (res) {
              resolve({
                url: `${domain}/${res.key}`
              })
            }
          })
        }
      })
      promises.push(promise)
    }

    const results = await Promise.all(promises)
    log.debug('[qiniu uploaded] results: ', results)

    this.setState({
      imgs: results
    })
  }

  handleImageClick = () => {
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

    const method = aftersales_bn ? 'modify' : 'apply'
    await api.aftersales[method](data)

    S.toast('操作成功')
    setTimeout(() => {
      Taro.redirectTo({
        url: '/pages/trade/after-sale'
      })
    }, 700)
  }

  handleClickReason = () => {
    this.setState({
      isRefundReason: true
    })
  }

  render () {
    const { reason, curSegIdx, curReasonIdx, segTypes, description, imgs, isRefundReason } = this.state
    const segTypeVals = segTypes.map(t => t.value)

    return (
      <View className='page-trade-refund'>
        <View className='refund-info'>
          <View className='refund-info__num'>
            <Text className='refund-info__text'>商品数量：</Text>
            <Text className='refund-info__text text-primary'>3</Text>
          </View>
          <View className='refund-info__num'>
            <Text className='refund-info__text'>退款金额：</Text>
            <View>
              <Text className='refund-info__text text-primary'>300</Text>
              <Text className='refund-info__text'>(含发货邮费￥300)</Text>
            </View>
          </View>
        </View>

        <SpCell title='退款原因' isLink onClick={this.handleClickReason.bind(this)} value='请选择' />
        <AtActionSheet
          className='refund-reason'
          isOpened={isRefundReason}
          cancelText='关闭'
          title='退款原因'
        >
          <AtActionSheetItem>
            <View className='refund-reason__item'>
              <Text>多拍/拍错/不想要</Text>
              {
                isRefundReason
                  ? <Text className='in-icon in-icon-check default__icon default__checked'> </Text>
                  : <Text className='in-icon in-icon-check default__icon'> </Text>
              }
            </View>
          </AtActionSheetItem>
          <AtActionSheetItem>
            <View className='refund-reason__item'>
              <Text>缺货</Text>
              {
                isRefundReason
                  ? <Text className='in-icon in-icon-check default__icon default__checked'> </Text>
                  : <Text className='in-icon in-icon-check default__icon'> </Text>
              }
            </View>
          </AtActionSheetItem>
        </AtActionSheet>

        <View className='refund-describe'>
          <AtTextarea
            value={description}
            onChange={this.handleTextChange}
            placeholder='退款说明（选填）'
          > </AtTextarea>
          <View className='refund-describe__img'>
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
        </View>
        <View className='refund-btn'>提交</View>
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
