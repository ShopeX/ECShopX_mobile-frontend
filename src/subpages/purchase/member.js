import Taro, {
  useDidShow,
  useShareAppMessage,
  getCurrentPages,
  getCurrentInstance
} from '@tarojs/taro'
import { useState, useEffect, useCallback, useRef } from 'react'
import { View, ScrollView, Text, Image, Button } from '@tarojs/components'
import { SG_ROUTER_PARAMS, SG_APP_CONFIG, MERCHANT_TOKEN, SG_TOKEN } from '@/consts'
import { updateUserInfo } from '@/store/slices/user'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'

import {
  SpLogin,
  SpImage,
  SpPrice,
  CouponModal,
  SpModal,
  SpPrivacyModal,
  SpTabbar,
  SpPage
} from '@/components'
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
  isEmpty,
  VERSION_IN_PURCHASE,
  VERSION_PLATFORM
} from '@/utils'
import { useLogin } from '@/hooks'
import S from '@/spx'
import CompVipCard from './comps/comp-vipcard'
import CompBanner from './comps/comp-banner'
import CompPanel from './comps/comp-panel'
import CompMenu from './comps/comp-menu'
import CompHelpCenter from './comps/comp-helpcenter'
import './member.scss'

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
    community_order: false, // 社区团购
    ext_info: false,
    group: false, // 我的拼团
    member_code: false, // 会员二维码
    recharge: false, // 储值
    ziti_order: false, // 自提
    share_enable: false, // 分享
    memberinfo_enable: false, // 个人信息
    dianwu: false, // 店务,
    tenants: true, //商家入驻
    purchase: true, // 员工内购
    collection: true // 我的收藏
  },
  infoAppId: '',
  infoPage: '',
  infoUrlIsOpen: true,
  pointAppId: '',
  pointPage: '',
  pointUrlIsOpen: true,
  memberConfig: {
    defaultImg: false,
    vipImg: false
  },
  whitelist_status: false
}

const initialState = {
  favCount: 0,
  point: 0,
  couponCount: 0,
  username: '',
  avatar: '',
  mobile: '',
  waitPayNum: 0,
  waitSendNum: 0,
  waitRecevieNum: 0,
  waitEvaluateNum: 0,
  afterSalesNum: 0,
  zitiNum: 0,
  deposit: 0,
  purchaseInfo: {}
}

