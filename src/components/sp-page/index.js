import React, { useEffect, useState, useRef, useImperativeHandle } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro, { useDidShow, usePageScroll, getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { SpNavBar, SpFloatMenuItem, SpNote } from '@/components'
import { TABBAR_PATH } from '@/consts'
import { classNames, styleNames, hasNavbar, isWeixin } from '@/utils'

import './index.scss'

const initialState = {
  lock: false,
  lockStyle: {},
  pageTitle: '',
  isTabBarPage: true
}

function SpPage(props, ref) {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const { lock, lockStyle, pageTitle, isTabBarPage } = state
  // debugger
  const {
    className,
    children,
    renderFloat,
    renderFooter,
    scrollToTopBtn = false,
    isDefault = false,
    loading = false,
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

  useDidShow(() => {
    const { page } = getCurrentInstance()
    const pageTitle = page?.config?.navigationBarTitleText

    const fidx = Object.values(TABBAR_PATH).findIndex(
      (v) => v == $instance.router?.path.split('?')[0]
    )
    const isTabBarPage = fidx > -1
    setState((draft) => {
      draft.pageTitle = pageTitle
      draft.isTabBarPage = isTabBarPage
    })
  })

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

  let model = ''
  let ipx = false

  if (isWeixin) {
    const deviceInfo = Taro.getSystemInfoSync()
    console.log('deviceInfo:', deviceInfo)
    model = deviceInfo.model
    ipx = model.search(/iPhone X|iPhone 11|iPhone 12|iPhone 13/g) > -1
  }

  const { page } = getCurrentInstance()
  const _pageTitle = page?.config?.navigationBarTitleText

  return (
    <View
      className={classNames('sp-page', className, {
        'has-navbar': hasNavbar && !isTabBarPage && navbar,
        'has-footer': renderFooter,
        'ipx': ipx
      })}
      style={styleNames({ ...pageTheme, ...lockStyle })}
      ref={wrapRef}
    >
      {hasNavbar && !isTabBarPage && navbar && (
        <SpNavBar title={pageTitle || _pageTitle} onClickLeftIcon={onClickLeftIcon} />
      )}

      {isDefault && <SpNote img='empty_data.png' title={defaultMsg} />}

      {/* {loading && <SpNote img='loading.gif' />} */}

      {!isDefault && <View className='sp-page-body'>{children}</View>}

      {/* 置底操作区 */}
      {renderFooter && <View className='sp-page-footer'>{renderFooter}</View>}

      {/* 浮动 */}
      <View className='float-container'>
        {renderFloat}
        {showToTop && scrollToTopBtn && (
          <SpFloatMenuItem onClick={scrollToTop}>
            <Text className='iconfont icon-arrow-up'></Text>
          </SpFloatMenuItem>
        )}
      </View>
    </View>
  )
}

export default React.forwardRef(SpPage)
