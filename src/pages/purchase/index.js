/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro, { useRouter } from '@tarojs/taro'
import React, { useEffect } from 'react'
import { SpPage } from '@/components'
import { useTranslation, $t } from '@/i18n'

function PurchaseActivityListEntry() {
  useTranslation()
  const { params = {} } = useRouter()

  useEffect(() => {
    const query = Object.keys(params)
      .filter((key) => params[key] !== undefined && params[key] !== null && params[key] !== '')
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&')
    const url = `/subpages/purchase/activity-list${query ? `?${query}` : ''}`
    Taro.redirectTo({ url })
  }, [params])

  return <SpPage loading title={$t('c2581d4c.6fb7d0')} />
}

PurchaseActivityListEntry.options = {
  addGlobalClass: true
}

export default PurchaseActivityListEntry
