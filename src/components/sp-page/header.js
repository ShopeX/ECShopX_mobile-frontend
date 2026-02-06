/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useCallback, memo } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Input, Button } from '@tarojs/components'
import { SpImage } from '@/components'
import { styleNames, classNames, VERSION_STANDARD } from '@/utils'
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
    onNearbyClick,
    onSearchConfirm,
    nearbyText
  } = props

  const value = pageConfig
  const titleStyle = value?.titleStyle
  const showHeaderContent = value && titleStyle !== '0'
  const { shopInfo } = useSelector((state) => state.shop)

  const headerStyle = useCallback(() => {
    const style = {
      height: `${gNavbarH}px`,
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      paddingTop: `${gStatusBarHeight}px`
    }
    if (value?.navigateBackgroundColor) {
      style.backgroundColor = value?.navigateBackgroundColor
    }
    if (value?.navigateBackgroundImage) {
      style.backgroundImage = `url(${value?.navigateBackgroundImage})`
      style.backgroundSize = 'cover'
      style.backgroundPosition = 'center'
    }
    style.transition = 'all 0.15s ease-in'
    return style
  }, [
    value,
    immersive,
    mantle,
    navigateMantle,
    navigateBackgroundColor,
    gNavbarH,
    gStatusBarHeight
  ])

  const containerStyle = useCallback(() => {
    return {
      textAlign: value?.titlePosition,
      color: value?.titleColor
    }
  }, [value])

  const showFunctionArea = value?.pTitleHotSetting?.type && value.pTitleHotSetting.type !== 'none'
  const functionAreaType = value?.pTitleHotSetting?.type || 'none'
  const functionAreaHotzone = value?.pTitleHotSetting?.hotzone || value?.pTitleHotSetting || {}
  const hotzoneImgUrl = functionAreaHotzone?.imgUrl
  const searchButtonStyle = useCallback(() => {
    const searchButtonColor = value?.searchButtonColor
    if (!searchButtonColor) return {}
    return {
      backgroundColor: searchButtonColor.bgColor,
      color: searchButtonColor.textColor
    }
  }, [value?.searchButtonColor])

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
  }, [onNearbyClick])

  const renderNearby = useCallback(() => {
    return (
      <View
        className='title-function nearby-function'
        onClick={handleNearbyClick}
        style={{ color: value?.titleColor }}
      >
        <Text className='nearby-function-text'>
          {VERSION_STANDARD ? shopInfo?.name || '总店' : nearbyText || '选择地区'}
        </Text>
        <Text className='nearby-function-icon iconfont icon-arrowDown' />
      </View>
    )
  }, [handleNearbyClick, nearbyText])

  const renderSearch = useCallback(() => {
    return (
      <View
        className='title-search'
        onClick={() => Taro.navigateTo({ url: '/subpages/item/list' })}
      >
        <View className='search-container'>
          <Text className='iconfont icon-sousuo-01 search-icon' />
          {value?.showSearchButton && (
            <View className='search-button' style={styleNames(searchButtonStyle())}>
              <Text>搜索</Text>
            </View>
          )}
        </View>
      </View>
    )
  }, [titleStyle, value?.showSearchButton, onSearchConfirm, searchButtonStyle])

  const renderTitleText = useCallback(() => {
    const navTitle =
      title ||
      value?.wgtName ||
      getCurrentInstance().page?.config?.navigationBarTitleText ||
      appName
    return (
      <View className='title-text'>
        <Text>{navTitle}</Text>
      </View>
    )
  }, [title, value?.wgtName, appName])

  const renderTitleImage = useCallback(() => {
    if (!value?.titleBackgroundImage) return null
    return (
      <SpImage
        className='title-image'
        src={value.titleBackgroundImage}
        mode='heightFix'
        style={{ height: '64rpx' }}
      />
    )
  }, [value?.titleBackgroundImage])

  const hasNearby = showFunctionArea && functionAreaType === 'nearby'

  return (
    <View className='wgt-page' style={styleNames(headerStyle())} onClick={props.onClickHeader}>
      <View className='wgt-page-content'>
        <View
          className={classNames('header-container', { 'has-nearby': hasNearby })}
          style={showHeaderContent ? styleNames(containerStyle()) : {}}
        >
          {/* 左侧：返回、首页、功能区三者只显示一个 */}
          {showHeaderContent && showFunctionArea ? (
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
          {/* 标题区：搜索 */}
          {showHeaderContent && titleStyle === '3' && renderSearch()}
          {/* 标题区：页面名称 */}
          {showHeaderContent && titleStyle === '1' && renderTitleText()}
          {/* 标题区：图片 */}
          {showHeaderContent && titleStyle === '2' && renderTitleImage()}
        </View>
      </View>
    </View>
  )
})

CustomNavigationHeader.displayName = 'CustomNavigationHeader'

export default CustomNavigationHeader
