/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { classNames, formatPriceToHundred } from '@/utils'
import { SpOrderItem } from '@/components'
import { SpNewShopItem } from '@/subpages/components'
import { $t, ti } from '@/i18n'
import './new-item.scss'

class TradeItem extends Component {
  static defaultProps = {
    customFooter: false,
    customRender: false,
    noHeader: false,
    showActions: false,
    isShowNational: false,
    payType: '',
    info: {},
    rateStatus: false,
    isShowDistributorInfo: true,
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
      payType,
      pointName
    } = this.props

    if (order_class === 'pointsmall') {
      if (freight_type === 'point' || (freight_type === 'cash' && freight_fee == 0)) {
        total = ti('25cdfeed.4f84c7', [point, pointName])
      } else if (freight_type === 'cash' && freight_fee != 0) {
        total = ti('25cdfeed.dbd078', [point, pointName, formatPriceToHundred(freight_fee)])
      }
    } else {
      if (payType === 'dhpoint') {
        total = ti('25cdfeed.3cddae', [total_fee, pointName])
      } else {
        total = ti('25cdfeed.0293e1', [payment])
      }
    }
    return (
      <View className={`trade-item__total ${receipt_type === 'dada' && 'dadaTotal'}`}>
        {receipt_type === 'dada' && (
          <View className='dada'>
            <Text className='iconfont icon-peisongxiangguan'></Text>
            {$t('250b375e.2c785f')}
          </View>
        )}
        {total}
      </View>
    )
  }

  render() {
    const {
      customFooter,
      onClick,
      info = {},
      payType,
      showActions,
      colors,
      rateStatus,
      isShowDistributorInfo
    } = this.props

    if (!info) {
      return null
    }
    //info.create_date
    //订单号 info.tid
    return (
      <View className='trade-item'>
        {isShowDistributorInfo && (
          <View className='trade-item__dist'>
            <SpNewShopItem inOrderList info={info.distributor_info} canJump />
          </View>
        )}
        <View className='trade-item__msg'>
          <View className='item lineone'>{ti('12f07f54.78f59a', [info.tid])}</View>
          <View className='item linetwo'>{ti('12f07f54.8bf28c', [info.create_date])}</View>
        </View>
        <View className='trade-item__bd' onClick={onClick}>
          {info &&
            info.order &&
            info.order.map((item, idx) => (
              <SpOrderItem
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
                  {$t('2715dbf7.b21b5e')}
                </Button>
              ) : null}
              <Button
                className='btn-action'
                style={`background: ${colors.data[0].primary}`}
                onClick={this.handleClickBtn.bind(this, 'pay')}
              >
                {$t('2715dbf7.747349')}
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
                  {$t('2715dbf7.b21b5e')}
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
                    {$t('64c107ec.edf4b2')}
                  </Button>
                )}
              <Button
                className='btn-action'
                style={`background: ${colors.data[0].primary}`}
                onClick={this.handleClickBtn.bind(this, 'detail')}
              >
                {$t('2715dbf7.8054f7')}
              </Button>
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
                {$t('2715dbf7.8054f7')}
              </Button>
            </View>
          </View>
        )}
        {!customFooter && info.status === 'WAIT_BUYER_CONFIRM_GOODS' && (
          <View className='trade-item__ft'>
            <View className='trade-item__ft-actions'>
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
                    {$t('2715dbf7.775b01')}
                  </Text>
                  <Text
                    className='trade-item__dropdown-item'
                    onClick={this.props.onActionClick.bind(this, 'view-express')}
                  >
                    {$t('64c107ec.edf4b2')}
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
                  {$t('64c107ec.edf4b2')}
                </Button>
              )}
              {info.receipt_type !== 'dada' && (
                <Button
                  className='btn-action'
                  style={`box-shadow: 0 0 0 1PX ${colors.data[0].primary}; color: ${colors.data[0].primary}`}
                  onClick={this.handleClickBtn.bind(this, 'confirm')}
                >
                  {$t('2715dbf7.775b01')}
                </Button>
              )}
              <Button
                className='btn-action'
                style={`background: ${colors.data[0].primary}`}
                onClick={this.handleClickBtn.bind(this, 'detail')}
              >
                {$t('2715dbf7.8054f7')}
              </Button>
            </View>
          </View>
        )}
        {!customFooter && info.status === 'TRADE_SUCCESS' && (
          <View className='trade-item__ft'>
            <View className='trade-item__ft-actions'>
              <View
                className={classNames('trade-item__dropdown', {
                  'is-active': showActions
                })}
              >
                <Text
                  className='trade-item__dropdown-item'
                  onClick={this.props.onActionClick.bind(this, 'rebuy')}
                >
                  {$t('25cdfeed.a0dc1f')}
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
                  {$t('2715dbf7.606120')}
                </Button>
              ) : null}
              {info.receipt_type === 'logistics' && (
                <Button
                  className='btn-action'
                  style={`box-shadow: 0 0 0 1PX ${colors.data[0].primary}; color: ${colors.data[0].primary}`}
                  onClick={this.handleClickBtn.bind(this, 'delivery')}
                >
                  {$t('64c107ec.edf4b2')}
                </Button>
              )}
              <Button
                className='btn-action'
                style={`background: ${colors.data[0].primary}`}
                onClick={this.handleClickBtn.bind(this, 'detail')}
              >
                {$t('2715dbf7.8054f7')}
              </Button>
            </View>
          </View>
        )}
      </View>
    )
  }
}

export default connect(({ colors, sys }) => ({
  colors: colors.current,
  pointName: sys.pointName
}))(withTranslation()(TradeItem))
