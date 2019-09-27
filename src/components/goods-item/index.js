import Taro, { Component } from '@tarojs/taro'
import {View, Text, Image, Progress} from '@tarojs/components'
import { Price, QnImg } from '@/components'
import { isObject, classNames } from '@/utils'
import api from '@/api'

import './index.scss'

export default class GoodsItem extends Component {
  static defaultProps = {
    onClick: () => {},
    showMarketPrice: true,
    showFav: true,
    showSku: false,
    noCurSymbol: false,
    type: 'item'
  }

  static options = {
    addGlobalClass: true
  }

  static externalClasses = ['classes']

  handleFavClick = async () => {
    const { item_id, is_fav } = this.props.info
    console.log(is_fav, item_id)
    // await api.item.collect(item_id)
  }

  render () {
    const { info, showMarketPrice, showFav, noCurSymbol, noCurDecimal, onClick, appendText, className, isPointDraw, type } = this.props
    if (!info) {
      return null
    }

    let price = '', marketPrice = ''
    if (isObject(info.price)) {
      price = info.price.total_price
    } else {
      price = info.act_price ? info.act_price : info.member_price ? info.member_price : info.price
      marketPrice = info.act_price || info.member_price ? info.price : info.market_price
    }
    const img = info.img || info.image_default_id

    return (
      <View className={classNames('goods-item', 'classes')}>
        <View className='goods-item__hd'>
          {this.props.renderCheckbox}
        </View>
        <View
          className='goods-item__bd'
          onClick={onClick}
        >
          <View
            className='goods-item__img-wrap'>
            <QnImg
              img-class='goods-item__img'
              src={img}
              mode='aspectFill'
              width='200'
              lazyLoad
            />
          </View>
          <View className='goods-item__cont'>
            <View>
              <Text className='goods-item__title'>{info.title}</Text>
              <Text className='goods-item__desc'>{info.desc}</Text>
              {this.props.renderSpec}
            </View>
            <View className='goods-item__extra'>
              <View className='goods-item__price'>
                <Text className='goods-item__cur'>¥</Text>
                <Text>{price}</Text>
                {
                  parseInt(marketPrice) &&
                    <Text className='goods-item__price-market'>{marketPrice}</Text>
                }
							</View>
							{this.props.children}
              {
                 showFav &&
                   (<View className='goods-item__actions'>
                     {(type === 'item') && (
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
                   </View>)
              }
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
