import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance, useRouter } from '@tarojs/taro'
import { View, Switch, Text, Button, ScrollView } from '@tarojs/components'
import { AtButton, AtTextarea } from 'taro-ui'
import { SpCell, SpPage, SpAddress, SpInput as AtInput, SpForm, SpFormItem } from '@/components'
import api from '@/api'
import { isWxWeb, showToast } from '@/utils'
import S from '@/spx'
import { useNavigation } from '@/hooks'

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
    'birthday': AtInput
  }
}

function GoodReservate(props) {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const colors = useSelector((state) => state.colors.current)
  const dispatch = useDispatch()
  const router = useRouter()
  const { formList, form, rules, formElementMap } = state
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
    setState((draft) => {
      // draft.formList = activity_info?.formdata?.content?.[0]?.formdata ?? []
    })
  }

  const onChange = () => {}

  const renderFormItem = (item) => {
    const { field_title, field_name, form_element } = item
    switch (form_element) {
      case 'text':
      case 'number':
        return (
          <AtInput
            name={field_name}
            value={form.field_name}
            type={form_element}
            placeholder={`请填写${field_title}`}
            onChange={onChange}
          />
        )
        break
      case 'radio':
      case 'select':
        return (
          <AtInput
            name={field_name}
            value={form.field_name}
            type={form_element}
            placeholder={`请填写${field_title}`}
            onChange={onChange}
          />
        )
        break
      case 'textarea':
        return (
          <AtTextarea
            count={false}
            name={field_name}
            value={form.field_name}
            cursor={form?.field_name?.length}
            placeholder={`请填写${field_title}`}
            onChange={onChange}
          />
        )
        break

      default:
        break
    }
  }

  console.log('formList', formList)

  const renderFormList = (list = []) => {
    return (
      <>
        <SpForm ref={formRef} className='form-list' formData={form} rules={rules}>
          {/* {list.map((item, idx) => (
            <SpFormItem label={item.field_title} prop={item.field_name}>
              {renderFormItem(item)}
            </SpFormItem>
          ))} */}
          {/* <SpFormItem label='提货时间' prop='pickerTime'>
            <SpCell
              className='picker-time'
              isLink
              onClick={() => {
                setState((draft) => {
                  draft.showTimePicker = true
                })
              }}
            >
              <Text
                className={classNames({
                  'placeholder': !form.pickerTime
                })}
              >
                {getPickerTime()}
              </Text>
            </SpCell>
          </SpFormItem>
          <SpFormItem label='提货人' prop='pickerName'>
            <AtInput
              name='pickerName'
              value={form.pickerName}
              placeholder='请输入提货人姓名'
              onChange={onInputChange.bind(this, 'pickerName')}
            />
          </SpFormItem>
          <SpFormItem label='手机号码' prop='pickerPhone'>
            <AtInput
              name='pickerPhone'
              value={form.pickerPhone}
              placeholder='请输入提货人手机号码'
              onChange={onInputChange.bind(this, 'pickerPhone')}
            />
          </SpFormItem> */}
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

  const onPickerClick = () => {
    setState((draft) => {
      draft.isOpened = true
    })
  }

  const handleClickClose = () => {
    setState((draft) => {
      draft.isOpened = false
    })
  }

  const onPickerChange = (selectValue) => {
    const chooseValue = [selectValue[0]?.label, selectValue[1]?.label, selectValue[2]?.label]
    setState((draft) => {
      draft.chooseValue = chooseValue
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

  const handleDefChange = (e) => {
    const info = {
      ...state.info,
      is_def: e.detail.value ? 1 : 0
    }

    setState((draft) => {
      draft.info = info
    })
  }

  const handleSubmit = async (e) => {
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

          <View className='page-good-reservate__forms'>
            <SpCell className='logistics-no border-bottom' title='收件人'>
              <AtInput
                name='username'
                value={info?.username}
                cursor={info?.username?.length}
                placeholder='收件人姓名'
                onChange={(e) => handleChange('username', e)}
              />
            </SpCell>

            <SpCell className='logistics-no border-bottom' title='手机号码'>
              <AtInput
                name='telephone'
                maxLength={11}
                value={info?.telephone}
                cursor={info?.telephone?.length}
                placeholder='收件人手机号'
                onChange={(e) => handleChange('telephone', e)}
              />
            </SpCell>

            <SpCell
              className='logistics-no province border-bottom'
              title='所在区域'
              isLink
              arrow
              onClick={onPickerClick}
            >
              <View className='picker'>
                {chooseValue?.join('') === '' ? (
                  <Text>选择省/市/区</Text>
                ) : (
                  <Text style={{ color: '#222' }}>{chooseValue?.join('/')}</Text>
                )}
              </View>
            </SpCell>

            <SpCell className='logistics-no detail-address' title='详细地址'>
              <AtTextarea
                count={false}
                // name='adrdetail'
                value={info?.adrdetail}
                cursor={info?.adrdetail?.length}
                maxLength={100}
                placeholder='请填写详细地址（街道、门牌）'
                onChange={handleChange.bind(this, 'adrdetail')}
              />
            </SpCell>
          </View>

          <SpCell
            title='设为默认收货地址'
            iisLink
            className='default_address'
            value={
              <Switch
                checked={info?.is_def}
                className='def-switch'
                onChange={handleDefChange}
                color={colors.data[0].primary}
              />
            }
          />
        </View>
      </ScrollView>

      <SpAddress isOpened={isOpened} onClose={handleClickClose} onChange={onPickerChange} />
    </SpPage>
  )
}

GoodReservate.options = {
  addGlobalClass: true
}

export default GoodReservate
