import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Swiper, Navigator, Image, Video } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtCountdown } from 'taro-ui'
import { Loading, Price, BackToTop, FloatMenus, FloatMenuItem, SpHtmlContent, SpToast, NavBar, GoodsBuyPanel } from '@/components'
import api from '@/api'
import { withBackToTop } from '@/hocs'
import { log, calcTimer } from '@/utils'
import S from '@/spx'
import GoodsBuyToolbar from '../item/comps/buy-toolbar'
import ItemImg from '../item/comps/item-img'

import '../item/espier-detail.scss'

/*@connect(({ cart, member }) => ({
  cart,
  favs: member.favs
}), (dispatch) => ({
  onFastbuy: (item) => dispatch({ type: 'cart/fastbuy', payload: { item } }),
  onAddCart: (item) => dispatch({ type: 'cart/add', payload: { item } }),
  onAddFav: ({ item_id }) => dispatch({ type: 'member/addFav', payload: { item_id } }),
  onDelFav: ({ item_id }) => dispatch({ type: 'member/delFav', payload: { item_id } })
}))*/
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
      cartCount: '',
      showBuyPanel: false,
      buyPanelType: null,
      specImgsDict: {},
      curSku: null
    }
  }

  componentDidMount () {
    this.handleResize()
    this.fetch()

    // 浏览记录
    if (S.getAuthToken()) {
      try {
        const { id } = this.$router.params
        api.member.itemHistorySave(id)
      } catch (e) {
        console.log(e)
      }
    }
  }

  componentDidShow () {
    this.fetchCartCount()
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

  async fetchCartCount () {
    if (!S.getAuthToken()) return

    const res = await api.cart.count()
    this.setState({
      cartCount: res.item_count
    })
  }

  async fetch () {
    const { id } = this.$router.params
    const info = await api.item.detail(id)

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
        backgroundColor: '#0b4137',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
    }

    // info.is_fav = Boolean(this.props.favs[info.item_id])
    const specImgsDict = this.resolveSpecImgs(info.item_spec_desc)

    this.setState({
      info,
      desc,
      marketing,
      timer,
      hasStock,
      startSecKill,
      specImgsDict
    })
    log.debug('fetch: done', info)
  }

  resolveSpecImgs (specs) {
    const ret = {}

    //只有一个图片类型规格
    specs.some(item => {
      if (item.is_image) {
        item.spec_values.forEach(v => {
          ret[v.spec_value_id] = v.spec_image_url
        })
      }
    })

    return ret
  }

  handleClickToMiniProgram = () => {
    Taro.navigateToMiniProgram({
      appId: 'wx4721629519a8f25b', // 要跳转的小程序的appid
      path: `pages/item/espier-detail?id=${this.state.info.item_id}`, // 跳转的目标页面
      extraData: {
        id: this.state.info.item_id
      },
      envVersion: 'trial',
      /*extarData: {
        open: 'auth'
      },*/
      success(res) {
        // 打开成功
        console.log(res)
      }
    })
  }

  /*handleMenuClick = async (type) => {
    const { info } = this.state
    const isAuth = S.getAuthToken()

    if (type === 'fav') {
      if (!isAuth) {
        Taro.showToast({
          title: '请登录后再收藏',
          icon: 'none'
        })
        return
      }

      if (!info.is_fav) {
        await api.member.addFav(info.item_id)
        this.props.onAddFav(info)
        Taro.showToast({
          title: '已加入收藏',
          icon: 'none'
        })
      } else {
        await api.member.delFav(info.item_id)
        this.props.onDelFav(info)
        Taro.showToast({
          title: '已移出收藏',
          icon: 'none'
        })
      }

      info.is_fav = !info.is_fav
      this.setState({
        info
      })
    }
  }

  handleSkuChange = (curSku) => {
    this.setState({
      curSku
    })
  }

  handleBuyBarClick = (type) => {
    if (!S.getAuthToken()) {
      Taro.showToast({
        title: '请先登录再购买',
        icon: 'none'
      })

      setTimeout(() => {
        S.login(this)
      }, 2000)

      return
    }

    this.setState({
      showBuyPanel: true,
      buyPanelType: type
    })
  }

  handleBuyAction = async () => {
    this.setState({
      showBuyPanel: false
    })
  }*/

  handleShare () {
  }

  render () {
    const { info, windowWidth, desc, cartCount, scrollTop, showBackToTop, curSku } = this.state
    const { marketing, timer, isPromoter, startSecKill, hasStock, showBuyPanel, buyPanelType } = this.state

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
            {
              // info.videos_url && (<Video
              //   src={info.videos_url}
              //   className='video'
              //   controls
              // />)
            }
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

          <View className='goods-sec-specs'>
            <View className='specs-title'>
              <Text>规格</Text>
              {curSku && (
                <Text className='specs-selected'>已选 {curSku.propsText}</Text>
              )}
            </View>
            <ScrollView
              className='specs-scroller'
              scrollX
            >
              <View className='specs-imgs'>
                {Object.keys(this.state.specImgsDict).map((specValueId) => {
                  const img = this.state.specImgsDict[specValueId]
                  return (
                    <Image
                      class='specs-imgs__item'
                      src={img}
                      key={img}
                      mode='aspectFill'
                      // onClick={this.handleBuyBarClick.bind(this, buyPanelType)}
                    />
                  )
                })}
              </View>
            </ScrollView>
          </View>

          <SpHtmlContent
            className='goods-detail__content'
            content={desc}
          />

          {/*<View className='goods-sec-tabs'>
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
          </View>*/}
        </ScrollView>

        <FloatMenus>
          <FloatMenuItem
            iconPrefixClass='in-icon'
            icon='float-gift'
          />
          <FloatMenuItem
            iconPrefixClass='in-icon'
            icon='float-share'
            openType='share'
            onClick={this.handleShare}
          />
          <FloatMenuItem
            iconPrefixClass='in-icon'
            icon='back-top'
            hide={!showBackToTop}
            onClick={this.scrollBackToTop}
          />
        </FloatMenus>

        {(info.distributor_sale_status && hasStock && startSecKill)
          ?
            (<GoodsBuyToolbar
              info={info}
              type={marketing}
              onFavItem={this.handleClickToMiniProgram.bind(this)}
              onClickAddCart={this.handleClickToMiniProgram.bind(this)}
              onClickFastBuy={this.handleClickToMiniProgram.bind(this)}
            />)
          :
          (<GoodsBuyToolbar
            info={info}
            customRender
            type={marketing}
          >
            <View
              className='goods-buy-toolbar__btns'
              style='width: 60%; text-align: center'
            >
              {
                !startSecKill
                  ? <Text>活动即将开始</Text>
                  : <Text>当前店铺无货</Text>
              }
            </View>
          </GoodsBuyToolbar>)
        }

        {
          info && (<GoodsBuyPanel
            info={info}
            type={buyPanelType}
            isOpened={showBuyPanel}
            cartCount={cartCount}
            onClose={() => this.setState({ showBuyPanel: false })}
            onChange={this.handleClickToMiniProgram.bind(this)}
            onAddCart={this.handleClickToMiniProgram.bind(this)}
            onFastbuy={this.handleClickToMiniProgram.bind(this)}
          />)
        }

        <SpToast />
      </View>
    )
  }
}
