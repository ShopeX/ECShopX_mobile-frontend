import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Swiper, SwiperItem, Image, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtDivider, AtCountdown, AtProgress, AtNoticebar } from 'taro-ui'
import { Loading, Price, BackToTop, SpHtmlContent, SpToast } from '@/components'
import api from '@/api'
import { withBackToTop } from '@/hocs'
import { styleNames, log } from '@/utils'
import S from '@/spx'

import './point-draw-detail.scss'

@connect(({ cart }) => ({
  cart
}), (dispatch) => ({
  onFastbuy: (item) => dispatch({ type: 'cart/fastbuy', payload: { item } }),
  onAddCart: (item) => dispatch({ type: 'cart/add', payload: { item } })
}))
@withBackToTop
export default class PointDetail extends Component {
  static options = {
    addGlobalClass: true
  }

  constructor (props) {
    super(props)

    this.state = {
      info: null,
      desc: null,
      windowWidth: 320,
      curImgIdx: 0,
      timer: null
    }
  }

  componentDidMount () {
    this.handleResize()
    this.fetch()
  }

  calcTimer (totalSec) {
    let remainingSec = totalSec
    const dd = Math.floor(totalSec / 24 / 3600)
    remainingSec -= dd * 3600 * 24
    const hh = Math.floor(remainingSec / 3600)
    remainingSec -= hh * 3600
    const mm = Math.floor(remainingSec / 60)
    remainingSec -= mm * 60
    const ss = Math.floor(remainingSec)

    return {
      dd,
      hh,
      mm,
      ss
    }
  }

  handleResize () {
    const { windowWidth } = Taro.getSystemInfoSync()
    this.setState({
      windowWidth
    })
  }

  async fetch () {
    const { luckydraw_id } = this.$router.params
    const info = await api.member.pointDrawDetail(luckydraw_id)
    const { intro: desc } = info.goods_info
    console.log(this.$router.params)

    let timer
    const now_time = (new Date()).getTime()
    const end_time = info.end_time*1000 - (new Date()).getTime()
    console.log(now_time, end_time, 78)
    timer = this.calcTimer(end_time)

    Taro.setNavigationBarTitle({
      title: info.goods_info.itemName
    })
    Taro.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#FF482B',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    this.setState({
      info,
      desc,
      timer
    })
    log.debug('fetch: done', info)
  }

  handleSwiperChange = (e) => {
    const { detail: { current } } = e
    this.setState({
      curImgIdx: current
    })
  }

  handleBuyClick = async () => {

    Taro.showLoading({
      title: '生成订单中',
      mask: true
    });
    await api.member.pointDrawPay(this.$router.params)
      .then(res => {
        console.log(2630692000018945)
        Taro.hideLoading()
        Taro.navigateTo({
          url: `/pages/cashier/index?order_id=${res.luckydraw_trade_id}`
        })
      })
      .catch(error => {
        Taro.hideLoading()
        S.toast(`${error.res.data.error.message}`)
      })
  }

  render () {
    const { info, windowWidth, curImgIdx, desc, scrollTop, showBackToTop } = this.state
    const { timer } = this.state

    if (!info) {
      return (
        <Loading />
      )
    }

    const { pics: imgs } = info.goods_info

    return (
      <View className='page-goods-detail'>
        <ScrollView
          className='goods-detail__wrap'
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
        >
          <View className='goods-imgs__wrap'>
            <Swiper
              className='goods-imgs__swiper'
              style={`height: ${windowWidth}px`}
              onChange={this.handleSwiperChange}
            >
              {
                imgs.map((img, idx) => {
                  return (
                    <SwiperItem key={idx}>
                      <Image
                        src={img}
                        mode='aspectFill'
                        style={styleNames({ width: windowWidth + 'px', height: windowWidth + 'px' })}
                      />
                    </SwiperItem>
                  )
                })
              }
            </Swiper>
            {
              imgs.length > 1
              && <Text className='goods-imgs__text'>{curImgIdx + 1} / {imgs.length}</Text>
            }
          </View>

          {timer && (
            <View className='goods-timer'>
              <View className='goods-timer__hd'>
                <View className='goods-prices'>
                  <View className='goods-prices-point'>已筹集{info.luckydraw_point*info.sales_num}积分</View>
                  <AtProgress percent={info.sales_num/info.luckydraw_store} status='progress' color='#13CE66' />
                </View>
              </View>
              <View className='goods-timer__bd'>
                <Text className='goods-timer__label'>距结束还剩</Text>
                <AtCountdown
                  isShowDay
                  day={timer.dd}
                  hours={timer.hh}
                  minutes={timer.mm}
                  seconds={timer.ss}
                />
              </View>
            </View>
          )}

          <View className='goods-hd'>
            <View className='goods-title__wrap'>
              <Text className='goods-title'>{info.goods_info.itemName}</Text>
              <Text className='goods-title__desc'>{info.goods_info.brief}</Text>
            </View>

            <View className='goods-prices__wrap'>
              <View className='goods-prices'>
                <Price
                  primary
                  noSymbol
                  noDecimal
                  appendText='积分'
                  value={info.luckydraw_point}
                />
              </View>

              <Text className='goods-sold'>积分池：{info.luckydraw_point*info.luckydraw_store || 0}</Text>
            </View>
          </View>

          <View className='notice-bar-hd'>
            <AtNoticebar marquee>
              这是 NoticeBar 通告栏，这是 NoticeBar 通告栏，这是 NoticeBar 通告栏
            </AtNoticebar>
          </View>

          <View className='sec goods-sec-props'>
            <View className='sec-hd'>
              <Text className='sec-title'>商品参数</Text>
            </View>
            <View className='sec-bd'>
              <View className='goods-props__wrap'>
                <View className='prop-item'>
                  <Text className='prop-item__label'>品牌：</Text>
                  <Text className='prop-item__cont'>{info.goods_info.goods_brand || '--'}</Text>
                </View>
                <View className='prop-item'>
                  <Text className='prop-item__label'>颜色：</Text>
                  <Text className='prop-item__cont'>{info.goods_info.goods_color || '--'}</Text>
                </View>
                <View className='prop-item'>
                  <Text className='prop-item__label'>功能：</Text>
                  <Text className='prop-item__cont'>{info.goods_info.goods_function || '--'}</Text>
                </View>
                <View className='prop-item'>
                  <Text className='prop-item__label'>材质：</Text>
                  <Text className='prop-item__cont'>{info.goods_info.goods_series || '--'}</Text>
                </View>
              </View>
            </View>
          </View>

          <View className='goods-sec-detail'>
            <AtDivider content='宝贝详情'></AtDivider>
            <SpHtmlContent
              className='goods-detail__content'
              content={desc}
            />
          </View>
        </ScrollView>

        <BackToTop
          bottom={150}
          show={showBackToTop}
          onClick={this.scrollBackToTop}
        />

        <View className='goods-buy-toolbar'>
          <View  className='goods-buy-toolbar__btns' >
            <Button
              className='goods-buy-toolbar__btn btn-fast-buy'
              onClick={this.handleBuyClick.bind(this)}
            >立即抽奖</Button>
          </View>
        </View>

        <SpToast />
      </View>
    )
  }
}
