/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import * as dianwuApi from '@/api/dianwu'
import { View, Text, Image } from '@tarojs/components'
import { SpImage } from '@/components'
import { SpTime, SpCustomPicker } from '@/subpages/components'
import { classNames } from '@/utils'
import { useSyncCallback } from '@/hooks'
import { useTranslation } from 'react-i18next'
import { $t } from '@/i18n'
import './comp-ranking.scss'

const RANK_TYPE_KEYS = {
  all: '8a819f4f.7ec9b5',
  lv1: '8a819f4f.f5f0ad',
  lv2: '8a819f4f.5a4b1d'
}

const SELECTOR_DEF = [{ value: 'all' }, { value: 'lv1' }, { value: 'lv2' }]

const initialState = {
  list: [],
  valList: [],
  total_count: 0,
  datas: '',
  datasType: 0,
  customValue: 'all',
  selector: SELECTOR_DEF
}

function CompRanking(props) {
  useTranslation()
  const [state, setState] = useImmer(initialState)
  const { list, total_count, datas, datasType, valList, customValue, selector } = state
  const { params } = useRouter()
  const { selectorCheckedIndex, deliverylnformation, refreshData } = props

  useEffect(() => {
    fetch()
  }, [refreshData])

  useDidShow(() => {
    fetch()
  })

  //val 年(0)月(1)日(2)   ele 具体时间
  const onTimeChange = (val, ele) => {
    setState((draft) => {
      draft.list = []
      draft.datas = ele
      draft.datasType = val
    })
    handleRefresh()
  }

  const handleRefresh = useSyncCallback(() => {
    fetch()
  })

  const fetch = async () => {
    Taro.showLoading()
    let res = {
      page: 1,
      pageSize: 1000,
      is_sort: 1,
      year: datasType == 0 ? datas : '',
      month: datasType == 1 ? datas : '',
      day: datasType == 2 ? datas : '',
      distributor_id: params.distributor_id,
      username: selectorCheckedIndex == 0 ? deliverylnformation : '',
      mobile: selectorCheckedIndex == 1 ? deliverylnformation : ''
    }
    const { list: _list, total_count } = await dianwuApi.datacubeDeliverystaffdata(res)
    Taro.hideLoading()
    setState((draft) => {
      draft.list = _list.slice(0, 5)
      draft.valList = _list
      draft.total_count = total_count
    })
  }

  const ranking = (index) => {
    if (index <= 3) {
      return (
        <SpImage
          src={index == 1 ? 'paiming_1.png' : index == 2 ? 'paiming_2.png' : 'paiming_3.png'}
        ></SpImage>
      )
    } else {
      return <Text>{index + 1}</Text>
    }
  }

  const cancel = (index, val) => {
    setState((draft) => {
      draft.customValue = val.value
    })
    console.log(index, val)
  }

  const selectorForUi = selector.map((row) => ({
    ...row,
    label: $t(RANK_TYPE_KEYS[row.value])
  }))

  return (
    <View className='page-dianwu-comp-ranking'>
      <View className='comp-ranking'>
        <View className='comp-ranking-table'>
          <SpTime onTimeChange={onTimeChange} />
          <View className='comp-ranking-table-custom'>
            <SpCustomPicker
              customStatus
              id={customValue}
              cancel={cancel}
              selector={selectorForUi}
            />
          </View>
        </View>
        <View className='comp-ranking-list'>
          <View className='comp-ranking-list-item comp-ranking-list-title'>
            <Text>{$t('8a819f4f.a4dc00')}</Text>
            <Text>{$t('8a819f4f.808d6c')}</Text>
            <Text>{$t('8a819f4f.eac5dc')}</Text>
            <Text>{$t('8a819f4f.c5bcdc')}</Text>
            <Text>{$t('8a819f4f.23db6c')}</Text>
          </View>
          {list.map((item, index) => {
            return (
              <View
                className={classNames(
                  'comp-ranking-list-item',
                  index == 0 ? 'one' : index == 1 ? 'two' : index == 2 ? 'three' : ''
                )}
                key={index}
              >
                {ranking(index + 1)}
                <Text>{item.username}</Text>
                <Text>{item.total_fee_count}</Text>
                <Text>{item.order_count}</Text>
                <Text>{item.self_delivery_fee_count}</Text>
              </View>
            )
          })}

          {total_count - list.length > 0 && (
            <View
              className='launch'
              onClick={() => {
                setState((draft) => {
                  draft.list = valList
                })
              }}
            >
              <Text>{$t('8a819f4f.311f6d')}</Text>
              <Text className='iconfont icon-arrowDown'></Text>
            </View>
          )}
        </View>
      </View>

      {total_count - list.length <= 0 && <View className='end'>{$t('8a819f4f.a25652')}</View>}
    </View>
  )
}

CompRanking.options = {
  addGlobalClass: true
}

export default CompRanking
