/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpTagBar } from '@/components'
import { classNames, formatDateTime, VERSION_IN_PURCHASE } from '@/utils'

import './comp-trade-type.scss'

function CompTrackType(props) {
  const { value, onChange = () => {} } = props
  const router = useRouter()
  const { isOpen: isPurchaseOpen } = useSelector((state) => state.purchase)

  const list = useMemo(() => {
    onChange(router.params.is_purchase == '1' ? '1' : '0')
    //内购+商城 开启内购模块则展示
    if (!VERSION_IN_PURCHASE && isPurchaseOpen) {
      return [
        { tag_name: '商城', value: '0' },
        { tag_name: '内购', value: '1' }
      ]
    }
    return []
  }, [router, isPurchaseOpen])

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
