import React, { useEffect, useCallback, useRef, useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Picker, Input, Image } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import { SpPage, SpScrollView, SpAddress } from '@/components'
import { updateLocation, updateChooseAddress } from '@/store/slices/user'
import { updateShopInfo } from '@/store/slices/shop'
import api from '@/api'
import { usePage, useLogin } from '@/hooks'
import { SG_ROUTER_PARAMS } from '@/consts/localstorage'
import doc from '@/doc'
import { entryLaunch, pickBy, classNames, showToast, log, isArray, isObject } from '@/utils'
import CompShopItem from './comps/comp-shopitem'

import './list.scss'

const defaultChooseValue = ['北京市', '北京市', '昌平区']

const initialState = {
  areaData: [],
  shopList: [],
  locationIng: false,
  chooseValue: defaultChooseValue,
  keyword: '', // 参数
  type: 0, // 0:正常流程 1:基于省市区过滤 2:基于默认收货地址强制定位
  filterType: 1, // 过滤方式（前端使用）1:省市区过滤 2:经纬度定位 3:收货地址
  // search_type: 2, // 参数
  queryProvice: '',
  queryCity: '',
  queryDistrict: '',
  queryAddress: '',
  headquarters: null,
  isRecommend: false,
  isSpAddressOpened: false,
  refresh: false
}

function NearlyShop(props) {
  const { isLogin } = useLogin({
    autoLogin: false,
    policyUpdateHook: (isUpdate) => {
      isUpdate && setPolicyModal(true)
    }
  })
  const [state, setState] = useImmer(initialState)
  const {
    chooseValue,
    headquarters,
    isRecommend,
    isSpAddressOpened,
    keyword,
    refresh,
    type,
    filterType,
    queryProvice,
    queryCity,
    queryDistrict,
    queryAddress,
  } = state
  const [policyModal, setPolicyModal] = useState(false)
  const { location = {}, address } = useSelector((state) => state.user)
  const { shopInfo } = useSelector((state) => state.shop)
  const shopRef = useRef()
  const pageRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    fetchDefaultShop()
  }, [])

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

  const fetchDefaultShop = async () => {
    const res = await api.shop.getDefaultShop()
    setState((draft) => {
      draft.chooseValue = shopInfo?.regions || defaultChooseValue
      draft.headquarters = res
      draft.refresh = true
    })
  }

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
      // const locationRes = await entryLaunch.getLnglatByAddress(`${chooseProvince}${chooseCity}${chooseDistrict}`)
      // const { lng, lat, error } = locationRes
      // if (!error) {
      //   params = {
      //     ...params,
      //     lng,
      //     lat
      //   }
      // }
    } else if (filterType == 2) {
      params = {
        ...params,
        lat: location?.lat,
        lng: location?.lng,
        province: location?.province,
        city: location?.city,
        area: location?.district
      }
    } else if (filterType == 3) {
      params = {
        ...params,
        province: queryProvice,
        city: queryCity,
        area: queryDistrict
      }
      const locationRes = await entryLaunch.getLnglatByAddress(`${queryProvice}${queryCity}${queryDistrict}${queryAddress}`)
      const { lng, lat, error } = locationRes
      if (!error) {
        params = {
          ...params,
          lng,
          lat
        }
      }
    }

    log.debug(`fetchShop query: ${JSON.stringify(params)}`)
    const { list, total_count: total, defualt_address, is_recommend } = await api.shop.list(params)

    setState((draft) => {
      draft.shopList = draft.shopList.concat(pickBy(list, doc.shop.SHOP_ITEM))
      draft.isRecommend = is_recommend === 1
      draft.defualt_address = defualt_address
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

  // 搜索
  const onConfirmSearch = async ({ detail }) => {
    await setState((draft) => {
      draft.keyword = detail.value
      draft.shopList = []
      draft.type = 1
      draft.filterType = 1
      draft.refresh = true
    })
  }

  // 清除关键词搜索
  const onClearValueChange = async () => {
    await setState((draft) => {
      draft.keyword = ''
      draft.shopList = []
      draft.type = 1
      draft.filterType = 1
      draft.refresh = true
    })
  }

  const onPickerChange = async ([{ label: province }, { label: city }, { label: area }]) => {
    setState((draft) => {
      draft.chooseValue = [province, city, area]
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

  const handleClickShop = (info) => {
    dispatch(updateShopInfo(info)) //新增非门店自提，开启distributor_id 取值为store_id
    // 清空小程序启动时携带的参数
    Taro.setStorageSync(SG_ROUTER_PARAMS, {})
    setTimeout(() => {
      Taro.navigateBack()
    }, 300)
  }

  // 根据收货地址搜索
  const onLocationChange = async ({ province, city, county, adrdetail }) => {
    await setState((draft) => {
      draft.shopList = []
      draft.keyword = ''
      draft.type = 2
      draft.filterType = 3
      draft.queryProvice = province
      draft.queryCity = city
      draft.queryDistrict = county
      draft.queryAddress = adrdetail
      draft.refresh = true
    })
  }

  return (
    <SpPage className='page-store-list' ref={pageRef}>
      <View className='search-block'>
        <View className='search-bar'>
          <View className='region-picker'>
            <View className='pick-title' onClick={() => {
              setState((draft => {
                draft.isSpAddressOpened = true
              }))
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
              placeholder='请输入想搜索的店铺'
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

      {isRecommend && (
        <View className='shop-logo'>
          <Image className='img' src={headquarters.logo} mode='aspectFill' />
          <View className='tip'>您想要地区的店铺暂时未入驻网上商城</View>
        </View>
      )}

      <View className='location-block'>
        <View className='block-title'>当前定位地址</View>
        <View className='location-wrap'>
          <Text className='location-address'>{location?.address || '无法获取您的位置信息'}</Text>
          <View className='btn-location' onClick={getLocationInfo}>
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
          </View>
        }

        <View className='receive-address'>
          {address && (
            <View
              className='address'
              onClick={() => onLocationChange(address)}
            >{`${address.province}${address.city}${address.county}${address.adrdetail}`}</View>
          )}
        </View>
      </View>

      <View className='nearlyshop-list'>
        <View className='list-title'>{location?.address ? '附近门店' : '推荐门店'}</View>
        <SpScrollView ref={shopRef} auto={false} className='shoplist-block' fetch={fetchShop}>
          {state.shopList.map((item, index) => (
            <View
              onClick={() => handleClickShop(item)}
              className='shop-item-wrapper'
              key={`shopitem-wrap__${index}`}
            >
              <CompShopItem info={item} />
            </View>
          ))}
        </SpScrollView>
      </View>

      {headquarters && <View className='shop-bottom' onClick={() => handleClickShop(headquarters)}>
        <Image className='img' src={headquarters.logo} mode='aspectFill' />
        {headquarters.store_name}
        <View className='iconfont icon-arrowRight' />
      </View>}


      <SpAddress isOpened={isSpAddressOpened} onClose={() => {
        setState((draft) => {
          draft.isSpAddressOpened = false
        })
      }} onChange={onPickerChange} />

    </SpPage>
  )
}

export default NearlyShop
