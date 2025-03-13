import Taro, { getCurrentInstance, useRouter } from '@tarojs/taro'
import React, { useCallback, useState, useEffect, useRef } from 'react'
import { View, Text, Image, RootPortal } from '@tarojs/components'
import { SpPrivacyModal, SpPage, SpLogin, SpModal,SpCheckbox, SpImage } from '@/components'
import { AtButton,AtIcon } from 'taro-ui'
import { showToast, normalizeQuerys, getCurrentPageRouteParams } from '@/utils'
import { useLogin, useModal } from '@/hooks'
import S from '@/spx'
import api from '@/api'
import { useSelector, useDispatch } from 'react-redux'
import CompBottomTip from '@/subpages/purchase/comps/comp-bottomTip'
import { updateInviteCode } from '@/store/slices/purchase'

import './auth.scss'

function PurchaseAuth() {
  const { isLogin, checkPolicyChange, isNewUser,updatePolicyTime, setToken, login } = useLogin({
    autoLogin: false,
    // policyUpdateHook: (isUpdate) => {
    //   isUpdate && setPolicyModal(true)
    // }
  })

  const { userInfo = {} } = useSelector((state) => state.user)
  const { appName, appLogo } = useSelector((state) => state.sys)
  const [policyModal, setPolicyModal] = useState(false)
  const [checked, setChecked] = useState(false)
  const [userEnterprises, setUserEnterprises] = useState([])
  const { params } = useRouter()
  const { code: invite_code, type = '' } = params
  const dispatch = useDispatch()
  const codeRef = useRef()
  const { showModal } = useModal()
  const $instance = getCurrentInstance()

  useEffect(() => {
    dispatch(updateInviteCode(invite_code))
    getQrcodeEid()
    checkPolicyChangeFunc()
  }, [])

  useEffect(() => {
    if (!S.getAuthToken()) {
      Taro.login({
        success: ({ code }) => {
          codeRef.current = code
        },
        fail: (e) => {
          console.error('[sp-login] taro login fail:', e)
        }
      })
    }
  }, [])

  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: appName
    })
  }, [appName])

  // useEffect(() => {
  //   if (!type && !invite_code && (userInfo?.is_relative || userInfo?.is_employee)) {
  //     // type：渠道是添加身份,不能跳转到活动列表页
  //     getUserEnterprises()
  //   }
  // }, [userInfo])

  // const getUserEnterprises = async () => {
  //   const data = await api.purchase.getUserEnterprises({ disabled: 0 })
  //   setUserEnterprises(data)
  //   if (data?.length > 0) {
  //     Taro.reLaunch({ url: '/pages/purchase/index' })
  //   }
  // }

  const checkPolicyChangeFunc =  async()=>{
    const res = await checkPolicyChange()
    setChecked(res)
  }

  // 企业二维码扫码登录
  const getQrcodeEid = async () => {
    // eid=18&cid=34&t=m&c=1
    // eid:员工企业ID--enterpriseId
    // cid:企业ID--companyId
    // t:认证方式 取了第一个字符 mobile=m；email=e；account=a；qr_code=q
    // c:是否验证白名单 1=验证
    if ($instance.router.params.scene) {
      const query = await normalizeQuerys($instance.router.params)
      let { eid, cid, t, c } = query

      console.log( '扫码参数',eid, cid, t, c)
      const tMap = {
        m:'mobile',
        e:'email',
        a:'account',
        q:'qr_code'
      }
      if (eid) {
        const sparams = {
          enterprise_id:eid,
          auth_type:tMap[t],
        }
        if(c){
          sparams.is_verify = c
        }
        //跳转
        handleConfirmClick(tMap[t],sparams)
      }
    }
  }

  const onRejectPolicy = () => {
    Taro.exitMiniProgram()
  }

  // 同意隐私协议
  const onResolvePolicy = async () => {
    setPolicyModal(false)
    if (!isNewUser) {
      await login()
    }
  }

  const handleConfirmClick = async (rtype,rparmas) => {
    // if (type === 'friend') {
    //   const { confirm } = await showModal({
    //     title: '亲友验证说明',
    //     content: `如果您是亲友，请通过员工分享的活动链接认证；如果您是员工，请在上一页面中点击「我是员工」验证身份`,
    //     showCancel: false,
    //     confirmText: '我知道了'
    //   })
    // } else {
    //   Taro.navigateTo({
    //     url: `/subpages/purchase/select-company`
    //   })
    // }
    let redirectUrl;
    if (rtype == 'account') {
      redirectUrl = `/subpages/purchase/select-company-account`
    } else if (rtype == 'email') {
      redirectUrl = `/subpages/purchase/select-company-email`
    } else if (rtype == 'mobile' || rtype == 'qr_code') {
      redirectUrl = `/subpages/purchase/select-company-phone`
    }

    if(rparmas){
      //扫码传参数
      redirectUrl += Object.keys(rparmas).reduce((pre,cur)=>{
        return pre + `${cur}=${rparmas[cur]}&`
      },'?').slice(0, -1);
      console.log(redirectUrl,rparmas)
      Taro.reLaunch({
        url: redirectUrl
      })
    }else{
      Taro.navigateTo({
        url: redirectUrl
      })
    }
  }

  const handleBindPhone = async (e) => {
    const { encryptedData, iv, cloudID } = e.detail
    if (encryptedData && iv) {
      const code = codeRef.current
      const params = {
        code,
        encryptedData,
        iv,
        cloudID,
        user_type: 'wechat',
        auth_type: 'wxapp',
        invite_code
      }
      const { token } = await api.wx.newlogin(params)
      setToken(token)
      showToast('验证成功')
      setTimeout(() => {
        Taro.reLaunch({ url: `/pages/purchase/index` })
      }, 700)
    }
  }

  const validatePhone = async () => {
    try {
      await api.purchase.getEmployeeRelativeBind({ invite_code, showError: false })
      showToast('验证成功')
      setTimeout(() => {
        Taro.reLaunch({ url: `/pages/purchase/index` })
      }, 700)
    } catch (e) {
      console.log(e)
      Taro.showModal({
        content: e.message || e,
        confirmText: '我知道了',
        showCancel: false,
        success: () => {
          Taro.reLaunch({ url: `/pages/purchase/index` })
        }
      })
    }
  }

  const handlePassClick = () => {
    Taro.reLaunch({ url: `/pages/purchase/index` })
  }

  const handleClickPrivacy = (type) => {
    Taro.navigateTo({
      url: `/subpages/auth/reg-rule?type=${type}`
    })
  }

  const handleSelectPrivacy = async() => {
    setChecked(!checked)
  }

  return (
    <SpPage className='purchase-auth'>
      {/* 隐私协议 */}
      <SpPrivacyModal open={policyModal} onCancel={onRejectPolicy} onConfirm={onResolvePolicy} />

      <View className='header'>
      <Image className='header-avatar' src={appLogo} mode='aspectFill' />
        <Text className='welcome'>欢迎登录</Text>
        <Text className='title'>{appName}</Text>
      </View>
      <View className='btns'>
        {!invite_code && (!isLogin || type || userEnterprises.length == 0) && (
          <>
            {/* <AtButton circle className='btns-staff button' onClick={() => handleConfirmClick('staff')}>
              我是员工
            </AtButton>
            <AtButton circle className='btns-friend button' onClick={() => handleConfirmClick('friend')}>
              我是亲友
            </AtButton> */}

            <AtButton
              circle
              disabled={!checked}
              className='button btns-phone'
              onClick={() => handleConfirmClick('mobile')}
            >
              手机号登录&nbsp;
              <Text className='iconfont icon-shuangjiantou'></Text>
            </AtButton>
            <AtButton
              circle
              disabled={!checked}
              className='button btns-account'
              onClick={() => handleConfirmClick('account')}
            >
              账号密码登录&nbsp;
              <Text className='iconfont icon-shuangjiantou'></Text>
            </AtButton>
            <AtButton
              circle
              disabled={!checked}
              className='button btns-email'
              onClick={() => handleConfirmClick('email')}
            >
              使用邮箱登录
            </AtButton>
          </>
        )}

        {invite_code &&
          isLogin &&
          userInfo?.is_relative && ( // 有/无商城，已登录亲友验证、绑定
            <>
              <View className='validate-pass'>验证通过</View>
              <AtButton circle className='btns-staff button login' onClick={handlePassClick}>
                继续
              </AtButton>
            </>
          )}

        {invite_code && isLogin && !userInfo?.is_relative && (
          <AtButton circle className='btns-weixin button' onClick={validatePhone}>
            手机号授权登录
          </AtButton>
        )}

        {invite_code &&
          isNewUser && ( // 有/无商城，未登录亲友验证、绑定
            <AtButton
              openType='getPhoneNumber'
              onGetPhoneNumber={handleBindPhone}
              circle
              className='btns-weixin button'
            >
              手机号授权登录
            </AtButton>
          )}
      </View>

      <View className='auth--footer'>
          <SpCheckbox
            onChange={handleSelectPrivacy}
            checked={checked}
          />
          <Text className='auth--footer-text'>
            我已阅读并接受{' '}
            <Text onClick={() => handleClickPrivacy('privacy')} className='content'>
              隐私政策
            </Text>
            及
            <Text className='content' onClick={() => handleClickPrivacy('member_register')}>
              用户协议
            </Text>
          </Text>
        </View>

        <View className='service-footer'>
          <View
            className='toolbar-item'
            onClick={() => {
              S.phoneNumber('021-60662088')
            }}
          >
            <Text className='iconfont icon-lianxi'></Text>
            <Text className='toolbar-item-txt'>客服电话：</Text>
            <Text className='toolbar-item-content'>021-60662088</Text>
          </View>
        </View>

      <CompBottomTip />
    </SpPage>
  )
}

PurchaseAuth.options = {
  addGlobalClass: true
}

export default PurchaseAuth
