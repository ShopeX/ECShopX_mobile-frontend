/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpPage, SpInput as AtInput } from '@/components'
import * as dianwuApi from '@/api/dianwu'
import { classNames, showToast } from '@/utils'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@/hooks'
import './edit-deliveryman.scss'

const STAFF_ATTR_I18N = {
  part_time: '74b954b7.7c4f46',
  full_time: '74b954b7.63f85b'
}

const PAYMENT_MANNER_I18N = {
  order: '74b954b7.ed776f',
  amount: '74b954b7.705abf'
}

const initialState = {
  parent: {
    staff_type: 'distributor',
    operator_type: 'self_delivery_staff',
    staff_no: '',
    staff_attribute: 'part_time',
    payment_method: 'order',
    payment_fee: 1,
    mobile: '',
    username: '',
    password: ''
  },
  property: [{ label: 'part_time' }, { label: 'full_time' }],
  manner: [{ label: 'order' }, { label: 'amount' }],
  propertyIndex: 0,
  mannerIndex: 0
}

function EditDeliveryman() {
  const { t, i18n } = useTranslation()
  const [state, setState] = useImmer(initialState)
  const { parent, property, manner, propertyIndex, mannerIndex } = state
  const { params } = useRouter()
  const { setNavigationBarTitle } = useNavigation()

  useEffect(() => {
    if (params?.operator_id) {
      edit(params?.operator_id)
    }
  }, [])

  useEffect(() => {
    setNavigationBarTitle(params?.operator_id ? t('74b954b7.4f54d6') : t('74b954b7.96692c'))
  }, [i18n.language, params?.operator_id, setNavigationBarTitle, t])

  const edit = async (operator_id) => {
    let res = await dianwuApi.getAccountManagement(operator_id)
    let params = {
      staff_type: 'distributor',
      operator_type: 'self_delivery_staff',
      staff_no: res.staff_no,
      staff_attribute: res.staff_attribute,
      payment_method: res.payment_method,
      payment_fee: res.payment_fee,
      mobile: res.mobile,
      username: res.username,
      password: ''
    }
    setState((draft) => {
      draft.parent = params
      draft.propertyIndex = res.payment_method == 'order' ? 0 : 1
      draft.mannerIndex = res.staff_attribute == 'part_time' ? 0 : 1
    })
  }

  const handleChange = (value, val) => {
    let res = JSON.parse(JSON.stringify(parent))
    res[value] = val
    setState((draft) => {
      draft.parent = res
    })
  }

  const propertySwitch = (val, index) => {
    if (val) {
      setState((draft) => {
        draft.parent.staff_attribute = property[index].label
        draft.mannerIndex = index
      })
    } else {
      setState((draft) => {
        draft.parent.payment_method = manner[index].label
        draft.propertyIndex = index
      })
    }
  }

  const preserve = async () => {
    const validations = [
      { field: 'staff_no', regex: /.+/, messageKey: '74b954b7.9d419d' },
      { field: 'payment_fee', regex: /^\d+$/, messageKey: '74b954b7.d17490' },
      { field: 'mobile', regex: /^\d{11}$/, messageKey: '74b954b7.5deab3' },
      { field: 'username', regex: /.+/, messageKey: '74b954b7.38a947' },
      { field: 'password', regex: /.+/, messageKey: '74b954b7.209f2b' },
      { field: 'password', regex: /^[0-9a-zA-Z]\w{5,17}$/, messageKey: '74b954b7.319ccc' }
    ]

    const requiredFields = ['payment_fee', 'mobile', 'password']
    const emptyKeys = {
      payment_fee: '74b954b7.c981a8',
      mobile: '74b954b7.6463bd',
      password: '74b954b7.209f2b'
    }

    for (const field of requiredFields) {
      if (parent[field] === '') {
        showToast(t(emptyKeys[field]))
        return
      }
    }

    for (const validation of validations) {
      if (!validation.regex.test(parent[validation.field])) {
        showToast(t(validation.messageKey))
        return
      }
    }
    Taro.showLoading({ title: t('74b954b7.415038') })
    let par = {
      ...parent,
      staff_attribute: property[mannerIndex].label,
      payment_method: manner[propertyIndex].label,
      distributor_ids: [
        {
          distributor_id: params.distributor_id,
          name: params.name
        }
      ]
    }
    if (params?.operator_id) {
      await dianwuApi.patchAccountManagement(params.operator_id, par)
      showToast(t('74b954b7.3bb47b'))
    } else {
      await dianwuApi.accountManagement(par)
      showToast(t('74b954b7.3fdaea'))
    }

    Taro.hideLoading()
    Taro.navigateBack({
      delta: 1
    })
  }

  const paymentTitle = propertyIndex == 0 ? t('74b954b7.f1ebde') : t('74b954b7.a8e75e')

  return (
    <SpPage className='page-address-edit'>
      <View className='page-address-edit-content'>
        <AtInput
          name='staff_no'
          title={t('74b954b7.f3c781')}
          type='text'
          placeholder={t('74b954b7.9d419d')}
          value={parent.staff_no}
          onChange={(e) => handleChange('staff_no', e)}
        />
        <View className='attribute'>
          <Text>{t('74b954b7.b6fd31')}</Text>
          {property.map((item, index) => {
            return (
              <View
                key={index}
                onClick={() => propertySwitch(true, index)}
                className={classNames(mannerIndex == index ? 'active' : '')}
              >
                {t(STAFF_ATTR_I18N[item.label])}
              </View>
            )
          })}
        </View>
        <View className='attribute'>
          <Text>{t('74b954b7.dd4c3d')}</Text>
          {manner.map((item, index) => {
            return (
              <View
                key={index}
                onClick={() => propertySwitch(false, index)}
                className={classNames(propertyIndex == index ? 'active' : '')}
              >
                {t(PAYMENT_MANNER_I18N[item.label])}
              </View>
            )
          })}
        </View>
        <AtInput
          name='payment_fee'
          title={t('74b954b7.60a4ae')}
          type='number'
          maxLength='5'
          placeholder={t('74b954b7.c981a8')}
          value={parent.payment_fee}
          onChange={(e) => handleChange('payment_fee', e)}
        >
          <View className='remarks'>{paymentTitle}</View>
        </AtInput>
        <AtInput
          name='mobile'
          title={t('74b954b7.976213')}
          type='phone'
          maxLength='11'
          placeholder={t('74b954b7.6463bd')}
          value={parent.mobile}
          onChange={(e) => handleChange('mobile', e)}
        />
        <AtInput
          name='username'
          title={t('74b954b7.511948')}
          type='text'
          placeholder={t('74b954b7.38a947')}
          value={parent.username}
          onChange={(e) => handleChange('username', e)}
        />
        <AtInput
          name='password'
          title={t('74b954b7.2646b8')}
          type='text'
          placeholder={t('74b954b7.209f2b')}
          value={parent.password}
          onChange={(e) => handleChange('password', e)}
        />
      </View>
      <View className='page-address-edit-scroll-establish' onClick={preserve}>
        <View>{t('74b954b7.56df61')}</View>
      </View>
    </SpPage>
  )
}

EditDeliveryman.options = {
  addGlobalClass: true
}

export default EditDeliveryman
