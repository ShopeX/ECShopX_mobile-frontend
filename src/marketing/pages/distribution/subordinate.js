import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { BackToTop, Loading, SpNote } from '@/components'
import api from '@/api'
import { withPager } from '@/hocs'
import { classNames, pickBy } from '@/utils'

import './subordinate.scss'

@withPager
export default class DistributionSubordinate extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      list: [],
      curTabIdx: 0,
      tabList: [
        { title: '已购买', num: 0, type:'buy' },
        { title: '未购买', num: 0, type:'not_buy' }
      ]
    }
  }

  componentDidMount () {
    this.nextPage()
  }

  async fetch (params) {
    const { curTabIdx,tabList } = this.state
    const { page_no: page, page_size: pageSize } = params
    const query = {
      page,
      pageSize: 15,
      buy_type:tabList[curTabIdx].type
    }

    const { list, total_count } = await api.distribution.subordinate(query)
    const total  = total_count

    const nList = pickBy(list, {
      relationship_depth: 'relationship_depth',
      headimgurl: 'headimgurl',
      username: 'username',
      is_open_promoter_grade: 'is_open_promoter_grade',
      promoter_grade_name: 'promoter_grade_name',
      mobile: 'mobile',
      bind_date: 'bind_date'
    })

    this.setState({
      list: [...this.state.list, ...nList]
    })

    return {
      total
    }
  }

  handleClickTab = (idx) => {
    if (this.state.page.isLoading) return

    if (idx !== this.state.curTabIdx) {
      this.resetPage()
      this.setState({
        list: [],
        scrollTop: 0
      })
    }

    this.setState({
      curTabIdx: idx
    }, () => {
      this.nextPage()
    })
  }

  render () {
    const { list, page, curTabIdx, tabList, scrollTop } = this.state

    return (
      <View className="page-distribution-subordinate">
        <AtTabs
          className='client-list__tabs'
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
          className='subordinate-list__scroll'
          scrollY
          lower-threshold={100}
          scrollTop={scrollTop}
          onScrollToLower={this.nextPage}
        >
          { list.length &&
            <View className="section list">
              {
                list.map(item => {
                  return (
                    <View
                      className={classNames('list-item', item.relationship_depth == 1 && 'child', item.relationship_depth == 2 && 'Gchild', item.relationship_depth == 3 && 'GGchild')}
                    >
                      <Image className="avatar"
                        src={item.headimgurl ? item.headimgurl : 'images/default.png'}
                      />
                      <View className="list-item-txt">
                        <View className="name">
                          {item.username}
                          {
                            item.is_open_promoter_grade
                            && <Text className="level-name">({item.promoter_grade_name})</Text>
                          }
                        </View>
                        <View className="mobile">
                          {
                            item.mobile
                            && <Text>{item.mobile}</Text>
                          }
                        </View>
                      </View>
                      <View className="bind-date">
                        <View>绑定时间</View>
                        <View>{item.bind_date}</View>
                      </View>
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
      </View>
    )
  }
}
