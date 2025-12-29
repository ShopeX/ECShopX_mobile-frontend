/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance, useRouter } from '@tarojs/taro'
import { View, Text, ScrollView, Picker } from '@tarojs/components'
import { AtButton, AtTextarea, AtCheckbox } from 'taro-ui'
import {
  SpCell,
  SpPage,
  SpAddress,
  SpForm,
  SpFormItem,
  SpFloatLayout,
  SpInput as AtInput
} from '@/components'
import api from '@/api'
import { showToast, getDistributorId, isWeixin } from '@/utils'
import { useNavigation } from '@/hooks'
import _cloneDeep from 'lodash/cloneDeep'
import CompImgPicker from './comps/comp-img-picker'
import './goods-reservate.scss'

const initialState = {
  info: {},
  listLength: 0,
  areaArray: [[], [], []],
  areaIndexArray: [0, 0, 0],
  chooseValue: ['', '', ''],
  isOpened: false,
  formList: [],
  form: {},
  rules: {},
  currentFieldId: '',
  showCheckboxPanel: false,
  optionList: [],
  checkedList: [],
  currentFieldTitle: '',
  headerBgPic: '',
  headerHeight: 0,
  submitLoading: false,
  isShow: false
}

function GoodReservate(props) {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const colors = useSelector((state) => state.colors.current)
  const dispatch = useDispatch()
  const router = useRouter()
  const {
    formList,
    form,
    rules,
    currentFieldId,
    showCheckboxPanel,
    optionList,
    checkedList,
    currentFieldTitle,
    headerBgPic,
    headerHeight,
    submitLoading,
    isOpened,
    info,
    isShow
  } = state
  const { setNavigationBarTitle } = useNavigation()
  const formRef = useRef()

  useEffect(() => {
    fetchActivity()
  }, [])

  const fetchActivity = async () => {
    let activity_info = {}
    let recordInfo = {}
    let isEdit = router.params.record_id
    const res = await api.user.registrationActivity({
      activity_id: router.params.activity_id
    })
    activity_info = res.activity_info
    if (activity_info.join_limit == res.total_join_num && res.total_join_num != 0 && !isEdit) {
      showToast('您已经超出活动次数')
      setTimeout(() => {
        Taro.navigateBack()
      }, 700)
      return
    }

    //无模板跳活动详情
    if (activity_info.temp_id == '0') {
      Taro.redirectTo({
        url: `/marketing/pages/member/activity-info?activity_id=${activity_info.activity_id}`
      })
      return
    }

    if (router.params.record_id) {
      //编辑
      recordInfo = await api.user.registrationRecordInfo({
        record_id: router.params.record_id
      })
    }

    console.log(111, activity_info, recordInfo)

    let _formList = []

    if (isEdit) {
      //编辑
      _formList = recordInfo?.content?.[0]?.formdata ?? []
    } else {
      //新增
      _formList = activity_info?.formdata?.content?.[0]?.formdata ?? []
    }
    let _form = {}
    let _rules = {}
    if (_formList.length) {
      _formList.forEach((item) => {
        if (item.options && !isEdit) {
          //新增才需要转换
          item.options = JSON.parse(item.options)
        }

        if (isEdit) {
          //编辑
          if (['otherfile', 'idcard'].includes(item.form_element)) {
            //需要转换成 [1,2] => [[1],[2]]
            _form[item.id] =
              typeof item?.answer == 'string'
                ? item?.answer.split(',').map((item) => [item])
                : item?.answer
          } else if (['checkbox', 'area'].includes(item.form_element)) {
            _form[item.id] =
              typeof item?.answer == 'string' ? item?.answer?.split(',') : item?.answer
          } else {
            _form[item.id] = item?.answer
          }
        } else {
          //新增
          _form[item.id] = ['checkbox', 'area', 'idcard', 'otherfile'].includes(item.form_element)
            ? []
            : ''
        }

        // 校验rule
        if (item.is_required) {
          if (['idcard', 'otherfile'].includes(item.form_element)) {
            _rules[item.id] = [
              {
                validate: async (value) => {
                  console.log('value', value, flatArray(value))
                  const _flatArray = flatArray(value)
                  if (!_flatArray.length) {
                    return Promise.reject(`请上传${item.field_title}`)
                  }

                  if (item.form_element == 'idcard' && _flatArray.length != 2) {
                    return Promise.reject(`${item.field_title}请上传完整`)
                  }
                }
              }
            ]
          } else {
            _rules[item.id] = [{ required: true, message: `${item.field_title}不能为空` }]
          }
        }
      })
    }

    const _info = activity_info

    setNavigationBarTitle(_info.activity_name)

    setState((draft) => {
      draft.formList = _formList
      draft.form = _form
      draft.rules = _rules
      draft.info = _info
      draft.headerBgPic = _info.formdata?.header_bg_pic
      draft.headerHeight = _info.formdata?.header_height
      draft.isShow = true
    })
  }

  const flatArray = (arr) => {
    return arr.reduce((prev, curr) => {
      return prev.concat(curr)
    }, [])
  }

  const onChange = (e, key) => {
    console.log(e, key)
    const _form = JSON.parse(JSON.stringify(form))
    _form[key] = e
    setState((draft) => {
      draft.form = _form
    })
  }

  const handleSelectChange = (e, key, options, form_element) => {
    console.log(e, key, options, form_element)
    let value
    if (form_element == 'date') {
      value = e.detail?.value
    } else {
      value = options[e.target.value]?.value
    }
    onChange(value, key)
  }

  const onPickerChange = (selectValue) => {
    const chooseValue = [selectValue[0]?.label, selectValue[1]?.label, selectValue[2]?.label]
    if (currentFieldId) {
      onChange(chooseValue, currentFieldId)
    }
  }

  const handleShowCheckbox = (options, id, field_title) => {
    console.log('options', options)
    const _options = JSON.parse(JSON.stringify(options))
    _options.forEach((item) => {
      item.label = item.value
    })
    setState((draft) => {
      draft.optionList = _options
      draft.currentFieldId = id
      draft.showCheckboxPanel = true
      draft.checkedList = form[id]
      draft.currentFieldTitle = field_title
    })
  }

  const handleSelectionChange = (e) => {
    setState((draft) => {
      draft.checkedList = e
    })
  }

  const handleCheckboxBtnClick = (isCancle) => {
    if (!isCancle) {
      onChange(checkedList, currentFieldId)
    }
    setState((draft) => {
      draft.showCheckboxPanel = false
    })
  }

  console.log('form', form, 'rules', rules)

  const renderFormItem = (item) => {
    const { field_title, field_name, id, form_element, options = [] } = item
    switch (form_element) {
      case 'text':
      case 'number':
        return (
          <AtInput
            name={id}
            value={form[id]}
            type={form_element}
            placeholder={`请填写${field_title}`}
            onChange={(e) => onChange(e, id)}
          />
        )
      case 'textarea':
        return (
          <AtTextarea
            count={false}
            name={id}
            value={form[id]}
            cursor={form?.id?.length}
            placeholder={`请填写${field_title}`}
            onChange={(e) => onChange(e, id)}
          />
        )
      case 'radio':
      case 'select':
      case 'date':
        return (
          <Picker
            mode={form_element == 'date' ? 'date' : 'selector'}
            rangeKey='value'
            range={options}
            value={
              form_element == 'date'
                ? form[id]
                : [
                    options?.findIndex((item) => item.value == form[id]) != -1
                      ? options?.findIndex((item) => item.value == form[id])
                      : 0
                  ]
            }
            onChange={(e) => handleSelectChange(e, id, options, form_element)}
          >
            <View className='search-condition'>
              {console.log(
                999,
                form_element == 'date'
                  ? form[id]
                  : [options?.findIndex((item) => item.value == form[id]) ?? 0]
              )}
              {form[id] || <Text className='search-condition-empty'>请选择</Text>}
              <View className='iconfont icon-arrowDown search-condition-icon'></View>
            </View>
          </Picker>
        )
      case 'area':
        return (
          <View
            className='search-condition'
            onClick={() => {
              setState((draft) => {
                draft.isOpened = true
                draft.currentFieldId = id
              })
            }}
          >
            {form[id]?.join('') || <Text className='search-condition-empty'>请选择</Text>}
            <View className='iconfont icon-arrowDown area-icon'></View>
          </View>
        )
      case 'checkbox':
        return (
          <View
            className='search-condition'
            onClick={() => handleShowCheckbox(options, id, field_title)}
          >
            {form[id]?.join('、') || <Text className='search-condition-empty'>请选择</Text>}
            <View className='iconfont icon-arrowDown area-icon'></View>
          </View>
        )
      case 'idcard':
      case 'otherfile':
        return (
          <CompImgPicker
            info={
              form_element == 'idcard'
                ? ['上传身份证人像面', '上传身份证国徽面']
                : [`上传${field_title}`]
            }
            mode={form_element == 'idcard' ? 'idCard' : 'shareholderCertificate'}
            value={form[id]}
            onChange={(e) => onChange(e, id)}
          />
        )
      default:
        break
    }
  }

  console.log('formList', formList)

  const renderFormList = (list = []) => {
    return (
      <>
        {list.length > 0 && (
          <SpForm ref={formRef} className='form-list' formData={form} rules={rules}>
            {list.map((item, idx) => (
              <SpFormItem label={item.field_title} prop={item.id} key={idx}>
                {renderFormItem(item)}
              </SpFormItem>
            ))}
          </SpForm>
        )}
      </>
    )
  }

  const handleClickClose = () => {
    setState((draft) => {
      draft.isOpened = false
    })
  }

  const handleSubmit = async () => {
    const { activity_id } = info
    let new_subdata = { activity_id, formdata: { content: [] }, distributor_id: getDistributorId() }
    const _content = formList.map((item) => ({
      ...item,
      answer: ['idcard', 'otherfile'].includes(item.form_element)
        ? flatArray(form[item.id])
        : form[item.id]
    }))
    let formDatacontent = _cloneDeep(info.formdata?.content)

    formDatacontent[0].formdata = _content
    new_subdata.formdata.content = JSON.stringify(formDatacontent)
    console.log('new_subdata', new_subdata, _content)

    if (router.params.record_id) {
      //编辑
      new_subdata.record_id = router.params.record_id
    }
    try {
      const res = await api.user.registrationSubmit(new_subdata)
      console.log(res)
      showToast('提交成功')
      Taro.redirectTo({
        url: `/marketing/pages/reservation/goods-reservate-result?activity_id=${activity_id}`
      })
      setTimeout(() => {
        Taro.eventCenter.trigger('onEventRecordStatusChange')
      }, 200)
      setState((draft) => {
        draft.submitLoading = false
      })
    } catch (error) {
      setState((draft) => {
        draft.submitLoading = false
      })
    }
  }

  const handleReservate = async (e) => {
    try {
      await formRef.current.onSubmitAsync()
      let templeparams = {
        'temp_name': 'yykweishop',
        'source_type': 'activity'
      }
      setState((draft) => {
        draft.submitLoading = true
      })
      api.user.newWxaMsgTmpl(templeparams).then(
        (tmlres) => {
          console.log('templeparams---1', tmlres)
          if (tmlres.template_id && tmlres.template_id.length > 0 && isWeixin) {
            wx.requestSubscribeMessage({
              tmplIds: tmlres.template_id,
              success() {
                handleSubmit()
              },
              fail() {
                handleSubmit()
              }
            })
          } else {
            handleSubmit()
          }
        },
        () => {
          handleSubmit()
        }
      )
    } catch (error) {
      console.log('error', error)
      if (error.length) {
        showToast(error[0]?.message)
      }
    }
  }

  return (
    <SpPage
      renderFooter={
        isShow && (
          <View className='btns'>
            <AtButton
              circle
              type='primary'
              className='submit-btn'
              style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary}`}
              loading={submitLoading}
              onClick={handleReservate}
            >
              提交
            </AtButton>
          </View>
        )
      }
    >
      <View
        className='page-good-reservate'
        style={{ 'backgroundImage': `url(${headerBgPic})`, paddingTop: `${headerHeight}px` }}
      >
        <ScrollView className='scroll-view-container'>
          <View className='scroll-view-body'>
            {/* <View className='page-good-reservate__welcome'>欢迎来到达仁堂2025年年度股东大会</View>
            <View className='page-good-reservate__title'>S股股东出席天津会场</View>
            <View className='page-good-reservate__tips'>
              提示：欲在天津会场出席的s大家看我喝点酒哈我觉得回家啊我活动空间啊我和贷记卡文化科技大会。
            </View> */}

            <View className='page-good-reservate__form'>{renderFormList(formList)}</View>
          </View>
        </ScrollView>
      </View>

      <SpAddress isOpened={isOpened} onClose={handleClickClose} onChange={onPickerChange} />

      <SpFloatLayout
        title={`选择${currentFieldTitle}`}
        open={showCheckboxPanel}
        onClose={() => handleCheckboxBtnClick('cancle')}
        renderFooter={
          <AtButton
            circle
            type='primary'
            className='submit-btn'
            style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary}`}
            onClick={() => handleCheckboxBtnClick()}
          >
            确定
          </AtButton>
        }
      >
        <AtCheckbox
          options={optionList}
          selectedList={checkedList}
          onChange={handleSelectionChange}
        />
      </SpFloatLayout>
    </SpPage>
  )
}

GoodReservate.options = {
  addGlobalClass: true
}

export default GoodReservate
