/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /unite-vshop/src/pages/home/wgts/store.js
 * @Date: 2020-07-08 20:08:58
 * @LastEditors: Arvin
 * @LastEditTime: 2021-01-08 18:09:32
 */
import Taro, { Component } from '@tarojs/taro'
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
    console.log('===================', info);
    if (!info) {
      return null
    }

    const { config, base, data, seletedTags } = info

    console.log('seletedTags==============', seletedTags);

    return (
      <View className={`wgt ${base.padded ? 'wgt__padded' : null}`}>
        {base.title && (
          <View className='wgt__header'>
            <View className='wgt__title'>
              <Text>{base.title}</Text>
              <View className="wgt__subtitle">{base.subtitle}</View>
            </View>

          </View>
        )}
        {data.map((item) => (
          <View className='store-wrap' style={{ backgroundColor: base.backgroundColor || '#FFF' }}>
            <View className='store-info' onClick={this.handleStoreClick.bind(this, item.id)}>
              <Image className='store-logo' src={item.logo} lazyLoad mode='scaleToFill' />
              <View className='store-title'>
                <View className='store-name'>{item.name}</View>
                <View className='store-tags'>
                  {
                    seletedTags.length > 0 && seletedTags.map((itemy) => (
                      <Text className='store-tags-item' key={itemy.tag_id}>{itemy.tag_name}</Text>
                    ))
                  }
                </View>
              </View>
            </View>
            {
              base.imgUrl && <Image className='store-banner' src={base.imgUrl} lazyLoad mode='widthFix' />
            }
            <ScrollView scrollX className='store-goods'>
              {item.items.map((goods) => (
                <View
                  className='store-goods__item'
                  onClick={this.handleGoodsClick.bind(this, goods)}

                >
                  <Image
                    className='store-goods__item-thumbnail'
                    src={goods.imgUrl}
                    style={{ borderColor: base.borderColor || 'none' }}
                    mode='scaleToFill'
                    lazyLoad
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
