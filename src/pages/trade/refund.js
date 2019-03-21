import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtSegmentedControl, AtImagePicker, AtTag, AtButton, AtTextarea } from 'taro-ui'
import { SpCell, SpToast } from '@/components'
import api from '@/api'
import req from '@/api/req'
import { log } from '@/utils'
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
      segTypes: ['仅退款', '退款退货'],
      reason: ['多买/错买', '不想要了', '买多了', '质量问题', '卖家发错货', '商品破损', '描述不符', '其他'],
      description: '',
      imgs: []
    }
  }

  componentDidMount () {
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

  handleImageChange = async (data, type, index) => {
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

  handleImageClick = (data) => {

  }

  handleSubmit = async () => {
    const { segTypes, curSegIdx, curReasonIdx, description } = this.state
    const reason = this.state.reason[curReasonIdx]
    const aftersales_type = segTypes[curSegIdx]
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
    const res = await api.aftersales[method](data)
    Taro.redirectTo({
      url: '/pages/trade/after-sale'
    })
  }

  render () {
    const { reason, curSegIdx, curReasonIdx, segTypes, description, imgs } = this.state

    return (
      <View className='page-trade-refund'>
        <SpCell border={false}>
          <AtSegmentedControl
            onClick={this.handleChangeType}
            values={segTypes}
            current={curSegIdx}
          >
          </AtSegmentedControl>
        </SpCell>

        <SpCell title='请选择退款理由'>
          {reason.map((item, idx) => {
            return (
              <AtTag
                className='refund-reason'
                key={idx}
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
        </View>

        <SpToast />
      </View>
    )
  }
}
