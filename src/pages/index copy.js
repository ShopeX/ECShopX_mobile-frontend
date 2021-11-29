import React, { Component } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Image } from '@tarojs/components'
import { connect } from 'react-redux'
import qs from 'qs'
import {
  TabBar,
  BackToTop,
  FloatMenus,
  FloatMenuItem,
  AccountOfficial,
  ScreenAd,
  CouponModal,
  PrivacyConfirmModal,
  SpStorePicker,
  SpSearch
} from '@/components'
import req from '@/api/req'
import api from '@/api'
import {
  pickBy,
  classNames,
  styleNames,
  getThemeStyle,
  isArray,
  isAlipay,
  payTypeField
} from '@/utils'
import { platformTemplateName } from '@/utils/platform'
import entry from '@/utils/entry'
import { withPager, withBackToTop } from '@/hocs'
import S from '@/spx'
// import { Tracker } from '@/service'
import { WgtGoodsFaverite, HeaderHome } from './home/wgts'
import HomeWgts from './home/comps/home-wgts'
import Automatic from './home/comps/automatic'

import './home/index.scss'

@connect(
  ({ cart, member, store }) => ({
    store,
    list: cart.list,
    cartIds: cart.cartIds,
    cartCount: cart.cartCount,
    showLikeList: cart.showLikeList,
    showAdv: member.showAdv,
    favs: member.favs
  }),
  (dispatch) => ({
    onUpdateLikeList: (show_likelist) =>
      dispatch({ type: 'cart/updateLikeList', payload: show_likelist }),
    onUpdateCartCount: (count) => dispatch({ type: 'cart/updateCount', payload: count })
  })
)
@withPager
@withBackToTop
export default class Home extends Component {
  $instance = getCurrentInstance();
  constructor(props) {
    super(props)
    this.autoCloseTipId = null
    this.currentLoadIndex = -1
    this.state = {
      ...this.state,
      wgts: [],
      wgtsList: [],
      likeList: [],
      isShowAddTip: false,
      curStore: {
        distributor_id: 0
      },
      positionStatus: false,
      automatic: null,
      showAuto: true,
      // top: 0,
      isShop: null,
      salesperson_id: '',
      // 店铺精选id
      featuredshop: '',
      // 分享配置
      shareInfo: {},
      is_open_recommend: null,
      is_open_scan_qrcode: null,
      is_open_official_account: null,
      is_open_store_status: null,
      show_official: true,
      showCloseBtn: false,
      // 是否有跳转至店铺页
      isGoStore: false,
      show_tabBar: true,
      advertList: [],
      currentShowAdvert: 0,
      recommendList: null,
      all_card_list: [],
      visible: false,
      PrivacyConfirmModalVisible: false
    }
  }

  componentDidMount() {
    this.protocolUpdateTime()
    this.getShareSetting()
    this.isShowTips()
    this.getPrivacyTitle()
  }

  // 获取隐私政策时间
  async protocolUpdateTime() {
    const isLocal = await entry.getLocalSetting()
    console.log('=============isLocal', isLocal)

    const privacy_time = Taro.getStorageSync('PrivacyUpdate_time')
    const result = await api.wx.getPrivacyTime()
    const { update_time } = result

    if ((!String(privacy_time) || privacy_time != update_time) && isLocal) {
      this.setState({
        PrivacyConfirmModalVisible: true
      })
    } else {
      this.getHomeSetting()
    }

    // this.getHomeSetting();
    // this.getShareSetting();
    // this.isShowTips();
  }
  // 隐私协议
  PrivacyConfirmModalonChange = async (type) => {
    if (type === 'agree') {
      const result = await api.wx.getPrivacyTime()
      const { update_time } = result

      Taro.setStorageSync('PrivacyUpdate_time', update_time)
      this.getHomeSetting()
    } else {
      Taro.removeStorageSync('PrivacyUpdate_time')
      Taro.removeStorageSync('auth_token')
      const {
        is_open_scan_qrcode,
        is_open_recommend,
        is_open_wechatapp_location,
        is_open_official_account
      } = Taro.getStorageSync('settingInfo')
      let { distributor_id } = Taro.getStorageSync('curStore')
      const store = await entry.handleDistributorId(distributor_id)
      this.setState(
        {
          curStore: store,
          is_open_scan_qrcode: is_open_scan_qrcode,
          is_open_recommend,
          is_open_wechatapp_location,
          is_open_official_account
        },
        () => {
          this.getWgts()
          this.getAutoMatic()
        }
      )
    }
    this.setState({
      PrivacyConfirmModalVisible: false
    })
  }

