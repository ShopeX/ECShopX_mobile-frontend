import Taro, { Component } from '@tarojs/taro'
import { View, Video } from '@tarojs/components'
import { linkPage } from './helper'

import './film.scss'

export default class WgtFilm extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  state = {
    screenWidth: null
  }

  componentDidMount () {
    const res = Taro.getSystemInfoSync()
    this.setState({
      screenWidth: res.screenWidth
    })
  }

  handleClickItem = linkPage

  resolveSize ({ width, height, ratio: tRatio } = {}, screenWidth, base = {}) {
    const aspectRatios = [
      16 / 9,
      9 / 16,
      4 / 3,
      3 / 4,
      1 / 1
    ]
    const { proportion = 0 } = base
    let ratio = aspectRatios[proportion]
    
    let w = '100%', h
    let objectFit = 'contain'
    const defaultHeight = Math.round(screenWidth / ratio)

    if (width && height) {
      ratio = width / height
      if (ratio <= 10 / 16) {
        h = defaultHeight
      } else {
        objectFit = 'cover'
        h = Math.round(screenWidth / ratio)
      }
    } else {
      h = defaultHeight
    }

    if (tRatio === 'square') {
      // 1:1
      objectFit = 'cover'
      h = screenWidth
    } else if (tRatio === 'rectangle') {
      // 16:9
      h = defaultHeight
    }

    return {
      width: w,
      height: `${h}px`,
      objectFit
    }
  }

  render () {
    const { info } = this.props
    const { screenWidth } = this.state

    if (!info) {
      return null
    }

    const { config = {}, base, data } = info
    const { width, height, objectFit } = this.resolveSize(config, screenWidth, base)

    return (
      <View className={`wgt ${base.padded ? 'wgt__padded' : null}`}>
        {base.title && (
          <View className='wgt__header'>
            <View className='wgt__title'>{base.title}</View>
            <View className='wgt__subtitle'>{base.subtitle}</View>
          </View>
        )}
        <View 
          className={`slider-wrap ${config.padded ? 'padded' : ''}`}
          style={`width: ${width}; height: ${height}`}
        >
          <Video
            className='flim-video'
            src={data[0].url}
            controls
          />
        </View>
      </View>
    )
  }
}
