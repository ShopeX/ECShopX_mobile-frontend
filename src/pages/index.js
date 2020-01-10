import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { SpToast, TabBar, Loading, SpNote, BackToTop, FloatMenus, FloatMenuItem } from '@/components'
import req from '@/api/req'
import api from '@/api'
import { pickBy, classNames, isArray } from '@/utils'
import entry from '@/utils/entry'
import { withPager, withBackToTop } from '@/hocs'
import S from "@/spx";
import { WgtGoodsFaverite, HeaderHome } from './home/wgts'
import { HomeWgts } from './home/comps/home-wgts'
import Automatic from './home/comps/automatic'
import { resolveFavsList } from './item/helper'

import './home/index.scss'
@connect(({ cart }) => ({
  list: cart.list,
	cartIds: cart.cartIds,
	cartCount: cart.cartCount,
  showLikeList: cart.showLikeList
}), (dispatch) => ({
	onUpdateLikeList: (show_likelist) => dispatch({ type: 'cart/updateLikeList', payload: show_likelist }),
	onUpdateCartCount: (count) => dispatch({ type: 'cart/updateCount', payload: count })
}))
@connect(store => ({
  store
}))
@withPager
@withBackToTop
export default class HomeIndex extends Component {
  config = {
    enablePullDownRefresh: true,
    backgroundTextStyle: 'dark',
    onReachBottomDistance: 50
  }

  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      wgts: null,
      likeList: [],
      isShowAddTip: false,
      curStore: null,
      positionStatus: false,
      automatic: null,
      showAuto: true,
      top: 0,
      isShop:null
    }
  }

  onPullDownRefresh = () => {
    this.resetPage()
    this.setState({
      likeList: [],
      wgts: null
    }, () => {
      this.fetchInfo()
    })
  }

  onPageScroll = (res) => {
    console.log(res)
    const { scrollTop } = res
    this.setState({
      top: scrollTop
    })
  }

  onReachBottom = () => {
    this.nextPage()
  }

  componentDidShow = () => {
    const curStore = Taro.getStorageSync('curStore')
    if (!isArray(curStore)) {
      this.setState({
        curStore
      })
    }

    Taro.getStorage({ key: 'addTipIsShow' })
      .then(() => {})
      .catch((error) => {
        console.log(error)
        this.setState({
          isShowAddTip: true
        })
      })
  }

  componentDidMount () {
    this.fetchInfo(async (info) => {
      const url = '/pageparams/setting?template_name=yykweishop&version=v1.0.1&page_name=index&name=search'
      const [fixSetting, { is_open, ad_pic, ad_title }] = await Promise.all([req.get(url), api.promotion.automatic({register_type: 'general'})])

      this.setState({
        automatic: {
          title: ad_title,
          isOpen: is_open === 'true',
          adPic: ad_pic
        },
        positionStatus: (fixSetting.length && fixSetting[0].params.config.fixTop) || false
      })

      // const userinfo = Taro.getStorageSync('userinfo')
      // if (automatic.is_open === 'true' && automatic.register_type === 'membercard' && userinfo) {
      //   const { is_open, is_vip, is_had_vip, vip_type } = await api.vip.getUserVipInfo()
      //   this.setState({
      //     vip: {
      //       isSetVip: is_open,
      //       isVip: is_vip,
      //       isHadVip: is_had_vip,
      //       vipType: vip_type
      //     }
      //   })
      // }

      const options = this.$router.params
      const res = await entry.entryLaunch(options, true)
          if(S.getAuthToken()){
              const promoterInfo = await api.distribution.info()
              this.setState({
                isShop:promoterInfo
              })
            }

      const { store } = res
      if (!isArray(store)) {
        this.setState({
          curStore: store
        })
  		}
    })
  }

  onShareAppMessage (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: '首页',
      path: '/pages/index'
    }
  }
	async fetchCartcount() {
    if (!S.getAuthToken()) {
      return
    }

    try {
      const { item_count } = await api.cart.count({shop_type: 'distributor'})
      this.props.onUpdateCartCount(item_count)
    } catch (e) {
      console.error(e)
    }
	}
  async fetchInfo (cb) {
    const url = '/pageparams/setting?template_name=yykweishop&version=v1.0.1&page_name=index'
    const info = await req.get(url)

    this.setState({
      wgts: info.config
    },()=>{
      if (cb) {
        cb(info)
      }
      Taro.stopPullDownRefresh()
      if(info.config) {
        const show_likelist = info.config.find(item => item.name == 'setting' && item.config.faverite)
        this.props.onUpdateLikeList(show_likelist ? true : false)
        if (show_likelist) {
          this.resetPage()
          this.setState({
            likeList: []
          })
          this.nextPage()
        }
      }
    })
  }

  async fetch (params) {
    console.log(params, 160)
    const { page_no: page, page_size: pageSize } = params
    const query = {
      page,
      pageSize
    }
    const { list, total_count: total } = await api.cart.likeList(query)

    const nList = pickBy(list, {
      img: 'pics[0]',
      item_id: 'item_id',
      title: 'itemName',
      promotion_activity_tag: 'promotion_activity',
      price: ({ price }) => (price/100).toFixed(2),
      member_price: ({ member_price }) => (member_price/100).toFixed(2),
      market_price: ({ market_price }) => (market_price/100).toFixed(2),
      desc: 'brief',
    })

    this.setState({
      likeList: [...this.state.likeList, ...nList],
    })

    return {
      total
    }
  }

  handleClickLicense = () => {
    Taro.navigateTo({
      url: '/pages/home/license'
    })
  }

  handleGift = async () => {
    if (!S.getAuthToken()) {
      setTimeout(() => {
        S.login(this)
      }, 1000)
      return
    }

    // const status = await api.member.receiveVip()
    // if (status) {
    //   const msg = status.card_type.desc + status.title
    //   const vip = {
    //     isVip: true,
    //     isHadVip: true,
    //     vipType: status.lv_type
    //   }
    //   this.setState({
    //     vip
    //   }, () => {
    //     Taro.showToast({
    //       title: '领取成功',
    //       icon: 'success'
    //     })
    //   })
    // } else {
    //   S.toast('活动已过期')
    // }
  }

  handleAutoClick = () => {
    const { showAuto } = this.state
    this.setState({
      showAuto: !showAuto
    })
  }

  handleClickCloseAddTip = () => {
    Taro.setStorage({ key: 'addTipIsShow', data: {isShowAddTip: false} })
    this.setState({
      isShowAddTip: false
    })
  }

  handleClickShop = () => {
    Taro.navigateTo({
      url: '/pages/distribution/shop-home'
    })
  }

  render () {
    const { wgts, page, isShop, likeList, showBackToTop, scrollTop, isShowAddTip, curStore, positionStatus, automatic, showAuto, top } = this.state
    const { showLikeList } = this.props
    const user = Taro.getStorageSync('userinfo')
    const isPromoter = user && user.isPromoter
    const distributionShopId = Taro.getStorageSync('distribution_shop_id')

    if (!wgts || !this.props.store) {
      return <Loading />
		}
		const show_location = wgts.find(item=>item.name=='setting'&&item.config.location)

    return (
      <View className={`page-index ${top < 1 ? 'onTop' : '' }`}>
				{/*<ScrollView
  className={classNames('wgts-wrap', positionStatus && 'wgts-wrap__fixed' , !curStore && 'wgts-wrap-nolocation')}
  scrollTop={scrollTop}
  onScroll={this.handleScroll}
  onScrollToUpper={this.onScrollToUpper.bind(this)}
  onScrollToLower={this.nextPage}
  scrollY
				>*/}
        <View className={classNames('wgts-wrap', positionStatus && 'wgts-wrap__fixed' , !curStore && 'wgts-wrap-nolocation')}>
          <View className='wgts-wrap__cont'>
            <HomeWgts
              wgts={wgts}
            />
            {likeList.length > 0 && showLikeList && (
              <View className='faverite-list'>
                <WgtGoodsFaverite info={likeList} />
                {
                  page.isLoading
                    ? <Loading>正在加载...</Loading>
                    : null
                }
                {
                  !page.isLoading && !page.hasNext && !likeList.length
                  && (<SpNote img='trades_empty.png'>暂无数据~</SpNote>)
                }
              </View>
            )}

          </View>
        </View>
        {/*</ScrollView>*/}

        {
          <FloatMenus>
            {
              isShop && isShop.isOpenShop === 'true' && isShop.shop_status === 1 &&
              distributionShopId &&
              <Image
                className='distribution-shop'
                src='/assets/imgs/gift_mini.png'
                mode='widthFix'
                onClick={this.handleClickShop}
              />
            }
            {
              automatic && automatic.isOpen && !S.getAuthToken() &&
                <FloatMenuItem
                  iconPrefixClass='icon'
                  icon='present'
                  onClick={this.handleAutoClick.bind(this)}
                />
            }
          </FloatMenus>
        }

        {
          automatic && automatic.isOpen && !S.getAuthToken() &&
            <Automatic
              info={automatic}
              isShow={showAuto}
              onClick={this.handleGift.bind(this)}
              onClose={this.handleAutoClick.bind(this)}
            />
        }

        <BackToTop
          show={showBackToTop}
          onClick={this.scrollBackToTop}
        />
        {
          isShowAddTip ? <View className='add_tip'>
            <View class='tip-text'>点击“•●•”添加到我的小程序，微信首页下拉即可快速访问店铺</View>
            <View className='icon-close icon-view' onClick={this.handleClickCloseAddTip.bind(this)}> </View>
          </View> : null
        }

        <SpToast />
        <TabBar />
      </View>
    )
  }
}
