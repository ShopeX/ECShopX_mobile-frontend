import React, { useMemo, useState, useEffect, useCallback } from 'react'
import Taro from '@tarojs/taro'
import { View, Swiper, SwiperItem, Text } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { classNames } from '@/utils'
import { SpShop } from '@/components'
import api from '@/api'
import isArray from 'lodash/isArray'
import { $t } from '@/i18n'
import { getGlobalBaseStyle } from '../helper'
import './index.scss'

function WgtShop(props) {
  const { info, id } = props
  const { base = {}, data: configData = [], noRegionauth = false, pagetype } = info || {}
  const dataType = base?.dataType || 'specify'
  const [currentIndex, setCurrentIndex] = useState(0)
  const [nearbyList, setNearbyList] = useState([])
  const [nearbyLoading, setNearbyLoading] = useState(false)
  const { location = {}, address } = useSelector((state) => state.user)

  const fetchNearbyShops = useCallback(async () => {
    setNearbyLoading(true)
    try {
      const params = {
        show_discount: 1,
        type: location?.lat ? 0 : 1,
        sort_type: 1,
        lat: location?.lat || address?.lat,
        lng: location?.lng || address?.lng,
        province: location?.province || address?.province,
        city: location?.city || address?.city,
        district: location?.district || address?.district
      }
      const { list = [] } = await api.shop.getNearbyShop(params)
      setNearbyList(Array.isArray(list) ? list : [])
    } catch (e) {
      setNearbyList([])
    } finally {
      setNearbyLoading(false)
    }
  }, [location, address])

  useEffect(() => {
    if (dataType !== 'nearby') return
    fetchNearbyShops()
  }, [dataType, fetchNearbyShops])

  const displayData = useMemo(() => {
    if (dataType === 'nearby') {
      const limit = Number(base.merchantsNumber) > 0 ? Number(base.merchantsNumber) : 3
      return nearbyList.slice(0, limit)
    }
    return configData
  }, [dataType, nearbyList, configData, base.merchantsNumber])

  useEffect(() => {
    setCurrentIndex(0)
  }, [displayData])

  const outStyle = useCallback(() => {
    return getGlobalBaseStyle(base?.outerMargin || {})
  }, [base])

  const innerStyle = useMemo(() => {
    return getGlobalBaseStyle(base?.innerPadding || {})
  }, [base])

  const SwiperHeight = useMemo(() => {
    const { innerPadding = {} } = base || {}
    const paddedt =
      innerPadding?.paddedt != null && innerPadding?.paddedt !== ''
        ? Taro.pxTransform(innerPadding.paddedt)
        : '0px'
    const paddedb =
      innerPadding?.paddedb != null && innerPadding?.paddedb !== ''
        ? Taro.pxTransform(innerPadding.paddedb)
        : '0px'
    const baseH = Taro.pxTransform(480)
    return `calc(${baseH} + ${paddedt} + ${paddedb})`
  }, [base])

  const handleChange = (e) => {
    setCurrentIndex(e.detail.current)
  }

  const handleMoreNearby = () => {
    Taro.navigateTo({ url: '/subpages/store/nearby-list' })
  }

  const showEmpty = dataType === 'nearby' && !nearbyLoading && displayData.length === 0
  const showMore = dataType === 'nearby' && base.show_nearby_merchants

  return (
    <View
      className={classNames('wgt-shop', {
        'wgt-shop--single': displayData.length === 1
      })}
      style={outStyle()}
      id={`wgt-shop-${id}`}
    >
      <View className='wgt-shop__content'>
        {showEmpty ? (
          <View className='wgt-shop__empty'>
            <Text className='wgt-shop__empty-txt'>{$t('5eda2f64.d17ff7')}</Text>
          </View>
        ) : (
          isArray(displayData) &&
          displayData.length > 0 && (
            <Swiper
              nextMargin={displayData.length > 1 ? '24rpx' : 0}
              previousMargin={displayData.length > 1 ? '24rpx' : 0}
              style={{ height: SwiperHeight }}
              onChange={handleChange}
              current={currentIndex}
              className='wgt-shop__content-swiper'
            >
              {displayData.map((item, index) => {
                const slideKey =
                  item?.id != null && item.id !== ''
                    ? `shop-${id}-${item.id}`
                    : `shop-${id}-${index}-${item?.distributor_id ?? index}`
                return (
                  <SwiperItem
                    key={slideKey}
                    className={classNames({
                      'wgt-shop__content-swiper-item': displayData.length > 1
                    })}
                  >
                    <SpShop
                      info={item}
                      style={innerStyle}
                      isActive={currentIndex === index}
                      moduleName={base?.track}
                      id={index}
                      noRegionauth={noRegionauth}
                      pagetype={pagetype}
                    />
                  </SwiperItem>
                )
              })}
            </Swiper>
          )
        )}
        {showMore && (
          <View className='wgt-shop__more' onClick={handleMoreNearby}>
            <Text className='iconfont icon-spiritling-dingwei' />
            <Text className='wgt-shop__more-txt'>{$t('5eda2f64.77f8be')}</Text>
            <Text className='iconfont icon-qianwang-01' />
          </View>
        )}
      </View>
    </View>
  )
}

export default React.memo(WgtShop)
