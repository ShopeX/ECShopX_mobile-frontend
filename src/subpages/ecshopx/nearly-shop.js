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
import { entryLaunch, pickBy, classNames, showToast, log, isArray, uniqueFunc } from '@/utils'

import './nearly-shop.scss'

const initialState = {
  shopList: [],
  locationIng: false,
  chooseValue: ['北京市', '北京市', '昌平区'],
  keyword: '', // 参数
  type: 0, // 参数
  search_type: undefined, // 参数
  isSpAddressOpened: false,
}

function NearlyShop(props) {
  const { isLogin, checkPolicyChange } = useLogin({
    autoLogin: false,
    policyUpdateHook: (isUpdate) => {
      isUpdate && setPolicyModal(true)
    }
  })
  const [state, setState] = useImmer(initialState)
  const [policyModal, setPolicyModal] = useState(false)
  const { location = {}, address } = useSelector((state) => state.user)
  const shopRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    // fetchAddressList()
    // onPickerClick()
  }, [])

  const fetchShop = async (params) => {
    const { pageIndex: page, pageSize } = params
    const { keyword } = state
    const [chooseProvice, chooseCity, chooseDistrict] = state.chooseValue
    // const { province, city, district } = location
    const query = {
      page,
      pageSize,
      lat: location?.lat,
      lng: location?.lng,
      name: keyword,
      province: location?.province || chooseProvice,
      city: location?.city || chooseCity,
      area: location?.district || chooseDistrict,
      type: location?.lat ? state.type : 0,
      search_type: state.search_type,
      sort_type: 1
    }
    const { list, total_count: total, defualt_address } = await api.shop.list(query)

    setState((v) => {
      v.shopList = uniqueFunc(v.shopList.concat(pickBy(list, doc.shop.SHOP_ITEM)),'distributor_id')
      v.chooseValue = [query.province, query.city, query.area]
    })

    let format_address = !isArray(defualt_address) ? defualt_address : null
    dispatch(updateChooseAddress(address || format_address))

    return {
      total
    }
  }

  const onInputChange = ({ detail }) => {
    setState((v) => {
      v.keyword = detail.value
    })
  }

  const onConfirmSearch = async ({ detail }) => {
    const { chooseValue } = state
    const _address = chooseValue.join('')
    const res = await entryLaunch.getLnglatByAddress(_address)
    // console.log('onConfirmSearch:res', res)
    const { lng, lat, error } = res
    if (error) {
      showToast(error)
    } else {
      dispatch(updateLocation(res))
      await setState((v) => {
        v.keyword = detail.value
        v.shopList = []
        v.type = 1
        v.search_type = 2
      })
      shopRef.current.reset()
    }
  }

  // 定位
  const getLocationInfo = async () => {
    setState((v) => {
      v.locationIng = true
    })
    setPolicyModal(false)
    await entryLaunch.isOpenPosition(async (res) => {
      if (res.lat) {
        dispatch(updateLocation(res))
        await setState((v) => {
          v.shopList = []
          v.keyword = ''
          v.name = ''
          // v.type = 0
          v.search_type = undefined
        })
        console.log('getLocationInfo 重新定位',)
        shopRef.current.reset()
      }
    })

    setState((v) => {
      v.locationIng = false
      v.type = 2
    })
  }

  const onClearValueChange = async () => {
    await setState((v) => {
      v.shopList = []
      v.keyword = ''
      v.type = 0
      v.search_type = undefined
    })
    shopRef.current.reset()
  }

  const handleClickItem = (item) => {
    Taro.navigateTo({ url: `/subpages/store/index?id=${item.distributor_id}` })
  }

  const onAddChange = () => {
    if (!isLogin) return
    Taro.navigateTo({ url: '/marketing/pages/member/edit-address' })
  }

  const onChangeLoginSuccess = async () => {
    await setState((v) => {
      v.shopList = []
      v.keyword = ''
      v.type = 0
      v.search_type = undefined
    })
    shopRef.current.reset()
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

    setState((v) => {
      v.type = 2
    })
  }

  const handleClickCloseSpAddress = () => {
    setState((v) => {
      v.isSpAddressOpened = false
    })
  }

  const handleClickOpenSpAddress = () => {
    setState((v) => {
      v.isSpAddressOpened = true
    })
  }

  const onPickerChange = (selectValue) => {
    const chooseValue = [
      selectValue[0].label,
      selectValue[1].label,
      selectValue[2].label
    ]
    setState((v)=>{
      v.chooseValue = chooseValue
      v.type = 1
    })
  }

  const { chooseValue, isSpAddressOpened } = state
  // const { province, city, district } = location
  // const locationValue = province + city + district

  return (
    <SpPage className='page-ecshopx-nearlyshop'>
      <View className='search-block'>
        <View className='search-bar'>
          <View className='region-picker'>
            <SpAddress isOpened={isSpAddressOpened} onClose={handleClickCloseSpAddress} onChange={onPickerChange}/>
            <View className='pick-title' onClick={handleClickOpenSpAddress}>
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
        <View className='block-title block-flex'>
          <View>我的收货地址</View>
          {address && (
            <View
              className='arrow'
              onClick={() =>
                Taro.navigateTo({ url: '/marketing/pages/member/address?isPicker=choose' })
              }
            >
              选择其他地址<View className='iconfont icon-qianwang-01'></View>
            </View>
          )}
        </View>
        <View className='receive-address'>
          {!address && (
            <SpLogin onChange={onChangeLoginSuccess}>
              <View className='btn-add-address' onClick={onAddChange}>
                添加新地址
              </View>
            </SpLogin>
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
        <SpScrollView ref={shopRef} className='shoplist-block' fetch={fetchShop}>
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
      <SpPrivacyModal
        open={policyModal}
        onCancel={() => setPolicyModal(false)}
        onConfirm={getLocationInfo}
      />
    </SpPage>
  )
}

export default NearlyShop
