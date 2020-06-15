import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { QnImg } from '@/components'
import { classNames } from '@/utils'
import { linkPage } from './helper'
import api from '@/api'

import './store.scss'
export default class WgtStore extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  constructor (props) {
    super(props)
  }

  handleStoreClick = (id) => {
    const url = `/pages/store/index?id=${id}`
    Taro.navigateTo({
      url
    })
  }

  handleGoodsClick = (id) => {
    const url = `/pages/item/espier-detail?id=${id}`
    Taro.navigateTo({
      url
    })
  }

  render () {
    const { info } = this.props
    if (!info) {
      return null
    }

    const { config, base, data } = info

    return (
      <View className={`wgt ${base.padded ? 'wgt__padded' : null}`}>
        {base.title && (
          <View className='wgt__header'>
            <View className='wgt__title'>{base.title}</View>
            <View className='wgt__subtitle'>{base.subtitle}</View>
          </View>
        )}
        {
          data.map(item =>
            <View className='store-wrap'>
              <View
                className='store-info'
                onClick={this.handleStoreClick.bind(this, item.id)}
                >
                <Image className='store-logo' src={item.logo} mode='scaleToFill' />
                <View className='store-name'>{item.name}</View>
              </View>
              <ScrollView
                scrollX
                className='store-goods'
                >
                {
                  item.items.map(goods =>
                    <View
                      className='store-goods__item'
                      onClick={this.handleGoodsClick.bind(this, goods.goodsId)}
                      >
                      <Image className='store-goods__item-thumbnail' src={goods.imgUrl} mode='scaleToFill'/>
                      <View className='store-goods__item-price'>¥{(goods.price/100).toFixed(2)}</View>
                    </View>
                  )
                }
              </ScrollView>
            </View>
          )
        }
      </View>
    )
  }
}
