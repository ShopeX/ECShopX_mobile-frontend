/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /unite-vshop/src/pages/home/wgts/showcase.js
 * @Date: 2020-10-28 09:58:46
 * @LastEditors: Arvin
 * @LastEditTime: 2021-02-01 14:03:42
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpImg } from '@/components'
import { navigateTo } from '@/utils'
import { linkPage } from './helper'
import './showcase.scss'

export default class WgtShowCase extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  navigateTo = navigateTo

  handleClickItem = linkPage

  render () {
    const { info } = this.props
    if (!info) {
      return null
    }

    const { base, data, config } = info

    return (
      <View className={`wgt ${base.padded ? 'wgt__padded' : null}`}>
        {base.title && (
          <View className='wgt__header'>
            <View className='wgt__title'>
              <Text>{base.title}</Text>
              <View className='wgt__subtitle'>{base.subtitle}</View>
            </View>
            <View
              className='wgt__more'
              onClick={this.navigateTo.bind(this, '/pages/item/list')}
            >
              <View className='three-dot'></View>
            </View>
          </View>
        )}
        <View className={`showcase-scheme-${config.style}`}>
          <View className='scheme-item'>
            <View
              className='layout layout-1'
              onClick={this.handleClickItem.bind(this, data[0].linkPage, data[0])}
            >
              <SpImg
                img-class='show-img'
                src={data[0].imgUrl}
                mode='scaleToFill'
                width='375'
                lazyLoad
              />
            </View>
          </View>
          <View className='scheme-item'>
            <View
              className='layout layout-2'
              onClick={this.handleClickItem.bind(this, data[1].linkPage, data[1])}
            >
              <SpImg
                img-class='show-img'
                src={data[1].imgUrl}
                mode='scaleToFill'
                width='375'
                lazyLoad
              />
            </View>
            <View
              className='layout layout-3'
              onClick={this.handleClickItem.bind(this, data[2].linkPage, data[2])}
            >
              <SpImg
                img-class='show-img'
                src={data[2].imgUrl}
                mode='scaleToFill'
                width='375'
                lazyLoad
              />
            </View>
          </View>
        </View>
      </View>
    )
  }
}
