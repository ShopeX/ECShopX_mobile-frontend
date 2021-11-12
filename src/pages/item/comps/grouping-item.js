import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtCountdown } from 'taro-ui'
import { calcTimer } from '@/utils'

import './grouping-item.scss'

export default class GroupingItem extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: {},
    onClick: () => {}
  }

  constructor(props) {
    super(props)

    this.state = {
      remaining_time: null
    }
  }

  componentDidMount() {
    const { info } = this.props
    const remaining_time = calcTimer(info.over_time)
    console.log(remaining_time)
    this.setState({
      remaining_time
    })
  }

  render() {
    const { info, total, onClick } = this.props
    const { remaining_time } = this.state

    if (!remaining_time) return null

    return (
      <View className='grouping-item view-flex view-flex-middle' onClick={onClick}>
        <Image className='group-sponsor-avatar' src={info.member_info.headimgurl} />
        <View className='view-flex-item'>
          <View className='name'>{info.member_info.nickname}的团</View>
          <View>
            还差<Text className='group-num'>{total - info.join_person_num}</Text>人成团
          </View>
          <View className='text-muted'>
            剩余
            <AtCountdown
              isShowDay
              format={{ day: '天', hours: ':', minutes: ':', seconds: '' }}
              day={remaining_time.dd}
              hours={remaining_time.hh}
              minutes={remaining_time.mm}
              seconds={remaining_time.ss}
            />
          </View>
        </View>
        <View className='group-join'>去参团</View>
      </View>
    )
  }
}
