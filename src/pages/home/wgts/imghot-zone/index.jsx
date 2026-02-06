/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useMemo } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpImage, SpLogin } from '@/components'
import { linkPage, classNames, styleNames, isArray, getDistributorId } from '@/utils'
import { needLoginPage, needLoginPageType } from '@/consts'
import { getGlobalBaseStyle } from '../helper'
import './index.scss'

function WgtImgHotZone(props) {
  const { info, id } = props

  // 从 params 中获取配置和数据，兼容两种数据结构
  // 1. 新结构：info.params.config, info.params.data, info.params.base
  // 2. 旧结构：info.config, info.data, info.base
  const params = info?.params || info || {}
  const base = params.base || {}
  const config = params.config || {}
  const data = params.data || []

  // 获取 distributor_id
  const distributor_id = useMemo(() => {
    return getDistributorId()
  }, [])

  // 是否为垂直动画模式
  const isVertical = base.animation === 'vertical'

  // 获取外层样式（包含 outerMargin 和背景配置）
  const outerStyle = useMemo(() => {
    const style = getGlobalBaseStyle(base.outerMargin)

    // 纵向布局时，外层容器高度优先使用 base.imgHeight
    if (isVertical && base.imgHeight) {
      style.height = Taro.pxTransform(base.imgHeight)
    }

    return style
  }, [base, isVertical])

  // 容器样式（图片容器）
  const bodyStyle = useMemo(() => {
    const style = {
      // width: config.imgWidth ? Taro.pxTransform(config.imgWidth) : undefined
    }

    // 纵向布局时，优先使用 base.imgHeight
    // if (isVertical && base.imgHeight) {
    //   style.height = Taro.pxTransform(base.imgHeight)
    // } else if (config.imgHeight) {
    //   // 横向布局时，使用 config.imgHeight
    //   style.height = Taro.pxTransform(config.imgHeight)
    // } else {
    //   style.height = 'auto'
    // }
    style.height = 'auto'
    return style
  }, [config.imgWidth, config.imgHeight, isVertical, base.imgHeight])

  // 点击处理
  const handleClickItem = async (item) => {
    await linkPage(item)
  }

  // 获取热区样式
  const getZoneStyle = (item) => {
    return styleNames({
      width: `${item.widthPer * 100}%`,
      height: `${item.heightPer * 100}%`,
      top: `${item.topPer * 100}%`,
      left: `${item.leftPer * 100}%`
    })
  }

  // 判断是否需要登录
  const needLogin = (item) => {
    return needLoginPageType.includes(item.id) || needLoginPage.includes(item.linkPage)
  }

  // 渲染热区
  const renderHotZone = (item, index) => {
    const zoneProps = {
      key: `imghotzone-${index}`,
      className: 'wgt-imghot-zone__body_zone',
      style: getZoneStyle(item)
    }

    const clickHandler = () =>
      handleClickItem({
        ...item,
        distributor_id
      })

    if (needLogin(item)) {
      return (
        <SpLogin key={`imghotzone-login-${index}`} onChange={clickHandler}>
          <View {...zoneProps} />
        </SpLogin>
      )
    }

    return <View {...zoneProps} onClick={clickHandler} />
  }

  if (!info || !config.imgUrl) {
    return null
  }

  return (
    <View
      className={classNames('wgt-imghot-zone', {
        'wgt-imghot-zone__vertical': isVertical,
        'wgt-imghot-zone__horizontal': !isVertical
      })}
      id={`wgt-imghot-zone-${id || ''}`}
      style={styleNames(outerStyle)}
    >
      <View className='wgt-imghot-zone__body' style={styleNames(bodyStyle)}>
        <SpImage
          src={config.imgUrl}
          className='wgt-imghot-zone__body-img'
          mode={isVertical ? 'heightFix' : 'widthFix'}
        />
        {isArray(data) && data.length > 0 && data.map(renderHotZone)}
      </View>
    </View>
  )
}

WgtImgHotZone.options = {
  addGlobalClass: true
}

export default React.memo(WgtImgHotZone)
