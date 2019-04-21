import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Swiper, SwiperItem, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtDivider, AtCountdown } from 'taro-ui'
import { Loading, Price, BackToTop, FloatMenus, FloatMenuItem, SpHtmlContent, SpToast, NavBar } from '@/components'
import api from '@/api'
import { withBackToTop } from '@/hocs'
import { styleNames, log, calcTimer } from '@/utils'
import S from '@/spx'
import GoodsBuyToolbar from './comps/buy-toolbar'
import ItemImg from './comps/item-img'

import './espier-detail.scss'

@connect(({ cart }) => ({
  cart
}), (dispatch) => ({
  onFastbuy: (item) => dispatch({ type: 'cart/fastbuy', payload: { item } }),
  onAddCart: (item) => dispatch({ type: 'cart/add', payload: { item } })
}))
@withBackToTop
export default class Detail extends Component {
  static options = {
    addGlobalClass: true
  }

  constructor (props) {
    super(props)

    this.state = {
      marketing: 'normal',
      info: null,
      desc: null,
      windowWidth: 320,
      isPromoter: false,
      timer: null,
      startSecKill: true,
      hasStock: true,
      curTabIdx: 0,
      detailTabs: [
        { title: '商品详情' },
        { title: '商品参数' },
        { title: '服务保障' }
      ]
    }
  }

  componentDidMount () {
    this.handleResize()
    this.fetch()
  }

  onShareAppMessage () {
    const { info } = this.state

    return {
      title: info.item_name,
      path: `/pages/item/espier-detail?id=${info.item_id}`
    }
  }

  handleResize () {
    const { windowWidth } = Taro.getSystemInfoSync()
    this.setState({
      windowWidth
    })
  }

  async fetch () {
    const { id } = this.$router.params
    const info = await api.item.detail(id, { distributor_id: 16 })
    const { intro: desc } = info

    let marketing = 'normal'
    let timer = null
    let hasStock = info.store && info.store > 0
    let startSecKill = true

    if (info.group_activity) {
      //团购
      marketing = 'group'
      timer = calcTimer(info.group_activity.remaining_time)
      hasStock = info.group_activity.store && info.group_activity.store > 0
    } else if (info.seckill_activity) {
      //秒杀
      marketing = 'seckill'
      timer = calcTimer(info.seckill_activity.last_seconds)
      hasStock = info.seckill_activity.activity_store && info.seckill_activity.activity_store > 0
      startSecKill = info.seckill_activity.status === 'in_sale'
    }

    Taro.setNavigationBarTitle({
      title: info.item_name
    })

    if (marketing === 'group' || marketing === 'seckill') {
      Taro.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#C40000',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
    }

    this.setState({
      info,
      desc,
      marketing,
      timer
    })
    log.debug('fetch: done', info)
  }

  handleBuyClick = async (type) => {
    const { marketing, info } = this.state
    let url = `/pages/cart/espier-checkout`

    const hasToken = !!S.getAuthToken()
    if (!hasToken) {
      return S.login(this, false)
    }

    if (type === 'cart') {
      url = `/pages/cart/espier-index`

      await api.cart.add(this.state.info, 1, true)
      Taro.showToast({
        title: '成功加入购物车',
        icon: 'success'
      })
      return
    }

    if (type === 'fastbuy') {
      url += '?cart_type=fastbuy'
      if (marketing === 'group') {
        url += `&type=${marketing}&group_id=${this.state.info.group_activity.groups_activity_id}`
      } else if (marketing === 'seckill') {
        url += `&type=${marketing}&seckill_id=${this.state.info.seckill_activity.seckill_id}`
      }

      this.props.onFastbuy(info)
      Taro.navigateTo({
        url
      })
    }
  }

  handleTabClick = (idx) => {
    this.setState({
      curTabIdx: idx
    })
  }

  handleShare () {

  }

