/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 订单详情
 * @FilePath: /unite-vshop/src/groupBy/pages/orderDetail/index.js
 * @Date: 2020-05-08 15:07:31
 * @LastEditors: Arvin
 * @LastEditTime: 2020-06-23 14:08:25
 */
import React, { Component } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components'
import api from '@/api'
import { formatDateTime } from '@/utils'
import { SpNavBar } from '@/components'

import './index.scss'

export default class OrderDetail extends Component {
  $instance = getCurrentInstance();
  constructor(props) {
    super(props)

    this.state = {
      list: [],
      cancelTime: 0,
      timeId: '',
      totalItemNum: 0,
      totalFee: 0,
      itemFee: 0,
      orderStatus: '',
      currtent: {},
      activityStatus: '',
      deliveryDate: '',
      endDate: '',
      payDate: '',
      createTime: '',
      qrcodeUrl: '',
      orderId: '',
      symbol: '¥'
    }
  }

  componentWillUnmount() {
    let { timeId } = this.state
    if (timeId) {
      clearTimeout(timeId)
    }
  }

  componentDidShow() {
    this.getOrderDetail()
  }

  // 倒计时
  countdown = () => {
    let { cancelTime, timeId } = this.state
    if (cancelTime > 0) {
      timeId = setTimeout(() => {
        this.setState(
          {
            cancelTime: cancelTime - 1
          },
          () => {
            this.countdown()
          }
        )
      }, 1000)
    } else {
      // 如果存在timeId
      if (timeId) {
        // 刷新订单
        this.getOrderDetail()
      }
      // 清除倒计时
      timeId = ''
      clearTimeout(timeId)
    }
    this.setState({
      timeId
    })
  }

  // 格式化时间
  formatCountTime = (time) => {
    const format = (val) => (val > 9 ? val : `0${val}`)
    // const d = Math.floor(time / (24*3600))
    const h = Math.floor((time % (24 * 3600)) / 3600)
    const m = Math.floor((time % 3600) / 60)
    const s = Math.floor(time % 60)
    return `${format(h)}:${format(m)}:${format(s)}`
  }

  getOrderDetail = () => {
    const { orderId } = this.$instance.router.params
    if (!orderId) {
      return
    }
    Taro.showLoading()
    api.groupBy
      .getOrderDetail({
        orderId
      })
      .then(async (res) => {
        const { orderInfo, community_activity, tradeInfo } = res
        let qrcodeUrl = ''
        if (orderInfo.order_status === 'PAYED' && orderInfo.ziti_status === 'PENDING') {
          const qrcodeRes = await api.groupBy.getZitiCode({ order_id: orderId })
          qrcodeUrl = qrcodeRes.qrcode_url
        }
        //  查询提货地址
        const { address } = await api.groupBy.activityCommunityDetail({
          community_id: orderInfo.shop_id
        })
        Taro.hideLoading()
        this.setState(
          {
            orderId: orderInfo.order_id,
            list: orderInfo.items,
            currtent: { address },
            totalItemNum: orderInfo.items.reduce((total, val) => (total += val.num), 0),
            totalFee: (orderInfo.total_fee / 100).toFixed(2),
            itemFee: (orderInfo.item_fee / 100).toFixed(2),
            cancelTime: orderInfo.auto_cancel_seconds,
            orderStatus: orderInfo.order_status,
            orderStatusMsg: orderInfo.order_status_msg,
            activityStatus: orderInfo.activity_status,
            deliveryDate: community_activity.delivery_date,
            symbol: orderInfo.fee_symbol,
            endDate: orderInfo.end_date,
            payDate: tradeInfo.payDate,
            pay_type: orderInfo.pay_type,
            createTime: formatDateTime(orderInfo.create_time),
            qrcodeUrl
          },
          () => {
            if (orderInfo.order_status === 'NOTPAY') {
              this.countdown()
            }
          }
        )
      })
  }

