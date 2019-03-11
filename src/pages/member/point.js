
import Taro, { Component } from '@tarojs/taro'
import {View, Text, ScrollView} from '@tarojs/components'
import {AtButton, AtTabs, AtTabsPane} from 'taro-ui'
import { Loading, SpNote } from '@/components'
import { withPager } from '@/hocs'
import { pickBy, formatDataTime } from '@/utils'
import api from '@/api'

import './point.scss'

@withPager
export default class Integral extends Component {
  static defaultProps = {
  }

  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      curTabIdx: 0,
      tabList: [
        {title: '全部', status: ''},
        {title: '收入', status: 'income'},
        {title: '支出', status: 'outcome'}
      ],
      list: [],
      isLoading: false,
      totalPoint: 0
    }
  }

  componentDidMount () {
    const status = ''
    const tabIdx = this.state.tabList.findIndex(tab => tab.status === status)

    if (tabIdx >= 0) {
      this.setState({
        curTabIdx: tabIdx
      }, () => {
        this.nextPage()
      })
    } else {
      this.nextPage()
    }
  }


  async fetch (params) {
    this.setState({ isLoading: true })
    const { tabList, curTabIdx } = this.state
    params = {
      ...params,
      outin_type: tabList[curTabIdx].status
    }
    const { point } = await api.member.pointTotal()
    const { list, total_count: total } = await api.member.pointList(params)
    const nList = pickBy(list, {
      outin_type: 'outin_type',
      point: 'point',
      point_desc: 'point_desc',
      created: ({ created }) => (formatDataTime(created * 1000)),
    })
    // console.log(point, 65)
    this.setState({
      list: [...this.state.list, ...nList],
      totalPoint: point
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
        list: []
      })
    }

    this.setState({
      curTabIdx: idx
    }, () => {
      this.nextPage()
    })
  }

  handleClickRoam = () => {

  }

  render () {
    const { curTabIdx, tabList, list, page, totalPoint } = this.state

    return (
      <View className='page-member-integral'>
        <View className='member-integral__hd'>
          <View className='integral-info'>
            <View className='integral-number'>图标<Text className='integral-number__text'>{totalPoint}</Text></View>
            <View className='integral-text'>当前可用积分</View>
          </View>
        </View>

        <View className='member-integral__bd'>
          <View className='integral-sec integral-info__status'>
            <View className='integral-sec__horn'>
              <Text className='sp-icon sp-icon-laba laba_horn'> </Text>
            </View>
            <Text className='integral-sec__share'>分享推荐可获取积分呦，赶紧行动吧~</Text>
          </View>

          <View className='integral-sec member-integral'>
            <AtTabs
              className='member-integral__tabs'
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
                    className='member-integral__panel'
                  >

                  </AtTabsPane>)
                )
              }
            </AtTabs>

            <ScrollView
              scrollY
              className='member-integral__scroll'
              onScrollToLower={this.nextPage}
            >
              {
                list.map((item, idx) => {
                  return (
                    <View key={idx}>
                      <View className='integral-item'>
                        <View className='integral-item__title'>
                          <Text className='integral-item__title-name'>{item.point_desc}</Text>
                          <Text className={`integral-item__title-${item.outin_type}`}>{item.outin_type === 'in' ? '+' : '-'}{item.point}</Text>
                        </View>
                        <View className='integral-item__data'>{item.created}</View>
                      </View>
                    </View>
                  )
                })
              }
              {
                page.isLoading && <Loading>正在加载...</Loading>
              }
              {
                !page.isLoading && !page.hasNext && !list.length
                && (
                  <View>
                    <SpNote className='integral_empty' img='integral_empty.png'>赶快赚积分吧~</SpNote>
                    <View className='btns'>
                      <AtButton type='primary' onClick={this.handleClickRoam}>随便逛逛</AtButton>
                    </View>
                  </View>
                )
              }
            </ScrollView>
          </View>
        </View>
      </View>
    )
  }
}