  // 检测收藏变化
  // componentWillReceiveProps(next) {
  //   if (Object.keys(this.props.favs).length !== Object.keys(next.favs).length) {
  //     setTimeout(() => {
  //       const likeList = this.state.likeList.map(item => {
  //         item.is_fav = Boolean(next.favs[item.item_id]);
  //         return item;
  //       });
  //       this.setState({
  //         likeList
  //       });
  //     });
  //   }
  // }

  componentDidShow() {
    // this.showInit();
    // this.isShoppingGuide();
    // this.getDistributionInfo();
    // 检测白名单
    this.checkWhite()
    // 购物车数量
    this.fetchCartCount()
    this.getPointSetting()
    if (S.getAuthToken()) {
      this.getCurrentGrad()
    }
  }

  // 配置信息
  config = {
    enablePullDownRefresh: true,
    backgroundTextStyle: 'dark',
    onReachBottomDistance: 50
  }

  getCurrentGrad = () => {
    api.vip.getCurrentGradList().then((res) => {
      this.fetchCouponCardList(res.type)
    })
  }

  // 下拉刷新
  onPullDownRefresh = () => {
    Tracker.dispatch('PAGE_PULL_DOWN_REFRESH')
    this.resetPage()
    this.setState(
      {
        likeList: [],
        wgts: [],
        wgtsList: []
      },
      () => {
        let { curStore } = this.state
        const curStoreLocal = Taro.getStorageSync('curStore')
        if (curStore) {
          this.getWgts()
          this.getAutoMatic()
        } else if (!isArray(curStoreLocal)) {
          this.setState(
            {
              curStore: curStoreLocal
            },
            () => {
              this.getWgts()
              this.getAutoMatic()
            }
          )
        }
      }
    )
  }

  // 触底事件
  onReachBottom = () => {
    this.nextPage()
  }

  // 分享
  onShareAppMessage(params) {
    const shareInfo = this.shareInfo()

    console.log('--onShareAppMessage--', shareInfo)

    return {
      ...shareInfo
    }
  }

  // 分享朋友圈
  onShareTimeline(params) {
    const shareInfo = this.shareInfo('time')

    return {
      ...shareInfo
    }
  }

  // 分享信息
  shareInfo = (type = '') => {
    const res = this.state.shareInfo
    const { userId } = Taro.getStorageSync('userinfo')
    let query = userId ? `/pages/index?uid=${userId}` : '/pages/index'
    if (type) {
      query = userId ? `uid=${userId}` : ''
    }
    const path = type ? 'query' : 'path'
    const params = {
      title: res.title,
      imageUrl: res.imageUrl,
      [path]: query,
      share_title: res.title
    }
    return params
  }

  // 获取分享配置
  getShareSetting = async () => {
    const res = await api.wx.shareSetting({ shareindex: 'index' })
    this.setState({
      shareInfo: res
    })
  }

  //获取积分配置
  getPointSetting = () => {
    api.pointitem.getPointSetting().then((pointRes) => {
      Taro.setStorageSync('custom_point_name', pointRes.name)
    })
  }

  // show显示初始化
  showInit = () => {
    const { curStore, is_open_store_status, isGoStore } = this.state
    const curStoreLocal = Taro.getStorageSync('curStore') || {}
    //非自提门店判断
    const localdis_id = is_open_store_status ? curStoreLocal.store_id : curStoreLocal.distributor_id

    // 是否切换店铺
    if (!isArray(curStoreLocal) && isGoStore) {
      if (!curStore || localdis_id != curStore.distributor_id) {
        this.setState(
          {
            isGoStore: false,
            curStore: curStoreLocal,
            likeList: [],
            wgts: [],
            wgtsList: []
          },
          () => {
            this.getWgts()
            this.getAutoMatic()
          }
        )
      } else {
        this.setState({
          isGoStore: false
        })
      }
    }
  }

