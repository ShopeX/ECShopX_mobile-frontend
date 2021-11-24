import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { getPointName } from '@/utils'
import './header.scss'

export default class Header extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const { useInfo: { username, avatar, point } = {} } = this.props

    return (
      <View className='header'>
        <View className='avatar'>
          <Image src={avatar} />
        </View>
        <View className='name'>{username}</View>
        <View className='score'>
          <View className='score_num'>{point}</View>
          <View className='score_description'>{getPointName()}</View>
        </View>
      </View>
    )
  }
}
