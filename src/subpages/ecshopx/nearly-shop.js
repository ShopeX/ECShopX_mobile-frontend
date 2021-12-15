import React, { useEffect, useCallback, useRef } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Text, Picker, Input } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import { SpPage, SpScrollView } from "@/components";
import { updateLocation } from "@/store/slices/user";
import api from '@/api'
import CompShopItem from './comps/comp-shopitem'
import { SG_APP_CONFIG } from '@/consts'
import { usePage } from '@/hooks'
import doc from '@/doc'
import { entryLaunch, pickBy, classNames, showToast, log } from "@/utils";

import './nearly-shop.scss'

const initialState = {
  areaArray: [],
  areaIndexArray: [0, 0, 0],
  areaData: [],
  shopList: [],
  keyword: '',
  locationIng: false,
  receiveAddress: {}
}

function NearlyShop( props ) {
  const { children } = props
  const [ state, setState ] = useImmer(initialState)
  const { location } = useSelector( state => state.user )
  const shopRef = useRef()
  
  const dispatch = useDispatch();
  // log.debug(`location: ${JSON.stringify(location)}`);
  useEffect( () => {
    fetchAddressList()  
  }, [])

  const fetchAddressList = async () => {
    const areaList = await api.member.areaList()
    const arrProvice = []
    const arrCity = []
    const arrCounty = []

    areaList.map((item, index) => {
      arrProvice.push(item.label)
      if (index === 0) {
        item.children.map((c_item, c_index) => {
          arrCity.push(c_item.label)
          if (c_index === 0) {
            c_item.children.map((cny_item) => {
              arrCounty.push(cny_item.label)
            })
          }
        })
      }
    })
    setState( v => {
      v.areaArray = [arrProvice, arrCity, arrCounty]
      v.areaData = areaList
    })
  }
  const fetchShop = async ( params ) => {
    const { pageIndex: page, pageSize } = params;
    const query = {
      page,
      pageSize,
      lat: location.lat,
      lng: location.lng,
      name: state.keyword
    };
    const {
      list,
      total_count: total,
      defualt_address = null,
      is_recommend,
    } = await api.shop.list(query);
    setState((v) => {
      v.shopList = v.shopList.concat( pickBy( list, doc.shop.SHOP_ITEM ) );
      v.receiveAddress = defualt_address;
    });

    return {
      total,
    };
  }


  const handleClickPicker = () => {
  }

  const regionChange = async ( e ) => {

  }


  const confirmSearch = async ({ detail }) => {
    const { lng, lat, error } = await entryLaunch.getLnglatByAddress( '上海市徐汇区宜山路' )
    if ( error ) {
      showToast(error)
    } else {
      setState((v) => {
        v.keyword = detail.value
        v.shopList = []
      })
      shopRef.current.reset()
    }
  }

  const bindMultiPickerColumnChange = ( e ) => {
    const { column, value } = e.detail
    let arrCity = []
    let arrCounty = []
    if ( column == 0 ) {
      arrCity = state.areaData[value].children.map(item => item.label)
      arrCounty = state.areaData[value].children[0].children.map( item => item.label )
      setState( v => {
        v.areaIndexArray[0] = value
        v.areaArray[1] = arrCity
        v.areaArray[2] = arrCounty
      })
    } else if ( column == 1 ) {
      arrCounty = state.areaData[state.areaIndexArray[0]].children[value].children.map( item => item.label )
      setState( v => {
        v.areaIndexArray[1] = value
        v.areaArray[2] = arrCounty
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
    const res = await entryLaunch.getCurrentAddressInfo()
    dispatch( updateLocation( res ) );
    setState((v) => {
      v.locationIng = false;
    });
  }

  const { receiveAddress } = state
  return (
    <SpPage className="page-ecshopx-nearlyshop">
      <View className="search-block">
        <View className="search-bar">
          <View className="region-picker">
            <Picker
              mode="multiSelector"
              onClick={handleClickPicker}
              onChange={regionChange}
              onColumnChange={bindMultiPickerColumnChange}
              value={state.multiIndex}
              range={state.areaArray}
            >
              <View className="pick-title">
                <Text className="pick-address">
                  {"选择地区"}
                </Text>
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
              onConfirm={confirmSearch}
            />
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
        <View className="block-title">我的收货地址</View>
        <View className="receive-address">
          {!receiveAddress && (
            <View
              className="btn-add-address"
              onClick={() =>
                Taro.navigateTo({ url: "/marketing/pages/member/edit-address" })
              }
            >
              添加新地址
            </View>
          )}
          {receiveAddress && (
            <View className="address-info-block">
              <View className="name-mobile">
                <Text className="receive-name">{receiveAddress.username}</Text>
                <Text className="receive-mobile">
                  {receiveAddress.telephone}
                </Text>
              </View>
              <View className="address">{`${receiveAddress.province}${receiveAddress.city}${receiveAddress.county}${receiveAddress.adrdetail}`}</View>
            </View>
          )}
        </View>
      </View>

      <View className="nearlyshop-list">
        <View className="list-title">附近商家</View>
        <SpScrollView ref={shopRef} className="shoplist-block" fetch={fetchShop}>
          {state.shopList.map((item, index) => (
            <View className="shop-item-wrapper" key={`shopitem-wrap__${index}`}>
              <CompShopItem info={item} />
            </View>
          ))}
        </SpScrollView>
      </View>
    </SpPage>
  );
}


export default NearlyShop