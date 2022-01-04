import React, { Component } from 'react'
import { View, Image } from '@tarojs/components'
import { copyText } from '@/utils'
import { AtCurtain } from 'taro-ui'
import { Loading, SpToast } from '@/components'
import api from '@/api'
import S from '@/spx'

import './share-qrcode.scss'

export default class RateItem extends Component {
  static defaultProps = {
    isOpened: false
  }

  constructor (props) {
    super(props)

    this.state = {
      isOpened: true,
      qrCode: ''
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
    const res = await api.member.h5_qrcodeData()
    this.imgUrl = res.share_uir
    this.setState({
      qrCode: res.share_qrcode
    })
  }

  componentWillReceiveProps () {
    this.setState({
      isOpened: true
    })
  }

  handleCloseQrcode = () => {
    this.setState({
      isOpened: false
    })
  }

  handleClickCopy = () => {
    copyText(this.imgUrl)
    S.toast('复制成功')
  }

  render () {
    const { isOpened, qrCode } = this.state

    return (
      <AtCurtain
        closeBtnPosition='top-right'
        isOpened={isOpened}
        onClose={this.handleCloseQrcode.bind(this)}
      >
        <View className='qrcode-content'>
          {qrCode ? <Image src={`${qrCode}`} className='qrcode-content__qrimg' /> : <Loading />}
          <View className='qrcode-content__copy' onClick={this.handleClickCopy}>
            复制链接
          </View>
          <SpToast />
        </View>
      </AtCurtain>
    )
  }
}
