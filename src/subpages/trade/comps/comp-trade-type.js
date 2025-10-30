// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
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
