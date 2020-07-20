/* eslint-disable react/jsx-key */
import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Swiper, SwiperItem, Image, Video, Canvas } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtCountdown } from 'taro-ui'
import { Loading, Price, FloatMenus, FloatMenuItem, SpHtmlContent, SpToast, NavBar, GoodsBuyPanel, SpCell, GoodsEvaluation, FloatMenuMeiQia, GoodsItem } from '@/components'
import api from '@/api'
import req from '@/api/req'
import { withPager, withBackToTop } from '@/hocs'
import { log, calcTimer, isArray, pickBy, canvasExp } from '@/utils'
import entry from '@/utils/entry'
import S from '@/spx'
import { GoodsBuyToolbar, ItemImg, ImgSpec, StoreInfo, ActivityPanel, SharePanel, VipGuide, ParamsItem, GroupingItem } from './comps'
import { WgtFilm, WgtSlider, WgtWriting, WgtGoods, WgtHeading } from '../home/wgts'

import './espier-detail.scss'

@connect(({ cart, member, colors }) => ({
  cart,
  colors: colors.current,
  favs: member.favs,
  showLikeList: cart.showLikeList
}), (dispatch) => ({
  onFastbuy: (item) => dispatch({ type: 'cart/fastbuy', payload: { item } }),
  onAddCart: (item) => dispatch({ type: 'cart/add', payload: { item } }),
  onAddFav: ({ item_id, fav_id }) => dispatch({ type: 'member/addFav', payload: { item_id, fav_id } }),
  onDelFav: ({ item_id }) => dispatch({ type: 'member/delFav', payload: { item_id } })
}))
@withPager
@withBackToTop
export default class Detail extends Component {
  static options = {
    addGlobalClass: true
  }

