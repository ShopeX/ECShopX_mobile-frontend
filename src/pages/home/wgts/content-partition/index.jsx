/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useState, useEffect, useMemo } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { SpImage } from '@/components'
import { classNames, styleNames } from '@/utils'
import { getGlobalBaseStyle } from '../helper'
import HomeWgts from '../../comps/home-wgts'
import ContentPartitionNavBar from '../comps/nav-bar'
import './index.scss'

export default function WgtContentPartition(props) {
  const { info, id } = props
  const [currentIndex, setCurrentIndex] = useState(0)
  const [scrollIntoView, setScrollIntoView] = useState(``)

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
    } else {
      setCurrentIndex(0)
    }
  }, [navList])

  // 获取导航栏样式
  const navStyle = useMemo(() => {
    return {
      ...getGlobalBaseStyle(base.outerMargin),
      position: base.navSticky ? 'sticky' : 'relative',
      top: base.navSticky ? 0 : 'auto',
      zIndex: base.navSticky ? 100 : 'auto'
    }
  }, [base.navbg, base.navpadded, base.navSticky])

  // 获取导航项区域样式（navitemarea）
  const navItemAreaStyle = useMemo(() => {
    const navitemarea = base.navitemarea || {}
    return {
      ...getGlobalBaseStyle(navitemarea),
      borderRadius: base.navitemradius ? Taro.pxTransform(base.navitemradius) : 0
    }
  }, [base.navitemarea])

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
    setCurrentIndex(index)
    let viewIndex = index > 0 ? index - 1 : 0
    setScrollIntoView(`nav-item-${viewIndex}-${id}`)
  }

  const handleScrollToUpper = () => {
    setScrollIntoView('')
  }
  const handleScrollToLower = () => {
    setScrollIntoView('')
  }

  const handleClickLeftImg = () => {
    setScrollIntoView(`nav-item-0-${id}`)
  }
  const handleClickRightImg = () => {
    setScrollIntoView(`nav-item-${navList.length - 1}-${id}`)
  }

  if (!info || !navList || navList.length === 0) {
    return null
  }

  const currentNavItem = navList[currentIndex] || navList[0]
  const children = currentNavItem?.children || []

  return (
    <View
      className={classNames('wgt wgt-content-partition', {
        'wgt__padded': base.padded
      })}
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
          scrollIntoView={scrollIntoView}
          handleScrollToUpper={handleScrollToUpper}
          handleScrollToLower={handleScrollToLower}
          handleClickLeftImg={handleClickLeftImg}
          handleClickRightImg={handleClickRightImg}
        />

        {/* 内容区域 - 显示所有导航项的 children */}
        <View className='wgt-content-partition__content'>
          {children.length > 0 && <HomeWgts wgts={children} />}
        </View>
      </View>
    </View>
  )
}