function MemberIndex(props) {
  console.log('===>getCurrentPages==>', getCurrentPages(), getCurrentInstance())
  const { isLogin, isNewUser, getUserInfoAuth } = useLogin({
    autoLogin: true,
    policyUpdateHook: () => {
      setPolicyModal(true)
    }
  })
  const [config, setConfig] = useImmer(initialConfigState)
  const [state, setState] = useImmer(initialState)
  const [policyModal, setPolicyModal] = useState(false)

  const { userInfo = {}, vipInfo = {} } = useSelector((state) => state.user)
  log.debug(`store userInfo: ${JSON.stringify(userInfo)}`)
  const { purchaseInfo, whitelist_status } = state
  const dispatch = useDispatch()

  useEffect(() => {
    if (isLogin) {
      getMemberCenterData()
      setMemberBackground()
      fetchPurchase()
    }
  }, [isLogin])

  useEffect(() => {
    getMemberCenterConfig()
    getSettings()
  }, [])

  useDidShow(() => {
    if (S.get(MERCHANT_TOKEN, true)) {
      S.delete(MERCHANT_TOKEN, true)
    }
    if (S.get(SG_TOKEN)) {
      setHeaderBlock()
    }
  })

  const fetchPurchase = async () => {
    // 内购分享码
    const { code: purchaseCode } = Taro.getStorageSync(SG_ROUTER_PARAMS)
    // 员工、家属
    const { is_employee, is_dependent } = userInfo
    if (purchaseCode && !is_employee && !is_dependent) {
      await api.purchase.purchaseBind({ code: purchaseCode })
    }
    const data = await api.purchase.purchaseInfo()
    setState((draft) => {
      draft.purchaseInfo = data
    })
  }

  async function getSettings() {
    const { whitelist_status = false } = await api.shop.homeSetting()
    setState((draft) => {
      draft.whitelist_status = whitelist_status
    })
    // 白名单配置
    Taro.setStorageSync(SG_APP_CONFIG, {
      whitelist_status
    })
  }

  // 分享
  useShareAppMessage(async (res) => {
    const { share_title = '震惊！这店绝了！', share_pic_wechatapp } =
      await api.member.getMemberShareConfig()
    const { logo } = await api.distribution.getDistributorInfo({
      distributor_id: 0
    })
    return {
      title: share_title,
      imageUrl: share_pic_wechatapp || logo,
      path: '/pages/index'
    }
  })

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
      menu = { ...menuRes.list[0].params.data, purchase: true }
    }
    // if (S.getAuthToken() && (VERSION_PLATFORM || VERSION_IN_PURCHASE)) {
    //   const { result, status } = await api.dianwu.is_admin()
    //   S.set('DIANWU_CONFIG', result, status)
    //   menu = {
    //     ...menu,
    //     dianwu: status
    //   }
    // }
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
        ...config.menu,
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
    setConfig((draft) => {
      draft.memberConfig = {
        defaultImg: memberRes?.cardInfo?.background_pic_url,
        vipImg: memberRes?.vipgrade?.background_pic_url,
        backgroundImg: memberRes?.memberInfo?.gradeInfo?.background_pic_url
      }
    })
    setState((draft) => {
      draft.deposit = memberRes.deposit
    })
    dispatch(updateUserInfo(memberRes))
  }

  const setHeaderBlock = async () => {
    const resAssets = await api.member.memberAssets()
    const { fav_total_count, point_total_count } = resAssets
    setState((draft) => {
      draft.favCount = fav_total_count
      draft.point = point_total_count
    })
  }

  const getMemberCenterData = async () => {
    const resTrade = await api.trade.getCount()
    // 大转盘

    // await setHeaderBlock()

    const {
      aftersales, // 待处理售后
      normal_notpay_notdelivery, // 未付款未发货
      normal_payed_daifahuo, // 待发货
      normal_payed_daishouhuo, // 待收货
      normal_payed_daiziti, // 待自提订单
      normal_not_rate // 待评论
    } = resTrade

    setState((draft) => {
      draft.waitPayNum = normal_notpay_notdelivery
      draft.waitSendNum = normal_payed_daifahuo
      draft.waitRecevieNum = normal_payed_daishouhuo
      draft.afterSalesNum = aftersales
      draft.zitiNum = normal_payed_daiziti
      draft.waitEvaluateNum = normal_not_rate
    })
  }

  const handleClickLink = async (link) => {
    await getUserInfoAuth()
    Taro.navigateTo({ url: link })
  }

  const handleClickService = async (item) => {
    const { link, key } = item
    await getUserInfoAuth(key !== 'tenants')
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
    if ((isEmpty(purchaseInfo) || !whitelist_status) && VERSION_IN_PURCHASE && key == 'purchase') {
      showToast('暂无权限，请联系管理员')
      return
    }
    if (link) {
      Taro.navigateTo({ url: link })
    }
  }

  const VipGradeDom = () => {
    if (isLogin) {
      return (
        <View className='gradename'>
          {
            userInfo?.is_employee && '员工'
          }
          {
            userInfo?.is_dependent && '员工亲友'
          }
        </View>
      )
    } else {
      return (
        <SpLogin newUser={isNewUser}>
          <Text className='join-us-txt'>加入我们?</Text>
        </SpLogin>
      )
    }
  }

  if (!config) {
    return null
  }

  // console.log(`member page:`, state, config);

  const { memberConfig } = config

  console.log('====config===', config.menu)

  return (
    <SpPage className='page-purchase-member' renderFooter={<SpTabbar />}>
      <View
        className='header-block'
        style={styleNames({
          'background-image': `url(${process.env.APP_IMAGE_CDN}/m_bg.png)`
        })}
      >
        <View className='header-hd'>
          <SpImage
            className='usericon'
            src={(userInfo && userInfo.avatar) || 'default_user.png'}
            width='110'
            onClick={handleClickLink.bind(this, '/marketing/pages/member/userinfo')}
          />
          <View className='header-hd__body'>
            <View className='username-wrap'>
              <Text className='username'>
                {(userInfo && (userInfo.username || userInfo.mobile)) || '获取昵称'}
              </Text>
            </View>
            <View className='join-us'>{VipGradeDom()}</View>
          </View>
        </View>
        <View className='header-bd'>
          <View className='bd-item'>
            <View className='bd-item-label'>总额度</View>
            <View className='bd-item-value'>
              {isLogin
                ? purchaseInfo.total_limitfee
                  ? (purchaseInfo.total_limitfee / 100).toFixed(2)
                  : '0.00'
                : '****'}
            </View>
          </View>
          <View className='bd-item'>
            <View className='bd-item-label'>已使用额度</View>
            <View className='bd-item-value'>
              {isLogin
                ? purchaseInfo.used_limitfee
                  ? (purchaseInfo.used_limitfee / 100).toFixed(2)
                  : '0.00'
                : '****'}
            </View>
          </View>
          <View className='bd-item deposit-item'>
            <View className='bd-item-label'>剩余额度</View>
            <View className='bd-item-value'>
              {isLogin
                ? purchaseInfo.surplus_limitfee
                  ? (purchaseInfo.surplus_limitfee / 100).toFixed(2)
                  : '0.00'
                : '****'}
            </View>
          </View>
          {/* <View className='bd-item' onClick={handleClickLink.bind(this, '/pages/member/item-fav')}>
            <View className='bd-item-label'>收藏(个)</View>
            <View className='bd-item-value'>{state.favCount}</View>
          </View> */}
        </View>
        <View className='header-ft'>
          {/* 会员卡等级 */}
          {vipInfo.isOpen && (
            <CompVipCard
              info={vipInfo}
              onLink={handleClickLink.bind(this, '/subpage/pages/vip/vipgrades')}
              userInfo={userInfo}
              memberConfig={memberConfig}
            />
          )}
        </View>
      </View>

      <View className='body-block'>
        {config.banner?.isShow && (
          <CompBanner
            info={config.banner}
            src={isLogin ? config.banner.loginBanner : config.banner.noLoginBanner}
          />
        )}

        <CompPanel
          title='订单'
          extra='查看全部订单'
          onLink={handleClickLink.bind(this, '/subpage/pages/trade/list?evaluate=0')}
        >
          {config.menu.ziti_order && (
            <View
              className='ziti-order'
              onClick={handleClickLink.bind(this, '/subpage/pages/trade/customer-pickup-list')}
            >
              <View className='ziti-order-info'>
                <View className='title'>自提订单</View>
                <View className='ziti-txt'>
                  您有<Text className='ziti-num'>{state.zitiNum}</Text>
                  个等待自提的订单
                </View>
              </View>
              <Text className='iconfont icon-qianwang-01'></Text>
            </View>
          )}

          <View className='order-con'>
            <View
              className='order-item'
              onClick={handleClickLink.bind(this, '/subpage/pages/trade/list?status=5&evaluate=0')}
            >
              <SpImage src='daizhifu.png' className='icon-style' />
              {state.waitPayNum > 0 && (
                <View
                  className={`'order-bradge' ${VERSION_IN_PURCHASE && 'purchase-order-bradge'}`}
                >
                  <Text>{state.waitPayNum}</Text>
                </View>
              )}
              <Text className='order-txt'>待支付</Text>
            </View>
            <View
              className='order-item'
              onClick={handleClickLink.bind(this, '/subpage/pages/trade/list?status=1&evaluate=0')}
            >
              <SpImage src='daishouhuo.png' className='icon-style' />
              {state.waitRecevieNum + state.waitSendNum > 0 && (
                <View
                  className={`'order-bradge' ${VERSION_IN_PURCHASE && 'purchase-order-bradge'}`}
                >
                  <Text>{state.waitRecevieNum + state.waitSendNum}</Text>
                </View>
              )}
              <Text className='order-txt'>待收货</Text>
            </View>
          </View>
        </CompPanel>

        <CompMenu
          accessMenu={{
            ...config.menu,
            purchase: (purchaseInfo.used_roles ? purchaseInfo.used_roles.indexOf('dependents') > -1 : false) && userInfo?.is_employee,
            popularize: userInfo ? userInfo.popularize : false
          }}
          isPromoter={userInfo ? userInfo.isPromoter : false}
          onLink={handleClickService}
        />

        <CompPanel title='帮助中心'>
          <CompHelpCenter onLink={handleClickService} />
        </CompPanel>
      </View>
      {/* <View className="dibiao-block">
        <SpImage className="dibiao-image" src="dibiao.png" />
      </View> */}

      {/* 隐私政策 */}
      <SpPrivacyModal
        open={policyModal}
        onCancel={() => {
          setPolicyModal(false)
        }}
        onConfirm={() => {
          setPolicyModal(false)
        }}
      />


    </SpPage>
  )
}

export default MemberIndex
