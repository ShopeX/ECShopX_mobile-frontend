/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 订单item
 * @FilePath: /unite-vshop/src/groupBy/component/orderItem/index.js
 * @Date: 2020-05-09 15:10:18
 * @LastEditors: Arvin
 * @LastEditTime: 2020-06-18 18:19:18
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import api from '@/api'

import './index.scss'

export default class OrderItem extends Component {

  constructor (props) {
    super(props)
  }

  // 前往订单详情
  handleItem = () => {
    const { info } = this.props
    Taro.navigateTo({
      url: `/groupBy/pages/orderDetail/index?orderId=${info.orderId}`
    })
  }

  // 核销
  handleWriteOff = (e) => {
    e.stopPropagation()
    console.log('核销')
  }

  // 去付款
  handlePay = (e) => {
    e.stopPropagation()
    const { info } = this.props
    api.groupBy.payConfig({
      order_id: info.orderId,
      order_type: 'normal_community',
      pay_type: 'wxpay'
    }).then(res => {
      Taro.requestPayment({
        timeStamp: res.timeStamp,
        nonceStr: res.nonceStr,
        package: res.package,
        signType: res.signType,
        paySign: res.paySign,
        success: () => { 
          Taro.showToast({
            title: '支付成功',
            mask: true,
            complete: () => {
              Taro.navigateTo({
                url: `/groupBy/pages/orderDetail/index?orderId=${info.orderId}`
              })
            }
          })
        },
        fail: () => { 
          Taro.showModal({
            content: '支付失败',
            showCancel: false
          })
        }
      })
    })
  }
  
  render () {
    const { info } = this.props
    return (
      <View className='orderItem' onClick={this.handleItem.bind(this)}>
        <View className='orderHeader'>
          <View className='orderNo'>{info.orderId}</View>
          <View className='orderStatus'>{info.orderStatusMsg}</View>
        </View>
        <View className='orderContent'>
          <Image className='goodImg' src={info.items[0].pic} />
          <View className='goodInfo'>
            <View className='name'>{info.items[0].itemName}</View>
            <View className='tag'>会员专享</View>
            <View className='price'>
              <View>
                ¥<Text className='now'>{info.items[0].totalFee}</Text>
                <Text className='old'>¥{info.items[0].itemPrice}</Text>
              </View>
              <View className='orderNum'>...共{info.items.length}件商品</View>
            </View>
          </View>
        </View>
        <View className='orderAct'>
          { info.orderStatus === 'NOTPAY' && <View className='actBtn' onClick={this.handlePay.bind(this)}>去付款</View>}
          {/* { <View className='actBtn' onClick={this.handleWriteOff.bind(this)}>核销</View> } */}
        </View>
      </View>
    )
  }
}
