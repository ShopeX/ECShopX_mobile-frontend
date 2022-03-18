import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import './index.scss'

export default class BaOrderItem extends Component {
  static defaultProps = {
    onClick: () => {},
    payType: '',
    showExtra: true,
    info: null,
    isChangenNum: false
  }

  static options = {
    addGlobalClass: true
  }

  render() {
    const { info, onClick, payType, showExtra, customFooter, isChangenNum, aftersaleOrder } =
      this.props
    if (!info) return null

    const img = info.pic_path
      ? info.pic_path
      : Array.isArray(info.pics)
      ? info.pics[0]
      : info.pics || info.pic

    return (
      <View className='order-main' onClick={onClick}>
        <View className='order-item'>
          <View className='order-item__hd'>
            <Image mode='aspectFill' className='order-item__img' src={img} />
          </View>
          <View className='order-item__bd'>
            <Text className='order-item__title'>{info.title || info.item_name || ''}</Text>
            {info.item_spec_desc && <Text className='order-item__spec'>{info.item_spec_desc}</Text>}
            {this.props.renderDesc}

            {this.props.renderFooter}
            {this.props.renderActLimit}
          </View>
        </View>
        {this.props.renderAdvanceSale}
      </View>
    )
  }
}
