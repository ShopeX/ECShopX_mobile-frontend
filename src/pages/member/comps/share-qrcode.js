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
      isOpened: true
    }
  }

  componentDidMount () {
    this.fetch()
  }


  async fetch (params) {
    const { list } = await api.member.qrcodeData(params)
    console.log(list)
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
    const { isOpened } = this.state

    return (
      <AtCurtain
        closeBtnPosition='top-right'
        isOpened={isOpened}
        onClose={this.handleCloseQrcode.bind(this)}
      >
        <View className='qrcode-content'>
          <View className='qrcode-content__name'>
            如果果园 生鲜专家
          </View>
          <View className='qrcode-content__qr'>
            <Image src='/assets/imgs/integral_empty.png' className='qrcode-content__qrimg' />
            <View className='qrcode-content__qrtext'>
              扫描二维码，关注我的小店
            </View>
          </View>
          <View className='qrcode-content__copy'>
            复制链接
          </View>
        </View>
      </AtCurtain>
    )
  }
}
