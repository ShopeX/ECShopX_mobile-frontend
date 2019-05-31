import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Video, SwiperItem } from '@tarojs/components'
import { classNames } from '@/utils'
import { linkPage } from './helper'

import './goods.scss'

export default class WgtGoods extends Component {
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
        <View className='slider-wrap'>
          {
            data.map((item, index) => {
              return (
                <View className='goods-content' key={index}>
                  <View className='goods-content__info'>
                    <View className='goods-content__info_img'>
                      <Image className='img-style' mode='aspectFill' src={item.img_url} />
                    </View>
                    <View className='goods-content__info_text'>
                      <Text>{item.item_name}</Text>
                      <Text>点击查看产品详情</Text>
                      <View>
                        <Text>dd</Text>
                        <Text>{item.sales}</Text>
                      </View>
                    </View>
                  </View>
                  <View className='goods-content__operate'>
                    <View className='goods-content__operate_btn'>加入心愿</View>
                    <Text>|</Text>
                    <View className='goods-content__operate_btn'>加入购买</View>
                  </View>
                </View>
              )
            })
          }
        </View>
      </View>
    )
  }
}
