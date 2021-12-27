import React, { Component } from 'react';
 import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components'
import { SpImage, SpPoint, SpPrice } from '@/components'
import qs from 'qs'
import api from '@/api'
import { connect } from 'react-redux'

import { isObject, classNames } from '@/utils'
import { PROMOTION_TAG } from '@/consts'

import './index.scss'

function SpGoodsItem( props ) {
  const {
    onClick = () => { },
    onStoreClick= () => {},
    showMarketPrice= true,
    showFav= true,
    showSku= false,
    noCurSymbol= false,
    info = null,
    isPointitem = false,
    renderFooter = null
  } = props

  const handleFavClick = async () => {
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

  const handleClick = () => {
    const { itemId, distributorId } = info
    let query = { id: itemId }
    if ( distributorId ) {
      query = {
        ...query,
        dtid: distributorId
      }
    }
    const url = `/pages/item/espier-detail?${qs.stringify(query)}`
    Taro.navigateTo({
      url
    })
  }

  if ( !info ) {
    return null
  }

  return (
    <View
      className={classNames("sp-goods-item")}
      onClick={handleClick.bind(this)}
    >
      <View className="goods-item__hd">
        <SpImage src={info.pic || info.pics[0]} mode="aspectFill" />
      </View>
      <View className="goods-item__bd">
        {/* 跨境商品 */}
        {info.type === "1" && (
          <View className="national-info">
            <Image
              className="nationalFlag"
              src={info.origincountry_img_url}
              mode="aspectFill"
              lazyLoad
            />
            <Text className="nationalTitle">{info.origincountry_name}</Text>
          </View>
        )}

        <View className="goods-info">
          <View className="goods-title">{info.itemName}</View>
          <View className="goods-desc">{info.brief}</View>
        </View>

        <View className="bd-block">
          <View className="bd-block-lf">
            {/* 商品价格、积分 */}
            {info.is_point && (
              <View className="goods-price">
                <SpPoint value={info.point} />
              </View>
            )}

            {!info.is_point && (
              <View className="goods-price">
                <View className="gd-price">
                  <SpPrice value={info.price / 100}></SpPrice>
                </View>
                <View className="mk-price">
                  {info.market_price / 100 > 0 && (
                    <SpPrice
                      lineThrough
                      value={info.market_price / 100}
                    ></SpPrice>
                  )}
                </View>
              </View>
            )}
          </View>
          {/* {
            isOpenCollection && <View className='bd-block-rg'>
              <Text className='iconfont icon-shoucang-01'></Text>
            </View>
          } */}
        </View>

        {/* 促销活动标签 */}
        {info.promotion_activity && info.promotion_activity.length > 0 && (
          <View className="promotions">
            {info.promotion_activity.map((item, index) => (
              <Text className="promotion-tag" key={`promotion-tag__${index}`}>
                {PROMOTION_TAG[item.tag_type]}
              </Text>
            ))}
          </View>
        )}
      </View>
      <View className="goods-item__ft">{props.renderFooter}</View>
    </View>
  );
}

SpGoodsItem.options = {
  addGlobalClass: true
}

export default SpGoodsItem