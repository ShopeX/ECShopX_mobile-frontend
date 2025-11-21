/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
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
 * - from_scene: 目标页面类型 (必传, 如: from_scene=xxxx_xxx_xxx)
 * - 通过from_scene匹配对应的页面进行跳转
 *
 * 兼容旧的场景:
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
    if (routeParams?.gu || routeParams?.gu_user_id) {
      // 导购参数处理
      Taro.setStorageSync(SG_GUIDE_PARAMS, routeParams)
      Taro.setStorageSync(SG_GUIDE_PARAMS_UPDATETIME, dayjs().unix())
      if (S.getAuthToken()) {
        entryLaunch.postGuideUV() // 导购uv上报
        entryLaunch.postGuideTask() // 导购任务上报
      }
    }

    if (routeParams?.t == 1) {
      handlePrescription(routeParams)
    } else {
      handleShareLand(routeParams)
    }
  }

  // 处理落地页类型
  const handleShareLand = (routeParams) => {
    const { from_scene, ...otherParams } = routeParams
    const welcomeRoutes = {
      // 导购欢迎语
      'guide_welcome_home': '/pages/index', // 导购欢迎语--商城首页
      'guide_welcome_category': '/pages/category/index', // 导购欢迎语--商城分类页
      'guide_welcome_couponlist': '/subpages/marketing/coupon-center', // 导购欢迎语--商城优惠券中心
      'guide_welcome_recommend': '/pages/recommend/list', // 导购欢迎语--商城种草
      'guide_welcome_member': '/subpages/member/index', // 导购欢迎语--商城会员中心
      'guide_welcome_itemlist': '/pages/item/list', // 导购欢迎语--商城商品列表

      // 导购任务
      'guide_task_home': '/pages/index', // 导购任务-管理端-小程序首页
      'guide_task_gucustom': '/subpages/guide/custom/custom-page', // 导购任务-管理端-导购货架自定义页
      'guide_task_gucoupon': '/subpages/guide/coupon-home/index', // 导购任务-小程序-优惠券转发
      'guide_task_gugoods': '/subpages/guide/item/espier-detail', // 导购任务-小程序-商品转发
      'guide_task_goods': '/pages/item/espier-detail', // 导购任务-小程序-商品海报

      // 商城小程序
      'poster_home': '/pages/index', // 小程序-海报分享&页面转发-店务小店
      'poster_shop_home': '/marketing/pages/distribution/shop-home', // 小程序-海报分享&页面转发-店务小店
      'poster_espier_detail': '/pages/item/espier-detail', // 小程序-海报分享-商品详情
      'poster_espier_checkout': '/pages/cart/espier-checkout', // 小程序-海报分享&页面转发-结算页
      'poster_purchase_auth': '/pages/purchase/auth', // 小程序-海报分享&页面转发-内购邀请
      'poster_trade_detail': '/subpages/trade/detail', // 小程序-海报分享&页面转发-交易详情
      'poster_store_index': '/subpages/store/index', // 小程序-海报分享&页面转发-店铺首页
      'poster_custom_page': '/pages/custom/custom-page', // 小程序-海报分享&页面转发-自定义页
      'poster_recommend_detail': '/pages/recommend/detail', // 小程序-海报分享&页面转发-种草详情
      'poster_community_memberdetail': '/subpages/community/group-memberdetail', // 小程序-海报分享&页面转发-社区
      'poster_coupon_center': '/subpages/marketing/coupon-center', // 小程序-海报分享&页面转发-领券中心
      'poster_mdugc_detail': '/subpages/mdugc/note-detail', // 小程序-海报分享&页面转发-笔记详情
      'poster_pointshop_espier_detail': '/subpages/pointshop/espier-detail' // 小程序-海报分享&页面转发-积分商品详情
    }

    // 过滤掉内部使用的参数
    const filteredParams = { ...otherParams }
    delete filteredParams.scene
    delete filteredParams.$taroTimestamp
    const queryString = qs.stringify(filteredParams)

    const targetUrl = queryString
      ? `${welcomeRoutes[from_scene]}?${queryString}`
      : welcomeRoutes[from_scene]
    console.log('导购任务分享跳转:', targetUrl, welcomeRoutes[from_scene])

    if (welcomeRoutes[from_scene]) {
      Taro.redirectTo({ url: targetUrl })
    } else {
      showToast('页面跳转失败')
      setTimeout(() => {
        Taro.redirectTo({ url: '/pages/index' })
      }, 1500)
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
  const handleGeneralShare = (routeParams) => {
    // routeParams：pa
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
