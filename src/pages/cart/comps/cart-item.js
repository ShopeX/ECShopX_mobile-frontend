import Taro, { Component } from '@tarojs/taro'
import {View, Text, Image} from '@tarojs/components'
// import { AtInputNumber } from 'taro-ui'
import { Price } from '@/components'
import InputNumber from '@/components/input-number'
import { isObject, classNames } from '@/utils'

import './cart-item.scss'

export default class GoodsItem extends Component {
  static defaultProps = {
    onClick: () => {},
    onClickPromotion: () => {},
    onClickImgAndTitle: () => {},
    showMarketPrice: false,
    noCurSymbol: false,
    isDisabled: false
  }

  static options = {
    addGlobalClass: true
  }

  render () {
    const { info, showMarketPrice, noCurSymbol, noCurDecimal, onClick, appendText, className, isDisabled, isPointDraw } = this.props
    if (!info) {
      return null
    }

    const price = isObject(info.price) ? info.price.total_price : info.price
    const img = info.img || info.image_default_id
    const curPromotion = info.promotions && info.activity_id && info.promotions.find(p => p.marketing_id === info.activity_id)

    return (
      <View className={classNames('cart-item', className, { 'is-disabled': isDisabled })}>
        <View className='cart-item__hd'>
          {this.props.children}
        </View>
        <View
          className='cart-item__bd'
          onClick={onClick}
        >
          <View className='cart-item__img-wrap'>
            <Image className='cart-item__img'
              mode='aspectFill'
              src={img}
              onClick={this.props.onClickImgAndTitle}
            />
          </View>
          <View className='cart-item__cont'>
            <View className='cart-item__cont-hd'>
              <Text
                className='cart-item__title'
                onClick={this.props.onClickImgAndTitle}
              >{info.title}</Text>
              <Text className='cart-item__desc'>{info.desc}</Text>
              {curPromotion && (
                <View
                  className='cart-item__promotion'
                  onClick={this.props.onClickPromotion}
                >
                  {curPromotion.marketing_name}
                </View>
              )}
            </View>

            <View className='cart-item__prices'>
              <Price
                primary
                classes='cart-item__price'
                className='cart-item__price'
                symbol={info.curSymbol}
                noSymbol={noCurSymbol}
                noDecimal={noCurDecimal}
                appendText={appendText}
                value={price}
              />
              {showMarketPrice && (
                <Price
                  symbol={info.curSymbol}
                  noSymbol={noCurSymbol}
                  classes='cart-item__price-market'
                  className='cart-item__price-market'
                  value={info.market_price}
                  noDecimal={noCurDecimal}
                />
              )}
            </View>
          </View>
        </View>
        <View className='cart-item__ft'>
          {!isDisabled && (
            <InputNumber
              min={1}
              max={info.store}
              value={info.num}
              onChange={this.props.onNumChange}
            />
          )}
        </View>
      </View>
    )
  }
}
