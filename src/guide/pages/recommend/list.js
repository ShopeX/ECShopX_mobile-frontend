import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { withPager, withBackToTop } from '@/hocs'
import { SearchBar, RecommendItem, SpNote } from '@/components'
import {BaTabBar} from '../../components'
import api from '@/api'
import { pickBy } from '@/utils'

import './list.scss'

@withPager
@withBackToTop
export default class RecommendList extends Component{
  constructor(props){
    super(props)
    this.state = {
      ...this.state,
      query: null,
      list: [],
      isShowSearch: false
    }
  }

  config = {
    navigationBarTitleText: '种草'
  }
  componentDidMount () {
    this.nextPage()
  }

  componentDidShow(){

  }

  // 搜索查询
  handleSearchOn = () => {
    this.setState({
      isShowSearch: true
    })
  }
  handleSearchOff = () => {
    this.setState({
      isShowSearch: false
    })
  }
  handleSearchChange = (val) => {
    this.setState({
      query: {
        ...this.state.query,
        title: val
      }
    })
  }
  handleSearchClear = () => {
    this.setState({
      isShowSearch: false,
      query: {
        ...this.state.query,
        title: ''
      }
    }, () => {
      this.resetPage()
      this.setState({
        list: []
      }, () => {
        this.nextPage()
      })
    })
  }
  handleConfirm = (val) => {
    this.setState({
      isShowSearch: false,
      query: {
        ...this.state.query,
        title: val,
      }
    }, () => {
      this.resetPage()
      this.setState({
        list: []
      }, () => {
        this.nextPage()
      })
    })
  }

  async fetch(params) {
    const { page_no: page, page_size: pageSize } = params
    const article_query = {
      article_type: 'bring',
      ...this.state.query,
      page,
      pageSize
    }
    
    const { list, total_count: total } = await api.article.list(article_query)
    if (list.length) {
      const nList = pickBy(list, {
        img: 'image_url',
        item_id: 'article_id',
        title: 'title',
        author: 'author',
        summary: 'summary',
        head_portrait: 'head_portrait',
        isPraise: 'isPraise',
        articlePraiseNum: 'articlePraiseNum.count',
      })

      this.setState({
        list: [...this.state.list, ...nList]
      })
    }
    return {
      total
    }
  }

  handleClickItem = (item) => {
    const url = `/subpage/pages/recommend/detail?id=${item.item_id}`
    Taro.navigateTo({
      url
    })
  }

  render() {
    const { query, isShowSearch, scrollTop, list, page } = this.state

    return(
      <View className="guide-recommend-list">
        <View className={`recommend-list__search ${(query && query.title && isShowSearch) ? 'on-search' : null}`}>
          <SearchBar
            showDailog={false}
            keyword={query ? query.title : ''}
            onFocus={this.handleSearchOn}
            onChange={this.handleSearchChange}
            onClear={this.handleSearchClear}
            onCancel={this.handleSearchOff}
            onConfirm={this.handleConfirm.bind(this)}
          />
        </View>
          
        <ScrollView
          className='recommend-list__scroll'
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
        >
          <View className='recommend-list recommend-list__type-grid'>
            {
              list.map(item => {
                return (
                  <View className='recommend-list__item'>
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
        <BaTabBar current={3} />
      </View>
    )
  }
}
