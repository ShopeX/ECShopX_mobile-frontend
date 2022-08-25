import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { ScrollView, View, Text } from '@tarojs/components'
import { showToast, isArray, isUndefined } from '@/utils'
import { SpPage, SpLoading } from '@/components'
import { MButton, MStep, MNavBar, MCell, MImgPicker } from './comps'
import { useArea, usePrevious } from './hook'
import { navigateToAgreement } from './util'
import { useSelector, useDispatch } from 'react-redux'
import {
  MERCHANT_TYPE,
  BUSINESS_SCOPE,
  BANG_NAME,
  STEPTWOTEXT,
  STEPTHREETEXT,
  MerchantStepKey,
  BANK_PUBLIC,
  BANK_PRIVATE
} from './consts'
import { useImmer } from 'use-immer'
import api from '@/api'
import S from '@/spx'
import './apply.scss'
import { updateBank, updateBusinessScope, updateMerchantType } from '@/store/slices/merchant'

const StepOptions = ['入驻信息', '商户信息', '证照信息']

const bankAccType = [
  { value: BANK_PUBLIC, label: '对公' },
  { value: BANK_PRIVATE, label: '对私' }
]

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
  const [state, setState] = useImmer(initialState)

  const { merchantType, businessScope, bank: bankName } = useSelector((state) => state.merchant)

  const dispatch = useDispatch()

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
        showToast('请填写信息')
        return true
      }
      if (!merchantType.id || !businessScope.id || !state.settled_type) {
        showToast('请完善信息')
        return true
      }
      params = {
        step: 1,
        settled_type,
        merchant_type_id
      }
      //第二步保存
    } else if (step === 2) {
      const currentStepData = [
        merchant_name,
        social_credit_code_id,
        regions_id,
        regions,
        address,
        legal_name,
        legal_cert_id,
        legal_mobile,
        bank_acct_type,
        card_id_mask
      ]

      const hasValues = currentStepData.every(
        (item) => (isArray(item) && item.length > 0) || !!item
      )

      if (!hasValues) {
        showToast('请完善信息')
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
      const allData = [
        license_url[0],
        legal_certid_front_url,
        legal_cert_id_back_url,
        bank_card_front_url[0]
      ]

      const allWrite = allData.every((item) => !!item)

      if (!allWrite) {
        showToast('请完善信息')
        return true
      }

      const { confirm } = await Taro.showModal({
        title: '提示',
        content: '请确认是否提交审核',
        showCancel: true,
        cancel: '取消',
        confirmText: '确认',
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
      await api.merchant.save(params)
      if (step === 3) {
        S.delete(MerchantStepKey, true)
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
    } = await api.merchant.detail()

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
    S.set(MerchantStepKey, nextStep, true)
    setStep(nextStep)
  }

  //获取当前哪一步
  const getStep = async () => {
    setState((state) => {
      state.formloading = true
    })
    const { step } = await api.merchant.getStep()
    const is_audit = step == 4
    //如果是审核失败跳回第一步
    if (is_audit) {
      const storeStep = S.get(MerchantStepKey, true)
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
      S.delete(MerchantStepKey, true)
    }
  }

  const getMerchatType = async () => {
    if (merchantOptions.length === 2) return
    const { settled_type } = await api.merchant.getSetting()
    const options = settled_type.map((item) => {
      if (item === 'enterprise') {
        return { value: item, label: '企业' }
      } else if (item === 'soletrader') {
        return { value: item, label: '个体户' }
      }
    })
    setMerchantOptions(options)
  }

  useEffect(() => {
    getMerchatType()
  }, [])

  useEffect(() => {
    getStep()
    return () => {
      S.delete(MerchantStepKey, true)
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
    S.delete(MerchantStepKey, true)
    clearMerchant()
  }

  const clearMerchant = () => {
    dispatch(updateMerchantType({}))
    dispatch(updateBusinessScope({}))
    dispatch(updateBank({}))
  }

  const fieldName = state.settled_type === 'soletrader' ? '负责人' : '法人'

  console.log('===render===>', merchantType, businessScope, bankName)

  return (
    <SpPage className='page-merchant-apply' navbar={false}>
      <MNavBar canBack={step !== 1} onBack={handleStep('back')} onLogout={handleLogout} />

      {state.formloading ? (
        <SpLoading />
      ) : (
        <View>
          <MStep options={StepOptions} className='mt-40' step={step} />
          <ScrollView scrollY className='apply-scroll'>
            <View className='page-merchant-apply-content'>
              <View className='card'>
                {step === 1 && (
                  <View>
                    <MCell
                      title='商户类型'
                      required
                      value={merchantType.name}
                      onClick={handleSwitchSelector(MERCHANT_TYPE)}
                    />
                    {merchantType.id && (
                      <MCell
                        title='经营范围'
                        required
                        value={businessScope.name}
                        onClick={handleSwitchSelector(BUSINESS_SCOPE)}
                      />
                    )}
                    <MCell
                      title='入驻类型'
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
                      title='企业名称'
                      required
                      mode='input'
                      placeholder='请输入企业名称'
                      value={state.merchant_name}
                      onChange={handleChange('merchant_name')}
                    />
                    <MCell
                      title='统一社会信用代码'
                      required
                      mode='input'
                      placeholder='请输入统一社会信用代码'
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
                      title='所在省市'
                      required
                      mode='area'
                      value={state.regions}
                      onChange={(regions, regionIds) => {
                        setState((draft) => {
                          draft.regions = regions
                          draft.regions_id = regionIds
                        })
                      }}
                    />
                    <MCell
                      title='详细地址'
                      required
                      mode='input'
                      placeholder='请输入街道门牌信息'
                      value={state.address}
                      onChange={handleChange('address')}
                    />
                    <MCell
                      title={`${fieldName}姓名`}
                      required
                      mode='input'
                      placeholder={`请输入${fieldName}姓名`}
                      value={state.legal_name}
                      onChange={handleChange('legal_name')}
                    />
                    <MCell
                      title='身份证号码'
                      required
                      mode='input'
                      placeholder='请输入身份证号码'
                      value={state.legal_cert_id}
                      onChange={handleChange('legal_cert_id')}
                    />
                    <MCell
                      title='手机号码'
                      required
                      mode='input'
                      placeholder='请输入手机号码'
                      value={state.legal_mobile}
                      onChange={handleChange('legal_mobile')}
                    />
                    <MCell
                      title='结算银行账号类型'
                      required
                      mode='radio'
                      value={state.bank_acct_type}
                      radioOptions={bankAccType}
                      onRadioChange={handleChange('bank_acct_type')}
                    />
                    <MCell
                      title='结算银行账号'
                      required
                      mode='input'
                      placeholder='请输入结算银行账号'
                      value={state.card_id_mask}
                      onChange={handleChange('card_id_mask')}
                    />
                    {banknameRequired && (
                      <MCell
                        title='结算银行'
                        required
                        value={bankName.name}
                        onClick={handleSwitchSelector(BANG_NAME)}
                      />
                    )}
                    {bankmobileRequired && (
                      <MCell
                        title='绑定手机号'
                        required
                        mode='input'
                        placeholder='请输入绑定手机号'
                        value={state.bank_mobile}
                        onChange={handleChange('bank_mobile')}
                      />
                    )}
                  </View>
                )}
                {step === 3 && (
                  <View className='certificate-information'>
                    <MImgPicker
                      title={
                        <Text>
                          请根据提示上传<Text className='primary'>营业执照</Text>照片
                        </Text>
                      }
                      value={state.license_url}
                      onChange={handleChange('license_url')}
                      info={['上传营业执照']}
                    />
                    <MImgPicker
                      mode='idCard'
                      title={
                        <Text>
                          请根据提示上传<Text className='primary'>{`${fieldName}手持身份证`}</Text>
                          照片
                        </Text>
                      }
                      value={[state.legal_certid_front_url, state.legal_cert_id_back_url]}
                      onChange={handleChange('legal_certid_front_url', 'legal_cert_id_back_url')}
                      info={[`上传${fieldName}手持身份证正面`, `上传${fieldName}手持身份证反面`]}
                    />
                    <MImgPicker
                      mode='bankCard'
                      value={state.bank_card_front_url}
                      onChange={handleChange('bank_card_front_url')}
                      title={
                        <Text>
                          请根据提示上传<Text className='primary'>结算银行卡正面</Text>照片
                        </Text>
                      }
                      info={['上传结算银行卡正面']}
                    />
                  </View>
                )}
              </View>
              {step !== 1 && (
                <View className='info mt-24'>
                  <Text className='iconfont icon-info'></Text>
                  <Text className='text'>
                    {step === 2 ? STEPTWOTEXT(fieldName) : STEPTHREETEXT}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      )}

      <View className='apply-bottom'>
        <View className='apply-bottom-text' onClick={navigateToAgreement}>
          《入驻协议》
        </View>
        <MButton className='apply-bottom-button' onClick={handleStep('next')} loading={loading}>
          {isSubmit ? '提交' : '下一步'}
        </MButton>
      </View>
    </SpPage>
  )
}

export default Apply
