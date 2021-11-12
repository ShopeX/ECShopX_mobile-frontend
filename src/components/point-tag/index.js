import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { classNames, getPointName } from '@/utils'
import './index.scss'

export default class PointTag extends Component {
  static defaultProps = {
    url: ''
  }

  render () {
    const { className } = this.props
    const classes = classNames('point-tag', className)

    return <View className={classes}>{getPointName()}</View>
  }
}
