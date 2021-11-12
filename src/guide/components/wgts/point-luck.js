import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtNoticebar } from 'taro-ui'
import api from '@/api'
import { maskMobile, formatTime } from '@/utils'

export default class PointLuck extends Component {
  constructor(props) {
    super(props)
    this.state = {
      announce: null
    }
  }

  componentDidMount() {
    // this.fetch()
  }

  async fetch() {
    const { list } = await api.member.pointDrawLuckAll()
    const announce = list
      .map(
        (t) =>
          `[${formatTime(t.created * 1000)}] 恭喜${t.username} ${maskMobile(t.mobile)} 获得了 ${
            t.item_name
          }`
      )
      .join('　　')
    this.setState({
      announce
    })
  }

  render() {
    const { announce } = this.state
    if (!announce) {
      return null
    }

    return (
      <View className='wgt'>
        <View className='wgt-body with-padding'>
          <AtNoticebar marquee>
            <Text>{announce}</Text>
          </AtNoticebar>
        </View>
      </View>
    )
  }
}
