import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import './list-item.scss'

@connect(({ colors }) => ({
  colors: colors.current || { data: [{}] }
}))
export default class StoreListItem extends Component {
  static defaultProps = {
    onClick: () => {}
  }

  static options = {
    addGlobalClass: true
  }

  handleClick = () => {
    this.props.onClick && this.props.onClick()
  }

  handleMap = (lat, lng, e) => {
    e.stopPropagation()
    Taro.openLocation({
      latitude: Number(lat),
      longitude: Number(lng),
      scale: 18
    })
  }

  render () {
    const { info, isStore, colors } = this.props
    if (!info) return null
    const distance = info.distance ? (info.distance * 1).toFixed(2) : false

    return (
      <View className='store-item' onClick={this.handleClick.bind(this)}>
        <View className='store-content'>
          <View className='store-content_left'>
            <View className='store-name'>
              {distance && (
                <View
                  className='store-content_distance'
                  style={`color: ${colors.data[0].primary}; border-color: ${colors.data[0].primary};`}
                >
                  {distance}
                  {info.distance_unit}
                </View>
              )}
              <View className='name'>{info.name}</View>
            </View>
            <View className='store-address'>店铺地址：{info.store_address}</View>
            <View className='store-address'>营业时间：{info.hour}</View>
            <View className='store-address'>联系电话：{info.mobile}</View>
          </View>
          {!isStore && info.lat && (
            <View
              className='store-location icon-periscope'
              style={`color: ${colors.data[0].primary}`}
              onClick={this.handleMap.bind(this, info.lat, info.lng)}
            ></View>
          )}
        </View>
      </View>
    )
  }
}
