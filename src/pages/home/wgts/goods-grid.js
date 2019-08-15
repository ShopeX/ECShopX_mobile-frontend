import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import './goods-grid.scss'

export default class WgtGoodsGrid extends Component {
  static options = {
    addGlobalClass: true
  }

  navigateTo (url) {
    Taro.navigateTo({ url })
  }

  handleClickItem = (item) => {
    const url = `/pages/item/espier-detail?id=${item.item_id}`
    Taro.navigateTo({
      url
    })
  }

  render () {
    const { info } = this.props
    if (!info) {
      return null
    }

    const { base, data, config } = info
    /*let listData = []
    data.map(item => {
      listData.push({
        title: item.title,
        desc: item.desc,
        img: item.imgUrl,
        is_fav: item.is_fav,
        item_id: item.goodsId,
      })
    })*/

    return (
      <View className={`wgt wgt-grid ${base.padded ? 'wgt__padded' : null}`}>
        {base.title && (
          <View className='wgt__header'>
            <View className='wgt__title'>
              <Text>{base.title}</Text>
              <View className='wgt__subtitle'>{base.subtitle}</View>
            </View>
            {/*<View
              className='wgt__more'
              onClick={this.navigateTo.bind(this, '/pages/item/list')}
            >
              <View className='three-dot'></View>
            </View>*/}
            <View
              className='wgt__goods__more'
              onClick={this.navigateTo.bind(this, '/pages/item/list')}
            >
              <View className='all-goods'>全部商品</View>
            </View>
          </View>
        )}
        <View className='wgt__body with-padding'>
          <View className='grid-goods out-padding grid-goods__type-grid'>
            {data.map((item, idx) => (
              <View
                key={idx}
                className='grid-item'
                onClick={this.navigateTo.bind(this, `/pages/item/espier-detail?id=${item.goodsId}`)}
              >
                <View className='goods-wrap'>
                  <View className='thumbnail'>
                    <Image
                      className='goods-img'
                      src={item.imgUrl}
                      mode='aspectFill'
                    />
                  </View>
                  <View className='caption'>
                    {config.brand && item.brand && (
                      <Image
                        className='goods-brand'
                        src={item.brand}
                        mode='aspectFill'
                      />
                    )}
                    <View className={`goods-title ${!config.brand || !item.brand ? 'no-brand' : ''}`}>{item.title}</View>
                    <View className={`goods-brief ${!config.brand || !item.brand ? 'no-brand' : ''}`}>{item.brief}</View>
                    {
                      config.showPrice
                      && <View className="goods-price">
                          <Text className="cur">¥</Text>{item.price ? item.price/100 : '0.00'}
                        </View>
                    }
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    )
  }
}
