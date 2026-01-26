/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { SpImage } from '@/components'
import { classNames, styleNames } from '@/utils'
import './index.scss'

/**
 * 位置模块导航栏组件
 * @param {Object} props
 * @param {Array} props.navList - 导航项列表
 * @param {number} props.currentIndex - 当前选中的导航项索引
 * @param {Function} props.onNavClick - 导航项点击回调
 * @param {Object} props.base - 配置对象
 * @param {Object} props.navStyle - 导航栏样式
 * @param {Object} props.navItemAreaStyle - 导航项区域样式
 * @param {Function} props.getNavItemStyle - 获取导航项样式的函数
 * @param {string} props.classNamePrefix - CSS类名前缀，如 'wgt-location-module'
 * @param {string} props.animate - 动画方向：'horizontal' | 'vertical'
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
    classNamePrefix = 'wgt-location-module',
    animate = 'horizontal'
  } = props

  const isVertical = animate === 'vertical'

  return (
    <View className='wgt-comps__nav' style={styleNames(navStyle)}>
      {/* 导航项区域 */}
      <View className='wgt-comps__nav-area' style={styleNames(navItemAreaStyle)}>
        {/* 左侧/顶部图片 */}
        {base.leftimgUrl && (
          <View className={`wgt-comps__nav-${isVertical ? 'top' : 'left'}-img`}>
            <SpImage src={base.leftimgUrl} />
          </View>
        )}

        {/* 导航项列表 */}
        <ScrollView 
          className='wgt-comps__nav-scroll'
          scrollX={!isVertical}
          scrollY={isVertical}
          scrollWithAnimation
        >
          <View 
            className='wgt-comps__nav-list' 
            style={{
              gap: base.navitemmargin?.paddedlr 
                ? Taro.pxTransform(base.navitemmargin.paddedlr) 
                : base.navitemmargin 
                ? Taro.pxTransform(base.navitemmargin) 
                : 0
            }}
          >
            {navList.map((item, index) => {
              const isActive = index === currentIndex
              return (
                <View
                  key={`nav-item-${index}`}
                  className={classNames(`wgt-comps__nav-item`, {
                    [`${classNamePrefix}__nav-item--active`]: isActive
                  })}
                  style={styleNames(getNavItemStyle(item, isActive))}
                  onClick={() => onNavClick(index)}
                >
                  {item.navitemtype === 'image' && item.imgUrl ? (
                    <SpImage 
                      src={isActive && item.navitemactiveimg ? item.navitemactiveimg : item.imgUrl}
                      className='wgt-comps__nav-item-img'
                    />
                  ) : (
                    <Text className='wgt-comps__nav-item-text'>
                      {item.navItemName}
                    </Text>
                  )}
                </View>
              )
            })}
          </View>
        </ScrollView>

        {/* 右侧/底部图片 */}
        {base.rightimgUrl && (
          <View className={`wgt-comps__nav-${isVertical ? 'bottom' : 'right'}-img`}>
            <SpImage src={base.rightimgUrl} />
          </View>
        )}
      </View>
    </View>
  )
}
