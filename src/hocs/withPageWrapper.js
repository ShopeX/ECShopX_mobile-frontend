import { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro from '@tarojs/taro'
import { useEffectAsync, useWhiteShop, useModal } from '@/hooks'
import useModalLogin from '@/hooks/useModalLogin'
import { updateShopInfo } from '@/store/slices/shop'
import { updateLocation } from '@/store/slices/user'
import { SG_CHECK_STORE_RULE } from '@/consts'
import { VERSION_STANDARD, isEmpty, entryLaunch } from '@/utils'
import { SG_ROUTER_PARAMS, SG_GUIDE_PARAMS } from '@/consts/localstorage'
import api from '@/api'
import S from '@/spx'

function withPageWrapper(Component) {
  return function EnhancedComponent(props) {
    const dispatch = useDispatch()
    const { initState, entryStoreRules, entryStoreByLBS, entryDefalutStore, guidderTemplateId } =
      useSelector((state) => state.sys)
    const { shopInfo } = useSelector((state) => state.shop)
    const { location } = useSelector((state) => state.user)

    const { showModal } = useModal()
    const { showLoinModal } = useModalLogin()
    const [state, setState] = useState(false)

    useEffectAsync(async () => {
      if (initState) {
        resolveInStoreRule()
      }
    }, [initState])

    useEffect(() => {
      if (state) {
        setState(false)

        setTimeout(() => {
          resolveInStoreRule()
        }, 1000)
      }
    }, [shopInfo])

    const resolveInStoreRule = async () => {
      // 启动时（冷启动+热启动）执行云店进店规则
      if (VERSION_STANDARD && Taro.getStorageSync(SG_CHECK_STORE_RULE) == 0) {
        // 云店进店规则
        Taro.setStorageSync(SG_CHECK_STORE_RULE, 1)
        await checkEnterStoreRule()
        setState(true)
      } else {
        setState(true)
      }
    }

    const checkEnterStoreRule = async () => {
      return new Promise((resolve, reject) => {
        const { dtid } = Taro.getStorageSync(SG_ROUTER_PARAMS)
        const { gu_user_id } = Taro.getStorageSync(SG_GUIDE_PARAMS) // gu_user_id = 导购工号
        console.log('entryStoreRules', entryStoreRules)
        const ruleList =
          JSON.parse(JSON.stringify(entryStoreRules.filter((item) => item.status))) || []

        const nextRule = async () => {
          const rule = ruleList.shift()
          if (!rule) {
            // 规则轮询检测完毕
            await checkStoreWhiteList()
            return resolve()
          }

          // 店铺码进店（路由带店铺id时进入店铺码进店规则判断）
          if (rule.key === 'distributor_code') {
            if (dtid) {
              await checkStoreWhiteList(dtid)
              resolve()
            } else {
              return nextRule()
            }
          }

          // 导购物料进店规则
          if (rule.key === 'shop_assistant') {
            if (!gu_user_id) {
              // 无导购物料参数跳过
              return nextRule()
            }

            const guideStoreInfo = await api.shop.checkStoreEnterRule({
              work_userid: gu_user_id
            })
            if (guideStoreInfo?.distributor_id) {
              await checkStoreWhiteList(guideStoreInfo?.distributor_id)
              resolve()
            } else {
              nextRule()
            }
          }

          // 白名单规则
          if (rule.key === 'shop_white') {
            if (!S.getAuthToken()) {
              console.log(`[进店规则] rule:shop_white, no auth token`)
              const loginResult = await handleToLogin()
              if (!loginResult) {
                return nextRule()
              }
            }

            if (dtid || shopInfo?.distributor_id) {
              // 如果缓存中存在店铺，需校验当前店铺是否在白名单中
              await checkStoreWhiteList(dtid || shopInfo?.distributor_id)
              resolve()
            } else {
              const myShopInfo = await getUserWhiteShop()
              if (myShopInfo) {
                dispatch(updateShopInfo(myShopInfo))
                resolve()
              } else {
                nextRule()
              }
            }
          }

          // 导购专属店铺
          if (rule.key === 'shop_assistant_pro') {
            if (!S.getAuthToken()) {
              return nextRule()
            }

            const guideStoreInfo = await api.shop.checkStoreEnterRule()
            if (guideStoreInfo?.distributor_id) {
              await checkStoreWhiteList(guideStoreInfo?.distributor_id)
              resolve()
            } else {
              return nextRule()
            }
          }
        }

        nextRule()
      })
    }

    // 获取当前用户白名单店铺
    const getUserWhiteShop = async () => {
      const { dtid } = Taro.getStorageSync(SG_ROUTER_PARAMS)
      const list = await api.shop.getMyStoreWhiteList()
      const store = list.find((item) => item.distributor_id == dtid)
      return store || (list.length > 0 ? list[0] : null)
    }

    const checkStoreWhiteList = async (dtid, isLocation = true) => {
      const params = {}
      if (dtid) {
        params['distributor_id'] = dtid
      } else if (shopInfo?.distributor_id) {
        params['distributor_id'] = shopInfo?.distributor_id
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
      // 如果请求的店铺ID和接口返回的店铺ID不一致（店铺可能关闭或禁用），此时需要根据兜底策略来决定跳转到引导页和默认店铺页
      if (
        dtid > 0 &&
        currentShopInfo.distributor_id !== 0 &&
        currentShopInfo.distributor_id !== dtid &&
        entryDefalutStore == 2 // 兜底策略指定页面
      ) {
        Taro.redirectTo({
          url: `/pages/custom/custom-page?id=${guidderTemplateId}&fromConnect=davild`
        })
      }

      if (currentShopInfo.distributor_id != 0 && currentShopInfo.open_divided == '1') {
        // 开启了店铺白名单
        if (!S.getAuthToken()) {
          console.log(`[进店规则] rule: store is open divided, no auth token`)
          const loginResult = await handleToLogin()
          if (!loginResult) {
            // 退出小程序
            Taro.exitMiniProgram()
            throw new Error('EXIT_MINI_PROGRAM')
          }
        }
        // 去检查当前用户是否在店铺白名单中
        await resloveCheckUserInStoreWhiteList(currentShopInfo)
      } else {
        dispatch(updateShopInfo(currentShopInfo))
      }
    }

    const handleToLogin = async () => {
      try {
        await showLoinModal()
        return true
      } catch (error) {
        const res = await showModal({
          title: '提示',
          content: '你还未登录，请先登录！',
          cancelText: '取消',
          confirmText: '继续登录',
          contentAlign: 'center'
        })
        if (res.confirm) {
          return await handleToLogin()
        } else {
          return false
        }
      }
    }

    const resloveCheckUserInStoreWhiteList = async (currentShopInfo) => {
      // 检查当前用户是否在店铺白名单中
      const { status } = await api.shop.checkUserInWhite({
        distributor_id: currentShopInfo.distributor_id
      })
      if (!status) {
        // 查询当前用户有没有白名单店铺
        const myShopInfo = await getUserWhiteShop()
        if (myShopInfo) {
          const resModalConnectStore = await showModal({
            title: '提示',
            content: '抱歉，本店会员才可以访问，如有需要可电话联系店铺!',
            cancelText: '回我的店',
            confirmText: '联系店铺',
            contentAlign: 'center'
          })
          if (resModalConnectStore.confirm) {
            Taro.makePhoneCall({
              phoneNumber: currentShopInfo.phone
            })
            throw new Error('PHONE_CALL_TO_STORE')
          } else {
            dispatch(updateShopInfo(myShopInfo))
          }
        } else {
          const resModalAccessStore = await showModal({
            title: '提示',
            content: currentShopInfo?.is_default
              ? '抱歉，没有可访问的店铺'
              : '抱歉，本店会员才可以访问',
            showCancel: false,
            confirmText:
              entryDefalutStore == 1
                ? currentShopInfo?.is_default
                  ? '退出小程序'
                  : '返回首页'
                : '返回',
            contentAlign: 'center'
          })
          if (resModalAccessStore.confirm) {
            // 兜底策略: 默认店铺
            if (entryDefalutStore == 1) {
              if (currentShopInfo?.is_default) {
                // 退出小程序
                Taro.exitMiniProgram()
                throw new Error('EXIT_MINI_PROGRAM')
              } else {
                // 清除缓存中的店铺
                dispatch(updateShopInfo({}))
                await checkStoreWhiteList(null, false)
              }
            } else {
              Taro.redirectTo({
                url: `/pages/custom/custom-page?id=${guidderTemplateId}&fromConnect=davild`
              })
              throw new Error('TO_STORE_GUIDE_PAGE')
            }
          }
        }
      } else {
        dispatch(updateShopInfo(currentShopInfo))
      }
    }

    if (state) {
      return <Component {...props} />
    } else {
      return null
    }
  }
}

export default withPageWrapper
