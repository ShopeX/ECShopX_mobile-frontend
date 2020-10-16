/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 支付订单
 * @FilePath: /unite-vshop/src/groupBy/pages/payOrder/index.js
 * @Date: 2020-05-08 15:07:31
 * @LastEditors: Arvin
 * @LastEditTime: 2020-06-23 13:43:00
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import api from '@/api'
import { NavBar,SpCell } from '@/components'
import PaymentPicker from '@/pages/cart/comps/payment-picker'
import './index.scss'

export default class PayOrder extends Component {

  constructor (props) {
    super(props)
    
    this.state = {
      list: [],
      totalItemNum: 0,
      totalFee: 0,
      itemFee: 0,
      currtent: {},
      symbol: '¥',
      param: {
        receipt_type: 'ziti',
        order_type: 'normal_community',
        items: [],
        remark: '',
        community_id: '',
        community_activity_id: '',
        member_discount: false,
        coupon_discount: '',
      },
      payType:'',
      isPaymentOpend:false
    }
  }
  
  componentDidMount () {
    this.getCalculateTotal()
  }
  
  config = {
    navigationBarTitleText: '结算'
  }

  getCalculateTotal = async () => {
    Taro.showLoading({title: '请稍等...', mask: true})
    const { activityId, itemId, itemNum = 1, communityId } = this.$router.params
    //  查询地址
    const currentCommunity = await api.groupBy.activityCommunityDetail({community_id: communityId})
    const { param } = this.state
    if (itemId) {
      param.items.push({
        item_id: itemId,
        num: itemNum
      })
    }
    param.community_id = communityId
    param.community_activity_id = activityId
    api.groupBy.getCalculateTotal(param).then(res => {
      this.setState({
        // orderId: res.order_id,
        list: res.items,
        currtent: currentCommunity,
        totalItemNum: res.totalItemNum,
        totalFee: (res.total_fee / 100).toFixed(2),
        itemFee: (res.item_fee / 100).toFixed(2),
        symbol: res.fee_symbol,
        param
      })
      Taro.hideLoading()
    })
  }
  // 去支付
  handlePay = () => {
    const { param ,payType} = this.state
    param.pay_type=payType
    Taro.showLoading({title: '拉起支付中...', mask: true})
    api.groupBy.createOrder(param).then(res => {
      Taro.hideLoading()
      const { trade_info } = res
      Taro.requestPayment({
        timeStamp: res.timeStamp,
        nonceStr: res.nonceStr,
        package: res.package,
        signType: res.signType,
        paySign: res.paySign,
        success: () => {
          Taro.showToast({
            title: '支付成功',
            complete: () => {
              Taro.redirectTo({
                url: `/groupBy/pages/orderDetail/index?orderId=${trade_info.order_id}`
              })
            }
          })
        },
        fail: () => { 
          Taro.showModal({
            content: '支付失败',
            showCancel: false,
            complete: () => {
              Taro.redirectTo({
                url: `/groupBy/pages/orderDetail/index?orderId=${trade_info.order_id}`
              })
            }
          })
        }
      })
    })
  }
  handlePaymentShow = () => {
    this.setState({
      isPaymentOpend: true,
    })
  }
  handleLayoutClose = () => {
    this.setState({
      isPaymentOpend: false,
    })
  }
  handlePaymentChange = async (payType) => {

    this.setState({
      payType,
      isPaymentOpend: false
    }, () => {

    })
  }
  render () {
    const { 
      currtent,
      list,
      totalFee,
      totalItemNum,
      itemFee,
      symbol,
      payType,
      isPaymentOpend
    } = this.state
    const payTypeText = {
      point: '积分支付',
      wxpay: process.env.TARO_ENV === 'weapp' ? '微信支付' : '现金支付',
      deposit: '余额支付',
      delivery: '货到付款',
      hfpay:'汇付支付'
    } 
    return (
      <View className='payOrder'>
        <NavBar
          title={this.config.navigationBarTitleText}
          leftIconType='chevron-left'
          fixed='true'
        />
        <View className='orderInfo'>
          {/* 配送地址 */}
          <View className='address'>
            {/* <View className='time'>预计送达: 2020/05/09 18:00</View> */}
            <View className='community'>{ currtent.community_name }</View>
            <View className='unit'>提货：{ currtent.address }</View>
          </View>
          {/* 商品详情 */}
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
            <Text>{ symbol }{ itemFee }</Text>
          </View>
          <SpCell
              isLink
              border={false}
              title='支付方式'
              onClick={this.handlePaymentShow}
            >
              <Text>{payTypeText[payType]}</Text>
            </SpCell>
          {/* <View className='infoLine'>
            <View>会员优惠</View>
            <View>-¥7.50</View>
          </View> */}
          <View className='infoLine flexEnd'>
          <Text>需支付： <Text className='price'>{ symbol }{ totalFee }</Text></Text>
          </View>
        </View>
        {/* 支付 */}
        <View className='payBar'>
          <View className='sum'>合计: <Text className='price'>{ symbol }{ totalFee }</Text></View>
          <View className='goPay' onClick={this.handlePay.bind(this)}>去支付</View>
        </View>
        <PaymentPicker
          isOpened={isPaymentOpend}
          type={payType}
          isShowPoint={false}
          isShowBalance={false}
          isShowDelivery={false}
          // disabledPayment={disabledPayment}
          onClose={this.handleLayoutClose}
          onChange={this.handlePaymentChange}
        ></PaymentPicker>
      </View>
    )
  }
}