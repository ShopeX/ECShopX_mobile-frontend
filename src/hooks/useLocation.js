/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'
import api from '@/api'
import entryLaunch from '@/utils/entryLaunch'
import { useSelector, useDispatch } from 'react-redux'
import { updateLocation } from '@/store/slices/user'
import S from '@/spx'

export default (props) => {
  const dispatch = useDispatch()
  const { location } = useSelector((state) => state.user)

  /**
   * 未登录状态 && 授权定位  == 定位
   * 未登录状态  && 不授权定位  == 默认值
   */
  const updateAddress = async () => {
    if (S.getAuthToken()) {
      await addressLogic()
    } else {
      const res1 = await fetchLocation()
      if (res1 instanceof Object && res1.lat) {
        dispatch(updateLocation(res1))
      }
    }
  }

  // 获取当前定位
  const fetchLocation = async () => {
    try {
      const res = await new Promise((resolve) => {
        entryLaunch.isOpenPosition((res1) => {
          resolve(res1)
        })
      })
      return res
    } catch (e) {
      console.error('获取地图位置信息失败:', e)
      throw e
    }
  }

  //处理地址
  const processingAddress = (res) => {
    if (res.length == 0) {
      return res
    } else {
      let arr = []
      res.forEach((element) => {
        arr.push({
          address: element.province + element.city + element.county + element.adrdetail,
          city: element.city,
          district: element.county,
          lat: element.lat,
          lng: element.lng,
          province: element.province
        })
      })
      return arr
    }
  }

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // 地球半径（单位：千米）

    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    const distance = R * c // 距离（单位：千米）
    return distance
  }

  // 地址距离比较
  const addressDistance = (ele, addressList) => {
    // let newarr = []
    // let newarrs = []

    // addressList.forEach((item) => {
    //   if (ele.province == item.province && ele.district == item.district && ele.city == item.city) {
    //     newarr.push(item)
    //   }
    // })
    // if (newarr.length > 0) {
    //   newarr.forEach((item) => {
    //     let res = S.calculateDistance(ele.lat, ele.lng, item.lat, item.lng)
    //     newarrs.push(res)
    //   })
    //   const minNumber = Math.min(...newarrs)
    //   const minIndex = newarrs.indexOf(minNumber)
    //   return newarr[minIndex]
    // } else {
    //   return ele
    // }
    let filteredList = addressList
      .filter(
        (item) =>
          ele.province == item.province && ele.district == item.district && ele.city == item.city
      )
      .map((item) => {
        item['distance'] = calculateDistance(ele.lat, ele.lng, item.lat, item.lng)
        return item
      })

    filteredList.sort((item1, item2) => item1.distance - item2.distance)

    return filteredList.length > 0 ? filteredList[0] : ele
  }

  /**
   * 登录状态下 && 打开定位
   * 1.当地址是空的 == 定位
   * 2.当地址不为空 && 在同一个城市 == 取最近地址
   * 3.当地址不为空 && 不在同一个城市 == 定位
   *
   * 登录状态下 && 关闭定位
   * 1.存在地址 == 取地址默认值，无默认值拿第一个
   * 2.不存在地址 == 默认值
   *
   */
  const addressLogic = async () => {
    const { list } = await api.member.addressList()
    const arr = await processingAddress(list)
    const res = await fetchLocation()
    // 开启定位
    if (res instanceof Object && res.lat) {
      if (arr.length == 0) {
        dispatch(updateLocation(res))
      } else {
        let res1 = await addressDistance(res, arr)
        dispatch(updateLocation(res1))
      }
    } else {
      if (arr.length > 0) {
        const arr1 = await processingAddress([list.find((obj) => obj.is_def === true) || list[0]])
        dispatch(updateLocation(arr1[0]))
      }
    }
  }

  return { updateAddress, calculateDistance }
}
