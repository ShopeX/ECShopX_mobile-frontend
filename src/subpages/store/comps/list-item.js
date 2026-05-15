/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from 'react-redux'
import { i18n } from '@/i18n'
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

  componentDidMount() {
    this._onI18n = () => this.forceUpdate()
    i18n.on('languageChanged', this._onI18n)
  }

  componentWillUnmount() {
    i18n.off('languageChanged', this._onI18n)
  }

  render() {
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
            <View className='store-address'>
              {i18n.t('8fdd78d5.e252ad')}
              {info.store_address}
            </View>
            <View className='store-address'>
              {i18n.t('8fdd78d5.6cd6e3')}
              {info.hour}
            </View>
            <View className='store-address'>
              {i18n.t('8fdd78d5.7d33dc')}
              {info.mobile}
            </View>
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
