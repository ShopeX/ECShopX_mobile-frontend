import React, { useEffect, useCallback, useRef, useState } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Text, Picker, Input } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import { SpPage, SpScrollView, SpLogin } from "@/components";
import { updateLocation } from "@/store/slices/user";
import api from '@/api'
import CompShopItem from './comps/comp-shopitem'
import { SG_APP_CONFIG } from '@/consts'
import { usePage, useLogin } from '@/hooks'
import doc from '@/doc'
import { entryLaunch, pickBy, classNames, showToast, log, isArray } from "@/utils";

import './nearly-shop.scss'

const initialState = {
  areaArray: [[], [], []],
  areaIndexArray: [0, 0, 0],
  areaData: [],
  shopList: [],
  locationIng: false,
  receiveAddress: {},
  chooseValue: [],
  keyword: '', // 参数
  type: 0, // 参数
  search_type: undefined // 参数
}

function NearlyShop( props ) {
  const { children } = props
  const { isLogin } = useLogin({
    autoLogin: false
  })
  const [ state, setState ] = useImmer(initialState)
  const { location } = useSelector( state => state.user )
  const { address } = useSelector( state => state.address )
  const shopRef = useRef()
  
  const dispatch = useDispatch();
  // log.debug(`location: ${JSON.stringify(location)}`);
  useEffect( () => {
    fetchAddressList()
  }, [])

  const fetchAddressList = async () => {
    const areaList = await api.member.areaList()
    // let proviceArr = []
    // let cityArr = []
    // let countyArr = []

    // areaList.map((item, index) => {
    //   proviceArr.push(item.label)
    //   if (index === 0) {
    //     item.children.map((c_item, c_index) => {
    //       cityArr.push(c_item.label)
    //       if (c_index === 0) {
    //         c_item.children.map((cny_item) => {
    //           countyArr.push(cny_item.label)
    //         })
    //       }
    //     })
    //   }
    // })
    setState( v => {
      // v.areaArray = [proviceArr, cityArr, countyArr]
      v.areaData = areaList
    })
  }

  const fetchShop = async ( params ) => {
    const { pageIndex: page, pageSize } = params;
    const { keyword } = state
    const [ chooseProvice, chooseCity, chooseDistrict ] = state.chooseValue
    const { province, city, district } = location
    const query = {
      page,
      pageSize,
      lat: location.lat,
      lng: location.lng,
      name: keyword,
      province: chooseProvice || province,
      city: chooseCity || city,
      area: chooseDistrict || district,
      type: state.type,
      search_type: state.search_type,
      sort_type: 1
    };
    const {
      list,
      total_count: total,
      defualt_address,
      is_recommend,
    } = await api.shop.list(query);
    setState((v) => {
      v.shopList = v.shopList.concat( pickBy( list, doc.shop.SHOP_ITEM ) );
      v.receiveAddress = address ? address : !isArray(defualt_address) ? defualt_address : {}
    })

    return {
      total
    }
  }

  const onInputChange = ({ detail }) => {
    setState( v => {
      v.keyword = detail.value
    })
  }

  const onConfirmSearch = async ({ detail }) => {
    const res = await entryLaunch.getLnglatByAddress(location.address)
    const { lng, lat, error } = res
    dispatch(updateLocation(res))
    if ( error ) {
      showToast(error)
    } else {
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
    const [ chooseProvice, chooseCity, chooseDistrict ] = state.chooseValue
    const { province, city, district } = location
    const p_label = chooseProvice || province
    const c_label = chooseCity || city
    const d_label = chooseDistrict || district
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
    setState(v => {
      v.areaIndexArray = chooseIndex
      v.areaArray = [proviceArr, cityArr, countyArr]
    })
  }

  const onPickerChange = async ({ detail }) => {
    const { value } = detail || {}
    const [one, two, three] = areaArray
    const chooseValue = [one[value[0]], two[value[1]], three[value[2]]]
    setState(v => {
      v.areaIndexArray = value
      v.chooseValue = chooseValue
    })
  }

  const onColumnChange = ({ detail }) => {
    const { column, value } = detail
    let cityArr = []
    let countyArr = []
    if (column == 0) {
      cityArr = state.areaData[value].children.map(item => item.label)
      countyArr = state.areaData[value].children[0].children.map( item => item.label )
      setState( v => {
        v.areaIndexArray[0] = value
        v.areaIndexArray[1] = 0
        v.areaIndexArray[2] = 0
        v.areaArray[1] = cityArr
        v.areaArray[2] = countyArr
      })
    } else if (column == 1) {
      countyArr = state.areaData[state.areaIndexArray[0]].children[value].children.map( item => item.label )
      setState( v => {
        v.areaIndexArray[1] = value
        v.areaIndexArray[2] = 0
        v.areaArray[2] = countyArr
      })
    } else {
      setState( v => {
        v.areaIndexArray[2] = value
      })
    }
  }

  // 定位
  const getLocationInfo = async () => {
    setState( v => {
      v.locationIng = true
    })
    // const res = await entryLaunch.getCurrentAddressInfo()
    // dispatch( updateLocation( res ) );
    // console.log(res, 'res')
    // await entryLaunch.isOpenPosition(() => {
    //   setState(v => {
    //     v.shopList = []
    //     v.keyword = ''
    //     v.type = 0
    //     v.search_type = undefined
    //   })
    //   shopRef.current.reset()
    // })
    // setState((v) => {
    //   v.locationIng = false;
    // })

    await entryLaunch.isOpenPosition(async (res) => {
      if (res.lat) {
        dispatch(updateLocation(res))
        await setState(v => {
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
    await setState(v => {
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
    Taro.navigateTo({ url: "/marketing/pages/member/edit-address" })
  }

  const onChangeLoginSuccess = async () => {
    await setState(v => {
      v.shopList = []
      v.keyword = ''
      v.type = 0
      v.search_type = undefined
    })
    shopRef.current.reset()
  }

  const { receiveAddress, areaIndexArray, areaArray, chooseValue } = state
  const {province, city, district} = location
  const locationValue = province + city + district
  return (
    <SpPage className="page-ecshopx-nearlyshop">
      <View className="search-block">
        <View className="search-bar">
          <View className="region-picker">
            <Picker
              mode="multiSelector"
              onClick={onPickerClick}
              onChange={onPickerChange}
              onColumnChange={onColumnChange}
              value={areaIndexArray}
              range={areaArray}
              style={{ width: '100%' }}
            >
              <View className="pick-title">
                <View className='iconfont icon-periscope'></View>
                <Text className="pick-address">{chooseValue.join('') || locationValue || '选择地区'}</Text>
                <Text className="iconfont icon-arrowDown"></Text>
              </View>
            </Picker>
          </View>

          <View className="search-comp-wrap">
            <Text className="iconfont icon-sousuo-01"></Text>
            <Input
              className="search-comp"
              placeholder="输入收货地址寻找周边门店"
              confirmType="search"
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

      <View className="location-block">
        <View className="block-title">当前定位地址</View>
        <View className="location-wrap">
          <Text className="location-address">{location.address}</Text>
          <View className="btn-location" onClick={getLocationInfo}>
            <Text
              className={classNames("iconfont icon-zhongxindingwei", {
                active: state.locationIng,
              })}
            ></Text>
            {state.locationIng ? "定位中..." : "重新定位"}
          </View>
        </View>
        <View className="block-title block-flex">
          <View>我的收货地址</View>
          { JSON.stringify(receiveAddress) != "{}" &&
            <View
              className='arrow'
              onClick={() => Taro.navigateTo({ url: '/marketing/pages/member/address?isPicker=choose'})}
            >
            选择其他地址<View className='iconfont icon-qianwang-01'></View>
            </View>
          }
        </View>
        <View className="receive-address">
          {JSON.stringify(receiveAddress) == "{}" && (
            <SpLogin onChange={onChangeLoginSuccess}>
              <View
                className="btn-add-address"
                onClick={onAddChange}
              >
                添加新地址
              </View>
            </SpLogin>
          )}
          {JSON.stringify(receiveAddress) != "{}" && (
            <View className="address">{`${receiveAddress.province}${receiveAddress.city}${receiveAddress.county}${receiveAddress.adrdetail}`}</View>
          )}
        </View>
      </View>

      <View className="nearlyshop-list">
        <View className="list-title">附近商家</View>
        <SpScrollView ref={shopRef} className="shoplist-block" fetch={fetchShop}>
          {state.shopList.map((item, index) => (
            <View onClick={() => handleClickItem(item)} className="shop-item-wrapper" key={`shopitem-wrap__${index}`}>
              <CompShopItem info={item} />
            </View>
          ))}
        </SpScrollView>
      </View>
    </SpPage>
  );
}


export default NearlyShop