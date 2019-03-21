import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { Price } from '@/components'
import OrderItem from './order-item'

import './item.scss'

export default class TradeItem extends Component {
  static options = {
    addGlobalClass: true,
    payType: ''
  }

  static defaultProps = {
    customHeader: false,
    customFooter: false,
    customRender: false,
    noHeader: false,
    onClickBtn: () => {},
    onClick: () => {}
  }

  handleClickBtn (type) {
    const { info } = this.props
    this.props.onClickBtn && this.props.onClickBtn(type, info)
  }

  render () {
    const { customHeader, customFooter, noHeader, onClick, info, payType } = this.props

    return (
      <View className='trade-item'>
        {
          !noHeader && (
            customHeader
              ? <View className='trade-item__hd'>{this.props.renderHeader}</View>
              : <View className='trade-item__hd'>
                  <Text className='trade-item__shop'>{info.shopname}</Text><Text className='more'>{info.status_desc}</Text>
                </View>
          )
        }
        <View
          className='trade-item__bd'
          onClick={onClick}
        >
          {
            info.order.map((item, idx) =>
              <OrderItem
                key={idx}
                info={item}
                payType={payType}
              />
            )
          }
          {
            this.props.customRender
              ? this.props.customRender
              : payType === 'point'
                ? (<View className='trade-item__total'>共{info.totalItems}件商品 合计: <Price appendText='积分' noSymbol noDecimal value={info.point} /></View>)
                : (<View className='trade-item__total'>共{info.totalItems}件商品 合计: <Price value={info.payment} /></View>)
          }
        </View>
        {customFooter && <View className='trade-item__ft'>{this.props.renderFooter}</View>}
        {!customFooter && info.status === 'WAIT_BUYER_PAY' && <View className='trade-item__ft'>
          <AtButton
            circle
            type='secondary'
            size='small'
            onClick={this.handleClickBtn.bind(this, 'pay')}
          >立即支付</AtButton>
        </View>}
        {!customFooter && info.status === 'WAIT_SELLER_SEND_GOODS' && (<View className='trade-item__ft'>
          <AtButton
            circle
            size='small'
            onClick={this.handleClickBtn.bind(this, 'cancel')}
          >取消订单</AtButton>
        </View>)}
        {!customFooter && info.status === 'WAIT_BUYER_CONFIRM_GOODS' && <View className='trade-item__ft'>
          <AtButton
            circle
            type='secondary'
            size='small'
            onClick={this.handleClickBtn.bind(this, 'confirm')}
          >确认收货</AtButton>
        </View>}
        {!customFooter && info.status === 'WAIT_RATE' && <View className='trade-item__ft'>
          <AtButton
            circle
            type='secondary'
            size='small'
            onClick={this.handleClickBtn.bind(this, 'rate')}
          >评价</AtButton>
        </View>}
      </View>
    )
  }
}
