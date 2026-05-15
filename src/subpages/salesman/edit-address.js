/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Switch, Text, Button, ScrollView } from '@tarojs/components'
import { AtButton, AtTextarea } from 'taro-ui'
import { SpCell, SpPage, SpAddress, SpInput as AtInput } from '@/components'
import api from '@/api'
import { showToast } from '@/utils'
import { useTranslation } from 'react-i18next'
import { $t } from '@/i18n'
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
  const { t, i18n } = useTranslation()
  const $instance = getCurrentInstance() || {}
  const [state, setState] = useImmer(initialState)
  const colors = useSelector((state) => state.colors.current)
  const { customerLnformation } = useSelector((state) => state.cart)

  const dispatch = useDispatch()

  const updateChooseAddress = (address) => {
    dispatch({ type: 'user/updateChooseAddress', payload: address })
  }

  useEffect(() => {
    fetchAddressList()
  }, [])

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('692ba07e.c11209') })
  }, [i18n.language])

  const fetchAddressList = async () => {
    const areaData = await api.member.areaList()
    setState((draft) => {
      draft.areaData = areaData
    })
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
      ...value,
      ...customerLnformation
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
      return showToast(t('692ba07e.710e25'))
    }

    if (!data.telephone) {
      return showToast(t('692ba07e.6e4f4b'))
    }

    data.province = chooseValue[0]
    data.city = chooseValue[1]
    data.county = chooseValue[2]

    if (!data.adrdetail) {
      return showToast(t('692ba07e.80d685'))
    }

    Taro.showLoading({ title: t('74b954b7.415038') })

    try {
      await api.member.addressCreateOrUpdate(data)
      if (data.address_id) {
        showToast(t('692ba07e.69be67'))
      } else {
        showToast(t('692ba07e.04a691'))
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
    <SpPage
      className='page-address-edit'
      renderFooter={
        <View className='btns'>
          <AtButton
            circle
            type='primary'
            className='submit-btn'
            style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary}`}
            onClick={handleSubmit}
          >
            {t('692ba07e.4456c5')}
          </AtButton>
        </View>
      }
    >
      <ScrollView className='scroll-view-container'>
        <View className='scroll-view-body'>
          <View className='page-address-edit__form'>
            <SpCell className='logistics-no border-bottom' title={t('692ba07e.fb5bf1')}>
              <AtInput
                name='username'
                value={info?.username}
                placeholder={t('692ba07e.709073')}
                onChange={(e) => handleChange('username', e)}
              />
            </SpCell>

            <SpCell className='logistics-no border-bottom' title={t('692ba07e.92448a')}>
              <AtInput
                name='telephone'
                maxLength={11}
                value={info?.telephone}
                placeholder={t('692ba07e.9130fc')}
                onChange={(e) => handleChange('telephone', e)}
              />
            </SpCell>

            <SpCell
              className='logistics-no province border-bottom'
              title={t('692ba07e.c09adb')}
              isLink
              arrow
              onClick={onPickerClick}
            >
              <View className='picker'>
                {chooseValue?.join('') === '' ? (
                  <Text>{t('692ba07e.4a0039')}</Text>
                ) : (
                  <Text style={{ color: '#222' }}>{chooseValue?.join('/')}</Text>
                )}
              </View>
            </SpCell>

            <SpCell className='logistics-no detail-address' title={t('692ba07e.61a0ec')}>
              <AtTextarea
                count={false}
                // name='adrdetail'
                value={info?.adrdetail}
                maxLength={100}
                placeholder={t('692ba07e.79a1f5')}
                onChange={handleChange.bind(this, 'adrdetail')}
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
            title={t('692ba07e.6dc908')}
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

AddressIndex.options = {
  addGlobalClass: true
}

export default AddressIndex
