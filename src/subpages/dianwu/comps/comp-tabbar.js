/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro, { getCurrentInstance } from '@tarojs/taro'
import React, { useMemo } from 'react'
import { View } from '@tarojs/components'
import { AtTabBar } from 'taro-ui'
import { SG_DIANWU_TOKEN } from '@/consts'
import { useTranslation, $t } from '@/i18n'
import './comp-tabbar.scss'

const TABBAR_URLS = [
  '/subpages/dianwu/cashier',
  '/subpages/dianwu/list',
  '/subpages/dianwu/pending-checkout'
]

const TABBAR_ICON_TYPES = ['dianpushouye', 'dianpushangpinlist', 'dianpufenlei']

function CompTabbar(props) {
  const { i18n } = useTranslation()
  const $instance = getCurrentInstance() || {}

  const tabList = useMemo(() => {
    const titles = [$t('95c9ab49.5cbddd'), $t('95c9ab49.b21fcc'), $t('47860443.b10acb')]
    return TABBAR_URLS.map((url, idx) => ({
      title: titles[idx],
      name: titles[idx],
      iconType: TABBAR_ICON_TYPES[idx],
      selectedIconType: `${TABBAR_ICON_TYPES[idx]}-fill`,
      iconPrefixClass: 'iconfont icon',
      url
    }))
  }, [i18n.language])

  let currentIndex = 0
  const pages = Taro.getCurrentPages()
  if (pages.length > 0) {
    const currentPage = pages[pages.length - 1].route
    currentIndex = TABBAR_URLS.findIndex((tabUrl) => tabUrl == `/${currentPage}`)
  }

  console.log('comp-tabbar currentIndex:', currentIndex)

  const handleTabbarClick = async (index) => {
    const tabItem = tabList[index]
    const { path } = $instance
    const { distributor_id } = $instance?.router?.params
    const token = Taro.getStorageSync(SG_DIANWU_TOKEN)
    if (path != tabItem.url) {
      Taro.redirectTo({
        url: `${tabItem.url}?token=${token}&distributor_id=${distributor_id}&from=tabbar`
      })
    }
  }

  return (
    <View className='comp-tabbar'>
      <AtTabBar
        iconSize='20'
        selectedColor='#4d84fc'
        tabList={tabList}
        onClick={handleTabbarClick}
        current={currentIndex}
      />
    </View>
  )
}

CompTabbar.options = {
  addGlobalClass: true
}

export default CompTabbar
