/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'
import { useEffect, useState, useMemo } from 'react'
import { ScrollView, View, Text } from '@tarojs/components'
import { showToast, isUndefined } from '@/utils'
import { SpPage, SpLoading } from '@/components'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import api from '@/api'
import * as merchantApi from '@/api/merchant'
import S from '@/spx'
import { updateBank, updateBusinessScope, updateMerchantType } from '@/store/slices/merchant'
import { useTranslation, $t, ti } from '@/i18n'
import {
  MERCHANT_TYPE,
  BUSINESS_SCOPE,
  BANG_NAME,
  STEPTWO_TEXT_KEY,
  STEPTHREE_TEXT_KEY,
  MerchantStepKey,
  BANK_PUBLIC,
  BANK_PRIVATE
} from './consts'
import { MButton, MStep, MNavBar, MCell, MImgPicker } from './comps'
import { useArea, usePrevious } from './hook'
import { navigateToAgreement } from './util'
import './apply.scss'

const initialState = {
  //商户类型id/经营范围id
  merchant_type_id: undefined,
  //入驻类型
  settled_type: undefined,
  //商户名称
  merchant_name: undefined,
  //统一社会信用代码
  social_credit_code_id: undefined,
  //省市区编码
  regions_id: [],
  //省市区名称
  regions: [],
  //详细地址
  address: undefined,
  //法人姓名
  legal_name: undefined,
  //法人身份证号码
  legal_cert_id: undefined,
  //法人手机号码
  legal_mobile: undefined,
  //银行账户类型
  bank_acct_type: BANK_PRIVATE,
  //结算银行卡号
  card_id_mask: undefined,
  //结算银行
  bank_name: undefined,
  //绑定手机号
  bank_mobile: undefined,
  //营业执照图片url
  license_url: [],
  //法人手持身份证正面url
  legal_certid_front_url: '',
  //法人手持身份证反面url
  legal_cert_id_back_url: '',
  //结算银行卡正面url
  bank_card_front_url: [],
  formloading: false
}

