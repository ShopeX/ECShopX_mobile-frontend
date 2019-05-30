import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Video, SwiperItem } from '@tarojs/components'
import { classNames } from '@/utils'
import { linkPage } from './helper'

import './film.scss'

export default class WgtFilm extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  constructor (props) {
    super(props)

    this.state = {
      curIdx: 0
    }
  }

  handleClickItem = linkPage

  handleSwiperChange = (e) => {
    const { current  } = e.detail

    this.setState({
      curIdx: current
    })
  }

  render () {
    const { info } = this.props
    const { curIdx } = this.state

    if (!info) {
      return null
    }

    const { config, base, data } = info
    const curContent = (data[curIdx] || {}).content

    return (
      <View className={`wgt ${base.padded ? 'wgt__padded' : null}`}>
        {base.title && (
          <View className='wgt__header'>
            <View className='wgt__title'>{base.title}</View>
            <View className='wgt__subtitle'>{base.subtitle}</View>
          </View>
        )}
        <View className={`slider-wrap ${config.padded ? 'padded' : ''}`}>
          <Video className='flim-video' src='http://203.205.158.71/vweixinp.tc.qq.com/1007_396b434523f5498d93000bfb4f0b32cb.f10.mp4?vkey=6E6CB22ED61074178C8266B72ADDF22F61B81FE687BDA1CBF0F9C5785817756B4C1A7A234F4143871A5CAA374F64855BF580A30F560E49A08D4979C713C6AE73E3059E6F44C54A072A8BFD5A158BC4394B66EF249B71A01F&sha=0&save=1'   controls ></Video>
        </View>
      </View>
    )
  }
}
