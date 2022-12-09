import React, { useEffect, useState, useRef, useImperativeHandle } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro, { useDidShow, usePageScroll, getCurrentInstance, useReady } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { SpNavBar, SpFloatMenuItem, SpNote, SpLoading, SpImage } from '@/components'
import { TABBAR_PATH } from '@/consts'
import { classNames, styleNames, hasNavbar, isWeixin, isAlipay, isGoodsShelves, entryLaunch } from '@/utils'

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
    pageConfig = null
  } = props
  let { renderTitle } = props
  const wrapRef = useRef(null)
  const scrollTopRef = useRef(0)
  const sys = useSelector((state) => state.sys)
  const [showToTop, setShowToTop] = useState(false)
  const [mantle, setMantle] = useState(false)
  const { colorPrimary, colorMarketing, colorAccent, rgb, appName } = sys

  const pageTheme = {
    '--color-primary': colorPrimary,
    '--color-marketing': colorMarketing,
    '--color-accent': colorAccent,
    '--color-rgb': rgb,
    '--color-dianwu-primary': '#4980FF'
  }

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
    if (isWeixin || isAlipay) {
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

  useEffect(()=>{
    if(pageConfig){
      const {alipayTitleColor} = pageConfig
      if(isAlipay){
          my.setNavigationBar({
            backgroundColor:alipayTitleColor
          })
      }
    }
  },[pageConfig])

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
    if (router.path.indexOf('/subpages/guide') > -1) {
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
  let gNavbarH = 0, gStatusBarHeight = 0
  // let customNavigation = false
  // let cusCurrentPage = 0

  if (isWeixin || isAlipay) {
    const deviceInfo = Taro.getSystemInfoSync()
    // console.log('deviceInfo:', deviceInfo)
    model = deviceInfo.model
    ipx = model.search(/iPhone\s*X|iPhone\s*11|iPhone\s*12|iPhone\s*13|iPhone\s*14|iPhone\s*10/g) > -1

    const menuButton = Taro.getMenuButtonBoundingClientRect()
    const { statusBarHeight } = Taro.getSystemInfoSync()
    gNavbarH = Math.floor(statusBarHeight + menuButton.height + (menuButton.top - statusBarHeight) * 2)
    gStatusBarHeight = statusBarHeight
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
    const { page, route } = getCurrentInstance()
    let pageStyle = {}, pageTitleStyle = {}, showLeftContainer = true
    if (pageConfig) {
      const { navigateBackgroundColor, navigateStyle, navigateBackgroundImage, titleStyle, titleColor, titleBackgroundImage, titlePosition } = pageConfig
      // 导航颜色背景
      if (navigateStyle == '1') {
        pageStyle = {
          'background-color': navigateBackgroundColor
        }
      } else {
        pageStyle = {
          'background-image': `url(${navigateBackgroundImage.url})`,
          'background-size': '100% 100%',
          'background-repeat': 'no-repeat',
          'background-position': 'center'
        }
      }
      // 页面标题
      if (titleStyle == '1') {
        renderTitle = <Text style={styleNames({
          color: titleColor
        })}>{appName}</Text>
      } else {
        renderTitle = <SpImage src={titleBackgroundImage.url} height={72} mode='heightFix' />
      }
      pageTitleStyle = {
        'justify-content': titlePosition == 'left' ? 'flex-start' : 'center'
      }

    }
    showLeftContainer = !['/subpages/guide/index', '/pages/index'].includes(`/${page?.route}`)

    return (
      <View
        className={classNames('custom-navigation', {
          'mantle': mantle,
        }, navigateTheme)}
        style={styleNames({
          height: `${gNavbarH}px`,
          'padding-top': `${gStatusBarHeight}px`,
          ...pageStyle
        })}
      >
        {showLeftContainer && <View className='left-container'>
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
        </View>}

        {isWeixin && <View className='title-container' style={styleNames(pageTitleStyle)}>{pageTitle || renderTitle}</View>}
        {/* <View className='right-container'></View> */}
      </View>
    )
  }

  let pageBackground = {}
  if (pageConfig) {
    const { pageBackgroundStyle, pageBackgroundColor, pageBackgroundImage } = pageConfig

    if (pageBackgroundStyle == '1') {
      pageBackground = {
        'background-color': pageBackgroundColor
      }
    } else {
      pageBackground = {
        'background-image': `url(${pageBackgroundImage.url})`,
        'background-size': '100% 100%',
        'background-position': 'center'
      }
    }
  }

  return (
    <View
      className={classNames('sp-page', className, {
        'has-navbar': hasNavbar && !isTabBarPage && navbar,
        'has-footer': renderFooter,
        'has-custom-navigation': customNavigation,
        'ipx': ipx
      })}
      style={styleNames({ ...pageTheme, ...lockStyle, ...pageBackground })}
      ref={wrapRef}
    >
      {hasNavbar && !isTabBarPage && navbar && (
        <SpNavBar title={pageTitle || _pageTitle} onClickLeftIcon={onClickLeftIcon} />
      )}

      {isDefault && (renderDefault || <SpNote img={defaultImg} title={defaultMsg} />)}

      {customNavigation && CustomNavigation()}

      {/* {loading && <SpNote img='loading.gif' />} */}
      {loading && <SpLoading />}

      {!isDefault && !loading && <View className='sp-page-body' style={styleNames({
        'margin-top': `${(customNavigation && pageConfig) ? gNavbarH : 0}px`
      })}>{children}</View>}

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
