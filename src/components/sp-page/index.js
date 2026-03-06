/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  memo,
  forwardRef,
  useCallback
} from 'react'
import { useSelector } from 'react-redux'
import Taro, {
  useRouter,
  useDidShow,
  useDidHide,
  usePageScroll,
  getCurrentInstance
} from '@tarojs/taro'
import { View, Text, Button, Image } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { SpNavBar, SpFloatMenuItem, SpNote, SpLoading, SpImage, SpPoweredBy } from '@/components'
import { useThemsColor, useLogin } from '@/hooks'
import CookieConsent from '@/components/cookie-consent'
import {
  TAB_PAGES,
  TABBAR_PATH,
  DEFAULT_NAVIGATE_HEIGHT,
  DEFAULT_FOOTER_HEIGHT,
  DEFAULT_SAFE_AREA_HEIGHT
} from '@/consts'
import {
  classNames,
  styleNames,
  hasNavbar,
  isWeixin,
  isAlipay,
  isIphoneX,
  VERSION_IN_PURCHASE,
  isGoodsShelves,
  linkPage,
  VERSION_SHUYUN
} from '@/utils'
import context from '@/hooks/usePageContext'
import CustomNavigationHeader from './header'
import './index.scss'

const initialState = {
  bodyHeight: 0,
  btnReturn: false,
  btnHome: false,
  customNavigation: false,
  cusCurrentPage: 0,
  gNavbarH: 0,
  gStatusBarHeight: 0,
  height: 0,
  isTabBarPage: true,
  ipx: false,
  lock: false,
  lockStyle: {},
  menuWidth: 0,
  mantle: false,
  navigationLSpace: 0,
  navigationRSpace: 0,
  pageTitle: '',
  pageBackground: {},
  pageTheme: {},
  showLeftContainer: false,
  windowHeight: 0
}

