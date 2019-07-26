import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { SpToast, TabBar, Loading, SpNote, BackToTop, FloatMenus, FloatMenuItem } from '@/components'
import req from '@/api/req'
import api from '@/api'
import { pickBy } from '@/utils'
import { withPager, withBackToTop } from '@/hocs'
import S from "@/spx";
import { HeaderHome, WgtSearchHome, WgtSlider, WgtLimittimeSlider, WgtImgHotZone, WgtGoodsFaverite, WgtMarquees, WgtNavigation, WgtCoupon, WgtGoodsScroll, WgtGoodsGrid, WgtShowcase, WgtPointLuck } from './home/wgts'

import './home/index.scss'
import PointDrawCompute from "./member/point-draw-compute";

@connect(store => ({
  store
}))
@withPager
@withBackToTop
export default class HomeIndex extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      wgts: null,
      authStatus: false,
      likeList: [],
      isShowAddTip: false
    }
  }

  componentDidShow = () => {
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
    this.fetchInfo()
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

  async fetchInfo () {
    const url = '/pageparams/setting?template_name=yykweishop&version=v1.0.1&page_name=index'
    const info = await req.get(url)

    if (!S.getAuthToken()) {
      this.setState({
        authStatus: true
      })
    }
    this.setState({
      wgts: info.config
    },()=>{
      if(info.config) {
        info.config.map(item => {
          if(item.name === 'setting' && item.config.faverite) {
            this.nextPage()
          }
        })
      }
    })
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
    const { wgts, authStatus, page, likeList, showBackToTop, scrollTop, isShowAddTip } = this.state
    const user = Taro.getStorageSync('userinfo')
    const isPromoter = user && user.isPromoter
    const distributionShopId = Taro.getStorageSync('distribution_shop_id')

    if (!wgts || !this.props.store) {
      return <Loading />
    }

    return (
      <View className='page-index'>
        {/* <HeaderHome /> */}
        <ScrollView
          className='wgts-wrap wgts-wrap__fixed'
          scrollTop={scrollTop}
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
          scrollY
        >
          <View className='wgts-wrap__cont'>
            {/*<WgtLimittimeSlider />*/}
            {
              wgts.map((item, idx) => {
                return (
                  <View className='wgt-wrap' key={idx}>
                    {item.name === 'search' && <WgtSearchHome info={item} />}
                    {item.name === 'slider' && <WgtSlider info={item} />}
                    {item.name === 'marquees' && <WgtMarquees info={item} />}
                    {item.name === 'navigation' && <WgtNavigation info={item} />}
                    {item.name === 'coupon' && <WgtCoupon info={item} />}
                    {item.name === 'imgHotzone' && <WgtImgHotZone info={item} />}
                    {item.name === 'goodsScroll' && <WgtGoodsScroll info={item} />}
                    {item.name === 'goodsGrid' && <WgtGoodsGrid info={item} />}
                    {item.name === 'showcase' && <WgtShowcase info={item} />}
                    {idx === 1 && (
                      <WgtPointLuck />
                    )}
                  </View>
                )
              })
            }
            {
              wgts.map((item, idx) => {
                return (
                  <View className='wgt-wrap faverite-content' key={idx}>
                    {item.name === 'setting' && item.config.faverite
                      ? (
                        <View>
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
                      )
                      : null
                    }
                    {idx === 1 && (
                      <WgtPointLuck />
                    )}
                  </View>
                )
              })
            }
          </View>
        </ScrollView>

        {
          (isPromoter || distributionShopId)
          && <FloatMenus>
              <Image
                className='distribution-shop'
                src='/assets/imgs/gift_mini.png'
                mode='widthFix'
                onClick={this.handleClickShop}
              />
            </FloatMenus>
        }

        <BackToTop
          show={showBackToTop}
          onClick={this.scrollBackToTop}
        />
        {
          isShowAddTip ? <View className='add_tip'>
            <View class="tip-text">点击“•●•”添加到我的小程序，微信首页下拉即可快速访问店铺</View>
            <View className='icon-close icon-view' onClick={this.handleClickCloseAddTip.bind(this)}> </View>
          </View> : null
        }

        <SpToast />
        <TabBar />
      </View>
    )
  }
}
