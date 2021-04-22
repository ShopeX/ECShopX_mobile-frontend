import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { linkPage } from './helper'

import './navigation.scss'

export default class WgtNavigation extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  handleClickItem (item,index) {
  
    linkPage(item.linkPage, item.id)
  }

  render () {
    const { info } = this.props

    if (!info) {
      return null
    }

    const { base, data } = info

    return (
      <View className={`wgt ${base.padded ? 'wgt__padded' : null}`}>
        <View className='wgt-body with-padding'>
          <View className='navigation'>
            {data.map((item, idx) => {
              return (
                <View
                  className='nav-item'
                  key={item.id}
                  onClick={this.handleClickItem.bind(this, item,idx)}
                >
                  <Image
                    className='nav-img'
                    mode='widthFix'
                    lazyLoad
                    src={item.imgUrl}
                  />
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
