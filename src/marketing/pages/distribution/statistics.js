import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Navigator, Button } from '@tarojs/components'
import api from '@/api'
import { pickBy } from '@/utils'

import './statistics.scss'

export default class DistributionStatistics extends Component {
  constructor (props) {
    super(props)
    this.state = {
      info: {}
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch() {
    const res = await api.distribution.statistics()
    const info = pickBy(res, {
      payedRebate: 'payedRebate',
      rebateTotal: 'rebateTotal',
      cashWithdrawalRebate: 'cashWithdrawalRebate',
      limit_time: 'limit_time',
      orderRebate: 'orderRebate',
      orderTeamRebate: 'orderTeamRebate',
      orderCloseRebate: 'orderCloseRebate',
      orderNoCloseRebate: 'orderNoCloseRebate',
      orderTeamCloseRebate: 'orderTeamCloseRebate',
      orderTeamNoCloseRebate: 'orderTeamNoCloseRebate'
    })

    this.setState({
      info
    })
  }

  render () {
    const { info } = this.state

    return (
      <View className="page-distribution-statistics">
        <View className="header content-padded-b">
          <View className="header-top">
            <View className="view-flex view-flex-justify">
              <View>累计提取金额：{info.payedRebate/100}元</View>
              <Navigator url="/marketing/pages/distribution/withdrawals-record" className="record-btn">提现记录 <text className="icons icons-gengduo"></text></Navigator>
            </View>
            <View className="view-flex  view-flex-vertical view-flex-middle view-flex-center">
              <Navigator className="cash-btn" url="/marketing/pages/distribution/withdraw">申请提现</Navigator>
            </View>
          </View>
          <View className="header-bottom view-flex">
            <View className="view-flex-item view-flex view-flex-vertical view-flex-middle view-flex-center with-border">
              <View className="assets-label">推广费总额</View>
              <View>¥ {info.rebateTotal/100}</View>
            </View>
            <View className="view-flex-item view-flex view-flex-vertical view-flex-middle view-flex-center">
              <View className="assets-label">可提取现金</View>
              <View>¥ {info.cashWithdrawalRebate/100}</View>
            </View>
          </View>
        </View>
        <View>
          <View className="content-padded">
            <View className="tips">
              提成和津贴订单需要确认收货
              {
                info.limit_time > 0
                && <Text>{info.limit_time}天</Text>
              }
              后方可提取推广费
            </View>
          </View>
          <View className="section section-card analysis">
            <View className="content-padded-b">
              <View>
                <View className="data-label">提成</View>
                <View className="data-amount">{info.orderRebate/100}</View>
              </View>
              <View className="view-flex">
                <View className="view-flex-item">
                  <View className="data-label">未确认</View>
                  <View className="data-count">{info.orderNoCloseRebate/100}</View>
                </View>
                <View className="view-flex-item">
                  <View className="data-label">已确认</View>
                  <View className="data-count">{info.orderCloseRebate/100}</View>
                </View>
              </View>
            </View>
          </View>
          <View className="section section-card analysis">
            <View className="content-padded-b">
              <View>
                <View className="data-label">津贴</View>
                <View className="data-amount">{info.orderTeamRebate/100}</View>
              </View>
              <View className="view-flex">
                <View className="view-flex-item">
                  <View className="data-label">未确认</View>
                  <View className="data-count">{info.orderTeamNoCloseRebate/100}</View>
                </View>
                <View className="view-flex-item">
                  <View className="data-label">已确认</View>
                  <View className="data-count">{info.orderTeamCloseRebate/100}</View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
