import Taro, { getCurrentInstance, useRouter } from '@tarojs/taro'
import React, { useCallback, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import api from '@/api'
import { SpPage, SpPrivacyModal } from '@/components'
import { useLogin, useModal } from '@/hooks'
import { showToast, VERSION_IN_PURCHASE, normalizeQuerys } from '@/utils'
import CompSelectCompany from './comps/comp-select-company'
import { updateEnterpriseId } from '@/store/slices/purchase'
import CompBottomTip from './comps/comp-bottomTip'
import './select-company-phone.scss'

const initialState = {
  wxCode: '',
  enterprise_id: '',
  auth_type: '',
  isOpened: false,
  companyList: [],
  curActiveIndex: undefined
}

function PurchaseAuthPhone(props) {
  const { setToken, isNewUser, login } = useLogin({
    autoLogin: true,
    policyUpdateHook: (isUpdate) => {
      isUpdate && setPolicyModal(true)
    }
  })
  const dispatch = useDispatch()
  const [state, setState] = useImmer(initialState)
  const [policyModal, setPolicyModal] = useState(false)
  const { enterprise_id, auth_type, isOpened, companyList, curActiveIndex } = state
  const { userInfo = {} } = useSelector((state) => state.user)
  const { params } = useRouter()
  let { enterprise_name, auth_code, account, email, vcode } = params
  const { showModal } = useModal()
  const $instance = getCurrentInstance()

  useEffect(() => {
    getLoginCode()
    getQrcodeEid()
  }, [])

  // 企业二维码扫码登录
  const getQrcodeEid = async () => {
    if ($instance.router.params.scene) {
      const query = await normalizeQuerys($instance.router.params)
      const { eid, cid } = query
      debugger
      if (eid) {
        setState((draft) => {
          draft.enterprise_id = eid
          draft.auth_type = 'qrcode'
        })
      }
    } else {
      setState((draft) => {
        draft.enterprise_id = params.enterprise_id
        draft.auth_type = 'mobile'
      })
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

  const getLoginCode = async () => {
    const { code } = await Taro.login()
    setState((draft) => {
      draft.wxCode = code
    })
  }

  const handleBindPhone = async (e) => {
    const { encryptedData, iv, cloudID } = e.detail

    if (encryptedData && iv) {
      try {
        const params = {
          code: state.wxCode,
          encryptedData,
          iv,
          cloudID,
          user_type: 'wechat',
          auth_type: 'wxapp',
          employee_auth: {
            enterprise_id,
            account,
            auth_code,
            email,
            vcode,
            auth_type
          }
        }
        const { token } = await api.wx.newlogin(params)
        setToken(token)
        showToast('验证成功')
        setTimeout(() => {
          Taro.reLaunch({ url: `/pages/purchase/index` })
        }, 700)
      } catch (e) {
        getLoginCode()
      }
    }
  }

  const validatePhone = async (para) => {
    const _params = { ...para }
    const { list } = await api.purchase.employeeCheck(_params)
    if (list.length > 1) {
      //选择企业
      setState((draft) => {
        draft.isOpened = true
        draft.companyList = list
      })
      return
    }
    _params.enterprise_id = list[0]?.enterprise_id
    _params.employee_id = list[0]?.id
    employeeAuthFetch(_params)
  }

  const employeeAuthFetch = async (_params) => {
    try {
      await api.purchase.setEmployeeAuth({ ..._params, showError: false })
      dispatch(updateEnterpriseId(_params.enterprise_id))
      showToast('验证成功')
      if (isOpened) {
        setState((draft) => {
          draft.isOpened = false
        })
      }
      setTimeout(() => {
        Taro.reLaunch({ url: `/pages/purchase/index` })
      }, 2000)
    } catch (e) {
      console.log('🚀🚀🚀 ~ file: select-company-phone.js:102 ~ validatePhone ~ e:', e)
      if (e.message.indexOf('重复绑定') > -1) {
        dispatch(updateEnterpriseId(_params.enterprise_id))
        await showModal({
          title: '验证失败',
          content: e.message,
          showCancel: false,
          confirmText: '我知道了',
          contentAlign: 'center'
        })
        Taro.reLaunch({ url: `/pages/purchase/index` })
      } else {
        console.log('绑定错误', e.message)
        await showModal({
          title: '二维码无效',
          content: '二维码无效,请关闭小程序并重新扫码或直接登录',
          showCancel: false,
          confirmText: '直接登录',
          contentAlign: 'center'
        })
        Taro.reLaunch({ url: `/pages/purchase/index` })
      }
      getLoginCode()
    }
  }

  const handleSelctCompany = async () => {
    const { enterprise_id: _enterprise_id, id: employee_id } = companyList[curActiveIndex] || {}
    const _params = {
      enterprise_id: _enterprise_id,
      employee_id,
      mobile: 'member_mobile',
      auth_type: 'mobile'
    }
    employeeAuthFetch(_params)
  }

  console.log('enterprise_id', enterprise_id)
  console.log('auth_type', auth_type)
  return (
    <SpPage className='page-purchase-auth-phone select-component'>
      <View className='select-component-title'>{enterprise_name}</View>
      <View className='select-component-prompt'>使用手机号进行验证</View>
      {!VERSION_IN_PURCHASE && ( // 有商城的到这个页面都已经登录成功不用区分是否是新用户
        <>
          {!isNewUser && (
            <>
              <View className='phone-box'>
                <Text>已授权手机号：</Text>
                <Text className='phone-number'>{userInfo?.mobile}</Text>
              </View>
              <AtButton
                circle
                className='btns-phone'
                onClick={() =>
                  validatePhone({
                    auth_type,
                    enterprise_id,
                    mobile: 'member_mobile'
                  })
                }
              >
                使用该号码验证
              </AtButton>
            </>
          )}

          {isNewUser && (
            <AtButton
              circle
              className='btns-other'
              openType='getPhoneNumber'
              onGetPhoneNumber={handleBindPhone}
            >
              其他手机号码验证
            </AtButton>
          )}
        </>
      )}
      {VERSION_IN_PURCHASE &&
        isNewUser && ( // 无商城&新用户需要手机号授权登录（调new_login接口 不需要绑定）
          <AtButton
            openType='getPhoneNumber'
            onGetPhoneNumber={handleBindPhone}
            circle
            className='btns-phone'
            customStyle={{ marginTop: '50%' }}
          >
            手机号授权登录
          </AtButton>
        )}
      {VERSION_IN_PURCHASE &&
        !isNewUser && ( // 无商城&老用户，直接调绑定接口
          <AtButton
            circle
            className='btns-phone'
            onClick={() =>
              validatePhone({
                enterprise_id,
                auth_type,
                mobile: 'member_mobile'
              })
            }
            customStyle={{ marginTop: '50%' }}
          >
            手机号授权登录
          </AtButton>
        )}
      <CompBottomTip />

      <CompSelectCompany
        isOpened={isOpened}
        list={companyList}
        curIndex={curActiveIndex}
        handleItemClick={(idx) => {
          setState((draft) => {
            draft.curActiveIndex = idx
          })
        }}
        onClose={() => {
          setState((draft) => {
            draft.isOpened = false
          })
        }}
        onConfirm={handleSelctCompany}
      />

      {/* 隐私协议 */}
      <SpPrivacyModal open={policyModal} onCancel={onRejectPolicy} onConfirm={onResolvePolicy} />
    </SpPage>
  )
}

PurchaseAuthPhone.options = {
  addGlobalClass: true
}

export default PurchaseAuthPhone

// 有商城和无商城 手机号授权登录
