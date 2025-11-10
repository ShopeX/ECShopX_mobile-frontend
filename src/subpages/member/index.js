// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import Taro, { useDidShow, useShareAppMessage, getCurrentInstance } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { updateUserInfo, updateCheckChief } from '@/store/slices/user'
import { WgtsContext } from '@/pages/home/wgts/wgts-context'
import { platformTemplateName } from '@/utils/platform'
import { View, Text } from '@tarojs/components'
import { SG_APP_CONFIG } from '@/consts'
import { useSelector, useDispatch } from 'react-redux'
import HomeWgts from '@/pages/home/comps/home-wgts'
import { useImmer } from 'use-immer'
import S from '@/spx'
import qs from 'qs'
import req from '@/api/req'
import { buildSharePath } from '@/utils'

import { SpLogin, SpImage, SpTabbar, SpPage, SpCell } from '@/components'
import api from '@/api'
import {
  navigateTo,
  getThemeStyle,
  styleNames,
  classNames,
  showToast,
  showModal,
  isWeixin,
  normalizeQuerys,
  log,
  VERSION_PLATFORM,
  VERSION_STANDARD,
  VERSION_SHUYUN,
  getDistributorId
} from '@/utils'
import {
  updatePurchaseShareInfo,
  updateInviteCode,
  updateCurDistributorId,
  updateIsOpenPurchase
} from '@/store/slices/purchase'
import { useLogin, useLocation } from '@/hooks'
import { updateDeliveryPersonnel } from '@/store/slices/cart'

import CompMenu from './comps/comp-menu'
import './index.scss'

const initialConfigState = {
  banner: {
    isShow: false,
    loginBanner: '',
    noLoginBanner: '',
    pageUrl: '',
    urlOpen: false,
    appId: null
  },
  menu: {
    pointMenu: false, // 积分菜单
    activity: false, // 活动预约
    offline_order: false, // 线下订单
    boost_activity: false, // 助力活动
    boost_order: false, // 助力订单
    complaint: false, // 投诉记录
    community_order: false, // 社区团购订单
    community_group_enable: false, // 社区团购
    ext_info: false,
    group: false, // 我的拼团
    member_code: false, // 会员二维码
    recharge: false, // 储值
    ziti_order: false, // 自提
    share_enable: false, // 分享
    memberinfo_enable: false, // 个人信息
    tenants: true, //商家入驻
    purchase: true, // 员工内购
    dianwu: false, // 店务,
    community: false, // 社区
    salesman: true
  },
  infoAppId: '',
  infoPage: '',
  infoUrlIsOpen: true,
  pointAppId: '',
  pointPage: '',
  pointUrlIsOpen: true,
  memberConfig: {
    // defaultImg: null,
    vipImg: null
  },
  purchaseRes: {}
}

const initialState = {
  // favCount: 0,
  point: 0,
  couponCount: 0,
  username: '',
  avatar: '',
  mobile: '',
  // waitPayNum: 0,
  // waitSendNum: 0,
  // waitRecevieNum: 0,
  // waitEvaluateNum: 0,
  // afterSalesNum: 0,
  zitiNum: 0,
  deposit: 0,
  salesPersonList: {},
  deliveryStaffList: [], //配送员
  wgts: [],
  loading: true,
  shareInfo: {},
  footerHeight: 0,
  pageData: null,
  shareInfo: {}
}

