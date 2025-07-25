import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance, getCurrentPages } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { useDispatch, useSelector } from 'react-redux'
import { SpToast, SpCell, SpNavBar, SpPage } from '@/components'
import S from '@/spx'
import api from '@/api'
import { classNames, isWeixin } from '@/utils'

import './address.scss'

const ADDRESS_ID = 'address_id'

const initialState = {
  list: [],
  isPicker: false,
  selectedId: null
}

function AddressIndex(props) {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const { selectedId, isPicker, list } = state
  const colors = useSelector((state) => state.sys)
  const { address } = useSelector((state) => state.user)
  const { customerLnformation } = useSelector((state) => state.cart)
  const dispatch = useDispatch()

  useEffect(() => {
    fetch()
  }, [])

  const updateChooseAddress = (address) => {
    dispatch({ type: 'user/updateChooseAddress', payload: address })
  }

  const fetch = async (isDelete = false) => {
    const { isPicker, receipt_type = '', city = '' } = $instance.router.params
    if (isPicker) {
      setState((draft) => {
        draft.isPicker = true
      })
    }
    Taro.showLoading({ title: '' })
    const { list } = await api.member.addressList({ ...customerLnformation })
    Taro.hideLoading()
    let newList = [...list]
    if (['dada', 'merchant'].includes(receipt_type) && city) {
      newList = list
        .map((item) => {
          item.disabled = item.city !== city
          return item
        })
        .sort((first) => (first.disabled ? 1 : -1))
    }
    let selectedId = null
    if (address) {
      selectedId = address[ADDRESS_ID]
    } else {
      selectedId = list.find((addr) => addr.is_def > 0) || null
    }
    setState((draft) => {
      ;(draft.list = newList), (draft.selectedId = selectedId)
    })
  }

  const handleClickChecked = (e, item) => {
    setState((draft) => {
      draft.selectedId = item[ADDRESS_ID]
    })

    updateChooseAddress(item)
    setTimeout(() => {
      Taro.eventCenter.trigger('onEventSelectReceivingAddress', item)
      Taro.navigateBack()
    }, 700)
  }

  const handleChangeDefault = async (e, item) => {
    const nItem = JSON.parse(JSON.stringify({ ...item, ...customerLnformation }))
    nItem.is_def = 1
    try {
      await api.member.addressCreateOrUpdate(nItem)
      if (item?.address_id) {
        S.toast('修改成功')
      }

      setTimeout(() => {
        fetch()
      }, 700)
    } catch (error) {
      return false
    }
  }

  const handleClickToEdit = () => {
    Taro.navigateTo({
      url: '/subpages/salesman/edit-address'
    })
  }

  return (
    <SpPage
      className='page-address-index'
      renderFooter={
        <View className='btn-wrap'>
          <AtButton circle type='primary' onClick={handleClickToEdit}>
            +新增地址
          </AtButton>
        </View>
      }
    >
      <ScrollView className='scroll-view-container' scrollY>
        <View className='member-address-list'>
          {list?.map((item) => {
            return (
              <View
                key={item[ADDRESS_ID]}
                className={`address-item ${item.disabled ? 'disabled' : ''}`}
              >
                <View className='address-item__content'>
                  <View className='address-item__title'>
                    <Text className='address-item__info'>{item.username}</Text>
                    <Text className='address-item__info_tel'>{item.telephone}</Text>
                  </View>
                  <View className='address-item__detail_box'>
                    <View className='address-item__detail'>
                      {item.province}
                      {item.city}
                      {item.county}
                      {item.adrdetail}
                    </View>

                    {isPicker && !item.disabled && (
                      <View
                        className='address-item__check'
                        onClick={(e) => handleClickChecked(e, item)}
                      >
                        {item[ADDRESS_ID] === selectedId ? (
                          <Text className='iconfont icon-roundcheckfill' />
                        ) : (
                          <Text className='iconfont icon-round' />
                        )}
                      </View>
                    )}
                  </View>

                  <View className='address-item__footer'>
                    {!isPicker && (
                      <View
                        className='address-item__footer_default'
                        onClick={(e) => handleChangeDefault(e, item)}
                      >
                        <Text
                          className={classNames({
                            iconfont: true,
                            'icon-roundcheckfill': item.is_def,
                            'icon-round': !item.is_def
                          })}
                        />
                        <Text className='default-text'>
                          {item.is_def ? '已设为默认' : '设为默认'}
                        </Text>
                      </View>
                    )}

                    {isPicker && (
                      <View className='address-item__footer_default'>
                        {item.is_def && <Text className='picker-default-text'>默认</Text>}
                      </View>
                    )}
                  </View>
                </View>
              </View>
            )
          })}
        </View>
      </ScrollView>
    </SpPage>
  )
}

AddressIndex.options = {
  addGlobalClass: true
}

export default AddressIndex
