import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components'
import { withPager, withBackToTop } from '@/hocs'
import { SearchBar, RecommendItem, SpNote } from '@/components'
import { BaTabBar, BaNavBar } from '../components'
import api from '@/api'
import S from '@/subpages/guide/lib/Spx.js'
import { pickBy, styleNames } from '@/utils'
import './list.scss'

@withPager
@withBackToTop
export default class RecommendList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      query: null,
      list: [],
      isShowSearch: false
    }
  }

  async componentDidMount() {
    await S.autoLogin(this)
    this.nextPage()
  }

  config = {
    navigationBarTitleText: '种草',
    navigationStyle: 'custom'
  }

  componentDidShow() {}

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
    this.setState(
      {
        isShowSearch: false,
        query: {
          ...this.state.query,
          title: ''
        }
      },
      () => {
        this.resetPage()
        this.setState(
          {
            list: []
          },
          () => {
            this.nextPage()
          }
        )
      }
    )
  }
  handleConfirm = (val) => {
    this.setState(
      {
        isShowSearch: false,
        query: {
          ...this.state.query,
          title: val
        }
      },
      () => {
        this.resetPage()
        this.setState(
          {
            list: []
          },
          () => {
            this.nextPage()
          }
        )
      }
    )
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
        articlePraiseNum: 'articlePraiseNum.count'
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
    const url = `/subpages/guide/recommend/detail?id=${item.item_id}`
    Taro.navigateTo({
      url
    })
  }

  render() {
    const { query, isShowSearch, scrollTop, list, page } = this.state
    const n_ht = S.get('navbar_height', true)
    const c_ht = n_ht + 42

    return (
      <View className='guide-recommend-list'>
        <BaNavBar title='种草' fixed />
        <View style={styleNames({ height: `${n_ht}px` })}></View>
        <View
          className={`recommend-list__search ${
            query && query.title && isShowSearch ? 'on-search' : null
          }`}
        >
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
          style={styleNames({ top: `${c_ht}px` })}
        >
          <View className='recommend-list recommend-list__type-grid'>
            {list.map((item) => {
              return (
                <View className='recommend-list__item' key={item.item_id}>
                  <RecommendItem info={item} onClick={() => this.handleClickItem(item)} noShowZan />
                </View>
              )
            })}
          </View>
          {page.isLoading ? <Loading>正在加载...</Loading> : null}
          {!page.isLoading && !page.hasNext && !list.length && (
            <SpNote img='trades_empty.png'>暂无数据~</SpNote>
          )}
        </ScrollView>
        <BaTabBar />
      </View>
    )
  }
}
