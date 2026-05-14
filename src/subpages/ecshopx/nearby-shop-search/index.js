/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro, { useState, useEffect, useCallback, useMemo } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { SpNavBar, SpNewInput, SpNewFilterbar, SpNewFilterDrawer, SpLoadMore } from '@/components'
import { SpNewShopItem } from '@/subpages/components'
import { classNames, isNavbar } from '@/utils'
import api from '@/api'
import { usePage, useFirstMount } from '@/hooks'
import { useTranslation, $t } from '@/i18n'
import {
  buildFilterData,
  buildFilterDrawerData,
  DEFAULT_SORT_VALUE,
  fillFilterTag
} from '../consts/index'
import './index.scss'

function getLog() {
  return Taro.getStorageSync('searchLog') || []
}

function setLog(log) {
  let prevLogs = getLog()
  if (!prevLogs.includes(log)) {
    prevLogs.push(log)
  }
  Taro.setStorageSync('searchLog', prevLogs)
  return getLog()
}

const lnglat = Taro.getStorageSync('lnglat') || {}

console.log('===lnglat===', lnglat)

const NearbyShopSearch = (props) => {
  const { i18n } = useTranslation()
  const [filterValue, setFilterValue] = useState(DEFAULT_SORT_VALUE)

  const [filterVisible, setFilterVisible] = useState(false)

  const [dataList, setDataList] = useState([])

  const filterData = useMemo(() => buildFilterData($t), [i18n.language])
  const filterDrawerData = useMemo(() => buildFilterDrawerData($t), [i18n.language])

  //物流
  const [logistics, setLogistics] = useState({
    //自提
    is_ziti: undefined,
    //快递
    is_delivery: undefined,
    //达达
    is_dada: undefined
  })

  //是否搜索
  const [searchAction, setSearchAction] = useState(false)

  const [searchKeyword, setSearchKeyword] = useState('')

  //标签id
  const [tag, setTag] = useState('')

  const [searchLog, setSeachLog] = useState(getLog())

  const handleClickFilterLabel = useCallback((item) => {
    setFilterValue(item)
  }, [])

  //点击搜索框搜索
  const handleConfirm = useCallback((item) => {
    const logs = setLog(item)
    setSeachLog(logs)
    setSearchKeyword(item || '')
    setSearchAction(true)
  }, [])

  const handleClearLog = useCallback(() => {
    Taro.removeStorageSync('searchLog')
    setSeachLog([])
  }, [])

  const handleDrawer = useCallback(
    (flag) => (selectedValue) => {
      setFilterVisible(flag)
      if (!selectedValue.tag && !Array.isArray(selectedValue.tag)) return
      setTag(selectedValue.tag.length ? selectedValue.tag.join(',') : '')
      const is_ziti = selectedValue.logistics.includes('ziti') ? 1 : undefined
      const is_delivery = selectedValue.logistics.includes('delivery') ? 1 : undefined
      const is_dada = selectedValue.logistics.includes('dada') ? 1 : undefined
      setLogistics({
        is_ziti,
        is_delivery,
        is_dada
      })
    },
    []
  )

  const mounted = useFirstMount()

  const fetch = async ({ pageIndex, pageSize }) => {
    const params = {
      page: pageIndex,
      pageSize,
      province: lnglat.province,
      city: lnglat.city ? lnglat.city : lnglat.province,
      area: lnglat.district,
      type: 0,
      show_discount: 1,
      show_marketing_activity: 1,
      is_ziti: logistics.is_ziti,
      is_delivery: logistics.is_delivery,
      is_dada: logistics.is_dada,
      distributor_tag_id: tag,
      lng: lnglat.longitude,
      lat: lnglat.latitude,
      //是否展示积分
      show_score: 1,
      sort_type: filterValue,
      show_items: 1,
      name: searchKeyword
    }
    const { list, total_count, tagList } = await api.shop.list(params)

    setDataList((prev) => [...prev, ...list])
    fillFilterTag(tagList, filterDrawerData)
    return { total: total_count }
  }

  const { page, nextPage, resetPage, getTotal } = usePage({
    fetch
  })

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('bd3973c8.e5f71f') })
  }, [i18n.language])

  useEffect(() => {
    if (!mounted || !searchAction) return
    resetPage()
    setDataList([])
  }, [searchKeyword, filterValue, tag, logistics])

  return (
    <View
      className={classNames('sp-page-nearbyshopsearch', {
        'has-navbar': isNavbar()
      })}
    >
      <SpNavBar title={$t('bd3973c8.e5f71f')} leftIconType='chevron-left' fixed='true' />

      <View className='sp-page-nearbyshopsearch-input'>
        <SpNewInput placeholder={$t('6a820a3d.e5dd3b')} onConfirm={handleConfirm} />
      </View>

      {!searchAction ? (
        <View className='sp-page-nearbyshopsearch-search'>
          <View className='sp-page-nearbyshopsearch-search-title'>
            <View className='left'>{$t('7fa435fc.e8cb95')}</View>
            <View className='right' onClick={handleClearLog}>
              {$t('7fa435fc.4bf6fd')}
            </View>
          </View>
          <View className='sp-page-nearbyshopsearch-search-content'>
            {searchLog.map((item, index) => {
              return (
                <View
                  key={`search-log-${index}-${item}`}
                  className={classNames('sp-filter-block', { checked: index === 1 })}
                >
                  {item}
                </View>
              )
            })}
          </View>
        </View>
      ) : (
        <View className='sp-page-nearbyshopsearch-list'>
          <SpNewFilterbar
            bgWhite={false}
            borderRadius
            filterData={filterData}
            value={filterValue}
            onClickLabel={handleClickFilterLabel}
            onClickFilter={handleDrawer(true)}
          />

          <ScrollView
            className={classNames('sp-page-nearbyshopsearch-scrollview')}
            scrollY
            scrollWithAnimation
            onScrollToLower={nextPage}
          >
            {dataList.map((item, index) => (
              <SpNewShopItem
                key={`nearby-search-${item.distributor_id ?? index}`}
                inSearch
                className={classNames('in-shop-search')}
                info={item}
              />
            ))}
            {/* 分页loading */}
            <SpLoadMore loading={page.loading} hasNext={page.hasMore} total={getTotal()} />
          </ScrollView>

          <SpNewFilterDrawer
            visible={filterVisible}
            filterData={filterDrawerData}
            onCloseDrawer={handleDrawer(false)}
          />
        </View>
      )}
    </View>
  )
}

export default NearbyShopSearch

NearbyShopSearch.config = {
  navigationBarTitleText: ''
}