  // 是否显示tips
  isShowTips = () => {
    const addTipIsShow = Taro.getStorageSync('addTipIsShow')
    if (addTipIsShow !== false) {
      this.setState(
        {
          isShowAddTip: true
        },
        () => {
          this.autoCloseTipId = setTimeout(() => {
            this.handleClickCloseAddTip()
          }, 30000)
        }
      )
    }
  }

  // 是否绑定导购
  isShoppingGuide = async () => {
    let token = S.getAuthToken()
    if (!token) return false
    let salesperson_id = Taro.getStorageSync('s_smid')
    if (!salesperson_id) return
    // 判断是否已经绑定导购员
    let info = await api.member.getUsersalespersonrel({
      salesperson_id
    })
    if (info.is_bind === '1') return false
    // 绑定导购
    await api.member.setUsersalespersonrel({
      salesperson_id
    })
  }

  // 获取店铺精选
  getDistributionInfo = async () => {
    const distributionShopId = Taro.getStorageSync('distribution_shop_id')
    const { userId } = Taro.getStorageSync('userinfo')
    let featuredshop = ''
    if (!S.getAuthToken() && !distributionShopId) {
      return
    }
    const param = {
      user_id: distributionShopId || userId
    }
    const res = await api.distribution.info(param)
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
  }

  // 白名单
  checkWhite = () => {
    const setting = Taro.getStorageSync('otherSetting')
    if (!S.getAuthToken()) {
      if (setting.whitelist_status) {
        this.setState({
          show_tabBar: false
        })
        S.login(this, true)
      }
    }
  }

  // 获取首页配置
  getHomeSetting = async () => {
    const is_open_store_status = await entry.getStoreStatus()
    const {
      is_open_recommend,
      is_open_scan_qrcode,
      is_open_wechatapp_location,
      is_open_official_account
    } = Taro.getStorageSync('settingInfo')
    const isNeedLoacate = is_open_wechatapp_location == 1
    const options = this.$instance.router.params
    options.isStore = is_open_store_status
    const res = await entry.entryLaunch(options, isNeedLoacate)
    const { store } = res
    console.log('store===========', store)
    if (!isArray(store)) {
      this.setState(
        {
          curStore: store,
          is_open_recommend,
          is_open_scan_qrcode,
          is_open_store_status,
          is_open_wechatapp_location,
          is_open_official_account
        },
        () => {
          this.getWgts()
          this.getAutoMatic()
        }
      )
    }
  }

  //获取店铺id
  getDistributionId = () => {
    const { curStore, is_open_store_status, is_open_recommend } = this.state
    let curdis_id = curStore && is_open_store_status ? curStore.store_id : curStore.distributor_id
    if (!curStore.distributor_id && curStore.distributor_id !== 0) {
      return
    }
    if (process.env.APP_PLATFORM === 'platform') {
      curdis_id = 0
    }
    return { distributor_id: curdis_id }
  }

  //获取店铺id
  getDistributionId = async () => {
    const { curStore, is_open_store_status, is_open_recommend } = this.state
    let curdis_id = curStore && is_open_store_status ? curStore.store_id : curStore.distributor_id
    if (!curStore.distributor_id && curStore.distributor_id !== 0) {
      return
    }
    if (process.env.APP_PLATFORM === 'platform' || isAlipay) {
      curdis_id = 0
    }

    let pathparams = qs.stringify({
      template_name: platformTemplateName,
      weapp_pages: 'index',
      distributor_id: curdis_id,
      ...payTypeField
    })
    const url = `/pagestemplate/detail?${pathparams}`
    const info = await req.get(url)
    const wgts = isArray(info) ? [] : info.config
    const wgtsList = isArray(info) ? [] : info.list
    this.setState(
      {
        wgts: wgts.length > 5 ? wgts.slice(0, 5) : wgts,
        wgtsList
      },
      () => {
        // 0.5s后补足缺失挂件
        setTimeout(() => {
          this.setState({
            wgts,
            wgtsList
          })
        }, 500)
        Taro.stopPullDownRefresh()
        if (!isArray(info) && info.config) {
          const searchWgt = info.config.find((item) => item.name == 'search')
          this.setState({
            positionStatus: searchWgt && searchWgt.config && searchWgt.config.fixTop
          })
          if (is_open_recommend === 1) {
            this.props.onUpdateLikeList(true)
            this.resetPage()
            this.setState(
              {
                likeList: []
              },
              () => {
                this.nextPage()
              }
            )
          } else {
            this.props.onUpdateLikeList(false)
          }
        }
      }
    )
    // Taro.setStorageSync("isPrivacy", false);
  }

