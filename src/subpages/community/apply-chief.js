import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { AtButton, AtInput } from 'taro-ui'
import api from '@/api'
import doc from '@/doc'
import qs from 'qs'
import { CHIEF_APPLY_STATUS, FORM_COMP } from '@/consts'
import { View, Text, Picker } from '@tarojs/components'
import { SpPage, SpImage, SpForm, SpFormItem, SpUpload, SpCheckbox, SpNote } from '@/components'
import { classNames, showToast } from '@/utils'
import './apply-chief.scss'

const initialState = {
  list: [],
  form: {},
  rules: {},
  agree: false,
  approveStatus: 0,
  refuseReason: '',
  explanation: '',
  isDefault: false,
  loading: true,
  defaultMsg: '',
  defaultImg: ''
}
function ApplyChief(props) {
  const [state, setState] = useImmer(initialState)
  const {
    list,
    form,
    rules,
    agree,
    explanation,
    approveStatus,
    refuseReason,
    isDefault,
    defaultMsg,
    defaultImg,
    loading
  } = state
  const { colorPrimary } = useSelector((state) => state.sys)
  const $instance = getCurrentInstance()
  const formRef = useRef()
  const { distributor_id: dtid, scene = '' } = $instance.router.params
  let distributor_id = dtid
  if (scene) {
    const { did } = qs.parse(decodeURIComponent(scene))
    distributor_id = did
  }

  useEffect(() => {
    getApplyChief()
  }, [])

  const getApplyChief = async () => {
    const { approve_status, refuse_reason } = await api.community.getApplyChief({
      distributor_id
    })
    let _isDefault = false,
      _defaultMsg = '',
      _defaultImg = ''
    // 待审核
    if (approve_status == CHIEF_APPLY_STATUS.WAITE) {
      _isDefault = true
      _defaultMsg = '申请审核中，请耐心等待~'
      _defaultImg = 'apply_loading.png'
    } else if (approve_status == CHIEF_APPLY_STATUS.RESLOVE) {
      // 审核通过
      _isDefault = true
      _defaultMsg = '恭喜您审核通过！'
      _defaultImg = 'apply_success.png'
    } else if (approve_status == CHIEF_APPLY_STATUS.REJECT) {
      // 审核拒绝
      _isDefault = true
      _defaultMsg = '很抱歉！您的审核未通过'
      _defaultImg = 'apply_fail.png'
      fetch()
      aggrementAndExplanation()
    } else {
      fetch()
      aggrementAndExplanation()
    }
    setState((draft) => {
      draft.approveStatus = approve_status
      draft.refuseReason = refuse_reason
      draft.isDefault = _isDefault
      draft.defaultMsg = _defaultMsg
      draft.defaultImg = _defaultImg
      draft.loading = false
    })
  }

  const fetch = async () => {
    const res = await api.community.getAppayFields({
      distributor_id
    })
    let form = {},
      rules = {}
    res.forEach((item) => {
      form[item.key] = ''
      rules[item.key] = []
      if (item.is_required) {
        rules[item.key].push({ required: item.is_required, message: item.required_message })
      }
      if (item.field_type == FORM_COMP.MOBILE) {
        rules[item.key].push({ validate: 'mobile', message: '请输入正确的手机号码' })
      }
    })
    res.reverse()
    setState((draft) => {
      draft.list = res
      draft.form = form
      draft.rules = rules
    })
  }

  const aggrementAndExplanation = async () => {
    const { explanation } = await api.community.aggrementAndExplanation({ distributor_id })
    setState((draft) => {
      draft.explanation = explanation
    })
  }

  Taro.setNavigationBarColor({
    frontColor: '#ffffff',
    backgroundColor: colorPrimary,
    animation: {
      duration: 400,
      timingFunc: 'easeIn'
    }
  })

  const onInputChange = (key, value) => {
    setState((draft) => {
      draft.form[key] = value
    })
  }

  const onDateChange = (key, e) => {
    setState((draft) => {
      draft.form[key] = e.detail.value
    })
  }

  const renderFormComp = ({ field_type, required_message, is_edit, key }) => {
    let formComp = null
    switch (field_type) {
      case FORM_COMP.INPUT:
        formComp = (
          <AtInput
            clear
            focus
            name={key}
            type='text'
            value={form[key]}
            placeholder={required_message}
            onChange={onInputChange.bind(this, key)}
          />
        )
        break
      case FORM_COMP.NUMBER:
      case FORM_COMP.MOBILE:
        formComp = (
          <AtInput
            clear
            focus
            name={key}
            type='number'
            value={form[key]}
            placeholder={required_message}
            onChange={onInputChange.bind(this, key)}
          />
        )
        break
      case FORM_COMP.DATE:
        formComp = (
          <Picker mode='date' onChange={onDateChange.bind(this, key)}>
            <View
              className={classNames('at-input-date', {
                placeholder: !form[key]
              })}
            >
              {form[key] || required_message}
            </View>
          </Picker>
        )
        break
      case FORM_COMP.IMAGE:
        formComp = (
          <SpUpload
            value={form[key]}
            multiple={false}
            onChange={(val) => {
              setState((draft) => {
                draft.form[key] = val
              })
            }}
          />
        )
    }
    return formComp
  }

  const onFormSubmit = () => {
    formRef.current.onSubmit(async () => {
      console.log(form)
      if (agree) {
        await api.community.applyChief({
          ...form,
          distributor_id
        })
        showToast('申请成功')
        getApplyChief()
      } else {
        showToast('请勾选团长注册协议')
      }
    })
  }

  const onAgreeLicence = (e) => {
    setState((draft) => {
      draft.agree = e
    })
  }

  const handleClickViewLicence = (e) => {
    e.stopPropagation()
    Taro.navigateTo({
      url: `/subpages/community/chief-licence?distributor_id=${distributor_id}`
    })
  }

  const handleClickDefaultBtn = () => {
    if (approveStatus == CHIEF_APPLY_STATUS.RESLOVE) {
      Taro.redirectTo({
        url: '/subpages/community/index'
      })
    } else if (approveStatus == CHIEF_APPLY_STATUS.REJECT) {
      setState((draft) => {
        draft.isDefault = false
      })
    }
  }

  return (
    <SpPage
      className='page-community-applychief'
      isDefault={isDefault}
      defaultImg={defaultImg}
      defaultMsg={defaultMsg}
      loading={loading}
      renderDefault={
        <View
          className={classNames('default-view', {
            reject: approveStatus == CHIEF_APPLY_STATUS.REJECT
          })}
        >
          <SpNote img={defaultImg} title={defaultMsg} />
          {approveStatus == CHIEF_APPLY_STATUS.REJECT && (
            <View className='reject-reason'>{refuseReason}</View>
          )}
          {(approveStatus == CHIEF_APPLY_STATUS.RESLOVE ||
            approveStatus == CHIEF_APPLY_STATUS.REJECT) && (
            <AtButton circle type='primary' onClick={handleClickDefaultBtn}>
              {
                {
                  1: '进入我的社区团购',
                  2: '再次申请'
                }[approveStatus]
              }
            </AtButton>
          )}
        </View>
      }
      renderFooter={
        <View className='btn-wrap'>
          <AtButton circle type='primary' onClick={onFormSubmit}>
            提交
          </AtButton>
        </View>
      }
    >
      <View className='page-hd'>
        <View className='form-bg'>
          <SpImage src='form_bg.png' />
        </View>
        <View className='container'>
          <View className='applychief-desc'>
            <mp-html content={explanation} />
          </View>
          <View className='form-container'>
            <SpForm ref={formRef} className='applychief-form' formData={form} rules={rules}>
              {list.map((item, index) => (
                <SpFormItem label={item.name} prop={item.key} key={index}>
                  {/* <View>{item.name}</View> */}
                  {renderFormComp(item)}
                </SpFormItem>
              ))}
            </SpForm>
          </View>
          <View className='register-licence'>
            <SpCheckbox checked={agree} onChange={onAgreeLicence.bind(this)}>
              <View className='licence-content'>
                团长申请信息仅用于社区团购活动使用，提交申请即视为同意
                <Text className='licence-chief' onClick={handleClickViewLicence}>
                  《团长注册协议》
                </Text>
              </View>
            </SpCheckbox>
          </View>
        </View>
      </View>
    </SpPage>
  )
}

ApplyChief.options = {
  addGlobalClass: true
}

export default ApplyChief
