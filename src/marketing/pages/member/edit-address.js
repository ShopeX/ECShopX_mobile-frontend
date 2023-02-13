import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Switch, Text, Button } from '@tarojs/components'
import { AtInput, AtButton, AtTextarea } from 'taro-ui'
import { SpCell, SpNavBar, SpAddress } from '@/components'
import api from '@/api'
import { isWxWeb, showToast } from '@/utils'
import S from '@/spx'
import { useNavigation } from '@/hooks'

import './edit-address.scss'

const initialState = {
  info: {},
  listLength: 0,
  areaArray: [[], [], []],
  areaIndexArray: [0, 0, 0],
  areaData: [],
  chooseValue: ['', '', ''],
  isOpened: false
}

function AddressIndex(props) {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const colors = useSelector((state) => state.colors.current)
  const dispatch = useDispatch()
  const { setNavigationBarTitle } = useNavigation()

  const updateChooseAddress = (address) => {
    dispatch({ type: 'user/updateChooseAddress', payload: address })
  }

  useEffect(() => {
    fetchAddressList()
    fetch()
    setNavigationBarTitle(initNavigationBarTitle())
  }, [])

  const initNavigationBarTitle = () => {
    return $instance.router?.params?.address_id ? '编辑地址' : '新增地址'
  }

  const fetchAddressList = async () => {
    const areaData = await api.member.areaList()
    setState((draft) => {
      draft.areaData = areaData
    })
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
          ;(draft.info = a_item),
            (draft.chooseValue = [a_item.province, a_item.city, a_item.county])
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
          ;(draft.info = query), (draft.chooseValue = [query.province, query.city, query.county])
        })
      } catch (err) {
        console.error(err)
        Taro.navigateBack()
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

  const handleChange = (name,val,e) => {
    console.log('---', name,val,e)
    const nInfo = JSON.parse(JSON.stringify(state.info || {}))
    if(name==='adrdetail'){
      nInfo[name] = e.detail.value
    }else{
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
      updateChooseAddress(data)
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
    <View className='page-address-edit' style={isWxWeb && { paddingTop: 0 }}>
      <SpNavBar title={initNavigationBarTitle()} leftIconType='chevron-left' fixed='true' />
      <View className='page-address-edit__form'>
        <SpCell
          className='logistics-no border-bottom'
          title='收件人'
          value={
            <AtInput
              name='username'
              value={info?.username}
              placeholder='收件人姓名'
              onChange={(e) => handleChange('username',e)}
            />
          }
        ></SpCell>

        <SpCell
          className='logistics-no border-bottom'
          title='手机号码'
          value={
            <AtInput
              name='telephone'
              maxLength={11}
              value={info?.telephone}
              placeholder='收件人手机号'
              onChange={(e) => handleChange('telephone', e)}
            />
          }
        ></SpCell>

        <SpCell
          className='logistics-no province border-bottom'
          title='所在区域'
          isLink
          arrow
          value={
            <View className='picker' onClick={onPickerClick}>
              {chooseValue?.join('') === '' ? (
                <Text>选择省/市/区</Text>
              ) : (
                <Text style={{ color: '#222' }}>{chooseValue?.join('/')}</Text>
              )}
            </View>
          }
        ></SpCell>
        <SpAddress isOpened={isOpened} onClose={handleClickClose} onChange={onPickerChange} />

        <SpCell
          className='logistics-no detail-address'
          title='详细地址'
        >
          <AtTextarea
            count={false}
            // name='adrdetail'
            value={info?.adrdetail}
            maxLength={100}
            placeholder='请填写详细地址（街道、门牌）'
            onChange={handleChange.bind(this,'adrdetail')}
          />
        </SpCell>

        {/* <SpCell
            className='logistics-no'
            title='邮政编码'
            value={
              <AtInput
                name='postalCode'
                value={info.postalCode}
                onChange={this.handleChange.bind(this, 'postalCode')}
              />
            }
          ></SpCell> */}
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
      ></SpCell>
      <View className='btns'>
        {/* <AtButton
            circle
            type='primary'
            className='save-btn'
            onClick={handleSubmit}
            style={`background: ${colors}; border-color: ${colors};border-radius: 25px;`}
          >
            保存并使用
          </AtButton> */}
        <Button
          type='primary'
          onClick={handleSubmit}
          className='submit-btn'
          style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary};border-radius: 25px;`}
        >
          保存并使用
        </Button>
      </View>
    </View>
  )
}

AddressIndex.options = {
  addGlobalClass: true
}

export default AddressIndex
