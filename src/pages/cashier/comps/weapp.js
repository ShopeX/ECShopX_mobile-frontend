import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import api from '@/api'

import './weapp.scss'

export default class WeappBtn extends Component {
  static options = {
    addGlobalClass: true
  }

  constructor (props) {
    super(props)

    this.state = {
    }
  }

  componentDidMount () {
  }

  // async fetch (number) {

  // Taro.getPayData({
  //   tid: tid
  // }).then(res => {
  //   const data = res.data
  //   Taro.requestPayment({
  //     timeStamp: data.timeStamp,
  //     nonceStr: data.nonceStr,
  //     package: data.package,
  //     signType: data.signType,
  //     paySign: data.paySign,
  //     success: () => {
  //       console.log("z支付成功")
  //       // Taro.navigateTo({
  //       //   url: '/pages/cart/paystatus?tid=' + tid
  //       // })
  //     },
  //     fail:()=>{
  //       console.log("z支付失败")
  //       // 取消支付则直接进入到未付款页面
  //       // Taro.redirectTo({
  //       //   url: '/pages/user/orders'
  //       // })
  //     }
  //   })
  // })

  //   const query = {
  //     ...this.state.query,
  //     number
  //   }
  //   const { a } = await api.item.search(query)
  //   console.log(a, 35)
  //   // const nList = pickBy(list, {
  //   //   img: 'pics[0]',
  //   //   item_id: 'item_id',
  //   //   title: 'itemName',
  //   //   desc: 'brief',
  //   //   price: ({ price }) => (price/100).toFixed(2),
  //   //   market_price: ({ market_price }) => (market_price/100).toFixed(2)
  //   // })
  //   //
  //   // this.setState({
  //   //   list: [...this.state.list, ...nList],
  //   //   query
  //   // })
  //   //
  //   // return {
  //   //   total
  //   // }
  // }

  handleClickPay = async (number) => {
      // const query = {
      //   ...this.state.query,
      //   number
      // }
      let query = {
        number: number
      }
      const { a } = await api.cashier.weapppay(query)
      console.log(a, 35)
  }

  render () {
    const { number } = this.props
    return (
      <View
        className='weapp-btn'
        onClick={this.handleClickPay.bind(this, number)}
      >
        微信支付
      </View>
    )
  }
}
