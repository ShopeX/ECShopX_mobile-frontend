import Taro, { Component } from '@tarojs/taro'
import {View, Text, Image} from '@tarojs/components'
import { SpImg } from '@/components'
import api from '@/api'
import { connect } from '@tarojs/redux'

import { isObject, classNames } from '@/utils'

import './index.scss'

@connect(() => ({
}), (dispatch) => ({
  onAddFav: ({ item_id, fav_id }) => dispatch({ type: 'member/addFav', payload: { item_id, fav_id } }),
  onDelFav: ({ item_id }) => dispatch({ type: 'member/delFav', payload: { item_id } })
}))
export default class GoodsItem extends Component {
  static defaultProps = {
    onClick: () => {},
    onStoreClick: () => {},
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
    if (!is_fav) {
      const favRes = await api.member.addFav(item_id)
      this.props.onAddFav(favRes)
    } else {
      await api.member.delFav(item_id)
      this.props.onDelFav(this.props.info)
    }
    Taro.showToast({
      title: is_fav ? '已移出收藏' : '已加入收藏',
      mask: true
    })
  }

  render () {
    const { info, showMarketPrice, showFav, noCurSymbol, noCurDecimal, onClick, onStoreClick, appendText, className, isPointDraw, type } = this.props
    if (!info) {
      return null
    }

    const img = info.img || info.image_default_id

    let promotion_activity = null, act_price = null
    if( info.promotion_activity_tag && info.promotion_activity_tag.length > 1 ) {
      info.promotion_activity_tag.map(tag_item => {
        if(tag_item.tag_type === 'single_group' || tag_item.tag_type === 'normal' || tag_item.tag_type === 'limited_time_sale') {
          promotion_activity = tag_item.tag_type
          act_price = tag_item.activity_price
          return
        }
      })
    } else if( info.promotion_activity_tag && info.promotion_activity_tag.length === 1 ) {
      promotion_activity = info.promotion_activity_tag[0].tag_type
      act_price = info.promotion_activity_tag[0].activity_price
    } else {
      promotion_activity = null
      act_price = null
    }
    act_price = (act_price/100).toFixed(2)
    let price = '', marketPrice = ''
    if (isObject(info.price)) {
      price = info.price.total_price
    } else {
      price = Boolean(+act_price) ? act_price : Boolean(+info.member_price) ? info.member_price : info.price
      //marketPrice = Boolean(+act_price) || Boolean(+info.member_price) ? info.price : info.market_price
      marketPrice = info.market_price
    }

    return (
      <View className={classNames('goods-item', 'classes')}>
        <View className='goods-item__hd'>
          {this.props.renderCheckbox}
        </View>
        <View className='goods-item__bd'>
          <View
            className='goods-item__img-wrap'
            onClick={onClick}
          >
            <SpImg
              img-class='goods-item__img'
              src={img}
              mode='aspectFill'
              width='400'
              lazyLoad
            />
          </View>
          <View className='goods-item__cont'>
            {
              info.type === '1' && <View className='nationalInfo'>
                  <Image className='nationalFlag' src={info.origincountry_img_url} mode='aspectFill' lazyLoad />
                  <Text className='nationalTitle'>
                    {info.origincountry_name}
                  </Text>
              </View>
            }            
            <View className='goods-item__caption'>
              {
                info.promotion_activity_tag && <View className='goods-item__tag-list'>
                  {
                    info.promotion_activity_tag.map(item =>
                      <Text
                        key={item.promotion_id}
                        className={`tagitem ${(item.tag_type === 'single_group' || item.tag_type === 'limited_time_sale' || item.tag_type === 'normal') ? 'goods-item__tag goods-item__group' : 'goods-item__tag'} ${item.tag_type === 'member_preference' && 'member_preference'}`}
                      >
                        {item.tag_type === 'single_group' ? '团购' : ''}
                        {item.tag_type === 'full_minus' ? '满减' : ''}
                        {item.tag_type === 'full_discount' ? '满折' : ''}
                        {item.tag_type === 'full_gift' ? '满赠' : ''}
                        {item.tag_type === 'normal' ? '秒杀' : ''}
                        {item.tag_type === 'limited_time_sale' ? '限时特惠' : ''}
                        {item.tag_type === 'plus_price_buy' ? '换购' : ''}
                        {item.tag_type === 'member_preference' ? '会员限购' : ''}
                      </Text>
                    )
                  }
                </View>
              }
              <View onClick={onClick}>
                <Text className='goods-item__title'>{info.title}</Text>
                <Text className='goods-item__desc'>{info.desc || ''}</Text>
                {this.props.renderSpec}
              </View>
            </View>
            <View className='goods-item__extra'>
              <View className='goods-item__price'>
                <View className='package-price'>
                  <Text className='goods-item__cur'>¥</Text>
                  <Text>
                    {price}
                    {
                      info.type === '1' && <Text className='taxText'>（含税）</Text>
                    }
                  </Text>
                </View>
                {
                  Boolean(+marketPrice) &&
                    <Text className='goods-item__price-market'>¥{marketPrice}</Text>
                }
							</View>
							{this.props.children}
              {
                showFav &&
                  (<View className='goods-item__actions'>
                    {(type === 'item') && (
                      <View
                        className={`${info.is_fav ? 'icon-star-on' : 'icon-star'}`}
                        onClick={this.handleFavClick}
                      />
                    )}
                    {type === 'recommend' && (
                      <View
                        className='icon-like'
                        onClick={this.handleLikeClick}
                      ><Text>666</Text></View>
                    )}
                  </View>)
              }
            </View>
            {
              APP_PLATFORM !== 'standard' && info.distributor_info && !Array.isArray(info.distributor_info) &&
                <View
                  className='goods-item__store'
                  onClick={onStoreClick}
                >
                  {info.distributor_info.name} <Text class='goods-item__store-entry'>进店<Text className='icon-arrowRight'></Text></Text>
                </View>
            }
          </View>
        </View>
        <View className='goods-item__ft'>
          {this.props.renderFooter}
        </View>
      </View>
    )
  }
}
