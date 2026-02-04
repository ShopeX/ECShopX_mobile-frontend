/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useState, useCallback } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { SpImage } from '@/components'
import { classNames, styleNames } from '@/utils'
import './index.scss'

/**
 * 位置模块导航栏组件
 * showLeftImg 在组件内部维护，避免父组件 setState 导致整块回滚
 */
export default function LocationModuleNavBar(props) {
  const {
    navList = [],
    currentIndex = 0,
    onNavClick,
    base = {},
    navStyle,
    navItemAreaStyle,
    getNavItemStyle,
    id = '',
    scrollIntoView = '',
    handleScrollToUpper = () => {},
    handleScrollToLower = () => {},
    handleClickLeftImg = () => {},
    handleClickRightImg = () => {}
  } = props

  const [showLeftImg, setShowLeftImg] = useState(false)

  const onScrollToUpper = useCallback(() => {
    setShowLeftImg(false)
    handleScrollToUpper()
  }, [handleScrollToUpper])

  const onScrollToLower = useCallback(() => {
    setShowLeftImg(true)
    handleScrollToLower()
  }, [handleScrollToLower])

  console.log(scrollIntoView, 'scrollIntoView')

  return (
    <View className='wgt-comps__nav' id={id} style={styleNames(navStyle)}>
      {/* 导航项区域 */}
      <View className='wgt-comps__nav-area' style={styleNames(navItemAreaStyle)}>
        {/* 左侧/顶部图片 */}
        {base.leftimgUrl && (
          <SpImage
            onClick={() => handleClickLeftImg()}
            src={base.leftimgUrl}
            mode='heightFix'
            className='wgt-comps__nav-left-img'
            style={{ display: showLeftImg ? 'block' : 'none' }}
          />
        )}

        {/* 导航项列表 */}
        <ScrollView
          className='wgt-comps__nav-scroll'
          scrollX
          scrollIntoView={scrollIntoView}
          onScrollToUpper={onScrollToUpper}
          onScrollToLower={onScrollToLower}
          bounces={false}
          showScrollbar={false}
          scrollWithAnimation
          enhanced
          scrollAnchoring
        >
          <View className='wgt-comps__nav-list'>
            {navList.map((item, index) => {
              const isActive = index === currentIndex
              return (
                <View
                  key={`nav-item-${index}`}
                  className={classNames(`wgt-comps__nav-item`, {
                    [`wgt-comps__nav-item--active`]: isActive
                  })}
                  id={`nav-item-${index}-${id}`}
                  style={styleNames(getNavItemStyle(item, isActive))}
                  onClick={() => onNavClick(index)}
                >
                  {item.navitemtype === 'image' && item.imgUrl ? (
                    <SpImage
                      src={isActive && item.navitemactiveimg ? item.navitemactiveimg : item.imgUrl}
                      className='wgt-comps__nav-item-img'
                      mode='heightFix'
                    />
                  ) : (
                    <Text className='wgt-comps__nav-item-text'>{item.navItemName}</Text>
                  )}
                  {base.navitemborder && isActive && (
                    <View
                      className='wgt-comps__nav-item-border'
                      style={{ backgroundColor: `${base.navitembordercolor || 'transparent'}` }}
                    />
                  )}
                </View>
              )
            })}
          </View>
        </ScrollView>

        {/* 右侧/底部图片 */}
        {base.rightimgUrl && (
          <SpImage
            onClick={() => handleClickRightImg()}
            src={base.rightimgUrl}
            mode='heightFix'
            className='wgt-comps__nav-right-img'
            style={{ display: !showLeftImg ? 'block' : 'none' }}
          />
        )}
      </View>
    </View>
  )
}