  // 获取挂件配置
  // getWgts = async () => {
  //   const { curStore, is_open_store_status, is_open_recommend } = this.state;
  //   let curdis_id =
  //     curStore && is_open_store_status
  //       ? curStore.store_id
  //       : curStore.distributor_id;
  //   if (!curStore.distributor_id && curStore.distributor_id !== 0) {
  //     return;
  //   }
  //   if (process.env.APP_PLATFORM === "platform") {
  //     curdis_id = 0;
  //   }
  //   const url = `/pagestemplate/detail?template_name=yykweishop&weapp_pages=index&distributor_id=${curdis_id}`;
  //   const info = await req.get(url);
  //   const wgts = isArray(info) ? [] : info.config;
  //   const wgtsList = isArray(info) ? [] : info.list;
  //   this.setState(
  //     {
  //       wgts: wgts.length > 5 ? wgts.slice(0, 5) : wgts,
  //       wgtsList
  //     },
  //     () => {
  //       // 0.5s后补足缺失挂件
  //       setTimeout(() => {
  //         this.setState({
  //           wgts,
  //           wgtsList
  //         });
  //       }, 500);
  //       Taro.stopPullDownRefresh();
  //       if (!isArray(info) && info.config) {
  //         const searchWgt = info.config.find(item => item.name == "search");
  //         this.setState({
  //           positionStatus:
  //             searchWgt && searchWgt.config && searchWgt.config.fixTop
  //         });
  //         if (is_open_recommend === 1) {
  //           this.props.onUpdateLikeList(true);
  //           this.resetPage();
  //           this.setState(
  //             {
  //               likeList: []
  //             },
  //             () => {
  //               this.nextPage();
  //             }
  //           );
  //         } else {
  //           this.props.onUpdateLikeList(false);
  //         }
  //       }
  //     }
  //   );
  // };

  // 获取弹窗广告配置
  getAutoMatic = async () => {
    const { general, membercard } = await api.promotion.automatic({
      register_type: 'all'
    })

    let openAdvertList = [general || {}, membercard || {}]
      .filter((item) => item.is_open === 'true')
      .map((item) => ({ adPic: item.ad_pic, title: item.ad_title }))

    this.setState({
      advertList: openAdvertList
    })
  }

  // 获取猜你喜欢
  fetch = async (params) => {
    const { page_no: page, page_size: pageSize } = params
    const query = {
      page,
      pageSize
    }
    const { list, total_count: total } = await api.cart.likeList(query)
    const { favs } = this.props

    const nList = pickBy(list, {
      img: 'pics[0]',
      item_id: 'item_id',
      title: 'itemName',
      distributor_id: 'distributor_id',
      origincountry_name: 'origincountry_name',
      origincountry_img_url: 'origincountry_img_url',
      promotion_activity_tag: 'promotion_activity',
      type: 'type',
      price: ({ price }) => (price / 100).toFixed(2),
      member_price: ({ member_price }) => (member_price / 100).toFixed(2),
      market_price: ({ market_price }) => (market_price / 100).toFixed(2),
      desc: 'brief',
      is_fav: ({ item_id }) => Boolean(favs[item_id])
    })

    this.setState({
      likeList: [...this.state.likeList, ...nList]
    })

    return {
      total
    }
  }

