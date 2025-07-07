import React, { useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import dayjs from 'dayjs'
import { SG_ROUTER_PARAMS, SG_GUIDE_PARAMS, SG_GUIDE_PARAMS_UPDATETIME } from '@/consts'
import S from '@/spx'
import qs from 'qs'
import { entryLaunch, showToast } from '@/utils'

/**
 * path 页面路径（必穿参数）（参数格式 path=/pages/indes）
 * 其余参数会自动携带到path后面，不用手动处理
 * scene=uid%3D884%26id%3D121%26qr%3DY%26path%3D%2Fsubpages%2Fprescription%2Fprescription-information(页面参数，可供验证)
 * @returns
 */
function ShareIand() {
  const router = useRouter()

  useEffect(() => {
    resloveRouterParams()
  }, [])


  const resloveRouterParams = async () => {
    const routeParams = await entryLaunch.getRouteParams(router)
    Taro.setStorageSync(SG_ROUTER_PARAMS, routeParams)
    if (/^guide_welcome/.test(routeParams?.from_scene)) {
      // 导购欢迎语
      if (routeParams.from_scene == 'guide_welcome_home') {
        // 导购欢迎语--商城首页
        Taro.redirectTo({ url: '/pages/index' })
      } else if (routeParams.from_scene == 'guide_welcome_category') {
        // 导购欢迎语--商城分类页
        Taro.redirectTo({ url: '/pages/category/index' })
      } else if (routeParams.from_scene == 'guide_welcome_couponlist') {
        // 导购欢迎语--商城优惠券中心
        Taro.redirectTo({ url: '/subpages/marketing/coupon-center' })
      } else if (routeParams.from_scene == 'guide_welcome_recommend') {
        // 导购欢迎语--商城种草
        Taro.redirectTo({ url: '/pages/recommend/list' })
      } else if (routeParams.from_scene == 'guide_welcome_member') {
        // 导购欢迎语--商城会员中心
        Taro.redirectTo({ url: '/subpages/member/index' })
      } else if (routeParams.from_scene == 'guide_welcome_itemlist') {
        // 导购欢迎语--商城商品列表
        Taro.redirectTo({ url: '/pages/item/list' })
      } else {
        showToast('未匹配到参数')
      }

      // 欢迎语携带用户编号
      Taro.setStorageSync(SG_GUIDE_PARAMS, routeParams)
      Taro.setStorageSync(SG_GUIDE_PARAMS_UPDATETIME, dayjs().unix())

      if (S.getAuthToken()) {
        // entryLaunch.postGuideUV()
        entryLaunch.postGuideTask()
      }
    } else {
      // 分享的太阳码场景
      const _tempParams = {}
      if (routeParams?.t == 1) { // 处方药
        _tempParams.order_id = routeParams.oi
        _tempParams.prescription_order_random = routeParams.r
        Taro.redirectTo({ url: `/subpages/prescription/prescription-information?${qs.stringify(_tempParams)}` })
      }
    }
  }

  return null
}

export default ShareIand
