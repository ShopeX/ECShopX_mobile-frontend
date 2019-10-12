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
      price = Boolean(+info.act_price) ? info.act_price : Boolean(+info.member_price) ? info.member_price : info.price
      marketPrice = Boolean(+info.act_price) || Boolean(+info.member_price) ? info.price : info.market_price
    }
    const img = info.img || info.image_default_id

    let promotion_activity = null
    if( info.promotion_activity && info.promotion_activity.length > 1 ) {
      info.promotion_activity.map(tag_item => {
        if(tag_item.tag_type === 'single_group' || tag_item.tag_type === 'normal' || tag_item.tag_type === 'limited_time_sale') {
          promotion_activity = tag_item.tag_type
          return
        }
      })
    } else if( info.promotion_activity && info.promotion_activity.length === 1 ) {
      promotion_activity = info.promotion_activity[0].tag_type
    } else {
      promotion_activity = null
    }
    

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
            className='goods-item__img-wrap'
          >
            <QnImg
              img-class='goods-item__img'
              src={img}
              mode='aspectFill'
              width='400'
              lazyLoad
            />
          </View>
          <View className='goods-item__cont'>
            {
              promotion_activity !== null 
              ? <View>
                  <Text className={promotion_activity === 'single_group' ? 'goods-item__tag goods-item__group' : 'goods-item__tag'}>
                  {promotion_activity === 'single_group' ? '团购' : ''}
                  {promotion_activity === 'full_minus' ? '满减' : ''}
                  {promotion_activity === 'full_discount' ? '满折' : ''}
                  {promotion_activity === 'full_gift' ? '满赠' : ''}
                  {promotion_activity === 'normal' ? '秒杀' : ''}
                  {promotion_activity === 'limited_time_sale' ? '限时特惠' : ''}
                  </Text>
                </View>
              : null
            }
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
                  Boolean(+marketPrice) &&
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
