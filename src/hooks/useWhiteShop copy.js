/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro from '@tarojs/taro'
import api from '@/api'
import S from '@/spx'
import { pickBy, getDistributorId, entryLaunch, isEmpty } from '@/utils'
import doc from '@/doc'
import { useShopInfo } from '@/hooks'
import { updateShopInfo } from '@/store/slices/shop'
import { updateLocation } from '@/store/slices/user'
import { SG_ROUTER_PARAMS, SG_GUIDE_PARAMS } from '@/consts/localstorage'
import configStore from '@/store'

export default () => {
  const dispatch = useDispatch()
  const {
    entryStoreByStoreCode,
    entryStoreByGuideMaterial,
    enterStoreWhiteList, // 进入白名单会员店
    entryStoreByGuide,
    entryStoreByLBS,
    entryDefalutStore,
    guidderTemplateId
  } = useSelector((state) => state.sys)
  const { location } = useSelector((state) => state.user)

  const shopInfoRef = useRef(null)

  const checkStoreWhiteList = async (dtid, isLocation = true) => {
    const params = {}
    if (dtid) {
      params['distributor_id'] = dtid
    } else if (entryStoreByLBS && isLocation) {
      if (isEmpty(location)) {
        const locationInfo = await entryLaunch.getLocationInfo()
        dispatch(updateLocation(locationInfo))
        params['lat'] = locationInfo?.lat
        params['lng'] = locationInfo?.lng
      } else {
        params['lat'] = location?.lat
        params['lng'] = location?.lng
      }
    }
    // 开启店铺码进店
    const currentShopInfo = await api.shop.getShop(params)
    shopInfoRef.current = currentShopInfo
    // 如果请求的店铺ID和接口返回的店铺ID不一致（店铺可能关闭或禁用），此时需要根据兜底策略来决定跳转到引导页和默认店铺页
    if (
      dtid > 0 &&
      currentShopInfo.distributor_id !== 0 &&
      currentShopInfo.distributor_id !== dtid &&
      entryDefalutStore == '2'
    ) {
      Taro.redirectTo({
        url: `/pages/custom/custom-page?id=${guidderTemplateId}&fromConnect=davild`
      })
      throw new Error('TO_STORE_GUIDE_PAGE')
    }

    if (currentShopInfo.distributor_id !== 0 && currentShopInfo.open_divided == '1') {
      // 开启了店铺白名单
      if (!S.getAuthToken()) {
        throw new Error('AUTH_REQUIRED') // 去授权
      } else {
        throw new Error('CHECK_WHITE_LIST') // 去检查当前用户是否在店铺白名单中
      }
    } else {
      dispatch(updateShopInfo(currentShopInfo))
    }
  }

  // 检查进店规则
  const checkEnterStoreRule = async () => {
    const { dtid } = Taro.getStorageSync(SG_ROUTER_PARAMS)
    const { gu_user_id } = Taro.getStorageSync(SG_GUIDE_PARAMS) // gu_user_id = 导购工号
    // 路由带参
    if (dtid) {
      if (entryStoreByStoreCode) {
        // 开启店铺码进店
        await checkStoreWhiteList(dtid)
      } else {
        // 未开启店铺码进店
        await checkStoreWhiteList()
      }
    } else if (gu_user_id) {
      if (entryStoreByGuideMaterial) {
        // 导购绑定的店铺信息
        const guideStoreInfo = await api.shop.checkStoreEnterRule({
          work_userid: gu_user_id
        })
        if (guideStoreInfo?.distributor_id) {
          await checkStoreWhiteList(guideStoreInfo?.distributor_id, false)
        } else {
          // 兜底策略
          if (entryDefalutStore == '1') {
            // 当前导购未绑定店铺
            await checkStoreWhiteList(null, false)
          } else if (entryDefalutStore == '2') {
            Taro.redirectTo({
              url: `/pages/custom/custom-page?id=${guidderTemplateId}&fromConnect=davild`
            })
            throw new Error('TO_STORE_GUIDE_PAGE')
          }
        }
      } else {
        await checkStoreWhiteList()
      }
    } else {
      // 进入专属导购所属店
      if (entryStoreByGuide && S.getAuthToken()) {
        const guideStoreInfo = await api.shop.checkStoreEnterRule()
        if (guideStoreInfo?.distributor_id) {
          await checkStoreWhiteList(guideStoreInfo?.distributor_id)
        } else {
          // 兜底策略
          if (entryDefalutStore == '1') {
            // 当前导购未绑定店铺
            await checkStoreWhiteList(null, false)
          } else if (entryDefalutStore == '2') {
            Taro.redirectTo({
              url: `/pages/custom/custom-page?id=${guidderTemplateId}&fromConnect=davild`
            })
            throw new Error('TO_STORE_GUIDE_PAGE')
          }
        }
      } else if (enterStoreWhiteList && S.getAuthToken()) {
        // 进入白名单会员店
        const myShopInfo = await getUserWhiteShop()
        if (myShopInfo) {
          dispatch(updateShopInfo(myShopInfo))
        } else {
          await checkStoreWhiteList()
        }
      } else {
        await checkStoreWhiteList()
      }
    }
  }

  // 检查用户是否在白名单店铺
  const checkUserInStoreWhiteList = async () => {
    const { distributor_id } = shopInfoRef.current
    const { status } = await api.shop.checkUserInWhite({ distributor_id: distributor_id })
    if (status) {
      dispatch(updateShopInfo(shopInfoRef.current))
    }
    return status
  }

  const getUserWhiteShop = async () => {
    const list = await api.shop.getMyStoreWhiteList()
    return list.length > 0 ? list[0] : null
  }

  return {
    checkEnterStoreRule,
    checkStoreWhiteList,
    checkUserInStoreWhiteList,
    getUserWhiteShop
  }
}
