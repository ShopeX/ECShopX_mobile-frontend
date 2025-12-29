/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { SpImage, SpLogin, SpPoint, SpPrice } from '@/components'
import { fetchUserFavs, addUserFav, deleteUserFav } from '@/store/slices/user'
import { addCart, updateCount } from '@/store/slices/cart'
import qs from 'qs'
import S from '@/spx'
import { useLogin } from '@/hooks'

import { classNames, showToast, styleNames, VERSION_PLATFORM } from '@/utils'
import { PROMOTION_TAG } from '@/consts'

import './comp-goods-item.scss'

function CompGoodsItem(props) {
  const dispatch = useDispatch()
  const { favs = [] } = useSelector((state) => state.user)
  const {
    onClick,
    onStoreClick = () => {},
    onAddToCart = () => {},
    showFav = false,
    info = null,
    renderFooter = null,
    showPromotion = true,
    showPrice = true,
    hideStore = false
  } = props
  const { isLogin, isNewUser, login, getUserInfoAuth } = useLogin({
    // autoLogin: true,
  })

  const handleFavClick = async (e) => {
    e.stopPropagation()
    if (!S.getAuthToken()) {
      showToast('请先登录')
      return
    }

    const { itemId } = info
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

  const handleCartClick = async (e) => {
    e?.stopPropagation()
    if (!S.getAuthToken()) {
      // showToast('请登录')
      return
    }
    const { nospec, distributorId, itemId } = info
    if (!nospec) {
      showToast('请选择规格')
      return
    }
    Taro.showLoading()
    await dispatch(
      addCart({
        item_id: itemId,
        num: 1,
        distributor_id: distributorId,
        shop_type: 'distributor'
      })
    )
    dispatch(updateCount({ shop_type: 'distributor' }))
    Taro.hideLoading()
    showToast('成功加入购物车')
  }

  const onChangeToolBar = (e) => {
    e.stopPropagation()
    onAddToCart(info)
  }

  if (!info) {
    return null
  }

  // console.log( "favs:", favs );
  const isFaved = favs.findIndex((item) => item.item_id == info.itemId) > -1
  const isShowStore =
    !hideStore && VERSION_PLATFORM && info.distributor_info && !Array.isArray(info.distributor_info)

  return (
    <View className={classNames('comp-goods-item')}>
      <View className='goods-item__hd' onClick={handleClick.bind(this)}>
        <View className='image-wrap'>
          <SpImage className='main-image' src={info.pic} mode='aspectFill' circle={16} />
        </View>
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
        <View className='goods-info' onClick={handleClick.bind(this)}>
          <View className='goods-title'>
            {info.isMedicine == 1 && info?.medicineData?.is_prescription == 1 && (
              <Text className='prescription-drug'>处方药</Text>
            )}
            {info.itemName}
          </View>
          {/* <View className='goods-desc'>{info.brief}</View> */}
        </View>

        {info.tagList &&
          info.tagList?.map((item) => (
            <Text
              className='promotion-tag promotion-tag-direct'
              key={item.tag_id}
              style={styleNames({
                color: item.font_color,
                borderColor: item.tag_color,
                backgroundColor: item.tag_color
              })}
            >
              {item.tag_name}
            </Text>
          ))}
        {info.ky_item_type == 'direct' && <Text className='promotion-tag-direct'>直供品</Text>}

        {/* <View className='goods-info-box'>
          <View className='goods-store'>
            库存：{info.store}
            {info.item_unit}
          </View>
          {info.store > 0 && info.approve_status == 'onsale' && (
            <SpLogin onChange={handleCartClick}>
              <View className='goods-cart'>
                <Text className={classNames('iconfont', 'icon-gouwuche')} />
              </View>
            </SpLogin>
          )}
        </View> */}

        {/* 促销活动标签 */}
        <View className='promotions'>
          {showPromotion && info.promotion && info.promotion.length > 0 && (
            <View>
              {info?.promotion.map((item, index) => (
                <Text className='promotion-tag' key={`promotion-tag__${index}`}>
                  {PROMOTION_TAG()[item.tag_type]}
                </Text>
              ))}
            </View>
          )}
        </View>

        {(info.is_point || (!info.is_point && showPrice) || showFav) && (
          <View className='bd-block' onClick={handleClick.bind(this)}>
            {/* 商品价格、积分 */}
            {info.is_point && (
              <View className='goods-price'>
                <SpPoint value={info.point} />
              </View>
            )}

            {!info.is_point && showPrice && (
              <View className='goods-price'>
                <View className='gd-price'>
                  <SpPrice value={info.activityPrice || info.price} size={36}></SpPrice>
                  {info.price - info.activityPrice > 0 ? (
                    <Text className='unit-price'>{info.price}</Text>
                  ) : (
                    ''
                  )}
                </View>
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
            <SpLogin newUser={isNewUser}>
              <Text className='iconfont icon-gouwuche2' onClick={onChangeToolBar} />
            </SpLogin>
          </View>
        )}

        {isShowStore && (
          <View className='goods__store' onClick={() => onStoreClick(info)}>
            {info.distributor_info.name}{' '}
            <Text className='goods__store-entry'>
              进店<Text className='iconfont icon-arrowRight'></Text>
            </Text>
          </View>
        )}
      </View>

      <View className='goods-item__ft'>{renderFooter}</View>
    </View>
  )
}

CompGoodsItem.options = {
  addGlobalClass: true
}

export default CompGoodsItem
