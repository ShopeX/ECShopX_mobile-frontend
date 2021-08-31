/* eslint-disable react/jsx-key */
import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Swiper, SwiperItem, Image, Video, Canvas } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtCountdown } from 'taro-ui'
import { Loading, Price, FloatMenus, FloatMenuItem, SpHtmlContent, SpToast, NavBar, GoodsBuyPanel, SpCell, GoodsEvaluation, FloatMenuMeiQia, GoodsItem ,PointLine} from '@/components'
import api from '@/api'
import req from '@/api/req'
import { withPager, withBackToTop,withPointitem } from '@/hocs'
import { log, calcTimer, isArray, pickBy, canvasExp, normalizeQuerys, buriedPoint } from '@/utils'
import entry from '@/utils/entry'
import S from '@/spx'
import { Tracker } from "@/service"
import { GoodsBuyToolbar, ItemImg, ImgSpec, StoreInfo, ActivityPanel, SharePanel, VipGuide, ParamsItem, GroupingItem } from './comps'
import { linkPage } from '../home/wgts/helper'
import { WgtFilm, WgtSlider, WgtWriting, WgtGoods, WgtHeading } from '../home/wgts'
import { getDtidIdUrl } from '@/utils/helper'

import './espier-detail.scss'

@connect(({ cart, member, colors }) => ({
  cart,
  colors: colors.current,
  favs: member.favs,
  showLikeList: cart.showLikeList
}), (dispatch) => ({
  onFastbuy: (item) => dispatch({ type: 'cart/fastbuy', payload: { item } }),
  onAddCart: (item) => dispatch({ type: 'cart/add', payload: { item } }),
  onUpdateCount: (count) => dispatch({ type: 'cart/updateCount', payload: count }),
  onAddFav: ({ item_id, fav_id }) => dispatch({ type: 'member/addFav', payload: { item_id, fav_id } }),
  onDelFav: ({ item_id }) => dispatch({ type: 'member/delFav', payload: { item_id } })
}))
@withPager
@withBackToTop
@withPointitem
export default class Detail extends Component {

  constructor(props) {
    super(props)

    this.state = {
      ...this.state,
      marketing: 'normal',
      info: null,
      desc: null,
      curImgIdx: 0,
      isPromoter: false,
      timer: null,
      startActivity: true,
      hasStock: true,
      cartCount: '',
      showBuyPanel: false,
      showSharePanel: false,
      showPromotions: false,
      buyPanelType: null,
      specImgsDict: {},
      currentImgs: -1,
      sixSpecImgsDict: {},
      curSku: null,
      promotion_activity: [],
      promotion_package: [],
      itemParams: [],
      sessionFrom: '',
      posterImgs: null,
      poster: null,
      showPoster: false,
      likeList: [],
      evaluationList: [],
      evaluationTotal: 0,
      // 是否订阅
      isSubscribeGoods: false,
      is_open_store_status:null,
      goodType:'normal',
      // 是否能够转发
      canShareInfo: {
        status: false
      }
    }
  }
  

  async componentDidMount() {
    const options = await normalizeQuerys(this.$router.params)
    // Taro.showLoading({
    //   mask: true
    // });
    console.log('options----->',options)
    console.log('[商品详情-发互动埋点上报1]')
    if (options.itemid && !options.id) {
      options.id = options.itemid
    }
    let id = options.id
    let uid = ''
    if(!S.getAuthToken()){
      this.checkWhite()
    }
    const isOpenStore = await entry.getStoreStatus()
    this.setState({
      is_open_store_status:isOpenStore,
      goodType:options.type==="pointitem"?"pointitem":"normal",
    }, async()=>{
      const { is_open_store_status } = this.state
      if (APP_PLATFORM === 'standard') {
       // const { distributor_id } = Taro.getStorageSync('curStore')
        const curStore = Taro.getStorageSync('curStore')
        if(is_open_store_status){
          if (!options.dtid  || options.dtid !== 0) {
            options.dtid = curStore.distributor_id 
          }
        }else{
          if (!options.dtid) {
            delete options.dtid;
          }
        }
      }
      const entryData = await entry.entryLaunch({...options}, true)
      console.log('entryData---->',entryData)
      id = entryData.id
      uid = entryData.uid
      
      if (uid) {
        this.uid = uid
      }
      if (options.scene) {
        const query = await normalizeQuerys(options)
        if (query.id) {
          id = query.id
          uid = query.uid
        }
      }
      this.fetchInfo(id)
      this.getEvaluationList(id)
       // 浏览记录
      if (S.getAuthToken()) {
        try {
          let itemId = ''
          if (id) {
            itemId = id
          } else {
            itemId = this.$router.params.id
          }
          api.member.itemHistorySave(itemId)
        } catch (e) {
          console.log(e)
        }
      }
    }) 
    // 处理定位
    const lnglat = Taro.getStorageSync('lnglat')
    if (lnglat && !lnglat.city) {
      entry.InverseAnalysis(lnglat)
    }
    
    this.isCanShare()    
    // 埋点处理
    buriedPoint.call(this, {
      item_id: id,
      event_type: 'activeItemDetail'
    })
  }

  static options = {
    addGlobalClass: true
  } 

  async componentDidShow() {
    const userInfo = Taro.getStorageSync('userinfo')
    if (S.getAuthToken() && (!userInfo || !userInfo.userId)) {
      const res = await api.member.memberInfo()
      const userObj = {
        username: res.memberInfo.nickname || res.memberInfo.username || res.memberInfo.mobile,
        avatar: res.memberInfo.avatar,
        userId: res.memberInfo.user_id,
        mobile: res.memberInfo.mobile,
        isPromoter: res.is_promoter,
        openid: res.memberInfo.open_id,
        vip: res.vipgrade ? res.vipgrade.vip_type : '',
      }
      Taro.setStorageSync('userinfo', userObj)
    }
    this.fetchCartCount()
  }

