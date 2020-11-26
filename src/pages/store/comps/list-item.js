import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

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
    const { info, onClick,isStore } = this.props
    if (!info) return null
    const distance = info.distance ? (info.distance*1).toFixed(2) : false
    return (
      <View
        className='store-item'
        onClick={onClick}
      >
        <View className='store-content'>
          <View className="store-content_left">
            <View className="store-name">{info.name}</View>
            <View className="store-address">{info.store_address}</View>
            <View className="store-address">营业时间：{info.hour}</View>
            <View className="store-address">营业时间：{info.mobile}</View>
          </View>

          {
            distance && (
            <View className="store-content_distance">
              {distance}{info.distance_unit}
            </View>
            )
          }
        </View>

        {
          !isStore && info.lat &&
            <View
              className='store-location icon-location'
              onClick={this.handleMap.bind(this, info.lat, info.lng)}
            ></View>
        }
      </View>
    )
  }
}
