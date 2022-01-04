import Taro, { useState, useEffect, useCallback } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import {
  SpNavBar,
  SpNewInput,
  SpNewFilterbar,
  SpNewShopItem,
  SpNewFilterDrawer,
  SpLoadMore
} from '@/components'
import { classNames, isNavbar } from '@/utils'
import { FILTER_DATA, FILTER_DRAWER_DATA, DEFAULT_SORT_VALUE, fillFilterTag } from '../consts/index'
import api from '@/api'
import { usePage, useFirstMount } from '@/hooks'
import './index.scss'

const NavbarTitle = '搜索'

function getLog () {
  return Taro.getStorageSync('searchLog') || []
}

function setLog (log) {
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
  const [filterValue, setFilterValue] = useState(DEFAULT_SORT_VALUE)

  const [filterVisible, setFilterVisible] = useState(false)

  const [dataList, setDataList] = useState([])

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
    setSearchAction(true)
  }, [])

  const handleClickInput = useCallback(() => {
    Taro.navigateTo({
      url: '/subpages/ecshopx/nearby-shop-search/index'
    })
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
      sort_type: filterValue
    }
    const { list, total_count, tagList } = await api.shop.list(params)

    setDataList([...dataList, ...list])
    setTotal(total_count)
    fillFilterTag(tagList)
  }

  const { loading, hasNext, total, setTotal, nextPage, resetPage } = usePage({
    fetch
  })

  useEffect(() => {
    if (mounted) {
      resetPage()
      setDataList([])
    }
  }, [filterValue])

  useEffect(() => {
    if (mounted) {
      resetPage()
      setDataList([])
    }
  }, [tag, logistics])

  return (
    <View
      className={classNames('sp-page-nearbyshopsearch', {
        'has-navbar': isNavbar()
      })}
    >
      <SpNavBar title={NavbarTitle} leftIconType='chevron-left' fixed='true' />

      <View className='sp-page-nearbyshopsearch-input'>
        <SpNewInput onConfirm={handleConfirm} />
      </View>

      {!searchAction ? (
        <View className='sp-page-nearbyshopsearch-search'>
          <View className='sp-page-nearbyshopsearch-search-title'>
            <View className='left'>最近搜索</View>
            <View className='right'>清除搜索历史</View>
          </View>
          <View className='sp-page-nearbyshopsearch-search-content'>
            {searchLog.map((item, index) => {
              return (
                <View className={classNames('sp-filter-block', { 'checked': index === 1 })}>
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
            filterData={FILTER_DATA}
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
              <SpNewShopItem inSearch className={classNames('in-shop-search')} info={item} />
            ))}
            {/* 分页loading */}
            <SpLoadMore loading={loading} hasNext={hasNext} total={total} />
          </ScrollView>

          <SpNewFilterDrawer
            visible={filterVisible}
            filterData={FILTER_DRAWER_DATA}
            onCloseDrawer={handleDrawer(false)}
          />
        </View>
      )}
    </View>
  )
}

export default NearbyShopSearch

NearbyShopSearch.config = {
  // navigationStyle: 'custom'
  navigationBarTitleText: NavbarTitle
}
