import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import api from '@/api'
import { Loading, SpNavBar, SpToast } from '@/components'
import { pickBy, browser, getPointName } from '@/utils'
import { withLogin } from '@/hocs'
import { AlipayPay, WeH5Pay, WePay } from './comps'
import { getPaymentList } from '@/utils/payment'
import { PAYTYPE } from '@/consts'
import { deleteForm } from './util';

import './index.scss'

@withLogin()
export default class Cashier extends Component {
  state = {
    info: null,
    env: '',
    isHasAlipay:true,
    payType:PAYTYPE.WXH5
  }

  componentDidShow() {
    this.fetch();
    deleteForm();
  }

  async componentDidMount(){ 
    const { isHasAlipay } = await getPaymentList();
    this.setState({
      isHasAlipay
    })
  }

  isPointitemGood() {
    const options = this.$router.params
    return options.type === 'pointitem'
  }

  async fetch() {
    const { order_id,pay_type } = this.$router.params

    let env = ''
    if (browser.weixin) {
      env = 'WX'
    }

    Taro.showLoading()
    const orderInfo = await api.cashier.getOrderDetail(order_id)

    const info = pickBy(orderInfo.orderInfo, {
      order_id: 'order_id',
      order_type: 'order_type',
      pay_type: 'pay_type',
      point: 'point',
      title: 'title',
      total_fee: ({ total_fee }) => (total_fee / 100).toFixed(2)
    })

    this.setState({
      info,
      env,
      payType:pay_type
    })
    Taro.hideLoading()
  }

  handleClickBack = () => {
    const { order_type } = this.state.info
    const url = order_type === 'recharge' ? '/pages/member/pay' : '/pages/trade/list?redrict=home'

    Taro.redirectTo({
      url
    })
  }

  render() {
    const { info, env, isHasAlipay,payType } = this.state;
 
    if (!info) {
      return <Loading />
    }

    return (
      <View className='page-cashier-index'>
        <SpNavBar title='收银台' onClickLeftIcon={this.handleClickBack} />
        <View className='cashier-money'>
          {info.order_type !== 'recharge' ? (
            <View className='cashier-money__tip'>订单提交成功，请选择支付方式</View>
          ) : null}
          <View className='cashier-money__content'>
            <View className='cashier-money__content-title'>订单编号： {info.order_id}</View>
            <View className='cashier-money__content-title'>订单名称：{info.title}</View>
            <View className='cashier-money__content-title'>
              应付总额
              {info.pay_type === 'point' ? `（${getPointName()}）` : '（元）'}
            </View>
            <View className='cashier-money__content-number'>
              {info.pay_type === 'point' ? info.point : info.total_fee}
            </View>
          </View>
        </View>
        {!env ? (
          <View>
            {isHasAlipay && payType===PAYTYPE.ALIH5 &&<AlipayPay orderID={info.order_id} payType='alipayh5' orderType={info.order_type} />}
            {payType===PAYTYPE.WXH5 && <WeH5Pay orderID={info.order_id} />}
          </View>
        ) : (
          <View>
            <WePay info={info} />
          </View>
        )}
        <SpToast />
      </View>
    )
  }
}
