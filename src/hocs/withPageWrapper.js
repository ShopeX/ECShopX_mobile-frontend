import { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useEffectAsync, useWhiteShop, useModal } from '@/hooks'
import useModalLogin from '@/hooks/useModalLogin'
import { updateShopInfo } from '@/store/slices/shop'
import { SpPage, SpLogin } from '@/components'
import { VERSION_STANDARD } from '@/utils'
import configStore from '@/store'

const { store } = configStore()

function withPageWrapper(Component) {
  return function EnhancedComponent(props) {
    const dispatch = useDispatch()
    const { initState } = useSelector((state) => state.sys)
    const { checkEnterStoreRule, checkUserInStoreWhiteList, getUserWhiteShop } = useWhiteShop()
    const { showModal } = useModal()
    const { showLoinModal } = useModalLogin()
    const [state, setState] = useState(false)

    useEffectAsync(async () => {
      if (initState) {
        if (VERSION_STANDARD) {
          // 云店进店规则
          try {
            await checkEnterStoreRule()
            setState(true)
          } catch (error) {
            // 检查店铺开启了白名单，需要登录授权
            if (error.message == 'AUTH_REQUIRED') {
              await handleToLogin()
              await handleStoreWhiteList()
              setState(true)
            } else if (error.message == 'CHECK_WHITE_LIST') {
              await handleStoreWhiteList()
              setState(true)
            }
          }
        } else {
          setState(true)
        }
      }
    }, [initState])

    const handleToLogin = async () => {
      try {
        await showLoinModal()
      } catch (error) {
        const res = await showModal({
          title: '提示',
          content: '你还未登录，请先登录！',
          cancelText: '退出',
          confirmText: '继续登录',
          contentAlign: 'center'
        })
        if (res.confirm) {
          await handleToLogin()
        } else {
          Taro.exitMiniProgram()
        }
      }
    }

    const handleStoreWhiteList = async () => {
      const status = await checkUserInStoreWhiteList()
      if (!status) {
        const myShopInfo = await getUserWhiteShop()
        if (!myShopInfo) {
          const res = await showModal({
            title: '提示',
            content: '抱歉，没有可访问的店铺',
            showCancel: false,
            confirmText: '关闭',
            contentAlign: 'center'
          })
          if (res.confirm) {
            Taro.exitMiniProgram()
            throw new Error('EXIT_MINI_PROGRAM')
          }
        } else {
          await handlePhoneCallToStore(myShopInfo)
        }
      }
    }

    const handlePhoneCallToStore = async (myShopInfo) => {
      const res = await showModal({
        title: '提示',
        content: '抱歉，本店会员才可以访问，如有需要可电话联系店铺!',
        cancelText: '回我的店',
        confirmText: '联系店铺',
        contentAlign: 'center'
      })
      if (res.confirm) {
        console.log('🚀🚀🚀 ~ handleStoreWhiteList ~ shop:', store.getState().shop.shopInfo)
        Taro.makePhoneCall({
          phoneNumber: store.getState().shop.shopInfo.phone,
          complete: async () => {
            await handlePhoneCallToStore()
          }
        })
        throw new Error('PHONE_CALL_TO_STORE')
      } else {
        dispatch(updateShopInfo(myShopInfo))
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
