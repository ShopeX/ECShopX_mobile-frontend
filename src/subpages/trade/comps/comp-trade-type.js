/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpTagBar } from '@/subpages/components'
import { VERSION_IN_PURCHASE } from '@/utils'
import { useTranslation, $t, i18n } from '@/i18n'
import './comp-trade-type.scss'

function CompTrackType(props) {
  useTranslation()
  const { value, onChange = () => {} } = props
  const router = useRouter()
  const { isOpen: isPurchaseOpen } = useSelector((state) => state.purchase)

  const list = useMemo(() => {
    onChange(router?.params.is_purchase == '1' ? '1' : '0')
    //内购+商城 开启内购模块则展示
    if (!VERSION_IN_PURCHASE && isPurchaseOpen) {
      return [
        { tag_name: $t('166085a9.2c7b38'), value: '0' },
        { tag_name: $t('166085a9.d0465c'), value: '1' }
      ]
    }
    return []
  }, [router, isPurchaseOpen, i18n.language])

  if (!list.length) return null

  return (
    <View className='comp-tradetype'>
      <SpTagBar list={list} value={value} onChange={onChange} />
    </View>
  )
}

CompTrackType.options = {
  addGlobalClass: true
}

export default CompTrackType