const SpPage = memo(
  forwardRef((props, ref) => {
    const router = useRouter()
    const instanceRef = useRef(null)
    const [state, setState] = useImmer(initialState)
    const wrapRef = useRef(null)
    const scrollTopRef = useRef(0)
    const sys = useSelector((state) => state.sys)
    const { lang } = useSelector((state) => state.user)
    const isRTL = lang === 'ar'
    const [showToTop, setShowToTop] = useState(false)
    const [isPageVisible, setIsPageVisible] = useState(true) // 页面是否显示
    const { appName } = sys
    const { themeColor } = useThemsColor()
    const { login } = useLogin()

    useEffect(() => {
      if (state.lock) {
        // 保存当前滚动位置
        const currentScrollTop = scrollTopRef.current || 0

        setState((draft) => {
          draft.lockStyle = {
            overflow: 'hidden'
          }
        })

        // 设置滚动位置，防止回到顶部
        setTimeout(() => {
          Taro.pageScrollTo({
            scrollTop: currentScrollTop,
            duration: 0
          })
        }, 0)
      } else {
        setState((draft) => {
          draft.lockStyle = {
            'overflow-y': 'auto'
          }
        })
      }
    }, [state.lock])

    useEffect(() => {
      if (!isPageVisible) return
      instanceRef.current = getCurrentInstance()
      const pages = Taro.getCurrentPages()
      const navigationStyle = instanceRef.current?.page?.config?.navigationStyle

      let _gNavbarH = 0 // 导航栏高度
      let _gStatusBarHeight = 0 // 状态栏高度
      let _menuWidth = 0
      let _navigationLSpace = 0 // 导航栏左间距
      let _navigationRSpace = 0 // 导航栏右间距
      const { screenHeight, windowWidth, windowHeight } = Taro.getWindowInfo()
      const [absolutePath] = router?.path.split('?')
      const custom_navigation = isWeixin ? navigationStyle === 'custom' : false
      const _btnReturn = pages.length > 1 && !TAB_PAGES.includes(absolutePath)
      const _btnHome = pages.length == 1 && !TAB_PAGES.includes(absolutePath)
      if (isWeixin || isAlipay) {
        const menuButton = Taro.getMenuButtonBoundingClientRect()
        _gNavbarH = Math.floor(menuButton.bottom + (props.navigateHeight - menuButton.height) / 2) // 导航栏高度
        _gStatusBarHeight = Math.floor(
          menuButton.top - (props.navigateHeight - menuButton.height) / 2
        ) // 状态栏高度
        _menuWidth = menuButton.width
        _navigationLSpace = windowWidth - menuButton.right
        _navigationRSpace = menuButton.width + (windowWidth - menuButton.right)
      }
      setState((draft) => {
        draft.bodyHeight = windowHeight
        draft.btnReturn = _btnReturn
        draft.btnHome = _btnHome && props.btnHomeEnable
        draft.customNavigation = custom_navigation
        draft.cusCurrentPage = pages.length
        draft.ipx = isIphoneX()
        draft.pageTitle = props.title || instanceRef.current?.page?.config?.navigationBarTitleText
        draft.gNavbarH = _gNavbarH
        draft.gStatusBarHeight = _gStatusBarHeight
        draft.height =
          !props.immersive && custom_navigation ? screenHeight - _gNavbarH : screenHeight
        draft.menuWidth = _menuWidth
        draft.navigationLSpace = _navigationLSpace
        draft.navigationRSpace = _navigationRSpace
        draft.pageTheme = themeColor()
      })

      const _height = props.renderFooter
        ? Taro.pxTransform(props.footerHeight + (isIphoneX() ? DEFAULT_SAFE_AREA_HEIGHT : 0))
        : 0

      props.onReady({
        gNavbarH: _gNavbarH,
        height: !props.immersive
          ? `calc(${windowHeight - _gNavbarH}px - ${_height})`
          : `calc(${windowHeight}px - ${_height})`,
        menuWidth: _menuWidth,
        footerHeight: _height
      })
    }, [props.immersive, isPageVisible])

    useEffect(() => {
      const {
        referrerInfo: { appId: fromAppId }
      } = Taro.getLaunchOptionsSync()

      if (fromAppId && !S.getAuthToken() && VERSION_SHUYUN) {
        //数云：第三方小程序跳来需要免登
        login(fromAppId)
      }
    }, [])

    useEffect(() => {
      if (props.pageConfig) {
        const { pageBackgroundColor, pageBackgroundImage, navigateBackgroundColor } =
          props.pageConfig
        let _pageBackground = {
          'background-image': `url(${pageBackgroundImage})`,
          'background-color': pageBackgroundColor,
          'background-size': '100% 100%',
          'background-position': 'center'
        }

        setState((draft) => {
          draft.pageBackground = _pageBackground
        })

        if (isAlipay) {
          Taro.setNavigationBar &&
            Taro.setNavigationBar({
              backgroundColor: navigateBackgroundColor
            })
        }
      }
    }, [props.pageConfig])

    useDidShow(() => {
      setIsPageVisible(true) // 页面显示时设置为true
      const { page, router } = getCurrentInstance()
      const fidx = Object.values(TABBAR_PATH()).findIndex((v) => v == router?.path.split('?')[0])
      const isTabBarPage = fidx > -1
      setState((draft) => {
        draft.showLeftContainer = !['/subpages/guide/index', '/pages/index'].includes(
          `/${page?.route}`
        )
        draft.isTabBarPage = isTabBarPage
      })

      // 导购货架分包路由，隐藏所有分享入口
      if (router?.path.indexOf('/subpages/guide') > -1) {
        Taro.hideShareMenu({
          menus: ['shareAppMessage', 'shareTimeline']
        })
      }
    })

    useDidHide(() => {
      console.log('useDidHide🚀')
      setIsPageVisible(false) // 页面隐藏时设置为false
    })

    // 回到顶部
    const scrollToTop = useCallback(() => {
      props.onScrollToTop && props.onScrollToTop()
      Taro.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    }, [])

    usePageScroll((res) => {
      if (!state.lock) {
        scrollTopRef.current = res.scrollTop
      }
      if (res.scrollTop > 20) {
        setState((draft) => {
          draft.mantle = true
        })
      } else {
        setState((draft) => {
          draft.mantle = false
        })
      }

      if (res.scrollTop > 300) {
        setShowToTop(true)
      } else {
        setShowToTop(false)
      }
      props.onScroll && props.onScroll(res)
    })

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
      },
      // 当页面单独处理滚动事件时，调用此函数
      handlePageScroll: (res) => {
        if (res.scrollTop > 20) {
          setState((draft) => {
            draft.mantle = true
          })
        } else {
          setState((draft) => {
            draft.mantle = false
          })
        }
        if (res.scrollTop > 300) {
          setShowToTop(true)
        } else {
          setShowToTop(false)
        }
      }
    }))

    return (
      <View
        className={classNames('sp-page', props.className, { 'rtl-layout': isRTL })}
        style={styleNames({ ...state.pageTheme, ...state.pageBackground, ...state.lockStyle })}
        ref={wrapRef}
        key={lang}
      >
        {/* 没有页面自动义头部配置样式，自动生成自定义导航 */}
        {state.customNavigation && (
          <CustomNavigationHeader
            pageConfig={props.pageConfig}
            title={props.title}
            appName={appName}
            renderNavigation={props.renderNavigation}
            fixedTopContainer={props.fixedTopContainer}
            immersive={props.immersive}
            navigateMantle={props.navigateMantle}
            navigateBackgroundColor={props.navigateBackgroundColor}
            gNavbarH={state.gNavbarH}
            gStatusBarHeight={state.gStatusBarHeight}
            menuWidth={state.menuWidth}
            navigationLSpace={state.navigationLSpace}
            btnReturn={state.btnReturn}
            btnHome={state.btnHome}
            mantle={state.mantle}
            nearbyText={props.nearbyText}
            onSearchConfirm={props.onSearchConfirm}
            navigationRSpace={state.navigationRSpace}
            showNavitionLeft={props.showNavitionLeft}
          />
        )}
        {props.isDefault &&
          (props.renderDefault || <SpNote img={props.defaultImg} title={props.defaultMsg} isUrl />)}

        {!props.isDefault && (
          <View
            className='sp-page__body'
            style={styleNames({
              'padding-top': `${state.customNavigation ? state.gNavbarH : 0}px`,
              'padding-bottom': props.renderFooter
                ? Taro.pxTransform(
                    props.footerHeight + (isIphoneX() ? DEFAULT_SAFE_AREA_HEIGHT : 0)
                  )
                : 0
            })}
          >
            <View className='sp-page__body-content'>
              {!props.loading && (
                <View className='sp-page__body-children'>
                  <context.Provider value={{}}>{props.children}</context.Provider>
                </View>
              )}
              {props.loading && (
                <View className='sp-page__loading'>
                  <SpLoading />
                </View>
              )}
              {/* If you remove or alter Shopex brand identifiers, you must obtain a branding removal license from Shopex.  Contact us at:  http://www.shopex.cn to purchase a branding removal license. */}
              {props.showpoweredBy && (
                <View className='sp-page__powered-by w-full'>
                  <SpPoweredBy />
                </View>
              )}
            </View>
          </View>
        )}
        {props.renderFooter && (
          <View
            key={lang}
            className='sp-page__footer'
            style={styleNames({
              'height': props.renderFooter ? `${Taro.pxTransform(props.footerHeight)}` : 0,
              'padding-bottom': `${isIphoneX() ? Taro.pxTransform(DEFAULT_SAFE_AREA_HEIGHT) : 0}`
            })}
          >
            <context.Provider value={{}}>{props.renderFooter}</context.Provider>
          </View>
        )}
        {/* 浮动 */}
        {!props.isDefault && (
          <View className='float-container'>
            {props.renderFloat}
            {props.scrollToTopBtn && showToTop && (
              <SpFloatMenuItem onClick={scrollToTop}>
                <Text className='iconfont icon-zhiding'></Text>
              </SpFloatMenuItem>
            )}
          </View>
        )}
        <CookieConsent />
      </View>
    )
  })
)

SpPage.defaultProps = {
  onReady: () => {},
  btnHomeEnable: true,
  className: '',
  children: null,
  defaultMsg: '',
  defaultImg: 'empty_data.png',
  footerHeight: DEFAULT_FOOTER_HEIGHT,
  fixedTopContainer: null,
  isDefault: false,
  isSticky: false, // 是否粘性吸顶
  immersive: false, // 沉浸式导航
  navigateMantle: false, // 页面向下滚动，沉浸式导航开启蒙层背景色
  navigationLeftBlockWidthFull: false,
  navigateBackgroundColor: '#fff', // 导航背景色
  navigateHeight: DEFAULT_NAVIGATE_HEIGHT,
  onClickLeftIcon: null,
  pageConfig: null,
  renderDefault: null,
  renderNavigation: null,
  scrollToTopBtn: false,
  showNavitionLeft: true,
  title: '', // 页面导航标题
  renderFooter: null,
  renderFloat: null,
  showpoweredBy: true,
  onScrollToTop: () => {},
  nearbyText: '',
  onSearchConfirm: null
}

export default SpPage
