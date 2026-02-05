/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, {
  useState,
  useMemo,
  useContext,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect
} from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { classNames, pxToRpx, getElementRectBox } from '@/utils'
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
  const { setScrollIntoView, immersive, navBarHeight, scrollTop } = useContext(WgtsContext)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [scrollView, setScrollView] = useState(``)
  const isClickTab = useRef(false)

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
      borderRadius: base.navitemradius ? Taro.pxTransform(base.navitemradius) : 0
    }
  }, [base.navitemarea, base.navitemradius])

  // 获取导航项样式
  const getNavItemStyle = (item, isActive) => {
    const textColor = isActive ? item.navitemactivecolor : item.navitemcolor
    return {
      height: Taro.pxTransform(base.navitemheight || 40),
      color: textColor,
      backgroundColor: isActive
        ? item.navitemactivebg || 'transparent'
        : item.navitembg || 'transparent',
      paddingLeft: `${Taro.pxTransform(base.navitemmargin || 0)}`,
      paddingRight: `${Taro.pxTransform(base.navitemmargin || 0)}`
    }
  }

  // 处理导航项点击
  const handleNavClick = (index) => {
    isClickTab.current = true
    setCurrentIndex(index)
    let viewIndex = index > 0 ? index - 1 : 0
    setScrollView(`nav-item-${viewIndex}-${id}`)
    setScrollIntoView(`#content-section-${index}-${id}`)
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
      console.log('scrollTop', scrollTop)
      const viewportTop = calculateNavBarHeight
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

      // 过滤掉无效的位置信息并按照位置排序
      const validPositions = positions.filter((pos) => pos !== null).sort((a, b) => a.top - b.top)

      if (validPositions.length === 0) return

      // 找到最接近导航栏下方的元素
      let targetIndex = -1
      let minDistance = Infinity

      validPositions.forEach((pos) => {
        const elementTop = pos.top
        const elementBottom = pos.bottom

        // 计算元素与导航栏下方的距离
        let distance

        if (elementTop <= viewportTop && elementBottom > viewportTop) {
          // 元素跨越导航栏位置，优先选择
          distance = 0
        } else if (elementBottom <= viewportTop) {
          // 元素在导航栏上方
          distance = viewportTop - elementBottom
        } else {
          // 元素在导航栏下方
          distance = elementTop - viewportTop
        }

        // 更新最小距离
        if (distance < minDistance) {
          minDistance = distance
          targetIndex = pos.index
        }
      })

      // 只在找到有效索引且不是当前索引时更新
      if (targetIndex >= 0 && targetIndex !== currentIndex && targetIndex < navList.length) {
        setCurrentIndex(targetIndex)
      }
    } catch (error) {
      console.error('获取元素位置失败', error)
    }
  }, [calculateNavBarHeight, data, currentIndex])

  // 创建节流函数 - 优化滚动性能
  const throttledScrollUpdate = useMemo(() => {
    return throttle(handleScrollUpdate, 350)
  }, [handleScrollUpdate])

  useLayoutEffect(() => {
    throttledScrollUpdate()
  }, [scrollTop])

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

    const totalHeight = pxToRpx(
      outerPaddingTop +
        outerPaddingBottom +
        navAreaPaddingTop +
        navAreaPaddingBottom +
        navItemHeight
    )
    console.log(navBarHeight, 'totalHeight', totalHeight)

    if (immersive) {
      return pxToRpx(navBarHeight) + totalHeight
    }
    return totalHeight
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
    </View>
  )
}
