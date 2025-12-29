/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useCallback, memo } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { SpImage } from '@/components'
import { styleNames } from '@/utils'
import { VERSION_IN_PURCHASE, isGoodsShelves, linkPage } from '@/utils'
import context from '@/hooks/usePageContext'

const CustomNavigationHeader = memo((props) => {
  const {
    pageConfig,
    title,
    appName,
    renderNavigation,
    fixedTopContainer,
    immersive,
    navigateMantle,
    navigateBackgroundColor,
    gNavbarH,
    gStatusBarHeight,
    menuWidth,
    navigationLSpace,
    btnReturn,
    btnHome,
    mantle
  } = props

  // 计算导航栏样式
  const computedNavigationStyle = useCallback(() => {
    const { navigateBackgroundColor: configBgColor, navigateBackgroundImage } = pageConfig || {}
    let style = {
      'height': `${gNavbarH}px`,
      'padding-top': `${gStatusBarHeight}px`,
      'background-size': '100% 100%',
      'background-repeat': 'no-repeat',
      'background-position': 'center'
    }
    if (!immersive || (immersive && mantle) || navigateMantle) {
      style['background-image'] = `url(${navigateBackgroundImage})`
      style['background-color'] = pageConfig?.navigateBackgroundColor
        ? configBgColor
        : navigateBackgroundColor
      style['transition'] = 'all 0.15s ease-in'
    }
    return style
  }, [
    pageConfig,
    immersive,
    navigateMantle,
    navigateBackgroundColor,
    gNavbarH,
    gStatusBarHeight,
    mantle
  ])

  // 渲染热区
  const renderHotZone = useCallback(() => {
    const { imgUrl, data } = pageConfig?.pTitleHotSetting || {}
    if (!imgUrl || !data) return null

    return (
      <View className='p-title-hot-img'>
        <SpImage src={imgUrl} mode='aspectFit' />
        {data.map((citem) => {
          const hotZoneStyle = {
            width: `${citem.widthPer * 100}%`,
            height: `${citem.heightPer * 100}%`,
            top: `${citem.topPer * 100}%`,
            left: `${citem.leftPer * 100}%`
          }

          if (citem.id === 'customerService') {
            return (
              <Button
                key={citem.id}
                className='img-hotzone_zone opacity-0'
                type='button'
                style={styleNames(hotZoneStyle)}
                openType='contact'
              />
            )
          }

          return (
            <View
              key={citem.id}
              className='img-hotzone_zone'
              style={styleNames(hotZoneStyle)}
              onClick={() => linkPage(citem)}
            />
          )
        })}
      </View>
    )
  }, [pageConfig?.pTitleHotSetting])

  // 渲染左侧按钮区域
  const renderLeftBlock = useCallback(() => {
    const handleHomeClick = () => {
      Taro.reLaunch({
        url: isGoodsShelves()
          ? '/subpages/guide/index'
          : VERSION_IN_PURCHASE
          ? '/pages/purchase/index'
          : '/pages/index'
      })
    }

    return (
      <View
        className='custom-navigation__left-block flex items-center'
        style={{
          gap: `${navigationLSpace}px`,
          width: `${menuWidth}px`,
          height: '100%'
        }}
      >
        {btnReturn && (
          <SpImage src='fv_back.png' width={36} height={36} onClick={() => Taro.navigateBack()} />
        )}
        {btnHome && <SpImage src='fv_home.png' width={36} height={36} onClick={handleHomeClick} />}
        {pageConfig?.pTitleHotSetting?.imgUrl && renderHotZone()}
      </View>
    )
  }, [btnReturn, btnHome, menuWidth, navigationLSpace, pageConfig?.pTitleHotSetting, renderHotZone])

  // 渲染标题
  const renderTitle = useCallback(() => {
    let titleContent = null
    let pageTitleStyle = {}
    let navigationBarTitleText = ''

    if (pageConfig) {
      const { titleStyle, titleColor, titleBackgroundImage } = pageConfig

      if (titleStyle === '1') {
        titleContent = (
          <Text style={styleNames({ color: titleColor })}>
            {title || navigationBarTitleText || appName}
          </Text>
        )
      } else if (titleStyle === '2') {
        titleContent = <SpImage src={titleBackgroundImage} height={72} mode='heightFix' />
      } else {
        // 如果 titleStyle 不匹配，使用默认逻辑
        navigationBarTitleText = getCurrentInstance().page?.config?.navigationBarTitleText
        titleContent = title || navigationBarTitleText || appName
      }

      pageTitleStyle = { color: pageConfig?.titleColor }
    } else {
      navigationBarTitleText = getCurrentInstance().page?.config?.navigationBarTitleText
      titleContent = title || navigationBarTitleText || appName
    }

    return (
      <View className='title-container' style={styleNames(pageTitleStyle)}>
        {titleContent}
        {fixedTopContainer}
      </View>
    )
  }, [pageConfig, title, fixedTopContainer, appName])

  // 渲染中间区域
  const renderCenterBlock = useCallback(() => {
    const { windowWidth } = Taro.getWindowInfo()
    const centerWidth = windowWidth - menuWidth * 2 - navigationLSpace * 2
    const pageCenterStyle = {
      width: `${centerWidth}px`,
      ...(pageConfig?.titleColor && {
        color: pageConfig.titleColor,
        position: 'relative'
      })
    }

    return (
      <View
        className='custom-navigation__center-block flex-1 flex items-center justify-items-center'
        style={styleNames(pageCenterStyle)}
      >
        {renderNavigation ? (
          <context.Provider value={{}}>{renderNavigation}</context.Provider>
        ) : (
          renderTitle()
        )}
      </View>
    )
  }, [renderNavigation, pageConfig?.titleColor, menuWidth, navigationLSpace, renderTitle])

  return (
    <View className='custom-navigation' style={styleNames(computedNavigationStyle())}>
      <View className='custom-navigation__content h-full'>
        <View
          className='custom-navigation__body w-full h-full flex box-border'
          style={{
            padding: `0 ${navigationLSpace}px 0 ${navigationLSpace}px`
          }}
        >
          {renderLeftBlock()}
          {renderCenterBlock()}
          <View className='custom-navigation__right-block' style={{ width: `${menuWidth}px` }} />
        </View>
      </View>
    </View>
  )
})

CustomNavigationHeader.displayName = 'CustomNavigationHeader'

export default CustomNavigationHeader
