import Taro, { Component } from '@tarojs/taro'
import { Button, Image, View } from '@tarojs/components'
import api from '@/api'
import { formatDateTime } from '@/utils'
import paySuccessPng from '../../../assets/imgs/pay_success.png'
import payFailPng from '../../../assets/imgs/pay_fail.png'

import './cashier-result.scss'

export default class CashierResult extends Component {
  constructor(props) {
    super(props)

    this.state = {
      orderInfo: null,
      tradeInfo: {
        tradeState: ''
      },
      showTabBar: ''
    }
  }
  componentDidMount() {
    Taro.showLoading()
    setTimeout(() => {
      Taro.hideLoading()
      this.fetch()
    }, 3000)
  }

  async fetch() {
    const { order_id } = this.$router.params
    const { orderInfo, tradeInfo } = await api.cashier.getOrderDetail(order_id)

    if (tradeInfo.orderId.indexOf('CZ') !== -1) {
      this.setState({
        showTabBar: 'CZ'
      })
    }
    this.setState({
      orderInfo,
      tradeInfo
    })
    Taro.hideLoading()
  }

  handleClickBack = (orderId) => {
    if (orderId.indexOf('CJ') === -1) {
      Taro.navigateTo({
        url: `/subpage/pages/trade/detail?id=${orderId}`
      })
    } else {
      Taro.navigateTo({
        url: `/pages/member/point-draw-order`
      })
    }
  }

  handleClickRoam = () => {
    Taro.navigateTo({
      url: process.env.APP_HOME_PAGE
    })
  }

  render() {
    const { orderInfo, tradeInfo, showTabBar } = this.state

    if (!orderInfo) return null
    let create_time = formatDateTime(orderInfo.create_time * 1000)
    let ingUrl = payFailPng
    if (tradeInfo.tradeState === 'SUCCESS') {
      ingUrl = paySuccessPng
    }

    console.log("===tradeInfo===",tradeInfo)

    return (
      <View className='page-cashier-index'>
        <View className='cashier-content'>
          <View className='cashier-result'>
            <View className='cashier-result__img'>
              <Image className='note__img' mode='aspectFill' src={ingUrl} />
            </View>
            <View className='cashier-result__info'>
              <View className='cashier-result__info-title'>
                订单支付{tradeInfo.tradeState === 'SUCCESS' ? '成功' : '失败'}
              </View>
              <View className='cashier-result__info-news'>订单编号：{tradeInfo.orderId}</View>
              {tradeInfo.tradeState === 'SUCCESS' ? (
                <View className='cashier-result__info-news'>支付单号：{tradeInfo.tradeId}</View>
              ) : null}
              <View className='cashier-result__info-news'>创建时间：{create_time}</View>
              {tradeInfo.tradeState === 'SUCCESS' ? (
                <View className='cashier-result__info-news'>支付时间：{tradeInfo.payDate}</View>
              ) : null}
            </View>
          </View>
        </View>

        {showTabBar === 'CZ' ? (
          <View className='goods-buy-toolbar'>
            <View className='goods-buy-toolbar__btns'>
              <Button
                className='goods-buy-toolbar__btn btn-add-cart'
                onClick={this.handleClickRoam}
              >
                返回首页
              </Button>
            </View>
          </View>
        ) : (
          <View className='goods-buy-toolbar'>
            {tradeInfo.tradeState === 'fail' ? (
              <View className='goods-buy-toolbar__btns'>
                <Button
                  className='goods-buy-toolbar__btn btn-fast-buy'
                  onClick={this.handleClickBack.bind(this, tradeInfo.orderId)}
                >
                  订单详情
                </Button>
              </View>
            ) : (
              <View className='goods-buy-toolbar__btns'>
                <Button
                  className='goods-buy-toolbar__btn btn-add-cart'
                  onClick={this.handleClickRoam}
                >
                  返回首页
                </Button>
                <Button
                  className='goods-buy-toolbar__btn btn-fast-buy'
                  onClick={this.handleClickBack.bind(this, tradeInfo.orderId)}
                >
                  订单详情
                </Button>
              </View>
            )}
          </View>
        )}
      </View>
    )
  }
}
