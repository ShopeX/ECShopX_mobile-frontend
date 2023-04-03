import React, { useEffect, useRef, useImperativeHandle } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, ScrollView, Text } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import { useImmer } from 'use-immer'
import { AddressChoose, SpCell, SpFloatLayout, SpForm, SpFormItem } from '@/components'
import { updateChooseAddress } from '@/store/slices/user'
import { enumdays } from '@/consts'
import { classNames, VERSION_STANDARD } from '@/utils'
import dayjs from 'dayjs'
import api from '@/api'

import { deliveryList } from '../const'
import './comp-deliver.scss'

const initialState = {
  distributorInfo: null,
  receiptType: '',
  showTimePicker: false,
  form: {
    pickerTime: '',
    pickerName: '',
    pickerPhone: ''
  },
  rules: {
    pickerTime: [{ required: true, message: '提货时间不能为空' }],
    pickerName: [{ required: true, message: '提货人姓名不能为空' }],
    pickerPhone: [{ required: true, message: '提货人手机号不能为空' }]
  },
  weekdays: [],
  timeSlots: [],
  pickerIndex: 0,
  activeTimeId: ''
}

function CompDeliver(props, ref) {
  const {
    address = {},
    distributor_id,
    onChangReceiptType = () => { },
    onChange = () => { },
    onEidtZiti = () => { }
  } = props

  const dispatch = useDispatch()

  const { location = {}, address: storeAddress } = useSelector((state) => state.user)
  const { rgb, openStore } = useSelector((state) => state.sys)
  const { zitiAddress } = useSelector((state) => state.cart)
  const { zitiShop } = useSelector((state) => state.shop)
  const [state, setState] = useImmer(initialState)
  const { distributorInfo, receiptType, showTimePicker, form, rules, weekdays, timeSlots, pickerIndex, activeTimeId } = state
  const formRef = useRef()
  const $instance = getCurrentInstance()
  const { cart_type } = $instance.router?.params || {}
  // useEffect(() => {
  //   fetch()
  // }, [])

  useEffect(() => {
    getShopInfo()
  }, [])

  useEffect(() => {
    if (distributorInfo) {
      fetchAddress()
    }
  }, [distributorInfo, receiptType])

  useEffect(() => {
    if (zitiAddress) {
      calcZitiPickerData()
    }
  }, [zitiAddress])

  useEffect(() => {
    if (weekdays.length > 0) {
      onChangeWeekDays(0)
    }
  }, [weekdays])

  const getShopInfo = async () => {
    let _distributorInfo
    if (distributor_id == 0) {
      _distributorInfo = await api.shop.getHeadquarters({ distributor_id })
    } else {
      _distributorInfo = await api.shop.getShop({ distributor_id })
    }

    const _receiptType = deliveryList.find(item => !!_distributorInfo[item.key])
    setState((draft) => {
      draft.distributorInfo = _distributorInfo
      draft.receiptType = _receiptType?.type || 'logistics'
    })
  }

  const fetchAddress = async () => {
    if (receiptType == 'ziti') {
      onChange({
        receipt_type: receiptType,
        distributor_info: distributorInfo,
        address_info: null
      })
      return
    }

    let query = {
      receipt_type: receiptType
    }
    if (receiptType == 'dada') {
      query['city'] = distributorInfo.city
    }
    // 非自提情况下，把地址存起来，否则清空地址
    const { list } = await api.member.addressList(query)
    const defaultAddress = list.find((item) => item.is_def) || list[0] || null

    const selectAddress = list.find(item => item.address_id == storeAddress?.address_id)

    onChange({
      receipt_type: receiptType,
      distributor_info: distributorInfo,
      address_info: selectAddress || defaultAddress
    })
  }



  const calcZitiPickerData = () => {
    const { wait_pickup_days, hours } = zitiAddress
    const _weekdays = []
    for (let i = 0; i <= parseInt(wait_pickup_days); i++) {
      const _day = dayjs().add(i, 'day')
      _weekdays.push({ title: enumdays[i] || _day.format('YYYY-MM-DD'), value: _day })
    }

    setState(draft => {
      draft.weekdays = _weekdays
      // draft.timeSlots = hours
    })
  }

  const onChangeWeekDays = (index) => {
    const activeWeekday = weekdays[index].value
    const { hours, latest_pickup_time, workdays } = zitiAddress
    const week = dayjs(activeWeekday).day()
    const _timeSlots = []
    for (let i = 0; i < hours.length; i++) {
      let enable = workdays.includes(week.toString())
      // 下单时间在latest_pickup_time之前，可预约当天自提
      // index == 0 即为当日
      if (latest_pickup_time && index == 0) {
        const lasterDateTime = `${dayjs().format('YYYY-MM-DD')} ${latest_pickup_time}:00`
        enable = enable && dayjs().isBefore(lasterDateTime)
      }
      // 当前时间大于提货时间段结算时间，时间段有效
      if (index == 0) {
        const timeSlotEnd = `${dayjs().format('YYYY-MM-DD')} ${hours[i][1]}:00`
        enable = enable && dayjs().isBefore(timeSlotEnd)
      }
      _timeSlots.push({
        id: `${week}_${i}`,
        value: hours[i],
        date: dayjs(activeWeekday).format('YYYY-MM-DD'),
        disabled: !enable
      })
    }
    setState(draft => {
      draft.pickerIndex = index
      draft.timeSlots = _timeSlots
    })
  }

  const onChangeTimeSlot = ({ id, date, value, disabled }) => {
    if (disabled) {
      return
    }
    setState((draft) => {
      draft.form['pickerTime'] = {
        date,
        time: value
      }
      draft.showTimePicker = false
      draft.activeTimeId = id
    })
  }

  const getPickerTime = () => {
    const { pickerTime } = form
    if (!pickerTime) {
      return '请选择提货时间'
    } else {
      const { date, time } = pickerTime
      return `${date} ${time.join('-')}`
    }
  }

  const handleSwitchExpress = async (receipt_type) => {
    // 切换配送方式
    if (receiptType === receipt_type) return
    setState((draft) => {
      draft.receiptType = receipt_type
    })
  }

  const handleMapClick = () => {
    // 点击地图icon
    const { lat, lng } = location || {}
    Taro.openLocation({
      latitude: Number(lat),
      longitude: Number(lng),
      scale: 18
    })
  }

  // 切换自提店铺
  const handleEditZitiClick = (id = 0) => {
    onEidtZiti(id)
  }

  const handleChooseAddress = (choose) => {
    // 自定义选择店铺跳转事件
    let city = distributorInfo.city
    Taro.navigateTo({
      url: `/marketing/pages/member/address?isPicker=${choose}&city=${city}&receipt_type=dada`
    })
  }

  const zitiInfo = zitiShop && receiptType === 'ziti' ? zitiShop : distributorInfo

  const onInputChange = (key, value) => {
    setState((draft) => {
      draft.form[key] = value
    })
  }

  useImperativeHandle(ref, () => ({
    // reset 就是暴露给父组件的方法
    getZitiInfo: () => {
      return form
    },
    validateZitiInfo: async () => {
      await formRef.current.onSubmitAsync()
    }
  }))

  if (!distributorInfo) {
    return null
  }

  return (
    <View className='page-comp-deliver'>
      <View className='switch-box'>
        <View className={classNames(deliveryList.length > 0 && 'switch-tab')}>
          {deliveryList.map((item) => {
            if (distributorInfo[item.key]) {
              return (
                <View
                  key={item.type}
                  className={`switch-item ${receiptType === item.type ? 'active' : ''}`}
                  onClick={handleSwitchExpress.bind(this, item.type)}
                >
                  {item.name}
                </View>
              )
            }
          })}
        </View>
      </View>
      {/** 普通快递 */}
      {receiptType === 'logistics' && <AddressChoose isAddress={address} />}
      {/** 同城配 */}
      {receiptType === 'dada' && (
        <View className='store-module'>
          <AddressChoose isAddress={address} onCustomChosse={handleChooseAddress} />
          <View className='store'>配送门店: {distributorInfo.name}</View>
        </View>
      )}
      {/** 自提 */}
      {receiptType === 'ziti' && (
        <View className='address-module'>
          <View className='ziti-title' onClick={() => {
            Taro.navigateTo({
              url: `/subpages/store/ziti-picker?distributor_id=${distributor_id}&cart_type=${cart_type}`
            })
          }}>{zitiAddress?.name || '选择自提地址'}
            <Text className='iconfont icon-arrowRight'></Text>
          </View>
          {zitiAddress && <View className='address-connect'>
            <View className='ziti-address'>提货地址：{`${zitiAddress?.province}${zitiAddress?.city}${zitiAddress?.area}${zitiAddress?.address}`}</View>
            <View className='ziti-connect'>联系电话：{zitiAddress?.contract_phone}</View>
          </View>}

          {zitiAddress && <View className='ziti-info'>
            <SpForm ref={formRef} className='applychief-form' formData={form} rules={rules}>
              <SpFormItem label='提货时间' prop='pickerTime'>
                <SpCell className='picker-time' isLink onClick={() => {
                  setState(draft => {
                    draft.showTimePicker = true
                  })
                }}>
                  <Text className={classNames({
                    'placeholder': !form.pickerTime
                  })}>{getPickerTime()}</Text>
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
              </SpFormItem>
            </SpForm>
          </View>}

          {/* <View className='address-title'>{zitiInfo.name}</View>
          <View className='address-detail'>
            <View className='address'>{zitiInfo.store_address}</View>
            {!openStore && VERSION_STANDARD ? (
              <View
                className='iconfont icon-edit'
                onClick={() => handleEditZitiClick(zitiInfo.distributor_id)}
              ></View>
            ) : (
              <View className='iconfont icon-periscope' onClick={() => handleMapClick()}></View>
            )}
          </View>
          <View className='other-info'>
            <View className='text-muted light'>门店营业时间：{zitiInfo.hour}</View>
            <View className='text-muted'>
              联系电话：
              <Text className='phone'>{zitiInfo.phone}</Text>
            </View>
          </View> */}
        </View>
      )
      }

      {/* 自提时间选择 */}
      <SpFloatLayout className='ziti-time-floatlayout' open={showTimePicker} onClose={() => {
        setState(draft => {
          draft.showTimePicker = false
        })
      }}>
        <View className='ziti-time-container'>
          <ScrollView className='week-container' scrollY>
            {
              weekdays.map((item, index) => (<View className={classNames('weekday-item', {
                active: index === pickerIndex
              })} key={`weekday-item__${index}`} onClick={onChangeWeekDays.bind(this, index)}>{item.title}</View>))
            }
          </ScrollView>
          <ScrollView className='time-container' scrollY>
            {
              timeSlots.map((item, index) => (<View className={classNames('timeslot-item', {
                'active': item.id === activeTimeId,
                'disabled': item.disabled
              })} key={`timeslot-item__${index}`} onClick={onChangeTimeSlot.bind(this, item)}>{`${item.value[0]} ~ ${item.value[1]}`}</View>))
            }
          </ScrollView>
        </View>
      </SpFloatLayout>
    </View >
  )
}

CompDeliver.options = {
  addGlobalClass: true
}
export default React.forwardRef(CompDeliver)
