import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtButton, AtCountdown } from 'taro-ui'
import { Loading, SpNote, Price } from '@/components'
import _mapKeys from 'lodash/mapKeys'
import api from '@/api'
import { withPager } from '@/hocs'

import './group-list.scss'

@withPager
export default class GroupList extends Component {
  static config = {
    title: '限时团购'
  }

  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      curTabIdx: 0,
      tabList: [
        { title: '进行中', status: 0 },
        { title: '未开始', status: 1 }
      ],
      list: []
    }
  }

  componentDidMount () {
    this.nextPage()
  }

  async fetch (params) {
    const { curTabIdx } = this.state

    params = _mapKeys({
      ...params,
      group_goods_type: 'normal',
      view: curTabIdx === 0 ? '2' : '1',
      team_status: '0'
    }, function (val, key) {
      if (key === 'page_no') return 'page'
      if (key === 'page_size') return 'pageSize'

      return key
    })

    const { list, total_count: total } = await api.item.groupList(params)

    this.setState({
      list: [...this.state.list, ...list]
    })

    return { total }
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

  handleClickItem = (item) => {
    const { goods_id } = item

    Taro.navigateTo({
      url: `/pages/item/espier-detail?id=${goods_id}`
    })
  }

  render () {
    const { tabList, curTabIdx, list, page } = this.state

    return (
      <View className='page-group-list'>
        <AtTabs
          className='group-list__tabs'
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
          scrollY
          className='groups-list__scroll'
          onScrollToLower={this.nextPage}
        >
          {
            list.map((item, idx) => {
              return (
                <View
                  className="group-item"
                  key={item.groups_activity_id}
                  onClick={this.handleClickItem.bind(this, item)}
                >
                  <View className="group-item__hd">
                    <Image className='group-item__img'
                      mode='aspectFill'
                      src={item.pics}
                    />
                  </View>
                  <View className="group-item__bd">
                    <View className="group-item__cont">
                      <Text className='group-item__title'>{item.goods_name}</Text>
                      <View className='group-item__desc'>
                        <View className='group-item__tuan'><Text className='group-item__tuan-num'>{item.person_num}</Text><Text className='group-item__tuan-txt'>人团</Text></View>
                        <Price
                          primary
                          className='group-item__price'
                          value={item.act_price}
                          unit='cent'
                        />
                      </View>
                    </View>
                    <View className="group-item__action">
                      <View className="timer">
                        <View className='at-icon at-icon-clock'></View>
                        <AtCountdown
                          isShowDay
                          format={{ day: '天', hours: ':', minutes: ':', seconds: '' }}
                          day={2}
                          hours={1}
                          minutes={1}
                          seconds={10}
                        />
                      </View>
                      {curTabIdx === 0
                        ? <View className='btn-go'>去开团</View>
                        : <View className='btn-go disabled'>未开始</View>
                      }
                    </View>
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
              && (<SpNote img='trades_empty.png'>暂无数据~</SpNote>)
          }
        </ScrollView>
      </View>
    )
  }
}
