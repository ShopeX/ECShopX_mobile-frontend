import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Text } from '@tarojs/components'
import { withPager, withBackToTop } from '@/hocs'
import { BackToTop, Loading, GoodsItem } from '@/components'
import { AtDivider,AtIcon } from 'taro-ui'
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
      curFilterIdx: 0,
      filterList: [
        { title: '综合' },
        { title: '销量' },
        { title: '价格', sort: -1 }
      ],
      query: null,
      list: [],
      listType: 'grid'
    }
  }

  componentDidMount () {
    this.setState({
      query: {
        keywords: '',
        distributor_id: 16,
        item_type: 'normal',
        approve_status: 'onsale,only_show',
        is_point: true,
        category: this.$router.params.cat_id
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

  handleFilterChange = (data) => {
    const { current, sort } = data

    const query = {
      ...this.state.query,
      goodsSort: current === 0
        ? null
        : current === 1
          ? 1
          : (sort > 0 ? 3 : 2)
    }

    if (current !== this.state.curFilterIdx || (current === this.state.curFilterIdx && query.goodsSort !== this.state.query.goodsSort)) {
      this.resetPage()
      this.setState({
        list: []
      })
    }

    this.setState({
      curFilterIdx: current,
      query
    }, () => {
      this.nextPage()
    })
  }

  handleListTypeChange = () => {
    const listType = this.state.listType === 'grid' ? 'default' : 'grid'

    this.setState({
      listType
    })
  }

  handleClickItem = (item) => {
    console.log(item.item_id, 109)
    const url = `/pages/item/point-detail?id=${item.item_id}`
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
                <AtIcon value='check-circle'></AtIcon>
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
