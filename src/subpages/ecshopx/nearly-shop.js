import React, { useEffect, useCallback, useRef, useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Picker, Input } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import { SpPage, SpScrollView, SpLogin, SpPrivacyModal, SpAddress } from '@/components'
import { updateLocation, updateChooseAddress } from '@/store/slices/user'
import api from '@/api'
import CompShopItem from './comps/comp-shopitem'
import { usePage, useLogin } from '@/hooks'
import doc from '@/doc'
import { entryLaunch, pickBy, classNames, showToast, log, isArray, isObject } from '@/utils'

import './nearly-shop.scss'

const initialState = {
  shopList: [],
  locationIng: false,
  chooseValue: ['北京市', '北京市', '昌平区'],
  keyword: '', // 参数
  type: 1, // 0:正常流程 1:基于省市区过滤 2:基于默认收货地址强制定位
  filterType: 1, // 过滤方式（前端使用）1:省市区过滤 2:经纬度定位 3:收货地址
  queryProvice: '',
  queryCity: '',
  queryDistrict: '',
  queryAddress: '',
  isSpAddressOpened: false,
  refresh: false
}

function NearlyShop(props) {
  const { isLogin, checkPolicyChange } = useLogin({
    autoLogin: false,
    policyUpdateHook: (isUpdate) => {
      isUpdate && setPolicyModal(true)
    }
  })
  const [state, setState] = useImmer(initialState)
  const { chooseValue, isSpAddressOpened, keyword, refresh, type, filterType, queryProvice,
    queryCity,
    queryDistrict,
    queryAddress } = state
  const [policyModal, setPolicyModal] = useState(false)
  const { location = {}, address } = useSelector((state) => state.user)
  const shopRef = useRef()
  const pageRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    if (refresh) {
      shopRef.current.reset()
    }
  }, [refresh])

  useEffect(() => {
    if (isSpAddressOpened) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [isSpAddressOpened])

  useEffect(() => {
    const { province, city, district } = location || {}
    setState((draft) => {
      draft.chooseValue = [province, city, district]
      draft.refresh = true
    })
  }, [])


  const fetchShop = async ({ pageIndex, pageSize }) => {
    let params = {
      page: pageIndex,
      pageSize,
      type,
      search_type: 2, // 1=搜索商品；2=搜索门店
      sort_type: 1
    }
    if (filterType == 1) {
      const [chooseProvince, chooseCity, chooseDistrict] = chooseValue
      params = {
        ...params,
        province: chooseProvince,
        city: chooseCity,
        area: chooseDistrict
      }
      if (keyword) {
        params = {
          ...params,
          name: keyword
        }
      }
    } else if (filterType == 2) {
      params = {
        ...params,
        lat: location?.lat,
        lng: location?.lng,
        province: location?.province,
        city: location?.city,
        area: location?.district
      }
    }

    log.debug(`fetchShop query: ${JSON.stringify(params)}`,)
    const { list, total_count: total, defualt_address } = await api.shop.list(params)

    setState((draft) => {
      draft.shopList = draft.shopList.concat(pickBy(list, doc.shop.SHOP_ITEM))
      draft.refresh = false
    })

    if (isObject(defualt_address)) {
      dispatch(updateChooseAddress(defualt_address))
    }

    return {
      total
    }
  }

  const onInputChange = ({ detail }) => {
    setState((draft) => {
      draft.keyword = detail.value
    })
  }

  const onConfirmSearch = async ({ detail }) => {
    await setState((draft) => {
      draft.keyword = detail.value
      draft.shopList = []
      draft.type = 1
      draft.filterType = 1
      draft.refresh = true
    })
  }

  const onClearValueChange = async () => {
    await setState((draft) => {
      draft.keyword = ''
      draft.shopList = []
      draft.type = 1
      draft.filterType = 1
      draft.refresh = true
    })
  }

  // 定位
  const getLocationInfo = async () => {
    setState((draft) => {
      draft.locationIng = true
    })
    setPolicyModal(false)
    await entryLaunch.isOpenPosition(async (res) => {
      if (res.lat) {
        dispatch(updateLocation(res))
        await setState((draft) => {
          draft.shopList = []
          draft.type = 1
          draft.filterType = 2
          draft.refresh = true
          draft.locationIng = false
        })
      } else {
        setState((draft) => {
          draft.locationIng = false
        })
      }
    })
  }

  const handleClickItem = (item) => {
    Taro.navigateTo({ url: `/subpages/store/index?id=${item.distributor_id}` })
  }

  const onAddChange = () => {
    if (!isLogin) return
    Taro.navigateTo({ url: '/marketing/pages/member/edit-address' })
  }

  // 根据收货地址搜索
  const onLocationChange = async (info) => {
    let local = info.address || info.province + info.city + info.county + info.adrdetail
    const res = await entryLaunch.getLnglatByAddress(local)
    await dispatch(updateLocation(res))
    Taro.navigateBack()
  }

  const isPolicyTime = async () => {
    const checkRes = await checkPolicyChange()
    if (checkRes) {
      getLocationInfo()
    } else {
      setPolicyModal(true)
    }
  }

  const onPickerChange = ([{ label: province }, { label: city }, { label: area }]) => {
    setState((draft) => {
      draft.chooseValue = [province, city, area]
    })
  }

  return (
    <SpPage className='page-ecshopx-nearlyshop' ref={pageRef}>
      <View className='search-block'>
        <View className='search-bar'>
          <View className='region-picker'>
            <View className='pick-title' onClick={() => {
              setState((draft) => {
                draft.isSpAddressOpened = true
              })
            }}>
              <View className='iconfont icon-periscope'></View>
              <Text className='pick-address'>{chooseValue.join('') || '选择地区'}</Text>
              {/* <Text className='iconfont icon-arrowDown'></Text> */}
            </View>
          </View>

          <View className='search-comp-wrap'>
            <Text className='iconfont icon-sousuo-01'></Text>
            <Input
              className='search-comp'
              placeholder='输入门店名称'
              confirmType='search'
              value={state.keyword}
              disabled={!location?.address}
              onInput={onInputChange}
              onConfirm={onConfirmSearch}
            />
            {state.keyword && state.keyword.length > 0 && (
              <View className='iconfont icon-close' onClick={onClearValueChange}></View>
            )}
          </View>
        </View>
      </View>

      <View className='location-block'>
        <View className='block-title'>当前定位地址</View>
        <View className='location-wrap'>
          <Text className='location-address' onClick={() => onLocationChange(location)}>
            {location?.address || '无法获取您的位置信息'}
          </Text>
          <View className='btn-location' onClick={isPolicyTime}>
            <Text
              className={classNames('iconfont icon-zhongxindingwei', {
                active: state.locationIng
              })}
            ></Text>
            {location?.address ? (state.locationIng ? '定位中...' : '重新定位') : '开启定位'}
          </View>
        </View>
        {
          address && <View className='block-title block-flex'>
            <View>我的收货地址</View>
            <View
              className='arrow'
              onClick={() =>
                Taro.navigateTo({ url: '/marketing/pages/member/address?isPicker=choose' })
              }
            >
              选择其他地址<View className='iconfont icon-qianwang-01'></View>
            </View>
          </View>
        }

        <View className='receive-address'>
          {!address && isLogin && (
            <View className='btn-add-address' onClick={onAddChange}>
              添加新地址
            </View>
          )}
          {address && (
            <View
              className='address'
              onClick={() => onLocationChange(address)}
            >{`${address.province}${address.city}${address.county}${address.adrdetail}`}</View>
          )}
        </View>
      </View>

      <View className='nearlyshop-list'>
        <View className='list-title'>附近商家</View>
        <SpScrollView ref={shopRef} auto={false} className='shoplist-block' fetch={fetchShop}>
          {state.shopList.map((item, index) => (
            <View
              onClick={() => handleClickItem(item)}
              className='shop-item-wrapper'
              key={`shopitem-wrap__${index}`}
            >
              <CompShopItem info={item} />
            </View>
          ))}
        </SpScrollView>
      </View>

      <SpAddress isOpened={isSpAddressOpened} onClose={() => {
        setState((draft) => {
          draft.isSpAddressOpened = false
        })
      }} onChange={onPickerChange} />

      <SpPrivacyModal
        open={policyModal}
        onCancel={() => setPolicyModal(false)}
        onConfirm={getLocationInfo}
      />
    </SpPage>
  )
}

export default NearlyShop
