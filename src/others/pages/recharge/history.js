import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpNavBar, Loading, SpNote } from '@/components'
import { connect } from '@tarojs/redux'
import { formatTime } from '@/utils'
import { Tracker } from '@/service'
import api from '@/api'

import './history.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
export default class History extends Component {
  constructor (props) {
    super(props)
    this.state = {
      list: [],
      isLoading: false,
      isEnd: false,
      isEmpty: false,
      param: {
        page: 1,
        pageSize: 20,
        outin_type: 'income'
      }
    }
  }

  componentDidMount () {
    const { type = 0 } = this.$router.params
    const title = type === '1' ? '消费记录' : '充值记录'
    Taro.setNavigationBarTitle({
      title
    })
    this.config.navigationBarTitleText = title
    this.init(true)
  }

  config = {
    navigationBarTitleText: '充值记录',
    enablePullDownRefresh: true,
    backgroundTextStyle: 'dark'
  }

  init = (isRefresh = false) => {
    const { type = 0 } = this.$router.params
    const { param, list: oldList } = this.state
    this.setState({ isLoading: true })
    param.outin_type = type === '1' ? 'outcome' : 'income'
    if (isRefresh) {
      param.page = 1
    } else {
      param.page += 1
    }
    api.member.depositList(param).then((res) => {
      const isEnd = res.total_count / param.pageSize <= param.page
      const isEmpty = res.total_count === 0
      const list = res.list.map((item) => {
        return {
          depositTradeId: item.depositTradeId,
          detail: item.detail,
          tradeType: item.tradeType,
          money: (item.money / 100).toFixed(2),
          timeStart: formatTime(item.timeStart * 1000)
        }
      })

      this.setState(
        {
          list: isRefresh ? list : [...oldList, ...list],
          param,
          isLoading: false,
          isEnd,
          isEmpty
        },
        () => {
          Taro.stopPullDownRefresh()
        }
      )
    })
  }

  onPullDownRefresh = () => {
    Tracker.dispatch('PAGE_PULL_DOWN_REFRESH')
    this.init(true)
  }

  onReachBottom = () => {
    const { isEmpty, isEnd, isLoading } = this.state
    if (isEmpty || isEnd || isLoading) return
    this.init()
  }

  showDetail = () => {
    console.log(111)
  }

  render () {
    const { list, isLoading, isEmpty } = this.state
    const { colors } = this.props
    return (
      <View className='history'>
        <SpNavBar title={this.config.navigationBarTitleText} leftIconType='chevron-left' />
        {list.map((item) => (
          <View className='item' key={item.depositTradeId} onClick={this.showDetail.bind(this)}>
            <View className='left'>
              <View className='title'>
                {item.tradeType === 'recharge_gift' && (
                  <Text style={`color: ${colors.data[0].primary}`}>(赠送)</Text>
                )}
                {item.detail}
              </View>
              <View className='date'>{item.timeStart}</View>
            </View>
            <View className='right'>
              <Text className={`price ${item.tradeType === 'consume' && 'outcome'}`}>
                {item.tradeType === 'consume' ? '-' : '+'}
                {item.money}
              </Text>
              {/* <View className='iconfont icon-arrowRight'></View> */}
            </View>
          </View>
        ))}
        {isLoading && <Loading>正在加载...</Loading>}
        {isEmpty && !isLoading && <SpNote img='trades_empty.png'>无数据~</SpNote>}
      </View>
    )
  }
}