  async getEvaluationList( id ) {
    let params = {
      page: 1,
      pageSize: 2,
      item_id: id || this.$router.params.id
    };
    if ( this.isPointitemGood() ) {
      params = {
        ...params,
        order_type: 'pointsmall'
      }
    }
    const { list, total_count } = await api.item.evaluationList(params);
    list.map(item => {
      item.picList = item.rate_pic ? item.rate_pic.split(',') : []
    })

    this.setState({
      evaluationList: list,
      evaluationTotal: total_count
    })
  }

  onShareAppMessage(res) { 
    const { from }=res;
    const { info } = this.state
    const curStore = Taro.getStorageSync('curStore')
    const { userId } = Taro.getStorageSync('userinfo')
    const infoId = info.distributor_id
    const { is_open_store_status} = this.state
    const id = APP_PLATFORM === 'standard' ? is_open_store_status ? curStore.store_id: curStore.distributor_id : infoId 

    console.log("我是好友分享",getDtidIdUrl('/pages/item/espier-detail?id='+ info.item_id ,id))

    return {
      title: info.item_name,
      path: getDtidIdUrl('/pages/item/espier-detail?id='+ info.item_id ,id),
      imageUrl: info.pics[0]
    }
  }

  onShareTimeline() {
    const { info } = this.state
    const curStore = Taro.getStorageSync('curStore')
    const { userId } = Taro.getStorageSync('userinfo')
    const { is_open_store_status} = this.state
    const infoId = info.distributor_id
    const id = APP_PLATFORM === 'standard' ? is_open_store_status ? curStore.store_id: curStore.distributor_id : infoId
 
    return {
      title: info.item_name,
      query: getDtidIdUrl(`id=${info.item_id}&uid=${userId}`,id),
      imageUrl: info.pics[0]
    }
  }

  async fetchCartCount() {
    const { info } = this.state
    if (!S.getAuthToken() || !info) return
    const { special_type } = info
    const isDrug = special_type === 'drug'

    try {
      const res = await api.cart.count({ shop_type: isDrug ? 'drug' : 'distributor' })
      this.setState({
        cartCount: res.item_count || ''
      }, () => {
        this.props.onUpdateCount(res.item_count)
      })
    } catch (e) {
      console.log(e)
    }
  }
  async checkWhite () {
    const { status } = await api.wx.getWhiteList()
    if(status == true){
      setTimeout(() => {
        S.login(this, true)
      }, 1000)
    }
  }

  isPointitemGood(){ 
    const options = this.$router.params;
    return options.type==='pointitem';
  }

  async goodInfo(id,param){
    let info;
    if(this.isPointitemGood()){
      info = await api.pointitem.detail(id, param)
    }else{
      info = await api.item.detail(id, param)
    }
    return info;
  }

  async goodPackageList(id){
    let info;
    if(this.isPointitemGood()){
      info={list:[]};
    }else{
      info=await api.item.packageList({ item_id: id })
    }
    return info;
  }

  async fetchInfo(itemId, goodsId) { 
    this.nextPage();
    const { distributor_id, store_id } = Taro.getStorageSync('curStore') 
    const { is_open_store_status } = this.state
    //const isOpenStore = await entry.getStoreStatus()
    let id = ''
    if (itemId) {
      id = itemId
    } else {
      id = this.$router.params.id
    }

    const param = { goods_id: goodsId }

    if(!param.goods_id){
      delete param.goods_id
    }

    if (APP_PLATFORM === 'standard') {
      param.distributor_id = distributor_id 
    } else {
      if (this.$router.params.dtid) {
        param.distributor_id  = this.$router.params.dtid
      } else {
        const options = this.$router.params
        if (options.scene) {
          const query = await normalizeQuerys(options)
          if (query.dtid) {
            param.distributor_id = query.dtid
          }
        }
      }
    }

    if(is_open_store_status){
      delete param.distributor_id
    }
    console.log('param',param)
    // 商品详情 
    const info = await this.goodInfo(id, param);

    // 是否订阅
    const { user_id: subscribe } = await api.user.isSubscribeGoods(id)
    const { intro: desc, promotion_activity: promotion_activity } = info
    let marketing = 'normal'
    let timer = null
    let hasStock = info.store && info.store > 0
    let startActivity = true
    let sessionFrom = ''

    if (info.activity_info) {
      if (info.activity_type === 'group') {
        marketing = 'group'
        timer = calcTimer(info.activity_info.remaining_time)
        hasStock = info.activity_info.store && info.activity_info.store > 0
        startActivity = info.activity_info.show_status === 'noend'
      }
      if (info.activity_type === 'seckill') {
        marketing = 'seckill'
        timer = calcTimer(info.activity_info.last_seconds)
        hasStock = info.activity_info.item_total_store && info.activity_info.item_total_store > 0
        startActivity = info.activity_info.status === 'in_sale'
      }
      if (info.activity_type === 'limited_time_sale') {
        marketing = 'limited_time_sale'
        timer = calcTimer(info.activity_info.last_seconds)
        hasStock = info.item_total_store && info.item_total_store > 0
        startActivity = info.activity_info.status === 'in_sale'
      }
    }

    if (this.$router.path === '/pages/item/espier-detail') {
      Taro.setNavigationBarTitle({
        title: info.item_name
      })
    }

    if (marketing === 'group' || marketing === 'seckill' || marketing === 'limited_time_sale') {
      const { colors } = this.props
      Taro.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: colors.data[0].primary,
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
    }

    const { item_params } = info
    let itemParams = pickBy(item_params, {
      label: 'attribute_name',
      value: 'attribute_value_name'
    })
    itemParams = itemParams.slice(0, 5)

    info.is_fav = Boolean(this.props.favs[info.item_id])
    const specImgsDict = this.resolveSpecImgs(info.item_spec_desc)
    const sixSpecImgsDict = pickBy(info.spec_images, {
      url: 'spec_image_url',
      images: 'item_image_url',
      specValueId: 'spec_value_id'
    })

    sessionFrom += '{'
    if (Taro.getStorageSync('userinfo')) {
      sessionFrom += `"nickName": "${Taro.getStorageSync('userinfo').username}", `
    }
    sessionFrom += `"商品": "${info.item_name}"`
    sessionFrom += '}' 

    Tracker.dispatch("GOODS_DETAIL_VIEW", info);

    this.setState({
      info,
      marketing,
      timer,
      hasStock,
      startActivity,
      specImgsDict,
      sixSpecImgsDict,
      promotion_activity,
      itemParams,
      sessionFrom,
      isSubscribeGoods: !!subscribe
    }, async () => {
      let contentDesc = ''

      if (!isArray(desc)) {
        if (info.videos_url) {
          contentDesc += `<video src=${info.videos} controls style='width:100%'></video>` + desc
        } else {
          contentDesc = desc
        }
      } else {
        contentDesc = desc
      }
      let promotion_package = null
      const { list } = await this.goodPackageList(id);
      if (list.length) {
        promotion_package = list.length
      }
      this.setState({
        desc: contentDesc,
        promotion_package
      })
      this.fetchCartCount()
      // this.downloadPosterImg()
    })

    log.debug('fetch: done', info)
  }

