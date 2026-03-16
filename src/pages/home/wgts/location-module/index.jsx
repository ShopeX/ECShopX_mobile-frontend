/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, {
  useState,
  useMemo,
  useContext,
  useRef,
  useCallback,
  useLayoutEffect
} from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { classNames, pxToRpx, getElementRectBox, rpxToPx } from '@/utils'
import { usePageContext } from '@/hooks/usePageContext'
import throttle from 'lodash/throttle'
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
  const [scrollView, setScrollView] = useState(``)
  const isClickTab = useRef(false)
  const { scrollTop, setStatusBarBgColorFromSticky } = usePageContext()

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
      position: base.navSticky ? 'sticky' : 'relative',
      top: immersive ? `${navBarHeight}px` : 0
    }
  }, [base.outerMargin, base.navSticky, immersive, navBarHeight])

  // 获取导航项区域样式（navitemarea）
  const navItemAreaStyle = useMemo(() => {
    const navitemarea = base.navitemarea || {}
    return {
      ...getGlobalBaseStyle(navitemarea),
      'border-radius': base.navitemradius ? Taro.pxTransform(base.navitemradius) : 0
    }
  }, [base.navitemarea, base.navitemradius])

  // 获取导航项样式
  const getNavItemStyle = (item, isActive) => {
    const textColor = isActive ? item.navitemactivecolor : item.navitemcolor
    return {
      height: Taro.pxTransform(base.navitemheight || 40),
      color: textColor,
      'background-color': isActive
        ? item.navitemactivebg || 'transparent'
        : item.navitembg || 'transparent',
      'padding-left': `${Taro.pxTransform(base.navitemmargin || 0)}`,
      'padding-right': `${Taro.pxTransform(base.navitemmargin || 0)}`
    }
  }

  // 计算导航栏高度（rpx），吸顶颜色判断需用
  const calculateNavBarHeight = useMemo(() => {
    const outerMargin = base.outerMargin || {}
    const outerPaddingTop = outerMargin.paddedt || 0
    const outerPaddingBottom = outerMargin.paddedb || 0
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
      return pxToRpx(navBarHeight) + totalHeight
    }
    return totalHeight
  }, [base, immersive, navBarHeight])

  const statusBarSourceId = useMemo(() => `location-module-${id}`, [id])

  // 处理导航项点击
  const handleNavClick = (index) => {
    isClickTab.current = true
    setCurrentIndex(index)
    let viewIndex = index > 0 ? index - 1 : 0
    setScrollView(`nav-item-${viewIndex}-${id}`)
    // scrollIntoView 传纯 id，不要 # 前缀，否则 H5/小程序 可能匹配不到导致滚回顶部
    setScrollIntoView(`content-section-${index}-${id}`)
    setTimeout(() => {
      isClickTab.current = false
    }, 500)
  }

  const handleScrollToUpper = () => {
    setScrollView('')
  }
  const handleScrollToLower = () => {
    setScrollView('')
  }

  const handleClickLeftImg = () => {
    setScrollView(`nav-item-0-${id}`)
  }
  const handleClickRightImg = () => {
    setScrollView(`nav-item-${navList.length - 1}-${id}`)
  }

  if (!info || !navList || navList.length === 0) {
    return null
  }

  const handleScrollUpdate = useCallback(async () => {
    try {
      // 如果是点击触发的滚动，不更新 index
      if (isClickTab.current) {
        return
      }
      // 获取所有内容区域的位置信息
      const positions = await Promise.all(
        navList.map(async (_, index) => {
          try {
            const rect = await getElementRectBox(`#content-section-${index}-${id}`)
            return { ...rect, index } // 保存原始索引
          } catch (err) {
            console.error('获取元素位置失败', err)
            return null
          }
        })
      )

      // 过滤掉无效的位置信息（top 需为数字）
      const validPositions = positions.filter(
        (pos) => pos != null && typeof pos.top === 'number'
      )
      if (validPositions.length === 0) return

      // 取 top 为负值的 section 中 top 最大的那个（负值里最接近 0，即刚离开视口顶部的那块）作为当前 tab
      const negativeTops = validPositions.filter((pos) => pos.top < 0)
      let targetIndex
      if (negativeTops.length > 0) {
        const maxNegative = negativeTops.reduce((a, b) =>
          a.top > b.top ? a : b
        )
        targetIndex = maxNegative.index
      } else {
        // 没有负值说明都在视口下方，取 top 最小的（最先进入视口的）
        const firstInView = validPositions.reduce((a, b) =>
          a.top < b.top ? a : b
        )
        targetIndex = firstInView.index
      }

      if (targetIndex >= 0 && targetIndex !== currentIndex && targetIndex < navList.length) {
        setCurrentIndex(targetIndex)
      }

      // 吸顶颜色：先看首 section 是否已滚过顶（进入吸顶区），再以 sentinel 判断是否仍压在本模块；清空仅看 sentinel，避免上滑闪一下
      if (base.navSticky && base.statusBarBgColor && typeof setStatusBarBgColorFromSticky === 'function') {
        const [firstSectionRect, sentinelRect] = await Promise.all([
          getElementRectBox(`#content-section-0-${id}`).catch(() => null),
          getElementRectBox(`#location-module-section-sentinel-${id}`).catch(() => null)
        ])
        const navBarPx = rpxToPx(calculateNavBarHeight)
        const inStickyZone = firstSectionRect != null && firstSectionRect.top <= 0
        const stillOverContent = sentinelRect != null && sentinelRect.top > navBarPx
        if (inStickyZone && stillOverContent) {
          setStatusBarBgColorFromSticky(base.statusBarBgColor, statusBarSourceId)
        } else {
          setStatusBarBgColorFromSticky(null, statusBarSourceId)
        }
      }
    } catch (error) {
      console.error('获取元素位置失败', error)
    }
  }, [id, navList, currentIndex, base.navSticky, base.statusBarBgColor, calculateNavBarHeight, setStatusBarBgColorFromSticky, statusBarSourceId])

  // 创建节流函数 - 优化滚动性能
  const throttledScrollUpdate = useMemo(() => {
    return throttle(handleScrollUpdate, 350)
  }, [handleScrollUpdate])

  useLayoutEffect(() => {
    if (base.navSticky && base.statusBarBgColor && throttledScrollUpdate) {
      throttledScrollUpdate()
    } else {
      setStatusBarBgColorFromSticky?.(null, statusBarSourceId)
    }
  }, [scrollTop, currentIndex, throttledScrollUpdate, base.navSticky, base.statusBarBgColor, setStatusBarBgColorFromSticky, statusBarSourceId])

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
          scrollIntoView={scrollView}
          getNavItemStyle={getNavItemStyle}
          id={id}
          handleScrollToUpper={handleScrollToUpper}
          handleScrollToLower={handleScrollToLower}
          handleClickLeftImg={handleClickLeftImg}
          handleClickRightImg={handleClickRightImg}
        />

        {/* 内容区域 - 显示所有导航项的 children */}
        <View className='wgt-location-module__content'>
          {navList.length > 0 &&
            navList.map((item, index) => {
              return (
                <View key={index} className='wgt-location-module__content-section'>
                  <View
                    className='wgt-location-module__content-section-line'
                    style={{ top: `-${calculateNavBarHeight}rpx` }}
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
      <View id={`location-module-section-sentinel-${id}`} />
    </View>
  )
}