  // 立即支付
  handlePay = (e) => {
    e.stopPropagation()
    Taro.showLoading({ title: '拉起支付中...', mask: true })
    const { orderId, pay_type } = this.state
    api.groupBy
      .payConfig({
        order_id: orderId,
        order_type: 'normal_community',
        pay_type
      })
      .then((res) => {
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
              duration: 1000,
              complete: () => {
                setTimeout(() => {
                  Taro.redirectTo({
                    url: `/groupBy/pages/orderDetail/index?orderId=${orderId}`
                  })
                }, 1000)
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
  cancelOrder = () => {
    const { orderId } = this.state
    Taro.showModal({
      content: '确认取消此订单？',
      success: (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '请稍等', mask: true })
          api.groupBy
            .cancelOrder({
              order_id: orderId
            })
            .then((result) => {
              Taro.hideLoading()
              console.log(result)
              Taro.showToast({
                title: '取消成功',
                duration: 1000,
                mask: true,
                success: () => {
                  // 成功返回
                  setTimeout(() => {
                    Taro.navigateBack()
                  }, 1000)
                }
              })
            })
        }
      }
    })
  }

  // 申请退款
  handleRefund = () => {
    const { orderId } = this.state
    Taro.showModal({
      content: '确认申请退款？',
      success: (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '请稍等', mask: true })
          api.groupBy
            .cancelOrder({
              order_id: orderId
            })
            .then(() => {
              Taro.hideLoading()
              Taro.showModal({
                title: '已经申请,请耐心等候退款',
                showCancel: false,
                success: (back) => {
                  if (back.confirm) {
                    // 成功返回
                    Taro.navigateBack()
                  }
                }
              })
            })
        }
      }
    })
  }

  render() {
    const {
      orderId,
      currtent,
      activityStatus,
      list,
      deliveryDate,
      endDate,
      cancelTime,
      totalFee,
      totalItemNum,
      orderStatusMsg,
      itemFee,
      qrcodeUrl,
      payDate,
      createTime,
      orderStatus,
      symbol
    } = this.state
    return (
      <View className='orderDetail'>
        <SpNavBar
          title={this.config.navigationBarTitleText}
          leftIconType='chevron-left'
          fixed='true'
        />
        <View className='orderInfo'>
          {/* 订单状态 */}
          <View className='infoLine status'>
            <View>{orderStatusMsg}</View>
            {orderStatus === 'NOTPAY' && (
              <View>{this.formatCountTime(cancelTime)}后自动取消订单</View>
            )}
          </View>
          {/* 取货码 */}
          {orderStatus === 'PAYED' && qrcodeUrl && (
            <View className='code'>
              <Text>取货码</Text>
              <Image className='codeImg' src={qrcodeUrl} />
              {/* <View className='codeBtn'>确认核销</View> */}
            </View>
          )}
          {/* 配送地址 */}
          {orderStatus === 'PAYED' && (
            <View className='address'>
              <View className='time'>预计送达: {deliveryDate}</View>
              <View className='community'>{currtent.community_name}</View>
              <View className='unit'>提货：{currtent.address}</View>
            </View>
          )}
          {/* 商品详情 */}
          <View className='goodinfo'>
            <View className='infoLine'>
              <View className='goodImg'>
                {list.map((item) => (
                  <Image key={item.item_id} src={item.pic} className='img' />
                ))}
              </View>
              <View className='sum'>
                共{totalItemNum}件<View className='iconfont icon-arrowRight'></View>
              </View>
            </View>
            <View className='infoLine'>
              <Text>商品总价</Text>
              <Text>
                {symbol}
                {itemFee}
              </Text>
            </View>
            {/* <View className='infoLine'>
              <View>会员优惠</View>
              <View>-¥7.50</View>
            </View> */}
            <View className='infoLine flexEnd'>
              <Text>
                {orderStatus === 'NOTPAY' ? '需支付' : '合计'}：
                <Text className='price'>
                  {symbol}
                  {totalFee}
                </Text>
              </Text>
            </View>
          </View>
          {/* 订单详情 */}
          {
            <View className='orderinfo'>
              <View className='infoLine'>
                <Text>订单号</Text>
                <Text>{orderId}</Text>
              </View>
              <View className='infoLine'>
                <Text>下单时间</Text>
                <Text>{createTime}</Text>
              </View>
              {orderStatus === 'PAYED' && (
                <View className='infoLine'>
                  <View>支付时间</View>
                  <View>{payDate}</View>
                </View>
              )}
              {endDate && (
                <View className='infoLine'>
                  <View>完成时间</View>
                  <View>{endDate}</View>
                </View>
              )}
            </View>
          }
          {orderStatus === 'PAYED' && activityStatus !== 'over' && (
            <View className='btn' onClick={this.handleRefund.bind(this)}>
              申请退款
            </View>
          )}
          {orderStatus === 'NOTPAY' && (
            <View className='btnGroup'>
              <View className='btn pay' onClick={this.handlePay.bind(this)}>
                去支付
              </View>
              <View className='btn' onClick={this.cancelOrder.bind(this)}>
                取消订单
              </View>
            </View>
          )}
        </View>
      </View>
    )
  }
}