  render () {
    const { info, windowWidth, desc, scrollTop, showBackToTop } = this.state
    const { marketing, timer, isPromoter, startSecKill, hasStock, detailTabs, curTabIdx } = this.state

    if (!info) {
      return (
        <Loading />
      )
    }

    const imgInfo = {
      img: info.pics[0],
      width: windowWidth + 'px'
    }

    return (
      <View className='page-goods-detail'>
        <NavBar
          title={info.item_name}
          leftIconType='chevron-left'
          fixed='true'
        />

        <ScrollView
          className='goods-detail__wrap'
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
        >
          <View className='goods-imgs__wrap'>
            <ItemImg
              info={imgInfo}
            />
          </View>

          {timer && (
            <View className='goods-timer'>
              <View className='goods-timer__hd'>
                <View className='goods-prices'>
                  <Price
                    unit='cent'
                    symbol={info.cur.symbol}
                    value={info.price}
                  />
                  <Price
                    unit='cent'
                    className='goods-prices__market'
                    symbol={info.cur.symbol}
                    value={info.mkt_price}
                  />
                  <View className='goods-prices__ft'>
                    <Text className='goods-prices__type'>团购</Text>
                    <Text className='goods-prices__rule'>{info.group_activity.person_num}人团</Text>
                  </View>
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
              <Text className='goods-title'>{info.item_name}</Text>
              <Text className='goods-title__desc'>{info.brief}</Text>
              {/*<View className='goods-fav'>
                <View className='at-icon at-icon-star'></View>
                <Text className='goods-fav__text'>收藏</Text>
              </View>*/}
            </View>

            {marketing === 'normal' && (
              <View className='goods-prices__wrap'>
                <View className='goods-prices'>
                  <Price
                    primary
                    unit='cent'
                    value={info.price}
                  />
                </View>

                {/* info.approve_status !== 'only_show' && (<Text className='goods-sold'>{info.sales || 0}人已购</Text>) */}
              </View>
            )}
          </View>
          {isPromoter && (
            <View className='goods-income'>
              <View className='sp-icon sp-icon-jifen'></View>
              <Text>预计收益：{(info.promoter_price/100).toFixed(2)}</Text>
            </View>
          )}

          <View className='goods-sec-tabs'>
            <View className='sec-tabs'>
              {detailTabs.map((tab, idx) => {
                return (
                  <View
                    key={tab.title}
                    className={`sec-tab__item ${idx === curTabIdx ? 'is-active' : ''}`}
                    onClick={this.handleTabClick.bind(this, idx)}
                  >{tab.title}</View>
                )
              })}
            </View>

            <View className={`goods-sec-detail sec-tab__panel ${curTabIdx === 0 ? 'is-show' : ''}`}>
              <SpHtmlContent
                className='goods-detail__content'
                content={desc}
              />
            </View>

            <View className={`goods-sec-props sec-tab__panel ${curTabIdx === 1 ? 'is-show' : ''}`}>
              <View className='goods-props__wrap'>
                <View className='prop-item'>
                  <Text className='prop-item__label'>品牌：</Text>
                  <Text className='prop-item__cont'>{info.goods_brand || '--'}</Text>
                </View>
                <View className='prop-item'>
                  <Text className='prop-item__label'>颜色：</Text>
                  <Text className='prop-item__cont'>{info.goods_color || '--'}</Text>
                </View>
                <View className='prop-item'>
                  <Text className='prop-item__label'>功能：</Text>
                  <Text className='prop-item__cont'>{info.goods_function || '--'}</Text>
                </View>
                <View className='prop-item'>
                  <Text className='prop-item__label'>材质：</Text>
                  <Text className='prop-item__cont'>{info.goods_series || '--'}</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <FloatMenus>
          <FloatMenuItem
            iconPrefixClass='in-icon'
            icon='back-top'
            hide={!showBackToTop}
            onClick={this.scrollBackToTop}
          />
          <FloatMenuItem
            iconPrefixClass='in-icon'
            icon='float-share'
            openType='share'
            onClick={this.handleShare}
          />
          <FloatMenuItem
            iconPrefixClass='in-icon'
            icon='float-gift'
          />
        </FloatMenus>

        {(!info.distributor_sale_status && hasStock && startSecKill)
          ?
            (<GoodsBuyToolbar
              type={marketing}
              onClickAddCart={this.handleBuyClick.bind(this, 'cart')}
              onClickFastBuy={this.handleBuyClick.bind(this, 'fastbuy')}
            />)
          :
            (<GoodsBuyToolbar
              customRender
              type={marketing}
            >
              <View
                className='goods-buy-toolbar__btns'
                style='width: 40%; text-align: center;'
              >
                {
                  !startSecKill
                    ? <Text>活动即将开始</Text>
                    : <Text>当前店铺无货</Text>
                }
              </View>
            </GoodsBuyToolbar>)
        }

        <SpToast />
      </View>
    )
  }
}
