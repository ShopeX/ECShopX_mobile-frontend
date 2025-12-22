import React, { useMemo, useState, useEffect, useCallback } from 'react'
import Taro from '@tarojs/taro'
import { View, Swiper, SwiperItem } from '@tarojs/components'
import { classNames } from '@/utils'
import { SpShop } from '@/components'
import isArray from 'lodash/isArray'
import './shop.scss'

function WgtShop(props) {
  const { info, id } = props
  const { base, data = []} = info //是否不限制区域
  const [currentIndex, setCurrentIndex] = useState(0)
  useEffect(() => {
    setCurrentIndex(0)
  }, [data])

  const outStyle = useCallback(() => {
    const { outerMargin, outerBackground } = base
    return {
      paddingTop: Taro.pxTransform(outerMargin.paddedt),
      paddingBottom: Taro.pxTransform(outerMargin.paddedb),
      backgroundColor: outerBackground.color,
      backgroundImage: outerBackground.image ? `url(${outerBackground.image})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }
  }, [base])
  const innerStyle = useMemo(() => {
    const { innerPadding, innerBackground } = base
    return {
      paddingLeft: Taro.pxTransform(innerPadding.paddedl),
      paddingRight: Taro.pxTransform(innerPadding.paddedr),
      paddingTop: Taro.pxTransform(innerPadding.paddedt),
      paddingBottom: Taro.pxTransform(innerPadding.paddedb),
      backgroundColor: innerBackground?.type == 'solid' ? innerBackground.color : 'none',
      backgroundImage:
        innerBackground?.type == 'gradient'
          ? `linear-gradient(${innerBackground.startColor}, ${innerBackground.endColor})`
          : 'none'
    }
  }, [base])

  const SwiperHeight = useMemo(() => {
    const { innerPadding } = base
    return `calc(534rpx + ${Taro.pxTransform(innerPadding.paddedt)} + ${Taro.pxTransform(innerPadding.paddedb)})`
  }, [base])

  const handleChange = (e) => {
    setCurrentIndex(e.detail.current)
  }



  return (
    <View className={classNames('wgt-shop wgt-shop--horizontal', {
      'wgt-shop--single': data.length == 1
    })} style={outStyle()} id={`wgt-shop-${id}`}
    >
      <View className='wgt-shop__content'>
        {isArray(data) && data.length > 0 && (
          <Swiper
            nextMargin={data.length > 1 ? '24rpx' : 0}
            previousMargin={data.length > 1 ? '24rpx' : 0}
            style={{ height: SwiperHeight }}
            onChange={handleChange}
            current={currentIndex}
          >
            {isArray(data) &&
              data?.map((item, index) => {
                return (
                  <SwiperItem key={item.id} className={classNames({
                    'wgt-shop__content-swiper-item': data.length > 1
                  })}
                  >
                      <SpShop
                        info={item}
                        style={innerStyle}
                        isActive={currentIndex == index}
                        id={index}
                      />
                  </SwiperItem>
                )
              })}
          </Swiper>
        )}
      </View>
    </View>
  )
}

export default React.memo(WgtShop)
