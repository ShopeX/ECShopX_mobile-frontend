/*
 * @Author: PrendsMoi
 * @GitHub: https://github.com/PrendsMoi
 * @Blog: https://liuhgxu.com
 * @Description: 自定义头部
 * @FilePath: /unite-vshop/src/marketing/pages/distribution/comps/header.js
 * @Date: 2021-03-08 14:08:53
 * @LastEditors: PrendsMoi
 * @LastEditTime: 2021-03-08 18:34:22
 */
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './headContainer.scss'

export default class HeaderCustom extends Component {
  constructor (props) {
    super(props)
  }

  static options = {
    addGlobalClass: true
  }

  handleBack = (type = '') => {
    console.log('--handleBack--', type)
    if (type) {
      Taro.reLaunch({
        url: '/pages/index?isPoint=true'
      })
    } else {
      Taro.navigateBack()
    }
  }

  render () {
    const { isWhite = false, statusBarHeight = 44, isHome } = this.props
    return (
      <View
        className='customHeader'
        style={`padding-top: ${statusBarHeight}px; background: ${isWhite ? '#fff' : 'transparent'}`}
      >
        <View className={`menu ${!isHome && 'roate'}`}>
          {isHome ? (
            <View className='icon icon-home1' onClick={this.handleBack.bind(this, 'home')}></View>
          ) : (
            <View className='icon icon-arrowUp' onClick={this.handleBack.bind(this, '')}></View>
          )}
        </View>
      </View>
    )
  }
}
