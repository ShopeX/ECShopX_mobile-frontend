/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useCallback, memo } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { SpImage } from '@/components'
import { styleNames, classNames, VERSION_STANDARD, isWeb } from '@/utils'
import { VERSION_IN_PURCHASE, isGoodsShelves, linkPage } from '@/utils'
import { useSelector } from 'react-redux'

const CustomNavigationHeader = memo((props) => {
  const {
    pageConfig = {},
    title,
    appName,
    immersive,
    navigateMantle,
    navigateBackgroundColor,
    gNavbarH,
    gStatusBarHeight,
    btnReturn,
    btnHome,
    mantle,
    nearbyText,
    navigationRSpace,
    showNavitionLeft,
    statusBarBgColor,
    immersiveScrollRevealBgColor
  } = props

  const titleStyle = pageConfig?.titleStyle
  const resolvedTitleStyle = titleStyle || '1'
  const { shopInfo } = useSelector((state) => state.shop)

  const headerStyle = useCallback(() => {
    const style = {
      height: `${gNavbarH}px`,
      'background-size': '100% 100%',
      'background-repeat': 'no-repeat',
      'background-position': 'center',
      'padding-top': `${gStatusBarHeight}px`
    }
    // 吸顶挂件 > 页面显式控制的导航背景 > 沉浸式滚动 50px 后显示的导航背景 > 默认导航背景
    const headerBg =
      statusBarBgColor ??
      (navigateMantle ? navigateBackgroundColor : null) ??
      immersiveScrollRevealBgColor ??
      pageConfig?.navigateBackgroundColor
    if (headerBg) {
      style['background-color'] = headerBg
    }
    if (pageConfig?.navigateBackgroundImage) {
      style['background-image'] = `url(${pageConfig?.navigateBackgroundImage})`
      style['background-size'] = 'cover'
      style['background-position'] = 'center'
    }
    style.transition = 'all 0.15s ease-in'
    return style
  }, [
    pageConfig,
    immersive,
    mantle,
    navigateMantle,
    navigateBackgroundColor,
    gNavbarH,
    gStatusBarHeight,
    statusBarBgColor,
    immersiveScrollRevealBgColor
  ])

  const containerStyle = useCallback(() => {
    return {
      color: pageConfig?.titleColor
    }
  }, [pageConfig])

  const showFunctionArea =
    pageConfig?.pTitleHotSetting?.type && pageConfig.pTitleHotSetting.type !== 'none'
  const functionAreaType = pageConfig?.pTitleHotSetting?.type || 'none'
  const functionAreaHotzone =
    pageConfig?.pTitleHotSetting?.hotzone || pageConfig?.pTitleHotSetting || {}
  const hotzoneImgUrl = functionAreaHotzone?.imgUrl
  const searchButtonStyle = useCallback(() => {
    const searchButtonColor = pageConfig?.searchButtonColor
    if (!searchButtonColor) return {}
    return {
      'background-color': searchButtonColor.bgColor,
      'color': searchButtonColor.textColor
    }
  }, [pageConfig?.searchButtonColor])

  const handleHomeClick = useCallback(() => {
    Taro.reLaunch({
      url: isGoodsShelves()
        ? '/subpages/guide/index'
        : VERSION_IN_PURCHASE
        ? '/pages/purchase/index'
        : '/pages/index'
    })
  }, [])

  const renderHotZone = useCallback(() => {
    const data = functionAreaHotzone?.data || []
    if (!hotzoneImgUrl) return null
    return (
      <View className='title-function p-title-hot-img'>
        <SpImage className='title-function-image' src={hotzoneImgUrl} mode='aspectFit' />
        {(Array.isArray(data) ? data : []).map((citem) => {
          const hotZoneStyle = {
            position: 'absolute',
            width: `${(citem.widthPer ?? 0) * 100}%`,
            height: `${(citem.heightPer ?? 0) * 100}%`,
            top: `${(citem.topPer ?? 0) * 100}%`,
            left: `${(citem.leftPer ?? 0) * 100}%`,
            zIndex: 1
          }
          if (citem.id === 'customerService') {
            return (
              <Button
                key={citem.id || Math.random()}
                className='img-hotzone_zone opacity-0'
                style={styleNames(hotZoneStyle)}
                openType='contact'
              />
            )
          }
          return (
            <View
              key={citem.id || Math.random()}
              className='img-hotzone_zone'
              style={styleNames(hotZoneStyle)}
              onClick={() => linkPage(citem)}
            />
          )
        })}
      </View>
    )
  }, [hotzoneImgUrl, functionAreaHotzone])

  const handleNearbyClick = useCallback(() => {
    if (VERSION_STANDARD) {
      Taro.navigateTo({ url: '/subpages/store/list' })
    } else {
      Taro.navigateTo({ url: '/subpages/ecshopx/nearly-shop' })
    }
  }, [])

  const renderNearby = useCallback(() => {
    return (
      <View
        className='title-function nearby-function'
        onClick={handleNearbyClick}
        style={{ color: pageConfig?.titleColor }}
      >
        <Text className='nearby-function-text'>
          {VERSION_STANDARD ? shopInfo?.name || '总店' : nearbyText || '选择地区'}
        </Text>
        <Text className='nearby-function-icon iconfont icon-arrowDown' />
      </View>
    )
  }, [handleNearbyClick, nearbyText, shopInfo?.name, pageConfig?.titleColor])

  const renderSearch = useCallback(() => {
    return (
      <View
        className='title-search'
        onClick={() => Taro.navigateTo({ url: '/subpages/item/list' })}
      >
        <View className='search-container'>
          <Text className='iconfont icon-sousuo-01 search-icon' />
          {pageConfig?.showSearchButton && (
            <View className='search-button' style={styleNames(searchButtonStyle())}>
              <Text>搜索</Text>
            </View>
          )}
        </View>
      </View>
    )
  }, [pageConfig?.showSearchButton, searchButtonStyle])

  const renderTitleText = useCallback(() => {
    const navTitle =
      title ||
      pageConfig?.wgtName ||
      getCurrentInstance()?.page?.config?.navigationBarTitleText ||
      appName
    return <Text className='title-text'>{navTitle}</Text>
  }, [title, pageConfig?.wgtName, appName])

  const renderTitleImage = useCallback(() => {
    if (!pageConfig?.titleBackgroundImage) return null
    return (
      <SpImage
        className='title-image'
        src={pageConfig.titleBackgroundImage}
        mode='heightFix'
        style={{ height: '64rpx' }}
      />
    )
  }, [pageConfig?.titleBackgroundImage])

  const hasNearby = showFunctionArea && functionAreaType === 'nearby'

  return (
    <View className='wgt-page' style={styleNames(headerStyle())} onClick={props.onClickHeader}>
      <View className='wgt-page-content'>
        <View
          className={classNames('header-container', { 'has-nearby': hasNearby, 'is-web': isWeb })}
          style={styleNames({
            width: `calc(100% - ${navigationRSpace}px)`,
            ...(containerStyle())
          })}
        >
          {showNavitionLeft && (
            <View
              className={classNames('header-container-left', { 'is-web': isWeb&&showFunctionArea })}
              style={styleNames({
                width:
                  resolvedTitleStyle === '0'
                    ? `100%`
                    : `${navigationRSpace}px`
              })}
            >
              {/* 左侧：返回、首页、功能区三者只显示一个 */}
              {showFunctionArea ? (
                <>
                  {/* 有功能区时只显示功能区（热区图或附近门店） */}
                  {functionAreaType === 'hotzone' && hotzoneImgUrl && renderHotZone()}
                  {functionAreaType === 'nearby' && renderNearby()}
                </>
              ) : (
                <>
                  {btnReturn && (
                    <View className='nav-left-capsule' onClick={() => Taro.navigateBack()}>
                      <SpImage src='fv_back.png' width={36} height={36} />
                    </View>
                  )}
                  {btnHome && !btnReturn && (
                    <View className='nav-left-capsule' onClick={handleHomeClick}>
                      <SpImage src='fv_home.png' width={36} height={36} />
                    </View>
                  )}
                </>
              )}
            </View>
          )}
          <View
            className='title-container'
            style={styleNames({ paddingLeft: !showNavitionLeft ? `20rpx` : `0` })}
          >
            {/* 标题区：搜索 */}
            {resolvedTitleStyle === '3' && renderSearch()}
            {/* 标题区：页面名称 */}
            {resolvedTitleStyle === '1' && renderTitleText()}
            {/* 标题区：图片 */}
            {resolvedTitleStyle === '2' && renderTitleImage()}
          </View>
        </View>
      </View>
    </View>
  )
})

CustomNavigationHeader.displayName = 'CustomNavigationHeader'

export default CustomNavigationHeader
