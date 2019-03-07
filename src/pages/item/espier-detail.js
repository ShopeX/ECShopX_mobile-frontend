import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Swiper, SwiperItem, Image } from '@tarojs/components'
import { AtDivider } from 'taro-ui'
import { Loading, Price, BackToTop, GoodsBuyToolbar, SpHtmlContent } from '@/components'
import api from '@/api'
import { withBackToTop } from '@/hocs'
import { styleNames, log } from '@/utils'

import './espier-detail.scss'

@withBackToTop
export default class Detail extends Component {
  static options = {
    addGlobalClass: true
  }

  constructor (props) {
    super(props)

    this.state = {
      info: null,
      desc: null,
      windowWidth: 320,
      curImgIdx: 0
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
    const { intro: desc } = info

    this.setState({ info, desc })
    log.debug('fetch: done', info)
  }

  handleSwiperChange = (e) => {
    const { detail: { current } } = e
    this.setState({
      curImgIdx: current
    })
  }

  handleClickAction = () => {
  }

  render () {
    const { info, windowWidth, curImgIdx, desc, scrollTop, showBackToTop } = this.state

    if (!info) {
      return (
        <Loading />
      )
    }

    const { pics: imgs } = info

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
              onChange={this.handleSwiperChange}
            >
              {
                imgs.map((img, idx) => {
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
              imgs.length > 1
                && <Text className='goods-imgs__text'>{curImgIdx + 1} / images.length}</Text>
            }
          </View>

          <View className='goods-hd'>
            <View className='goods-prices'>
              <Price primary value={info.price}></Price>

              <View className='goods-prices__market'>
                <Price
                  symbol={info.cur.symbol}
                  value={info.mkt_price}
                />
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
      </View>
    )
  }
}
