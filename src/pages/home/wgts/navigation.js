import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpImg } from '@/components'
import { linkPage } from './helper'

import './navigation.scss'

export default class WgtNavigation extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  handleClickItem = linkPage

  render () {
    const { info } = this.props

    if (!info) {
      return null
    }

    const { base, data } = info

    return (
      <View className={`wgt ${base.padded ? 'wgt__padded' : null}`}>
        <View className='wgt__body with-padding'>
          <View className='navigation'>
            {data.map((item, idx) => {
              return (
                <View
                  className='nav-item'
                  key={`${idx}1`}
                  onClick={this.handleClickItem.bind(this, item.linkPage, item.id)}
                >
                  <View className='nav-img-wrap'>
                    <SpImg
                      img-class='nav-img'
                      src={item.imgUrl}
                      // mode='widthFix'
                      width='200'
                      lazyLoad
                    />
                  </View>
                  <Text className='nav-name'>{item.content}</Text>
                </View>
              )
            })}
          </View>
        </View>
      </View>
    )
  }
}