  constructor (props) {
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

    }
  }

  async componentDidMount () {  
    const options = this.$router.params
    const { uid, id, gid = '' } = await entry.entryLaunch(options, true)
    this.fetchInfo(id, gid)
    this.getEvaluationList(id)
    if (uid) {
      this.uid = uid
    }
    // 浏览记录
    if (S.getAuthToken()) {
      try {
        let itemId = ''
        if (id) {
          itemId = id
        } else {
          itemId = this.$router.params.id
        }
        api.member.itemHistorySave(id)
      } catch (e) {
        console.log(e)
      }
    }
  }

  async componentDidShow () {
    const userInfo = Taro.getStorageSync('userinfo')
    if (S.getAuthToken() && (!userInfo || !userInfo.userId)) {
      const res = await api.member.memberInfo()
      const userObj = {
        username: res.memberInfo.username,
        avatar: res.memberInfo.avatar,
        userId: res.memberInfo.user_id,
        mobile: res.memberInfo.mobile,
        isPromoter: res.is_promoter,
        vip: res.vipgrade ? res.vipgrade.vip_type : '',
      }
      Taro.setStorageSync('userinfo', userObj)
    }
    this.fetchCartCount()
  }

  async getEvaluationList (id) {
    const {list, total_count} = await api.item.evaluationList({
      page: 1,
      pageSize: 2,
      item_id: id || this.$router.params.id
    })
    list.map(item => {
      item.picList = item.rate_pic ? item.rate_pic.split(',') : []
    })

    this.setState({
      evaluationList: list,
      evaluationTotal: total_count
    })
  }

  onShareAppMessage () {
    const { info } = this.state
    const { distributor_id } = Taro.getStorageSync('curStore')
    const { userId } = Taro.getStorageSync('userinfo')

    return {
      title: info.item_name,
      path: '/pages/item/espier-detail?id='+ info.item_id + '&dtid=' + distributor_id + (userId && '&uid=' + userId),
      imageUrl: info.pics[0]
    }
  }

  onShareTimeline () {
    const { info } = this.state
    const { distributor_id } = Taro.getStorageSync('curStore')
    const { userId } = Taro.getStorageSync('userinfo')
    return {
      title: info.item_name,
      query: `id=${info.item_id}&dtid=${distributor_id}&uid=${userId}`,
      imageUrl: info.pics[0]
    }
  }

  async fetchCartCount () {
    const { info } = this.state
    if (!S.getAuthToken() || !info) return
    const { special_type } = info
    const isDrug = special_type === 'drug'

    try {
      const res = await api.cart.count({shop_type: isDrug ? 'drug' : 'distributor'})
      this.setState({
        cartCount: res.item_count || ''
      })
    } catch (e) {
      console.log(e)
    }
  }

  async fetchInfo (itemId, goodsId) {
    const { distributor_id } = Taro.getStorageSync('curStore')
    let id = ''
    if (itemId) {
      id = itemId
    } else {
      id = this.$router.params.id
    }

    const param = {goods_id: goodsId}

    if (APP_PLATFORM === 'standard') {
      param.distributor_id = distributor_id 
    }
    const info = await api.item.detail(id, param)

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

    Taro.setNavigationBarTitle({
      title: info.item_name
    })

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
    itemParams = itemParams.slice(0,5)

    info.is_fav = Boolean(this.props.favs[info.item_id])
    const specImgsDict = this.resolveSpecImgs(info.item_spec_desc)
    const sixSpecImgsDict = pickBy(info.spec_images, {
      url: 'spec_image_url',
      images: 'item_image_url',
      specValueId: 'spec_value_id'
    })

    sessionFrom += '{'
    if(Taro.getStorageSync('userinfo')){
      sessionFrom += `"nickName": "${Taro.getStorageSync('userinfo').username}", `
    }
    sessionFrom += `"商品": "${info.item_name}"`
    sessionFrom += '}'


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
      sessionFrom
    }, async () => {
      let contentDesc =''

      if(!isArray(desc)){
        if(info.videos_url){
          contentDesc += `<video src=${info.videos} controls style='width:100%'></video>`+ desc
        }else {
          contentDesc = desc
        }
      }else {
        contentDesc = desc
      }
      let promotion_package = null
      const { list } = await api.item.packageList({item_id: id})
      if (list.length) {
        promotion_package = list.length
      }
      this.setState({
        desc: contentDesc,
        promotion_package
      })
      this.fetchCartCount()
      this.downloadPosterImg()
    })

    log.debug('fetch: done', info)
  }

  async fetch (params) {
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
      price: ({ price }) => { return (price/100).toFixed(2)},
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

  handleMenuClick = async (type) => {
    const { info } = this.state
    const isAuth = S.getAuthToken()
    console.log('收藏')
    if (type === 'fav') {
      if (!isAuth) {
        S.toast('请登录后再收藏')

        setTimeout(() => {
          S.login(this)
        }, 2000)

        return
      }

      if (!info.is_fav) {
        const favRes = await api.member.addFav(info.item_id)
        this.props.onAddFav(favRes)
        S.toast('已加入收藏')
      } else {
        await api.member.delFav(info.item_id)
        this.props.onDelFav(info)
        S.toast('已移出收藏')
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
    const { info } = this.state
    let { distributor_id } = info
    if (APP_PLATFORM === 'standard') {
      distributor_id = Taro.getStorageSync('curStore').distributor_id
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
    if (!S.getAuthToken()) {
      S.toast('请先登录再购买')

      setTimeout(() => {
        S.login(this, true)
      }, 2000)

      return
    }

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
      const res = await api.member.memberInfo()
      const userObj = {
        username: res.memberInfo.username,
        avatar: res.memberInfo.avatar,
        userId: res.memberInfo.user_id,
        mobile: res.memberInfo.mobile,
        isPromoter: res.is_promoter,
        vip: res.vipgrade ? res.vipgrade.vip_type : ''
      }
      Taro.setStorageSync('userinfo', userObj)
      userinfo = userObj
    }
    const { avatar, userId } = userinfo
    const { info } = this.state
    const { pics, company_id, item_id } = info
    const host = req.baseURL.replace('/api/h5app/wxapp/','')
    const extConfig = (Taro.getEnv() === 'WEAPP' && wx.getExtConfigSync) ? wx.getExtConfigSync() : {}
    const { distributor_id } = Taro.getStorageSync('curStore')
    const pic = pics[0].replace('http:', 'https:')

    const wxappCode = `${host}/wechatAuth/wxapp/qrcode.png?page=${`pages/item/espier-detail`}&appid=${extConfig.appid}&company_id=${company_id}&id=${item_id}&dtid=${distributor_id}&uid=${userId}`
    const avatarImg = await Taro.getImageInfo({src: avatar})
    const goodsImg = await Taro.getImageInfo({src: pic})
    const codeImg = await Taro.getImageInfo({src: wxappCode})

    if (avatarImg && goodsImg && codeImg) {
      const posterImgs = {
        avatar: avatarImg.path,
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
    const { posterImgs } = this.state
    if (!posterImgs) return
    const { avatar, goods, code } = posterImgs
    const { info } = this.state
    const { item_name, act_price = null, member_price = null, price, market_price } = info
    //let mainPrice = act_price ? act_price : member_price ? member_price : price
    let mainPrice = act_price ? act_price : price
    let sePrice = market_price
    mainPrice = (mainPrice/100).toFixed(2)
    if (sePrice) {
      sePrice = (sePrice/100).toFixed(2)
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
    const { username, userId } = Taro.getStorageSync('userinfo')
    const ctx = Taro.createCanvasContext('myCanvas')

    canvasExp.roundRect(ctx, '#fff', 0, 0, 375, 640, 5)
    canvasExp.textFill(ctx, username, 90, 45, 18, '#333')
    canvasExp.textFill(ctx, '给你推荐好货好物', 90, 65, 14, '#999')
    canvasExp.drawImageFill(ctx, goods, 15, 95, 345, 345)
    canvasExp.imgCircleClip(ctx, avatar, 15, 15, 65, 65)
    canvasExp.textMultipleOverflowFill(ctx, item_name, 22, 2, 15, 470, 345, 18, '#333')
    canvasExp.textSpliceFill(ctx, prices, 'left', 15, 600)
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
        })
      })
    })
  }

  handleShare = async () => {
    if (!S.getAuthToken()) {
      S.toast('请先登录再分享')

      setTimeout(() => {
        S.login(this)
      }, 2000)

      return
    }

    this.setState({
      showSharePanel: true
    })
  }

  handleGroupClick = (tid) => {
    Taro.navigateTo({
      url: `/pages/item/group-detail?team_id=${tid}`
    })
  }

  handlePromotionClick = () => {
    this.setState({
      showPromotions: true
    })
  }

  handleSavePoster () {
    const { poster } = this.state
    Taro.getSetting().then(res => {
      if (!res.authSetting['scope.writePhotosAlbum']) {
        Taro.authorize({
          scope: 'scope.writePhotosAlbum'
        })
        .then(res => {
          this.savePoster(poster)
        })
        .catch(res => {
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
    Taro.saveImageToPhotosAlbum({
      filePath: poster
    })
    .then(res => {
      S.toast('保存成功')
    })
    .catch(res => {
      S.toast('保存失败')
    })
  }

  // handleToGiftMiniProgram = () => {
  //   Taro.navigateToMiniProgram({
  //     appId: APP_GIFT_APPID, // 要跳转的小程序的appid
  //     path: '/pages/index/index', // 跳转的目标页面
  //     success(res) {
  //       // 打开成功
  //       console.log(res)
  //     }
  //   })
  // }

  handleShowPoster = async () => {
    const { posterImgs } = this.state
    if (!posterImgs || !posterImgs.avatar || !posterImgs.code || !posterImgs.goods) {
      const imgs = await this.downloadPosterImg()
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
    const url = `/pages/item/espier-detail?id=${item.item_id}`
    Taro.navigateTo({
      url
    })
  }

  handleCouponClick = () => {
    // const { distributor_id } = Taro.getStorageSync('curStore')
    let id = ''
    if (APP_PLATFORM === 'standard') {
      const { distributor_id } = Taro.getStorageSync('curStore')
      id = distributor_id
    } else {
      const { info } = this.state
      const { distributor_id } = info
      id = distributor_id
    }
    Taro.navigateTo({
      url: `/pages/home/coupon-home?item_id=${this.state.info.item_id}&distributor_id=${id}`
    })
  }
  handleClickViewAllEvaluation () {
    Taro.navigateTo({
      url: `/marketing/pages/item/espier-evaluation?id=${this.$router.params.id}`
    })
  }

  handleToRateList = () =>{
    const { evaluationTotal } = this.state
    if (evaluationTotal > 0) {
      Taro.navigateTo({
        url: '/marketing/pages/item/espier-evaluation?id='+ this.$router.params.id
      })
    }
  }

  render () {
    const {
      info,
      isGreaterSix,
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
      page,
      evaluationTotal,
      evaluationList
    } = this.state

    const { showLikeList, colors } = this.props
    const meiqia = Taro.getStorageSync('meiqia')
    const uid = this.uid

    if (!info) {
      return (
        <Loading />
      )
    }
    let ruleDay = 0
    if (info.activity_type === 'limited_buy') {
      ruleDay = JSON.parse(info.activity_info.rule.day)
    }

    const { pics: imgs, kaquan_list: coupon_list } = info
    let new_coupon_list = []
    if(coupon_list && coupon_list.list.length >= 1) {
      new_coupon_list = coupon_list.list.slice(0,3)
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
          onScrollToLower={this.nextPage}
        >
          <View className='goods-imgs__wrap'>
            <Swiper
              className='goods-imgs__swiper'
              indicator-dots
              current={curImgIdx}
              onChange={this.handleSwiperChange}
            >
              {
                imgs.map((img, idx) => {
                  return (
                    <SwiperItem key={idx}>
                      <ItemImg
                        src={img}
                      ></ItemImg>
                    </SwiperItem>
                  )
                })
              }
            </Swiper>

            {
              // info.videos_url && (<Video
              //   src={info.videos_url}
              //   className='video'
              //   controls
              // />)
            }
            {/*<ItemImg
              info={imgInfo}
            />*/}
          </View>

          {
            !info.nospec && sixSpecImgsDict.length > 0 && info.is_show_specimg
              ? <ImgSpec
                info={sixSpecImgsDict}
                current={currentImgs}
                onClick={this.handleSepcImgClick}
              />
              : null
          }

          {timer && (
            <View className='goods-timer' style={colors ? `background: linear-gradient(to left, ${colors.data[0].primary}, ${colors.data[0].primary});` :  `background: linear-gradient(to left, #d42f29, #d42f29);`}>
              <View className='goods-timer__hd'>
                <View className='goods-prices'>
                  <View className='view-flex view-flex-middle'>
                    <Price
                      unit='cent'
                      symbol={(info.cur && info.cur.symbol) || ''}
                      value={info.act_price}
                    />
                    {
                      marketing !== 'normal' &&
                        <View className='goods-prices__ft'>
                          {
                            marketing === 'group' &&
                              <Text className='goods-prices__type'>团购</Text>
                          }
                          {
                            marketing === 'group' &&
                              <Text className='goods-prices__rule'>{info.activity_info.person_num}人团</Text>
                          }
                          {
                            marketing === 'seckill' &&
                              <Text className='goods-prices__type'>秒杀</Text>
                          }
                          {
                            marketing === 'limited_time_sale' &&
                              <Text className='goods-prices__type'>限时特惠</Text>
                          }
                        </View>
                    }
                  </View>
                  <View style='line-height: 1;'>
                    <Price
                      unit='cent'
                      className='goods-prices__market'
                      symbol={(info.cur && info.cur.symbol) || ''}
                      value={info.price}
                    />
                  </View>
                </View>
              </View>
              <View className='goods-timer__bd'>
                {
                  (marketing === 'seckill' || marketing === 'limited_time_sale') &&
                    <View>
                      {info.activity_info.status === 'in_the_notice' && <Text className='goods-timer__label'>距开始还剩</Text>}
        							{info.activity_info.status === 'in_sale' && <Text className='goods-timer__label'>距结束还剩</Text>}
                    </View>
                }
                {
                  marketing === 'group' &&
                    <View>
                      {info.activity_info.show_status === 'nostart' && <Text className='goods-timer__label'>距开始还剩</Text>}
        							{info.activity_info.show_status === 'noend' && <Text className='goods-timer__label'>距结束还剩</Text>}
                    </View>
                }
                <AtCountdown
                  className='countdown__time'
                  format={{ day: '天', hours: ':', minutes: ':', seconds: '' }}
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
            <View className='goods-info__wrap'>
              <View className='goods-title__wrap'>
                <Text className='goods-title'>{info.item_name}</Text>
                <Text className='goods-title__desc'>{info.brief}</Text>
              </View>
              {
                Taro.getEnv() !== 'WEB' && <View
                  className='goods-share__wrap'
                  onClick={this.handleShare.bind(this)}
                >
                  <View className='icon-share'></View>
                  <View className='share-label'>分享</View>
                </View>
              }
            </View>

            {
              info.vipgrade_guide_title
                ? <VipGuide
                  info={info.vipgrade_guide_title}
                />
                : null
            }

            {
              marketing === 'normal' && (
                <View className='goods-prices__wrap'>
                  <View className='goods-prices'>
                    {
                      info.member_price
                        ? <View className='view-flex-item'>
                            <Price
                              primary
                              unit='cent'
                              value={info.member_price}
                            />
                            <Price
                              lineThrough
                              unit='cent'
                              value={info.market_price}
                            />
                          </View>
                        : <View className='view-flex-item'>
                            <Price
                              primary
                              unit='cent'
                              value={info.price}
                            />
                            {
                              info.market_price &&
                                <Price
                                  lineThrough
                                  unit='cent'
                                  value={info.market_price}
                                />
                            }
                          </View>
                    }
                    {
                      info.nospec && info.activity_type === 'limited_buy' &&
                        <View className='limited-buy-rule'>
                          {
                            ruleDay
                              ? <Text>每{ruleDay}天</Text>
                              : null
                          }
                          <Text>限购{info.activity_info.rule.limit}件</Text>
                        </View>
                    }
                  </View>

                  {
                    info.sales && (<Text className='goods-sold'>{info.sales || 0}人已购</Text>)
                  }
                </View>
              )
            }
          </View>

          {isPromoter && (
            <View className='goods-income'>
              <View className='sp-icon sp-icon-jifen'></View>
              <Text>预计收益：{(info.promoter_price/100).toFixed(2)}</Text>
            </View>
          )}

          {
            marketing === 'group' && info.groups_list.length > 0 &&
              <View className='goods-sec-specs'>
                <View className='goods-sec-value'>
                  <Text className='title-inner'>正在进行中的团</Text>
                  <View className='grouping'>
                    {
                      info.groups_list.map(item =>
                        <GroupingItem
                          total={info.activity_info.person_num}
                          info={item}
                          onClick={this.handleGroupClick.bind(this, item.team_id)}
                        />
                      )
                    }
                  </View>
                </View>
              </View>
          }

          <SpCell
            className='goods-sec-specs'
            title='领券'
            isLink
            onClick={this.handleCouponClick.bind(this)}
          >
            {
              coupon_list && new_coupon_list.map(kaquan_item => {
                return (
                  <View key={kaquan_item.id} className='coupon_tag'>
                    <View className='coupon_tag_circle circle_left'></View>
                    <Text>{kaquan_item.title}</Text>
                    <View className='coupon_tag_circle circle_right'></View>
                  </View>
                )
              })
            }
          </SpCell>

          {
            promotion_activity && promotion_activity.length > 0
              ? <ActivityPanel
                info={promotion_activity}
                isOpen={showPromotions}
                onClick={this.handlePromotionClick.bind(this)}
                onClose={() => this.setState({ showPromotions: false })}
              />
              : null
          }

          {
            promotion_package &&
              <SpCell
                className='goods-sec-specs'
                isLink
                title='优惠组合'
                onClick={this.handlePackageClick}
                value={`共${promotion_package}种组合随意搭配`}
              />
          }

          {
            itemParams.length > 0 &&
              <View
                className='goods-sec-specs'
                onClick={this.handleParamsClick.bind(this)}
              >
                <View className='goods-sec-label'>商品参数</View>
                <View className='goods-sec-value'>
                  {
                    itemParams.map((item, idx) =>
                      <ParamsItem
                        key={idx}
                        info={item}
                      />
                    )
                  }
                </View>
                <View className='goods-sec-icon at-icon at-icon-chevron-right'></View>
              </View>
          }

          {
            !info.nospec &&
              <SpCell
                className='goods-sec-specs'
                isLink
                title='规格'
                onClick={this.handleBuyBarClick.bind(this, 'pick')}
                value={curSku ? curSku.propsText : '请选择'}
              />
          }

          {
            APP_PLATFORM !== 'standard' && !isArray(info.distributor_info) &&
              <StoreInfo
                info={info.distributor_info}
              />
          }

          {
            info.rate_status &&
            <View className='goods-evaluation'>
              <View className='goods-sec-specs' onClick={this.handleToRateList.bind(this)}>
                <Text className='goods-sec-label'>评价</Text>
                {
                  evaluationTotal > 0 ?
                  <Text className='goods-sec-value'>({evaluationTotal})</Text>
                  : <Text className='goods-sec-value'>暂无评价</Text>
                }
                <View className='goods-sec-icon apple-arrow'></View>
              </View>
              <View className='evaluation-list'>
                {evaluationList.map(item => {
                  return (
                    <GoodsEvaluation
                      info={item}
                      key={item.rate_id}
                      pathRoute='detail'
                      onChange={this.handleClickViewAllEvaluation.bind(this)}
                    />
                  )
                })}
              </View>
            </View>
          }

          {
            isArray(desc)
              ? <View className='wgts-wrap__cont'>
                {
                  info.videos_url && (
                    <Video src={info.videos} controls style='width:100%'></Video>
                  )
                }
                {
                  desc.map((item, idx) => {
                    return (
                      <View className='wgt-wrap' key={idx}>
                        {item.name === 'film' && <WgtFilm info={item} />}
                        {item.name === 'slider' && <WgtSlider info={item} />}
                        {item.name === 'writing' && <WgtWriting info={item} />}
                        {item.name === 'heading' && <WgtHeading info={item} />}
                        {item.name === 'goods' && <WgtGoods info={item} />}
                      </View>
                    )
                  })
                }
              </View>
              : <View>
                  {
                    desc &&
                      <SpHtmlContent
                        className='goods-detail__content'
                        content={desc}
                      />
                  }
                </View>

          }
          {
            likeList.length > 0 && showLikeList
              ? <View className='cart-list cart-list__disabled'>
                  <View className='cart-list__hd like__hd'><Text className='cart-list__title'>猜你喜欢</Text></View>
                  <View className='goods-list goods-list__type-grid'>
                    {
                      likeList.map(item => {
                        return (
                          <View className='goods-list__item'>
                            <GoodsItem
                              key={item.item_id}
                              info={item}
                              onClick={this.handleClickItem.bind(this, item)}
                            />
                          </View>
                        )
                      })
                    }
                  </View>
                </View>
              : null
          }
        </ScrollView>

        <FloatMenus>
          <FloatMenuItem
            iconPrefixClass='icon'
            icon='home1'
            onClick={this.handleBackHome.bind(this)}
          />
          {
            meiqia.is_open === 'true'
              ? <FloatMenuMeiQia storeId={info.distributor_id} info={{goodId: info.item_id, goodName: info.itemName}} />
              : <FloatMenuItem
                iconPrefixClass='icon'
                icon='headphones'
                openType='contact'
                sessionFrom={sessionFrom}
              />

          }
          <FloatMenuItem
            iconPrefixClass='icon'
            icon='arrow-up'
            hide={!showBackToTop}
            onClick={this.scrollBackToTop}
          />
        </FloatMenus>

        {(info.distributor_sale_status && hasStock && startActivity)
          ?
            (<GoodsBuyToolbar
              info={info}
              type={marketing}
              cartCount={cartCount}
              onFavItem={this.handleMenuClick.bind(this, 'fav')}
              onClickAddCart={this.handleBuyBarClick.bind(this, 'cart')}
              onClickFastBuy={this.handleBuyBarClick.bind(this, 'fastbuy')}
            >
              <View>{marketing}</View>
            </GoodsBuyToolbar>)
          :
            (<GoodsBuyToolbar
              info={info}
              customRender
              cartCount={cartCount}
              type={marketing}
              onFavItem={this.handleMenuClick.bind(this, 'fav')}
            >
              <View
                className='goods-buy-toolbar__btns'
                style='width: 60%; text-align: center'
              >
                {
                  !startActivity
                    ? <Text>活动即将开始</Text>
                    : <Text>当前商品无货</Text>
                }
              </View>
            </GoodsBuyToolbar>)
        }

        {
          info && <GoodsBuyPanel
            info={info}
            type={buyPanelType}
            isOpened={showBuyPanel}
            onClose={() => this.setState({ showBuyPanel: false })}
            fastBuyText={marketing === 'group' ? '我要开团' : '立即购买'}
            onChange={this.handleSkuChange}
            onAddCart={this.handleBuyAction.bind(this, 'cart')}
            onFastbuy={this.handleBuyAction.bind(this, 'fastbuy')}
          />
        }

        {
          <View className='share'>
            <SharePanel
              info={uid}
              isOpen={showSharePanel}
              onClose={() => this.setState({ showSharePanel: false })}
              onClick={this.handleShowPoster.bind(this)}
            />
          </View>
        }

        {
          showPoster &&
            <View className='poster-modal'>
              <Image className='poster' src={poster} mode='widthFix' />
              <View className='view-flex view-flex-middle'>
                <View className='icon-close poster-close-btn' onClick={this.handleHidePoster.bind(this)}></View>
                <View
                  className='icon-download poster-save-btn'
                  style={`background: ${colors.data[0].primary}`}
                  onClick={this.handleSavePoster.bind(this)}>保存至相册</View>
              </View>
            </View>
        }

        <Canvas className='canvas' canvas-id='myCanvas'></Canvas>

        <SpToast />
      </View>
    )
  }
}
