import React, { useMemo, useCallback } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { classNames } from '@/utils'
import { SpShop } from '@/components'
import isArray from 'lodash/isArray'
import './shop.scss'

function WgtShop(props) {
  const { info, id } = props
  const { base, data = []} = info //是否不限制区域

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

  const scrollHeight = useMemo(() => {
    const { innerPadding } = base
    return `calc(534rpx + ${Taro.pxTransform(innerPadding.paddedt)} + ${Taro.pxTransform(innerPadding.paddedb)})`
  }, [base])



  return (
    <View className={classNames('wgt-shop wgt-shop--horizontal', {
      'wgt-shop--single': data.length == 1
    })} style={outStyle()} id={`wgt-shop-${id}`}
    >
      <View className='wgt-shop__content'>
        {isArray(data) && data.length > 0 && (
          <View 
            className={classNames('wgt-shop__content-scroll', {
              'wgt-shop__content-scroll--snap': data.length > 1
            })}
            style={{ height: scrollHeight }}
          >
            {isArray(data) &&
              data?.map((item, index) => {
                return (
                  <View 
                    key={item.id} 
                    className={classNames('wgt-shop__content-scroll-item', {
                      'wgt-shop__content-scroll-item--snap': data.length > 1
                    })}
                  >
                    <SpShop
                      info={item}
                      style={innerStyle}
                      isActive
                      id={index}
                    />
                  </View>
                )
              })}
          </View>
        )}
      </View>
    </View>
  )
}

export default React.memo(WgtShop)
