import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import './list-item.scss'

export default class StoreListItem extends Component {
  static defaultProps = {
    onClick: () => {}
  }

  static options = {
    addGlobalClass: true
  }

  handleMap = (lat, lng) => {
    Taro.openLocation({
      latitude: Number(lat),
      longitude: Number(lng),
      scale: 18
    })
  }

  render () {
    const { info, onClick } = this.props
    if (!info) return null

    return (
      <View
        className='store-item'
        onClick={onClick}
      >
        <View className='store-content'>
          <View className="store-name">{info.store_name}</View>
          <View className="store-address">{info.store_address}</View>
        </View>
        {
          info.lat &&
            <View
              className='store-location icon-location'
              onClick={this.handleMap.bind(this, info.lat, info.lng)}
            ></View>
        }
      </View>
    )
  }
}
