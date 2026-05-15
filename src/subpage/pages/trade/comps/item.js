/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import { View, Text, Button } from '@tarojs/components'
import { connect } from 'react-redux'
import { classNames, formatPriceToHundred, VERSION_PLATFORM } from '@/utils'
import { $t, ti } from '@/i18n'
import { SpOrderItem } from '@/components'
import { SpNewShopItem } from '@/subpages/components'
import './item.scss'

@connect(({ colors, sys }) => ({
  colors: colors.current,
  pointName: sys.pointName
}))
export default class TradeItem extends Component {
  static defaultProps = {
    customHeader: false,
    customFooter: false,
    customRender: false,
    noHeader: false,
    showActions: false,
    isShowNational: false,
    payType: '',
    info: {},
    rateStatus: false,
    onClickBtn: () => {},
    onClick: () => {}
  }

  static options = {
    addGlobalClass: true
  }

  handleClickBtn(type) {
    const { info } = this.props
    this.props.onClickBtn && this.props.onClickBtn(type, info)
  }

  computeTotalPrice() {
    let total
    const {
      info: { point, order_class, freight_fee, freight_type, total_fee, payment, receipt_type },
      payType
    } = this.props

    if (order_class === 'pointsmall') {
      if (freight_type === 'point' || (freight_type === 'cash' && freight_fee == 0)) {
        total = ti('8116735b.03b04d', [point, this.props.pointName])
      } else if (freight_type === 'cash' && freight_fee != 0) {
        total = ti('8116735b.2513d7', [
          point,
          this.props.pointName,
          formatPriceToHundred(total_fee)
        ])
      }
    } else {
      if (payType === 'dhpoint') {
        total = ti('8116735b.eb481e', [total_fee, this.props.pointName])
      } else {
        total = ti('8116735b.82fc17', [payment])
      }
    }
    return (
      <View className={`trade-item__total ${receipt_type === 'dada' && 'dadaTotal'}`}>
        {receipt_type === 'dada' && (
          <View className='dada'>
            <Text className='iconfont icon-peisongxiangguan'></Text>
            {$t('8116735b.30734f')}
          </View>
        )}
        {total}
      </View>
    )
  }

