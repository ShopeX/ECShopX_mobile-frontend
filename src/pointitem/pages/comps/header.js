import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { getPointName } from '@/utils'
import './header.scss'

export default class Header extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    const { useInfo: { username, avatar, point } = {} } = this.props

    return (
      <View class='header'>
        <View class='avatar'>
          <Image src={avatar} />
        </View>
        <View class='name'>{username}</View>
        <View class='score'>
          <View class='score_num'>{point}</View>
          <View class='score_description'>{getPointName()}</View>
        </View>
      </View>
    )
  }
}
