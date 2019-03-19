import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import api from '@/api'
import { pickBy } from '@/utils'
import { withLogin } from '@/hocs'
import { AlipayPay, WeappPay, WeH5Pay, PointDepositPay } from './comps'

import './index.scss'

@withLogin()
export default class Cashier extends Component {
  constructor (props) {
    super(props)

    this.state = {
      info: {},
    }
  }
  componentDidShow () {
    this.fetch()
  }

  async fetch () {
    const { order_id } = this.$router.params
    const orderInfo = await api.cashier.getOrderDetail(order_id)
    const info = pickBy(orderInfo, {
      order_id: 'order_id',
      order_type: 'order_type',
      pay_type: 'pay_type',
      point: 'point',
      title: 'title',
      total_fee: ({ total_fee }) => (total_fee/100).toFixed(2)
    })
    // const list = resolveCartItems(cartlist)
    // const items = normalizeItems(list)
    this.setState({
      info: info
    })

  }

  handleClickBack = (url) => {
    Taro.redirectTo({
      url: url
    })
  }


  render () {
    const { info } = this.state

    return (
      <View className='page-cashier-index'>
        <AtNavBar
          onClickLeftIcon={info.order_type === 'recharge' ? this.handleClickBack.bind(this, '/pages/member/pay') : this.handleClickBack.bind(this, '/pages/trade/list')}
          color='#000'
          title='NavBar 导航栏示例'
          leftIconType='chevron-left'
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
              : <PointDepositPay
                orderID={info.order_id}
                payType={info.pay_type}
                orderType={info.order_type}
              />
          }


        </View>
      </View>
    )
  }
}
