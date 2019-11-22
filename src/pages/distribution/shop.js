import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Image, Navigator } from '@tarojs/components'
import { AtDrawer } from 'taro-ui'
import api from '@/api'
import { classNames, pickBy } from '@/utils'

import './shop.scss'

export default class DistributionShop extends Component {
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
        shop_pic
      }
    })
  }

  onShareAppMessage (res) {
    const { userId } = Taro.getStorageSync('userinfo')
    const { info } = res.target.dataset

    return {
      title: info.title,
      imageUrl: info.img,
      path: `/pages/item/espier-detail?id=${info.item_id}&uid=${userId}`
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
              <View className='shop-name'>{info.shop_name || `${info.username}的小店`}</View>
              <View className='shop-desc'>{info.brief || '店主很懒什么都没留下'}</View>
            </View>
          </View>
          <Navigator className="shop-setting" url="/pages/distribution/shop-setting">
            <Text class="icon-setting"></Text>
          </Navigator>
          <Image
            className='banner-img'
            src={info.shop_pic}
            mode='aspectFill'
          />
        </View>
      </View>
    )
  }
}
