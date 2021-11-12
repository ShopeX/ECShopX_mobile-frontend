import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon, AtButton } from 'taro-ui'
import { classNames, navigateTo } from '@/utils'

import './index.scss'

export default class SpNote extends Component {
  static defaultProps = {
    icon: false,
    button: false,
    value: 'goods_new_fill_light',
    title: '',
    btnText: '',
    to: ''
  }

  static options = {
    addGlobalClass: true
  }

  navigateTo = navigateTo

  handleClick = () => {}

  render () {
    const { icon, className, title, button, value, btnText, to } = this.props

    return (
      <View className={classNames('sw-note', className)}>
        {/* {icon && <AtIcon prefixClass='sw-icon' value={value} size='60' color='#cdcdcd' />} */}
        <Text className='sp-note__text'>{title}</Text>
        {button && to && (
          <View className='sp-note__btn'>
            <AtButton circle onClick={this.navigateTo.bind(this, to)}>
              {btnText}
            </AtButton>
          </View>
        )}
      </View>
    )
  }
}
