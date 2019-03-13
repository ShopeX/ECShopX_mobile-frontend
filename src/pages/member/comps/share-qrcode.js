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
    await api.member.qrcodeData()
      .then(res => {
        this.setState({
          qrCode: 'data:image/png;base64,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'
        })
        // console.log(res.qrcode)
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

  render () {
    const { isOpened, qrCode } = this.state

    return (
      <AtCurtain
        closeBtnPosition='top-right'
        isOpened={isOpened}
        onClose={this.handleCloseQrcode.bind(this)}
      >
        <View className='qrcode-content'>
          <View className='qrcode-content__qr'>
            <Image src={`${qrCode}`} className='qrcode-content__qrimg' />
          </View>
        </View>
      </AtCurtain>
    )
  }
}
