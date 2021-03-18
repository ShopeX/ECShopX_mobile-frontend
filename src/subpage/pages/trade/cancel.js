import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpCell, SpToast, NavBar } from '@/components'
import { connect } from '@tarojs/redux'
import S from '@/spx'
import api from '@/api'
import { AtTag, AtTextarea } from 'taro-ui'
import { Tracker } from "@/service";

import './cancel.scss';

@connect(({ colors }) => ({
  colors: colors.current
}))

export default class TradeCancel extends Component {
  static config = {
    navigationBarTitleText: '取消订单'
  }

  constructor(props) {
    super(props)
    this.state = {
      reason: ['多买/错买', '不想要了', '买多了', '其他'],
      curReasonIdx: 0,
      textCount: 255,
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

  handleTextChange = (e) => {
    const value = e
    this.setState({
      otherReason: value
    })
  }

  handleSubmit = async () => {
    const { curReasonIdx, reason, otherReason } = this.state
    if (curReasonIdx === 3 && !otherReason) {
      return S.toast('请输入其他理由')
    }

    const { order_id } = this.$router.params
    const data = {
      order_id,
      cancel_reason: reason[curReasonIdx],
      other_reason: otherReason
    }

    const res = await api.trade.cancel(data)

    const { orderInfo } = await api.trade.detail(order_id);
    // 取消订单埋点  
    Tracker.dispatch("CANCEL_ORDER", {
      orderInfo,
      orderCancel: res,
      orderTime:orderInfo.create_time
    });
    if (res) {
      S.toast('操作成功')
      Taro.navigateBack()
    }
  }

  render() {
    const { reason, curReasonIdx, otherReason, textCount } = this.state
    const { colors } = this.props

    return (
      <View className='page-trade-cancel'>
        <NavBar
          title='取消订单'
          leftIconType='chevron-left'
          fixed='true'
        />

        <View className='sec'>
          <SpCell title='请选择取消理由'>
            {reason.map((item, idx) => {
              return (
                <AtTag
                  className='cancel-reason'
                  key={item}
                  active={idx === curReasonIdx}
                  name={item}
                  onClick={this.handleClickTag}
                >{item}</AtTag>
              )
            })}
          </SpCell>
          {curReasonIdx === 3 && (
            <SpCell title='其他理由'>
              <AtTextarea
                value={otherReason}
                onChange={this.handleTextChange}
                maxLength={textCount}
                placeholder='请输入您的理由...'
              ></AtTextarea>
            </SpCell>
          )}
        </View>

        <View className='trade-cancel-footer'>
          <View
            onClick={this.handleSubmit}
            className='toolbar_btn'
            style={`background: ${colors.data[0].primary}`}
          >确定取消</View>
        </View>

        <SpToast />
      </View>
    )
  }
}
