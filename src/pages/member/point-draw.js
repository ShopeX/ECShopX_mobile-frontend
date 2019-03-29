import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Text, Progress } from '@tarojs/components'
import { withPager, withBackToTop } from '@/hocs'
import { BackToTop, Loading, Price, GoodsItem, NavBar } from '@/components'
import { AtDivider } from 'taro-ui'
import api from '@/api'
import { pickBy, log } from '@/utils'

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
      listType: 'grid'
    }
  }

  componentDidMount () {
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

    log.debug(`[point draw picked]`, nList)
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
        <NavBar
          title='抽奖商品列表'
          leftIconType='chevron-left'
          fixed='true'
        />
        <View className='goods-list__toolbar'>
          <View className='goods-list__toolbar-title'>
            <AtDivider fontColor='#C40000' lineColor='#C40000'>
              <View>
                <Text className='sp-icon sp-icon-lifangtilitiduomiantifangkuai2 icon-allgoods'> </Text>
                <Text>抽奖商品</Text>
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
                    renderFooter={
                      <View className='goods-item__ft-inner'>
                        <Text>已筹集积分</Text>
                        <Progress
                          strokeWidth={6}
                          percent={item.rate}
                          showInfo
                          activeColor='#13CE66'
                        />
                      </View>
                    }
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
