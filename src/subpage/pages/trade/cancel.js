/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpCell, SpToast, SpPage } from '@/components'
import { connect } from 'react-redux'
import S from '@/spx'
import api from '@/api'
import { AtTag, AtTextarea } from 'taro-ui'
import { Tracker } from '@/service'
import { dealTextAreaValue } from '@/utils/platform'
import { $t } from '@/i18n'
import './cancel.scss'

const TEXTCOUNT = 255
/** i18n keys for display; API still expects Chinese cancel_reason */
const CANCEL_REASON_KEYS = [
  '3f0cc347.d5505c',
  '3f0cc347.78d83c',
  '3f0cc347.bea53b',
  '3f0cc347.0d98c7'
]
const CANCEL_REASON_API = ['多买/错买', '不想要了', '买多了', '其他']

class TradeCancel extends Component {
  $instance = getCurrentInstance() || {}

  constructor(props) {
    super(props)
    this.state = {
      reason: CANCEL_REASON_KEYS,
      curReasonIdx: 0,
      otherReason: ''
    }
  }

  handleClickTag = (data) => {
    const idx = this.state.reason.indexOf(data.name)
    if (idx >= 0) {
      this.setState({
        curReasonIdx: idx
      })
    }
  }

  handleTextChange = (...args) => {
    this.setState({
      otherReason: dealTextAreaValue(...args)
    })
  }

  handleSubmit = async () => {
    const { curReasonIdx, otherReason } = this.state
    if (curReasonIdx === 3 && !otherReason) {
      return S?.toast($t('3f0cc347.52c345'))
    }

    const { order_id } = this.$instance?.router?.params
    const data = {
      order_id,
      cancel_reason: CANCEL_REASON_API[curReasonIdx],
      other_reason: otherReason
    }

    const res = await api.trade.cancel(data)

    const { orderInfo } = await api.trade.detail(order_id)
    // 取消订单埋点
    Tracker.dispatch('CANCEL_ORDER', {
      orderInfo,
      orderCancel: res,
      orderTime: orderInfo.create_time
    })
    if (res) {
      S?.toast($t('3f0cc347.33130f'))
      Taro.navigateBack()
    }
  }

  render() {
    const { reason, curReasonIdx, otherReason } = this.state
    const { colors } = this.props
    console.log('==otherReason==', otherReason)

    return (
      <SpPage className='page-trade-cancel'>
        <View className='sec'>
          <SpCell title={$t('3f0cc347.a59c52')}>
            {reason.map((item, idx) => {
              return (
                <AtTag
                  className='cancel-reason'
                  key={item}
                  active={idx === curReasonIdx}
                  name={item}
                  onClick={this.handleClickTag}
                >
                  {$t(item)}
                </AtTag>
              )
            })}
          </SpCell>
          {curReasonIdx === 3 && (
            <SpCell title={$t('3f0cc347.05addf')}>
              <AtTextarea
                value={otherReason}
                onChange={this.handleTextChange}
                maxLength={TEXTCOUNT}
                placeholder={$t('3f0cc347.4c6139')}
              ></AtTextarea>
            </SpCell>
          )}
        </View>

        <View className='trade-cancel-footer'>
          <View
            onClick={this.handleSubmit}
            className='toolbar_btn'
            style={`background: ${colors.data[0].primary}`}
          >
            {$t('3f0cc347.98cb95')}
          </View>
        </View>

        <SpToast />
      </SpPage>
    )
  }
}

export default connect(({ colors }) => ({
  colors: colors.current
}))(withTranslation()(TradeCancel))
