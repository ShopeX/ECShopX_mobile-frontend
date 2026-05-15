/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance, getCurrentPages, useDidShow } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { useDispatch, useSelector } from 'react-redux'
import { SpCell, SpPage } from '@/components'
import { useTranslation, $t } from '@/i18n'
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
  const { i18n } = useTranslation()
  const $instance = getCurrentInstance() || {}
  const [state, setState] = useImmer(initialState)
  const colors = useSelector((state) => state.sys)
  const { address } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('ec018d31.748ea9') })
  }, [i18n.language])

  useEffect(() => {
    fetch()
  }, [])

  useDidShow(() => {
    fetch()
  })

  const updateChooseAddress = (address) => {
    dispatch({ type: 'user/updateChooseAddress', payload: address })
  }

  const fetch = async (isDelete = false) => {
    const { isPicker, receipt_type = '', city = '' } = $instance?.router?.params
    if (isPicker) {
      setState((draft) => {
        draft.isPicker = true
      })
    }
    Taro.showLoading({ title: '' })
    const { list } = await api.member.addressList()
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
      const defAddr = list.find((addr) => addr.is_def > 0)
      selectedId = defAddr ? defAddr[ADDRESS_ID] : null
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
    const nItem = JSON.parse(JSON.stringify(item))
    nItem.is_def = 1
    try {
      await api.member.addressCreateOrUpdate(nItem)
      if (item?.address_id) {
        S?.toast($t('ec018d31.69be67'))
      }

      setTimeout(() => {
        fetch()
      }, 700)
    } catch (error) {
      return false
    }
  }

  const handleClickToEdit = (e, item) => {
    if (item?.address_id) {
      Taro.navigateTo({
        url: `/marketing/pages/member/edit-address?address_id=${item.address_id}`
      })
    } else {
      Taro.navigateTo({
        url: '/marketing/pages/member/edit-address'
      })
    }
  }

  const handleDelete = async (e, item) => {
    const res = await Taro.showModal({
      title: $t('61e2d21a.02d981'),
      content: $t('6836084a.ea471e'),
      showCancel: true,
      cancel: $t('61e2d21a.625fb2'),
      cancelText: $t('61e2d21a.625fb2'),
      confirmText: $t('settings.confirm'),
      confirmColor: colors.colorPrimary
    })
    if (!res.confirm) return

    const { selectedId } = state
    await api.member.addressDelete(item.address_id)
    S?.toast($t('72f0cb98.0007d1'))

    const deletedId = item[ADDRESS_ID]
    const reduxId = address?.[ADDRESS_ID] ?? address?.address_id
    const matchesRedux =
      deletedId != null && reduxId != null && String(reduxId) === String(deletedId)
    const matchesSelected =
      deletedId != null && selectedId != null && String(selectedId) === String(deletedId)

    if (matchesRedux || matchesSelected) {
      updateChooseAddress(null)
    }

    setTimeout(() => {
      fetch(true)
    }, 700)
  }

  const wxAddress = () => {
    Taro.navigateTo({
      url: `/marketing/pages/member/edit-address?isWechatAddress=true`
    })
  }

  const crmAddress = () => {
    Taro.navigateTo({
      url: `/marketing/pages/member/crm-address-list?isCrmAddress=true`
    })
  }

  const handleClickLeftIcon = () => {
    let CHECKOUT_PAGE = '/pages/cart/espier-checkout'
    const pages = getCurrentPages()
    if (pages.length > 1) {
      let { path } = pages[pages.length - 2]
      if (CHECKOUT_PAGE == path.split('?')[0]) {
        S?.set('FROM_ADDRESS', true)
      }
    }
    Taro.navigateBack()
  }

  const { selectedId, isPicker, list } = state

  return (
    <SpPage
      className='page-address-index'
      renderFooter={
        <View className='btn-wrap'>
          <AtButton circle type='primary' onClick={handleClickToEdit}>
            {$t('ec018d31.71bbae')}
          </AtButton>
        </View>
      }
    >
      <ScrollView className='scroll-view-container' scrollY>
        {isWeixin && (
          <SpCell
            isLink
            className='address-harvest'
            title={$t('6836084a.c15248')}
            onClick={wxAddress}
          />
        )}

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
                          {item.is_def ? $t('ec018d31.fc66a2') : $t('ec018d31.1af3ec')}
                        </Text>
                      </View>
                    )}

                    {isPicker && (
                      <View className='address-item__footer_default'>
                        {item.is_def && (
                          <Text className='picker-default-text'>{$t('ec018d31.18c634')}</Text>
                        )}
                      </View>
                    )}

                    <View className='address-item__footer_edit'>
                      <View className='footer-text' onClick={(e) => handleDelete(e, item)}>
                        <Text className='iconfont icon-trashCan footer-icon' />
                        <Text>{$t('fb7ff6e1.2f4aad')}</Text>
                      </View>
                      <View className='footer-text' onClick={(e) => handleClickToEdit(e, item)}>
                        <Text className='iconfont icon-edit footer-icon' />
                        <Text>{$t('d9f41fea.95b351')}</Text>
                      </View>
                    </View>
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
