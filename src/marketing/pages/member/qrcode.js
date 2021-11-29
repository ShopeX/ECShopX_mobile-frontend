import React, { Component } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components'
import api from '@/api'

import './qrcode.scss'

export default class QRcode extends Component {
  $instance = getCurrentInstance();
  constructor(props) {
    super(props)

    this.state = {
      result: ''
    }
  }

  async componentDidMount() {
    const { user_card_id } = this.$instance.router.params
    let result = await api.member.getQRcode({ user_card_id })
    this.setState({
      result
    })
  }

  handleClick = () => {
    const { card_id, user_card_id, code } = this.$instance.router.params
    console.log('🚀', this.$instance.router.params)
    Taro.redirectTo({
      url: `/pages/item/list?card_id=${card_id}&code=${code}&user_card_id=${user_card_id}&isNewGift=true`
    })
  }

  render() {
    const { result } = this.state

    return (
      result && (
        <View className='qrcode-page'>
          <View className='qrcode-page_content'>
            <View className='top'>
              {result.distributor_info.logo && (
                <Image className='logo' src={result.distributor_info.logo} />
              )}
              <View className='title'>{result.distributor_info.name}</View>
            </View>
            <View className='middle'>
              <Image className='barcode' src={result.barcode_url} />
              <View className='code'>兑换码：{result.code}</View>
              <Image className='qrcode' src={result.qrcode_url} />
            </View>
            <View className='bottom' onClick={this.handleClick.bind(this)}>
              重新选择兑换商品
            </View>
          </View>
        </View>
      )
    )
  }
}
