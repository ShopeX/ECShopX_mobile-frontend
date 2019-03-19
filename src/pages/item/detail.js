import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Swiper, SwiperItem, Image } from '@tarojs/components'
import { AtDivider } from 'taro-ui'
import { Loading, Price, BackToTop, GoodsBuyToolbar, SpHtmlContent } from '@/components'
import api from '@/api'
import { withBackToTop } from '@/hocs'
import { styleNames, log, pickBy } from '@/utils'
import RateItem from './comps/rate-item'
import GoodsBuyPanel from './comps/buy-toolbar'

import './detail.scss'

@withBackToTop
export default class Detail extends Component {
  static options = {
    addGlobalClass: true
  }

  constructor (props) {
    super(props)

    this.state = {
      info: null,
      rateList: null,
      desc: null,
      windowWidth: 320,
      curImgIdx: 0,
      showBuyPanel: false
    }
  }

  componentDidMount () {
    this.handleResize()
    this.fetch()
  }

  handleResize () {
    const { windowWidth } = Taro.getSystemInfoSync()
    this.setState({
      windowWidth
    })
  }

  async fetch () {
    const { id } = this.$router.params
    const info = await api.item.detail(id)
    const rateList = await api.item.rateList(id)
    const desc = await api.item.desc(id)

    this.setState({ info, rateList, desc })
    log.debug('fetch: done', info, rateList, desc)
  }

  handleSwiperChange = (e) => {
    const { detail: { current } } = e
    this.setState({
      curImgIdx: current
    })
  }

  handleClickAction = () => {
    this.setState({
      showBuyPanel: true
    })
  }

  render () {
    const { info, windowWidth, curImgIdx, rateList, desc, scrollTop, showBackToTop, showBuyPanel } = this.state

    if (!info) {
      return (
        <Loading />
      )
    }

    return (
      <View className='page-goods-detail'>
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
              style={`height: ${windowWidth}px`}
              current={curImgIdx}
              onChange={this.handleSwiperChange}
            >
              {
                info.item.images.map((img, idx) => {
                  return (
                    <SwiperItem key={idx}>
                      <Image
                        src={img}
                        mode='aspectFill'
                        style={styleNames({ width: windowWidth + 'px', height: windowWidth + 'px' })}
                      />
                    </SwiperItem>
                  )
                })
              }
            </Swiper>
            {
              info.item.images.length > 1
                && <Text className='goods-imgs__text'>{curImgIdx + 1} / {info.item.images.length}</Text>
            }
          </View>

          <View className='goods-hd'>
            <View className='goods-prices'>
              <Price primary value={info.item.price}></Price>

              <View className='goods-prices__market'>
                <Price value={info.item.mkt_price}></Price>
              </View>
            </View>

            <View className='goods-title__wrap'>
              <Text className='goods-title'>{info.item.title}</Text>
              <View className='goods-fav'>
                <View className='at-icon at-icon-star'></View>
                <Text className='goods-fav__text'>收藏</Text>
              </View>
            </View>
          </View>

          <View
            className='sec goods-sec-action'
            onClick={this.handleClickAction}
          >
            <Text className='goods-action'>
              <Text className='goods-action__label'>选择</Text>
              <Text>购买尺寸、颜色、数量、分类</Text>
            </Text>
            <View className='sec-ft'>
              <View className='at-icon at-icon-chevron-right'></View>
            </View>
          </View>

          <View className='sec goods-sec-comment'>
            <View className='sec-hd'>
              <Text className='sec-title'>宝贝评价（{info.item.rate_count}）</Text>
              <Text className='more'>
                <Text>查看全部</Text>
                <Text className='at-icon at-icon-chevron-right'></Text>
              </Text>
            </View>
            <View className='sec-bd'>
              {
                rateList && rateList.list.length > 0
                  ? rateList.list.slice(0, 5).map(item => {
                      return (
                        <RateItem
                          key={item.rate_id}
                          info={item}
                        />
                      )
                    })
                  : null
              }
            </View>
          </View>

          <View className='goods-sec-detail'>
            <AtDivider content='宝贝详情'></AtDivider>
            <SpHtmlContent
              className='goods-detail__content'
              content={desc.wap_desc}
            />
          </View>
        </ScrollView>

        <BackToTop
          bottom={150}
          show={showBackToTop}
          onClick={this.scrollBackToTop}
        />

        <GoodsBuyToolbar
          onClickAddCart={this.onClickAddCart}
          onClickFastBuy={this.onClickFastBuy}
        />

        {
          info && <GoodsBuyPanel
            info={info.item}
            isOpened={showBuyPanel}
            onClose={() => this.setState({ showBuyPanel: false })}
          />
        }
      </View>
    )
  }
}
