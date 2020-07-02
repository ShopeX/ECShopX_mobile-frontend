import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { withPager, withBackToTop } from '@/hocs'
import api from '@/api'
import { pickBy } from '@/utils'
import { BackToTop, Loading, GoodsItem, NavBar, SpNote, RecommendItem } from '@/components'
import StoreFavItem from './comps/store-fav-item'

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
        {title: '软文', status: '1'},
        {title: '店铺', status: '2'},
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

    const { favs } = this.props

    const { list, total } = await (async () => {
      let list = []
      let total = 0
      let res = null
      switch (this.state.curTabIdx) {
        case 0:
          res = await api.member.favsList(query)
          list = pickBy(res.list, {
            img: 'item_image',
            fav_id: 'fav_id',
            item_id: 'item_id',
            title: 'item_name',
            desc: 'brief',
            // price: ({ price }) => (price/100).toFixed(2),
            price: ({ price, item_price }) => ((price || item_price)/100).toFixed(2),
            is_fav: ({ item_id }) => Boolean(favs[item_id])
          })
          total = res.total_count
          break;
        case 1:
          res = await api.article.totalCollectArticle(query)
          list = pickBy(res.list, {
            img: 'image_url',
            fav_id: 'fav_id',
            item_id: 'article_id',
            title: 'title',
            summary: 'summary',
            head_portrait: 'head_portrait',
            author: 'author',
          })
          total = res.total_count
          break;
        case 2:
          res = await api.member.storeFavList(query)
          list = pickBy(res.list, {
            distributor_id: 'distributor_id',
            fav_num: 'fav_num',
            name: 'name',
            logo: 'logo'
          })
          total = res.total_count
          break;
        default:
      }
      return { list, total }
    })()

    this.setState({
      list: [...this.state.list, ...list],
      query
    })

    return {
      total
    }
  }

  handleClickItem = (item) => {
    const url = (() => {
      let link = null
      switch (this.state.curTabIdx) {
        case 0:
					link = `/pages/item/espier-detail?id=${item.item_id}`
          break;
        case 1:
          link = `/pages/recommend/detail?id=${item.item_id}`
          break;
        case 2:
          link = `/pages/store/index?id=${item.distributor_id}`
          break;
        default:
          link = ''
			}
      return link
    })()
    Taro.navigateTo({
      url
    })
  }

  handleFavRemoved = () => {
    this.resetPage()
    this.setState({
      list: []
    }, () => {
      this.nextPage()
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
          {
            curTabIdx === 0
              && <View className='goods-list goods-list__type-grid'>
                  {
                    list.map(item => {
                      return (
                        <View className='goods-list__item'>
                          <GoodsItem
                            key={item.item_id}
                            info={item}
                            onClick={() => this.handleClickItem(item)}
                          />
                        </View>
                      )
                    })
                  }
                </View>
          }
          {
            curTabIdx === 1
              && <View className='goods-list goods-list__type-grid'>
                  {
                    list.map(item => {
                      return (
                        <View className='goods-list__item'>
                          <RecommendItem
                            key={item.item_id}
                            info={item}
                            onClick={() => this.handleClickItem(item)}
                          />
                        </View>
                      )
                    })
                  }
                </View>
          }
          {
            curTabIdx === 2
              && <View className='goods-list'>
                  {
                    list.map(item => {
                      return (
                        <View className='goods-list__item'>
                          <StoreFavItem
                            key={item.distributor_id}
                            info={item}
                            onClick={() => this.handleClickItem(item)}
                            onCancel={this.handleFavRemoved}
                          />
                        </View>
                      )
                    })
                  }
                </View>
          }
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
