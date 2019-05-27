import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import api from '@/api'
import { Loading, NavBar } from '@/components'
import { pickBy } from '@/utils'
import { withLogin } from '@/hocs'
import { AlipayPay, WeH5Pay, PointDepositPay, WePay } from './comps'

import './index.scss'

@withLogin()
export default class Cashier extends Component {
  state = {
    info: null
  }

  componentDidShow () {
    this.fetch()
  }

  async fetch () {
    const { order_id } = this.$router.params
    Taro.showLoading()
    const orderInfo = await api.cashier.getOrderDetail(order_id)
    const info = pickBy(orderInfo, {
      order_id: 'order_id',
      order_type: 'order_type',
      pay_type: 'pay_type',
      point: 'point',
      title: 'title',
      total_fee: ({ total_fee }) => (total_fee/100).toFixed(2)
    })

    this.setState({
      info: info
    })
    Taro.hideLoading()

  }

  handleClickBack = () => {
    const { order_type } = this.state.info
    const url = order_type === 'recharge' ? '/pages/member/pay' : '/pages/trade/list'

    Taro.redirectTo({
      url
    })
  }


  render () {
    const { info } = this.state

    if(!info) {
      <Loading />
    }

    return (
      <View className='page-cashier-index'>
        <NavBar
          title='收银台'
          handleClickBack={this.handleClickBack}
        />
        <View className='cashier-money'>
          {
            info.order_type !== 'recharge'
              ? <View className='cashier-money__tip'>订单提交成功，请选择支付方式</View>
              : null
          }
          <View className='cashier-money__content'>
            <View className='cashier-money__content-title'>订单编号： { info.order_id }</View>
            <View className='cashier-money__content-title'>订单名称：{ info.title }</View>
            <View className='cashier-money__content-title'>应付总额{ info.pay_type === 'point' ? '（积分）' : '（元）'}</View>
            <View className='cashier-money__content-number'>{ info.pay_type === 'point' ? info.point : info.total_fee }</View>
          </View>
        </View>

        <View className='pay-status'>
          {
            info.order_type === 'recharge'
              ? <View>
                  <AlipayPay
                    orderID={info.order_id}
                    payType='alipayh5'
                    orderType={info.order_type}
                  />
                  <WeH5Pay orderID={info.order_id} />
                </View>
              : <View>
                <PointDepositPay
                  orderID={info.order_id}
                  payType={info.pay_type}
                  orderType={info.order_type}
                />
                <WePay
                  info={info}
                />
              </View>
          }


        </View>
      </View>
    )
  }
}
