import Taro, { Component } from '@tarojs/taro'
import {Button, Image, Text, View} from '@tarojs/components'
import {AtBadge, AtButton} from 'taro-ui'
import api from '@/api'

import './cashier-result.scss'

export default class CashierResult extends Component {
  constructor (props) {
    super(props)

    this.state = {
    }
  }



  render () {
    // const { list, pluralType, imgType, currentIndex } = this.state

    return (
      <View className='page-cashier-index'>
        <View className='cashier-content'>
          <View className='cashier-result'>
            <View className='cashier-result__img'>
              <Image
                className='note__img'
                mode='aspectFill'
                src='/assets/imgs/pay_fail.png'
              />
            </View>
            <View className='cashier-result__info'>
              {/*<View className='cashier-result__info-title'>订单支付成功</View>*/}
              <View className='cashier-result__info-title'>订单支付失败</View>
              <View className='cashier-result__info-news'>订单号：B2C123102831</View>
              <View className='cashier-result__info-news'>创建时间：2016-06-16 16:54:09</View>
              <View className='cashier-result__info-news'>支付时间：2016-06-16 16:54:09</View>
            </View>
          </View>
        </View>

        <View className='goods-buy-toolbar'>
          {/*<View className='goods-buy-toolbar__btns'>*/}
            {/*<Button*/}
              {/*className='goods-buy-toolbar__btn btn-add-cart'*/}
              {/*// onClick={onClickAddCart}*/}
            {/*>继续购物</Button>*/}
            {/*<Button*/}
              {/*className='goods-buy-toolbar__btn btn-fast-buy'*/}
              {/*// onClick={onClickFastBuy}*/}
            {/*>订单详情</Button>*/}
          {/*</View>*/}
          <View className='goods-buy-toolbar__btns'>
            <Button
              className='goods-buy-toolbar__btn btn-fast-buy'
              // onClick={onClickFastBuy}
            >返回订单详情</Button>
          </View>
        </View>
      </View>
    )
  }
}
