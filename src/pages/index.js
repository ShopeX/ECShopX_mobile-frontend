import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { SpToast, TabBar, Loading, SpNote, BackToTop } from '@/components'
import req from '@/api/req'
import api from '@/api'
import { pickBy } from '@/utils'
import { withPager, withBackToTop } from '@/hocs'
import S from "@/spx";
import { WgtSearchHome, WgtSlider, WgtLimittimeSlider, WgtImgHotZone, WgtGoodsFaverite, WgtNavigation, WgtCoupon, WgtGoodsScroll, WgtGoodsGrid, WgtShowcase, WgtPointLuck } from './home/wgts'

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
      authStatus: false,
      likeList: [],
      isFaverite_open: false
    }
  }

  componentDidMount () {
    this.fetchInfo()
  }

  async fetchInfo () {
    const url = '/pageparams/setting?template_name=yykweishopamore&version=v1.0.1&page_name=index'
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
          if(item.name === 'faverite_type' && item.config.isOpen === true) {
            this.setState({
              isFaverite_open: true
            })
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

  render () {
    const { wgts, authStatus, page, likeList, showBackToTop, scrollTop } = this.state

    if (!wgts || !this.props.store) {
      return <Loading />
    }

    return (
      <View className='page-index'>
        <ScrollView
          className='wgts-wrap wgts-wrap__fixed'
          scrollTop={scrollTop}
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
          scrollTop={scrollTop}
          scrollY
        >
          <View className='wgts-wrap__cont'>
            <WgtSearchHome />
            {/*<WgtLimittimeSlider />*/}
            {
              wgts.map((item, idx) => {
                return (
                  <View className='wgt-wrap' key={idx}>
                    {item.name === 'slider' && <WgtSlider info={item} />}
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
                    {item.name === 'faverite_type' && item.config.isOpen === true
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
          <Image
            src='/assets/imgs/innisfree/license.png'
            className='img-license'
            onClick={this.handleClickLicense}
          />
        </ScrollView>

        <BackToTop
          show={showBackToTop}
          onClick={this.scrollBackToTop}
        />
        <SpToast />
        <TabBar />
      </View>
    )
  }
}
