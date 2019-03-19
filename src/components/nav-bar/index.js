import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtNavBar } from 'taro-ui'

import './index.scss'

export default class NavBar extends Component {
  static defaultProps = {
  }

  constructor (props) {
    super(props)

    this.state = {
    }
  }

  static options = {
    addGlobalClass: true
  }

  handleClickLeftIcon = () => {
    this.props.onClickLeftIcon
      ? this.props.onClickLeftIcon()
      : Taro.navigateBack()
  }

  render () {
    const { title, leftIconType, fixed } = this.props

    return (
      <View className='nav-bar-height'>
        <AtNavBar
          fixed={fixed}
          color='#000'
          title={title}
          leftIconType={leftIconType}
          onClickLeftIcon={this.handleClickLeftIcon}
        />
      </View>
    )
  }
}
