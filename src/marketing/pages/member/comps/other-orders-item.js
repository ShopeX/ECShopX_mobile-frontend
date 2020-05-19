import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'

import './other-orders-item.scss'


export default class OtherOrdersItem extends Component {
  static options = {
    addGlobalClass: true
  }

  constructor(props) {
    super(props)

    this.state = {
    }
  }

  render() {
    const { info, onClick } = this.props

    if(!info){
      return null
    }

    return (
      <View className='other-orders-item'  onClick={onClick}>
        <View className='flex item-info'>
          <View>订单号：{info.order_id}</View>
          <View>交易金额：￥{info.n_total_fee}</View>
        </View>
        <View className='align-right'>
          <Button
            className='d-button'
            circle
            size='mini'
            onClick={onClick}
          >订单详情</Button>
        </View>
      </View>
    )
  }
}