  async goodLikeList(query){ 
    const { id } = this.$router.params;
    let info;
    if(this.isPointitemGood()){
      info = await api.pointitem.likeList({
        item_id:id
      })
    }else{
      info = await api.cart.likeList(query)
    }
    return info;
  }

  async fetch(params) { 
    const { page_no: page, page_size: pageSize } = params
    const query = {
      page,
      pageSize
    }
 
    const { list, total_count: total } = await this.goodLikeList(query)

    const nList = pickBy(list, {
      img: 'pics[0]',
      item_id: 'item_id',
      title: 'itemName',
      point:'point',
      distributor_id: 'distributor_id',
      promotion_activity_tag: 'promotion_activity',
      price: ({ price }) => { return (price / 100).toFixed(2) },
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

  resolveSpecImgs(specs) {
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

  handleMenuClick = async (type) => {
    const { info } = this.state
    const isAuth = S.getAuthToken()
    if (type === 'fav') {
      if (!isAuth) {
        Taro.showToast({
          icon:'none',
          title: '请登录后再收藏'
        })
        setTimeout(() => {
          S.login(this)
        }, 2000)

        return
      }

      if (!info.is_fav) {
        const favRes = await api.member.addFav(info.item_id,{
          item_type:this.isPointitemGood()?"pointsmall":undefined
        })
        Tracker.dispatch("GOODS_COLLECT", info);
        this.props.onAddFav(favRes)
        Taro.showToast({
          icon:'none',
          title: '已加入收藏'
        })
      } else {
        await api.member.delFav(info.item_id)
        this.props.onDelFav(info)
        Taro.showToast({
          icon:'none',
          title: '已移出收藏'
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

  handleSepcImgClick = (index) => {
    const { sixSpecImgsDict, info } = this.state
    this.setState({
      currentImgs: index
    })
    if (sixSpecImgsDict[index].images.length || sixSpecImgsDict[index].url) {
      info.pics = sixSpecImgsDict[index].images.length > 0 ? sixSpecImgsDict[index].images : [sixSpecImgsDict[index].url]
      this.setState({
        info,
        curImgIdx: 0
      })
    }
  }

  handlePackageClick = () => {
    const { info,is_open_store_status } = this.state
    let { distributor_id } = info
    const curStore = Taro.getStorageSync('curStore')
    if (APP_PLATFORM === 'standard') {
      //distributor_id = Taro.getStorageSync('curStore').distributor_id
      distributor_id = is_open_store_status ? curStore.store_id : curStore.distributor_id
    }
    Taro.navigateTo({
      url: `/pages/item/package-list?id=${info.item_id}&distributor_id=${distributor_id}`
    })
  }

  handleParamsClick = () => {
    const { id } = this.$router.params

    Taro.navigateTo({
      url: `/pages/item/item-params?id=${id}`
    })
  }

  handleBuyBarClick = (type) => {
    // if (!S.getAuthToken()) {
    //   // Taro.showToast({
    //   //   icon:'none',
    //   //   title: '请先登录再购买'
    //   // })
    //   // setTimeout(() => {
    //   //   S.login(this, true)
    //   // }, 2000)

    //   return
    // }

    this.setState({
      showBuyPanel: true,
      buyPanelType: type
    })
  }

  handleSwiperChange = (e) => {
    const { detail: { current } } = e
    this.setState({
      curImgIdx: current
    })
  }

  handleBuyAction = async (type) => {
    if (type === 'cart') {
      this.fetchCartCount()
    }
    this.setState({
      showBuyPanel: false
    })
  }

  downloadPosterImg = async () => {
    let userinfo = Taro.getStorageSync('userinfo')
    if (S.getAuthToken() && (!userinfo || !userinfo.userId)) {
      const res = await api.member.memberInfo();
      const userObj = {
        username: res.memberInfo.nickname || res.memberInfo.username || res.memberInfo.mobile,
        avatar: res.memberInfo.avatar,
        userId: res.memberInfo.user_id,
        mobile: res.memberInfo.mobile,
        isPromoter: res.is_promoter,
        openid: res.memberInfo.open_id,
        vip: res.vipgrade ? res.vipgrade.vip_type : ''
      }
      Taro.setStorageSync('userinfo', userObj)
      userinfo = userObj
    }
    const { avatar, userId } = userinfo
    const { info,is_open_store_status } = this.state
    const { pics, company_id, item_id } = info
    const host = req.baseURL.replace('/api/h5app/wxapp/', '')
    const extConfig = (Taro.getEnv() === 'WEAPP' && wx.getExtConfigSync) ? wx.getExtConfigSync() : {}
    const { distributor_id,store_id } = Taro.getStorageSync('curStore')
    
    const pic = pics[0].replace('http:', 'https:')
    const infoId = info.distributor_id
    const id = APP_PLATFORM === 'standard' ? is_open_store_status ? store_id : distributor_id : infoId;

    const wxappCode = getDtidIdUrl(`${host}/wechatAuth/wxapp/qrcode.png?page=${`pages/item/espier-detail`}&appid=${extConfig.appid}&company_id=${company_id}&id=${item_id}&uid=${userId}`,id)

    console.log("wxappCode",wxappCode)
    
    let avatarImg;
    if (avatar) {
      avatarImg = await Taro.getImageInfo({src: avatar})
    }

    const goodsImg = await Taro.getImageInfo({src: pic}) 

    const codeImg = await Taro.getImageInfo({src: wxappCode}) 

    if (avatarImg?(avatarImg && goodsImg && codeImg):goodsImg&&codeImg) {
      const posterImgs = {
        avatar: avatarImg?avatarImg.path : null,
        goods: goodsImg.path,
        code: codeImg.path
      } 

      await this.setState({
        posterImgs
      
      }, () => {
        this.drawImage()
      })
      
      return posterImgs
    } else {
      return null
    }
  }

  drawImage = () => {
    
    const { posterImgs, marketing } = this.state
    if (!posterImgs) return
    const { avatar, goods, code } = posterImgs
    const { info } = this.state
    const { item_name, act_price = null, member_price = null, price, market_price, type } = info
    //let mainPrice = act_price ? act_price : member_price ? member_price : price
    let mainPrice = act_price ? act_price : price
    let sePrice = market_price
    mainPrice = (mainPrice / 100).toFixed(2)
    if (sePrice) {
      sePrice = (sePrice / 100).toFixed(2)
    }
    if (type == '1') {
      const { showPrice } = this.calcCrossPrice(info, marketing)
      mainPrice = (showPrice / 100).toFixed(2)
    }
    let prices = [{
      text: '¥',
      size: 16,
      color: '#ff5000',
      bold: false,
      lineThrough: false,
      valign: 'bottom'
    },
    {
      text: mainPrice,
      size: 24,
      color: '#ff5000',
      bold: true,
      lineThrough: false,
      valign: 'bottom'
    }]

    if (sePrice) {
      prices.push({
        text: sePrice,
        size: 16,
        color: '#999',
        bold: false,
        lineThrough: true,
        valign: 'bottom'
      })
    }

    const { username } = Taro.getStorageSync('userinfo')
    const ctx = Taro.createCanvasContext('myCanvas')

    canvasExp.roundRect(ctx, '#fff', 0, 0, 375, 640, 5)
    canvasExp.textFill(ctx, username, 90, 45, 18, '#333')
    canvasExp.textFill(ctx, '给你推荐好货好物', 90, 65, 14, '#999')
    canvasExp.drawImageFill(ctx, goods, 15, 95, 345, 345)
    if (avatar) {
      canvasExp.imgCircleClip(ctx, avatar, 15, 15, 65, 65)
    }
    
    canvasExp.textMultipleOverflowFill(ctx, item_name, 22, 2, 15, 470, 345, 18, '#333')
    if (type == '1') {
      canvasExp.textFill(ctx, '含税售价:', 15, 565, 16, '#666')
    }
    canvasExp.textSpliceFill(ctx, prices, 'left', type == '1' ? 30 : 15, 600)
    canvasExp.drawImageFill(ctx, code, 250, 500, 100, 100)
    canvasExp.textFill(ctx, '长按识别小程序码', 245, 620, 12, '#999')
    if (act_price) {
      canvasExp.roundRect(ctx, '#ff5000', 15, 540, 70, 25, 5)
      canvasExp.textFill(ctx, '限时活动', 22, 559, 14, '#fff')
    }

    ctx.draw(true, () => {
      Taro.canvasToTempFilePath({
        x: 0,
        y: 0,
        canvasId: 'myCanvas'
      }).then(res => {
        const shareImg = res.tempFilePath;
        this.setState({
          poster: shareImg
        },()=>{
          this.setState({
            showPoster:true
          })
        })
      })
    })
  }

  handleShare = async () => {
    if (!S.getAuthToken()) {
      Taro.showToast({
        icon:'none',
        title: '请先登录再分享'
      })
      setTimeout(() => {
        S.login(this)
      }, 2000)

      return
    }
    const { canShareInfo } = this.state
    const { status, msg, page } = canShareInfo
    if (!status) {
      Taro.showToast({
        title: msg,
        icon: 'none'
      })
      setTimeout(() => {
        linkPage(page.linkPage, page)
      }, 1000)
      return
    }
    this.setState({
      showSharePanel: true
    })
  }

  handleGroupClick = (tid) => {
    Taro.navigateTo({
      url: `/marketing/pages/item/group-detail?team_id=${tid}`
    })
  }

  handlePromotionClick = () => {
    this.setState({
      showPromotions: true
    })
  }

  handleSavePoster() {
    const { poster } = this.state
    Taro.getSetting().then(res => {
      if (!res.authSetting['scope.writePhotosAlbum']) {
        Taro.authorize({
          scope: 'scope.writePhotosAlbum'
        })
          .then(() => {
            this.savePoster(poster)
          })
          .catch(() => {
            this.setState({
              showPoster: false
            })
          })
      } else {
        this.savePoster(poster)
      }
    })
  }

  savePoster = (poster) => {
    console.log("poster",poster)
    Taro.saveImageToPhotosAlbum({
      filePath: poster
    }).then(() => {
        Taro.showToast({
          icon:'none',
          title: '保存成功'
        })
        this.setState({
          showPoster: false
        })
      })
      .catch(() => {
        Taro.showToast({
          icon:'none',
          title: '保存失败'
        })
      })
  }

  handleShowPoster = async () => {
    const { posterImgs } = this.state 
    if (!posterImgs || !posterImgs.avatar || !posterImgs.code || !posterImgs.goods) {
      const imgs = await this.downloadPosterImg()
      console.log("---imgs---",imgs);
      if (imgs && imgs.avatar && imgs.code && imgs.goods) {
        this.setState({
          showPoster: true
        })
      }
    } else {
      this.setState({
        showPoster: true
      })
    }
  }

  handleHidePoster = () => {
    this.setState({
      showPoster: false
    })
  }

  handleBackHome = () => {
    Taro.redirectTo({
      url: '/pages/index'
    })
  }

  handleClickItem = (item) => {
    const curStore = Taro.getStorageSync('curStore')
    const { is_open_store_status } = this.state
    const id = APP_PLATFORM === 'standard' ? is_open_store_status ? curStore.store_id :curStore.distributor_id : item.distributor_id
    const url = `/pages/item/espier-detail?id=${item.item_id}&dtid=${id}`
    Taro.navigateTo({
      url:this.transformUrl(url,this.isPointitem())
    })
  }

  handleCouponClick = () => {
    // const { distributor_id } = Taro.getStorageSync('curStore')
    const { is_open_store_status } = this.state
    let id = ''
    if (APP_PLATFORM === 'standard') {
      const { distributor_id,store_id } = Taro.getStorageSync('curStore')
      id = is_open_store_status ? store_id : distributor_id
    } else {
      const { info } = this.state
      const { distributor_id } = info
      id = distributor_id
    }
    Taro.navigateTo({
      url: `/others/pages/home/coupon-home?item_id=${this.state.info.item_id}&distributor_id=${id}`
    })
  }
  handleClickViewAllEvaluation() {
    Taro.navigateTo({
      url: `/marketing/pages/item/espier-evaluation?id=${this.$router.params.id}`
    })
  }

  handleToRateList = () => {
    const { evaluationTotal } = this.state
    if (evaluationTotal > 0) {
      Taro.navigateTo({
        url: '/marketing/pages/item/espier-evaluation?id=' + this.$router.params.id
      })
    }
  }
  
  //订阅通知
  handleSubscription = async () => {

    if(this.isPointitemGood()){
      console.log("this.isPointitemGood()")
      return ;
    }

    const { isSubscribeGoods, info } = this.state
    if (isSubscribeGoods) return false
    await api.user.subscribeGoods(info.item_id)
    const { template_id } = await api.user.newWxaMsgTmpl({
      'temp_name': 'yykweishop',
      'source_type': 'goods',
    })
    Taro.requestSubscribeMessage({
      tmplIds: template_id,
      success: () => {
        this.fetchInfo()
      },
      fail: () => {
        this.fetchInfo()
      }
    })
  }

  // 计算跨境价
  calcCrossPrice = (info, marketing, curSku) => {
    const taxRate = info ? (Number(info.cross_border_tax_rate || 0) / 100) : 0
    const mainPrice = info ? (info.act_price ? info.act_price : info.price) : 0
    const memberPrice = info ? (info.member_price ? info.member_price : info.price) : 0
    const endPrice = marketing === 'normal' ? memberPrice : mainPrice
    const skuActprice = curSku ? curSku.act_price ? curSku.act_price : curSku.price : endPrice
    const skuMemprice = curSku ? curSku.member_price ? curSku.member_price : curSku.price : endPrice
    const skuEndprice = marketing === 'normal' ? skuMemprice : skuActprice
    const skuPrice = curSku ? skuEndprice : endPrice

    const crossPrice = Math.floor(skuPrice * taxRate)

    const showPrice = Math.floor(skuPrice * (1 + taxRate))

    return {
      crossPrice,
      showPrice
    }
  }

  // 判断是否可以分享
  isCanShare = async () => {
    if (!S.getAuthToken()) return false
    const info = await api.user.getIsCanShare()
    if (!info.status) {
      Taro.hideShareMenu()
    }
    this.setState({
      canShareInfo: info
    })
  }

  // 编辑分享
  goToEditShare = () => {
    const { distributor_id,store_id } = Taro.getStorageSync('curStore')
    const { info,is_open_store_status } = this.state
    const { company_id, item_id } = info
    const dtid = APP_PLATFORM === 'standard' ? is_open_store_status ? store_id : distributor_id : info.distributor_id
    Taro.navigateTo({
      url: `/subpage/pages/editShare/index?id=${item_id}&dtid=${dtid}&company_id=${company_id}`
    })
  }

  render() {
    const {
      info,
      sixSpecImgsDict,
      curImgIdx,
      desc,
      cartCount,
      scrollTop,
      showBackToTop,
      curSku,
      promotion_activity,
      promotion_package,
      itemParams,
      sessionFrom,
      currentImgs,
      marketing,
      timer,
      isPromoter,
      startActivity,
      hasStock,
      showBuyPanel,
      buyPanelType,
      showSharePanel,
      showPromotions,
      poster,
      showPoster,
      likeList,
      evaluationTotal,
      evaluationList,
      isSubscribeGoods,
    } = this.state

    const { showLikeList, colors } = this.props
    const meiqia = Taro.getStorageSync('meiqia')
    const echat = Taro.getStorageSync('echat')
    const uid = this.uid
    // 计算价格
    const { showPrice, crossPrice } = this.calcCrossPrice(info, marketing, curSku)
    // 定位逆解析
    const lnglat = Taro.getStorageSync('lnglat')
    if (!info) {
      return (
        <Loading />
      )
    }
    // 会员优先购限制
    const vipLimit = info.memberpreference_activity && !info.memberpreference_activity.user_grade_valid

    let ruleDay = 0
    if (info.activity_type === 'limited_buy') {
      ruleDay = JSON.parse(info.activity_info.rule.day)
    }

    const { pics: imgs, kaquan_list: coupon_list } = info
    let new_coupon_list = []
    if (coupon_list && coupon_list.list.length >= 1) {
      new_coupon_list = coupon_list.list.slice(0, 3)
    }

    return (
      <View className="page-goods-detail">
        <NavBar title={info.item_name} leftIconType="chevron-left" fixed />

        <ScrollView
          className="goods-detail__wrap"
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
        >
          <View className="goods-imgs__wrap">
            <Swiper
              className="goods-imgs__swiper"
              indicator-dots
              current={curImgIdx}
              onChange={this.handleSwiperChange}
            >
              {imgs.map((img, idx) => {
                return (
                  <SwiperItem key={`${img}${idx}`}>
                    <ItemImg src={img}></ItemImg>
                  </SwiperItem>
                );
              })}
            </Swiper>
          </View>

          {!info.nospec &&
          sixSpecImgsDict.length > 0 &&
          info.is_show_specimg ? (
            <ImgSpec
              info={sixSpecImgsDict}
              current={currentImgs}
              onClick={this.handleSepcImgClick}
            />
          ) : null}

          {timer && (
            <View
              className="goods-timer"
              style={
                colors
                  ? `background: linear-gradient(to left, ${colors.data[0].primary}, ${colors.data[0].primary});`
                  : `background: linear-gradient(to left, #d42f29, #d42f29);`
              }
            >
              <View className="goods-timer__hd">
                <View className="goods-prices">
                  <View className="view-flex view-flex-middle">
                    {info.type == "1" && (
                      <Text className="crossTitleAct">含税销售价</Text>
                    )}
                    <Price
                      unit="cent"
                      symbol={(info.cur && info.cur.symbol) || ""}
                      value={showPrice}
                    />
                    {marketing !== "normal" && (
                      <View className="goods-prices__ft">
                        {marketing === "group" && (
                          <Text className="goods-prices__type">团购</Text>
                        )}
                        {marketing === "group" && (
                          <Text className="goods-prices__rule">
                            {info.activity_info.person_num}人团
                          </Text>
                        )}
                        {marketing === "seckill" && (
                          <Text className="goods-prices__type">秒杀</Text>
                        )}
                        {marketing === "limited_time_sale" && (
                          <Text className="goods-prices__type">限时特惠</Text>
                        )}
                      </View>
                    )}
                  </View>
                  <View style="line-height: 1;">
                    <Price
                      unit="cent"
                      className="goods-prices__market"
                      symbol={(info.cur && info.cur.symbol) || ""}
                      value={curSku ? curSku.price : info.price}
                    />
                  </View>
                </View>
              </View>
              <View className="goods-timer__bd">
                {(marketing === "seckill" ||
                  marketing === "limited_time_sale") && (
                  <View>
                    {info.activity_info.status === "in_the_notice" && (
                      <Text className="goods-timer__label">距开始还剩</Text>
                    )}
                    {info.activity_info.status === "in_sale" && (
                      <Text className="goods-timer__label">距结束还剩</Text>
                    )}
                  </View>
                )}
                {marketing === "group" && (
                  <View>
                    {info.activity_info.show_status === "nostart" && (
                      <Text className="goods-timer__label">距开始还剩</Text>
                    )}
                    {info.activity_info.show_status === "noend" && (
                      <Text className="goods-timer__label">距结束还剩</Text>
                    )}
                  </View>
                )}
                <AtCountdown
                  className="countdown__time"
                  format={{ day: "天", hours: ":", minutes: ":", seconds: "" }}
                  isShowDay
                  day={timer.dd}
                  hours={timer.hh}
                  minutes={timer.mm}
                  seconds={timer.ss}
                />
              </View>
            </View>
          )}

          <View className="goods-hd">
            <View className="goods-info__wrap">
              <View className="goods-title__wrap">
                <Text className="goods-title">{info.item_name}</Text>
                <Text className="goods-title__desc">{info.brief}</Text>
              </View>
              {Taro.getEnv() !== "WEB" && !this.isPointitem() && (
                <View
                  className="goods-share__wrap"
                  onClick={this.handleShare.bind(this)}
                >
                  <View className="icon-share"></View>
                  <View className="share-label">分享</View>
                </View>
              )}
            </View>

            {!info.is_gift && info.vipgrade_guide_title ? (
              <VipGuide
                info={{
                  ...info.vipgrade_guide_title,
                  type: info.type,
                  tax_rate: info.cross_border_tax_rate
                }}
              />
            ) : null}

            {info.memberpreference_activity && (
              <View className="vipLimit">
                <View className="title">
                  <Text className="tag">会员优先购</Text>以下会员等级可购买
                </View>
                <View className="vipList">
                  {info.memberpreference_activity.member_grade.map(
                    (item, index) => (
                      <View key={`vipList${index}`} className="item">
                        {item}
                      </View>
                    )
                  )}
                </View>
              </View>
            )}

            {marketing === "normal" && !this.isPointitemGood() && (
              <View className="goods-prices__wrap">
                <View className="goods-prices">
                  <View className="view-flex-item">
                    {info.type == "1" && (
                      <Text className="crossTitle">含税销售价</Text>
                    )}
                    <Price primary unit="cent" value={showPrice} />
                    {((curSku && curSku.market_price > 0) ||
                      (info && info.market_price > 0)) && (
                      <Price
                        lineThrough
                        unit="cent"
                        value={curSku ? curSku.market_price : info.market_price}
                      />
                    )}
                  </View>
                  {info.nospec && info.activity_type === "limited_buy" && (
                    <View className="limited-buy-rule">
                      {ruleDay ? <Text>每{ruleDay}天</Text> : null}
                      <Text>限购{info.activity_info.rule.limit}件</Text>
                    </View>
                  )}
                </View>

                {info.sales_setting && info.sales && (
                  <Text className="goods-sold">{info.sales || 0}人已购</Text>
                )}
              </View>
            )}
            {/* 跨境商品 */}
            {info.type == "1" && !this.isPointitemGood() && (
              <View className="nationalInfo">
                <View>
                  跨境综合税:
                  <Price
                    unit="cent"
                    symbol={(info.cur && info.cur.symbol) || ""}
                    value={crossPrice}
                  />
                </View>
                <View className="nationalInfoLeft">
                  <View className="item">
                    <Image
                      src={info.origincountry_img_url}
                      className="nationalImg"
                    />
                    <Text>{info.origincountry_name}</Text>
                  </View>
                  <View className="line"></View>
                  <View className="item">
                    <View className="iconfont icon-matou"></View>
                    <Text>保税仓</Text>
                  </View>
                  <View className="line"></View>
                  <View className="item">
                    <View className="iconfont icon-periscope"></View>
                    <Text>{lnglat.city}</Text>
                  </View>
                </View>
              </View>
            )}
            {this.isPointitemGood() && (
              <View class="goods_point">
                <PointLine point={info.point} plus />
              </View>
            )}
          </View>

          {isPromoter && (
            <View className="goods-income">
              <View className="sp-icon sp-icon-jifen"></View>
              <Text>预计收益：{(info.promoter_price / 100).toFixed(2)}</Text>
            </View>
          )}

          {marketing === "group" &&
            info.groups_list.length > 0 &&
            !this.isPointitemGood() && (
              <View className="goods-sec-specs">
                <View className="goods-sec-value">
                  <Text className="title-inner">正在进行中的团</Text>
                  <View className="grouping">
                    {info.groups_list.map(item => (
                      <GroupingItem
                        total={info.activity_info.person_num}
                        info={item}
                        onClick={this.handleGroupClick.bind(this, item.team_id)}
                      />
                    ))}
                  </View>
                </View>
              </View>
            )}

          {!info.is_gift && !this.isPointitemGood() && (
            <SpCell
              className="goods-sec-specs"
              title="领券"
              isLink
              onClick={this.handleCouponClick.bind(this)}
            >
              {coupon_list &&
                new_coupon_list.map(kaquan_item => {
                  return (
                    <View key={kaquan_item.id} className="coupon_tag">
                      <View className="coupon_tag_circle circle_left"></View>
                      <Text>{kaquan_item.title}</Text>
                      <View className="coupon_tag_circle circle_right"></View>
                    </View>
                  );
                })}
            </SpCell>
          )}

          {promotion_activity && promotion_activity.length > 0 ? (
            <ActivityPanel
              info={promotion_activity}
              isOpen={showPromotions}
              onClick={this.handlePromotionClick.bind(this)}
              onClose={() => this.setState({ showPromotions: false })}
            />
          ) : null}

          {promotion_package && !this.isPointitemGood() && (
            <SpCell
              className="goods-sec-specs"
              isLink
              title="优惠组合"
              onClick={this.handlePackageClick}
              value={`共${promotion_package}种组合随意搭配`}
            />
          )}

          {itemParams.length > 0 && (
            <View
              className="goods-sec-specs"
              onClick={this.handleParamsClick.bind(this)}
            >
              <View className="goods-sec-label">商品参数</View>
              <View className="goods-sec-value">
                {itemParams.map(item => (
                  <ParamsItem key={item.attribute_id} info={item} />
                ))}
              </View>
              <View className="goods-sec-icon at-icon at-icon-chevron-right"></View>
            </View>
          )}

          {!info.nospec && (
            <SpCell
              className="goods-sec-specs"
              isLink
              title="规格"
              onClick={this.handleBuyBarClick.bind(this, "pick")}
              value={curSku ? curSku.propsText : "请选择"}
            />
          )}

          {APP_PLATFORM !== "standard" && !isArray(info.distributor_info) && (
            <StoreInfo info={info.distributor_info} />
          )}

          {info.rate_status && (
            <View className="goods-evaluation">
              <View
                className="goods-sec-specs"
                onClick={this.handleToRateList.bind(this)}
              >
                <Text className="goods-sec-label">评价</Text>
                {evaluationTotal > 0 ? (
                  <Text className="goods-sec-value">({evaluationTotal})</Text>
                ) : (
                  <Text className="goods-sec-value">暂无评价</Text>
                )}
                <View className="goods-sec-icon apple-arrow"></View>
              </View>
              <View className="evaluation-list">
                {evaluationList.map(item => {
                  return (
                    <GoodsEvaluation
                      info={item}
                      key={item.rate_id}
                      pathRoute="detail"
                      onChange={this.handleClickViewAllEvaluation.bind(this)}
                    />
                  );
                })}
              </View>
            </View>
          )}

          {isArray(desc) ? (
            <View className="wgts-wrap__cont">
              {info.videos_url && (
                <Video src={info.videos} controls style="width:100%"></Video>
              )}
              {desc.map((item, idx) => {
                return (
                  <View className="wgt-wrap" key={`${item.name}${idx}`}>
                    {item.name === "film" && <WgtFilm info={item} />}
                    {item.name === "slider" && <WgtSlider info={item} />}
                    {item.name === "writing" && <WgtWriting info={item} />}
                    {item.name === "heading" && <WgtHeading info={item} />}
                    {item.name === "goods" && <WgtGoods info={item} />}
                  </View>
                );
              })}
            </View>
          ) : (
            <View>
              {desc && (
                <SpHtmlContent
                  className="goods-detail__content"
                  content={desc}
                />
              )}
            </View>
          )}

          {likeList.length > 0 && showLikeList ? (
            <View className="cart-list cart-list__disabled">
              <View className="cart-list__hd like__hd">
                <Text className="cart-list__title">猜你喜欢</Text>
              </View>
              <View className="goods-list goods-list__type-grid">
                {likeList.map(item => {
                  return (
                    <View className="goods-list__item">
                      <GoodsItem
                        key={item.item_id}
                        info={item}
                        onClick={this.handleClickItem.bind(this, item)}
                        isPointitem={this.isPointitemGood()}
                      />
                    </View>
                  );
                })}
              </View>
            </View>
          ) : null}
        </ScrollView>

        <FloatMenus>
          <FloatMenuItem
            iconPrefixClass="icon"
            icon="home1"
            onClick={this.handleBackHome.bind(this)}
          />
          {meiqia.is_open === "true" ||
          echat.is_open === "true" ||
          Taro.getEnv() === "WEB" ? (
            <FloatMenuMeiQia
              storeId={info.distributor_id}
              info={{ goodId: info.item_id, goodName: info.itemName }}
            />
          ) : (
            <FloatMenuItem
              iconPrefixClass="icon"
              icon="headphones"
              openType="contact"
              sessionFrom={sessionFrom}
            />
          )}
          <FloatMenuItem
            iconPrefixClass="icon"
            icon="arrow-up"
            hide={!showBackToTop}
            onClick={this.scrollBackToTop}
          />
        </FloatMenus>

        {info.distributor_sale_status &&
        hasStock &&
        startActivity &&
        !info.is_gift &&
        !vipLimit ? (
          <GoodsBuyToolbar
            info={info}
            type={marketing}
            cartCount={cartCount}
            onFavItem={this.handleMenuClick.bind(this, "fav")}
            onClickAddCart={this.handleBuyBarClick.bind(this, "cart")}
            onClickFastBuy={this.handleBuyBarClick.bind(this, "fastbuy")}
            isPointitem={this.isPointitemGood()}
          >
            <View>{marketing}</View>
          </GoodsBuyToolbar>
        ) : (
          <GoodsBuyToolbar
            info={info}
            customRender
            cartCount={cartCount}
            type={marketing}
            onFavItem={this.handleMenuClick.bind(this, "fav")}
            isPointitem={this.isPointitemGood()}
          >
            <View
              className="goods-buy-toolbar__btns"
              style="width: 60%; text-align: center"
            >
              {!startActivity || info.is_gift || vipLimit ? (
                <View className="arrivalNotice noNotice limit">
                  {info.is_gift ? "赠品不可购买" : ""}
                  {!startActivity ? "活动即将开始" : ""}
                  {vipLimit ? "仅限特定会员购买" : ""}
                </View>
              ) : (
                <View
                  style={`background: ${
                    this.isPointitemGood()
                      ? "grey"
                      : !isSubscribeGoods
                      ? colors.data[0].primary
                      : "inherit"
                  }`}
                  className={`arrivalNotice ${isSubscribeGoods &&
                    "noNotice"} ${this.isPointitemGood() && "good_disabled"}`}
                  onClick={this.handleSubscription.bind(this)}
                >
                  {this.isPointitemGood()
                    ? "已兑完"
                    : isSubscribeGoods
                    ? "已订阅到货通知"
                    : "到货通知"}
                </View>
              )}
            </View>
          </GoodsBuyToolbar>
        )}

        {info && (
          <GoodsBuyPanel
            info={info}
            type={buyPanelType}
            marketing={marketing}
            isOpened={showBuyPanel}
            onClose={() => this.setState({ showBuyPanel: false })}
            fastBuyText={
              this.isPointitemGood()
                ? "立即兑换"
                : marketing === "group"
                ? "我要开团"
                : "立即购买"
            }
            isPointitem={this.isPointitemGood()}
            onChange={this.handleSkuChange}
            onAddCart={this.handleBuyAction.bind(this, "cart")}
            onFastbuy={this.handleBuyAction.bind(this, "fastbuy")}
          />
        )}

        {
          <View className="share">
            <SharePanel
              info={uid}
              isOpen={showSharePanel}
              onEditShare={this.goToEditShare.bind(this)}
              onClose={() => this.setState({ showSharePanel: false })}
              onClick={this.handleShowPoster.bind(this)}
            />
          </View>
        }

        {showPoster && (
          <View className="poster-modal">
            <Image className="poster" src={poster} mode="widthFix" />
            <View className="view-flex view-flex-middle">
              <View
                className="icon-close poster-close-btn"
                onClick={this.handleHidePoster.bind(this)}
              ></View>
              <View
                className="icon-download poster-save-btn"
                style={`background: ${colors.data[0].primary}`}
                onClick={this.handleSavePoster.bind(this)}
              >
                保存至相册
              </View>
            </View>
          </View>
        )}

        <Canvas className="canvas" canvas-id="myCanvas"></Canvas>

        <SpToast />
      </View>
    );
  }
}
