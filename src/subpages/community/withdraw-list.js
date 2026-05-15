/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useRef, useMemo, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { useImmer } from 'use-immer'
import * as communityApi from '@/api/community'
import { View, Text } from '@tarojs/components'
import { SpScrollView } from '@/components'
import dayjs from 'dayjs'
import { useTranslation, $t, ti } from '@/i18n'
import './withdraw-list.scss'

const WITHDRAW_STATUS_KEYS = {
  apply: 'f9926553.047109',
  reject: 'f9926553.7173f8',
  success: 'f9926553.dca060',
  process: 'f9926553.5d459d',
  failed: 'f9926553.f285c5'
}

const initialState = {
  list: []
}
function WithdrawList(props) {
  const { i18n } = useTranslation()
  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('31b5e01c.103053') })
  }, [i18n.language])
  const listRef = useRef()
  const [state, setState] = useImmer(initialState)
  const { list } = state

  const statusLabel = useMemo(() => {
    const map = {}
    Object.keys(WITHDRAW_STATUS_KEYS).forEach((k) => {
      map[k] = $t(WITHDRAW_STATUS_KEYS[k])
    })
    return map
  }, [i18n.language])

  const fetch = async ({ pageIndex, pageSize }) => {
    const { list, total_count } = await communityApi.getCashWithDraw({
      page: pageIndex,
      pageSize
    })
    setState((draft) => {
      draft.list = list
    })
    return { total: total_count }
  }

  return (
    <View className='page-withdraw-list'>
      <View className='list-hd'>
        <Text className='iconfont'></Text>
        <Text className='title'>{$t('f9926553.037d2e')}</Text>
      </View>
      <SpScrollView className='list-scroll' ref={listRef} fetch={fetch}>
        {list.map((item) => (
          <View className='withdraw-item'>
            <View className='item-hd'>
              <Text className='apply-money'>{ti('f9926553.05546c', [item.money / 100])}</Text>
              <Text className='apply-datetime'>
                {dayjs(item.created_date).format('YYYY-MM-DD HH:mm:ss')}
              </Text>
            </View>
            <View className='item-ft'>
              <Text className='iconfont'></Text>
              <Text className='status-txt'>{statusLabel[item.status] || item.status}</Text>
            </View>
          </View>
        ))}
      </SpScrollView>
    </View>
  )
}

WithdrawList.options = {
  addGlobalClass: true
}

export default WithdrawList
