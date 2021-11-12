import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtNavBar } from 'taro-ui'
import { classNames, isNavbar, isWeb } from '@/utils'

import './index.scss'

export default class SpNavBar extends Component {
  static defaultProps = {
    leftIconType: 'chevron-left',
    fixed: false,
    title: ''
  }

  static options = {
    addGlobalClass: true
  }

  handleClickLeftIcon = () => {
    if (this.props.onClickLeftIcon) return this.props.onClickLeftIcon()
    return Taro.navigateBack()
  }

  render() {
    const { title, leftIconType, fixed } = this.props
    if (isNavbar) {
      return (
        <View
          className={classNames(`sp-nav-bar nav-bar-height`, {
            fixed
          })}
        >
          <AtNavBar
            fixed={fixed}
            color='#000'
            title={title}
            leftIconType={leftIconType}
            onClickLeftIcon={this.handleClickLeftIcon.bind(this)}
          />
        </View>
      )
    }

    return null
  }
}
