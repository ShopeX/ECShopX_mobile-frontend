/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro, { useState, useEffect, useCallback, useMemo } from '@tarojs/taro'
import { View, ScrollView, Image } from '@tarojs/components'
import { SpNavBar, SpNewInput, SpNewFilterbar, SpNewFilterDrawer, SpLoadMore } from '@/components'
import { SpNewShopItem } from '@/subpages/components'
import { classNames, isNavbar, JumpPageIndex } from '@/utils'
import api from '@/api'
import { usePage, useFirstMount } from '@/hooks'
import { useTranslation, $t } from '@/i18n'
import {
  buildFilterData,
  buildFilterDrawerData,
  DEFAULT_SORT_VALUE,
  fillFilterTag,
  DISTANCE_PLUS_SORT,
  DISTANCE_MINUS_SORT
} from '../consts/index'
import './index.scss'

// const { navbarHeight }=getNavbarHeight();

//微信小程序顶部距离=导航栏距离+输入框距离+筛选tab距离
// const top=`${pxTransform(navbarHeight)+ 92 + 92}rpx`;

const lnglat = () => Taro.getStorageSync('lnglat') || {}

const NearbyShopList = (props) => {
  const { i18n } = useTranslation()
  const [filterValue, setFilterValue] = useState(DEFAULT_SORT_VALUE)

  const [filterVisible, setFilterVisible] = useState(false)

  //筛选名称
  const [name, setName] = useState('')

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

  //标签id
  const [tag, setTag] = useState('')

  const handleClickFilterLabel = useCallback(
    (item) => {
      const lastDistanceFilter =
        filterValue == DISTANCE_PLUS_SORT || filterValue == DISTANCE_MINUS_SORT
      const distanceFilter = item == DISTANCE_PLUS_SORT || item == DISTANCE_MINUS_SORT
      console.log('===filterValue', filterValue, item, lastDistanceFilter, distanceFilter)

      //如果从非距离tab切换回来距离tab  应该是由近到远
      if (!lastDistanceFilter && distanceFilter) {
        setFilterValue(DEFAULT_SORT_VALUE)
        return
      }
      setFilterValue(item)
    },
    [filterValue]
  )

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
      province: lnglat().province || '北京市',
      city: lnglat().city || '北京市',
      area: lnglat().district || '昌平区',
      type: 0,
      show_discount: 1,
      show_marketing_activity: 1,
      is_ziti: logistics.is_ziti,
      is_delivery: logistics.is_delivery,
      is_dada: logistics.is_dada,
      distributor_tag_id: tag,
      lng: lnglat().longitude,
      lat: lnglat().latitude,
      //是否展示积分
      show_score: 1,
      sort_type: filterValue,
      show_items: 1,
      name
    }
    const { list, total_count, tagList } = await api.shop.list(params)

    setDataList((prev) => [...prev, ...list])
    fillFilterTag(tagList, filterDrawerData)
    return { total: total_count }
  }

  const { page, nextPage, resetPage, getTotal } = usePage({
    fetch
  })

  //点击搜索框搜索
  const handleConfirm = useCallback((item) => {
    setName(item)
  }, [])

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('d2317c4c.0c0d95') })
  }, [i18n.language])

  useEffect(() => {
    if (mounted) {
      resetPage()
      setDataList([])
    }
  }, [name, filterValue, tag, logistics])

  //没有物流
  const noLogistics = Object.values(logistics).every((item) => !item)

  //表示没有数据
  const noData = dataList.length === 0

  //表示没有筛选也没有数据
  const noCompleteData = noData && !name && noLogistics && !tag && !page.loading

  return (
    <View
      className={classNames('sp-page-nearbyshoplist', {
        'has-navbar': isNavbar(),
        'has-filterbar': !noCompleteData
      })}
    >
      <SpNavBar title={$t('d2317c4c.0c0d95')} leftIconType='chevron-left' fixed='true' />

      <View className='sp-page-nearbyshoplist-input'>
        <SpNewInput placeholder={$t('6a820a3d.e5dd3b')} onConfirm={handleConfirm} />
      </View>

      {!noCompleteData && (
        <SpNewFilterbar
          filterData={filterData}
          value={filterValue}
          onClickLabel={handleClickFilterLabel}
          onClickFilter={handleDrawer(true)}
        />
      )}

      <ScrollView
        className={classNames('sp-page-nearbyshoplist-scrollview')}
        scrollY
        scrollWithAnimation
        onScrollToLower={nextPage}
      >
        {dataList.map((item, index) => (
          <SpNewShopItem
            key={`nearby-shop-${item.distributor_id ?? index}`}
            className={classNames('in-shoplist', { 'in-shoplist-last': index === 99 })}
            info={item}
            isShowGoods={!!name}
            logoCanJump
            canJump
          />
        ))}
        {/* 分页loading */}
        <SpLoadMore loading={page.loading} hasNext={page.hasMore} total={getTotal()} />
        {!page.loading && noData && (
          <View className='sp-page-nearbyshoplist-nodata'>
            <Image className='img' src={`${process.env.APP_IMAGE_CDN}/empty_data.png`}></Image>
            <View className='tips'>{$t('5eda2f64.d17ff7')}</View>
            <View className='button' onClick={() => JumpPageIndex()}>
              {$t('fc05e5cb.f59585')}
            </View>
          </View>
        )}
      </ScrollView>

      <SpNewFilterDrawer
        visible={filterVisible}
        filterData={filterDrawerData}
        onCloseDrawer={handleDrawer(false)}
      />
    </View>
  )
}

export default NearbyShopList

NearbyShopList.config = {
  navigationBarTitleText: ''
}
