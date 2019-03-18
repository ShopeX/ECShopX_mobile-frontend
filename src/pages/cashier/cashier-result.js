import Taro, { Component } from '@tarojs/taro'
import {Button, Image, Text, View} from '@tarojs/components'
import { pickBy, formatDataTime } from '@/utils'
import api from '@/api'

import './cashier-result.scss'

export default class CashierResult extends Component {
  constructor (props) {
    super(props)

    this.state = {
      info: {}
    }
  }
  componentDidShow () {
    this.fetch()
  }

  async fetch () {
    const { order_id } = this.$router.params
    const orderInfo = await api.cashier.getOrderDetail(order_id)

    const info = pickBy(orderInfo, {
      create_time: ({ create_time }) => (formatDataTime(create_time * 1000)),
      order_id: 'order_id',
      payDate: 'payDate',
      tradeId: 'tradeId',
      payStatus: 'payStatus'
    })

    // let info = Object.assign(infoOrder, infoTrade, this.$router.params)
    // console.log(info, 33)
    this.setState({
      info: info
    })

  }

  handleClickBack = (order_id) => {
    Taro.navigateTo({
      url: `/pages/trade/detail?id=${order_id}`
    })
  }

  handleClickRoam = () => {
    Taro.navigateTo({
      url: '/pages/item/list'
    })
  }

  render () {
    const { info } = this.state

    return (
      <View className='page-cashier-index'>
        <View className='cashier-content'>
          <View className='cashier-result'>
            <View className='cashier-result__img'>
              <Image
                className='note__img'
                mode='aspectFill'
                src={`/assets/imgs/pay_${info.payStatus}.png`}
              />
            </View>
            <View className='cashier-result__info'>
              <View className='cashier-result__info-title'>订单支付{info.payStatus === 'fail' ? '失败' : '成功'}</View>
              <View className='cashier-result__info-news'>订单号：{info.order_id}</View>
              <View className='cashier-result__info-news'>支付单号：{info.tradeId}</View>
              <View className='cashier-result__info-news'>创建时间：{info.create_time}</View>
              {
                info.payStatus === 'success' ? <View className='cashier-result__info-news'>支付时间：{info.payDate}</View> : null
              }
            </View>
          </View>
        </View>

        <View className='goods-buy-toolbar'>
          {
            info.payStatus === 'fail'
              ? <View className='goods-buy-toolbar__btns'>
                  <Button
                    className='goods-buy-toolbar__btn btn-fast-buy'
                    onClick={this.handleClickBack.bind(this, info.order_id)}
                  >返回订单详情</Button>
                </View>
              : <View className='goods-buy-toolbar__btns'>
                  <Button
                    className='goods-buy-toolbar__btn btn-add-cart'
                    onClick={this.handleClickRoam}
                  >继续购物</Button>
                  <Button
                    className='goods-buy-toolbar__btn btn-fast-buy'
                    onClick={this.handleClickBack.bind(this, info.order_id)}
                  >订单详情</Button>
                </View>
          }


        </View>
      </View>
    )
  }
}
