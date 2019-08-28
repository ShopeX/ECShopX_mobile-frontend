import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { QnImg } from '@/components'
import { classNames } from '@/utils'

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
                className={classNames('grid-item',{'grid-item-three': config.style=='grids'})}
                onClick={this.navigateTo.bind(this, `/pages/item/espier-detail?id=${item.goodsId}`)}
              >
                <View className='goods-wrap'>
                  <View className='thumbnail'>
                    <QnImg
                      img-class='goods-img'
                      src={item.imgUrl}
                      mode='aspectFill'
                      width='200'
                      lazyLoad
                    />
                  </View>
                  <View className='caption'>
                    {config.brand && item.brand && (
                      <QnImg
                        img-class='goods-brand'
                        src={item.brand}
                        mode='aspectFill'
                        width='100'
                      />
                    )}
                    <View className={`goods-title ${!config.brand || !item.brand ? 'no-brand' : ''}`}>{item.title}</View>
                    {item.brief && <View className={`goods-brief ${!config.brand || !item.brand ? 'no-brand' : ''}`}>{item.brief}</View>}
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
