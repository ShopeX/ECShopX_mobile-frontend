/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import Taro, { useRouter } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtSwitch } from 'taro-ui'
import { SpPage, SpInput as AtInput } from '@/components'
import api from '@/api'
import { showToast } from '@/utils'
import { SG_USER_INFO } from '@/consts/localstorage'
import { useNavigation } from '@/hooks'
import { useTranslation, $t, i18n } from '@/i18n'
import './edit-deliveryman-salesman.scss'

const initialState = {
  parent: {
    mobile: '',
    name: '',
    is_valid: true
  }
}

function EditDeliverymanSalesman(props) {
  useTranslation()
  const [state, setState] = useImmer(initialState)
  const { parent } = state
  const { params } = useRouter()
  const { setNavigationBarTitle } = useNavigation()

  useEffect(() => {
    if (params?.salesperson_id) {
      edit(params)
    }
  }, [])

  useEffect(() => {
    const syncTitle = () => {
      setNavigationBarTitle(params?.salesperson_id ? $t('828e2c58.4f54d6') : $t('828e2c58.96692c'))
    }
    syncTitle()
    i18n.on('languageChanged', syncTitle)
    return () => i18n.off('languageChanged', syncTitle)
  }, [params?.salesperson_id, setNavigationBarTitle])

  const edit = async (val) => {
    const { userId } = Taro.getStorageSync(SG_USER_INFO)
    let par = {
      page: 1,
      pageSize: 10,
      distributor_id: val.distributor_id,
      user_id: userId,
      salesperson_id: val.salesperson_id
    }
    let { mobile, name, is_valid } = await api.salesman.salespersonadminSalespersoninfo(par)
    setState((draft) => {
      draft.parent = {
        mobile,
        name,
        is_valid
      }
    })
  }

  const handleChange = (value, val) => {
    let res = JSON.parse(JSON.stringify(parent))
    res[value] = val
    setState((draft) => {
      draft.parent = res
    })
  }

  const preserve = async () => {
    const validations = [
      { field: 'mobile', regex: /^\d{11}$/, messageKey: '828e2c58.5deab3' },
      { field: 'name', regex: /.+/, messageKey: '828e2c58.38a947' }
    ]
    if (parent['mobile'] === '') {
      showToast($t('828e2c58.6463bd'))
      return
    }

    for (const validation of validations) {
      if (!validation.regex.test(parent[validation.field])) {
        showToast($t(validation.messageKey))
        return
      }
    }
    Taro.showLoading({ title: $t('828e2c58.415038') })
    let par = {
      ...parent,
      distributor_id: params.distributor_id,
      is_valid: parent.is_valid
    }
    if (params?.salesperson_id) {
      await api.salesman.salespersonadminUpdatesalesperson({
        salesperson_id: params.salesperson_id,
        ...par
      })
      showToast($t('828e2c58.3bb47b'))
    } else {
      await api.salesman.salespersonadminAddsalesperson(par)
      showToast($t('828e2c58.3fdaea'))
    }

    Taro.hideLoading()
    Taro.navigateBack({
      delta: 1 // 默认值是1，表示返回的页面层数
    })
  }

  return (
    <SpPage className='page-address-salesman'>
      <View className='page-address-salesman-content'>
        <AtInput
          name='mobile'
          title={$t('828e2c58.976213')}
          type='phone'
          maxLength='11'
          placeholder={$t('828e2c58.6463bd')}
          value={parent.mobile}
          onChange={(e) => handleChange('mobile', e)}
          disabled={params?.salesperson_id}
        />
        <AtInput
          name='name'
          title={$t('828e2c58.511948')}
          type='text'
          placeholder={$t('828e2c58.38a947')}
          value={parent.name}
          onChange={(e) => handleChange('name', e)}
        />
        <AtSwitch
          title={$t('828e2c58.780afe')}
          checked={parent.is_valid}
          onChange={(e) => handleChange('is_valid', e)}
        />
      </View>
      <View className='page-address-salesman-scroll-establish' onClick={preserve}>
        <View>{$t('828e2c58.56df61')}</View>
      </View>
    </SpPage>
  )
}

EditDeliverymanSalesman.options = {
  addGlobalClass: true
}

export default EditDeliverymanSalesman
