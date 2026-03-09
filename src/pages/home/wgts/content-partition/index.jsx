/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useState, useEffect, useMemo, useContext } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { classNames, pxToRpx } from '@/utils'
import { getGlobalBaseStyle } from '../helper'
import HomeWgts from '../../comps/home-wgts'
import ContentPartitionNavBar from '../comps/nav-bar'
import { WgtsContext } from '../wgts-context'
import './index.scss'

export default function WgtContentPartition(props) {
  const { info, id } = props
  const { immersive, navBarHeight, setScrollIntoView } = useContext(WgtsContext)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [scrollView, setScrollView] = useState(``)
  const [children, setChildren] = useState([])
  // 从 params 中获取配置和数据，兼容两种数据结构
  const params = info?.params || info || {}
  const base = params.base || {}
  const data = params.data || {}
  const navList = data?.data || []

  // 初始化：找到第一个激活的导航项
  useEffect(() => {
    const activeIndex = navList.findIndex((item) => item.isActive)
    if (activeIndex >= 0) {
      setCurrentIndex(activeIndex)
      setChildren(navList[activeIndex]?.children || [])
    } else {
      setCurrentIndex(0)
      setChildren(navList[0]?.children || [])
    }
  }, [navList])

  // 获取导航栏样式（与 location-module 一致）
  const navStyle = useMemo(() => {
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
    console.log(item, isActive, 'item, isActive')
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
    initContetn(index)
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

  const initContetn = (index) => {
    let viewIndex = index > 0 ? index - 1 : 0
    setScrollView(`nav-item-${viewIndex}-${id}`)
    setCurrentIndex(index)
    setChildren(navList[index]?.children || [])
    Taro.nextTick(() => {
      setScrollIntoView(`wgt-content-partition-section-${index}-${id}`)
    })
  }
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

    const totalHeight = outerPaddingTop +
        outerPaddingBottom +
        navAreaPaddingTop +
        navAreaPaddingBottom +
        navItemHeight

    if (immersive) {
      return pxToRpx(navBarHeight) + totalHeight
    }
    return totalHeight
  }, [base, immersive, navBarHeight])

  return (
    <View
      className={classNames('wgt wgt-content-partition')}
      id={`wgt-content-partition-${id || ''}`}
    >
      <View className='wgt-content-partition__container'>
        {/* 导航栏 */}
        <ContentPartitionNavBar
          navList={navList}
          currentIndex={currentIndex}
          onNavClick={handleNavClick}
          base={base}
          navStyle={navStyle}
          navItemAreaStyle={navItemAreaStyle}
          getNavItemStyle={getNavItemStyle}
          classNamePrefix='wgt-content-partition'
          id={id}
          scrollIntoView={scrollView}
          handleScrollToUpper={handleScrollToUpper}
          handleScrollToLower={handleScrollToLower}
          handleClickLeftImg={handleClickLeftImg}
          handleClickRightImg={handleClickRightImg}
        />

        {/* 内容区域 - 显示所有导航项的 children */}
        <View className='wgt-content-partition__content'>
      <View id={`wgt-content-partition-section-${currentIndex}-${id}`} className='wgt-content-partition__section-line' style={{ top: `-${calculateNavBarHeight}rpx` }} />
          {children.length > 0 && <HomeWgts wgts={children} />}
        </View>
      </View>
    </View>
  )
}
