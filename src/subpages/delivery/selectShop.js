/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro, { useDidShow } from '@tarojs/taro'
import { useEffect, useRef, useMemo } from 'react'
import { classNames, formatTime } from '@/utils'
import { SpPage, SpScrollView } from '@/components'
import { useImmer } from 'use-immer'
import { useSelector } from 'react-redux'
import { useTranslation, $t } from '@/i18n'
import * as deliveryApi from '@/api/delivery'
import CompShopList from './comps/comp-shop-list'
import './selectShop.scss'

const initialConfigState = {
  codeStatus: false,
  address: {},
  basis: {},
  list: []
}

const SelectShop = () => {
  const { i18n } = useTranslation()
  const [state, setState] = useImmer(initialConfigState)
  const { basis, address, list } = state
  const { deliveryPersonnel } = useSelector((state) => state.cart)
  const goodsRef = useRef()

  const searchConditionList = useMemo(
    () => [
      { label: $t('ed3eeaa3.8098e2'), value: 'mobile' },
      { label: $t('9696edd5.0d4934'), value: 'name' }
    ],
    [i18n.language]
  )

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('e24b8d0f.f4d5b6') })
  }, [i18n.language])

  useEffect(() => {
    setState((draft) => {
      draft.list = []
    })
    goodsRef.current.reset()
  }, [basis, address])

  useDidShow(() => {
    setState((draft) => {
      draft.list = []
    })
    goodsRef.current.reset()
  })

  const fetch = async ({ pageIndex, pageSize }) => {
    let params = {
      page: pageIndex,
      page_size: pageSize,
      mobile: '',
      name: '',
      province: address[0],
      city: address[1],
      area: address[2],
      self_delivery_operator_id: deliveryPersonnel.self_delivery_operator_id
    }
    params[basis.key] = basis.keywords

    const { total_count, list: lists } = await deliveryApi.getDistributorList(params)
    lists.map((item) => {
      item.updated = formatTime(item.updated * 1000, 'YYYY-MM-DD')
    })
    setState((draft) => {
      draft.list = [...list, ...lists]
    })
    return {
      total: total_count
    }
  }
  return (
    <SpPage className={classNames('page-selectShop')}>
      {/* <SpSearchInput
        placeholder='输入内容'
        // isShowArea
        isShowSearchCondition
        searchConditionList={searchConditionList}
        onConfirm={(val) => {
          setState((draft) => {
            draft.basis = val
          })
        }}
        // onSelectArea={(val) => {
        //   setState((draft) => {
        //     draft.address = val.value
        //   })
        // }}
      /> */}
      <SpScrollView auto={false} ref={goodsRef} fetch={fetch}>
        {list.map((item, index) => {
          return <CompShopList key={index} item={item} />
        })}
      </SpScrollView>
    </SpPage>
  )
}

export default SelectShop
