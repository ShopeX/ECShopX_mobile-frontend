import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Image, ScrollView, Text } from '@tarojs/components'
import './store.scss'

export default class WgtStore extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  constructor(props) {
    super(props)
  }

  handleStoreClick = (id) => {
    const url = `/pages/store/index?id=${id}`
    Taro.navigateTo({
      url
    })
  }

  handleGoodsClick = (item) => {
    const url = `/pages/item/espier-detail?id=${item.goodsId}&dtid=${item.distributor_id}`
    Taro.navigateTo({
      url
    })
  }

  render() {
    const { info } = this.props
    if (!info) {
      return null
    }

    const { config, base, data, seletedTags = [] } = info

    return (
      <View className={`wgt wgt-store ${base.padded ? 'wgt__padded' : null}`}>
        {/* {base.title && (
          <View className="wgt-head">
            <View className="wgt-title">
              <Text>{base.title}</Text>
              <View className="wgt-subtitle">{base.subtitle}</View>
            </View>
          </View>
        )} */}
        {base.title && (
          <View className='wgt-head'>
            <View className='wgt-hd'>
              <Text className='wgt-title'>{base.title}</Text>
              <Text className='wgt-subtitle'>{base.subtitle}</Text>
            </View>
          </View>
        )}
        {data.map((item) => (
          <View
            className='store-wrap'
            key={item.id}
            style={{ backgroundColor: base.backgroundColor || '#FFF' }}
          >
            <View className='store-info' onClick={this.handleStoreClick.bind(this, item.id)}>
              <Image className='store-logo' src={item.logo} mode='scaleToFill' />
              <View className='store-title'>
                <View className='store-name'>{item.name}</View>
                <View className='store-tags'>
                  {seletedTags.length > 0 &&
                    seletedTags.map((itemy) => (
                      <Text className='store-tags-item' key={itemy.tag_id}>
                        {itemy.tag_name}
                      </Text>
                    ))}
                </View>
              </View>
            </View>
            {base.imgUrl && <Image className='store-banner' src={base.imgUrl} mode='widthFix' />}
            <ScrollView scrollX className='store-goods'>
              {item.items.map((goods) => (
                <View
                  className='store-goods__item'
                  onClick={this.handleGoodsClick.bind(this, goods)}
                  key={goods.goodsId}
                >
                  <Image
                    className='store-goods__item-thumbnail'
                    src={goods.imgUrl}
                    style={{ borderColor: base.borderColor || 'none' }}
                    mode='scaleToFill'
                  />
                  <View className='store-goods__item-price'>¥{(goods.price / 100).toFixed(2)}</View>
                </View>
              ))}
            </ScrollView>
          </View>
        ))}
      </View>
    )
  }
}
