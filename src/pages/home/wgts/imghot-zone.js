/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useMemo } from 'react'
import { View } from '@tarojs/components'
import { SpImage, SpLogin } from '@/components'
import { linkPage, classNames, styleNames, isArray } from '@/utils'
import { needLoginPage, needLoginPageType } from '@/consts'
import Taro from '@tarojs/taro'
import './imghot-zone.scss'

function WgtImgHotZone(props) {
  const { info, id } = props
  const { base, config, data, distributor_id } = info
  const { outerMargin, imgHeight, animation } = base

  // 是否为垂直动画模式
  const isVertical = animation === 'vertical'

  // 外层样式
  const outerStyle = useMemo(() => {
    return {
      paddingTop: Taro.pxTransform(outerMargin?.paddedt),
      paddingBottom: Taro.pxTransform(outerMargin?.paddedb),
      paddingLeft: Taro.pxTransform(outerMargin?.paddedl),
      paddingRight: Taro.pxTransform(outerMargin?.paddedr)
    }
  }, [outerMargin])

  // 容器样式
  const bodyStyle = useMemo(() => {
    const style = {
      ...outerStyle
      // width: config.imgWidth ? Taro.pxTransform(config.imgWidth) : undefined
    }

    // 高度优先级：config.imgHeight > animation模式下的imgHeight > auto
    // if (config.imgHeight) {
    //   style.height = Taro.pxTransform(config.imgHeight)
    // } else if (isVertical) {
    //   style.height = Taro.pxTransform(imgHeight)
    // } else {
    // style.height = 'auto'
    // }
    style.height = 'auto'
    return style
  }, [outerStyle, config.imgWidth, config.imgHeight, isVertical, imgHeight])

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

  return (
    <View
      className={classNames('wgt-imghot-zone', {
        'wgt-imghot-zone__vertical': isVertical,
        'wgt-imghot-zone__horizontal': !isVertical
      })}
      id={`wgt-imghot-zone-${id}`}
    >
      <View className='wgt-imghot-zone__body' style={bodyStyle}>
        <SpImage
          src={config.imgUrl}
          className='wgt-imghot-zone__body-img'
          mode={isVertical ? 'heightFix' : 'widthFix'}
        />
        {isArray(data) && data.map(renderHotZone)}
      </View>
    </View>
  )
}

export default React.memo(WgtImgHotZone)
