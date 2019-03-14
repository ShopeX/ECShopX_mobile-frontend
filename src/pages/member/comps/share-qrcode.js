import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { classNames, formatTime } from '@/utils'
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
    if(Taro.getEnv() === 'WEAPP') {
      await api.member.qrcodeData()
        .then(res => {
          this.setState({
            qrCode: res.qrcode
          })
          // console.log(res.qrcode)
        })
      console.log(1)
    } else {
      await api.member.h5_qrcodeData()
        .then(res => {
          this.setState({
            qrCode: res.share_qrcode
          })
        })
      console.log(2)
    }


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
        </View>
      </AtCurtain>
    )
  }
}
