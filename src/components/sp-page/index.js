import React, { useEffect, useState, useRef, useImperativeHandle } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro, {
  useDidShow,
  usePageScroll,
  useRouter,
  getCurrentInstance,
  useReady
} from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { SpNavBar, SpFloatMenuItem, SpNote, SpLoading, SpImage } from '@/components'
import { useSyncCallback } from '@/hooks'
import { TABBAR_PATH } from '@/consts'
import {
  classNames,
  styleNames,
  hasNavbar,
  isWeixin,
  isAlipay,
  isGoodsShelves,
  VERSION_IN_PURCHASE,
  validate,
  hex2rgb
} from '@/utils'

import './index.scss'

const initialState = {
  lock: false,
  lockStyle: {},
  pageTitle: '',
  isTabBarPage: true,
  customNavigation: false,
  cusCurrentPage: 0,
  showLeftContainer: false,
  pageBackground: {},
  ipx: false,
  windowHeight: 0,
  gNavbarH: 0,
  gStatusBarHeight: 0,
  pageTheme: {}
}

function SpPage(props, ref) {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)

  const {
    pageTheme,
    lock,
    lockStyle,
    pageTitle,
    isTabBarPage,
    customNavigation,
    cusCurrentPage,
    showLeftContainer,
    pageBackground,
    ipx,
    windowHeight,
    gNavbarH,
    gStatusBarHeight
  } = state
  const {
    className,
    children,
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
    navigateMantle = false, // 自定义导航，开启滚动蒙层
    pageConfig,
    fixedTopContainer = null,
    showNavition = true, //是否展示Navition
    title = '' // 页面导航标题
  } = props
  let { renderTitle } = props
  const wrapRef = useRef(null)
  const scrollTopRef = useRef(0)
  const sys = useSelector((state) => state.sys)
  const [showToTop, setShowToTop] = useState(false)
  const [mantle, setMantle] = useState(false)
  const { colorPrimary, colorMarketing, colorAccent, rgb, appName } = sys

  useReady(() => {
    // 导购货架数据上报
    // const router = $instance.router
    // console.log('sp pages use ready:', $instance)
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
    const { page } = $instance
    const pages = Taro.getCurrentPages()
    const { navigationStyle } = page.config

    let ipx = false
    let _gNavbarH = 0,
      _gStatusBarHeight = 0
    const { screenHeight, windowHeight } = Taro.getSystemInfoSync()
    // showToast(`${screenHeight},${windowHeight}`)
    if (isWeixin || isAlipay) {
      const deviceInfo = Taro.getSystemInfoSync()
      ipx = validate.isIpx(deviceInfo.model)
      const menuButton = Taro.getMenuButtonBoundingClientRect()
      const { statusBarHeight } = Taro.getSystemInfoSync()
      _gNavbarH = Math.floor(
        statusBarHeight + menuButton.height + (menuButton.top - statusBarHeight) * 2
      )
      _gStatusBarHeight = statusBarHeight
    }

    setState((draft) => {
      draft.customNavigation = isWeixin ? navigationStyle === 'custom' : false
      draft.cusCurrentPage = pages.length
      draft.ipx = ipx
      draft.windowHeight = windowHeight
      draft.pageTitle = page?.config?.navigationBarTitleText
      draft.gNavbarH = _gNavbarH
      draft.gStatusBarHeight = _gStatusBarHeight
    })
  }, [])

  useEffect(() => {
    if (pageConfig) {
      const {
        pageBackgroundStyle,
        pageBackgroundColor,
        pageBackgroundImage,
        navigateBackgroundColor
      } = pageConfig
      let _pageBackground = {}
      if (pageBackgroundStyle == '1') {
        _pageBackground = {
          'background-color': pageBackgroundColor
        }
      } else {
        _pageBackground = {
          'background-image': `url(${pageBackgroundImage})`,
          'background-size': '100% 100%',
          'background-position': 'center'
        }
      }

      setState((draft) => {
        draft.pageBackground = _pageBackground
      })

      if (isAlipay) {
        my.setNavigationBar({
          backgroundColor: navigateBackgroundColor
        })
      }
    }
  }, [pageConfig])

  useDidShow(() => {
    const { page, router } = $instance

    //更新主题色
    updatePageTheme(router?.path)
    const fidx = Object.values(TABBAR_PATH).findIndex(
      (v) => v == $instance.router?.path.split('?')[0]
    )
    const isTabBarPage = fidx > -1
    setState((draft) => {
      // draft.pageTitle = pageTitle
      ;(draft.isTabBarPage = isTabBarPage),
        (draft.showLeftContainer = !['/subpages/guide/index', '/pages/index'].includes(
          `/${page?.route}`
        ))
    })

    // 导购货架分包路由，隐藏所有分享入口
    if (router.path.indexOf('/subpages/guide') > -1) {
      Taro.hideShareMenu({
        menus: ['shareAppMessage', 'shareTimeline']
      })
    }
  })

  const updatePageTheme = (res) => {
    // 使用对象来定义路由前缀和对应的主题色
    const prefixes = {
      '/subpages/delivery/': {
        primary: '#4980FF',
        marketing: '#4980FF',
        accent: '#4980FF'
      },
      '/subpages/salesman/': {
        primary: '#4980FF',
        marketing: '#4980FF',
        accent: '#4980FF'
      },
      '/subpages/dianwu/': {
        primary: '#4980FF',
        marketing: '#4980FF',
        accent: '#4980FF'
      }
    }

    // 使用正则表达式匹配路由前缀
    const regex = res.split('/').length >= 4 ? res.match(/(?:[^\/]*\/){2}([^\/]+)(?:\/|$)/)[0] : null
    
    // 检查是否找到匹配项
    const status = regex !== null && prefixes[regex]
    const newPrefixes = prefixes[regex]

    // 查找与给定路由匹配的主题
    const theme = {
      // 如果没有找到匹配项，则使用默认主题
      '--color-primary': status ? newPrefixes.primary : colorPrimary,
      '--color-marketing': status ? newPrefixes.marketing : colorMarketing,
      '--color-accent': status ? newPrefixes.accent : colorAccent,
      '--color-rgb': status ? hex2rgb(newPrefixes.primary).join(',') : rgb,
      '--color-dianwu-primary': '#4980FF'
    }

    // 更新状态
    setState((draft) => {
      draft.pageTheme = theme
    })
  }

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
    }
  }))

  const CustomNavigation = () => {
    const { page, route } = getCurrentInstance()
    let pageStyle = {},
      pageTitleStyle = {}
    let navigationBarTitleText = ''

    if (pageConfig) {
      const {
        navigateBackgroundColor,
        navigateStyle,
        navigateBackgroundImage,
        titleStyle,
        titleColor,
        titleBackgroundImage,
        titlePosition
      } = pageConfig
      // 导航颜色背景
      if (navigateStyle == '1') {
        pageStyle = {
          'background-color': navigateBackgroundColor
        }
      } else {
        pageStyle = {
          'background-image': `url(${navigateBackgroundImage})`,
          'background-size': '100% 100%',
          'background-repeat': 'no-repeat',
          'background-position': 'center'
        }
      }
      // 页面标题
      if (titleStyle == '1') {
        renderTitle = (
          <Text
            style={styleNames({
              color: titleColor
            })}
          >
            {appName}
          </Text>
        )
      } else if (titleStyle == '2') {
        renderTitle = <SpImage src={titleBackgroundImage} height={72} mode='heightFix' />
      }
      pageTitleStyle = {
        'justify-content': titlePosition == 'left' ? 'flex-start' : 'center',
        'color': titleColor
      }
    } else {
      navigationBarTitleText = getCurrentInstance().page?.config?.navigationBarTitleText
    }
    // console.log('zzz', Taro.getCurrentPages())

    return (
      <View
        className={classNames(
          'custom-navigation',
          {
            'mantle': mantle
          },
          navigateTheme
        )}
        style={styleNames({
          height: `${gNavbarH}px`,
          'padding-top': `${gStatusBarHeight}px`,
          ...pageStyle
        })}
      >
        {showLeftContainer && (
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
                      url: isGoodsShelves()
                        ? '/subpages/guide/index'
                        : VERSION_IN_PURCHASE
                        ? '/pages/purchase/index'
                        : '/pages/index'
                    })
                  } else {
                    Taro.navigateBack()
                  }
                }}
              />
            </View>
          </View>
        )}

        {isWeixin && (
          <View className='title-container' style={styleNames(pageTitleStyle)}>
            {renderTitle || title || navigationBarTitleText}
            {/* 吸顶区域 */}
            {fixedTopContainer}
          </View>
        )}
        {showLeftContainer && <View className='right-container'></View>}
      </View>
    )
  }

  return (
    <View
      className={classNames('sp-page', className, {
        'has-navbar': hasNavbar && !isTabBarPage && navbar,
        'has-footer': renderFooter,
        'has-custom-navigation': customNavigation && pageConfig,
        'ipx': ipx
      })}
      style={styleNames({ ...pageTheme, ...lockStyle, ...pageBackground })}
      ref={wrapRef}
    >
      {hasNavbar && !isTabBarPage && navbar && (
        <SpNavBar title={pageTitle} onClickLeftIcon={onClickLeftIcon} />
      )}

      {isDefault && (renderDefault || <SpNote img={defaultImg} title={defaultMsg} isUrl={true} />)}

      {/* 没有页面自动义头部配置样式，自动生成自定义导航 */}
      {customNavigation && CustomNavigation()}

      {loading && <SpLoading />}

      {!isDefault && !loading && (
        <View
          className='sp-page-body'
          style={styleNames({
            'margin-top': `${customNavigation ? gNavbarH : 0}px`
          })}
        >
          {children}
        </View>
      )}

      {/* 置底操作区 */}
      {!isDefault && renderFooter && <View className='sp-page-footer'>{renderFooter}</View>}

      {/* 浮动 */}
      {!isDefault && (
        <View className='float-container'>
          {renderFloat}
          {showToTop && scrollToTopBtn && (
            <SpFloatMenuItem onClick={scrollToTop}>
              <Text className='iconfont icon-zhiding'></Text>
            </SpFloatMenuItem>
          )}
        </View>
      )}
    </View>
  )
}

export default React.forwardRef(SpPage)
