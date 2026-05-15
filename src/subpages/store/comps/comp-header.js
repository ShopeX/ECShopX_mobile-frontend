/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { useState, useCallback, useEffect } from 'react'
import api from '@/api'
import { SpShopCoupon, SpShopFullReduction } from '@/components'
import { useLogin } from '@/hooks'
import { useTranslation, $t, ti } from '@/i18n'
import './comp-header.scss'

function CompHeader(props) {
  useTranslation()
  const {
    info,
    couponList = [],
    brandInfo = () => {},
    brand: brandShow = true,
    fav: favProp,
    showFav = true,
    showSale = false
  } = props
  const {
    brand = '',
    name = '',
    scoreList = {},
    marketingActivityList = [],
    sales_count = 0
  } = info
  const [showMore, setShowMore] = useState(false)
  const [fav, setFav] = useState(false)
  const { isLogin } = useLogin({
    autoLogin: false
  })
  const handleCouponClick = useCallback(() => {
    Taro.navigateTo({
      url: `/subpages/marketing/coupon-center?distributor_id=${info.distributor_id}`
    })
  }, [info])
  const handleFocus = (flag) => async () => {
    if (!isLogin) {
      return Taro.showToast({
        icon: 'none',
        title: $t('e02eaf53.3a34e2')
      })
    }
    let data = {}
    if (flag) {
      //关注
      data = await api.member.storeFav(info.distributor_id)
    } else {
      //取消
      data = await api.member.storeFavDel(info.distributor_id)
    }
    if (Object.keys(data).length > 0) {
      Taro.showToast({
        icon: 'none',
        title: flag ? $t('e02eaf53.60fa97') : $t('e02eaf53.208992')
      })
    }
    setFav(flag)
  }

  useEffect(() => {
    setFav(favProp)
  }, [favProp])
  //品牌介绍
  // const brandInfo = () => {}
  return (
    <View className='comp-header'>
      {/* {店铺信息} */}
      <View className='header-top'>
        <Image src={brand} className='header-img' />
        <View className='top-middle'>
          <View className='store-name'>{name}</View>
          <View className='store-avgSstar-block'>
            <Text className='store-avgSstar'>{ti('e02eaf53.81b07d', [scoreList.avg_star])}</Text>
            {brandShow && (
              <View className='brand-produce' onClick={brandInfo}>
                {$t('e02eaf53.8cd226')}
              </View>
            )}
            {showSale && <View className='sale_count'>{ti('e02eaf53.297c82', [sales_count])}</View>}
          </View>
        </View>
        {showFav && (
          <View className='attention' onClick={handleFocus(!fav)}>
            {fav ? $t('e02eaf53.92bdc8') : $t('e02eaf53.9b5b8a')}
          </View>
        )}
      </View>
      {/* {优惠券} */}
      {couponList.length > 0 && (
        <View className='coupon-block' onClick={handleCouponClick}>
          <Text className='get-coupon'>{$t('e02eaf53.563933')}</Text>
          {couponList.slice(0, 3).map((item, index) => (
            <SpShopCoupon
              info={item}
              key={`shop-coupon__${index}`}
              fromStoreIndex
              className='coupon-index'
            />
          ))}
        </View>
      )}
      {/* {满减} */}
      {marketingActivityList.length > 0 && (
        <View className={!showMore ? 'full-block' : 'full-block pick'}>
          {marketingActivityList.map((item, index) => (
            <SpShopFullReduction
              info={item}
              key={`shop-full-reduction__${index}`}
              showMoreIcon={marketingActivityList.length > 1 && index == 0}
              status={showMore}
              count={marketingActivityList.length}
              handeChange={(e) => setShowMore(e)}
            />
          ))}
        </View>
      )}
    </View>
  )
}
CompHeader.options = {
  addGlobalClass: true
}

export default CompHeader
