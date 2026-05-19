/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Input, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { SpPage, SpScrollView, SpNote } from '@/components'
import { updateLocation } from '@/store/slices/user'
import api from '@/api'
import { useLogin, useNavigation } from '@/hooks'
import { useTranslation, $t, ti, i18n } from '@/i18n'
import doc from '@/doc'
import { entryLaunch, pickBy, classNames } from '@/utils'
import { useImmer } from 'use-immer'

import ConsultModal from './comps/consult-modal'
import './nearby-list.scss'

/** 省市区未选 / 不限：仅用于逻辑判断，界面展示走 displayPickerLabel */
const PLACEHOLDER_PROVINCE = '选择省'
const PLACEHOLDER_CITY = '选择市'
const PLACEHOLDER_DISTRICT = '选择区'
const DISTRICT_UNLIMITED = '__DISTRICT_UNLIMITED__'

function displayPickerLabel(value) {
  if (value === PLACEHOLDER_PROVINCE) return $t('9e660622.19a4c5')
  if (value === PLACEHOLDER_CITY) return $t('9e660622.0c1085')
  if (value === PLACEHOLDER_DISTRICT) return $t('9e660622.ccb908')
  if (value === DISTRICT_UNLIMITED) return $t('9e660622.8441b3')
  return value
}

const initialState = {
  shopList: [],
  keyword: '',
  locationList: [],
  locationRange: [[], [], []],
  locationValue: [0, 0, 0],
  selectedProvince: PLACEHOLDER_PROVINCE,
  selectedCity: PLACEHOLDER_CITY,
  selectedDistrict: PLACEHOLDER_DISTRICT,
  categoryList: [], // 从接口获取的分类列表
  selectedCategoryId: null, // 选中的分类ID，null表示全部
  storeTypeIndex: 0,
  showStoreTypePicker: false,
  refresh: false,
  currentLocation: null,
  backgroundUrl: '',
  binddingShop: null, // 专属门店
  showConsultModal: false, // 联系顾问弹框
  consultModalType: null, // 弹框类型：'1' 或 '2'
  consultModalData: null // 弹框数据
}

