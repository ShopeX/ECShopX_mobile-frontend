import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { withPager, withBackToTop } from '@/hocs'
import { BackToTop, Loading, RecommendItem, NavBar, TabBar, SpNote } from '@/components'
import api from '@/api'
import { pickBy } from '@/utils'
import S from '@/spx'

import '../recommend/list.scss'

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
    const article_query = {
      article_type: 'bring',
      page,
      pageSize
    }
    const { list, total_count: total } = S.getAuthToken() ? await api.article.authList(article_query) : await api.article.list(article_query)

    const nList = pickBy(list, {
      img: 'image_url',
      item_id: 'article_id',
      title: 'title',
      author: 'author',
      head_portrait: 'head_portrait',
      isPraise: 'isPraise',
      articlePraiseNum: 'articlePraiseNum.count',
    })

    this.setState({
      list: [...this.state.list, ...nList],
    })

    return {
      total
    }
  }

  handleClickItem = (item) => {
    /*const url = `/pages/recommend/detail?id=${item.item_id}`
    Taro.navigateTo({
      url
    })*/
    Taro.navigateToMiniProgram({
      appId: 'wxf91925e702efe3e3', // 要跳转的小程序的appid
      path: `/pages/recommend/detail`, // 跳转的目标页面
      extarData: {
        id: item.item_id
      },
      success(res) {
        // 打开成功
        console.log(res)
      }
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

      <TabBar current={2} />
      </View>
    )
  }
}
