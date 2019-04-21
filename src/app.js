import Taro, { Component } from '@tarojs/taro'
import '@tarojs/async-await'
import { Provider } from '@tarojs/redux'
import configStore from '@/store'
import useHooks from '@/hooks'
import Index from './pages/index'

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const { store } = configStore()
useHooks()

class App extends Component {
  config = {
    pages: [
      // 'pages/index/index',
      'pages/home/index',
      'pages/home/landing',
      'pages/category/index',
      'pages/item/list',
      'pages/item/espier-detail',
      'pages/item/point-list',
      'pages/item/point-detail',
      'pages/item/group-list',
      'pages/item/seckill-list',
      'pages/item/seckill-goods-list',
      'pages/home/coupon-home',

      'pages/cart/espier-index',
      'pages/cart/espier-checkout',
      'pages/cart/coupon-picker',
      'pages/article/index',

      'pages/auth/reg',
      'pages/auth/reg-rule',
      'pages/auth/login',
      'pages/auth/forgotpwd',

      'pages/cashier/index',
      'pages/cashier/cashier-result',

      'pages/member/index',
      'pages/member/favorite',
      'pages/member/point',
      'pages/member/point-draw',
      'pages/member/point-draw-detail',
      'pages/member/draw-rule',
      'pages/member/point-draw-order',
      'pages/member/point-order-detail',
      'pages/member/point-draw-record',
      'pages/member/point-all-record',
      'pages/member/point-draw-compute',
      'pages/member/pay',
      'pages/member/pay-rule',
      'pages/member/money-to-point',
      'pages/member/recharge',
      'pages/member/recommend',
      'pages/member/recommend-member',
      'pages/member/recommend-order',
      'pages/member/coupon',
      'pages/member/address',
      'pages/member/edit-address',
      'pages/member/setting',
      'pages/member/userinfo',
      'pages/member/item-history',
      'pages/member/item-fav',
      'pages/member/item-guess',

      'pages/trade/list',
      'pages/trade/detail',
      'pages/trade/delivery-info',
      'pages/trade/rate',
      'pages/trade/cancel',
      'pages/trade/after-sale',
      'pages/trade/refund',
      'pages/trade/refund-detail',
      'pages/trade/refund-sendback',
      'pages/trade/invoice-list',

      'pages/protocol/privacy'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'innisfree悦诗风吟',
      navigationBarTextStyle: 'black'
    }
  }
  componentWillMount () {
  }
  componentDidMount () {
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
