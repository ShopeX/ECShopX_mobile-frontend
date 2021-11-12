/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 分享进入详情
 * @FilePath: /unite-vshop/src/groupBy/pages/shareDetail/index.js
 * @Date: 2020-05-09 18:00:27
 * @LastEditors: Arvin
 * @LastEditTime: 2020-07-08 18:39:56
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, ScrollView } from '@tarojs/components'
import api from '@/api'
import BuyerItem from '../../component/buyerItem'
import { formatCountTime } from '../../utils/index'

import './index.scss'

export default class ShareDetail extends Component {
  constructor (props) {
    super(props)
    this.state = {
      // 当前社区
      current: {},
      goodInfo: {
        itemId: '',
        activityId: '',
        deliveryDate: '',
        goodName: '',
        goodDesc: '',
        pics: [],
        price: '0.00',
        activityPrice: '0.00',
        initialSales: 0,
        historyData: [],
        intro: '',
        limitNum: 0,
        leaderName: '',
        address: '',
        symbol: '¥',
        recommendGood: []
      }
    }
  }
  componentDidMount () {
    this.getGoodInfo()
  }

  componentWillUnmount () {
    let { timeId } = this.state
    if (timeId) {
      clearTimeout(timeId)
    }
  }

  config = {
    navigationBarTitleText: '分享详情'
  }

  // 倒计时
  countdown = () => {
    let { countTime, timeId } = this.state
    if (countTime > 0) {
      timeId = setTimeout(() => {
        this.setState(
          {
            countTime: countTime - 1
          },
          () => {
            this.countdown()
          }
        )
      }, 1000)
    } else {
      // 清除倒计时
      timeId = ''
      clearTimeout(timeId)
    }
    this.setState({
      timeId
    })
  }

  // 获取商品详情
  getGoodInfo = () => {
    const { itemId, aid, cid } = this.$router.params
    api.groupBy
      .activityGoodDetail({
        item_id: itemId,
        activity_id: aid,
        community_id: cid
      })
      .then(async (res) => {
        const { item, activity, history_data, community, cur } = res
        const userInfo = Taro.getStorageSync('userinfo') || {}
        let activity_price = activity.item.activity_price
        const vipPrice = activity.item.vip_price
        const svippPrice = activity.item.svip_price
        if (userInfo.vip === 'vip' && vipPrice !== 0) {
          activity_price = activity.item.vip_price
        }
        if (userInfo.vip === 'svip' && svippPrice !== 0) {
          activity_price = activity.item.svip_price
        }
        this.setState(
          {
            current: community,
            goodInfo: {
              itemId: item.item_id,
              activityId: activity.activity_id,
              pics: item.pics,
              goodDesc: item.brief,
              goodName: item.itemName,
              limitNum: activity.item.limit_num,
              price: (item.price / 100).toFixed(2),
              initialSales: activity.item.initial_sales,
              deliveryDate: activity.delivery_date,
              historyData: history_data,
              salesStore: activity.item.sales_store,
              activityPrice: (activity_price / 100).toFixed(2),
              intro: item.intro,
              leaderName: community.leader_name,
              address: community.address,
              symbol: cur.symbol,
              recommendGood: []
            },
            countTime: activity.last_second
          },
          () => {
            this.countdown()
          }
        )
      })
  }

  // 立即抢购
  buy = () => {
    const { itemId, aid, cid } = this.$router.params
    Taro.redirectTo({
      url: `/groupBy/pages/goodDetail/index?itemId=${itemId}&activeId=${aid}&cid=${cid}`
    })
  }

  render () {
    const { goodInfo, countTime, current } = this.state

    return (
      <View className='shareDetail'>
        <View className='shareHeader'>
          <View className='addressInfo'>
            <View className='community'>{current.community_name}</View>
            <View className='address'>取货：{current.address}</View>
          </View>
          <View className='goodInfo'>
            <Image className='goodImg' src={goodInfo.pics[0]} />
            {/* 倒计时 */}
            <View className='timeDown'>
              <Text className='title'>仅剩仅剩{formatCountTime(countTime)}</Text>
            </View>
            {/* 详情 */}
            <View className='info'>
              {/* 商品名称 */}
              <View className='goodName'>
                <View className='name'>{goodInfo.goodName}</View>
                <View className='saled'>已售: {goodInfo.salesStore}</View>
              </View>
              {/* 商品说明 */}
              <View className='desc'>{goodInfo.goodDesc}</View>
              {/* 预计送达 */}
              <View className='arrivals'>预计送达：{goodInfo.deliveryDate}</View>
              {/* 标签 */}
              <View className='tag'>会员享受</View>
              {/* 价格 */}
              <View className='price'>
                {goodInfo.symbol}
                <Text className='now'>{goodInfo.activityPrice}</Text>
                <Text className='old'>{goodInfo.price}</Text>
              </View>
            </View>
            <View className='buyBtn' onClick={this.buy.bind(this)}>
              立即抢购
            </View>
          </View>
        </View>
        {/* 推荐商品 */}
        {goodInfo.recommendGood.length > 0 && (
          <View className='recommend'>
            <View className='recommendTitle'>推荐商品</View>
            <ScrollView scrollX className='recommendGood'>
              {[0, 1, 2, 3, 4].map((item) => (
                <View className='goodItem' key={item}>
                  <Image
                    className='goodImg'
                    src='https://img12.360buyimg.com/n7/jfs/t25312/134/1983666171/147642/a17b1b62/5bc19e2eNf9565de8.jpg'
                  />
                  <View className='goodName'>
                    <View className='name'>推荐商品名称推荐商品名称推荐商品名称</View>
                    <View className='price'>
                      券后价
                      <Text className='text'>10.00元</Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
        {/* 当前购买人数 */}
        <View className='buyNumNow'>
          <View className='buyNum'>当前购买人数</View>
          <View className='num'>{goodInfo.initialSales}人</View>
        </View>
        {goodInfo.historyData.map((item) => (
          <BuyerItem key={item} />
        ))}
      </View>
    )
  }
}
