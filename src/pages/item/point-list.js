import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Text } from '@tarojs/components'
import { withPager, withBackToTop } from '@/hocs'
import { BackToTop, Loading, GoodsItem } from '@/components'
import { AtDivider } from 'taro-ui'
import api from '@/api'
import { pickBy } from '@/utils'

import './point-list.scss'

@withPager
@withBackToTop
export default class PointList extends Component {
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

    const { list, total_count: total } = await api.item.search(query)

    const nList = pickBy(list, {
      img: 'pics[0]',
      item_id: 'item_id',
      title: 'itemName',
      desc: 'brief',
      price: 'point',
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
    const url = `/pages/item/point-detail?id=${item.item_id}&is_point=true`
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
                <Text>全部商品</Text>
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
                    key={item.item_id}
                    info={item}
                    noCurSymbol
                    appendText='积分'
                    onClick={this.handleClickItem.bind(this, item)}
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
