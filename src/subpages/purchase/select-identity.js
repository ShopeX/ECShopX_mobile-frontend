import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import { View, Text, Image } from '@tarojs/components'
import api from '@/api'
import { classNames, getDistributorId, VERSION_IN_PURCHASE } from '@/utils'
import CompTabbarActivity from '@/pages/purchase/comps/comp-tabbar'
import './select-identity.scss'
import { SpPage } from '@/components'
import { updateValidIdentity, updateEnterpriseId, updateCurDistributorId } from '@/store/slices/purchase'
import { useDispatch, useSelector } from 'react-redux'

const initialState = {
  identity: [],
  invalidIdentity: [],
  loading: true
}

function SelectIdentity(props) {
  const [state, setState] = useImmer(initialState)

  const { identity, invalidIdentity, loading } = state
  const { curEnterpriseId, curDistributorId } = useSelector((_state) => _state.purchase)
  const dispatch = useDispatch()

  const { params } = useRouter()
  let { activity_id = '', is_redirt } = params

  useEffect(() => {
    getUserEnterprises()
  }, [])

  const getUserEnterprises = async () => {
    const data = await api.purchase.getUserEnterprises({
      activity_id,
      distributor_id: curDistributorId ?? getDistributorId()
    })
    const _identity = data.filter((item) => item.disabled == 0)
    // 没有企业跳认证首页
    if (_identity.length == 0 && (is_redirt || VERSION_IN_PURCHASE)) {
      Taro.redirectTo({
        url: `/pages/purchase/auth?activity_id=${activity_id}&is_activity=1`
      })
      return
    }

    //一个选择这个跳活动列表
    if (_identity.length == 1 && is_redirt) {
      dispatch(updateEnterpriseId(_identity[0]?.enterprise_id))
      Taro.redirectTo({
        url: `/pages/purchase/index?activity_id=${activity_id}&is_redirt=1`
      })
      return
    }

    //多个则用户去选择
    //多个企业展示身份切换tab
    // dispatch(updateValidIdentity(true))

    setState((draft) => {
      draft.loading = false
      draft.identity = _identity
      draft.invalidIdentity = data.filter((item) => item.disabled == 1)
    })
  }

  const onAddIdentityChange = () => {
    Taro.navigateTo({
      url: '/pages/purchase/auth?type=addIdentity'
    })
  }

  const handleItemClick = ({ enterprise_id }) => {
    dispatch(updateEnterpriseId(enterprise_id))
    Taro.navigateTo({
      url: `/pages/purchase/index?activity_id=${activity_id}&is_redirt=1`
    })
  }

  return (
    <SpPage
      className='select-identity'
      loading={loading}
      renderFooter={!loading && <CompTabbarActivity />}
    >
      <View className='identity-item' onClick={onAddIdentityChange}>
        <View className='identity-item-avatar'>
          <Text className='iconfont icon-tianjia1 add-icon avatar'></Text>
        </View>
        <View className='add-identity'>添加身份</View>
      </View>
      <View className='content'>
        <View className='identity'>
          {identity.map((item, index) => {
            return (
              <View key={index} className='identity-item' onClick={() => handleItemClick(item)}>
                <View className='identity-item-avatar'>
                  <Image src={item?.logo} className='avatar' />
                </View>
                <View className='identity-item-content'>
                  <View className='content-top'>
                    <View className='company'>{item.name}</View>
                  </View>
                  <View className='content-bottom'>
                    <View className={classNames('role', item.is_relative == 1 ? 'friend' : '')}>
                      {(item.is_employee == 1 && '员工') || (item.is_relative == 1 && '亲友')}
                    </View>
                    <View className='account'>{item.login_account}</View>
                  </View>
                </View>
                {curEnterpriseId == item.enterprise_id && (
                  <View className='identity-item-right'>当前选中</View>
                )}
              </View>
            )
          })}
        </View>
        {/* {invalidIdentity?.length > 0 && (
          <View className='invalid-identity'>
            <View className='title'>已失效身份</View>
            {state.invalidIdentity?.map((item, index) => (
              <View key={index} className='identity-item'>
                <View className='identity-item-avatar'>
                  <Image src={item?.avatar} className='avatar' />
                </View>
                <View className='identity-item-content'>
                  <View className='content-top'>
                    <View className='company'>{item.name}</View>
                  </View>
                  <View className='content-bottom'>
                    <View className={classNames('role', item.is_relative == 1 ? 'friend' : '')}>
                      {(item.is_employee == 1 && '员工') || (item.is_relative == 1 && '亲友')}
                    </View>
                    <View className='account'>{item.login_account}</View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )} */}
      </View>
    </SpPage>
  )
}

SelectIdentity.options = {
  addGlobalClass: true
}

export default SelectIdentity
