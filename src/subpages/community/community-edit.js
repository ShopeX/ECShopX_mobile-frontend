import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtInput } from 'taro-ui'
import { SpPage, SpCell, SpPickerAddress } from '@/components'
import { showToast, pickBy } from '@/utils'
import doc from '@/doc'
import api from '@/api'
import './community-edit.scss'

const initialState = {
  ziti_name: '',
  areaValue: [],
  address: ''
}
function CommunityEdit(props) {
  const [state, setState] = useImmer(initialState)
  const { ziti_name, address, areaValue, province, city, area } = state
  const $instance = getCurrentInstance()
  const { id } = $instance.router.params
  useEffect(() => {
    if (id) {
      Taro.setNavigationBarTitle({
        title: '编辑自提点'
      })
      fetchZitiList()
    } else {
      Taro.setNavigationBarTitle({
        title: '添加自提点'
      })
    }
  }, [])

  const fetchZitiList = async () => {
    const res = await api.community.getActivityZiti()
    const list = pickBy(res, doc.community.COMMUNITY_ZITI)
    const { province, city, country, address, zitiName } = list.find((item) => item.id == id)
    setState((draft) => {
      draft.ziti_name = zitiName
      draft.areaValue = [province, city, country]
      draft.address = address
    })
  }

  const handleConfirm = async () => {
    if (!ziti_name) {
      return showToast('请填写自提名称')
    }
    if (areaValue && areaValue.length == 0) {
      return showToast('请选择省市区')
    }
    if (!address) {
      return showToast('请填写自提地址')
    }
    const params = {
      ziti_name,
      address,
      province: areaValue[0],
      city: areaValue[1],
      area: areaValue[2]
    }
    if (id) {
      await api.community.modifyActivityZiti(id, params)
      showToast('修改成功')
      Taro.navigateBack()
    } else {
      await api.community.createActivityZiti(params)
      showToast('添加成功')
      Taro.navigateBack()
    }
  }

  const onInputChange = (key, value) => {
    setState((draft) => {
      draft[key] = value
    })
  }

  const onAddressChange = (value) => {
    setState((draft) => {
      draft.areaValue = value
    })
  }

  return (
    <SpPage
      className='page-community-edit'
      renderFooter={
        <View className='btn-wrap'>
          <AtButton circle type='primary' onClick={handleConfirm}>
            确定
          </AtButton>
        </View>
      }
    >
      <SpCell border title='自提名称'>
        <AtInput
          name='ziti_name'
          value={ziti_name}
          placeholder='请填写自提名称'
          onChange={onInputChange.bind(this, 'ziti_name')}
        />
      </SpCell>
      <SpCell border title='所在区域'>
        {/* {JSON.stringify(areaValue)} */}
        {(areaValue.length > 0 || !id) && (
          <SpPickerAddress value={areaValue} onChange={onAddressChange} />
        )}
      </SpCell>
      <SpCell border title='自提地址'>
        <AtInput
          name='address'
          value={address}
          placeholder='请填写详细自提地址'
          onChange={onInputChange.bind(this, 'address')}
        />
      </SpCell>
    </SpPage>
  )
}

CommunityEdit.options = {
  addGlobalClass: true
}

export default CommunityEdit
