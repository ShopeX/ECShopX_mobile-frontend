import Taro, { Component } from '@tarojs/taro'
import {View, Text, Image, Progress} from '@tarojs/components'
import { Price } from '@/components'
import { isObject, classNames } from '@/utils'
import api from '@/api'

import './index.scss'

export default class GoodsItem extends Component {
  static defaultProps = {
    onClick: () => {},
    showMarketPrice: true,
    noCurSymbol: false,
    type: 'item'
  }

  static options = {
    addGlobalClass: true
  }

  handleFavClick = async () => {
    const { item_id, is_fav } = this.props.info
    console.log(is_fav, item_id)
    // await api.item.collect(item_id)
  }

  render () {
    const { info, showMarketPrice, noCurSymbol, noCurDecimal, onClick, appendText, className, isPointDraw, type } = this.props
    if (!info) {
      return null
    }

    const price = isObject(info.price) ? info.price.total_price : info.price
    const img = info.img || info.image_default_id

    return (
      <View className={classNames('goods-item', className)}>
        <View className='goods-item__hd'>
          {this.props.children}
        </View>
        <View
          className='goods-item__bd'
          onClick={onClick}
        >
          <View className='goods-item__img-wrap'>
            <Image className='goods-item__img'
              mode='aspectFix'
              src={img}
            />
          </View>
          <View className='goods-item__cont'>
            <View>
              <Text className='goods-item__title'>{info.title}</Text>
              <Text className='goods-item__desc'>{info.desc}</Text>
            </View>
            <View className='goods-item__extra'>
              <View className='goods-item__price'>
                <Text className='goods-item__cur'>¥</Text>
                <Text>{info.price}</Text>
                <Text className='goods-item__price-market'>{info.market_price}</Text>
              </View>
              <View className='goods-item__actions'>
                {type === 'item' && (
                  <View
                    className={`in-icon ${info.is_fav ? 'in-icon-fav-f' : 'in-icon-fav'}`}
                    onClick={this.handleFavClick}
                  />
                )}
                {type === 'recommend' && (
                  <View
                    className='in-icon in-icon-like'
                    onClick={this.handleLikeClick}
                  ><Text>666</Text></View>
                )}
              </View>
            </View>
          </View>
        </View>
        <View className='goods-item__ft'>
          {this.props.renderFooter}
        </View>
      </View>
    )
  }
}
