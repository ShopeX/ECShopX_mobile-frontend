import React, { useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import dayjs from 'dayjs'
import { SG_ROUTER_PARAMS, SG_GUIDE_PARAMS, SG_GUIDE_PARAMS_UPDATETIME } from '@/consts'
import S from '@/spx'
import qs from 'qs'
import { entryLaunch, showToast } from '@/utils'

/**
 * 统一分享落地页
 * 参数说明:
 * - target_path: 目标页面路径 (必传, 如: target_path=pages/index)
 * - 其余参数会自动携带到目标页面 target_path=pages/item/espier-detail&id=123
 * 
 * 兼容旧的场景:
 * - from_scene: 导购欢迎语场景
 * - t: 特殊场景标识(如处方药)
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
    if (routeParams?.gu || routeParams?.gu_user_id) { // 导购参数处理
      Taro.setStorageSync(SG_GUIDE_PARAMS, routeParams)
      Taro.setStorageSync(SG_GUIDE_PARAMS_UPDATETIME, dayjs().unix())
      if (S.getAuthToken()) {
        entryLaunch.postGuideUV() // 导购uv上报
        entryLaunch.postGuideTask() // 导购任务上报
      }
    }
    debugger
    
    // 处理导购欢迎语场景
    if (/^guide_welcome/.test(routeParams?.from_scene)) {
      handleGuideWelcome(routeParams)
      return
    }
    
    // 处理处方药场景
    if (routeParams?.t == 1) {
      handlePrescription(routeParams)
      return
    }
    
    // 处理通用分享场景
    if (routeParams?.target_path) {
      debugger
      handleGeneralShare(routeParams)
      return
    }
    
    // 默认跳转到首页
    Taro.redirectTo({ url: '/pages/index' })
  }

  // 处理导购欢迎语
  const handleGuideWelcome = (routeParams) => {
    const welcomeRoutes = {
      'guide_welcome_home': '/pages/index', // 导购欢迎语--商城首页
      'guide_welcome_category': '/pages/category/index', // 导购欢迎语--商城分类页
      'guide_welcome_couponlist': '/subpages/marketing/coupon-center', // 导购欢迎语--商城优惠券中心
      'guide_welcome_recommend': '/pages/recommend/list', // 导购欢迎语--商城种草
      'guide_welcome_member': '/subpages/member/index', // 导购欢迎语--商城会员中心
      'guide_welcome_itemlist': '/pages/item/list' // 导购欢迎语--商城商品列表
    }

    const targetUrl = welcomeRoutes[routeParams.from_scene]
    if (targetUrl) {
      Taro.redirectTo({ url: targetUrl })
    } else {
      showToast('未匹配到参数')
    }
  }

  // 处理处方药场景
  const handlePrescription = (routeParams) => {
    const params = {
      order_id: routeParams.oi,
      prescription_order_random: routeParams.r
    }
    Taro.redirectTo({ 
      url: `/subpages/prescription/prescription-information?${qs.stringify(params)}` 
    })
  }

  // 处理通用分享场景
  // 1、海报分享 pages/share-land?scene=share_id%3D68f2037ca18f8 通过shareid获取参数
  // 2、小程序转发 pages/share-land?target_path=pages/item/espier-detail&id=123
  // 3、其他小程序跳转过来 pages/share-land?target_path=pages/item/espier-detail&id=123
  // 4、小程序卡片跳转过来 pages/share-land?target_path=pages/item/espier-detail&id=123
  const handleGeneralShare = (routeParams) => { // routeParams：pa
    const { target_path, ...otherParams } = routeParams
    
    // 过滤掉内部使用的参数
    const filteredParams = { ...otherParams }
    delete filteredParams.scene
    delete filteredParams.$taroTimestamp
    
    // 确保路径以 / 开头
    let normalizedPath = target_path
    if (normalizedPath && !normalizedPath.startsWith('/')) {
      normalizedPath = '/' + normalizedPath
    }
    
    // 构建目标URL
    const queryString = qs.stringify(filteredParams)
    const targetUrl = queryString ? `${normalizedPath}?${queryString}` : normalizedPath
    
    console.log('通用分享跳转:', targetUrl)
    Taro.redirectTo({ url: targetUrl })
  }

  return null
}

export default ShareIand
