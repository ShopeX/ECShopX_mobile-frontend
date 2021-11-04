import Taro, { Component } from '@tarojs/taro'
import { View, Text, Navigator } from '@tarojs/components'
import api from '@/api'
import { NavBar } from '@/components'

import './point-platform.scss'

export default class PointPlatform extends Component {
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
    const res = await api.distribution.getPointInfo()
    this.setState({
      info:res
    })
  }

  render () {
    const { info } = this.state
    console.log(info);
    return (
      <View className="page-distribution-statistics">
        <NavBar
          title='推广费'
          leftIconType='chevron-left'
        />                
        <View className="header content-padded-b">
          <View className="header-top">
            <View className="view-flex view-flex-justify">
              <View>累计获得积分：{info.grand_point_total}积分</View>
              {/* <Navigator url="/marketing/pages/distribution/withdrawals-record" className="record-btn">提现记录 <text className="icons icons-gengduo"></text></Navigator> */}
            </View>
            {/* <View className="view-flex  view-flex-vertical view-flex-middle view-flex-center">
              <Navigator className="cash-btn" url="/marketing/pages/distribution/withdraw">申请提现</Navigator>
            </View> */}
          </View>
          <View className="header-bottom view-flex">
            <View className="view-flex-item view-flex view-flex-vertical view-flex-middle view-flex-center  with-border">
              <View className="assets-label">推广积分总额</View>
              <View>{info.point_total}积分</View>
            </View>
            <View className="view-flex-item view-flex view-flex-vertical view-flex-middle view-flex-center">
              {/* <View className="assets-label">可提取现金</View>
              <View>¥ {info.cashWithdrawalRebate/100}</View> */}
            </View>
          </View>
        </View>
        <View>
          <View className="content-padded">
            <View className="tips">
              提成和津贴订单需要确认收货1天后方可提取推广积分
            </View>
          </View>
          <View className="section section-card analysis">
            <View className="content-padded-b">
              <View>
                <View className="data-label">提成</View>
                <View className="data-amount">{info.order_total}</View>
              </View>
              <View className="view-flex">
                <View className="view-flex-item">
                  <View className="data-label">未确认</View>
                  <View className="data-count">{info.order_no_close_rebate}</View>
                </View>
                <View className="view-flex-item">
                  <View className="data-label">已确认</View>
                  <View className="data-count">{info.order_close_rebate}</View>
                </View>
              </View>
            </View>
          </View>
          <View className="section section-card analysis">
            <View className="content-padded-b">
              <View>
                <View className="data-label">津贴</View>
                <View className="data-amount">{info.order_team_total}</View>
              </View>
              <View className="view-flex">
                <View className="view-flex-item">
                  <View className="data-label">未确认</View>
                  <View className="data-count">{info.order_team_no_close_rebate}</View>
                </View>
                <View className="view-flex-item">
                  <View className="data-label">已确认</View>
                  <View className="data-count">{info.order_team_close_rebate}</View>
                </View>
              </View>
            </View>
          </View>
          {/* <View className="section section-card analysis">
            <View className="content-padded-b">
              <View>
                <View className="data-label">小店提成</View>
                <View className="data-amount">{info.rebate_point}</View>
              </View>
            </View>
          </View> */}
        </View>
      </View>
    )
  }
}
