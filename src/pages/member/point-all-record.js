import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Text } from '@tarojs/components'
import { withPager, withBackToTop } from '@/hocs'
import { BackToTop, Loading, NavBar, SpNote } from '@/components'
import api from '@/api'
import { pickBy, formatTime } from '@/utils'

import './point-record.scss'

@withPager
@withBackToTop
export default class PointDrawRecord extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      list: [],
      listType: ''
    }
  }

  componentDidMount () {
    this.nextPage()
  }

  async fetch (params) {
    params = {
      ...params,
    }

    const { list, total_count: total } = await api.member.pointAllOrder(this.$router.params.luckydraw_id, params)

    const nList = pickBy(list, {
      created: ({ created }) => formatTime(created*1000, 'YYYY-MM-DD HH:mm:ss'),
      luckydraw_trade_id: 'luckydraw_trade_id',
      luckydraw_id: 'luckydraw_id',
      mobile: 'member_info.mobile',
    })
    this.setState({
      list: [...this.state.list, ...nList],
    })

    return {
      total
    }
  }


  render () {
    const { list, showBackToTop, scrollTop, page } = this.state

    return (
      <View className='page-point-list'>
        <NavBar
          title='抽奖记录'
          leftIconType='chevron-left'
          fixed='true'
        />
        <ScrollView
          className='page-point-list__scroll'
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
        >
          {
            list.map((item, index) => {
              return (
                <View className='point-item' key={index}>
                  <View className='point-item__cont'>
                    <Text className='point-item__title'>{item.mobile}</Text>
                    <Text className='point-item__desc'>{item.created}</Text>
                  </View>
                </View>
              )
            })
          }

          {
            page.isLoading
              ? <Loading>正在加载...</Loading>
              : null
          }
          {
            !page.isLoading && !page.hasNext && !list.length
            && (<SpNote img='trades_empty.png'>赶快去参与抽奖吧~</SpNote>)
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
