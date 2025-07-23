import { useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro from '@tarojs/taro'
import api from '@/api'
import S from '@/spx'
import { pickBy, getDistributorId } from '@/utils'
import doc from '@/doc'
import { useShopInfo } from '@/hooks'
import { updateShopInfo } from '@/store/slices/shop'
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

  const checkStoreWhiteList = async (dtid) => {
    const params = {}
    if (dtid) {
      params['distributor_id'] = dtid
    } else if (entryStoreByLBS) {
      params['lat'] = location?.lat
      params['lng'] = location?.lng
    }
    // 开启店铺码进店
    const currentShopInfo = await api.shop.getShop(params)
    shopInfoRef.current = currentShopInfo

    // 如果请求的店铺ID和接口返回的店铺ID不一致（店铺可能关闭或禁用），此时需要根据兜底策略来决定跳转到引导页和默认店铺页
    if (
      dtid > 0 &&
      currentShopInfo.distributor_id !== 0 &&
      currentShopInfo.distributor_id !== dtid &&
      entryDefalutStore === '2'
    ) {
      Taro.redirectTo({
        url: `/pages/custom/custom-page?id=${guidderTemplateId}&fromConnect=1`
      })
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
          await checkStoreWhiteList(guideStoreInfo?.distributor_id)
        } else {
          // 兜底策略
          if (entryDefalutStore === '1') {
            // 当前导购未绑定店铺
            await checkStoreWhiteList()
          } else if (entryDefalutStore === '2') {
            Taro.redirectTo({
              url: `/pages/custom/custom-page?id=${guidderTemplateId}&fromConnect=1`
            })
          }
        }
      } else {
        await checkStoreWhiteList()
      }
    } else {
      if (entryStoreByGuide && S.getAuthToken()) {
        const guideStoreInfo = await api.shop.checkStoreEnterRule()
        if (guideStoreInfo?.distributor_id) {
          await checkStoreWhiteList(guideStoreInfo?.distributor_id)
        } else {
          // 兜底策略
          if (entryDefalutStore === '1') {
            // 当前导购未绑定店铺
            await checkStoreWhiteList()
          } else if (entryDefalutStore === '2') {
            Taro.redirectTo({
              url: `/pages/custom/custom-page?id=${guidderTemplateId}&fromConnect=1`
            })
          }
        }
      } else if (enterStoreWhiteList && S.getAuthToken()) {
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

    // if (!S.getAuthToken()) {
    //   if (gu_user_id) {
    //     await api.shop.checkStoreEnterRule()
    //   } else if (typeof dtid === 'undefined') {
    //     let params = {}
    //     if (entryStoreByLBS) {
    //       params.lat = location?.lat
    //       params.lng = location?.lng
    //     }

    //     const shopInfo = await api.shop.getShop(params)
    //     console.log("🚀🚀🚀 ~ checkEnterStoreRule ~ shopInfo:", shopInfo)
    //     dispatch(updateShopInfo(shopInfo))
    //     // 获取店铺默认店铺，返回店铺id=0，则是虚拟店铺，店铺id!=0，则是真实店铺
    //     // 如果店铺id!=0，且店铺隔离开启，则跳转登录授权
    //     if (shopInfo.distributor_id !== 0 && shopInfo.open_divided == '1') {
    //       throw new Error('AUTH_REQUIRED')
    //     }

    //     // // 路由上没有店铺id，重定向到店铺引导页
    //     // Taro.redirectTo({
    //     //   url: `/pages/custom/custom-page?id=${guidderTemplateId}&fromConnect=1`
    //     // })
    //   } else {
    //     // 有店铺id
    //     const currentShopInfo = await api.shop.getShop({ distributor_id: dtid })
    //     if (currentShopInfo.open_divided == '1') {
    //       throw new Error('AUTH_REQUIRED')
    //     } else {
    //       dispatch(updateShopInfo(currentShopInfo))
    //     }
    //   }
    // } else {
    //   // 导购参数存在，则检查导购进店规则
    //   if (gu_user_id) {
    //     await api.shop.checkStoreEnterRule({
    //       type: 2,
    //       distributor_id: dtid,
    //       salesperson_id: gu_user_id
    //     })
    //   } else if (typeof dtid === 'undefined') {
    //     if (shopInfo.open_divided == '1') { // 店铺开启了白名单
    //       throw new Error('CHECK_WHITE_LIST')
    //     }
    //   } else {
    //     const currentShopInfo = await api.shop.getShop({ distributor_id: dtid })
    //     if (currentShopInfo.open_divided == '1') {
    //       throw new Error('CHECK_WHITE_LIST')
    //     } else {
    //       dispatch(updateShopInfo(currentShopInfo))
    //     }
    //   }
    // }
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
    checkUserInStoreWhiteList,
    getUserWhiteShop
  }
}
