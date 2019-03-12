import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Swiper, SwiperItem, Image, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtDivider, AtCountdown } from 'taro-ui'
import { Loading, Price, BackToTop, SpHtmlContent, SpToast } from '@/components'
import api from '@/api'
import { withBackToTop } from '@/hocs'
import { styleNames, log } from '@/utils'
import S from '@/spx'

import './point-detail.scss'

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
      marketing: 'normal',
      info: null,
      desc: null,
      windowWidth: 320,
      curImgIdx: 0,
      isPromoter: false,
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
    const { id } = this.$router.params
    const info = await api.item.detail(id, { distributor_id: 16 })
    const { intro: desc } = info

    let marketing = 'normal'
    let timer = null
    if (info.group_activity) {
      //团购
      marketing = 'group'
      timer = this.calcTimer(info.group_activity.remaining_time)
    } else if (info.seckill_activity) {
      //秒杀
      marketing = 'seckill'
    }

    Taro.setNavigationBarTitle({
      title: info.item_name
    })

    if (marketing === 'group' || marketing === 'seckill') {
      Taro.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#FF482B',
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

  handleSwiperChange = (e) => {
    const { detail: { current } } = e
    this.setState({
      curImgIdx: current
    })
  }

  handleBuyClick = async (type) => {
    const { marketing, info } = this.state
    let url = `/pages/cart/espier-checkout`

    const hasToken = !!S.getAuthToken()
    if (!hasToken) {
      return S.login(this, false)
    }


    if (type === 'fastbuy') {
      url += '?cart_type=fastbuy&pay_type=point'
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

  render () {
    const { info, windowWidth, curImgIdx, desc, scrollTop, showBackToTop } = this.state
    const { marketing, timer, isPromoter } = this.state

    if (!info) {
      return (
        <Loading />
      )
    }

    const { pics: imgs } = info

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
                  <Price
                    unit='cent'
                    symbol={info.cur.symbol}
                    value={info.price}
                  />
                  <View className='goods-prices__ft'>
                    <Text className='goods-prices__type'>团购</Text>
                    <Price
                      unit='cent'
                      className='goods-prices__market'
                      symbol={info.cur.symbol}
                      value={info.mkt_price}
                    />
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

                  {info.approve_status !== 'only_show' && (
                    <View className='goods-prices__market'>
                      <Price
                        unit='cent'
                        symbol={info.cur.symbol}
                        value={info.mkt_price}
                      />
                    </View>
                  )}
                </View>

                {info.approve_status !== 'only_show' && (<Text className='goods-sold'>{info.sales || 0}人已购</Text>)}
              </View>
            )}
          </View>
          {isPromoter && (
            <View className='goods-income'>
              <View className='sp-icon sp-icon-jifen'></View>
              <Text>预计收益：{(info.promoter_price/100).toFixed(2)}</Text>
            </View>
          )}

          <View className='sec goods-sec-props'>
            <View className='sec-hd'>
              <Text className='sec-title'>商品参数</Text>
            </View>
            <View className='sec-bd'>
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

          {/*<View
            className='sec goods-sec-action'
            onClick={this.handleClickAction}
          >
            <Text className='goods-action'>
              <Text className='goods-action__label'>选择</Text>
              <Text>购买尺寸、颜色、数量、分类</Text>
            </Text>
            <View className='sec-ft'>
              <View className='at-icon at-icon-chevron-right'></View>
            </View>
          </View>*/}

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
              onClick={this.handleBuyClick.bind(this, 'fastbuy')}
            >立即购买</Button>
          </View>
        </View>


        <SpToast />
      </View>
    )
  }
}
