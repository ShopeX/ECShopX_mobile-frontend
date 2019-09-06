import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { SpToast, TabBar, Loading, SpNote, BackToTop } from '@/components'
import req from '@/api/req'
import api from '@/api'
import { pickBy } from '@/utils'
import entry from '@/utils/entry'
import { withPager, withBackToTop } from '@/hocs'
import S from "@/spx";
import { WgtSlider, WgtLimittimeSlider, WgtImgHotZone, WgtGoodsFaverite, WgtMarquees, WgtNavigation, WgtCoupon, WgtGoodsScroll, WgtGoodsGrid, WgtShowcase, WgtPointLuck } from '../home/wgts'

import './index.scss'

@connect(store => ({
  store
}))
@withBackToTop
export default class StoreIndex extends Component {
  constructor (props) {
    super(props)

    this.state = {
      wgts: null,
      authStatus: false,
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
    const options = this.$router.params
    const res = await entry.entryLaunch(options, true)

    const { distributor_id } = await Taro.getStorageSync('curStore')
    const url = `/pageparams/setting?template_name=yykweishop&version=shop_${distributor_id}&page_name=shop_home`
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

  render () {
    const { wgts, authStatus, page, likeList, showBackToTop, scrollTop, isShowAddTip } = this.state
    const { name, brand = '' } = Taro.getStorageSync('curStore')
    const user = Taro.getStorageSync('userinfo')
    const isPromoter = user && user.isPromoter
    const distributionShopId = Taro.getStorageSync('distribution_shop_id')

    if (!wgts || !this.props.store) {
      return <Loading />
    }

    return (
      <View className='page-store-index'>
        <ScrollView
          className='wgts-wrap wgts-wrap__fixed'
          scrollTop={scrollTop}
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
          scrollY
        >
          <View className='wgts-wrap__cont'>
            <View className='store-header'>
              <View>
                <Image className='store-brand' src={brand || 'https://fakeimg.pl/120x120/FFF/CCC/?text=brand&font=lobster'} />
              </View>
              <View className="store-name">{name}</View>
            </View>
            {
              wgts.map((item, idx) => {
                return (
                  <View className='wgt-wrap' key={idx}>
                    {item.name === 'slider' && <WgtSlider info={item} />}
                    {item.name === 'marquees' && <WgtMarquees info={item} />}
                    {item.name === 'navigation' && <WgtNavigation info={item} />}
                    {item.name === 'coupon' && <WgtCoupon info={item} />}
                    {item.name === 'imgHotzone' && <WgtImgHotZone info={item} />}
                    {item.name === 'goodsScroll' && <WgtGoodsScroll info={item} />}
                    {item.name === 'goodsGrid' && <WgtGoodsGrid info={item} />}
                    {item.name === 'showcase' && <WgtShowcase info={item} />}
                  </View>
                )
              })
            }
          </View>
        </ScrollView>

        <BackToTop
          show={showBackToTop}
          onClick={this.scrollBackToTop}
        />

        <SpToast />
      </View>
    )
  }
}
