import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Swiper, SwiperItem, Image, Video, Navigator, Canvas } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtCountdown } from 'taro-ui'
import { Loading, Price, BackToTop, FloatMenus, FloatMenuItem, SpHtmlContent, SpToast, NavBar, GoodsBuyPanel, SpCell } from '@/components'
import api from '@/api'
import req from '@/api/req'
import { withBackToTop } from '@/hocs'
import { log, calcTimer, isArray, pickBy, classNames, canvasExp } from '@/utils'
import entry from '@/utils/entry'
import S from '@/spx'
import { GoodsBuyToolbar, ItemImg, ImgSpec, Params, StoreInfo, SharePanel, VipGuide } from './comps'
import { WgtFilm, WgtSlider, WgtWriting, WgtGoods, WgtHeading } from '../home/wgts'

import './espier-detail.scss'

@connect(({ cart, member }) => ({
  cart,
  favs: member.favs
}), (dispatch) => ({
  onFastbuy: (item) => dispatch({ type: 'cart/fastbuy', payload: { item } }),
  onAddCart: (item) => dispatch({ type: 'cart/add', payload: { item } }),
  onAddFav: ({ item_id, fav_id }) => dispatch({ type: 'member/addFav', payload: { item_id, fav_id } }),
  onDelFav: ({ item_id }) => dispatch({ type: 'member/delFav', payload: { item_id } })
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
      curImgIdx: 0,
      isPromoter: false,
      timer: null,
      startSecKill: true,
      hasStock: true,
      cartCount: '',
      showBuyPanel: false,
      showSharePanel: false,
      buyPanelType: null,
      specImgsDict: {},
      currentImgs: -1,
      sixSpecImgsDict: {},
      curSku: null,
      vip: null,
      promotion_activity: [],
      promotion_package: [],
      itemParams: [],
      sessionFrom: '',
      posterImgs: null,
      poster: null,
      positionStatus: false
    }
  }

  async componentDidMount () {
    const options = this.$router.params
    const { store, uid, positionStatus } = await entry.entryLaunch(options, true)
    if (store) {
      this.setState({
        positionStatus
      }, () => {
        this.fetch()
      })
    }
    if (uid) {
      this.uid = uid
    }
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
    const { distributor_id } = Taro.getStorageSync('curStore')

    return {
      title: info.item_name,
      path: `/pages/item/espier-detail?id=${info.item_id}&dtid=${distributor_id}` + this.uid && `&uid=${this.uid}`
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

  async fetch () {
    const { id } = this.$router.params
    const info = await api.item.detail(id)
    let promotion_package = null
    const { list } = await api.item.packageList({item_id: id})
    if (list.length) {
      promotion_package = list.length
    }
    const { intro: desc, promotion_activity: promotion_activity } = info
    let marketing = 'normal'
    let timer = null
    let hasStock = info.store && info.store > 0
    let startSecKill = true
    let sessionFrom = ''

    let vip = null
    if (info.is_vip_grade) {
      const { grade_name, member_price, guide_title_desc } = info
      vip = {
        grade_name,
        member_price,
        guide_title_desc
      }
    }

    if (info.activity_info) {
      //团购
      //   marketing = 'group'
      //   timer = calcTimer(info.group_activity.remaining_time)
      //   hasStock = info.group_activity.store && info.group_activity.store > 0
      // } else if (info.seckill_activity) {
      //秒杀
      marketing = 'seckill'
      timer = calcTimer(info.activity_info.last_seconds)
      hasStock = info.activity_info.item_total_store && info.activity_info.item_total_store > 0
      startSecKill = info.activity_info.status === 'in_sale'
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

    const { item_params } = info
    const itemParams = pickBy(item_params, {
      label: 'attribute_name',
      value: 'attribute_value_name'
    })

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
      desc,
      marketing,
      timer,
      hasStock,
      startSecKill,
      specImgsDict,
      sixSpecImgsDict,
      promotion_activity,
      promotion_package,
      itemParams,
      sessionFrom
    }, () => {
      this.fetchCartCount()
      // this.downloadPosterImg()
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

  handleMenuClick = async (type) => {
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
        const favRes = await api.member.addFav(info.item_id)
        this.props.onAddFav(favRes)
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

  handleSepcImgClick = (index) => {
    const { sixSpecImgsDict, info } = this.state
    this.setState({
      currentImgs: index
    })
    if (sixSpecImgsDict[index].images.length) {
      info.pics = sixSpecImgsDict[index].images
      this.setState({
        info,
        curImgIdx: 0
      })
    }
  }

  handlePackageClick = () => {
    const { info } = this.state

    Taro.navigateTo({
      url: `/pages/item/package-list?id=${info.item_id}`
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
    console.log(222)
    const userinfo = Taro.getStorageSync('userinfo')
    if (!userinfo) return
    console.log(111)
    const { avatar, userId } = userinfo
    const { info } = this.state
    const { pics, company_id, item_id } = info
    const host = req.baseURL.replace('/api/h5app/wxapp/','')
    console.log(host)
    const extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
    const { distributor_id } = Taro.getStorageSync('curStore')
    const pic = pics[0].replace('http:', 'https:')

    const wxappCode = `${host}/wechatAuth/wxapp/qrcode.png?appid=${extConfig.appid}&company_id=${company_id}&id=${item_id}&dtid=${distributor_id}&uid=${userId}`
    const avatarImg = await Taro.getImageInfo({src: avatar})
    const goodsImg = await Taro.getImageInfo({src: pic})
    const codeImg = await Taro.getImageInfo({src: wxappCode})

    const posterImgs = {
      avatar: avatarImg.path,
      goods: goodsImg.path,
      code: codeImg.path
    }

    this.setState({
      posterImgs
    })
    // this.drawCanvas()
    // setTimeout(() => {
    //  // 将生成的canvas图片，转为真实图片
    //   wx.canvasToTempFilePath({
    //     x: 0,
    //     y: 0,
    //     canvasId: 'myCanvas',
    //     success: function (res) {
    //       let shareImg = res.tempFilePath;
    //       that.poster.imgUrl = shareImg
    //       that.$apply()
    //     },
    //     fail: function (res) {
    //     }
    //   })
    // }, 500)
  }

  drawImage = () => {
    const { posterImgs } = this.state
    if (!posterImgs) {
      Taro.showToast({
        title: '请登录后再收藏',
        icon: 'none'
      })
    }
    const { info } = this.state
    const { pics, item_name, act_price = null, member_price = null, price } = info
    const mainPrice = act_price ? act_price : member_price ? member_price : price

    const { username, avatar, userId } = Taro.getStorageSync('userinfo')
    const ctx = Taro.createCanvasContext('myCanvas')

    canvasExp.roundRect(ctx, 0, 0, 300, 534)
    canvasExp.drawImageFill(ctx, avatar, 15, 60, 270, 270)


    // ctx.drawImage('../images/share_bg.jpg', 0, 0, 300, 534);
    // // ctx.drawImage('../images/logo.png', 11, 15, 89, 28);
    // ctx.save()
    // this.roundRect(ctx, 12, 57, 276, 365, 5);
    // ctx.restore()
    // ctx.drawImage(this.poster.goodsImg, 15, 60, 270, 270);
    //
    // ctx.setFontSize(15);
    // ctx.setFillStyle('#333333');
    // ctx.setTextAlign('center');
    // ctx.setTextBaseline('middle');
    // this.textOverflowFill(ctx, this.current.item_name, 150, 346, 227);
    //
    // ctx.drawImage('../images/vip_tag.png', 123, 364, 53, 16);
    //
    // let vipPrice = this.activityData.item.svip_pric e != 0 ? this.activityData.item.svip_price : this.activityData.item.vip_price
    // let activityPrice = this.activityData.item.activity_price
    // let mainPrice = vipPrice != 0 ? vipPrice : activityPrice
    // ctx.setFontSize(18);
    // ctx.setFillStyle('#928869');
    // ctx.setTextAlign('right');
    // ctx.setTextBaseline('bottom');
    // ctx.fillText(mainPrice/100, 160, 410);
    // let vipPriceWidth = ctx.measureText(`${mainPrice/100}`).width
    // ctx.setFontSize(11);
    // ctx.fillText('¥', 160-vipPriceWidth, 409);
    // if (vipPrice != 0) {
    //   ctx.setFontSize(10);
    //   ctx.setFillStyle('#999999');
    //   ctx.setTextAlign('left');
    //   ctx.fillText(activityPrice/100, 161, 409);
    // }
    //
    // ctx.setFontSize(10);
    // ctx.setFillStyle('#333333');
    // ctx.setTextAlign('left');
    // ctx.setTextBaseline('middle');
    // ctx.fillText(`小区团长: ${this.communityData.leader_name}`, 12, 440);
    // ctx.fillText(`预计送达: ${this.activityData.delivery_date}`, 12, 460);
    // this.textOverflowFill(ctx, `提货地址: ${this.communityData.address}`, 12, 480, 200);
    //
    // ctx.setFontSize(12);
    // ctx.setFillStyle('#333333');
    // ctx.setTextBaseline('middle');
    // ctx.fillText('保存图片扫一扫，优惠拼团', 12, 505.5);
    // ctx.fillText('保存图片扫一扫，优惠拼团', 11.5, 506);
    //
    // ctx.save()
    // this.imgCircleClip(ctx, this.poster.qrcode, 80, 80, 208, 441);
    // ctx.restore()
    //
    // ctx.draw();
  }

  handleShare () {
    if (!S.getAuthToken()) {
      Taro.showToast({
        title: '请先登录再分享',
        icon: 'none'
      })

      setTimeout(() => {
        S.login(this)
      }, 2000)

      return
    }

    this.setState({
      showSharePanel: true
    })
  }

  handleToGiftMiniProgram = () => {
    Taro.navigateToMiniProgram({
      appId: APP_GIFT_APPID, // 要跳转的小程序的appid
      path: '/pages/index/index', // 跳转的目标页面
      success(res) {
        // 打开成功
        console.log(res)
      }
    })
  }

  render () {
    const store = Taro.getStorageSync('curStore')
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
      vip,
      promotion_activity,
      promotion_package,
      itemParams,
      sessionFrom,
      currentImgs,
      marketing,
      timer,
      isPromoter,
      startSecKill,
      hasStock,
      showBuyPanel,
      buyPanelType,
      showSharePanel
    } = this.state

    const uid = this.uid

    if (!info) {
      return (
        <Loading />
      )
    }

    const { pics: imgs } = info

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
            !info.nospec && sixSpecImgsDict.length
              ? <ImgSpec
                  info={sixSpecImgsDict}
                  current={currentImgs}
                  onClick={this.handleSepcImgClick}
                />
              : null
          }

          {timer && (
            <View className='goods-timer'>
              <View className='goods-timer__hd'>
                <View className='goods-prices'>
                  <Price
                    unit='cent'
                    symbol={info.cur.symbol}
                    value={info.act_price}
                  />
                  <Price
                    unit='cent'
                    className='goods-prices__market'
                    symbol={info.cur.symbol}
                    value={info.price}
                  />
                  {
                    marketing === 'group' &&
                      <View className='goods-prices__ft'>
                        <Text className='goods-prices__type'>团购</Text>
                        <Text className='goods-prices__rule'>{info.activity_info.person_num}人团</Text>
                      </View>
                  }
                  {
                    marketing === 'seckill' &&
                      <View className='goods-prices__ft'>
                        <Text className='goods-prices__type'>秒杀</Text>
                      </View>
                  }
                </View>
              </View>
              <View className='goods-timer__bd'>
                <Text className='goods-timer__label'>距结束还剩</Text>
                <AtCountdown
                  className="countdown__time"
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

                {
                  info.sales && (<Text className='goods-sold'>{info.sales || 0}人已购</Text>)
                }
              </View>
            )}
          </View>

          {
            info.vipgrade_guide_title &&
              <VipGuide
                info={info.vipgrade_guide_title}
              />
          }

          {
            info.is_vip_grade &&
              <VipGuide
                info={vip}
              />
          }

          {isPromoter && (
            <View className='goods-income'>
              <View className='sp-icon sp-icon-jifen'></View>
              <Text>预计收益：{(info.promoter_price/100).toFixed(2)}</Text>
            </View>
          )}

          {
            promotion_activity && promotion_activity.length > 0
              ? <View className='goods-sec-specs'>
                <View className='goods-sec-specs__activity'>
                  {
                    promotion_activity.map(item =>{
                      return (
                        <View
                          key={item.marketing_id}
                          className='goods-sec-specs__activity-item'
                        >
                          <View className='promotion-title'>以下优惠可参与{item.join_limit}次</View>
                          <Text className='goods-sec-specs__activity-label promotion-text'>【{item.promotion_tag}】</Text>
                          <Text className='promotion-text'>{item.marketing_name}</Text>
                          <View className='promotion-rule-content'>
                            <Text className='promotion-rule-content__text'>活动时间：{item.start_date}~{item.end_date}</Text>
                            <Text className='promotion-rule-content__text'>活动规则：{item.condition_rules}</Text>
                          </View>
                          {
                            item.promotion_tag === '满赠' && item.gifts
                              ? <View>
                                  {item.gifts.map(g_item => {
                                    return (
                                      <View className='promotion-goods'>
                                        <Text className='promotion-goods__tag'>【赠品】</Text>
                                        <Text className='promotion-goods__name'>{g_item.gift.item_name} </Text>
                                        <Text className='promotion-goods__num'>x{g_item.gift.gift_num}</Text>
                                      </View>
                                    )
                                  })}
                                </View>
                              : null
                          }
                        </View>
                      )
                    })
                  }
                </View>
              </View>
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
            itemParams.length &&
              <SpCell
                className='goods-sec-specs'
                isLink
                title='商品参数'
                onClick={this.handleParamsClick.bind(this)}
              />
          }

          {
            !info.nospec &&
              <SpCell
                className='goods-sec-specs'
                isLink
                title='规格'
                onClick={this.handleBuyBarClick.bind(this, buyPanelType)}
                value={curSku ? curSku.propsText : '请选择'}
              />
          }

          {
            (store && positionStatus) &&
              <StoreInfo
                info={store}
              />
          }

          {
            isArray(desc)
              ? <View className='wgts-wrap__cont'>
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
              : <SpHtmlContent
                className='goods-detail__content'
                content={desc}
              />
          }

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

        {/* <FloatMenuItem
          iconPrefixClass='in-icon'
          icon='float-gift'
          onClick={this.handleToGiftMiniProgram.bind(this)}
        /> */}
        <FloatMenus>
          <FloatMenuItem
            iconPrefixClass='in-icon'
            icon='fenxiang1'
            onClick={this.handleShare.bind(this)}
          />
          <FloatMenuItem
            iconPrefixClass='in-icon'
            icon='kefu'
            openType='contact'
            sessionFrom={sessionFrom}
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
              cartCount={cartCount}
              onFavItem={this.handleMenuClick.bind(this, 'fav')}
              onClickAddCart={this.handleBuyBarClick.bind(this, 'cart')}
              onClickFastBuy={this.handleBuyBarClick.bind(this, 'fastbuy')}
            />)
          :
            (<GoodsBuyToolbar
              info={info}
              customRender
              cartCount={cartCount}
              type={marketing}
            >
              <View
                className='goods-buy-toolbar__btns'
                style='width: 60%; text-align: center'
              >
                {
                  !startSecKill
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
            onChange={this.handleSkuChange}
            onAddCart={this.handleBuyAction.bind(this, 'cart')}
            onFastbuy={this.handleBuyAction.bind(this, 'fastbuy')}
          />
        }

        {
          <SharePanel
            info={uid}
            isOpen={showSharePanel}
            onClose={() => this.setState({ showSharePanel: false })}
          />
        }

        <Canvas className="canvas" canvas-id="myCanvas"></Canvas>

        <SpToast />
      </View>
    )
  }
}
