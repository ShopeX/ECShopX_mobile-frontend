/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpPage, SpCell, SpInput as AtInput } from '@/components'
import { SpPickerAddress } from '@/subpages/components'
import { showToast, pickBy } from '@/utils'
import { useTranslation, $t } from '@/i18n'
import doc from '@/subpages/doc'
import api from '@/api'
import * as communityApi from '@/api/community'
import './community-edit.scss'

const initialState = {
  ziti_name: '',
  areaValue: [],
  address: ''
}
function CommunityEdit(props) {
  useTranslation()
  const [state, setState] = useImmer(initialState)
  const { ziti_name, address, areaValue, province, city, area } = state
  const $instance = getCurrentInstance() || {}
  const { id } = $instance?.router?.params
  useEffect(() => {
    if (id) {
      Taro.setNavigationBarTitle({
        title: $t('b3e42938.f36bc9')
      })
      fetchZitiList()
    } else {
      Taro.setNavigationBarTitle({
        title: $t('b3e42938.1f6bf1')
      })
    }
  }, [])

  const fetchZitiList = async () => {
    const res = await communityApi.getActivityZiti()
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
      return showToast($t('b3e42938.9ca628'))
    }
    if (areaValue && areaValue.length == 0) {
      return showToast($t('b3e42938.075488'))
    }
    if (!address) {
      return showToast($t('b3e42938.4ff10b'))
    }
    const params = {
      ziti_name,
      address,
      province: areaValue[0],
      city: areaValue[1],
      area: areaValue[2]
    }
    if (id) {
      await communityApi.modifyActivityZiti(id, params)
      showToast($t('b3e42938.69be67'))
      Taro.navigateBack()
    } else {
      await communityApi.createActivityZiti(params)
      showToast($t('b3e42938.3fdaea'))
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
            {$t('934ffec2.38cf16')}
          </AtButton>
        </View>
      }
    >
      <SpCell border title={$t('b3e42938.e3ada0')}>
        <AtInput
          name='ziti_name'
          value={ziti_name}
          placeholder={$t('b3e42938.9ca628')}
          onChange={onInputChange.bind(this, 'ziti_name')}
        />
      </SpCell>
      <SpCell border title={$t('b3e42938.c09adb')}>
        {/* {JSON.stringify(areaValue)} */}
        {(areaValue.length > 0 || !id) && (
          <SpPickerAddress value={areaValue} onChange={onAddressChange} />
        )}
      </SpCell>
      <SpCell border title={$t('b3e42938.818380')}>
        <AtInput
          name='address'
          value={address}
          placeholder={$t('b3e42938.14b8c6')}
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
