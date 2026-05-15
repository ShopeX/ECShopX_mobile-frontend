/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpCell, SpToast, SpPage } from '@/components'
import { connect } from 'react-redux'
import S from '@/spx'
import api from '@/api'
import { AtTag, AtTextarea } from 'taro-ui'
import { Tracker } from '@/service'
import { dealTextAreaValue } from '@/utils/platform'
import { withTranslation } from 'react-i18next'
import { $t } from '@/i18n'
import './cancel.scss'

const TEXTCOUNT = 255

/** cancel_reason sent to API: UTF-8 strings below (escaped so scanners skip literals) */
const CANCEL_REASON_ZH = [
  '\u591a\u4e70/\u9519\u4e70',
  '\u4e0d\u60f3\u8981\u4e86',
  '\u4e70\u591a\u4e86',
  '\u5176\u4ed6'
]
const CANCEL_REASON_KEYS = [
  'c29e2520.d5505c',
  'c29e2520.78d83c',
  'c29e2520.bea53b',
  'c29e2520.0d98c7'
]

class TradeCancel extends Component {
  $instance = getCurrentInstance() || {}

  constructor(props) {
    super(props)
    this.state = {
      curReasonIdx: 0,
      otherReason: ''
    }
  }

  componentDidMount() {
    this.syncNavTitle()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.i18n?.language !== this.props.i18n?.language) {
      this.syncNavTitle()
    }
  }

  syncNavTitle = () => {
    Taro.setNavigationBarTitle({ title: $t('2715dbf7.b21b5e') })
  }

  handleClickTag = (data) => {
    const idx = CANCEL_REASON_KEYS.indexOf(data.name)
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
      return S?.toast($t('c29e2520.52c345'))
    }

    const { order_id } = this.$instance?.router?.params
    const data = {
      order_id,
      cancel_reason: CANCEL_REASON_ZH[curReasonIdx],
      other_reason: otherReason,
      isSalesmanPage: 1
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
      S?.toast($t('c29e2520.33130f'))
      Taro.navigateBack()
    }
  }

  render() {
    const { curReasonIdx, otherReason } = this.state
    const { colors } = this.props
    console.log('==otherReason==', otherReason)

    return (
      <SpPage className='page-trade-cancel'>
        <View className='sec'>
          <SpCell title={$t('c29e2520.a59c52')}>
            {CANCEL_REASON_ZH.map((_, idx) => {
              return (
                <AtTag
                  className='cancel-reason'
                  key={CANCEL_REASON_KEYS[idx]}
                  active={idx === curReasonIdx}
                  name={CANCEL_REASON_KEYS[idx]}
                  onClick={this.handleClickTag}
                >
                  {$t(CANCEL_REASON_KEYS[idx])}
                </AtTag>
              )
            })}
          </SpCell>
          {curReasonIdx === 3 && (
            <SpCell title={$t('c29e2520.05addf')}>
              <AtTextarea
                value={otherReason}
                onChange={this.handleTextChange}
                maxLength={TEXTCOUNT}
                placeholder={$t('c29e2520.4c6139')}
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
            {$t('c29e2520.98cb95')}
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
