import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance, getCurrentPages } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { useDispatch, useSelector } from 'react-redux'
import { SpToast, SpCell, SpNavBar, SpPage } from '@/components'
import S from '@/spx'
import api from '@/api'

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
  const colors = useSelector((state) => state.sys)
  const { address } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    fetch()
  }, [address])

  const updateChooseAddress = (address) => {
    dispatch({ type: 'user/updateChooseAddress', payload: address })
  }

  const fetch = async (isDelete = false) => {
    const { isPicker, receipt_type = '', city = '' } = $instance.router.params
    if (isPicker) {
      setState(draft=>{
        draft.isPicker = true
      })
    }
    Taro.showLoading({ title: '' })
    const { list } = await api.member.addressList()
    Taro.hideLoading()
    let newList = [...list]
    if (receipt_type === 'dada' && city) {
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
    setState(draft=>{
      draft.list = newList,
      draft.selectedId = selectedId
    })
  }

  const handleClickChecked = (e, item) => {

    setState(draft=>{
      draft.selectedId = item[ADDRESS_ID]
    })

    updateChooseAddress(item)
    setTimeout(() => {
      Taro.navigateBack()
    }, 700)
  }

  const handleChangeDefault = async (e, item) => {
    const nItem = JSON.parse(JSON.stringify(item))
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
      title: '提示',
      content: `确定要删除该地址吗?`,
      showCancel: true,
      cancel: '取消',
      cancelText: '取消',
      confirmText: '确定',
      confirmColor: colors.colorPrimary
    })
    if (!res.confirm) return

    const { selectedId } = state
    await api.member.addressDelete(item.address_id)
    S.toast('删除成功')

    if (selectedId === item.address_id) {
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
        S.set('FROM_ADDRESS', true)
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
            +新增地址
          </AtButton>
        </View>
      }
    >
      <View>
        {process.env.TARO_ENV === 'weapp' ? (
          <SpCell
            isLink
            iconPrefix='sp-icon'
            className='address-harvest'
            icon='weixin'
            title='获取微信收货地址'
            onClick={wxAddress}
          />
        ) : (
          <SpNavBar
            title='收货地址'
            className='address-harvest'
            leftIconType='chevron-left'
            fixed='true'
            onClickLeftIcon={handleClickLeftIcon}

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
                      <View className='address-item__check' onClick={e=>handleClickChecked(e,item)}>
                        {item[ADDRESS_ID] === selectedId ? (
                          <Text
                            className='iconfont icon-check address-item__checked'
                            style={{ color: colors.colorPrimary }}
                          ></Text>
                        ) : (
                          <Text
                            className='address-item__unchecked'
                            style={{ borderColor: colors.colorPrimary }}
                          >
                            {' '}
                          </Text>
                        )}
                      </View>
                    )}
                  </View>

                  <View className='address-item__footer'>
                    <View
                      className='address-item__footer_default'
                      onClick={(e) => handleChangeDefault(e, item)}
                    >
                      {item.is_def ? (
                        <>
                          <Text
                            className='iconfont icon-check default__icon default__checked'
                            style={{ color: colors.colorPrimary }}
                          >
                            {' '}
                          </Text>
                          <Text className='default-text'>已设为默认</Text>
                        </>
                      ) : (
                        <>
                          <Text
                            className='address-item__unchecked'
                            style={{ borderColor: colors.colorPrimary }}
                          >
                            {' '}
                          </Text>
                          <Text className='default-text'>设为默认</Text>
                        </>
                      )}
                    </View>
                    <View className='address-item__footer_edit'>
                      <View className='footer-text' onClick={(e) => handleDelete(e, item)}>
                        <Text className='iconfont icon-trashCan footer-icon'> </Text>
                        <Text>删除</Text>
                      </View>
                      <View className='footer-text' onClick={(e) => handleClickToEdit(e, item)}>
                        <Text className='iconfont icon-edit footer-icon'> </Text>
                        <Text>编辑</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )
          })}
        </View>
        <SpToast />
      </View>
    </SpPage>
  )
}

AddressIndex.options = {
  addGlobalClass: true
}

export default AddressIndex