  // 获取购物车数量
  async fetchCartCount() {
    if (!S.getAuthToken()) return
    try {
      const res = await api.cart.count({ shop_type: 'distributor' })
      this.props.onUpdateCartCount(res.item_count)
    } catch (e) {
      console.log(e)
    }
  }

  // 跳转选择店铺
  goStore = () => {
    this.setState({
      isGoStore: true
    })
  }

  // 订阅错误事件
  handleOfficialError = () => {}

  // 关闭订阅公众号
  handleOfficialClose = () => {
    this.setState({
      show_official: false
    })
    Taro.setStorageSync('close_official', true)
  }

  // 注册享大礼品
  handleGift = async () => {
    if (!S.getAuthToken()) {
      setTimeout(() => {
        S.login(this)
      }, 1000)
    }
  }

  // 关闭tips
  handleClickCloseAddTip = () => {
    if (this.autoCloseTipId) clearTimeout(this.autoCloseTipId)
    Taro.setStorageSync('addTipIsShow', false)
    this.setState({
      isShowAddTip: false
    })
  }

  // 跳转店铺页面
  handleClickShop = () => {
    const { featuredshop } = this.state
    Taro.navigateTo({
      url: `/marketing/pages/distribution/shop-home?featuredshop=${featuredshop}`
    })
  }

  handleClickShop2 = () => {
    const { featuredshop } = this.state
    Taro.navigateTo({
      url: `/pages/pointitem/list`
    })
  }

  // 显示浮窗广告
  handleAutoClick = () => {
    const { showAuto } = this.state
    this.setState({
      showAuto: !showAuto
    })
  }

  handleSwitchAdvert = (showIdx) => {
    this.setState({
      currentShowAdvert: ++showIdx
    })
  }

  handleLoadMore = async (currentIndex, compType, currentTabIndex, currentLength) => {
    if (isAlipay) return
    const { id } = this.state.wgtsList.find((_, index) => currentIndex === index) || {}
    this.currentLoadIndex = currentIndex

    let params = {
      template_name: platformTemplateName,
      weapp_pages: 'index',
      page: 1,
      page_size: currentLength + 50,
      weapp_setting_id: id,
      ...this.getDistributionId()
    }
    if (isAlipay) {
      delete params.weapp_setting_id
    }
    let loadData
    if (compType === 'good-grid' || compType === 'good-scroll') {
      loadData = await api.wx.loadMoreGoods(params)
      this.state.wgts.splice(this.currentLoadIndex, 1, loadData.config[0])
    } else if (compType === 'good-grid-tab') {
      params.goods_grid_tab_id = currentTabIndex
      loadData = await api.wx.loadMoreGoods(params)
      let allGridGoods = this.state.wgts[currentIndex].list
      let changeGoods = loadData.config[0].list[0]
      allGridGoods.splice(currentTabIndex, 1, changeGoods)
      this.state.wgts.splice(this.currentLoadIndex, 1, {
        ...loadData.config[0],
        list: allGridGoods
      })
    }

    this.setState({
      wgts: [...this.state.wgts]
    })
  }

  fetchCouponCardList(receive_type) {
    api.vip.getShowCardPackage({ receive_type }).then(({ all_card_list }) => {
      if (all_card_list && all_card_list.length > 0) {
        this.setState({ visible: true })
      }
      this.setState({ all_card_list })
    })
  }

  handleCouponChange = (visible, type) => {
    if (type === 'jump') {
      Taro.navigateTo({
        url: `/marketing/pages/member/coupon`
      })
    }
    this.setState({ visible })
  }

  async getPrivacyTitle() {
    const data = await api.shop.getStoreBaseInfo()
    Taro.setStorageSync(
      'privacy_info',
      data.protocol || { member_register: '注册协议', privacy: '隐私政策' }
    )
  }

