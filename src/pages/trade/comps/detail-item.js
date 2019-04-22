import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { Price } from '@/components'
import { classNames } from '@/utils'
import OrderItem from './order-item'

import './detail-item.scss'

export default class DetailItem extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    // customHeader: false,
    customFooter: false,
    // customRender: false,
    // noHeader: false,
    // showActions: false,
    // payType: '',
    // onClickBtn: () => {},
    // onClick: () => {}
  }

  // handleClickBtn (type) {
  //   const { info } = this.props
  //   this.props.onClickBtn && this.props.onClickBtn(type, info)
  // }

  handleClickAfterSale= (item) => {
    const { info: { tid: order_id } } = this.props
    console.log(item, order_id, 33)
    Taro.navigateTo({
      url: `/pages/trade/refund?order_id=${order_id}&item_id=${item.item_id}`
    })
  }

  render () {
    const { customHeader, customFooter, noHeader, onClick, info, showActions } = this.props
    console.log(info, 40)
    return (
      <View className='detail-item'>
        {
          info.orders.map((item, idx) =>
            <View className='detail-item-good' key={idx}>
              <Text className='detail-item__title'>第{idx+1}件商品</Text>
              <OrderItem
                key={idx}
                info={item}
              />
              {!customFooter && info.status === 'TRADE_SUCCESS' && <View className='order-item__ft'>
                <AtButton
                  circle
                  type='primary'
                  size='small'
                  onClick={this.handleClickAfterSale.bind(this, item)}
                >申请售后</AtButton>
              </View>}
            </View>

          )
        }
      </View>
    )
  }
}
