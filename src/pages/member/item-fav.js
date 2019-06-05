import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { withPager, withBackToTop } from '@/hocs'
import { BackToTop, Loading, GoodsItem, NavBar, SpNote, RecommendItem } from '@/components'
import api from '@/api'
import { pickBy } from '@/utils'

import './item-fav.scss'

@connect(({
  member
}) => ({
  favs: member.favs
}))
@withPager
@withBackToTop
export default class ItemFav extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      curTabIdx: 0,
      tabList: [
        {title: '商品', status: '0'},
        {title: '种草', status: '1'}
      ],
      list: []
    }
  }

  componentDidMount () {
    this.nextPage()
  }

  async fetch (params) {
    const { page_no: page, page_size: pageSize } = params
    const query = {
      page,
      pageSize
    }

    const { list, total_count: total } = this.state.curTabIdx === 0 ? await api.member.favsList(query) : await api.article.totalCollectArticle(query)
    const { favs } = this.props

    if(this.state.curTabIdx === 0){
      const nList = pickBy(list, {
        img: 'item_image',
        fav_id: 'fav_id',
        item_id: 'item_id',
        title: 'item_name',
        desc: 'brief',
        price: ({ price }) => (price/100).toFixed(2),
        market_price: ({ market_price }) => (market_price/100).toFixed(2),
        is_fav: ({ item_id }) => Boolean(favs[item_id])
      })

      this.setState({
        list: [...this.state.list, ...nList],
        query
      })
    } else {
      const nList = pickBy(list, {
        img: 'image_url',
        fav_id: 'fav_id',
        item_id: 'article_id',
        title: 'title',
        desc: 'summary',
        head_portrait: 'head_portrait',
        author: 'author',
      })

      this.setState({
        list: [...this.state.list, ...nList],
        query
      })
    }


    return {
      total
    }
  }

  handleClickItem = (item) => {
    const url = this.state.curTabIdx === 0 ? `/pages/item/espier-detail?id=${item.item_id}` : `/pages/recommend/detail?id=${item.item_id}`
    Taro.navigateTo({
      url
    })
  }

  handleClickTab = (idx) => {
    if (this.state.page.isLoading) return

    if (idx !== this.state.curTabIdx) {
      this.resetPage()
      this.setState({
        list: []
      })
    }

    this.setState({
      curTabIdx: idx
    }, () => {
      this.nextPage()
    })
  }

  render () {
    const { list, showBackToTop, scrollTop, page, curTabIdx, tabList } = this.state

    return (
      <View className='page-goods-list page-goods-fav'>
        <View className='goods-list__toolbar'>
          <NavBar
            leftIconType='chevron-left'
            fixed='true'
          />
        </View>
        <AtTabs
          className='trade-list__tabs'
          current={curTabIdx}
          tabList={tabList}
          onClick={this.handleClickTab}
        >
          {
            tabList.map((panes, pIdx) =>
              (<AtTabsPane
                current={curTabIdx}
                key={pIdx}
                index={pIdx}
              >
              </AtTabsPane>)
            )
          }
        </AtTabs>
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
              curTabIdx === 0
                ? <View>
                    {
                      list.map(item => {
                        return (
                          <GoodsItem
                            key={item.item_id}
                            info={item}
                            onClick={() => this.handleClickItem(item)}
                          />
                        )
                      })
                    }
                  </View>
                : <View>
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
      </View>
    )
  }
}
