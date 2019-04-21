import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { Price } from '@/components'
import { classNames } from '@/utils'
import OrderItem from './order-item'

import './item.scss'

export default class TradeItem extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    customHeader: false,
    customFooter: false,
    customRender: false,
    noHeader: false,
    showActions: false,
    payType: '',
    onClickBtn: () => {},
    onClick: () => {}
  }

  handleClickBtn (type) {
    const { info } = this.props
    this.props.onClickBtn && this.props.onClickBtn(type, info)
  }

  render () {
    const { customHeader, customFooter, noHeader, onClick, info, payType, showActions } = this.props

    return (
      <View className='trade-item'>
        {
          !noHeader && (
            customHeader
              ? <View className='trade-item__hd'>{this.props.renderHeader}</View>
              : <View className='trade-item__hd'>
                  <Text className='time'>{info.create_date}</Text>
                  <Text className='trade-item__shop'>订单号：{info.tid}</Text>
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
        {customFooter && (<View className='trade-item__ft'>{this.props.renderFooter}</View>)}
        {!customFooter && info.status === 'WAIT_BUYER_PAY' && <View className='trade-item__ft'>
          <View className='trade-item__ft-actions'></View>
          <View className='trade-item__ft-bd'>
            <Text className='trade-item__status'>{info.status_desc}</Text>
            <AtButton
              circle
              type='primary'
              size='small'
              onClick={this.handleClickBtn.bind(this, 'pay')}
            >立即支付</AtButton>
          </View>
        </View>}
        {!customFooter && info.status === 'WAIT_SELLER_SEND_GOODS' && (<View className='trade-item__ft'>
          <View className='trade-item__ft-actions'></View>
          <View className='trade-item__ft-bd'>
            <Text className='trade-item__status'>{info.status_desc}</Text>
            <AtButton
              circle
              type='secondary'
              size='small'
              onClick={this.handleClickBtn.bind(this, 'cancel')}
            >取消订单</AtButton>
            <AtButton
              circle
              type='primary'
              size='small'
            >订单详情</AtButton>
          </View>
        </View>)}
        {!customFooter && info.status === 'WAIT_BUYER_CONFIRM_GOODS' && <View className='trade-item__ft'>
          <View className='trade-item__ft-actions'>
            <Text
              className='trade-item__acts'
              onClick={this.props.onActionBtnClick.bind(this)}
            >更多</Text>
            <View className={classNames('trade-item__dropdown', { 'is-active': showActions })}>
              <Text className='trade-item__dropdown-item' onClick={this.props.onActionClick.bind(this, 'confirm-receive')}>确认收货</Text>
              <Text className='trade-item__dropdown-item' onClick={this.props.onActionClick.bind(this, 'view-express')}>查看物流</Text>
            </View>
          </View>
          <View className='trade-item__ft-bd'>
            <Text className='trade-item__status'>{info.status_desc}</Text>
            <AtButton
              circle
              type='secondary'
              size='small'
              onClick={this.handleClickBtn.bind(this, 'confirm')}
            >确认收货</AtButton>
            <AtButton
              circle
              type='primary'
              size='small'
            >订单详情</AtButton>
          </View>
        </View>}
        {!customFooter && info.status === 'WAIT_RATE' && <View className='trade-item__ft'>
          <View className='trade-item__ft-actions'>
            <Text className='trade-item__acts'>更多</Text>
            <View className={classNames('trade-item__dropdown', { 'is-active': showActions })}>
              <Text className='trade-item__dropdown-item' onClick={this.props.onActionClick.bind(this, 'rate')}>评价|晒单</Text>
              <Text className='trade-item__dropdown-item' onClick={this.props.onActionClick.bind(this, 'rebuy')}>再次购买</Text>
            </View>
          </View>
          <View className='trade-item__ft-bd'>
            <Text className='trade-item__status'>{info.status_desc}</Text>
            <AtButton
              circle
              type='secondary'
              size='small'
              onClick={this.handleClickBtn.bind(this, 'rate')}
            >评价</AtButton>
            <AtButton
              circle
              type='primary'
              size='small'
            >订单详情</AtButton>
          </View>
        </View>}
      </View>
    )
  }
}
