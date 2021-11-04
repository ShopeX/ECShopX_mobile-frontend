import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Navigator, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import api from '@/api'
import { Tracker } from "@/service"

import './shop.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))

export default class DistributionShop extends Component {
  constructor(props) {
    super(props)

    this.state = {
      info: {}
    }
  }

  componentDidMount() {
    this.fetch()
  }

  config = {
    navigationBarTitleText: '我的小店'
  }

  async fetch() {
    const { turnover,point } = this.$router.params;
    const { userId } = Taro.getStorageSync('userinfo')
    const param = {
      user_id: userId
    }

    const res = await api.distribution.info(param || null)
    const {
      shop_name,
      brief,
      shop_pic,
      username = '',
      headimgurl,
      nickname = '',
      mobile = '',
      share_title = '',
      applets_share_img = ''
    } = res

    this.setState({
      info: {
        username: nickname || username || mobile,
        headimgurl,
        shop_name,
        brief,
        shop_pic,
        turnover,
        share_title,
        applets_share_img,
        point
      }
    })
  }

  handleClick(key) {
    const { userId } = Taro.getStorageSync('userinfo')
    let url = ''
    switch (key) {
      case 'achievement':
        url = '/marketing/pages/distribution/shop-achievement'
        break;
      case 'goods':
        url = '/marketing/pages/distribution/shop-goods'
        break;
      case 'trade':
        url = '/marketing/pages/distribution/shop-trade'
        break;
      case 'miniShop':
        url = `/marketing/pages/distribution/shop-home?featuredshop=${userId}`
        break;
      default:
        url = ''
    }
    Taro.navigateTo({
      url: url
    })
  }

  onShareAppMessage(res) {  
    const { username, userId } = Taro.getStorageSync('userinfo')
    const { info } = this.state 
    return {
      title: info.share_title || info.shop_name || `${username}的小店`,
      imageUrl: info.applets_share_img || info.shop_pic,
      path: `/marketing/pages/distribution/shop-home?uid=${userId}`
    }
  }
 

  render() {
    const { colors } = this.props
    const { info } = this.state

    return (
      <View className="page-distribution-shop">
        <View className="shop-banner" style={'background: ' + colors.data[0].marketing}>
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
          <Navigator className="shop-setting" url="/marketing/pages/distribution/shop-setting">
            <Text class="icon-settings"></Text>
          </Navigator>
        </View>
        {
          info.shop_pic &&
          <View>
            <Image
              className='banner-img'
              src={info.shop_pic}
              mode='widthFix'
            />
          </View>
        }
        <View className='section content-center'>
          <View className='content-padded-b shop-achievement'>
            <View className='achievement-label'>小店任务返佣额 </View>
            <View className='achievement-amount'><Text className='amount-cur'>¥</Text> {info.turnover / 100}</View>
          </View>
          <View className='content-padded-b shop-achievement'>
            <View className='achievement-label'>小店返佣积分</View>
            <View className='achievement-amount'>{info.point || 0} <Text className='amount-cur'>分</Text> </View>
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
        <View className='preview' onClick={this.handleClick.bind(this, 'miniShop')}>
          <View className='main'>
            <Image
              className='img'
              mode='aspectFill'
              src={require('../../assets/shop.png')}
            />
            <View className='title'>
              预览小店
            </View>
          </View>
        </View>
      </View>
    )
  }
}
