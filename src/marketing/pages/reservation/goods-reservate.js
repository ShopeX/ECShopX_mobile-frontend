import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance, useRouter } from '@tarojs/taro'
import { View, Switch, Text, Button, ScrollView, Picker } from '@tarojs/components'
import { AtButton, AtTextarea, AtFloatLayout, AtCheckbox } from 'taro-ui'
import {
  SpCell,
  SpPage,
  SpAddress,
  SpInput as AtInput,
  SpForm,
  SpFormItem,
  SpFloatLayout
} from '@/components'
import api from '@/api'
import { isWxWeb, showToast } from '@/utils'
import S from '@/spx'
import { useNavigation } from '@/hooks'
import CompImgPicker from './comps/comp-img-picker'
import './goods-reservate.scss'

const initialState = {
  info: {},
  listLength: 0,
  areaArray: [[], [], []],
  areaIndexArray: [0, 0, 0],
  areaData: [],
  chooseValue: ['', '', ''],
  isOpened: false,
  formList: [],
  form: {},
  rules: [],
  formElementMap: {
    'text': AtInput,
    'number': AtInput,
    'radio': AtInput,
    'select': AtInput,
    'checkbox': AtInput,
    'textarea': AtInput,
    'address': AtInput,
    'birthday': AtInput,
    'idcard': 1,
    'otherfile': 2
  },
  currentField: '',
  showCheckboxPanel: false,
  optionList: [],
  checkedList: [],
  currentFieldTitle: ''
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
    formElementMap,
    currentField,
    showCheckboxPanel,
    optionList,
    checkedList,
    currentFieldTitle
  } = state
  const { setNavigationBarTitle } = useNavigation()
  const formRef = useRef()

  useEffect(() => {
    fetchAddressList()
    fetch()
    fetchActivity()
    setNavigationBarTitle(initNavigationBarTitle())
  }, [])

  const initNavigationBarTitle = () => {
    return '啊我的好季节啊我喝点酒哈我的卡'
  }

  const fetchAddressList = async () => {
    const areaData = await api.member.areaList()
    setState((draft) => {
      draft.areaData = areaData
    })
  }

  const fetchActivity = async () => {
    const { activity_info } = await api.user.registrationActivity({
      activity_id: router.params.activity_id
    })
    console.log(111, activity_info)
    let _formList = activity_info?.formdata?.content?.[0]?.formdata ?? []
    _formList = _formList.concat([
      {
        company_id: '34',
        field_name: 'idcard',
        field_title: '身份证',
        form_element: 'idcard',
        id: '222',
        image_url: '',
        is_required: true,
        options: null,
        sort: 1,
        status: 1
      },
      {
        company_id: '34',
        field_name: 'otherfile',
        field_title: '其他文件',
        form_element: 'otherfile',
        id: '212',
        image_url: '',
        is_required: true,
        options: null,
        sort: 1,
        status: 1
      }
    ])
    let _form = {}
    let _rules = []
    if (_formList.length) {
      _formList.forEach((item) => {
        _form[item.field_name] = ['checkbox', 'area','idcard','otherfile'].includes(item.form_element) ? [] : ''
        if (item.is_required) {
            _rules[item.field_name] = [{ required: true, message: `${item.field_title}不能为空` }]
        }
      })
    }

    setState((draft) => {
      draft.formList = _formList
      draft.form = _form
      draft.rules = _rules
    })
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
    if (currentField) {
      onChange(chooseValue, currentField)
    }
  }

  const handleShowCheckbox = (options, field_name, field_title) => {
    console.log('options', options)
    const _options = JSON.parse(JSON.stringify(options))
    _options.forEach((item) => {
      item.label = item.value
    })
    setState((draft) => {
      draft.optionList = _options
      draft.currentField = field_name
      draft.showCheckboxPanel = true
      draft.checkedList = form[field_name]
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
      onChange(checkedList, currentField)
    }
    setState((draft) => {
      draft.showCheckboxPanel = false
    })
  }

  console.log('form', form, 'rules', rules)

  const renderFormItem = (item) => {
    const { field_title, field_name, form_element, options } = item
    switch (form_element) {
      case 'text':
      case 'number':
        return (
          <AtInput
            name={field_name}
            value={form[field_name]}
            type={form_element}
            placeholder={`请填写${field_title}`}
            onChange={(e) => onChange(e, field_name)}
          />
        )
      case 'textarea':
        return (
          <AtTextarea
            count={false}
            name={field_name}
            value={form[field_name]}
            cursor={form?.field_name?.length}
            placeholder={`请填写${field_title}`}
            onChange={(e) => onChange(e, field_name)}
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
            onChange={(e) => handleSelectChange(e, field_name, options, form_element)}
          >
            <View className='search-condition'>
              {form[field_name] || <Text className='search-condition-empty'>请选择</Text>}
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
                draft.currentField = field_name
              })
            }}
          >
            {form[field_name]?.join('') || <Text className='search-condition-empty'>请选择</Text>}
            <View className='iconfont icon-arrowDown area-icon'></View>
          </View>
        )
      case 'checkbox':
        return (
          <View
            className='search-condition'
            onClick={() => handleShowCheckbox(options, field_name, field_title)}
          >
            {form[field_name]?.join('、') || <Text className='search-condition-empty'>请选择</Text>}
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
            value={form[field_name]}
            onChange={(e) => onChange(e, field_name)}
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
        <SpForm ref={formRef} className='form-list' formData={form} rules={rules}>
          {list.map((item, idx) => (
            <SpFormItem label={item.field_title} prop={item.field_name} key={idx}>
              {renderFormItem(item)}
            </SpFormItem>
          ))}
        </SpForm>
      </>
    )
  }

  const fetch = async () => {
    Taro.showLoading({ title: '' })
    const { list } = await api.member.addressList()
    setState((draft) => {
      draft.listLength = list?.length
    })

    list.map((a_item) => {
      if (a_item.address_id === $instance.router?.params?.address_id) {
        setState((draft) => {
          draft.info = a_item
          draft.chooseValue = [a_item.province, a_item.city, a_item.county]
        })
      }
    })

    if ($instance.router?.params?.isWechatAddress) {
      try {
        const resAddress = await Taro.chooseAddress()
        const query = {
          province: resAddress?.provinceName,
          city: resAddress?.cityName,
          county: resAddress?.countyName,
          adrdetail: resAddress?.detailInfo,
          is_def: 0,
          postalCode: resAddress?.postalCode,
          telephone: resAddress?.telNumber,
          username: resAddress?.userName
        }
        setState((draft) => {
          draft.info = query
          draft.chooseValue = [query.province, query.city, query.county]
        })
      } catch (err) {
        console.error(err)
      }
    }

    Taro.hideLoading()
  }

  const handleClickClose = () => {
    setState((draft) => {
      draft.isOpened = false
    })
  }

  const handleChange = (name, val, e) => {
    console.log('---', name, val, e)
    const nInfo = JSON.parse(JSON.stringify(state.info || {}))
    if (name === 'adrdetail') {
      nInfo[name] = e.detail.value
    } else {
      nInfo[name] = val
    }
    setState((draft) => {
      draft.info = nInfo
    })
  }

  const handleSubmit = async (e) => {
    await formRef.current.onSubmitAsync()
    const { value } = e.detail || {}
    const { chooseValue } = state
    const data = {
      ...state.info,
      ...value
    }

    if (!data.is_def) {
      data.is_def = '0'
    } else {
      data.is_def = '1'
    }
    if (state.listLength === 0) {
      data.is_def = '1'
    }

    if (!data.username) {
      return showToast('请输入收件人')
    }

    if (!data.telephone) {
      return showToast('请输入手机号')
    }

    data.province = chooseValue[0]
    data.city = chooseValue[1]
    data.county = chooseValue[2]

    if (!data.adrdetail) {
      return showToast('请输入详细地址')
    }

    Taro.showLoading('正在提交')

    try {
      await api.member.addressCreateOrUpdate(data)
      if (data.address_id) {
        showToast('修改成功')
      } else {
        showToast('创建成功')
      }
      setTimeout(() => {
        Taro.navigateBack()
      }, 700)
    } catch (error) {
      Taro.hideLoading()
      return false
    }
    Taro.hideLoading()
  }

  const { info, chooseValue, isOpened } = state

  return (
    <SpPage
      className='page-good-reservate'
      renderFooter={
        <View className='btns'>
          <AtButton
            circle
            type='primary'
            className='submit-btn'
            style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary}`}
            onClick={handleSubmit}
          >
            提交
          </AtButton>
        </View>
      }
    >
      <ScrollView className='scroll-view-container'>
        <View className='scroll-view-body'>
          <View className='page-good-reservate__welcome'>欢迎来到达仁堂2025年年度股东大会</View>
          <View className='page-good-reservate__title'>S股股东出席天津会场</View>
          <View className='page-good-reservate__tips'>
            提示：欲在天津会场出席的s大家看我喝点酒哈我觉得回家啊我活动空间啊我和贷记卡文化科技大会。
          </View>

          <View className='page-good-reservate__form'>{renderFormList(formList)}</View>
        </View>
      </ScrollView>

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
