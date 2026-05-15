/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'
import { useEffect } from 'react'
import { Text } from '@tarojs/components'
import { classNames } from '@/utils'
import { SpPage } from '@/components'
import { $t, useTranslation } from '@/i18n'
import CompTabbar from './comps/comp-tabbar'
import './selectStore.scss'

const Index = () => {
  const { i18n } = useTranslation()

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('eab159ba.d736b9') })
  }, [i18n.language])

  return (
    <SpPage className={classNames('page-selectStore')} renderFooter={<CompTabbar />}>
      <Text>{$t('e24b8d0f.95a6ca')}</Text>
    </SpPage>
  )
}

export default Index
