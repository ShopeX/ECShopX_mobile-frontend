/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 订单详情
 * @FilePath: /unite-vshop/src/groupBy/pages/orderDetail/index.js
 * @Date: 2020-05-08 15:07:31
 * @LastEditors: Arvin
 * @LastEditTime: 2020-06-18 18:25:09
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import api from '@/api'
import { NavBar } from '@/components'

import './index.scss'

export default class OrderDetail extends Component {

  constructor (props) {
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
      qrcodeUrl: '',
      orderId: ''
    }
  }
  
  componentWillUnmount () {
    let { timeId } = this.state
    if (timeId) {
      clearTimeout(timeId)
    }
  }

  componentDidShow () {
    this.getOrderDetail()
  }

  config = {
    navigationBarTitleText: '订单详情'
  }

  // 倒计时
  countdown = () => {
    let { cancelTime, timeId } = this.state
    if (cancelTime > 0) {
      timeId = setTimeout(() => {
        this.setState({
          cancelTime: cancelTime - 1
        }, () => {
          this.countdown()
        })
      }, 1000)
    } else {
      // 清除倒计时
      timeId = ''
      clearTimeout(timeId)
      console.log('执行回调')
    }
    this.setState({
      timeId
    })
  }

  // 格式化时间
  formatCountTime = (time) => {
    const format = (val) => (val > 9) ? val : `0${val}`
    // const d = Math.floor(time / (24*3600))
    const h = Math.floor(time % (24*3600) / 3600)
    const m = Math.floor(time % 3600 / 60)
    const s = Math.floor(time % 60)
    return `${format(h)}:${format(m)}:${format(s)}`
  }

  getOrderDetail = () => {
    const { orderId } = this.$router.params
    if (!orderId) {
      return
    }
    api.groupBy.getOrderDetail({
      orderId
    }).then(res => {
      const { orderInfo } = res
      this.setState({
        orderId: orderInfo.order_id,
        list: orderInfo.items,
        // currtent: currentCommunity,
        totalItemNum: orderInfo.items.reduce((total, val) => total += val.num, 0),
        totalFee: (orderInfo.total_fee / 100).toFixed(2),
        itemFee: (orderInfo.item_fee / 100).toFixed(2),
        cancelTime: orderInfo.auto_cancel_seconds,
        orderStatus: orderInfo.order_status,
        orderStatusMsg: orderInfo.order_status_msg,
        activityStatus: orderInfo.activity_status,
        deliveryDate: orderInfo.delivery_date,
        qrcodeUrl: orderInfo.qrcode_url
      }, () => {
        this.countdown()
      })
    })
  }

  // 立即支付
  handlePay = (e) => {
    e.stopPropagation()
    const { orderId } = this.state
    api.groupBy.payConfig({
      order_id: orderId,
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
              Taro.redirectTo({
                url: `/groupBy/pages/orderDetail/index?orderId=${orderId}`
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
    const { 
      currtent,
      activityStatus,
      list,
      deliveryDate,
      cancelTime,
      totalFee,
      totalItemNum,
      orderStatusMsg,
      itemFee,
      qrcodeUrl,
      orderStatus
    } = this.state
    return (
      <View className='orderDetail'>
        <NavBar
          title={this.config.navigationBarTitleText}
          leftIconType='chevron-left'
          fixed='true'
        />
        <View className='orderInfo'>
          {/* 订单状态 */}
          <View className='infoLine status'>
            <View>{ orderStatusMsg }</View>
            { orderStatus === 'NOTPAY' && <View>{ this.formatCountTime(cancelTime) }后自动取消订单</View> }
          </View>
          {/* 取货码 */}
          {
            orderStatus === 'PAYED' && <View className='code'>
              <Text>取货码</Text>
              <Image className='codeImg' src={qrcodeUrl} />
              <View className='codeBtn'>确认核销</View>
            </View>
          }
          {/* 配送地址 */}
          {
            orderStatus === 'PAYED' && <View className='address'>
              <View className='time'>预计送达: { deliveryDate }</View>
              <View className='community'>{ currtent.community_name }</View>
              <View className='unit'>提货：{ currtent.address }</View>
            </View>
          }
          {/* 商品详情 */}
          <View className='goodinfo'>
            <View className='infoLine'>
              <View className='goodImg'>
                {
                  list.map(item => (
                    <Image key={item.item_id} src={item.pic} className='img' />
                  ))
                }
              </View>
              <View className='sum'>
                共{ totalItemNum }件
                <View className='iconfont icon-arrowRight'></View>
              </View>
            </View>
            <View className='infoLine'>
              <Text>商品总价</Text>
              <Text>¥{ itemFee }</Text>
            </View>
            <View className='infoLine'>
              <View>会员优惠</View>
              <View>-¥7.50</View>
            </View>
            <View className='infoLine flexEnd'>
              <Text>
                { orderStatus === 'NOTPAY' ? '需支付' : '合计' }： 
                <Text className='price'>¥{ totalFee }</Text>
              </Text>
            </View>
          </View>
          {/* 订单详情 */}
          {
            orderStatus === 'PAYED' && <View className='orderinfo'>
              <View className='infoLine'>
                <Text>订单号</Text>
                <Text>123912073019273</Text>
              </View>
              <View className='infoLine'>
                <Text>下单时间</Text>
                <Text>2020-05-01 15:30</Text>
              </View>
              <View className='infoLine'>
                <View>支付时间</View>
                <View>2020-05-01 15:30</View>
              </View>
              <View className='infoLine'>
                <View>完成时间</View>
                <View>2020-05-01 15:30</View>
              </View>
            </View>
          }
          {
            orderStatus === 'PAYED' && activityStatus !== 'over' && <View className='btn'>
              申请退款
            </View>
          }
          {
            orderStatus === 'NOTPAY' && <View className='btnGroup'>
              <View className='btn pay' onClick={this.handlePay.bind(this)}>
                去支付
              </View>
              <View className='btn'>
                取消订单
              </View>
            </View>
          }
        </View>
      </View>
    )
  }
}