const Apply = () => {
  const { i18n } = useTranslation()
  const [state, setState] = useImmer(initialState)

  const { merchantType, businessScope, bank: bankName } = useSelector((state) => state.merchant)

  const dispatch = useDispatch()

  const stepOptions = useMemo(
    () => [$t('3c94bb91.e48700'), $t('3c94bb91.ca1130'), $t('3c94bb91.8f14f8')],
    [i18n.language]
  )

  const bankAccType = useMemo(
    () => [
      { value: BANK_PUBLIC, label: $t('3c94bb91.18ba13') },
      { value: BANK_PRIVATE, label: $t('3c94bb91.f0bf8a') }
    ],
    [i18n.language]
  )

  const [merchantOptions, setMerchantOptions] = useState([])

  const previousMerchantType = usePrevious(merchantType)
  //结算银行必填
  const banknameRequired = state.bank_acct_type == BANK_PUBLIC

  //银行绑定手机号必填
  const bankmobileRequired = state.bank_acct_type == BANK_PRIVATE

  const {
    areaList,
    onColumnChange: onAreaColumnChange,
    onChange: onAreaChange,
    selectArea
  } = useArea()

  //当前正在第几步
  const [step, setStep] = useState(1)

  useEffect(() => {
    if (isUndefined(previousMerchantType)) return
    if (merchantType.id !== previousMerchantType?.id && previousMerchantType.id) {
      dispatch(updateBusinessScope({}))
    }
  }, [merchantType])

  const [loading, setLoading] = useState(false)

  //最后一步
  const isSubmit = step === 3

  const handleChange = (key, key2) => (value) => {
    if (key2) {
      setState((state) => {
        state[key] = value[0]
        state[key2] = value[1]
      })
    } else {
      setState((state) => {
        state[key] = value
      })
    }
  }

  useEffect(() => {
    //必有经营范围
    if (businessScope.id) {
      setState((state) => {
        state.merchant_type_id = businessScope.id
      })
    }
  }, [businessScope])

  useEffect(() => {
    if (bankName.name) {
      setState((state) => {
        state.bank_name = bankName.name
      })
    }
  }, [bankName])

  useEffect(() => {
    if (selectArea.length) {
      setState((state) => {
        state.regions = selectArea.map((item) => item.label)
        state.regions_id = selectArea.map((item) => item.value)
      })
    }
  }, [selectArea])

  const handleSubmit = async () => {
    const {
      settled_type,
      merchant_type_id,
      merchant_name,
      social_credit_code_id,
      regions,
      regions_id,
      address,
      legal_name,
      legal_cert_id,
      legal_mobile,
      bank_acct_type,
      card_id_mask,
      bank_name,
      bank_mobile,
      license_url,
      legal_certid_front_url,
      legal_cert_id_back_url,
      bank_card_front_url
    } = state

    setLoading(true)
    let params = {}
    //第一步
    if (step === 1) {
      if (!merchantType.id && !businessScope.id && !state.settled_type) {
        showToast($t('3c94bb91.a3c96f'))
        return true
      }
      if (!merchantType.id || !businessScope.id || !state.settled_type) {
        showToast($t('3c94bb91.2456c8'))
        return true
      }
      params = {
        step: 1,
        settled_type,
        merchant_type_id
      }
      //第二步保存
    } else if (step === 2) {
      const legalLabel =
        state.settled_type === 'soletrader' ? $t('3c94bb91.b29725') : $t('3c94bb91.e1a437')
      if (!merchant_name) {
        showToast($t('3c94bb91.ce23e1'))
        return true
      }

      if (!social_credit_code_id) {
        showToast($t('3c94bb91.eb1e77'))
        return true
      }

      if (regions_id.length == 0) {
        showToast($t('b3e42938.075488'))
        return true
      }

      if (!address) {
        showToast($t('3c94bb91.aa202f'))
        return true
      }

      if (!legal_name) {
        showToast(ti('3c94bb91.9a7394', [legalLabel]))
        return true
      }

      if (!legal_cert_id) {
        showToast(ti('3c94bb91.b5712b', [legalLabel]))
        return true
      }

      if (!legal_mobile) {
        showToast(ti('3c94bb91.1bb424', [legalLabel]))
        return true
      }

      params = {
        step: 2,
        merchant_name,
        social_credit_code_id,
        regions_id,
        regions,
        address,
        legal_name,
        legal_cert_id,
        legal_mobile,
        card_id_mask,
        bank_acct_type,
        bank_name,
        bank_mobile
      }
    } else if (step === 3) {
      if (!license_url[0]) {
        showToast($t('3c94bb91.291d78'))
        return true
      }

      if (!legal_certid_front_url) {
        showToast($t('3c94bb91.942f3a'))
        return true
      }

      if (!legal_cert_id_back_url) {
        showToast($t('3c94bb91.df1e61'))
        return true
      }

      const { confirm } = await Taro.showModal({
        title: $t('7187dbd0.02d981'),
        content: $t('3c94bb91.762177'),
        showCancel: true,
        cancelText: $t('7187dbd0.625fb2'),
        confirmText: $t('61e2d21a.e83a25')
      })
      if (!confirm) {
        return true
      }

      params = {
        step: 3,
        license_url: license_url[0],
        legal_certid_front_url,
        legal_cert_id_back_url,
        bank_card_front_url: bank_card_front_url[0]
      }
    }
    try {
      await merchantApi.save(params)
      if (step === 3) {
        S?.delete(MerchantStepKey, true)
        Taro.redirectTo({
          url: `/subpages/merchant/audit`
        })
      }
      setLoading(false)
    } catch (e) {
      setLoading(false)
      return true
    }
  }

  const getDetail = async () => {
    const {
      merchant_type_id,
      merchant_type_name,
      merchant_type_parent_id,
      merchant_type_parent_name,
      settled_type,
      merchant_name,
      social_credit_code_id,
      regions_id,
      province,
      city,
      area,
      address,
      legal_name,
      legal_cert_id,
      bank_acct_type,
      bank_name,
      card_id_mask,
      legal_mobile,
      bank_mobile,
      license_url,
      bank_card_front_url,
      legal_certid_front_url,
      legal_cert_id_back_url
    } = await merchantApi.detail()

    //有保存过才赋值
    if (merchant_type_id) {
      //缓存已经存在数据则不从接口读取
      dispatch(
        updateMerchantType({
          id: merchant_type_parent_id,
          name: merchant_type_parent_name,
          parent_id: 0
        })
      )
      dispatch(
        updateBusinessScope({
          id: merchant_type_id,
          name: merchant_type_name,
          parent_id: merchant_type_parent_id
        })
      )
    }

    if (bank_name) {
      dispatch(
        updateBank({
          name: bank_name
        })
      )
    }

    setState((state) => {
      state.settled_type = settled_type
      state.merchant_type_id = merchant_type_id
      state.merchant_name = merchant_name
      state.social_credit_code_id = social_credit_code_id
      state.regions_id = JSON.parse(regions_id)
      state.regions = province ? [province, city, area] : []
      state.address = address
      state.legal_name = legal_name
      state.legal_cert_id = legal_cert_id
      state.bank_acct_type = bank_acct_type || BANK_PRIVATE
      state.card_id_mask = card_id_mask
      state.legal_mobile = legal_mobile
      state.bank_mobile = bank_mobile
      state.license_url = license_url ? [license_url] : []
      state.bank_card_front_url = bank_card_front_url ? [bank_card_front_url] : []
      state.legal_certid_front_url = legal_certid_front_url || ''
      state.legal_cert_id_back_url = legal_cert_id_back_url || ''
    })
    setState((state) => {
      state.formloading = false
    })
  }

  //点击下一步/上一步
  const handleStep = (direction) => async () => {
    let end
    if (direction === 'next') {
      end = await handleSubmit()
      setLoading(false)
      if (end) return
    }
    let nextStep = direction === 'next' ? Math.min(step + 1, 3) : Math.max(step - 1, 1)
    S?.set(MerchantStepKey, nextStep, true)
    setStep(nextStep)
  }

  //获取当前哪一步
  const getStep = async () => {
    setState((state) => {
      state.formloading = true
    })
    const { step } = await merchantApi.getStep()
    const is_audit = step == 4
    //如果是审核失败跳回第一步
    if (is_audit) {
      const storeStep = S?.get(MerchantStepKey, true)
      setStep(storeStep ? storeStep : 1)
    } else {
      setStep(step)
    }

    //大于1才调用详情
    if (step > 1) {
      getDetail()
    } else {
      setState((state) => {
        state.formloading = false
      })
    }
    //如果是一步都没走
    if (step === 1) {
      S?.delete(MerchantStepKey, true)
    }
  }

  const getMerchatType = async () => {
    const { settled_type } = await merchantApi.getSetting()
    const options = settled_type.map((item) => {
      if (item === 'enterprise') {
        return { value: item, label: $t('3c94bb91.04c9e3') }
      } else if (item === 'soletrader') {
        return { value: item, label: $t('3c94bb91.a41061') }
      }
    })
    setMerchantOptions(options)
  }

  useEffect(() => {
    getMerchatType()
  }, [i18n.language])

  useEffect(() => {
    getStep()
    return () => {
      S?.delete(MerchantStepKey, true)
      clearMerchant()
    }
  }, [])

  const handleSwitchSelector = (type) => () => {
    let url = `/subpages/merchant/selector?type=${type}`
    if (type === BUSINESS_SCOPE) {
      url += `&parent_id=${merchantType.id}`
    }
    Taro.navigateTo({
      url
    })
  }

  const handleLogout = () => {
    S?.delete(MerchantStepKey, true)
    clearMerchant()
  }

  const clearMerchant = () => {
    dispatch(updateMerchantType({}))
    dispatch(updateBusinessScope({}))
    dispatch(updateBank({}))
  }

  const fieldName =
    state.settled_type === 'soletrader' ? $t('3c94bb91.b29725') : $t('3c94bb91.e1a437')

  console.log('===render===>', merchantType, businessScope, bankName)

  return (
    <SpPage className='page-merchant-apply' navbar={false}>
      <MNavBar canBack={step !== 1} onBack={handleStep('back')} onLogout={handleLogout} />

      {state.formloading ? (
        <SpLoading />
      ) : (
        <View>
          <MStep options={stepOptions} className='mt-40' step={step} />
          <ScrollView scrollY className='apply-scroll'>
            <View className='page-merchant-apply-content'>
              <View className='card'>
                {step === 1 && (
                  <View>
                    <MCell
                      title={$t('3c94bb91.4709c8')}
                      required
                      value={merchantType.name}
                      onClick={handleSwitchSelector(MERCHANT_TYPE)}
                    />
                    {merchantType.id && (
                      <MCell
                        title={$t('3c94bb91.04228b')}
                        required
                        value={businessScope.name}
                        onClick={handleSwitchSelector(BUSINESS_SCOPE)}
                      />
                    )}
                    <MCell
                      title={$t('3c94bb91.82054a')}
                      required
                      mode='radio'
                      value={state.settled_type}
                      radioOptions={merchantOptions}
                      onRadioChange={handleChange('settled_type')}
                    />
                  </View>
                )}
                {step === 2 && (
                  <View>
                    <MCell
                      title={$t('3c94bb91.f47e27')}
                      required
                      mode='input'
                      placeholder={$t('3c94bb91.8ded4d')}
                      value={state.merchant_name}
                      onChange={handleChange('merchant_name')}
                    />
                    <MCell
                      title={$t('3c94bb91.25c0bd')}
                      required
                      mode='input'
                      placeholder={$t('3c94bb91.4d3652')}
                      value={state.social_credit_code_id}
                      onChange={handleChange('social_credit_code_id')}
                    />
                    {/* <MCell
                      title='所在省市'
                      required
                      mode='area'
                      areaList={areaList}
                      selectArea={state.regions}
                      onColumnChange={onAreaColumnChange}
                      onChange={onAreaChange}
                    /> */}
                    <MCell
                      title={$t('3c94bb91.c63fa8')}
                      required
                      mode='area'
                      placeholder={$t('3c94bb91.6074ce')}
                      value={state.regions}
                      onChange={(regions, regionIds) => {
                        console.log('regions', regions)
                        console.log('regionIds', regionIds)
                        setState((draft) => {
                          draft.regions = regions
                          draft.regions_id = regionIds
                        })
                      }}
                    />
                    <MCell
                      title={$t('692ba07e.61a0ec')}
                      required
                      mode='input'
                      placeholder={$t('3c94bb91.86977d')}
                      value={state.address}
                      onChange={handleChange('address')}
                    />
                    <MCell
                      title={ti('3c94bb91.e29509', [fieldName])}
                      required
                      mode='input'
                      placeholder={ti('3c94bb91.b696d7', [fieldName])}
                      value={state.legal_name}
                      onChange={handleChange('legal_name')}
                    />
                    <MCell
                      title={$t('3c94bb91.84e0cb')}
                      required
                      mode='input'
                      placeholder={$t('3c94bb91.454fd8')}
                      value={state.legal_cert_id}
                      onChange={handleChange('legal_cert_id')}
                    />
                    <MCell
                      title={$t('3c94bb91.92448a')}
                      required
                      mode='input'
                      placeholder={$t('3c94bb91.ff95a4')}
                      value={state.legal_mobile}
                      onChange={handleChange('legal_mobile')}
                    />
                    <MCell
                      title={$t('3c94bb91.7e763e')}
                      mode='radio'
                      value={state.bank_acct_type}
                      radioOptions={bankAccType}
                      onRadioChange={handleChange('bank_acct_type')}
                    />
                    <MCell
                      title={$t('3c94bb91.e8ff1e')}
                      mode='input'
                      placeholder={$t('3c94bb91.a4d59c')}
                      value={state.card_id_mask}
                      onChange={handleChange('card_id_mask')}
                    />
                    {banknameRequired && (
                      <MCell
                        title={$t('3c94bb91.be02a6')}
                        value={bankName.name}
                        onClick={handleSwitchSelector(BANG_NAME)}
                      />
                    )}
                    {bankmobileRequired && (
                      <MCell
                        title={$t('3c94bb91.c36b02')}
                        mode='input'
                        placeholder={$t('3c94bb91.31d261')}
                        value={state.bank_mobile}
                        onChange={handleChange('bank_mobile')}
                      />
                    )}
                  </View>
                )}
                {step === 3 && (
                  <View className='certificate-information'>
                    <MImgPicker
                      useMallToken
                      title={
                        <Text>
                          {$t('3c94bb91.b35543')}
                          <Text className='primary'>{$t('3c94bb91.e0b8cc')}</Text>
                          {$t('3c94bb91.d2fb1e')}
                        </Text>
                      }
                      value={state.license_url}
                      onChange={handleChange('license_url')}
                      info={[$t('3c94bb91.795dd2')]}
                    />
                    <MImgPicker
                      useMallToken
                      mode='idCard'
                      title={
                        <Text>
                          {$t('3c94bb91.b35543')}
                          <Text className='primary'>
                            {fieldName}
                            {$t('3c94bb91.d60ad4')}
                          </Text>
                          {$t('3c94bb91.d2fb1e')}
                        </Text>
                      }
                      value={[state.legal_certid_front_url, state.legal_cert_id_back_url]}
                      onChange={handleChange('legal_certid_front_url', 'legal_cert_id_back_url')}
                      info={[
                        ti('3c94bb91.a08013', [fieldName]),
                        ti('3c94bb91.e30ad1', [fieldName])
                      ]}
                    />
                    <MImgPicker
                      useMallToken
                      mode='bankCard'
                      required={false}
                      value={state.bank_card_front_url}
                      onChange={handleChange('bank_card_front_url')}
                      title={
                        <Text>
                          {$t('3c94bb91.b35543')}
                          <Text className='primary'>{$t('3c94bb91.a63e2f')}</Text>
                          {$t('3c94bb91.d2fb1e')}
                        </Text>
                      }
                      info={[$t('3c94bb91.7895b7')]}
                    />
                  </View>
                )}
              </View>
              {step !== 1 && (
                <View className='info mt-24'>
                  <Text className='iconfont icon-info'></Text>
                  <Text className='text'>
                    {step === 2 ? ti(STEPTWO_TEXT_KEY, [fieldName]) : $t(STEPTHREE_TEXT_KEY)}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      )}

      <View className='apply-bottom'>
        <View className='apply-bottom-text' onClick={navigateToAgreement}>
          {$t('3c94bb91.1e058c')}
        </View>
        <MButton className='apply-bottom-button' onClick={handleStep('next')} loading={loading}>
          {isSubmit ? $t('b4dfc303.939d53') : $t('d121a348.38ce27')}
        </MButton>
      </View>
    </SpPage>
  )
}

export default Apply
