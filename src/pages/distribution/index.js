import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Navigator, Button } from '@tarojs/components'
import api from '@/api'
import { pickBy } from '@/utils'

import './index.scss'

export default class DistributionDashboard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      info: {}
    }
  }

  componentDidMount () {
    Taro.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#2f3030'
    })
    this.fetch()
  }

  onShareAppMessage () {
    const { info } = this.state

    return {
      title: info.item_name,
      path: `/pages/item/espier-detail?id=${info.item_id}`
    }
  }


  async fetch() {
    const resUser = Taro.getStorageSync('userinfo')
    const { username, avatar } = resUser

    const res = await api.distribution.dashboard()
    const base = pickBy(res, {
      itemTotalPrice: 'itemTotalPrice',
      cashWithdrawalRebate: 'cashWithdrawalRebate',
      promoter_order_count: 'promoter_order_count',
      promoter_grade_order_count: 'promoter_grade_order_count',
      rebateTotal: 'rebateTotal',
      isbuy_promoter: 'isbuy_promoter',
      notbuy_promoter: 'notbuy_promoter'
    })

    const promoter = await api.distribution.info()
    const pInfo = pickBy(promoter, {
      shop_name: 'shop_name',
      is_open_promoter_grade: 'is_open_promoter_grade',
      promoter_grade_name: 'promoter_grade_name'
    })

    const info = {username, avatar, ...base, ...pInfo}

    this.setState({
      info
    })
  }

  render () {
    const { info } = this.state

    return (
      <View class="page-distribution-index">
        <View className="header view-flex view-flex-middle">
          <Image className="header-avatar"
            src={info.avatar}
            mode="aspectFill"
          />
          <View className="header-info view-flex-item">
            <View className="mcode">昵称：{info.username}
              {
                info.is_open_promoter_grade &&
                <Text>（{info.promoter_grade_name}）</Text>
              }
            </View>
            {
              info.shop_name &&
              <View className="nickname">{info.shop_name}</View>
            }
          </View>
          <Navigator className="view-flex view-flex-middle" url="/pages/distribution/setting">
            <View className="member-acount">账户管理</View>
            <View className="icon-arrowRight"></View>
          </Navigator>
        </View>
        <View className="section achievement">
          <View className="section-body view-flex">
            <View className="view-flex-item content-center">
              <View className="amount"><Text className="count">{info.itemTotalPrice/100}</Text>元</View>
              <View>营业额</View>
            </View>
            <View className="view-flex-item content-center">
              <View className="amount"><Text className="count">{info.cashWithdrawalRebate/100}</Text>元</View>
              <View>可提现</View>
            </View>
          </View>
        </View>
        <View className="section analysis">
          <View className="section-body view-flex content-center">
            <Navigator className="view-flex-item" hover-class="none" url="/pages/distribution/trade?type=order">
              <View className="icon-list3"></View>
              <View className="label">提成订单</View>
              <View>{info.promoter_order_count}</View>
            </Navigator>
            <Navigator className="view-flex-item" hover-class="none" url="/pages/distribution/trade?type=order_team">
              <View className="icon-list2"></View>
              <View className="label">津贴订单</View>
              <View>{info.promoter_grade_order_count}</View>
            </Navigator>
            <Navigator className="view-flex-item" hover-class="none" url="/pages/distribution/statistics">
              <View className="icon-money"></View>
              <View className="label">推广费</View>
              <View className="mark">{info.rebateTotal/100}</View>
            </Navigator>
          </View>
        </View>
        <View className="section">
          <Navigator
            className="section-title with-border view-flex view-flex-middle"
            url={`/pages/distribution/subordinate?hasBuy=${info.isbuy_promoter}&noBuy=${info.notbuy_promoter}`}
          >
            <View className="view-flex-item">我的会员</View>
            <View className="section-more icon-arrowRight"></View>
          </Navigator>
          <View className="content-padded-b view-flex content-center member">
            <View className="view-flex-item">已购买会员 <Text className="mark">{info.isbuy_promoter}</Text> 人</View>
            <View className="view-flex-item">未购买会员 <Text className="mark">{info.notbuy_promoter}</Text> 人</View>
          </View>
        </View>
        <View className="section list share">
          <Navigator className="list-item" open-type="navigateTo" url="/pages/distribution/invite_friends">
            <View className="item-icon icon-qrcode1"></View>
            <View className="list-item-txt">我的二维码</View>
            <View className="icon-arrowRight item-icon-go"></View>
          </Navigator>
          <Navigator className="list-item" open-type="navigateTo" url="/pages/distribution/shop">
            <View className="item-icon icon-shop"></View>
            <View className="list-item-txt">我的小店</View>
            <View className="icon-arrowRight item-icon-go"></View>
          </Navigator>
          <Button className="share-btn list-item" open-type="share">
            <View className="item-icon icon-share1"></View>
            <View className="list-item-txt">分享给好友</View>
            <View className="icon-arrowRight item-icon-go"></View>
          </Button>
        </View>
      </View>
    )
  }
}