  render() {
    const {
      show_tabBar,
      isShowAddTip,
      showBackToTop,
      automatic,
      advertList,
      currentShowAdvert,
      showAuto,
      featuredshop,
      wgts,
      searchWgt,
      positionStatus,
      curStore,
      is_open_recommend,
      likeList,
      page,
      is_open_official_account,
      is_open_store_status,
      show_official,
      recommendList,
      visible,
      all_card_list,
      PrivacyConfirmModalVisible
    } = this.state

    const pages = Taro.getCurrentPages()
    // 广告屏
    const { showAdv } = this.props
    // 是否是标准版
    const isStandard = process.env.APP_PLATFORM === 'standard' && !is_open_store_status
    // 否是fixed
    const isFixed = positionStatus

    const { is_open_scan_qrcode } = Taro.getStorageSync('settingInfo')
    console.log(Taro.getStorageSync('settingInfo'))
    const { openStore } = Taro.getStorageSync('otherSetting')
    return (
      <View className='page-index' style={styleNames(getThemeStyle())}>
        {/* 公众号关注组件 */}
        {process.env.TARO_ENV == 'weapp' && is_open_official_account === 1 && show_official && (
          <AccountOfficial
            isClose
            onHandleError={this.handleOfficialError.bind(this)}
            onClick={this.handleOfficialClose.bind(this)}
          ></AccountOfficial>
        )}

        <View className='header-block'>
          {openStore && (
            <View className='block-hd'>
              <SpStorePicker />
            </View>
          )}
          <View className='block-bd'>
            <SpSearch info={searchWgt} />
          </View>
          {is_open_scan_qrcode}
          {is_open_scan_qrcode == 1 && (
            <View className='block-fd'>
              <SpScancode />
            </View>
          )}
        </View>

        <View
          className={classNames('wgts-wrap', {
            'has-header-block': openStore || is_open_scan_qrcode
          })}
        >
          <View className='wgts-wrap__cont'>
            {/* 挂件内容 */}
            <HomeWgts wgts={wgts} loadMore={this.handleLoadMore} />

            {/* 猜你喜欢 */}
            {recommendList && <SpRecommend info={recommendList} />}

            {/* {!isAlipay && likeList.length > 0 && is_open_recommend == 1 && (
              <View className="faverite-list">
                <WgtGoodsFaverite info={likeList} />
                {page.isLoading ? <Loading>正在加载...</Loading> : null}
                {!page.isLoading && !page.hasNext && !likeList.length && (
                  <SpNote img="trades_empty.png">暂无数据~</SpNote>
                )}
              </View>
            )} */}
          </View>
        </View>

        {/* 浮动按钮 */}
        <FloatMenus>
          {show_tabBar && featuredshop && (
            <Image
              className='distribution-shop'
              src='/assets/imgs/gift_mini.png'
              mode='widthFix'
              onClick={this.handleClickShop.bind(this)}
            />
          )}
          {advertList && advertList.length && !S.getAuthToken() && (
            <FloatMenuItem
              iconPrefixClass='icon'
              icon='present'
              onClick={this.handleSwitchAdvert.bind(this, -1)}
            />
          )}
        </FloatMenus>

        {/* 浮窗广告 */}
        {advertList &&
          advertList.length &&
          !S.getAuthToken() &&
          advertList.map((item, index) => {
            return (
              <Automatic
                info={item}
                isShow={currentShowAdvert === index}
                onClick={this.handleGift.bind(this)}
                onClose={this.handleSwitchAdvert.bind(this, index)}
              />
            )
          })}
        {/* 返回顶部 */}
        <BackToTop show={showBackToTop} onClick={this.scrollBackToTop.bind(this)} />
        {/* addTip */}
        {isShowAddTip && !isAlipay && (
          <View className='add_tip'>
            <View class='tip-text'>点击“•●•”添加到我的小程序，微信首页下拉即可快速访问店铺</View>
            <View className='icon-close icon-view' onClick={this.handleClickCloseAddTip.bind(this)}>
              {' '}
            </View>
          </View>
        )}

        {/* 开屏广告 */}
        {showAdv && <ScreenAd />}
        <CouponModal visible={visible} list={all_card_list} onChange={this.handleCouponChange} />
        {/* 隐私弹窗 */}
        <PrivacyConfirmModal
          visible={PrivacyConfirmModalVisible}
          onChange={this.PrivacyConfirmModalonChange}
          isPhone={false}
        ></PrivacyConfirmModal>
      </View>
    )
  }
}
