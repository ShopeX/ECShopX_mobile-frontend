import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { withPager, withBackToTop } from '@/hocs'
import { BackToTop, Loading, RecommendItem, NavBar, TabBar, SpNote } from '@/components'
import api from '@/api'
import { pickBy } from '@/utils'

import './list.scss'

@withPager
@withBackToTop
export default class RecommendList extends Component {
  static config = {
    navigationBarTitleText: '种草'
  }

  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      list: []
    }
  }

  componentDidMount () {
    this.nextPage()
  }

  async fetch (params) {
    const { page_no: page, page_size: pageSize } = params
    const query = {
      item_type: 'normal',
      is_point: 'false',
      approve_status: 'onsale,only_show',
      page,
      pageSize
    }

    const { list, total_count: total } = await api.item.search(query)

    const nList = pickBy(list, {
      img: 'pics[0]',
      item_id: 'item_id',
      title: 'itemName',
      desc: 'brief',
      price: ({ price }) => (price/100).toFixed(2),
      market_price: ({ market_price }) => (market_price/100).toFixed(2)
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
    const url = `/pages/recommend/detail?id=${item.item_id}`
    Taro.navigateTo({
      url
    })
  }

  render () {
    const { list, showBackToTop, scrollTop, page } = this.state

    return (
      <View className='page-goods-list page-recommend-list'>
        <View className='goods-list__toolbar'>
          <NavBar
            leftIconType='chevron-left'
            fixed='true'
          />
        </View>

        <ScrollView
          className='goods-list__scroll'
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
        >
          <View className='goods-list goods-list__type-grid'>
            {
              list.map(item => {
                return (
                  <RecommendItem
                    key={item.item_id}
                    info={item}
                    onClick={() => this.handleClickItem(item)}
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
          {
            !page.isLoading && !page.hasNext && !list.length
              && (<SpNote img='trades_empty.png'>暂无数据~</SpNote>)
          }
        </ScrollView>

        <BackToTop
          show={showBackToTop}
          onClick={this.scrollBackToTop}
        />

      <TabBar current={2}/>
      </View>
    )
  }
}
