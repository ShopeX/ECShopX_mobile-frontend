import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { classNames, styleNames } from '@/utils'

import './index.scss'

export default class BackToTop extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    onClick: () => {}
  }

  render () {
    const { show, onClick, bottom } = this.props

    return (
      <View
        className={classNames('back-to-top', { 'is-show': show })}
        style={styleNames(bottom ? { bottom: `${Taro.pxTransform(bottom)}` } : null)}
        onClick={onClick}
      >
        <View className='icon-arrow-up'></View>
      </View>
    )
  }
}
