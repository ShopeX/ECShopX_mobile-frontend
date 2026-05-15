/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { useEffect } from 'react'
import { tLang } from '@/utils/i18nLang'
import Taro, { useDidShow } from '@tarojs/taro'
import useNavigation from './useNavigation'

/**
 * 同步原生导航栏标题（含语言切换、返回本页）
 * @param {string} titleKey `subpages/i18n/locales` 扁平键（与 `$t` 同源）
 * @param {string} titleZh 中文回退
 */
export default function useI18nNavigationTitle(titleKey, titleZh) {
  const { setNavigationBarTitle } = useNavigation()

  const apply = () => {
    setNavigationBarTitle(tLang(titleKey, titleZh))
  }

  useEffect(() => {
    apply()
    const onLang = () => apply()
    Taro.eventCenter.on('languageChanged', onLang)
    return () => {
      Taro.eventCenter.off('languageChanged', onLang)
    }
  }, [titleKey, titleZh])

  useDidShow(() => {
    apply()
  })
}
