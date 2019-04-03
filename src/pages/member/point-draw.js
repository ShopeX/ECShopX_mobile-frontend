import Taro, { Component } from '@tarojs/taro'
import {View, ScrollView, Text, Progress, Swiper, SwiperItem, Image} from '@tarojs/components'
import { withPager, withBackToTop } from '@/hocs'
import { BackToTop, Loading, Price, GoodsItem, NavBar } from '@/components'
import {AtDivider, AtNoticebar} from 'taro-ui'
import api from '@/api'
import { pickBy, log, styleNames, maskMobile, formatTime } from '@/utils'

import './point-draw.scss'

@withPager
@withBackToTop
export default class PointDraw extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      query: null,
      list: [],
      listType: '',
      windowWidth: 320,
      curImgIdx: 0,
      imgs: [],
      announce: null,
    }
  }

  componentDidMount () {
    this.handleResize()

    this.setState({
      query: {
        item_type: 'normal',
        approve_status: 'onsale,only_show',
        is_point: true,
      }
    }, () => {
      this.nextPage()
    })
  }

  async fetch (params) {
    const { page_no: page, page_size: pageSize } = params
    const query = {
      ...this.state.query,
      page,
      pageSize
    }

    const { list, total_count: total } = await api.member.pointDraw(query)

    const nList = pickBy(list, {
      luckydraw_id: 'luckydraw_id',
      img: 'goods_info.pics[0]',
      item_id: 'item_id',
      title: 'goods_info.itemName',
      desc: 'goods_info.brief',
      price: 'luckydraw_point',
      rate: ({ sales_num, luckydraw_store }) => Math.round((sales_num / luckydraw_store) * 100)
    })
    const imgs = await api.member.pointDrawSwiper()
    console.log(imgs, 60)
    log.debug(`[point draw picked]`, nList)
    this.setState({
      list: [...this.state.list, ...nList],
      query,
      imgs
    })

    const { list: announceList } = await api.member.pointDrawLuckAll()
    const announce = announceList.map(t => `[${formatTime(t.created * 1000)}] 恭喜${t.username} ${maskMobile(t.mobile)} 获得了 ${t.item_name}`).join('　　')
    this.setState({
      announce
    })
    return {
      total
    }
  }

  handleResize () {
    const { windowWidth } = Taro.getSystemInfoSync()
    this.setState({
      windowWidth
    })
  }

  handleSwiperChange = (e) => {
    const { detail: { current } } = e
    this.setState({
      curImgIdx: current
    })
  }

  handleClickItem = (item) => {
    const url = `/pages/member/point-draw-detail?luckydraw_id=${item.luckydraw_id}&item_id=${item.item_id}`
    Taro.navigateTo({
      url
    })
  }

  handleClickRule = () => {
    Taro.navigateTo({
      url: '/pages/member/draw-rule'
    })
  }

  render () {
    const { list, listType, showBackToTop, scrollTop, page, windowWidth, curImgIdx, imgs, announce } = this.state

    return (
      <View className='page-goods-list'>
        <NavBar
          title='抽奖商品列表'
          leftIconType='chevron-left'
          fixed='true'
        />
        {/*<View className='goods-list__toolbar'>*/}
          {/*<View className='goods-list__toolbar-title'>*/}
            {/*<AtDivider fontColor='#C40000' lineColor='#C40000'>*/}
              {/*<View>*/}
                {/*<Text className='sp-icon sp-icon-lifangtilitiduomiantifangkuai2 icon-allgoods'> </Text>*/}
                {/*<Text>抽奖商品</Text>*/}
              {/*</View>*/}
            {/*</AtDivider>*/}
          {/*</View>*/}
        {/*</View>*/}

        <ScrollView
          className='goods-listdraw__scroll'
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
        >
          <View className='goods-imgs__wrap'>
            <Swiper
              className='goods-imgs__swiper'
              style={`height: ${windowWidth}px`}
              current={curImgIdx}
              onChange={this.handleSwiperChange}
            >
              {
                imgs.map((img, idx) => {
                  return (
                    <SwiperItem key={idx}>
                      <Image
                        src={img.imgUrl}
                        mode='aspectFill'
                        style={styleNames({ width: windowWidth + 'px', height: windowWidth/1.5 + 'px' })}
                      />
                    </SwiperItem>
                  )
                })
              }
            </Swiper>
            {
              imgs.length > 1
              && <Text className='goods-imgs__text'>{curImgIdx + 1} / {imgs.length}</Text>
            }
            <AtNoticebar className='goods-imgs__notice' marquee>
              <Text>{announce}</Text>
            </AtNoticebar>
            <Text className='goods-imgs__rule' onClick={this.handleClickRule.bind(this)}>规则</Text>
          </View>
          <View className={`goods-list goods-list__type-${listType}`}>
            {
              list.map(item => {
                return (
                  <GoodsItem
                    key={item.luckydraw_id}
                    info={item}
                    noCurSymbol
                    noCurDecimal
                    appendText='积分'
                    onClick={this.handleClickItem.bind(this, item)}
                    customFooter
                    isPointDraw
                  />
                )
              })
            }
          </View>
          {
            page.isLoading
              ? <Loading>正在加载...</Loading>
              : null
          }
        </ScrollView>

        <BackToTop
          show={showBackToTop}
          onClick={this.scrollBackToTop}
        />
      </View>
    )
  }
}
