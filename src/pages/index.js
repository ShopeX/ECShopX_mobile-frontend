import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { SpToast, TabBar, Loading, SpNote, BackToTop, FloatMenus, FloatMenuItem,AccountOfficial } from '@/components'
import req from '@/api/req'
import api from '@/api'
import { pickBy, classNames, isArray, normalizeQuerys } from '@/utils'
import entry from '@/utils/entry'
import { withPager, withBackToTop } from '@/hocs'
import S from "@/spx";
import { WgtGoodsFaverite, HeaderHome } from './home/wgts'
import { Tracker } from "@/service";
import HomeWgts from './home/comps/home-wgts'
import Automatic from './home/comps/automatic'
// import { resolveFavsList } from './item/helper'

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
  constructor(props) {
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
      isShop: null,
      salesperson_id: '',
      // 店铺精选id
      featuredshop: '',
      // 分享配置
      shareInfo: {},
      is_open_recommend: null,
      is_open_scan_qrcode: null,
      is_open_official_account:null,
      show_official:true,
      showCloseBtn:false
    }
  }

  async componentDidMount() {
    this.fetchSetInfo()
    const isCloseOfficial = Taro.getStorageSync('close_official')//是否关闭
    if(isCloseOfficial){
      this.setState({
        show_official:false
      })
    }
  //   if(this.$router.params.scene){
  //     const query = decodeURIComponent(this.$router.params.scene)
  //     const queryStr = decodeURIComponent(query)
  //     this.setState({
  //       showCloseBtn:true
  //     })
  //    // const res = parseUrlStr(queryStr)
  // }
    api.wx.shareSetting({shareindex: 'index'}).then(res => {
      this.setState({
        shareInfo: res
      })
    })
  }

  async fetchSetInfo() {
    const setUrl = '/pagestemplate/setInfo'
    const {is_open_recommend, is_open_scan_qrcode, is_open_wechatapp_location,is_open_official_account} = await req.get(setUrl)
    this.setState({
      is_open_recommend: is_open_recommend,
      is_open_scan_qrcode: is_open_scan_qrcode,
      is_open_wechatapp_location: is_open_wechatapp_location,
      is_open_official_account:is_open_official_account
    }, async() => {
      let isNeedLoacate = is_open_wechatapp_location == 1 ? true : false
      const options = this.$router.params
      const res = await entry.entryLaunch(options, isNeedLoacate)
      const { store } = res
      if (!isArray(store)) {
        this.setState({
          curStore: store
        }, () => {
          this.fetchData()
        })
      }
    })
  }

  fetchData() {
    this.fetchInfo(async () => {
      // const url = '/pageparams/setting?template_name=yykweishop&version=v1.0.1&page_name=index&name=search'
      const { is_open, ad_pic, ad_title } = await api.promotion.automatic({register_type: 'general'})
      this.setState({
        automatic: {
          title: ad_title,
          isOpen: is_open === 'true',
          adPic: ad_pic
        }
        // positionStatus: (fixSetting.length && fixSetting[0].params.config.fixTop) || false
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
    })
  }

  componentDidShow = () => {
    const options = this.$router.params
    const { curStore } = this.state
    const curStoreLocal = Taro.getStorageSync('curStore')
    if (!isArray(curStoreLocal)) {
      if (!curStore || (curStoreLocal.distributor_id != curStore.distributor_id)) {
        this.setState({
          curStore: curStoreLocal,
          likeList: [],
          wgts: null
        }, () => {
          this.fetchData()
        })
      }
    }

    Taro.getStorage({ key: 'addTipIsShow' })
      .then(() => { })
      .catch((error) => {
        console.log(error)
        this.setState({
          isShowAddTip: true
        })
      })

    const { smid, dtid } = normalizeQuerys(options)

    if (smid) {
      Taro.setStorageSync('s_smid', smid)
    }

    if (dtid) {
      Taro.setStorageSync('s_dtid', dtid)
    }

    this.isShoppingGuide()

    // 获取店铺精选信息
    this.getDistributionInfo()
  }

  config = {
    enablePullDownRefresh: true,
    backgroundTextStyle: 'dark',
    onReachBottomDistance: 50
  }

  onPullDownRefresh = () => {
    Tracker.dispatch("PAGE_PULL_DOWN_REFRESH");
    this.resetPage()
    this.setState({
      likeList: [],
      wgts: null
    }, () => {
      let { curStore } = this.state
      const curStoreLocal = Taro.getStorageSync('curStore')
      if (curStore) {
        this.fetchData()
      } else if (!isArray(curStoreLocal)) {
        this.setState({
          curStore: curStoreLocal
        }, () => {
          this.fetchData()
        })
      }
    })
  }

  onPageScroll = (res) => {
    const { scrollTop } = res
    this.setState({
      top: scrollTop
    })
  }

  onReachBottom = () => {
    this.nextPage()
  }

  /**
 * 检测有没有绑定导购员
 * */
  async isShoppingGuide() {
    let token = S.getAuthToken()
    if (!token) return;

    let salesperson_id = Taro.getStorageSync('s_smid')
    if (!salesperson_id) return;

    // 判断是否已经绑定导购员
    let info = await api.member.getUsersalespersonrel({
      salesperson_id
    })
    console.log('getUsersalespersonrel --- val:', info)
    if (info.is_bind === '1') return

    // 绑定导购
    await api.member.setUsersalespersonrel({
      salesperson_id
    })
  }

  // 获取店铺精选
  getDistributionInfo() {
    const distributionShopId = Taro.getStorageSync('distribution_shop_id')
    const { userId } = Taro.getStorageSync('userinfo')
    if (!S.getAuthToken() && !distributionShopId) {
      return
    }
    const param = {
      user_id: distributionShopId || userId
    }
    api.distribution.info(param).then(res => {

      let featuredshop = ''
      const { user_id, is_valid, selfInfo = {}, parentInfo = {} } = res
      if (is_valid) {
        featuredshop = user_id
      } else if (selfInfo.is_valid) {
        featuredshop = selfInfo.user_id
      } else if (parentInfo.is_valid) {
        featuredshop = parentInfo.user_id
      }
      this.setState({
        featuredshop
      })
    })
  }

  onShareAppMessage() {
    const res = this.state.shareInfo
    const { userId } = Taro.getStorageSync('userinfo')
    const query = userId ? `/pages/index?uid=${userId}` : '/pages/index'
    return {
      title: res.title,
      imageUrl: res.imageUrl,
      path: query
    }
  }

  onShareTimeline() {
    const { userId } = Taro.getStorageSync('userinfo')
    const res = this.state.shareInfo
    const query = userId ? `uid=${userId}` : ''
    return {
      title: res.title,
      imageUrl: res.imageUrl,
      query: query
    }
  }

  async fetchCartcount() {
    if (!S.getAuthToken()) {
      return
    }

    try {
      const { item_count } = await api.cart.count({ shop_type: 'distributor' })
      this.props.onUpdateCartCount(item_count)
    } catch (e) {
      console.error(e)
    }
  }
  async fetchInfo(cb) {
    const { curStore } = this.state
    if (!curStore.distributor_id) {
      return
    }
    // const url = '/pageparams/setting?template_name=yykweishop&version=v1.0.1&page_name=index'
    const url = '/pagestemplate/detail?template_name=yykweishop&weapp_pages=index&distributor_id=' + curStore.distributor_id
    const info = await req.get(url)
    this.setState({
      wgts: isArray(info) ? [] : info.config
    }, () => {
      if (cb) {
        cb(info)
      }
      Taro.stopPullDownRefresh()
      if (!isArray(info) && info.config) {
        const searchWgt = info.config.find(item => item.name == 'search')
        this.setState({
          positionStatus: searchWgt && searchWgt.config && searchWgt.config.fixTop
        })
        // const show_likelist = info.config.find(item => item.name == 'setting' && item.config.faverite)
        if (this.state.is_open_recommend == 1) {
          this.props.onUpdateLikeList(true)
          this.resetPage()
          this.setState({
            likeList: []
          })
          this.nextPage()
        } else {
          this.props.onUpdateLikeList(false)
        }
      }
    })
  }

  async fetch(params) {
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
      distributor_id: 'distributor_id',
      promotion_activity_tag: 'promotion_activity',
      price: ({ price }) => (price / 100).toFixed(2),
      member_price: ({ member_price }) => (member_price / 100).toFixed(2),
      market_price: ({ market_price }) => (market_price / 100).toFixed(2),
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
    Taro.setStorage({ key: 'addTipIsShow', data: { isShowAddTip: false } })
    this.setState({
      isShowAddTip: false
    })
  }

  handleClickShop = () => {
    const { featuredshop } = this.state
    Taro.navigateTo({
      url: `/pages/distribution/shop-home?featuredshop=${featuredshop}`
    })
  }
  handleOfficialError=()=>{
   
  }
  handleOfficialClose =()=>{
    this.setState({
      show_official:false
    })
    Taro.setStorageSync('close_official',true)
  }

  render () {
    const { wgts, page, likeList, showBackToTop, isShowAddTip, curStore, positionStatus, automatic, showAuto, featuredshop, is_open_recommend, is_open_scan_qrcode,is_open_official_account,show_official,showCloseBtn } = this.state
    // const { showLikeList } = this.props
    // const user = Taro.getStorageSync('userinfo')
    // const isPromoter = user && user.isPromoter
    // const distributionShopId = Taro.getStorageSync('distribution_shop_id')

    // if (!wgts || !this.props.store) {
    if (!this.props.store) {
      return <Loading />
    }
		// const show_location = wgts.find(item=>item.name=='setting'&&item.config.location)
    return (
      <View className='page-index'>
          {
            is_open_official_account === 1 && show_official && (
              <AccountOfficial
                onHandleError={this.handleOfficialError.bind(this)}
                onClick={this.handleOfficialClose.bind(this)}
                isClose={true}
            >

          </AccountOfficial>
            )
          }
        {
          APP_PLATFORM === 'standard' && curStore &&
          <HeaderHome
            store={curStore}
            isOpenScanQrcode={is_open_scan_qrcode}
          />
        }

        <View className={classNames('wgts-wrap', APP_PLATFORM !== 'standard' &&
          'wgts-wrap_platform', positionStatus && (APP_PLATFORM !== 'standard' || curStore.distributor_id == 0 ? 'wgts-wrap__fixed' : 'wgts-wrap__fixed_standard'), !curStore && 'wgts-wrap-nolocation')}
        >
          <View className='wgts-wrap__cont'>
            {wgts && <HomeWgts
              wgts={wgts}
            />}
            {likeList.length > 0 && is_open_recommend == 1 && (
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

        {
          <FloatMenus>
            {
              // isShop && isShop.isOpenShop === 'true' && isShop.shop_status === 1 &&
              featuredshop &&
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
