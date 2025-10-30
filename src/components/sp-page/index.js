import React, { useEffect, useState, useRef, useImperativeHandle, memo, forwardRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro, {
  useRouter,
  useDidShow,
  useDidHide,
  usePageScroll,
  getCurrentInstance,
  useReady
} from '@tarojs/taro'
import { View, Text, ScrollView, Button } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { SpNavBar, SpFloatMenuItem, SpNote, SpLoading, SpImage } from '@/components'
import { useSyncCallback, useWhiteShop, useThemsColor, useLogin } from '@/hooks'
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
  getDistributorId,
  VERSION_IN_PURCHASE,
  isGoodsShelves,
  linkPage,
  VERSION_SHUYUN,
  validate,
  hex2rgb,
  VERSION_STANDARD
} from '@/utils'
import context from '@/hooks/usePageContext'

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
  windowHeight: 0,
  currentPage: false
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
    const [showToTop, setShowToTop] = useState(false)
    const { appName } = sys
    const { themeColor } = useThemsColor()
    const dispatch = useDispatch()
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
            overflowY: 'auto'
          }
        })
      }
    }, [state.lock])

    useEffect(() => {
      instanceRef.current = getCurrentInstance()
      const pages = Taro.getCurrentPages()
      const { navigationStyle } = instanceRef.current?.page?.config

      let _gNavbarH = 0 // 导航栏高度
      let _gStatusBarHeight = 0 // 状态栏高度
      let _menuWidth = 0
      let _navigationLSpace = 0 // 导航栏左间距
      let _navigationRSpace = 0 // 导航栏右间距
      const { screenHeight, windowWidth, windowHeight } = Taro.getWindowInfo()
      const [absolutePath] = router.path.split('?')
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
        draft.height = !props.immersive ? screenHeight - _gNavbarH : screenHeight
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
        height: !props.isSticky
          ? `calc(${screenHeight - _gNavbarH}px - ${_height})`
          : `calc(${screenHeight}px - ${_height})`,
        menuWidth: _menuWidth,
        footerHeight: _height
      })
    }, [])

    useEffect(() => {
      const {
        referrerInfo: { appId: fromAppId }
      } = Taro.getLaunchOptionsSync()

      if (fromAppId && !S.getAuthToken() && VERSION_SHUYUN) {
        //数云：第三方小程序跳来需要免登
        login(fromAppId)
      }
    }, [])

    useDidHide(() => {
      setState((draft) => {
        draft.currentPage = false
      })
    })

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
      const { page, router } = getCurrentInstance()
      const fidx = Object.values(TABBAR_PATH).findIndex((v) => v == router?.path.split('?')[0])
      const isTabBarPage = fidx > -1
      setState((draft) => {
        draft.showLeftContainer = !['/subpages/guide/index', '/pages/index'].includes(
          `/${page?.route}`
        )
        draft.currentPage = true
        draft.isTabBarPage = isTabBarPage
      })

      // 导购货架分包路由，隐藏所有分享入口
      if (router.path.indexOf('/subpages/guide') > -1) {
        Taro.hideShareMenu({
          menus: ['shareAppMessage', 'shareTimeline']
        })
      }
    })

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
      }
    }))

    const computedNavigationStyle = () => {
      const { navigateBackgroundColor, navigateBackgroundImage } = props.pageConfig || {}
      let style = {
        'height': `${state.gNavbarH}px`,
        'padding-top': `${state.gStatusBarHeight}px`,
        'background-size': '100% 100%',
        'background-repeat': 'no-repeat',
        'background-position': 'center'
      }
      if (!props.immersive || (props.immersive && state.mantle) || props.navigateMantle) {
        style['background-image'] = `url(${navigateBackgroundImage})`
        style['background-color'] = props.pageConfig?.navigateBackgroundColor
          ? navigateBackgroundColor
          : props.navigateBackgroundColor
        style['transition'] = 'all 0.15s ease-in'
      }
      return style
    }

    const RenderCustomNavigation = () => {
      const { windowWidth } = Taro.getWindowInfo()
      let { renderTitle } = props
      let pageCenterStyle = {
        'width': windowWidth - state.menuWidth * 2 - state.navigationLSpace * 2 + 'px'
      }
      let pageTitleStyle = {}
      let navigationBarTitleText = ''
      if (props.pageConfig) {
        const { titleStyle, titleColor, titleBackgroundImage, titlePosition } = props.pageConfig
        // 页面标题
        if (titleStyle == '1') {
          renderTitle = (
            <Text
              style={styleNames({
                color: titleColor
              })}
            >
              {props.title || navigationBarTitleText || appName}
            </Text>
          )
        } else if (titleStyle == '2') {
          renderTitle = <SpImage src={titleBackgroundImage} height={72} mode='heightFix' />
        }
        pageCenterStyle = {
          'color': titleColor,
          'position': 'relative'
        }
        pageTitleStyle = {
          'color': props.pageConfig?.titleColor
        }
      } else {
        navigationBarTitleText = getCurrentInstance().page?.config?.navigationBarTitleText
      }

      return (
        <View className='custom-navigation' style={styleNames(computedNavigationStyle())}>
          <View className='custom-navigation__content h-full'>
            <View
              className='custom-navigation__body w-full h-full flex box-border'
              style={{
                padding: `0 ${state.navigationLSpace}px 0 ${state.navigationLSpace}px`
              }}
            >
              <View
                className='custom-navigation__left-block flex items-center'
                style={{
                  gap: `${state.navigationLSpace}px`,
                  width: `${state.menuWidth}px`,
                  height: '100%'
                }}
              >
                {state.btnReturn && (
                  <SpImage
                    src='fv_back.png'
                    width={36}
                    height={36}
                    onClick={() => Taro.navigateBack()}
                  />
                )}
                {state.btnHome && (
                  <SpImage
                    src='fv_home.png'
                    width={36}
                    height={36}
                    onClick={() => {
                      Taro.reLaunch({
                        url: isGoodsShelves()
                          ? '/subpages/guide/index'
                          : VERSION_IN_PURCHASE
                          ? '/pages/purchase/index'
                          : '/pages/index'
                      })
                    }}
                  />
                )}
                {props.pageConfig?.pTitleHotSetting?.imgUrl && (
                  <View className='p-title-hot-img'>
                    <SpImage src={props.pageConfig?.pTitleHotSetting?.imgUrl} mode='aspectFit' />
                    {props.pageConfig?.pTitleHotSetting?.data?.map((citem) => {
                      if (citem.id == 'customerService') {
                        return (
                          <Button
                            key={citem.id}
                            className='img-hotzone_zone opacity-0'
                            type='button'
                            style={styleNames({
                              width: `${citem.widthPer * 100}%`,
                              height: `${citem.heightPer * 100}%`,
                              top: `${citem.topPer * 100}%`,
                              left: `${citem.leftPer * 100}%`
                            })}
                            openType='contact'
                          />
                        )
                      }
                      return (
                        <View
                          key={citem.id}
                          className='img-hotzone_zone'
                          style={styleNames({
                            width: `${citem.widthPer * 100}%`,
                            height: `${citem.heightPer * 100}%`,
                            top: `${citem.topPer * 100}%`,
                            left: `${citem.leftPer * 100}%`
                          })}
                          onClick={() => linkPage(citem)}
                        />
                      )
                    })}
                  </View>
                )}
              </View>

              <View
                className='custom-navigation__center-block flex-1 flex items-center justify-items-center'
                style={styleNames(pageCenterStyle)}
              >
                {props.renderNavigation ? (
                  <context.Provider value={{}}>{props.renderNavigation}</context.Provider>
                ) : (
                  <View className='title-container' style={styleNames(pageTitleStyle)}>
                    {renderTitle || props.title || navigationBarTitleText}
                    {props.fixedTopContainer}
                  </View>
                )}
              </View>
              <View
                className='custom-navigation__right-block'
                style={{ width: `${state.menuWidth}px` }}
              ></View>
            </View>
          </View>
        </View>
      )
    }

    return (
      <View
        className={classNames('sp-page', props.className)}
        style={styleNames({ ...state.pageTheme, ...state.lockStyle, ...state.pageBackground })}
        ref={wrapRef}
        key={lang}
      >
        {hasNavbar && !state.isTabBarPage && props.navbar && (
          <SpNavBar title={state.pageTitle} onClickLeftIcon={props.onClickLeftIcon} />
        )}

        {props.isDefault &&
          (props.renderDefault || <SpNote img={props.defaultImg} title={props.defaultMsg} isUrl />)}

        {/* 没有页面自动义头部配置样式，自动生成自定义导航 */}
        {state.customNavigation && RenderCustomNavigation()}
        {!props.isDefault && (
          <View
            className='sp-page__body'
            style={styleNames({
              // 'height': state.lock ? `${state.bodyHeight}px` : '100%',
              'height': `${state.bodyHeight}px`,
              'padding-top': `${state.customNavigation && !props.immersive ? state.gNavbarH : 0}px`,
              'padding-bottom': props.renderFooter
                ? Taro.pxTransform(
                    props.footerHeight + (isIphoneX() ? DEFAULT_SAFE_AREA_HEIGHT : 0)
                  )
                : 0
            })}
          >
            <context.Provider value={{}}>{props.children}</context.Provider>
          </View>
        )}
        {props.loading && <SpLoading />}
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
            {showToTop && props.scrollToTopBtn && (
              <SpFloatMenuItem onClick={scrollToTop}>
                <Text className='iconfont icon-zhiding'></Text>
              </SpFloatMenuItem>
            )}
          </View>
        )}
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
  navbar: false,
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
  renderFloat: null
}

export default SpPage
