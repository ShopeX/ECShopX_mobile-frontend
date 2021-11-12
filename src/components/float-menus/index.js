import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'

export default class BackToTop extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    bottom: null
  }

  render () {
    const { bottom } = this.props

    return (
      <View
        className='float-menus'
        style={`${bottom ? `bottom: ${Taro.pxTransform(bottom)}` : ''}`}
      >
        {this.props.children}
      </View>
    )
  }
}
