import Taro, { Component } from '@tarojs/taro'
import {View, ScrollView, Text, Image} from '@tarojs/components'
import { withPager, withBackToTop } from '@/hocs'
import { BackToTop, Loading, Price } from '@/components'
import { AtDivider } from 'taro-ui'
import api from '@/api'
import { pickBy } from '@/utils'

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
      listType: ''
    }
  }

  componentDidMount () {
    this.setState({
      query: {}
    }, () => {
      this.nextPage()
    })
  }

  async fetch (params) {
    const { page_no: page, page_size: pageSize } = params
    const query = {
      page,
      pageSize
    }

    const { list, total_count: total } = await api.member.pointDrawPayList(query)

    const nList = pickBy(list, {
      img: 'item_pic',
      item_id: 'luckydraw_trade_id',
      title: 'item_name',
      price: 'luckydraw_point',
      payment_status: 'payment_status',
      lucky_status: 'lucky_status',
    })
    nList.map(item => {
      if(item.payment_status === 'unpay') {
        item.payment_status = '未支付'
      } else if(item.payment_status === 'unpay'){
        item.payment_status = '已支付'
      } else {
        item.payment_status = '已退款'
      }
      if(item.lucky_status === 'lucky') {
        item.lucky_status = '中奖'
      }else if(item.lucky_status === 'unlukcy'){
        item.lucky_status = '未中奖'
      } else {
        item.lucky_status = '尚未开奖'
      }
    })
    this.setState({
      list: [...this.state.list, ...nList],
      query
    })

    return {
      total
    }
  }

  handleClickItem = (item) => {
    const url = `/pages/member/point-draw-detail?luckydraw_id=${item.luckydraw_id}&item_id=${item.item_id}`
    Taro.navigateTo({
      url
    })
  }

  render () {
    const { list, listType, showBackToTop, scrollTop, page } = this.state

    return (
      <View className='page-goods-list'>
        <View className='goods-list__toolbar'>
          <View className='goods-list__toolbar-title'>
            <AtDivider fontColor='#FF482B' lineColor='#FF482B'>
              <View>
                <Text className='sp-icon sp-icon-lifangtilitiduomiantifangkuai2 icon-allgoods'> </Text>
                <Text>抽奖信息</Text>
              </View>
            </AtDivider>
          </View>
        </View>

        <ScrollView
          className='goods-list__scroll'
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
        >
          <View className={`goods-list goods-list__type-${listType}`}>
            {
              list.map((item, index) => {
                return (
                  <View className='goods-item' key={index}>
                    <View className='goods-item__bd'>
                      <View className='goods-item__img-wrap'>
                        <Image className='goods-item__img' mode='aspectFill' src={item.img} />
                      </View>
                      <View className='goods-item__cont'>
                        <Text className='goods-item__title'>{item.title}</Text>
                        <Text className='goods-item__desc'>{item.payment_status}</Text>
                        <View className='goods-item__prices'>
                          <Price
                            primary
                            classes='goods-item__price'
                            className='goods-item__price'
                            noSymbol
                            noDecimal
                            appendText='积分'
                            value={item.price}
                          />
                          <View className='lucky-info'>{item.lucky_status}</View>
                        </View>
                      </View>
                    </View>
                  </View>
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