function MemberIndex(props) {
  // console.log('===>getCurrentPages==>', getCurrentPages(), getCurrentInstance())
  const $instance = getCurrentInstance()
  const { updateAddress } = useLocation()
  const { isLogin, getUserInfo, isNewUser } = useLogin({
    autoLogin: false,
    // policyUpdateHook: (isUpdate) => {
    //   // isUpdate && setPolicyModal(true)
    //   if (isUpdate) {
    //     RefLogin.current._setPolicyModal()
    //   }

    loginSuccess: () => {
      updateAddress()
    }
  })
  const [config, setConfig] = useImmer(initialConfigState)
  const [state, setState] = useImmer(initialState)
  const [policyModal, setPolicyModal] = useState(false)

  const { userInfo = {}, vipInfo = {} } = useSelector((state) => state.user)
  const { pointName } = useSelector((state) => state.sys)
  log.debug(`store userInfo: ${JSON.stringify(userInfo)}`)
  const dispatch = useDispatch()

  useEffect(() => {
    if (isLogin) {
      getMemberCenterData()
      setMemberBackground()
      getEmployeeIsOpen()
      const { redirect } = $instance.router.params
      if (redirect) {
        Taro.redirectTo({ url: decodeURIComponent(redirect) })
      }
    }
  }, [isLogin])

  useEffect(() => {
    getMemberCenterConfig()
    // 白名单
    getSettings()
    fetchWgts()
  }, [])

  useDidShow(() => {
    if (isLogin) {
      getUserInfo()
      getMemberCenterData()
    }
  })

  const fetchWgts = async () => {
    try {
      const pathparams = qs.stringify({
        template_name: platformTemplateName,
        version: 'v1.0.1',
        page_name: 'custom_my'
      })
      const url = `/pageparams/setting?${pathparams}`
      const { config = [], share } = await req.get(url)
      console.log('🚀🚀🚀 ~ fetchWgts ~ config:', config, share)
      const pageData = config.find((wgt) => wgt.name == 'page')
      setState((draft) => {
        draft.wgts = config
        draft.pageData = pageData
        draft.loading = false
        draft.shareInfo = share
      })
    } catch (error) {
      console.log('🚀🚀🚀 ~ fetchWgts ~ error:', error)
      setState((draft) => {
        draft.wgts = []
        draft.loading = false
        draft.shareInfo = {}
      })
    }
  }

  async function getSettings() {
    const { whitelist_status = false } = await api.shop.homeSetting()
    // 白名单配置
    Taro.setStorageSync(SG_APP_CONFIG, {
      whitelist_status
    })
  }

  // 分享
  useShareAppMessage(async (res) => {
    const { share_title, share_pic_wechatapp } = await api.member.getMemberShareConfig()
    const { logo } = await api.distribution.getDistributorInfo({
      distributor_id: 0
    })
    const path = buildSharePath('poster_home', {})
    return {
      title: state.shareInfo.page_share_title || share_title,
      imageUrl: state.shareInfo.page_share_imageUrl || share_pic_wechatapp || logo,
      path: path
    }
  })

  const getEmployeeIsOpen = async () => {
    const purchaseRes = await api.purchase.getEmployeeIsOpen()
    setConfig((draft) => {
      draft.purchaseRes = purchaseRes
    })
    dispatch(updateIsOpenPurchase(purchaseRes.is_open))
  }

  const getMemberCenterConfig = async () => {
    const [bannerRes, menuRes, redirectRes, pointShopRes] = await Promise.all([
      // 会员中心banner
      await api.shop.getPageParamsConfig({
        page_name: 'member_center_setting'
      }),
      // 菜单自定义
      await api.shop.getPageParamsConfig({
        page_name: 'member_center_menu_setting'
      }),
      // 积分跳转配置
      await api.shop.getPageParamsConfig({
        page_name: 'member_center_redirect_setting'
      }),
      // 积分商城
      await api.pointitem.getPointitemSetting()
    ])
    let banner,
      menu,
      redirectInfo = {}

    if (bannerRes.list.length > 0) {
      const { app_id, is_show, login_banner, no_login_banner, page, url_is_open } =
        bannerRes.list[0].params.data
      banner = {
        isShow: is_show,
        loginBanner: login_banner,
        noLoginBanner: no_login_banner,
        pageUrl: page,
        urlOpen: url_is_open,
        appId: app_id
      }
    }
    if (menuRes.list.length > 0) {
      menu = { ...menuRes.list[0].params.data }
    }
    if (S.getAuthToken() && (VERSION_PLATFORM || VERSION_STANDARD)) {
      const { result, status } = await api.member.is_admin()
      console.log('env:result', result)
      console.log('env:status', status)
      S.set('DIANWU_CONFIG', result, status)
      menu = {
        ...menu,
        dianwu: status
      }
    }
    if (redirectRes.list.length > 0) {
      const {
        info_app_id,
        info_page,
        info_url_is_open,
        point_app_id,
        point_page,
        point_url_is_open
      } = redirectRes.list[0].params.data
      redirectInfo = {
        infoAppId: info_app_id,
        infoPage: info_page,
        infoUrlIsOpen: info_url_is_open,
        pointAppId: point_app_id,
        pointPage: point_page,
        pointUrlIsOpen: point_url_is_open
      }
    }

    setConfig((draft) => {
      draft.banner = banner
      draft.menu = {
        ...menu,
        pointMenu: pointShopRes.entrance.mobile_openstatus
      }
      draft.infoAppId = redirectInfo.info_app_id
      draft.infoPage = redirectInfo.info_page
      draft.infoUrlIsOpen = redirectInfo.info_url_is_open
      draft.pointAppId = redirectInfo.point_app_id
      draft.pointPage = redirectInfo.point_page
      draft.pointUrlIsOpen = redirectInfo.point_url_is_open
    })
  }

  const setMemberBackground = async () => {
    let memberRes = await api.member.memberInfo()
    let deliveryPersonnel = memberRes?.deliveryStaffList?.list.map((item) => item.operator_id) ?? []
    setConfig((draft) => {
      draft.memberConfig = {
        // defaultImg: memberRes?.cardInfo?.background_pic_url,
        vipImg: memberRes?.vipgrade?.background_pic_url,
        backgroundImg: memberRes?.memberInfo?.gradeInfo?.background_pic_url
      }
    })
    setState((draft) => {
      draft.deposit = memberRes.deposit / 100
      draft.salesPersonList = memberRes?.salesPersonList
      draft.deliveryStaffList = memberRes?.deliveryStaffList
      draft.point = memberRes?.point
    })

    dispatch(
      updateDeliveryPersonnel({ self_delivery_operator_id: deliveryPersonnel, distributor_id: '' })
    ) //存配送员信息
    dispatch(updateUserInfo(memberRes))
  }

  const getMemberCenterData = async () => {
    const resTrade = await api.trade.getCount()
    const resAssets = await api.member.memberAssets()
    const { discount_total_count } = resAssets

    const {
      normal_payed_daiziti // 待自提订单
    } = resTrade

    setState((draft) => {
      // draft.favCount = fav_total_count
      // draft.point = point_total_count
      // draft.waitPayNum = normal_notpay_notdelivery
      // draft.waitSendNum = normal_payed_daifahuo
      // draft.waitRecevieNum = normal_payed_daishouhuo
      // draft.afterSalesNum = aftersales
      // draft.waitEvaluateNum = normal_not_rate
      draft.couponCount = discount_total_count
      draft.zitiNum = normal_payed_daiziti
    })
  }

  const handlePopularChange = async () => {
    // 推广跳转
    // 已经是分销员
    if (userInfo.isPromoter) {
      Taro.navigateTo({ url: link })
    } else {
      const { confirm } = await Taro.showModal({
        title: '邀请推广',
        content: '确定申请成为推广员？',
        showCancel: true,
        cancel: '取消',
        confirmText: '确认',
        confirmColor: '#0b4137'
      })
      if (!confirm) return
      const { status } = await api.distribution.become()
      if (status) {
        Taro.showModal({
          title: '恭喜',
          content: '已成为推广员',
          showCancel: false,
          confirmText: '好'
        })
      }
    }
  }

  const handlePurchaseChange = async () => {
    const data = await api.purchase.getUserEnterprises({
      disabled: 0,
      distributor_id: getDistributorId()
    })
    if (data?.length > 0) {
      Taro.navigateTo({ url: '/subpages/purchase/select-identity?is_redirt=1' })
    } else {
      Taro.navigateTo({ url: '/pages/purchase/auth' })
    }
    dispatch(updatePurchaseShareInfo())
    dispatch(updateInviteCode())
    dispatch(updateCurDistributorId(null))
  }

  const handleClickLink = async (link) => {
    // await getUserInfoAuth()
    Taro.navigateTo({ url: link })
  }

  const handleClickService = async (item) => {
    const { link, key } = item
    // 分销推广
    if (key == 'popularize') {
      // 已经是分销员
      if (userInfo.isPromoter) {
        Taro.navigateTo({ url: link })
      } else {
        const { confirm } = await Taro.showModal({
          title: '邀请推广',
          content: '确定申请成为推广员？',
          showCancel: true,
          cancelText: '取消',
          confirmText: '确认',
          confirmColor: '#0b4137'
        })
        if (!confirm) return
        const { status } = await api.distribution.become()
        if (status) {
          Taro.showModal({
            title: '恭喜',
            content: '已成为推广员',
            showCancel: false,
            confirmText: '好'
          })
        }
      }
      return
    }
    if (key == 'useinfo') {
      const { infoAppId, infoPage, infoUrlIsOpen } = config
      if (infoUrlIsOpen) {
        Taro.navigateToMiniProgram({
          appId: infoAppId,
          path: infoPage
        })
      }
    }
    if (key == 'community') {
      const res = await api.community.checkChief()
      dispatch(updateCheckChief(res))
      if (res.status) {
        Taro.navigateTo({ url: link })
      } else {
        Taro.navigateTo({ url: `/subpages/community/order` })
      }
    }

    if (key == 'purchase') {
      const data = await api.purchase.getUserEnterprises({
        disabled: 0,
        distributor_id: getDistributorId()
      })
      if (data?.length > 0) {
        Taro.navigateTo({ url: '/subpages/purchase/select-identity?is_redirt=1' })
      } else {
        Taro.navigateTo({ url: '/pages/purchase/auth' })
      }
      dispatch(updatePurchaseShareInfo())
      dispatch(updateInviteCode())
      dispatch(updateCurDistributorId(null))
      return
    }

    if (link) {
      Taro.navigateTo({ url: link })
    }
  }

  const onLoginChange = (url) => {
    if (!isLogin || !url) return
    Taro.navigateTo({ url })
  }

  const VipGradeDom = () => {
    return (
      <View
        className='user-grade-name'
        onClick={() => onLoginChange('/subpages/member/member-level')}
      >
        <Text>
          {
            {
              true: vipInfo.grade_name || '会员',
              false: userInfo?.gradeInfo?.grade_name || ''
            }[vipInfo.isVip]
          }
        </Text>
        <SpImage src='fv_chevron_right.png' width={40} />
      </View>
    )
  }

  if (!config) {
    return null
  }

  const memberBckStyle = {
    background: `url('${userInfo?.gradeInfo?.grade_background}') no-repeat center center / cover`
  }

  return (
    <SpPage
      className='pages-member-index'
      immersive={state.pageData?.base?.isImmersive}
      pageConfig={state.pageData?.base || {}}
      renderFooter={<SpTabbar height={state.footerHeight} />}
      title='会员中心'
      onReady={({ footerHeight }) => {
        setState((draft) => {
          draft.footerHeight = footerHeight
        })
        console.log('onReady', footerHeight)
      }}
    >
      <View className='user-info-card-wrapper' style={{ paddingBottom: state.footerHeight }}>
        <View
          className='header-block'
          style={userInfo?.gradeInfo?.grade_background ? memberBckStyle : {}}
        >
          <SpLogin newUser={isNewUser} className='user-info-card'>
            <View className='user-info-header'>
              <View
                className='user-avatar'
                onClick={() => onLoginChange('/subpages/member/user-info')}
                style={{ width: '72px', height: '72px' }}
              >
                <SpImage
                  className='avatar-img'
                  src={(userInfo && userInfo.avatar) || 'user_icon.png'}
                  width={144}
                  height={144}
                />
              </View>

              <View className='user-details'>
                {isLogin ? (
                  <>
                    <View
                      className='user-name'
                      onClick={() => onLoginChange('/subpages/member/user-info')}
                    >
                      {userInfo?.username || userInfo?.mobile}
                    </View>
                    <View className='user-vip-wrapper'>
                      <View className='join-us'>{VipGradeDom()}</View>
                      {/* <SpImage
                        src={`fv_member_level_${getMemberLevel(userInfo?.gradeInfo)}.png`}
                        width={146}
                        height={32}
                        mode='widthFix'
                      /> */}
                    </View>
                  </>
                ) : (
                  <Text className='login-text font-medium text-34'>点击登录</Text>
                )}
              </View>

              <View className='qr-code-btn'>
                {/* <SpImage
                  src={`fv_member_level_${getMemberLevel(userInfo?.gradeInfo)}_bg.png`}
                  className='qr-code-img'
                  width={120}
                  height={88}
                  mode='widthFix'
                />
                <SpImage
                  src='fv_member_level_bg.png'
                  width={120}
                  height={88}
                  mode='widthFix'
                  className='member-level-bg'
                /> */}
                {isLogin && config.menu.member_code && !VERSION_SHUYUN && (
                  <Text
                    className='iconfont icon-erweima-01'
                    onClick={() => onLoginChange('/marketing/pages/member/member-code')}
                  ></Text>
                )}
              </View>
            </View>

            <View className='user-stats'>
              <View
                className='stat-item'
                onClick={() => onLoginChange('/subpages/marketing/coupon')}
              >
                <Text className='stat-value'>{isLogin ? state.couponCount || 0 : '···'}</Text>
                <Text className='stat-label'>优惠券</Text>
              </View>
                
              <View className='stat-item' onClick={() => onLoginChange('/subpages/member/point-detail')}>
                <Text className='stat-value'>{isLogin ? state.point || 0 : '···'}</Text>
                <Text className='stat-label'>积分</Text>
              </View>
            </View>
          </SpLogin>
          {/* <View className='header-block__ft'></View> */}
        </View>

        <WgtsContext.Provider value={{}}>
          <HomeWgts wgts={state.wgts} />
        </WgtsContext.Provider>

        <CompMenu
          accessMenu={{
            purchase: config.purchaseRes.is_open,
            popularize: userInfo ? userInfo.popularize : false,
            salesPersonList: state.salesPersonList,
            deliveryStaffList: state.deliveryStaffList,
            dianwu: config.menu.dianwu
          }}
          zitiNum={state.zitiNum}
          isPromoter={userInfo ? userInfo.isPromoter : false}
          onLink={handleClickService}
        />
      </View>
    </SpPage>
  )
}

export default MemberIndex
