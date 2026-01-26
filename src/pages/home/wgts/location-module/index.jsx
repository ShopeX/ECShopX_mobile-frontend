/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useState, useMemo, useContext } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { classNames } from '@/utils'
import { getGlobalBaseStyle } from '../helper'
import LocationModuleNavBar from '../comps/nav-bar'
import {
  WgtImgHotZone,
  WgtShop,
  WgtClassify,
  WgtSlider,
  WgtFilm,
  WgtMarquees,
  WgtFullSlider,
  WgtCouponCard,
  WgtSpeedkill,
  WgtGroup,
  WgtHotranking,
  WgtGoods
} from '../index'
import './index.scss'
import { WgtsContext } from '../wgts-context'

export default function WgtLocationModule(props) {
  const { info, id } = props
  const { setScrollIntoView, immersive, navBarHeight } = useContext(WgtsContext)
  const [currentIndex, setCurrentIndex] = useState(0)

  // 从 params 中获取配置和数据，兼容两种数据结构
  const params = info?.params || info || {}
  const base = params.base || {}
  const data = params.data || {}
  const navList = data?.data || []

  // 获取导航栏样式
  const navStyle = useMemo(() => {
    console.log(immersive, navBarHeight, 'immersive,navBarHeight')
    return {
      ...getGlobalBaseStyle(base.outerMargin),
      position: base.navSticky ? 'sticky' : 'inherit',
      top: immersive ? `${navBarHeight}px` : 0
    }
  }, [base.outerMargin, base.navSticky, immersive, navBarHeight])

  // 获取导航项区域样式（navitemarea）
  const navItemAreaStyle = useMemo(() => {
    const navitemarea = base.navitemarea || {}
    return getGlobalBaseStyle(navitemarea)
  }, [base.navitemarea])

  // 获取导航项样式
  const getNavItemStyle = (item, isActive) => {
    const textColor = isActive
      ? item.navitemactivecolor || '#1A1A1A'
      : item.navitemcolor || '#666666'

    return {
      height: Taro.pxTransform(base.navitemheight || 40),
      color: textColor,
      border: base.navitemborder ? `1px solid ${base.navitembordercolor || '#ffffff'}` : 'none',
      borderRadius: base.navitemradius ? Taro.pxTransform(base.navitemradius) : 0
    }
  }

  // 处理导航项点击
  const handleNavClick = (index) => {
    setCurrentIndex(index)
    setScrollIntoView(`#content-section-${index}-${id}`)
  }

  if (!info || !navList || navList.length === 0) {
    return null
  }

  // 收集所有导航项的 children
  const allChildren = navList.reduce((acc, item) => {
    if (item.children && item.children.length > 0) {
      acc.push(...item.children)
    }
    return acc
  }, [])

  // 计算 LocationModuleNavBar 的高度（单位：rpx）
  // 注意：此函数不包含图片高度，图片高度需要动态获取
  const calculateNavBarHeight = useMemo(() => {
    // 外层容器的 padding（outerMargin）
    const outerMargin = base.outerMargin || {}
    const outerPaddingTop = outerMargin.paddedt || 0
    const outerPaddingBottom = outerMargin.paddedb || 0

    // 导航项区域的 padding（navitemarea）
    const navitemarea = base.navitemarea || {}
    const navAreaPaddingTop = navitemarea.paddedt || 0
    const navAreaPaddingBottom = navitemarea.paddedb || 0

    const navItemHeight = base.navitemheight

    const totalHeight =
      outerPaddingTop +
      outerPaddingBottom +
      navAreaPaddingTop +
      navAreaPaddingBottom +
      navItemHeight

    if (immersive) {
      return `calc(-${totalHeight}rpx - ${navBarHeight}px)`
    }
    return `-${totalHeight}rpx`
  }, [base, immersive, navBarHeight])

  // 打印计算结果（用于调试）
  console.log('LocationModuleNavBar 高度计算:', calculateNavBarHeight)

  return (
    <View className={classNames('wgt wgt-location-module')} id={`wgt-location-module-${id || ''}`}>
      <View className='wgt-location-module__container'>
        {/* 导航栏 */}
        <LocationModuleNavBar
          navList={navList}
          currentIndex={currentIndex}
          onNavClick={handleNavClick}
          base={base}
          navStyle={navStyle}
          navItemAreaStyle={navItemAreaStyle}
          getNavItemStyle={getNavItemStyle}
          classNamePrefix='wgt-location-module'
          animate='vertical'
        />

        {/* 内容区域 - 显示所有导航项的 children */}
        <View className='wgt-location-module__content'>
          {navList.length > 0 &&
            navList.map((item, index) => {
              return (
                <View key={index} className='wgt-location-module__content-section'>
                  <View
                    className='wgt-location-module__content-section-line'
                    style={{ top: `${calculateNavBarHeight}` }}
                    id={`content-section-${index}-${id}`}
                  />
                  {item.children.length > 0 &&
                    item.children.map((child, childIndex) => {
                      return (
                        <>
                          {child.name === 'imgHotzone' && (
                            <WgtImgHotZone info={child} id={`${childIndex}_${id}`} />
                          )}
                          {child.name === 'shop' && (
                            <WgtShop info={child} id={`${childIndex}_${id}`} />
                          )}
                          {child.name === 'goods' && (
                            <WgtGoods info={child} id={`${childIndex}_${id}`} />
                          )}
                          {child.name === 'slider' && (
                            <WgtSlider info={child} id={`${childIndex}_${id}`} />
                          )}
                          {child.name === 'film' && (
                            <WgtFilm info={child} id={`${childIndex}_${id}`} />
                          )}
                          {child.name === 'marquees' && (
                            <WgtMarquees info={child} id={`${childIndex}_${id}`} />
                          )}
                          {child.name === 'fullSlider' && (
                            <WgtFullSlider info={child} id={`${childIndex}_${id}`} />
                          )}
                          {child.name === 'couponCard' && (
                            <WgtCouponCard info={child} id={`${childIndex}_${id}`} />
                          )}
                          {child.name === 'speedkill' && (
                            <WgtSpeedkill info={child} id={`${childIndex}_${id}`} />
                          )}
                          {child.name === 'group' && (
                            <WgtGroup info={child} id={`${childIndex}_${id}`} />
                          )}
                          {child.name === 'hotranking' && (
                            <WgtHotranking info={child} id={`${childIndex}_${id}`} />
                          )}
                          {child.name === 'classify' && (
                            <WgtClassify info={child} id={`${childIndex}_${id}`} />
                          )}
                        </>
                      )
                    })}
                </View>
              )
            })}
        </View>
      </View>
    </View>
  )
}
