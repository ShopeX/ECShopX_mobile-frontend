/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { SpImage, SpPoint, SpPrice, SpVipLabel } from '@/components'
import { fetchUserFavs, addUserFav, deleteUserFav } from '@/store/slices/user'
import { useLogin } from '@/hooks'
import qs from 'qs'
import S from '@/spx'

import { classNames, showToast, VERSION_PLATFORM, VERSION_IN_PURCHASE, isWeixin } from '@/utils'
import { PROMOTION_TAG } from '@/consts'

import './index.scss'

const $instance = Taro.getCurrentInstance()

function SpGoodsItem(props) {
  const dispatch = useDispatch()
  const { favs = [] } = useSelector((state) => state.user)
  const { priceSetting } = useSelector((state) => state.sys)
  const [isPurchase, setIsPurchase] = useState(false)
  const { item_page } = priceSetting
  const loadingRef = useRef(false)
  const {
    market_price: enMarketPrice,
    member_price: enMemberPrice,
    svip_price: enSvipPrice
  } = item_page
  useEffect(() => {
    getIsPurchase()
  }, [])
  useDidShow(() => {
    loadingRef.current = false
    getIsPurchase()
  })
  const getIsPurchase = () => {
    if (loadingRef.current) return
    loadingRef.current = true
    let isPurchase = false
    if (isWeixin) {
      isPurchase = $instance.page.route.includes('subpages/purchase')
    } else {
      isPurchase = $instance.page.path.includes('subpages/purchase')
    }
    setIsPurchase(isPurchase)
  }

  const { priceDisplayConfig = {} } = useSelector((state) => state.purchase)
  const { items_page = {} } = priceDisplayConfig
  const { activity_price: enPurActivityPrice } = items_page
  const {
    onClick,
    onAddToCart,
    showFav,
    showAddCart,
    info = null,
    renderFooter,
    showPromotion,
    showPrice,
    hideStore,
    renderBrand,
    mode,
    goodsType,
    lazyLoad
  } = props
  const { isLogin } = useLogin()

  const handleFavClick = async (e) => {
    e.stopPropagation()
    const { itemId } = info
    const fav = favs.findIndex((item) => item.item_id == itemId) > -1
    if (!fav) {
      await dispatch(addUserFav(itemId))
    } else {
      await dispatch(deleteUserFav(itemId))
    }
    await dispatch(fetchUserFavs())
    console.log('fav', fav)
    if (S.getAuthToken()) {
      showToast(fav ? '已移出收藏' : '已加入收藏')
    }
  }

  const onChangeToolBar = (e) => {
    e.stopPropagation()
    onAddToCart(info)
  }

  const handleClick = () => {
    const { itemId, distributorId, card_id, code, user_card_id, point } = info
    if (onClick) {
      onClick()
      return
    }
    let query = { id: itemId }
    if (typeof distributorId != 'undefined') {
      query = {
        ...query,
        dtid: distributorId
      }
    }
    if (card_id) {
      query = {
        ...query,
        card_id,
        code,
        user_card_id
      }
    }

    const url = `${
      !!point || goodsType == 'point'
        ? '/subpages/pointshop/espier-detail'
        : '/pages/item/espier-detail'
    }?${qs.stringify(query)}`
    Taro.navigateTo({
      url
    })
  }

  if (!info) {
    return null
  }

  console.log(isPurchase, 'isPurchase', info.activityPrice, info, $instance)
  // console.log( "favs:", favs );
  const isFaved = favs.findIndex((item) => item.item_id == info.itemId) > -1
  const isShowStore =
    !hideStore && VERSION_PLATFORM && info.distributor_info && !Array.isArray(info.distributor_info)
  if (!info) return null
  return (
    <View className={classNames('sp-goods-item')} onClick={handleClick.bind(this)}>
      <View className='goods-item__hd'>
        <SpImage lazyLoad={lazyLoad} src={info.pic} mode={mode} />
      </View>
      {renderBrand && <View className='goods-brand-wrap'>{renderBrand}</View>}
      <View className='goods-item__bd'>
        {/* 跨境商品 */}
        {info.type === '1' && (
          <View className='national-info'>
            <Image
              className='nationalFlag'
              src={info.origincountry_img_url}
              mode='aspectFill'
              lazyLoad={lazyLoad}
            />
            <Text className='nationalTitle'>{info.origincountry_name}</Text>
          </View>
        )}

        <View className='goods-info'>
          <View className='goods-title'>
            {info?.isPrescription == 1 && <Text className='prescription-drug'>处方药</Text>}
            {info.itemName}
          </View>
          <View className='goods-desc'>{info.brief}</View>
        </View>

        {/* 促销活动标签 */}
        {showPromotion && info.promotion && info.promotion.length > 0 && (
          <View className='promotions'>
            {info.promotion.map((item, index) => (
              <Text className='promotion-tag' key={`promotion-tag__${index}`}>
                {PROMOTION_TAG()[item.tag_type]}
              </Text>
            ))}
          </View>
        )}

        <View className='bd-block'>
          {/* 商品价格、积分 */}
          {info.point && info.point > 0 ? (
            <View className='goods-point'>
              <SpPoint value={info.point} />
              {info.price > 0 ? <Text style='margin: 0 4px;'>+</Text> : ''}
              {info.price > 0 ? <SpPrice primary size={32} value={info.price} /> : ''}
            </View>
          ) : (
            ''
          )}

          {!info.point && showPrice && (
            <View className='goods-price'>
              <View className='gd-price'>
                {isPurchase && (
                  <>
                    {info.activityPrice && enPurActivityPrice ? (
                      <View className='act-price-wrap'>
                        <SpPrice value={info.activityPrice} className='act-price' symbol='¥' />
                        <SpPrice size={24} value={info.price} noSymbol lineThrough />
                      </View>
                    ) : (
                      enPurActivityPrice && <SpPrice size={36} value={info.price} />
                    )}
                  </>
                )}
                {!isPurchase && (
                  <SpPrice size={36} value={info.activityPrice || info.price}></SpPrice>
                )}
                {/* {info.marketPrice > 0 && enMarketPrice && (
                  <SpPrice
                    size={26}
                    className='mkt-price'
                    lineThrough
                    value={info.marketPrice}
                  ></SpPrice>
                )} */}
              </View>
              {!info.activityPrice && isLogin && !isPurchase && (
                <View className='more-price'>
                  {info.memberPrice < info.price && enMemberPrice && (
                    <View className='vip-price'>
                      <SpPrice value={info.memberPrice} />
                      <SpVipLabel content='会员价' type='member' />
                    </View>
                  )}

                  {info.vipPrice > 0 &&
                    isLogin &&
                    info.vipPrice < info.memberPrice &&
                    (!info.svipPrice || info.vipPrice > info.svipPrice) &&
                    enSvipPrice && (
                      <View className='vip-price'>
                        <SpPrice value={info.vipPrice} />
                        <SpVipLabel content='VIP' type='vip' />
                      </View>
                    )}

                  {info.svipPrice > 0 &&
                    isLogin &&
                    info.svipPrice < info.vipPrice &&
                    info.svipPrice < info.memberPrice &&
                    enSvipPrice && (
                      <View className='svip-price'>
                        <SpPrice value={info.svipPrice} />
                        <SpVipLabel content='SVIP' type='svip' />
                      </View>
                    )}
                </View>
              )}
            </View>
          )}

          <View className='bd-block-rg'>
            {showFav && !VERSION_IN_PURCHASE && (
              <View onClick={(e) => handleFavClick(e)}>
                <Text
                  className={classNames(
                    'iconfont',
                    isFaved ? 'icon-shoucanghover-01' : 'icon-shoucang-01'
                  )}
                />
              </View>
            )}

            {showAddCart ? (
              <View onClick={(e) => onChangeToolBar(e)}>
                <Text className='iconfont icon-gouwuche2' />
              </View>
            ) : (
              ''
            )}

            {info.point && info.point > 0 ? <View className='btn-exchange'>兑换</View> : ''}
          </View>
        </View>

        {isShowStore && (
          <View
            className='goods__store'
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
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

SpGoodsItem.defaultProps = {
  onClick: null,
  showMarketPrice: true,
  showFav: false,
  showAddCart: false,
  showSku: false,
  noCurSymbol: false,
  info: null,
  isPointitem: false,
  renderFooter: null,
  showPromotion: true,
  showPrice: true,
  hideStore: false,
  renderBrand: null,
  mode: 'widthFix',
  goodsType: 'normal',
  lazyLoad: true,
  onChange: () => {},
  onAddToCart: () => {},
  onStoreClick: () => {}
}

export default SpGoodsItem
