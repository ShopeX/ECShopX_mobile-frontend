import React, { useEffect, useState, useRef, useImperativeHandle } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro, { useDidShow, usePageScroll, getCurrentInstance, useReady } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { SpNavBar, SpFloatMenuItem, SpNote, SpLoading } from '@/components'
import { TABBAR_PATH } from '@/consts'
import { classNames, styleNames, hasNavbar, isWeixin, isGoodsShelves, entryLaunch } from '@/utils'

import './index.scss'

const initialState = {
  lock: false,
  lockStyle: {},
  pageTitle: '',
  isTabBarPage: true,
  customNavigation: false,
  cusCurrentPage: 0
}

function SpPage(props, ref) {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const { lock, lockStyle, pageTitle, isTabBarPage, customNavigation, cusCurrentPage } = state
  // debugger
  const {
    className,
    children,
    renderTitle,
    renderFloat,
    renderFooter,
    scrollToTopBtn = false,
    isDefault = false,
    defaultImg = 'empty_data.png',
    renderDefault,
    loading = false,
    defaultMsg = '',
    navbar = true,
    onClickLeftIcon = null,
    navigateTheme = 'light',
    navigateMantle = false // 自定义导航，开启滚动蒙层
  } = props
  const wrapRef = useRef(null)
  const scrollTopRef = useRef(0)
  const sys = useSelector((state) => state.sys)
  const [showToTop, setShowToTop] = useState(false)
  const [mantle, setMantle] = useState(false)
  const { colorPrimary, colorMarketing, colorAccent, rgb } = sys
  const pageTheme = {
    '--color-primary': colorPrimary,
    '--color-marketing': colorMarketing,
    '--color-accent': colorAccent,
    '--color-rgb': rgb
  }

  useReady(() => {
    // 导购货架数据上报
    const router = $instance.router
    entryLaunch.postGuideTask(router)
    console.log('sp pages use ready:', $instance)
  })

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

  useEffect(() => {
    if (isWeixin) {
      const pages = Taro.getCurrentPages()
      const { navigationStyle } = page.config
      // customNavigation = navigationStyle === 'custom'
      // cusCurrentPage = pages.length
      setState(draft => {
        draft.customNavigation = navigationStyle === 'custom'
        draft.cusCurrentPage = pages.length
      })
    }
  }, [])

  useDidShow(() => {
    const { page, router } = getCurrentInstance()
    const pageTitle = page?.config?.navigationBarTitleText

    const fidx = Object.values(TABBAR_PATH).findIndex(
      (v) => v == $instance.router?.path.split('?')[0]
    )
    const isTabBarPage = fidx > -1
    setState((draft) => {
      draft.pageTitle = pageTitle
      draft.isTabBarPage = isTabBarPage
    })

    // 导购货架分包路由，隐藏所有分享入口
    if(router.path.indexOf('/subpages/guide') > -1) {
      Taro.hideShareMenu({
        menus: ["shareAppMessage", "shareTimeline"]
      });
    }
  })

  usePageScroll((res) => {
    if (!lock) {
      scrollTopRef.current = res.scrollTop
    }

    if (navigateMantle && res.scrollTop > 0) {
      setMantle(true)
    } else {
      setMantle(false)
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
  // let customNavigation = false
  // let cusCurrentPage = 0

  if (isWeixin) {
    const deviceInfo = Taro.getSystemInfoSync()
    // console.log('deviceInfo:', deviceInfo)
    model = deviceInfo.model
    ipx = model.search(/iPhone X|iPhone 11|iPhone 12|iPhone 13/g) > -1
  }

  const { page, route } = getCurrentInstance()
  const _pageTitle = page?.config?.navigationBarTitleText

  // if (isWeixin) {
  //   const pages = Taro.getCurrentPages()
  //   // const currentPage = pages[pages.length - 1]
  //   const { navigationStyle } = page.config
  //   customNavigation = navigationStyle === 'custom'
  //   cusCurrentPage = pages.length
  // }

  const CustomNavigation = () => {
    const menuButton = Taro.getMenuButtonBoundingClientRect()
    const { statusBarHeight } = Taro.getSystemInfoSync()

    // console.log('MenuButton:', menuButton, statusBarHeight)
    // console.log(cusCurrentPage)

    const navbarH = statusBarHeight + menuButton.height + (menuButton.top - statusBarHeight) * 2

    return (
      <View
        className={classNames('custom-navigation', {
          'mantle': mantle,
        }, navigateTheme)}
        style={styleNames({
          height: `${navbarH}px`,
          paddingTop: `${statusBarHeight}px`
        })}
      >
        <View className='left-container'>
          <View className='icon-wrap'>
            <Text
              className={classNames('iconfont', {
                'icon-home1': cusCurrentPage == 1,
                'icon-fanhui': cusCurrentPage != 1
              })}
              onClick={() => {
                if (cusCurrentPage == 1) {
                  Taro.redirectTo({
                    url: isGoodsShelves() ? '/subpages/guide/index' : '/pages/index'
                  })
                } else {
                  Taro.navigateBack()
                }
              }}
            />
          </View>
        </View>
        <View className='title-container'>{pageTitle || renderTitle}</View>
        <View className='right-container'></View>
      </View>
    )
  }

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

      {isDefault && (renderDefault || <SpNote img={defaultImg} title={defaultMsg} />)}

      {customNavigation && CustomNavigation()}

      {/* {loading && <SpNote img='loading.gif' />} */}
      {loading && <SpLoading />}

      {!isDefault && !loading && <View className='sp-page-body'>{children}</View>}

      {/* 置底操作区 */}
      {!isDefault && renderFooter && <View className='sp-page-footer'>{renderFooter}</View>}

      {/* 浮动 */}
      {!isDefault && (
        <View className='float-container'>
          {renderFloat}
          {showToTop && scrollToTopBtn && (
            <SpFloatMenuItem onClick={scrollToTop}>
              <Text className='iconfont icon-arrow-up'></Text>
            </SpFloatMenuItem>
          )}
        </View>
      )}
    </View>
  )
}

export default React.forwardRef(SpPage)
