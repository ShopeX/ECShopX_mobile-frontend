import React, { useMemo, useState, useEffect, useCallback } from 'react'
import Taro from '@tarojs/taro'
import { View, Swiper, SwiperItem } from '@tarojs/components'
import { classNames } from '@/utils'
import { SpShop } from '@/components'
import isArray from 'lodash/isArray'
import { useSelector } from 'react-redux'
import { getGlobalBaseStyle } from '../helper'
import './index.scss'

function WgtShop(props) {
  const { info, id } = props
  const { base = {}, data = [], noRegionauth = false, pagetype } = info || {} //是否不限制区域
  const { displayType } = base || {}
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    setCurrentIndex(0)
  }, [data])

  // 获取外层样式（包含 outerMargin）
  const outStyle = useCallback(() => {
    return getGlobalBaseStyle(base?.outerMargin || {})
  }, [base])

  // 获取内层样式（包含 innerPadding）
  const innerStyle = useMemo(() => {
    return getGlobalBaseStyle(base?.innerPadding || {})
  }, [base])

  const SwiperHeight = useMemo(() => {
    const { innerPadding = {} } = base || {}
    // 勿在 inline style 里写 rpx：H5 浏览器不识别 rpx，height 会失效；用 pxTransform 按端输出 rem/rpx
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

  const handleClickItem = async (name, index) => {
    // 点击事件处理
  }

  console.log(data, 'data')

  return (
    <View
      className={classNames('wgt-shop', {
        'wgt-shop--single': data.length == 1
      })}
      style={outStyle()}
      id={`wgt-shop-${id}`}
    >
      <View className='wgt-shop__content'>
        {isArray(data) && data.length > 0 && (
          <Swiper
            nextMargin={data.length > 1 ? '24rpx' : 0}
            previousMargin={data.length > 1 ? '24rpx' : 0}
            style={{ height: SwiperHeight }}
            onChange={handleChange}
            current={currentIndex}
            className='wgt-shop__content-swiper'
          >
            {isArray(data) &&
              data?.map((item, index) => {
                const slideKey =
                  item?.id != null && item.id !== ''
                    ? `shop-${id}-${item.id}`
                    : `shop-${id}-${index}-${item?.distributor_id ?? index}`
                return (
                  <SwiperItem
                    key={slideKey}
                    className={classNames({
                      'wgt-shop__content-swiper-item': data.length > 1
                    })}
                  >
                    <SpShop
                      info={item}
                      style={innerStyle}
                      isActive={currentIndex == index}
                      handleClickItem={() => handleClickItem(item.name, index)}
                      moduleName={base?.track}
                      id={index}
                      noRegionauth={noRegionauth}
                      pagetype={pagetype}
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
