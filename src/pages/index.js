import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { SpToast, TabBar, Loading, SpNote, BackToTop, FloatMenus, FloatMenuItem } from '@/components'
import req from '@/api/req'
import api from '@/api'
import { pickBy } from '@/utils'
import entry from '@/utils/entry'
import { withPager, withBackToTop } from '@/hocs'
import S from "@/spx";
import { WgtGoodsFaverite, HeaderHome } from './home/wgts'
import { HomeWgts } from './home/comps/home-wgts'
import { resolveFavsList } from './item/helper'

import './home/index.scss'

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
      goodsFavWgt: null,
      authStatus: false,
      likeList: [],
      isShowAddTip: false,
      curStore: null,
      positionStatus: false
    }
  }

  componentDidShow = () => {
    const curStore = Taro.getStorageSync('curStore')
    if (curStore) {
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

  async componentDidMount () {
    const url = '/pageparams/setting?template_name=yykweishop&version=v1.0.1&page_name=index&name=search'
    const fixSetting = await req.get(url)

    const options = this.$router.params
    const res = await entry.entryLaunch(options, true)
    console.log(res)
    const { store } = res
    if (store) {
      this.setState({
        curStore: store,
        positionStatus: (fixSetting.length && fixSetting[0].params.config.fixTop) || false
      }, () => {
        this.fetchInfo()
      })
    }
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
      price: ({ price }) => { return (price/100).toFixed(2)},
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
    const { wgts, authStatus, page, likeList, showBackToTop, scrollTop, isShowAddTip, curStore, positionStatus } = this.state
    const user = Taro.getStorageSync('userinfo')
    const isPromoter = user && user.isPromoter
    const distributionShopId = Taro.getStorageSync('distribution_shop_id')

    if (!wgts || !this.props.store) {
      return <Loading />
    }

    return (
      <View className='page-index'>
        {
          curStore &&
            <HeaderHome
              storeName={curStore.name}
            />
        }
        <ScrollView
          className={`wgts-wrap ${positionStatus ? 'wgts-wrap__fixed' : ''}`}
          scrollTop={scrollTop}
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
          scrollY
        >
          <View className='wgts-wrap__cont'>
            <HomeWgts
              wgts={wgts}
            />
            {!!goodsFavWgt && (
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
            )}

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
