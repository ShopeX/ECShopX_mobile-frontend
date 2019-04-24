import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtActionSheet, AtActionSheetItem, AtSegmentedControl, AtImagePicker, AtTag, AtButton, AtTextarea } from 'taro-ui'
import { SpCell, SpToast } from '@/components'
import api from '@/api'
import req from '@/api/req'
import { log, pickBy } from '@/utils'
import S from '@/spx'
import * as qiniu from 'qiniu-js'
import qiniuUploader from '@/utils/qiniuUploader'

import './refund.scss'
import DetailItem from "./detail";

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
      // segTypes: [{ key: 'ONLY_REFUND', value: '仅退款' }, { key: 'REFUND_GOODS', value: '退货退款' }],
      reason: ['多拍/拍错/不想要', '缺货'],
      // reason: ['多拍/拍错/不想要', '缺货', '买多了', '质量问题', '卖家发错货', '商品破损', '描述不符', '其他'],
      description: '',
      imgs: [],
      refundReasonIndex: null,
      isSameReason: false
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

  uploadURLFromRegionCode = (code) => {
    let uploadURL = null;
    switch(code) {
      case 'z0': uploadURL = 'https://up.qiniup.com'; break;
      case 'z1': uploadURL = 'https://up-z1.qiniup.com'; break;
      case 'z2': uploadURL = 'https://up-z2.qiniup.com'; break;
      case 'na0': uploadURL = 'https://up-na0.qiniup.com'; break;
      case 'as0': uploadURL = 'https://up-as0.qiniup.com'; break;
      default: console.error('please make the region is with one of [z0, z1, z2, na0, as0]');
    }
    return uploadURL;
  }


  handleImageChange = async (data, type) => {

    if (type === 'remove') {
      console.log(222)
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
          let uploadUrl = this.uploadURLFromRegionCode(region)
          if (process.env.TARO_ENV === 'weapp') {
            Taro.uploadFile({
              url: uploadUrl,
              filePath: item.url,
              name: 'file',
              formData:{
                'token': token,
                'key': key
              },
              success: res => {
                let imgData = JSON.parse(res.data)
                resolve({
                  url: `${domain}/${imgData.key}`
                })
              },
              fail: error => reject(error)
            })
          } else {
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
    // const aftersales_type = segTypes[curSegIdx].key
    const evidence_pic = this.state.imgs.map(({ url }) => url)
    const { item_id, order_id, aftersales_bn } = this.$router.params
    const data = {
      item_id,
      order_id,
      aftersales_bn,
      // aftersales_type,
      reason,
      description,
      evidence_pic
    }

    const method = aftersales_bn ? 'modify' : 'apply'
    await api.aftersales[method](data)

    S.toast('操作成功')
    // setTimeout(() => {
    //   Taro.redirectTo({
    //     url: '/pages/trade/after-sale'
    //   })
    // }, 700)
  }

  handleClickReason = () => {
    this.setState({
      isRefundReason: true
    })
  }

  handleClickSheet = (index) => {
    this.setState({
      refundReasonIndex: index,
      isSameReason: !this.state.isSameReason,
      isRefundReason: false
    })
  }

  render () {
    const { reason, curSegIdx, curReasonIdx, segTypes, description, imgs, isRefundReason, refundReasonIndex, isSameReason } = this.state
    // const segTypeVals = segTypes.map(t => t.value)
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

        <SpCell title='退款原因' isLink onClick={this.handleClickReason.bind(this)} value='请选择' />
        <AtActionSheet
          className='refund-reason'
          isOpened={isRefundReason}
          cancelText='关闭'
          title='退款原因'
        >
          {
            reason.map((item, index) => {
              return(
                <AtActionSheetItem key={index} onClick={this.handleClickSheet.bind(this, index)}>
                  <View className='refund-reason__item'>
                    <Text>{item}</Text>
                    {
                      refundReasonIndex === index && isSameReason
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
