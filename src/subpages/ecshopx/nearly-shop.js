/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useCallback, useRef, useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Picker, Input } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import { SpPage, SpScrollView, SpLogin, SpAddress } from '@/components'
import { updateLocation, updateChooseAddress } from '@/store/slices/user'
import api from '@/api'
import { usePage, useLogin } from '@/hooks'
import doc from '@/doc'
import { entryLaunch, pickBy, classNames, showToast, log, isArray, isObject } from '@/utils'
import CompShopItem from './comps/comp-shopitem'

import './nearly-shop.scss'

const initialState = {
  shopList: [],
  locationIng: false,
  chooseValue: ['北京市', '北京市', '昌平区'],
  keyword: '', // 参数
  type: 0, // 过滤方式（接口使用）0:授权定位，lng、lat分别传经纬度    1:基于省市区过滤，province、city、area分别传省、市、区  2:基于默认收货地址强制定位   3：选择收货地址  province、city、area、address分别传省、市、区、详细地址
  // filterType: 1, // 过滤方式（前端使用）1:省市区筛选过滤 2:收货地址省市区筛选 3:经纬度定位 4:默认收货地址
  queryProvice: '',
  queryCity: '',
  queryDistrict: '',
  queryAddress: '',
  isSpAddressOpened: false,
  refresh: false,
  isToken: false
}

function NearlyShop(props) {
  const { isLogin } = useLogin({
    autoLogin: false,
    policyUpdateHook: (isUpdate) => {
      isUpdate && setPolicyModal(true)
    }
  })
  const [state, setState] = useImmer(initialState)
  const { chooseValue, isSpAddressOpened, keyword, refresh, type, isToken } = state
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
      if (address) {
        draft.type = address.is_def ? 2 : 3
      }
      if (location) {
        // fix：未授权定位时不设置chooseValue
        draft.chooseValue = [province, city, district]
        draft.type = 0
      }
      draft.refresh = true
    })

    Taro.eventCenter.on('onEventSelectReceivingAddress', (addressRes) => {
      console.log(addressRes, 'onEventSelectReceivingAddress...')
      setState((draft) => {
        draft.type = addressRes.is_def ? 2 : 3
        draft.shopList = []
        draft.refresh = true
      })
    })

    getTokenFromStorage()

    return () => {
      Taro.eventCenter.off('onEventSelectReceivingAddress')
    }
  }, [])

  // 在需要获取 Token 的地方调用该函数
  const getTokenFromStorage = async () => {
    let res = await Taro.getStorage({ key: 'token' })
    setState((draft) => {
      draft.isToken = res?.data ? true : false
    })
  }

  const fetchShop = async ({ pageIndex, pageSize }) => {
    let params = {
      page: pageIndex,
      pageSize,
      search_type: 2, // 1=搜索商品；2=搜索门店
      sort_type: 1,
      type
    }
    if (type == 0) {
      //经纬度
      params = {
        ...params,
        lat: location?.lat,
        lng: location?.lng
      }
      if (keyword) {
        params = {
          ...params,
          name: keyword
        }
      }
    } else if (type == 1) {
      //基于省市区过滤
      const [chooseProvince, chooseCity, chooseDistrict] = chooseValue
      if (keyword) {
        params = {
          ...params,
          name: keyword
        }
      }
      params = {
        ...params,
        province: chooseProvince,
        city: chooseCity,
        area: chooseDistrict
      }
    } else if (type == 3) {
      params = {
        ...params,
        province: address.province,
        city: address.city,
        area: address.county,
        address: address.adrdetail
      }
    }

    log.debug(`fetchShop query: ${JSON.stringify(params)}`)
    const { list, total_count: total, defualt_address } = await api.shop.list(params)

    setState((draft) => {
      draft.shopList = draft.shopList.concat(pickBy(list, doc.shop.SHOP_ITEM))
      draft.refresh = false
    })

    if (isObject(defualt_address) && !address) {
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
      draft.refresh = true
    })
  }

  const onClearValueChange = async () => {
    await setState((draft) => {
      draft.keyword = ''
      draft.shopList = []
      draft.type = 1
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
        const { province, city, district } = res
        await setState((draft) => {
          draft.chooseValue = [province, city, district] // fix:重新定位到上海，值没有更新，导致picker里面的值还是北京
          draft.shopList = []
          draft.type = 0
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

  // 根据定位地址或收货地址定位切换地址
  const onLocationChange = async (info) => {
    let local =
      info.address || info.province + info.city + info?.area + info?.county + info?.adrdetail
    const res = await entryLaunch.getLnglatByAddress(local)
    await dispatch(updateLocation(res))
    Taro.navigateBack()
  }

  // 省市区切换
  const onPickerChange = ([{ label: province }, { label: city }, { label: area }]) => {
    setState((draft) => {
      draft.chooseValue = [province, city, area]
      draft.shopList = []
      draft.type = 1 // 省市区过滤
      draft.refresh = true
    })
  }

  return (
    <SpPage className='page-ecshopx-nearlyshop' ref={pageRef}>
      <View className='search-block'>
        <View className='search-bar'>
          <View className='region-picker'>
            <View
              className='pick-title'
              onClick={() => {
                setState((draft) => {
                  draft.isSpAddressOpened = true
                })
              }}
            >
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
          <View className='btn-location' onClick={getLocationInfo}>
            <Text
              className={classNames('iconfont icon-zhongxindingwei', {
                active: state.locationIng
              })}
            ></Text>
            {location?.address ? (state.locationIng ? '定位中...' : '重新定位') : '开启定位'}
          </View>
        </View>
        {isToken && address && (
          <View className='block-title block-flex'>
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
        )}

        <View className='receive-address'>
          {!address && isLogin && (
            <View className='btn-add-address' onClick={onAddChange}>
              添加新地址
            </View>
          )}
          {address && isToken && (
            <View className='address' onClick={() => onLocationChange(address)}>{`${
              address.province
            }${address.city}${address?.area || ''}${address?.county || ''}${
              address?.adrdetail || ''
            }`}</View>
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

      <SpAddress
        isOpened={isSpAddressOpened}
        onClose={() => {
          setState((draft) => {
            draft.isSpAddressOpened = false
          })
        }}
        onChange={onPickerChange}
      />
    </SpPage>
  )
}

export default NearlyShop
