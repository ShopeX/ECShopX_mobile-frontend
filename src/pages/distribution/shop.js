import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Image, Navigator, Button } from '@tarojs/components'
import { AtDrawer } from 'taro-ui'
import api from '@/api'
import { classNames, pickBy } from '@/utils'

import './shop.scss'

export default class DistributionShop extends Component {
  static config = {
    navigationBarTitleText: '我的小店'
  }

  constructor (props) {
    super(props)

    this.state = {
      info: {}
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
    const { turnover } = this.$router.params
    console.log(this.$router)
    const { userId } = Taro.getStorageSync('userinfo')
    const distributionShopId = Taro.getStorageSync('distribution_shop_id')
    const param = distributionShopId ? {
      user_id: distributionShopId
    } : {
      user_id: userId
    }

    const res = await api.distribution.info(param || null)
    const {shop_name, brief, shop_pic, username, headimgurl } = res

    this.setState({
      info: {
        username,
        headimgurl,
        shop_name,
        brief,
        shop_pic,
        turnover
      }
    })
  }

  handleClick (key) {
    let url = ''
    switch (key) {
      case 'achievement':
        url = '/pages/distribution/shop-achievement'
        break;
      case 'goods':
        url = '/pages/distribution/shop-goods'
        break;
      case 'trade':
        url = '/pages/distribution/shop-trade'
        break;
      default:
        url = ''
    }
    Taro.navigateTo({
      url: url
    })
  }

  onShareAppMessage () {
    const { username, userId } = Taro.getStorageSync('userinfo')
    const { info } = this.state

    return {
      title: info.shop_name || `${username}的小店`,
      imageUrl: info.shop_pic,
      path: `/pages/distribution/shop-home?uid=${userId}`
    }
  }

  render () {
    const { info } = this.state

    return (
      <View className="page-distribution-shop">
        <View className="shop-banner">
          <View className="shop-info">
            <Image
              className='shopkeeper-avatar'
              src={info.headimgurl}
              mode='aspectFill'
            />
            <View>
              <View className='shop-name'>{info.shop_name || `${info.username}的小店(未设置名称)`}</View>
              <View className='shop-desc'>{info.brief || '店主很懒什么都没留下'}</View>
            </View>
          </View>
          <Navigator className="shop-setting" url="/pages/distribution/shop-setting">
            <Text class="icon-setting"></Text>
          </Navigator>
        </View>
        <View>
          <Image
            className='banner-img'
            src={info.shop_pic}
            mode='widthFix'
          />
        </View>
        <View className='section content-center'>
          <View className='content-padded-b shop-achievement'>
            <View className='achievement-label'>小店营业额</View>
            <View className='achievement-amount'><Text className='amount-cur'>¥</Text> {info.turnover}</View>
          </View>
        </View>
        <View className='grid two-in-row'>
          <View className='grid-item shop-nav-item' onClick={this.handleClick.bind(this, 'achievement')}>
            <View className='icon-chart'></View>
            <View>我的业绩</View>
          </View>
          <View className='grid-item shop-nav-item' onClick={this.handleClick.bind(this, 'goods')}>
            <View className='icon-errorList'></View>
            <View>任务商品</View>
          </View>
          <View className='grid-item shop-nav-item' onClick={this.handleClick.bind(this, 'trade')}>
            <View className='icon-list1'></View>
            <View>小店订单</View>
          </View>
          <Button openType='share' className='grid-item shop-nav-item'>
            <View className='icon-share2'></View>
            <View>分享小店</View>
          </Button>
        </View>
      </View>
    )
  }
}
