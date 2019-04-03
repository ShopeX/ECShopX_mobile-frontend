import Taro, { Component } from '@tarojs/taro'
import {View, Text, Image, Progress} from '@tarojs/components'
import { Price } from '@/components'
import { isObject, classNames } from '@/utils'

import './index.scss'

export default class GoodsItem extends Component {
  static defaultProps = {
    onClick: () => {},
    showMarketPrice: true,
    noCurSymbol: false
  }

  static options = {
    addGlobalClass: true
  }

  render () {
    const { info, showMarketPrice, noCurSymbol, noCurDecimal, onClick, appendText, className, isPointDraw } = this.props
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
              mode='aspectFill'
              src={img}
            />
          </View>
          <View className='goods-item__cont'>
            <Text className='goods-item__title'>{info.title}</Text>
            <Text className='goods-item__desc'>{info.desc}</Text>
            {
              isPointDraw
                ? <View className='draw-item__ft-inner'>
                    <Text>已筹集</Text>
                    <Progress
                      strokeWidth={6}
                      percent={info.rate}
                      showInfo
                      activeColor='#13CE66'
                    />
                  </View>
                : null
            }
            <View className='goods-item__prices'>
              <Price
                primary
                classes='goods-item__price'
                className='goods-item__price'
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
                  classes='goods-item__price-market'
                  className='goods-item__price-market'
                  value={info.market_price}
                  noDecimal={noCurDecimal}
                />
              )}
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
