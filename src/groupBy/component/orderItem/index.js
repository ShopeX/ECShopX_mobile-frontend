/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 订单item
 * @FilePath: /unite-vshop/src/groupBy/component/orderItem/index.js
 * @Date: 2020-05-09 15:10:18
 * @LastEditors: Arvin
 * @LastEditTime: 2020-06-23 13:46:34
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
    Taro.showLoading({title: '拉起支付中...', mask: true})
    const { info } = this.props
    api.groupBy.payConfig({
      order_id: info.orderId,
      order_type: 'normal_community',
      pay_type: 'wxpay'
    }).then(res => {
      Taro.hideLoading()
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
            duration: 2000,
            success: () => {
              setTimeout(() => {                
                Taro.navigateTo({
                  url: `/groupBy/pages/orderDetail/index?orderId=${info.orderId}`
                })
              }, 2000)
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
  
  // 取消订单
  cancelOrder = (e) => {
    e.stopPropagation()
    const { info } = this.state
    Taro.showModal({
      content: '确认取消此订单？',
      success: res => {
        if (res.confirm) {
          Taro.showLoading({title: '请稍等', mask: true})
          api.groupBy.cancelOrder({
            order_id: info.orderId
          }).then(result => {
            Taro.hideLoading()
            console.log(result)
            Taro.showToast({
              title: '取消成功',
              duration: 1000,
              mask: true,
              success: () => {
                // 成功刷新
                setTimeout(() => {
                  this.props.onRefresh && this.props.onRefresh()
                }, 1000)
              }
            })
          })
        }
      }
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
                { info.symbol }<Text className='now'>{info.items[0].totalFee}</Text>
                <Text className='old'>{ info.symbol }{info.items[0].itemPrice}</Text>
              </View>
              <View className='orderNum'>...共{info.items.length}件商品</View>
            </View>
          </View>
        </View>
        <View className='orderAct'>
          { info.orderStatus === 'NOTPAY' && <View className='actBtn' onClick={this.handlePay.bind(this)}>去付款</View>}
          { info.orderStatus === 'NOTPAY' && <View className='actBtn cancel' onClick={this.cancelOrder.bind(this)}>取消订单</View>}
          {/* { <View className='actBtn' onClick={this.handleWriteOff.bind(this)}>核销</View> } */}
        </View>
      </View>
    )
  }
}
