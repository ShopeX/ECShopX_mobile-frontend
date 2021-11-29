import React, { Component } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Swiper, SwiperItem, Image, Text, Canvas } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import { SpNavBar, SpHtmlContent } from '@/components'
import api from '@/api'
import { formatCountTime } from '../../utils/index'
import CanvasUtil from '../../utils/canvas'

import './index.scss'

export default class GoodDetail extends Component {
  $instance = getCurrentInstance();
  constructor(props) {
    super(props)
    this.state = {
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
        address: ''
      },
      timeId: '',
      imgCurrent: 0,
      posterImg: '',
      showPoster: false,
      countTime: 0
    }
  }

  componentDidMount() {
    this.getGoodInfo()
  }

  componentWillUnmount() {
    let { timeId } = this.state
    if (timeId) {
      clearTimeout(timeId)
    }
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
    const { itemId, activeId, cid } = this.$instance.router.params

    api.groupBy
      .activityGoodDetail({
        item_id: itemId,
        activity_id: activeId,
        community_id: cid
      })
      .then((res) => {
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
              activityPrice: (activity_price / 100).toFixed(2),
              intro: item.intro,
              leaderName: community.leader_name,
              address: community.address,
              currentId: community.community_id,
              companyId: community.company_id,
              symbol: cur.symbol
            },
            countTime: activity.last_second
          },
          () => {
            this.countdown()
            // 绘制canvas
            this.drawCanvas()
          }
        )
      })
  }

  // 图片切换
  swiperImgChange = (e) => {
    const { current } = e.detail
    this.setState({
      imgCurrent: current
    })
  }

  // 前往购物车
  goCart = () => {
    Taro.reLaunch({
      url: '/groupBy/pages/cart/index'
    })
  }
  // 回到首页
  goHome = () => {
    Taro.reLaunch({
      url: '/groupBy/pages/home/index'
    })
  }
  // 立即购买
  handleBuy = () => {
    const { goodInfo } = this.state
    Taro.navigateTo({
      url: `/groupBy/pages/payOrder/index?activityId=${goodInfo.activityId}&itemId=${
        goodInfo.itemId
      }&itemNum=${1}&communityId=${goodInfo.currentId}`
    })
  }

  // canvas 绘制
  drawCanvas = async () => {
    // Taro.showLoading({
    //   mask: true,
    //   title: '请稍等'
    // })
    const host = process.env.APP_BASE_URL.replace('api/h5app/wxapp', '')

    const extConfig = Taro.getExtConfigSync ? Taro.getExtConfigSync() : {}

    const { goodInfo } = this.state
    //  二维码链接
    const qrCode = `${host}wechatAuth/shopwxapp/community/qrcode.png?appid=${extConfig.appid}&company_id=${goodInfo.companyId}&aid=${goodInfo.activityId}&cid=${goodInfo.currentId}&id=${goodInfo.itemId}`

    const ctx = Taro.createCanvasContext('poster')
    const canvas = new CanvasUtil(ctx, Taro)
    canvas.drawCanvas(375, 640, { ...goodInfo, qrCode }, () => {
      Taro.canvasToTempFilePath({
        x: 0,
        y: 0,
        canvasId: 'poster'
      })
        .then((res) => {
          this.setState({
            posterImg: res.tempFilePath
          })
          // Taro.hideLoading()
        })
        .catch((err) => console.log(err))
    })
  }

  showPoster = () => {
    this.setState({
      showPoster: true
    })
  }

  // 禁止触摸穿透
  stopTouch = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  // 预览海报
  previewImage = (posterImg) => {
    Taro.previewImage({
      urls: [posterImg]
    })
  }

  render() {
    const { goodInfo, imgCurrent, posterImg, showPoster, countTime } = this.state
    const { isNext = false } = this.$instance.router.params

    return (
      <View className='goodDetail'>
        <SpNavBar
          title={this.config.navigationBarTitleText}
          leftIconType='chevron-left'
          fixed='true'
        />
        <View className='goodImg'>
          <Swiper className='swiperImg' onChange={this.swiperImgChange.bind(this)}>
            {goodInfo.pics.map((item) => (
              <SwiperItem key={item} className='swiperItem'>
                <Image className='itemImg' src={item}></Image>
              </SwiperItem>
            ))}
          </Swiper>
          <View className='showCurrent'>
            {imgCurrent + 1} / {goodInfo.pics.length}
          </View>
        </View>
        {/* 倒计时 */}
        <View className='timeDown'>
          <Text className='title'>仅剩{formatCountTime(countTime)}</Text>
        </View>
        {/* 详情 */}
        <View className='info'>
          {/* 商品名称 */}
          <View className='goodName'>
            <View className='name'>{goodInfo.goodName}</View>
            <View className='saled' onClick={this.showPoster}>
              <AtIcon value='share' size='20' color='#999'></AtIcon>
              分享
            </View>
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
          {/* 最近下单 */}
          <View className={`recenter ${goodInfo.historyData.length <= 0 && 'noHistoryData'}`}>
            <View className='title'>最近下单</View>
            <View className='recenterList'>
              <View className='avatarContent'>
                {goodInfo.historyData.map(
                  (item) =>
                    item.headimgurl && (
                      <Image key={item} className='buyAvatar' src={item.headimgurl} />
                    )
                )}
              </View>
              <View className='sumBuyer'>
                {goodInfo.initialSales}人...
                <View className='iconfont icon-arrowRight'></View>
              </View>
            </View>
          </View>
          {/* 其他规格信息 */}
          <View className='otherInfo'>
            <View className='title'>商品信息: </View>
            {goodInfo.intro && !Array.isArray(goodInfo.intro) ? (
              <SpHtmlContent content={goodInfo.intro} className='richText' />
            ) : (
              <View>暂无详情</View>
            )}
          </View>
        </View>
        {/* 底部购物bar */}
        <View className='cartBar'>
          <View className='cartBag' onClick={this.goHome.bind(this)}>
            <View className='iconfont icon-home1'></View>
            团购首页
          </View>
          <View className='cartBag' onClick={this.goCart.bind(this)}>
            <View className='iconfont icon-cart'></View>
            购物袋
          </View>
          {!isNext || isNext === 'false' ? (
            <View className='immediately' onClick={this.handleBuy.bind(this)}>
              立即抢购
            </View>
          ) : (
            <View className='immediately no'>暂未开始</View>
          )}
        </View>
        {/* 海报 */}
        <Canvas canvasId='poster' style='width: 375px; height: 640px;' className='posterCanvas' />
        {showPoster && (
          <View className='imgContent' onTouchMove={this.stopTouch}>
            <Image
              className='posterImg'
              mode='widthFix'
              onClick={this.previewImage.bind(this, posterImg)}
              src={posterImg}
            />
            <View
              className='closePoster'
              onClick={() => {
                this.setState({ showPoster: false })
              }}
            >
              <AtIcon value='close-circle' size='30' color='#fff' />
            </View>
          </View>
        )}
      </View>
    )
  }
}