function NearbyList() {
  useTranslation()
  const { setNavigationBarTitle } = useNavigation()
  const { isLogin } = useLogin({ autoLogin: false })
  const [state, setState] = useImmer(initialState)
  const {
    shopList,
    keyword,
    locationRange,
    locationValue,
    selectedProvince,
    selectedCity,
    selectedDistrict,
    categoryList,
    selectedCategoryId,
    storeTypeIndex,
    showStoreTypePicker,
    refresh,
    currentLocation,
    backgroundUrl,
    binddingShop,
    showConsultModal,
    consultModalType,
    consultModalData
  } = state
  const { location = {} } = useSelector((state) => state.user)
  const { salespersonInfo } = useSelector((state) => state.shop)
  const dispatch = useDispatch()
  const listRef = useRef(null)
  /** 列表请求代次：刷新/重搜/定位更新时递增，丢弃过期的异步回写，避免分页 concat 重复 */
  const listFetchGenRef = useRef(0)
  /** 最近一次成功写入列表的 total，供被丢弃的请求回传给 usePage，避免 hasMore 错乱 */
  const lastListTotalRef = useRef(0)

  const bumpListFetchGen = () => {
    listFetchGenRef.current += 1
  }

  /** 按 distributor_id 去重，保留先出现的项（避免接口/竞态导致同一页重复） */
  const uniqByDistributor = (rows) => {
    const seen = new Set()
    return rows.filter((row) => {
      const id = row?.distributor_id
      if (id == null || id === '') return true
      if (seen.has(id)) return false
      seen.add(id)
      return true
    })
  }

  const mergeUniqueAppend = (baseList, incoming) => {
    const seen = new Set()
    for (const row of baseList) {
      const id = row?.distributor_id
      if (id != null && id !== '') seen.add(id)
    }
    const out = [...baseList]
    for (const row of incoming) {
      const id = row?.distributor_id
      if (id != null && id !== '') {
        if (seen.has(id)) continue
        seen.add(id)
      }
      out.push(row)
    }
    return out
  }

  useEffect(() => {
    const onLanguageChanged = () => {
      setNavigationBarTitle($t('678873b3.9f3102'))
      initLocationPicker()
    }
    onLanguageChanged()
    i18n.on('languageChanged', onLanguageChanged)
    return () => i18n.off('languageChanged', onLanguageChanged)
  }, [setNavigationBarTitle])

  useEffect(() => {
    initLocationPicker()
    getLocationInfo()
    fetchCategoryList()
  }, [])

  // 获取门店分类列表
  const fetchCategoryList = async () => {
    try {
      const res = await api.shop.getCategoryList()
      if (res?.list && Array.isArray(res.list)) {
        setState((draft) => {
          draft.categoryList = res.list
        })
      }
    } catch (e) {
      console.error('fetchCategoryList error', e)
    }
  }

  useEffect(() => {
    if (refresh) {
      listRef.current?.reset()
    }
  }, [refresh])

  const initLocationPicker = async () => {
    try {
      const res = await api.member.areaList()
      if (!res || !Array.isArray(res)) return

      const provinces = res.map((item) => item.label)
      const cities = res[0]?.children ? res[0].children.map((c) => c.label) : []
      const unlimitedLabel = $t('9e660622.8441b3')
      const districts = res[0]?.children?.[0]?.children
        ? [unlimitedLabel, ...res[0].children[0].children.map((d) => d.label)]
        : [unlimitedLabel]

      setState((draft) => {
        draft.locationList = res
        draft.locationRange = [provinces, cities, districts]
        draft.locationValue = [0, 0, 0]
      })
    } catch (e) {
      console.error('initLocationPicker error', e)
    }
  }

  const getLocationInfo = async () => {
    await entryLaunch.isOpenPosition(async (res) => {
      bumpListFetchGen()
      if (res.lat) {
        dispatch(updateLocation(res))
        setState((draft) => {
          draft.currentLocation = res
          draft.refresh = true
        })
      } else {
        setState((draft) => {
          draft.refresh = true
        })
      }
    })
  }

  const fetchShopList = async ({ pageIndex, pageSize }) => {
    const gen = listFetchGenRef.current
    // 构建基础参数
    const buildParams = (extraParams = {}) => {
      let params = {
        page: pageIndex,
        pageSize,
        search_type: 2,
        type: 1,
        sort_type: 1,
        ...extraParams
      }

      // 添加位置参数
      if (currentLocation?.lat && currentLocation?.lng) {
        params.lat = currentLocation.lat
        params.lng = currentLocation.lng
      }

      // 添加搜索关键词
      if (keyword) {
        params.name = keyword
      }

      // 添加省市区筛选
      if (selectedProvince !== PLACEHOLDER_PROVINCE) {
        params.province = selectedProvince
      }
      if (selectedCity !== PLACEHOLDER_CITY) {
        params.city = selectedCity
      }
      if (selectedDistrict !== PLACEHOLDER_DISTRICT && selectedDistrict !== DISTRICT_UNLIMITED) {
        params.area = selectedDistrict
      }

      // 添加门店分类筛选
      if (selectedCategoryId) {
        params.distributor_category_id = selectedCategoryId
      }

      return params
    }

    let binddingShopData = null
    let excludeDistributorId = null

    // 第一页且已登录时，先获取专属门店
    if (pageIndex === 1 && isLogin) {
      try {
        const binddingParams = buildParams({ bind: 1 })
        const binddingRes = await api.shop.list(binddingParams)
        if (gen !== listFetchGenRef.current) {
          return { total: lastListTotalRef.current }
        }
        if (binddingRes?.list?.length > 0) {
          binddingShopData = {
            ...pickBy(binddingRes.list, doc.shop.SHOP_ITEM)[0],
            isBinddingShop: true // 标记为专属门店
          }
          excludeDistributorId = binddingShopData.distributor_id
        }
      } catch (e) {
        console.error('fetch bindding shop error', e)
      }
    }

    // 获取普通门店列表
    const normalParams = buildParams(
      excludeDistributorId ? { exclude_distributor_id: excludeDistributorId } : {}
    )
    const { list, total_count: total, background_url } = await api.shop.list(normalParams)

    if (gen !== listFetchGenRef.current) {
      return { total: lastListTotalRef.current }
    }

    const totalOut = binddingShopData ? total + 1 : total

    setState((draft) => {
      const normalList = uniqByDistributor(pickBy(list, doc.shop.SHOP_ITEM))

      if (pageIndex === 1) {
        // 第一页：专属门店放在最前面
        const merged = binddingShopData ? [binddingShopData, ...normalList] : normalList
        draft.shopList = uniqByDistributor(merged)
        draft.binddingShop = binddingShopData
        if (background_url) {
          draft.backgroundUrl = background_url
        }
      } else {
        draft.shopList = mergeUniqueAppend(draft.shopList, normalList)
      }
      draft.refresh = false
    })

    lastListTotalRef.current = totalOut

    // 返回总数时，如果有专属门店需要加1
    return { total: totalOut }
  }

  const refreshList = () => {
    bumpListFetchGen()
    setState((draft) => {
      draft.shopList = []
      draft.refresh = true
    })
  }

  const onInputChange = ({ detail }) => {
    setState((draft) => {
      draft.keyword = detail.value
    })
  }

  const onConfirmSearch = () => {
    refreshList()
  }

  const onClearKeyword = () => {
    setState((draft) => {
      draft.keyword = ''
    })
    refreshList()
  }

  const toggleStoreTypePicker = () => {
    setState((draft) => {
      draft.showStoreTypePicker = !draft.showStoreTypePicker
    })
  }

  const selectStoreType = (index, categoryId = null) => {
    setState((draft) => {
      draft.storeTypeIndex = index
      draft.selectedCategoryId = categoryId
    })
  }

  const handleResetStoreType = () => {
    setState((draft) => {
      draft.storeTypeIndex = 0
      draft.selectedCategoryId = null
      draft.showStoreTypePicker = false
    })
    refreshList()
  }

  const handleConfirmStoreType = () => {
    setState((draft) => {
      draft.showStoreTypePicker = false
    })
    refreshList()
  }

  // 获取当前选中的分类名称
  const getSelectedCategoryName = () => {
    if (storeTypeIndex === 0 || !selectedCategoryId) {
      return $t('9e660622.a48948')
    }
    const category = categoryList.find((item) => item.category_id === selectedCategoryId)
    return category?.category_name || $t('9e660622.a48948')
  }

  const onColumnChange = (e) => {
    const { column, value } = e.detail
    setState((draft) => {
      if (column === 0) {
        draft.locationValue = [value, 0, 0]
        const currentProvince = draft.locationList[value]
        const cities = currentProvince?.children ? currentProvince.children.map((c) => c.label) : []
        const unlimitedLabel = $t('9e660622.8441b3')
        const districts = currentProvince?.children?.[0]?.children
          ? [unlimitedLabel, ...currentProvince.children[0].children.map((d) => d.label)]
          : [unlimitedLabel]
        draft.locationRange = [draft.locationRange[0], cities, districts]
      } else if (column === 1) {
        draft.locationValue[1] = value
        draft.locationValue[2] = 0
        const currentProvince = draft.locationList[draft.locationValue[0]]
        const currentCity = currentProvince?.children?.[value]
        const unlimitedLabel = $t('9e660622.8441b3')
        const districts = currentCity?.children
          ? [unlimitedLabel, ...currentCity.children.map((d) => d.label)]
          : [unlimitedLabel]
        draft.locationRange[2] = districts
      } else if (column === 2) {
        draft.locationValue[2] = value
      }
    })
  }

  const onLocationChange = (e) => {
    const [provinceIndex, cityIndex, districtIndex] = e.detail.value || [0, 0, 0]
    setState((draft) => {
      const province = draft.locationList[provinceIndex]
      const city = province?.children?.[cityIndex]
      // 区列表第一项是"不限"，所以索引需要减1
      const district = districtIndex === 0 ? null : city?.children?.[districtIndex - 1]
      draft.selectedProvince = province?.label || PLACEHOLDER_PROVINCE
      draft.selectedCity = city?.label || PLACEHOLDER_CITY
      draft.selectedDistrict =
        districtIndex === 0 ? DISTRICT_UNLIMITED : district?.label || PLACEHOLDER_DISTRICT
      draft.locationValue = [provinceIndex, cityIndex, districtIndex]
    })
    refreshList()
  }

  const handleNavigation = (e, info) => {
    e.stopPropagation()
    const { lat, lng, store_name, store_address } = info
    if (!lat || !lng) {
      Taro.showToast({ title: $t('9e660622.719c04'), icon: 'none' })
      return
    }
    Taro.openLocation({
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      name: store_name,
      address: store_address
    })
  }

  const handlePhoneCall = (e, phone) => {
    e.stopPropagation()
    if (!phone) {
      Taro.showToast({ title: $t('9e660622.2b88ea'), icon: 'none' })
      return
    }
    Taro.makePhoneCall({ phoneNumber: phone })
  }

  const handleConsult = (e, info) => {
    e.stopPropagation()
    if (info.show_salesperson == '1') {
      // 显示门店二维码弹框
      setState((draft) => {
        draft.showConsultModal = true
        draft.consultModalType = '1'
        draft.consultModalData = {
          storeName: info.store_name,
          qrcodeUrl: info.fixed_salesperson_qrcode_url
        }
      })
    } else if (info.show_salesperson == '2') {
      // 显示导购二维码弹框
      setState((draft) => {
        draft.showConsultModal = true
        draft.consultModalType = '2'
        draft.consultModalData = {
          qrcodeUrl: info.work_qrcode,
          salespersonName: info.salesperson_name,
          salespersonAvatar: info.salesperson_avatar,
          bgAvatarUrl: salespersonInfo?.bg_avatar_url,
          storeName: info.store_name
        }
      })
    }
  }

  const closeConsultModal = () => {
    setState((draft) => {
      draft.showConsultModal = false
      draft.consultModalType = null
      draft.consultModalData = null
    })
  }

  const formatDistance = (distance) => {
    if (!distance) return ''
    return ti('9e660622.bbdcca', [distance])
  }

  return (
    <SpPage className='nearby-list-page'>
      {/* 顶部Banner区域 */}
      <View
        className='banner-section'
        style={backgroundUrl ? { backgroundImage: `url(${backgroundUrl})` } : {}}
      />

      {/* 搜索筛选区域 */}
      <View className='filter-section'>
        {/* 搜索框和门店类型 */}
        <View className='search-row-wrapper'>
          <View className='search-row'>
            <View className='search-box'>
              <View className='search-input-wrap'>
                <Text className='iconfont icon-sousuo-01 search-icon'></Text>
                <Input
                  className='search-input'
                  placeholder={$t('9e660622.5f1147')}
                  value={keyword}
                  onInput={onInputChange}
                  onConfirm={onConfirmSearch}
                  confirmType='search'
                />
              </View>
            </View>
            <View
              className={classNames('filter-item', { active: storeTypeIndex > 0 })}
              onClick={toggleStoreTypePicker}
            >
              <Text>{getSelectedCategoryName()}</Text>
              <Text className='iconfont icon-xialajiantou arrow-icon'></Text>
            </View>
          </View>

          {/* 门店类型下拉面板 */}
          {showStoreTypePicker && (
            <View className='store-type-dropdown'>
              <View className='dropdown-content'>
                {/* 全部门店选项 */}
                <View className='dropdown-item' onClick={() => selectStoreType(0, null)}>
                  <Text className='item-text'>{$t('9e660622.a48948')}</Text>
                  <View className={classNames('item-radio', { active: storeTypeIndex === 0 })}>
                    {storeTypeIndex === 0 && <Text className='iconfont icon-gou'></Text>}
                  </View>
                </View>
                {/* 分类列表 */}
                {categoryList.map((item, index) => (
                  <View
                    className='dropdown-item'
                    key={`category-${item.category_id}`}
                    onClick={() => selectStoreType(index + 1, item.category_id)}
                  >
                    <Text className='item-text'>{item.category_name}</Text>
                    <View
                      className={classNames('item-radio', {
                        active: selectedCategoryId === item.category_id
                      })}
                    >
                      {selectedCategoryId === item.category_id && (
                        <Text className='iconfont icon-gou'></Text>
                      )}
                    </View>
                  </View>
                ))
                }
              </View >
              <View className='dropdown-actions'>
                <View className='action-btn reset' onClick={handleResetStoreType}>
                  {$t('9e660622.625fb2')}
                </View>
                <View className='action-btn confirm' onClick={handleConfirmStoreType}>
                  {$t('9e660622.38cf16')}
                </View>
              </View>
            </View >
          )}
        </View >

        {/* 省市区选择 */}
        <View className='location-row'>
          <Picker
            mode='multiSelector'
            range={locationRange}
            value={locationValue}
            onColumnChange={onColumnChange}
            onChange={onLocationChange}
          >
            <View className='location-picker'>
              <View className='picker-item'>
                <Text>{displayPickerLabel(selectedProvince)}</Text>
                <Text className='iconfont icon-xialajiantou arrow-icon'></Text>
              </View>
              <View className='picker-item'>
                <Text>{displayPickerLabel(selectedCity)}</Text>
                <Text className='iconfont icon-xialajiantou arrow-icon'></Text>
              </View>
              <View className='picker-item'>
                <Text>{displayPickerLabel(selectedDistrict)}</Text>
                <Text className='iconfont icon-xialajiantou arrow-icon'></Text>
              </View>
            </View>
          </Picker>
        </View>
      </View>

      {/* 门店列表 */}
      <SpScrollView
        ref={listRef}
        auto={false}
        className='shop-list-scroll'
        fetch={fetchShopList}
        renderEmpty={<SpNote img='empty_activity.png' title={$t('9e660622.e0f7ae')} />}
      >
        {shopList.map((item, index) => (
          <View
            className={classNames('shop-card', { 'shop-card-bindding': item.isBinddingShop })}
            key={item.distributor_id != null ? `shop-${item.distributor_id}` : `shop-idx-${index}`}
          >
            <View className='shop-card-content'>
              {/* 专属门店标签 */}
              {item.isBinddingShop && (
                <View className='bindding-tag'>
                  <Text className='bindding-tag-text'>{$t('9e660622.0a5774')}</Text>
                </View>
              )}

              {/* 门店信息头部 */}
              <View className='shop-header'>
                <View className='shop-info'>
                  <Text className='shop-name'>{item.store_name}</Text>
                  <Text className='shop-distance'>{formatDistance(item.distance)}</Text>
                </View>
                <View
                  className={classNames('action-btns', {
                    'action-btns-bindding': item.isBinddingShop
                  })}
                >
                  {item.show_mobile === '1' && (
                    <View
                      className='action-btn-item'
                      onClick={(e) => handlePhoneCall(e, item.mobile)}
                    >
                      <Text className='iconfont icon-mobile action-icon'></Text>
                      <Text className='action-text'>{$t('9e660622.e7880f')}</Text>
                    </View>
                  )}
                  {item.show_salesperson !== '0' && (
                    <View className='action-btn-item' onClick={(e) => handleConsult(e, item)}>
                      <Text className='iconfont icon-zixun action-icon'></Text>
                      <Text className='action-text'>{$t('9e660622.9405c8')}</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* 门店地址 */}
              <View className='shop-address'>
                <Text className='address-text'>{item.store_address}</Text>
              </View>

              {/* 底部操作栏 */}
              <View className='shop-footer'>
                {item.hour && (
                  <View className='business-hours'>
                    <Text className='hours-text'>
                      {$t('9e660622.6cd6e3')}
                      {item.hour}
                    </Text>
                  </View>
                )}
                <View className='nav-btn' onClick={(e) => handleNavigation(e, item)}>
                  <Text className='nav-text'>{$t('9e660622.4b9806')}</Text>
                  <Text className='iconfont icon-quzheli nav-icon'></Text>
                </View>
              </View>
            </View>
          </View>
        ))}
        </SpScrollView>

      {/* 联系顾问弹框 */}
      <ConsultModal
        visible={showConsultModal}
        type={consultModalType}
        data={consultModalData}
        onClose={closeConsultModal}
      />
    </SpPage>
  )
}

export default NearbyList
