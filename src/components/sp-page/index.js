import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro, { usePageScroll, getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpNavBar, SpFloatMenuItem } from '@/components'
import { TABBAR_PATH } from '@/consts'
import { classNames, styleNames, hasNavbar } from '@/utils'

import './index.scss'

function SpPage (props) {
  console.log(getCurrentInstance())
  const { page, router } = getCurrentInstance()
  // debugger
  const {
    className,
    children,
    renderFloat,
    renderFooter,
    scrollToTopBtn = false,
    needNavbar = true
  } = props
  const sys = useSelector((state) => state.sys)
  const [showToTop, setShowToTop] = useState(false)
  const { colorPrimary, colorMarketing, colorAccent, rgb } = sys
  const pageTheme = {
    '--color-primary': colorPrimary,
    '--color-marketing': colorMarketing,
    '--color-accent': colorAccent,
    '--color-rgb': rgb
  }

  usePageScroll((res) => {
    // console.log("res.scrollTop:", res.scrollTop);
    if (res.scrollTop > 300) {
      setShowToTop(true)
    } else {
      setShowToTop(false)
    }
  })

  const scrollToTop = () => {
    Taro.pageScrollTo({
      scrollTop: 0
    })
  }
  const fidx = Object.values(TABBAR_PATH).findIndex((v) => v == router.path.split('?')[0])
  const isTabBarPage = fidx > -1
  return (
    <View
      className={classNames('sp-page', className, {
        'has-navbar': hasNavbar && !isTabBarPage && needNavbar,
        'has-footer': renderFooter
      })}
      style={styleNames(pageTheme)}
    >
      {hasNavbar && !isTabBarPage && needNavbar && <SpNavBar />}
      <View className='sp-page-body'>{children}</View>

      {/* 置底操作区 */}
      {renderFooter && <View className='sp-page-footer'>{renderFooter}</View>}

      {/* 浮动 */}
      <View className='float-container'>
        {showToTop && scrollToTopBtn && (
          <SpFloatMenuItem onClick={scrollToTop}>
            <Text className='iconfont icon-arrow-up'></Text>
          </SpFloatMenuItem>
        )}
        {renderFloat}
      </View>
    </View>
  )
}

export default SpPage
