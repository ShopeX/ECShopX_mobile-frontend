import React, { useEffect, useState, useRef, useImperativeHandle } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro, { usePageScroll, getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { SpNavBar, SpFloatMenuItem, SpNote } from '@/components'
import { TABBAR_PATH } from '@/consts'
import { classNames, styleNames, hasNavbar } from '@/utils'

import './index.scss'

const initialState = {
  lock: false,
  lockStyle: {}
}

function SpPage (props, ref) {
  const { page, router } = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const { lock, lockStyle } = state
  // debugger
  const {
    className,
    children,
    renderFloat,
    renderFooter,
    scrollToTopBtn = false,
    isDefault = false,
    defaultMsg = '',
    navbar = true,
    onClickLeftIcon = null
  } = props
  const wrapRef = useRef(null)
  const scrollTopRef = useRef(0)
  const sys = useSelector((state) => state.sys)
  const [showToTop, setShowToTop] = useState(false)
  const { colorPrimary, colorMarketing, colorAccent, rgb } = sys
  const pageTheme = {
    '--color-primary': colorPrimary,
    '--color-marketing': colorMarketing,
    '--color-accent': colorAccent,
    '--color-rgb': rgb
  }

  useEffect(() => {
    if (lock) {
      setState((draft) => {
        draft.lockStyle = {
          position: 'fixed',
          top: `-${scrollTopRef.current}px`,
          left: '0px',
          width: '100%',
          bottom: '0px'
        }
      })
    } else {
      setState((draft) => {
        draft.lockStyle = {}
      })
    }
  }, [lock])

  usePageScroll((res) => {
    if (!lock) {
      scrollTopRef.current = res.scrollTop
    }

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

  useImperativeHandle(ref, () => ({
    pageLock: () => {
      setState((draft) => {
        draft.lock = true
      })
    },
    pageUnLock: () => {
      setState((draft) => {
        draft.lock = false
      })

      setTimeout(() => {
        Taro.pageScrollTo({
          scrollTop: scrollTopRef.current,
          duration: 0
        })
      }, 0)

      // console.log('scrollTopRef.current:', scrollTopRef.current)
    }
  }))

  const fidx = Object.values(TABBAR_PATH).findIndex((v) => v == router.path.split('?')[0])
  const isTabBarPage = fidx > -1
  return (
    <View
      className={classNames('sp-page', className, {
        'has-navbar': hasNavbar && !isTabBarPage && navbar,
        'has-footer': renderFooter
      })}
      style={styleNames({ ...pageTheme, ...lockStyle })}
      ref={wrapRef}
    >
      {hasNavbar && !isTabBarPage && <SpNavBar onClickLeftIcon={onClickLeftIcon} />}

      {isDefault && <SpNote img='empty_data.png' title={defaultMsg} />}

      {!isDefault && <View className='sp-page-body'>{children}</View>}

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

export default React.forwardRef(SpPage)
