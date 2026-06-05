/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useMemo } from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { SpImage } from '@/components'
import { $t, useTranslation } from '@/i18n'
import { isWeixin, isAlipay } from '@/utils'
import './comp-purchase-nav.scss'

/**
 * 与 `src/components/sp-page/index.js` 一致：右侧系统胶囊占位宽度（px）。
 * `menuButton.width + (windowWidth - menuButton.right)`，在 `right = left + width` 时等价于 `windowWidth - menuButton.left`。
 * `SpPage` 的 `renderNavigation` 会传入同名 prop；未就绪时在此按同式兜底。
 */
function CompPurchaseNav(props) {
  useTranslation()
  const {
    title,
    btnReturn = false,
    btnHome = false,
    onBack = () => {},
    onHome = () => {},
    navigationRSpace: navigationRSpaceFromPage
  } = props
  const showHome = btnHome || btnReturn
  const displayTitle =
    title !== undefined && title !== null && title !== '' ? title : $t('c2581d4c.6fb7d0')

  const navigationRSpace = useMemo(() => {
    if (typeof navigationRSpaceFromPage === 'number' && navigationRSpaceFromPage > 0) {
      return navigationRSpaceFromPage
    }
    if (!(isWeixin || isAlipay)) {
      return 0
    }
    try {
      const { windowWidth } = Taro.getWindowInfo()
      const menuButton = Taro.getMenuButtonBoundingClientRect()
      if (!menuButton || typeof menuButton.width !== 'number' || menuButton.width <= 0) {
        return 0
      }
      return menuButton.width + (windowWidth - menuButton.right)
    } catch {
      return 0
    }
  }, [navigationRSpaceFromPage, isWeixin, isAlipay])

  return (
    <View className='comp-purchase-nav' style={{ paddingRight: `${navigationRSpace}px` }}>
      <View className='comp-purchase-nav__left' style={{ width: `${navigationRSpace}px` }}>
        {btnReturn && (
          <View className='comp-purchase-nav__icon-btn' onClick={onBack}>
            <SpImage src='fv_back.png' width={34} height={34} />
          </View>
        )}
        {showHome && (
          <View className='comp-purchase-nav__icon-btn' onClick={onHome}>
            <SpImage src='purcharehome.png' width={52} height={52} />
          </View>
        )}
        <Button className='comp-purchase-nav__service' openType='contact'>
          <SpImage src='purcharekefu.png' width={42} height={44} />
          {/* <Text className='comp-purchase-nav__service-text'>{$t('e15eed5a.e7dea7')}</Text> */}
        </Button>
      </View>
      <View className='comp-purchase-nav__title-wrap'>
        <Text className='comp-purchase-nav__title'>{displayTitle}</Text>
      </View>
    </View>
  )
}

CompPurchaseNav.options = {
  addGlobalClass: true
}

export default CompPurchaseNav
