import React, { useEffect, useCallback, useRef, useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Picker, Input } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import { SpPage, SpScrollView, SpLogin, SpPrivacyModal } from '@/components'
import { updateLocation, updateChooseAddress } from '@/store/slices/user'
import api from '@/api'
import CompShopItem from './comps/comp-shopitem'
import { usePage, useLogin } from '@/hooks'
import doc from '@/doc'
import { entryLaunch, pickBy, classNames, showToast, log, isArray } from '@/utils'

import './nearly-shop.scss'

const initialState = {
  areaArray: [[], [], []],
  areaIndexArray: [0, 0, 0],
  areaData: [],
  shopList: [],
  locationIng: false,
  chooseValue: ['北京市', '北京市', '昌平区'],
  keyword: '', // 参数
  type: 0, // 参数
  search_type: undefined // 参数
}

function NearlyShop(props) {
  const { isLogin, checkPolicyChange } = useLogin({
    autoLogin: false,
    policyUpdateHook: () => {
      setPolicyModal(true)
    }
  })
  const [state, setState] = useImmer(initialState)
  const [policyModal, setPolicyModal] = useState(false)
  const { location = {}, address } = useSelector((state) => state.user)
  const shopRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    fetchAddressList()
    // onPickerClick()
  }, [])

  const fetchAddressList = async () => {
    const areaList = await api.member.areaList()
    setState((v) => {
      v.areaData = areaList
    })
  }

  const fetchShop = async (params) => {
    const { pageIndex: page, pageSize } = params
    const { keyword } = state
    const [chooseProvice, chooseCity, chooseDistrict] = state.chooseValue
    const { province, city, district } = location
    const query = {
      page,
      pageSize,
      lat: location.lat,
      lng: location.lng,
      name: keyword,
      province: province || chooseProvice,
      city: city || chooseCity,
      area: district || chooseDistrict,
      type: location.lat ? state.type : 1,
      search_type: state.search_type,
      sort_type: 1
    }
    const { list, total_count: total, defualt_address } = await api.shop.list(query)

    setState((v) => {
      v.shopList = v.shopList.concat(pickBy(list, doc.shop.SHOP_ITEM))
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
    const res = await entryLaunch.getLnglatByAddress(location.address)
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

  const onPickerClick = () => {
    const [chooseProvice, chooseCity, chooseDistrict] = state.chooseValue
    const p_label = chooseProvice
    const c_label = chooseCity
    const d_label = chooseDistrict
    let chooseIndex = []
    let proviceArr = []
    let cityArr = []
    let countyArr = []
    state.areaData.map((item, index) => {
      proviceArr.push(item.label)
      if (item.label == p_label) {
        chooseIndex.push(index)
        item.children.map((c_item, c_index) => {
          cityArr.push(c_item.label)
          if (c_item.label == c_label) {
            chooseIndex.push(c_index)
            c_item.children.map((cny_item, cny_index) => {
              countyArr.push(cny_item.label)
              if (cny_item.label == d_label) {
                chooseIndex.push(cny_index)
              }
            })
          }
        })
      }
    })
    setState((v) => {
      v.areaIndexArray = chooseIndex
      v.areaArray = [proviceArr, cityArr, countyArr]
    })
  }

  const onPickerChange = async ({ detail }) => {
    const { value } = detail || {}
    const [one, two, three] = areaArray
    const chooseValue = [one[value[0]], two[value[1]], three[value[2]]]
    setState((v) => {
      v.areaIndexArray = value
      v.chooseValue = chooseValue
    })
  }

  const onColumnChange = ({ detail }) => {
    const { column, value } = detail
    let cityArr = []
    let countyArr = []
    if (column == 0) {
      cityArr = state.areaData[value].children.map((item) => item.label)
      countyArr = state.areaData[value].children[0].children.map((item) => item.label)
      setState((v) => {
        v.areaIndexArray[0] = value
        v.areaIndexArray[1] = 0
        v.areaIndexArray[2] = 0
        v.areaArray[1] = cityArr
        v.areaArray[2] = countyArr
      })
    } else if (column == 1) {
      countyArr = state.areaData[state.areaIndexArray[0]].children[value].children.map(
        (item) => item.label
      )
      setState((v) => {
        v.areaIndexArray[1] = value
        v.areaIndexArray[2] = 0
        v.areaArray[2] = countyArr
      })
    } else {
      setState((v) => {
        v.areaIndexArray[2] = value
      })
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
          v.type = 0
          v.search_type = undefined
        })
        shopRef.current.reset()
      }
    })
    setState((v) => {
      v.locationIng = false
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
    Taro.navigateTo({ url: `/pages/store/index?id=${item.distributor_id}` })
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
  }

  const { areaIndexArray, areaArray, chooseValue, showType } = state
  const { province, city, district } = location
  const locationValue = province + city + district

  return (
    <SpPage className='page-ecshopx-nearlyshop'>
      <View className='search-block'>
        <View className='search-bar'>
          <View className='region-picker'>
            <Picker
              mode='multiSelector'
              onClick={onPickerClick}
              onChange={onPickerChange}
              onColumnChange={onColumnChange}
              value={areaIndexArray}
              range={areaArray}
              style={{ width: '100%' }}
            >
              <View className='pick-title' onClick={onPickerClick}>
                <View className='iconfont icon-periscope'></View>
                <Text className='pick-address'>{chooseValue.join('') || '选择地区'}</Text>
                <Text className='iconfont icon-arrowDown'></Text>
              </View>
            </Picker>
          </View>

          <View className='search-comp-wrap'>
            <Text className='iconfont icon-sousuo-01'></Text>
            <Input
              className='search-comp'
              placeholder='输入收货地址寻找周边门店'
              confirmType='search'
              value={state.keyword}
              disabled={!location.address}
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
            {location.address || '无法获取您的位置信息'}
          </Text>
          <View className='btn-location' onClick={isPolicyTime}>
            <Text
              className={classNames('iconfont icon-zhongxindingwei', {
                active: state.locationIng
              })}
            ></Text>
            {location.address ? (state.locationIng ? '定位中...' : '重新定位') : '开启定位'}
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