  render() {
    const {
      customHeader,
      customFooter,
      noHeader,
      onClick,
      info = {},
      payType,
      showActions,
      colors,
      rateStatus,
      isShowNational
    } = this.props

    if (!info) {
      return null
    }
    return (
      <View className='trade-item'>
        {!noHeader &&
          (customHeader ? (
            <View>
              {VERSION_PLATFORM && (
                <SpNewShopItem inOrderList info={info.distributor_info} canJump />
              )}
              <View className='trade-item__hd'>{this.props.renderHeader}</View>
            </View>
          ) : (
            <View>
              {VERSION_PLATFORM && (
                <SpNewShopItem inOrderList info={info.distributor_info} canJump />
              )}
              <View className='trade-item__hd'>
                <View className='time lineone'>{ti('8116735b.968975', [info.create_date])}</View>
                <View className='time linetwo'>
                  {info.type == '1' && (
                    <View>
                      <Text className='iconfont icon-globe'></Text>
                      <Text>{$t('8116735b.a4883a')}</Text>
                    </View>
                  )}
                  <Text className='trade-item__shop'>{ti('8116735b.44263f', [info.tid])}</Text>
                </View>
              </View>
            </View>
          ))}
        <View className='trade-item__bd' onClick={onClick}>
          {info &&
            info.order &&
            info.order.map((item, idx) => (
              <SpOrderItem
                // isShowNational={isShowNational}
                key={`${idx}1`}
                info={item}
                payType={payType}
                isPointitemGood={info.order_class === 'pointsmall'}
                isShowPointTag={info.order_class === 'pointsmall'}
              />
            ))}
          {this.props.customRender ? this.props.customRender : this.computeTotalPrice()}
        </View>
        {customFooter && <View className='trade-item__ft'>{this.props.renderFooter}</View>}
        {!customFooter && info.status === 'WAIT_BUYER_PAY' && (
          <View className='trade-item__ft'>
            <View className='trade-item__ft-actions'></View>
            <View className='trade-item__ft-bd'>
              <Text className='trade-item__status'>{info.status_desc}</Text>
              {(info.order_status_des === 'PAYED' || info.order_status_des === 'NOTPAY') &&
              !info.is_logistics &&
              info.can_apply_cancel != 0 &&
              (info.receipt_type !== 'dada' || (info.dada && info.dada.dada_status === 0)) ? (
                <Button
                  className='btn-action'
                  style={`box-shadow: 0 0 0 1PX ${colors.data[0].primary}; color: ${colors.data[0].primary}`}
                  onClick={this.handleClickBtn.bind(this, 'cancel')}
                >
                  {$t('8116735b.b21b5e')}
                </Button>
              ) : null}
              <Button
                className='btn-action'
                style={`background: ${colors.data[0].primary}`}
                onClick={this.handleClickBtn.bind(this, 'pay')}
              >
                {$t('16726e8e.747349')}
              </Button>
            </View>
          </View>
        )}
        {!customFooter && info.status === 'WAIT_SELLER_SEND_GOODS' && (
          <View className='trade-item__ft'>
            <View className='trade-item__ft-actions'></View>
            <View className='trade-item__ft-bd'>
              <Text className='trade-item__status'>{info.status_desc}</Text>
              {(info.order_status_des === 'PAYED' || info.order_status_des === 'NOTPAY') &&
              info.can_apply_cancel != 0 &&
              !info.is_logistics &&
              (info.receipt_type !== 'dada' || (info.dada && info.dada.dada_status === 0)) ? (
                <Button
                  className='btn-action'
                  style={`box-shadow: 0 0 0 1PX ${colors.data[0].primary}; color: ${colors.data[0].primary}`}
                  onClick={this.handleClickBtn.bind(this, 'cancel')}
                >
                  {$t('8116735b.b21b5e')}
                </Button>
              ) : null}
              {info.pay_status === 'PAYED' &&
                info.delivery_status != 'PENDING' &&
                info.receipt_type !== 'dada' && (
                  <Button
                    className='btn-action'
                    style={`box-shadow: 0 0 0 1PX ${colors.data[0].primary}; color: ${colors.data[0].primary}`}
                    onClick={this.handleClickBtn.bind(this, 'delivery')}
                  >
                    {$t('523123e1.edf4b2')}
                  </Button>
                )}
              <Button
                className='btn-action'
                style={`background: ${colors.data[0].primary}`}
                onClick={this.handleClickBtn.bind(this, 'detail')}
              >
                {$t('8116735b.8054f7')}
              </Button>
              {/* {
              info.delivery_status === 'DONE' && info.status === 'WAIT_BUYER_CONFIRM_GOODS' && <Button
                className='btn-action'
                style={`box-shadow: 0 0 0 1PX ${colors.data[0].primary}; color: ${colors.data[0].primary}`}
                onClick={this.handleClickBtn.bind(this, 'confirm')}
              >确认收货</Button>
            } */}
            </View>
          </View>
        )}
        {!customFooter && info.status === 'TRADE_CLOSED' && (
          <View className='trade-item__ft'>
            <View className='trade-item__ft-actions'></View>
            <View className='trade-item__ft-bd'>
              <Text className='trade-item__status'>{info.status_desc}</Text>
              <Button
                className='btn-action'
                style={`background: ${colors.data[0].primary}`}
                onClick={this.handleClickBtn.bind(this, 'detail')}
              >
                {$t('8116735b.8054f7')}
              </Button>
            </View>
          </View>
        )}
        {!customFooter && info.status === 'WAIT_BUYER_CONFIRM_GOODS' && (
          <View className='trade-item__ft'>
            <View className='trade-item__ft-actions'>
              {/* <Text
              className='trade-item__acts'
              onClick={this.props.onActionBtnClick.bind(this)}
            >更多</Text> */}
              {info.receipt_type !== 'dada' && (
                <View
                  className={classNames('trade-item__dropdown', {
                    'is-active': showActions
                  })}
                >
                  <Text
                    className='trade-item__dropdown-item'
                    onClick={this.props.onActionClick.bind(this, 'confirm-receive')}
                  >
                    {$t('8116735b.775b01')}
                  </Text>
                  <Text
                    className='trade-item__dropdown-item'
                    onClick={this.props.onActionClick.bind(this, 'view-express')}
                  >
                    {$t('523123e1.edf4b2')}
                  </Text>
                </View>
              )}
            </View>
            <View className='trade-item__ft-bd'>
              <Text className='trade-item__status'>{info.status_desc}</Text>
              {info.receipt_type !== 'dada' && (
                <Button
                  className='btn-action'
                  style={`box-shadow: 0 0 0 1PX ${colors.data[0].primary}; color: ${colors.data[0].primary}`}
                  onClick={this.handleClickBtn.bind(this, 'delivery')}
                >
                  {$t('523123e1.edf4b2')}
                </Button>
              )}
              {info.receipt_type !== 'dada' && (
                <Button
                  className='btn-action'
                  style={`box-shadow: 0 0 0 1PX ${colors.data[0].primary}; color: ${colors.data[0].primary}`}
                  onClick={this.handleClickBtn.bind(this, 'confirm')}
                >
                  {$t('8116735b.775b01')}
                </Button>
              )}
              <Button
                className='btn-action'
                style={`background: ${colors.data[0].primary}`}
                onClick={this.handleClickBtn.bind(this, 'detail')}
              >
                {$t('8116735b.8054f7')}
              </Button>
            </View>
          </View>
        )}
        {!customFooter && info.status === 'TRADE_SUCCESS' && (
          <View className='trade-item__ft'>
            <View className='trade-item__ft-actions'>
              {/*<Text
              className='trade-item__acts'
              onClick={this.props.onActionBtnClick.bind(this)}
            >更多</Text>*/}
              <View
                className={classNames('trade-item__dropdown', {
                  'is-active': showActions
                })}
              >
                {/*<Text className='trade-item__dropdown-item' onClick={this.props.onActionClick.bind(this, 'rate')}>评价|晒单</Text>*/}
                <Text
                  className='trade-item__dropdown-item'
                  onClick={this.props.onActionClick.bind(this, 'rebuy')}
                >
                  {$t('8116735b.a0dc1f')}
                </Text>
              </View>
            </View>
            <View className='trade-item__ft-bd'>
              <Text className='trade-item__status'>{info.status_desc}</Text>
              {rateStatus && info.is_rate == 0 ? (
                <Button
                  className='btn-action'
                  style={`box-shadow: 0 0 0 1PX ${colors.data[0].primary}; color: ${colors.data[0].primary}`}
                  onClick={this.handleClickBtn.bind(this, 'rate')}
                >
                  {$t('8116735b.606120')}
                </Button>
              ) : null}
              {info.receipt_type === 'logistics' && (
                <Button
                  className='btn-action'
                  style={`box-shadow: 0 0 0 1PX ${colors.data[0].primary}; color: ${colors.data[0].primary}`}
                  onClick={this.handleClickBtn.bind(this, 'delivery')}
                >
                  {$t('523123e1.edf4b2')}
                </Button>
              )}
              <Button
                className='btn-action'
                style={`background: ${colors.data[0].primary}`}
                onClick={this.handleClickBtn.bind(this, 'detail')}
              >
                {$t('8116735b.8054f7')}
              </Button>
            </View>
          </View>
        )}
        {/* {!customFooter && info.status === 'WAIT_RATE' && <View className='trade-item__ft'>
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
              onClick={this.handleClickBtn.bind(this, 'detail')}
            >订单详情</AtButton>
          </View>
        </View>} */}
      </View>
    )
  }
}
