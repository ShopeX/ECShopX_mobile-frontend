/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro, { getCurrentInstance, useRouter } from '@tarojs/taro'
import React, { useCallback, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import api from '@/api'
import { SpPage, SpPrivacyModal } from '@/components'
import { useLogin, useModal } from '@/hooks'
import { showToast, VERSION_IN_PURCHASE, normalizeQuerys, getDistributorId, isWeb } from '@/utils'
import { updateEnterpriseId, updateCurDistributorId } from '@/store/slices/purchase'
import CompSelectCompany from './comps/comp-select-company'
import CompBottomTip from './comps/comp-bottomTip'
import './select-company-phone.scss'

const initialState = {
  wxCode: '',
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
  const { isOpened, companyList, curActiveIndex } = state
  const { userInfo = {} } = useSelector((state) => state.user)
  const { params } = useRouter()
  let {
    enterprise_name,
    auth_code,
    account,
    email,
    vcode,
    auth_type = 'mobile',
    employee_id,
    enterprise_id,
    is_verify,
    activity_id,
    is_activity = ''
  } = params
  const { showModal } = useModal()
  const $instance = getCurrentInstance() || {}

  useEffect(() => {
    getLoginCode()
    // getQrcodeEid()
  }, [])

  // 企业二维码扫码登录
  // const getQrcodeEid = async () => {
  //   if ($instance?.router?.params.scene) {
  //     const query = await normalizeQuerys($instance?.router?.params)
  //     const { eid, cid } = query
  //     if (eid) {
  //       setState((draft) => {
  //         draft.enterprise_id = eid
  //         draft.auth_type = 'qrcode'
  //       })
  //     }
  //   } else {
  //     setState((draft) => {
  //       draft.enterprise_id = params.enterprise_id
  //       draft.auth_type = 'mobile'
  //     })
  //   }
  // }

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
            auth_type,
            employee_id
          }
        }
        if (auth_type == 'mobile' || auth_type == 'qr_code') {
          delete params.employee_auth
        }
        const { token } = await api.wx.newlogin(params)
        setToken(token)
        if (auth_type == 'mobile' || auth_type == 'qr_code') {
          //手机号 or 二维码验证
          validatePhone({
            auth_type,
            enterprise_id,
            mobile: 'member_mobile'
          })
        } else {
          showToast('验证成功')
          await getQrCodeDtid()
          dispatch(updateEnterpriseId(enterprise_id))
          setTimeout(() => {
            Taro.reLaunch({
              url: `/pages/purchase/index?is_redirt=1${
                is_activity && activity_id ? `&activity_id=${activity_id}` : ''
              }`
            })
          }, 700)
        }
      } catch (e) {
        getLoginCode()
      }
    }
  }

  const validatePhone = async (para) => {
    const _params = { ...para }

    //二维码不需要验证则不需要check接口
    if (!(auth_type == 'qr_code' && !is_verify)) {
      const checkParams = { ..._params }
      if (activity_id) {
        checkParams.activity_id = activity_id
      }
      if (!enterprise_id) {
        //不是扫码进来，check接口要传当前店铺ID
        checkParams.distributor_id = getDistributorId()
      }
      const { list } = await api.purchase.employeeCheck(checkParams)
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
    }

    employeeAuthFetch(_params)
  }

  const employeeAuthFetch = async (_params) => {
    try {
      await api.purchase.setEmployeeAuth({ ..._params, showError: false })
      await getQrCodeDtid()
      dispatch(updateEnterpriseId(_params.enterprise_id))
      showToast('验证成功')
      if (isOpened) {
        setState((draft) => {
          draft.isOpened = false
        })
      }
      setTimeout(() => {
        Taro.reLaunch({
          url: `/pages/purchase/index?is_redirt=1${
            is_activity && activity_id ? `&activity_id=${activity_id}` : ''
          }`
        })
      }, 2000)
    } catch (e) {
      console.log('🚀🚀🚀 ~ file: select-company-phone.js:102 ~ validatePhone ~ e:', e)
      if (e.message.indexOf('重复绑定') > -1) {
        dispatch(updateEnterpriseId(_params.enterprise_id))
        await getQrCodeDtid()
      }
      await showModal({
        title: '验证失败',
        content: e.message,
        showCancel: false,
        confirmText: '我知道了',
        contentAlign: 'center'
      })
      Taro.reLaunch({
        url: `/pages/purchase/index?is_redirt=1${
          is_activity && activity_id ? `&activity_id=${activity_id}` : ''
        }`
      })
      getLoginCode()
    }
  }

  const getQrCodeDtid = async () => {
    if (!enterprise_id) return
    // 如果扫码进来存在企业ID则需要绑定拿到店铺ID
    const { distributor_id } = await api.purchase.getPurchaseDistributor({ enterprise_id })
    //后续身份切换需要用
    dispatch(updateCurDistributorId(distributor_id))
  }

  const handleSelctCompany = async () => {
    const { enterprise_id: _enterprise_id, id: _employee_id } = companyList[curActiveIndex] || {}
    const _params = {
      enterprise_id: _enterprise_id,
      employee_id: _employee_id,
      mobile: 'member_mobile',
      auth_type: 'mobile'
    }
    employeeAuthFetch(_params)
  }

  console.log('enterprise_id', enterprise_id)
  console.log('auth_type', auth_type)
  return (
    <SpPage className='page-purchase-auth-phone select-component'>
      {enterprise_name && (
        <View className='select-component-title'>{decodeURIComponent(enterprise_name)}</View>
      )}
      {(auth_type == 'mobile' || auth_type == 'qr_code') && (
        <View className='select-component-prompt'>使用手机号进行验证</View>
      )}
      {(!isNewUser || isWeb) && (
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

      {isNewUser && !isWeb && (
        <AtButton
          circle
          className='btns-phone new-in-btns'
          openType='getPhoneNumber'
          onGetPhoneNumber={handleBindPhone}
        >
          手机号授权登录
        </AtButton>
      )}
      {/* {VERSION_IN_PURCHASE &&
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
        )} */}
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
