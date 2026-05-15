/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Image, Navigator, Button } from '@tarojs/components'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import api from '@/api'
import { SpPage } from '@/components'
import { $t, ti } from '@/i18n'
import { log } from '@/utils'
// import { Tracker } from '@/service'
import './shop.scss'

class DistributionShop extends Component {
  $instance = getCurrentInstance() || {}
  constructor(props) {
    super(props)

    this.state = {
      info: {}
    }
  }

  componentDidMount() {
    this.syncNavTitle()
    this.fetch()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.i18n?.language !== this.props.i18n?.language) {
      this.syncNavTitle()
    }
  }

  syncNavTitle = () => {
    Taro.setNavigationBarTitle({ title: $t('d13c0ad1.c41892') })
  }

  async fetch() {
    const { turnover, point, disabled } = this.$instance?.router?.params
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
        point,
        disabled
      }
    })
  }

  handleClick(key) {
    const { userId } = Taro.getStorageSync('userinfo')
    let url = ''
    switch (key) {
      case 'achievement':
        url = '/subpages/salesman/distribution/shop-achievement'
        break
      case 'goods':
        url = '/subpages/salesman/distribution/shop-goods'
        break
      case 'trade':
        url = '/subpages/salesman/distribution/shop-trade'
        break
      case 'miniShop':
        url = `/subpages/salesman/distribution/shop-home?featuredshop=${userId}`
        break
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
    log.debug(`/subpages/salesman/distribution/shop-home?uid=${userId}`)
    return {
      title: info.share_title || info.shop_name || ti('882f13f0.2b0a44', [username]),
      imageUrl: info.applets_share_img || info.shop_pic,
      path: `/subpages/salesman/distribution/shop-home?uid=${userId}`
    }
  }

  render() {
    const { colors } = this.props
    const { info } = this.state

    return (
      <SpPage className='page-distribution-shop'>
        <View className='shop-banner' style={'background: ' + colors.data[0].marketing}>
          <View className='shop-info'>
            <View className='img-content'>
              <Image className='shopkeeper-avatar' src={info.headimgurl} mode='aspectFill' />
            </View>
            <View>
              <View className='shop-name'>
                {info.shop_name || ti('882f13f0.d5323b', [info.username])}
              </View>
              <View className='shop-desc'>{info.brief || $t('882f13f0.ea2cd0')}</View>
            </View>
          </View>
          <Navigator className='shop-setting' url='/subpages/salesman/distribution/shop-setting'>
            <Text class='iconfont icon-settings'></Text>
          </Navigator>
        </View>
        {info.shop_pic && (
          <View>
            <Image className='banner-img' src={info.shop_pic} mode='widthFix' />
          </View>
        )}
        <View className='section content-center'>
          <View className='content-padded-b shop-achievement'>
            <View className='achievement-label'>{$t('882f13f0.69f826')} </View>
            <View className='achievement-amount'>
              <Text className='amount-cur'>¥</Text> {info.turnover ? info.turnover / 100 : 0}
            </View>
          </View>
          {/* <View className='content-padded-b shop-achievement'>
            <View className='achievement-label'>小店返佣积分</View>
            <View className='achievement-amount'>{info.point || 0} <Text className='amount-cur'>分</Text> </View>
          </View> */}
        </View>
        <View className='shop-block'>
          <View
            className=' shop-nav-item width'
            onClick={this.handleClick.bind(this, 'achievement')}
          >
            <View className='iconfont icon-chart iconsize'></View>
            <View>{$t('882f13f0.074734')}</View>
          </View>
          <View className=' shop-nav-item width' onClick={this.handleClick.bind(this, 'goods')}>
            <View className='iconfont icon-errorList iconsize'></View>
            <View>{$t('882f13f0.60d5e6')}</View>
          </View>
          <View className=' shop-nav-item width' onClick={this.handleClick.bind(this, 'trade')}>
            <View className='iconfont icon-list1 iconsize'></View>
            <View>{$t('882f13f0.ef5b0e')}</View>
          </View>
          {info.disabled == 0 && (
            <View className='shop-nav-item width'>
              <Button openType='share' className='share-btn'>
                <View className='iconfont icon-share2 iconsize'></View>
                <View>{$t('882f13f0.386dcc')}</View>
              </Button>
            </View>
          )}
        </View>
        {info.disabled == 0 && (
          <View className='preview' onClick={this.handleClick.bind(this, 'miniShop')}>
            <View className='main'>
              <Image className='img' mode='aspectFill' src={require('../assets/shop.png')} />
              <View className='title'>{$t('882f13f0.a6b082')}</View>
            </View>
          </View>
        )}
      </SpPage>
    )
  }
}

export default connect(({ colors }) => ({
  colors: colors.current
}))(withTranslation()(DistributionShop))
