import React, { Component } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { SpImage, SpPoint, SpPrice, SpVipLabel } from '@/components'
import { fetchUserFavs, addUserFav, deleteUserFav } from '@/store/slices/user'
import qs from 'qs'
import api from '@/api'
import S from '@/spx'

import { isObject, classNames, showToast, VERSION_PLATFORM } from '@/utils'
import { PROMOTION_TAG } from '@/consts'

import './index.scss'

function SpGoodsItem(props) {
  const dispatch = useDispatch()
  const { favs = [] } = useSelector((state) => state.user)
  const {
    onClick,
    onStoreClick = () => {},
    showMarketPrice = true,
    showFav = false,
    showSku = false,
    noCurSymbol = false,
    info = null,
    isPointitem = false,
    renderFooter = null,
    showPromotion = true,
    showPrice = true,
    hideStore = false
  } = props

  const handleFavClick = async (e) => {
    e.stopPropagation()
    if (!S.getAuthToken()) {
      showToast('请先登录')
      return
    }

    const { itemId, is_fav } = info
    const fav = favs.findIndex((item) => item.item_id == itemId) > -1
    if (!fav) {
      await dispatch(addUserFav(itemId))
    } else {
      await dispatch(deleteUserFav(itemId))
    }
    await dispatch(fetchUserFavs())
    showToast(fav ? '已移出收藏' : '已加入收藏')
  }

  const handleClick = () => {
    const { itemId, distributorId } = info
    if (onClick) {
      onClick()
      return
    }
    let query = { id: itemId }
    if (distributorId) {
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

  if (!info) {
    return null
  }

  // console.log( "favs:", favs );
  const isFaved = favs.findIndex((item) => item.item_id == info.itemId) > -1
  const isShowStore =
    !hideStore && VERSION_PLATFORM && info.distributor_info && !Array.isArray(info.distributor_info)
  return (
    <View className={classNames('sp-goods-item')} onClick={handleClick.bind(this)}>
      <View className='goods-item__hd'>
        <SpImage src={info.pic} mode='aspectFill' />
      </View>
      <View className='goods-item__bd'>
        {/* 跨境商品 */}
        {info.type === '1' && (
          <View className='national-info'>
            <Image
              className='nationalFlag'
              src={info.origincountry_img_url}
              mode='aspectFill'
              lazyLoad
            />
            <Text className='nationalTitle'>{info.origincountry_name}</Text>
          </View>
        )}

        <View className='goods-info'>
          <View className='goods-title'>{info.itemName}</View>
          <View className='goods-desc'>{info.brief}</View>
        </View>

        {/* 促销活动标签 */}
        {showPromotion && info.promotion && info.promotion.length > 0 && (
          <View className='promotions'>
            {info.promotion.map((item, index) => (
              <Text className='promotion-tag' key={`promotion-tag__${index}`}>
                {PROMOTION_TAG[item.tag_type]}
              </Text>
            ))}
          </View>
        )}

        <View className='bd-block'>
          {/* 商品价格、积分 */}
          {info.is_point && (
            <View className='goods-point'>
              <SpPoint value={info.point} />
            </View>
          )}

          {!info.is_point && showPrice && (
            <View className='goods-price'>
              <View className='gd-price'>
                <SpPrice size={36} value={info.activityPrice || info.price}></SpPrice>
                {info.marketPrice > 0 && (
                  <SpPrice
                    size={26}
                    className='mkt-price'
                    lineThrough
                    value={info.marketPrice}
                  ></SpPrice>
                )}
              </View>
              {!info.activityPrice && (
                <View>
                  {info.memberPrice < info.price && (
                    <View className='vip-price'>
                      <SpPrice value={info.memberPrice} />
                      <SpVipLabel content='会员价' type='member' />
                    </View>
                  )}

                  {info.vipPrice > 0 &&
                    info.vipPrice < info.price &&
                    info.vipPrice > info.svipPrice && !info.svipPrice && (
                      <View className='vip-price'>
                        <SpPrice value={info.vipPrice} />
                        <SpVipLabel content='VIP' type='vip' />
                      </View>
                    )}

                  {info.svipPrice > 0 &&
                    info.svipPrice < info.vipPrice &&
                    info.svipPrice < info.price && (
                      <View className='svip-price'>
                        <SpPrice value={info.svipPrice} />
                        <SpVipLabel content='SVIP' type='svip' />
                      </View>
                    )}
                </View>
              )}
            </View>
          )}

          {showFav && (
            <View className='bd-block-rg'>
              <Text
                className={classNames(
                  'iconfont',
                  isFaved ? 'icon-shoucanghover-01' : 'icon-shoucang-01'
                )}
                onClick={handleFavClick}
              />
            </View>
          )}
        </View>

        {isShowStore && (
          <View className='goods__store' onClick={() => onStoreClick(info)}>
            <SpImage
              src={info.distributor_info.distributor_info || 'shop_default_logo.png'}
              width={60}
              height={60}
            />
            <Text className='store-name'>{info.distributor_info.name}</Text>

            {/* <Text className='goods__store-entry'>
              进店<Text className='iconfont icon-arrowRight'></Text>
            </Text> */}
          </View>
        )}
      </View>

      <View className='goods-item__ft'>{renderFooter}</View>

      {/* {info.brand && (
        <View className='goods-item__ft'>
          <SpImage
            className='brand-logo'
            mode='aspectFill'
            src={info.brand}
            width={60}
            height={60}
          />
          <View className='brand-info'></View>
        </View>
      )} */}
    </View>
  )
}

SpGoodsItem.options = {
  addGlobalClass: true
}

export default SpGoodsItem
