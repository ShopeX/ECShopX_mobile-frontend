import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { copyText, formatTime } from '@/utils'
import { AtCurtain } from "taro-ui";
import api from '@/api'

import './share-qrcode.scss';

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
    await api.member.h5_qrcodeData()
      .then(res => {
        this.imgUrl = res.share_uir
        this.setState({
          qrCode: res.share_qrcode
        })
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
          <Image src={`${qrCode}`} className='qrcode-content__qrimg' />
          <View className='qrcode-content__copy' onClick={this.handleClickCopy}>
            复制链接
          </View>
        </View>

      </AtCurtain>
    )
  }
}
