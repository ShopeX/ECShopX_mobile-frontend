import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtNavBar } from 'taro-ui'

import './index.scss'

export default class NavBar extends Component {
  static defaultProps = {
    leftIconType: 'chevron-left',
    fixed: true,
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

    return Taro.getEnv() !== Taro.ENV_TYPE.WEAPP && Taro.getEnv() !== Taro.ENV_TYPE.ALIPAY ? (
      <View className={`nav-bar-height ${fixed !== false && 'fiexd'}`}>
        <AtNavBar
          fixed={fixed}
          color='#000'
          title={title}
          leftIconType={leftIconType}
          onClickLeftIcon={this.handleClickLeftIcon.bind(this)}
        />
      </View>
    ) : null
  }
}
