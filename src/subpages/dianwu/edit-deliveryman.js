/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useMemo } from 'react'
import { useImmer } from 'use-immer'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpPage, SpInput as AtInput } from '@/components'
import * as dianwuApi from '@/api/dianwu'
import { classNames, showToast } from '@/utils'
import { useNavigation } from '@/hooks'
import { useTranslation, $t, i18n } from '@/i18n'
import './edit-deliveryman.scss'

const initialState = {
  isOpened: true,
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
  propertyIndex: 0,
  mannerIndex: 0
}

function EditDeliveryman(props) {
  useTranslation()
  const property = useMemo(
    () => [
      { label: 'part_time', name: $t('1c364c1c.7c4f46') },
      { label: 'full_time', name: $t('1c364c1c.63f85b') }
    ],
    [i18n.language]
  )

  const manner = useMemo(
    () => [
      { label: 'order', name: $t('1c364c1c.ed776f') },
      { label: 'amount', name: $t('1c364c1c.705abf') }
    ],
    [i18n.language]
  )

  const [state, setState] = useImmer(initialState)
  const { parent, propertyIndex, mannerIndex } = state
  const { params } = useRouter()
  const { setNavigationBarTitle } = useNavigation()

  const paymentTitle = useMemo(
    () => (mannerIndex == 0 ? $t('1c364c1c.f1ebde') : $t('1c364c1c.a8e75e')),
    [mannerIndex, i18n.language]
  )

  useEffect(() => {
    if (params?.operator_id) {
      edit(params?.operator_id)
    }
  }, [])

  useEffect(() => {
    const syncTitle = () => {
      setNavigationBarTitle(params.operator_id ? $t('1c364c1c.eee2bb') : $t('1c364c1c.17e501'))
    }
    syncTitle()
    i18n.on('languageChanged', syncTitle)
    return () => i18n.off('languageChanged', syncTitle)
  }, [params?.operator_id, setNavigationBarTitle])

  const edit = async (operator_id) => {
    let res = await dianwuApi.getAccountManagement(operator_id)
    let nextParams = {
      staff_type: 'distributor',
      operator_type: 'self_delivery_staff',
      staff_no: res.staff_no,
      staff_attribute: res.staff_attribute,
      payment_method: res.payment_method,
      payment_fee: res.payment_fee / 100,
      mobile: res.mobile,
      username: res.username,
      password: ''
    }
    setState((draft) => {
      draft.parent = nextParams
      draft.propertyIndex = res.staff_attribute == 'part_time' ? 0 : 1
      draft.mannerIndex = res.payment_method == 'order' ? 0 : 1
    })
  }

  const handleChange = (value, val) => {
    let res = JSON.parse(JSON.stringify(parent))
    res[value] = val
    setState((draft) => {
      draft.parent = res
    })
  }

  // 编码和方式切换
  const propertySwitch = (val, index) => {
    if (val) {
      setState((draft) => {
        draft.parent.payment_method = manner[index].label
        draft.mannerIndex = index
      })
    } else {
      setState((draft) => {
        draft.parent.staff_attribute = property[index].label
        draft.propertyIndex = index
      })
    }
  }

  const preserve = async () => {
    const validations = [
      { field: 'staff_no', regex: /.+/, messageKey: '1c364c1c.0f86ab' },
      { field: 'payment_fee', regex: /^\d+(\.\d+)?$/, messageKey: '1c364c1c.d17490' },
      { field: 'mobile', regex: /^\d{11}$/, messageKey: '1c364c1c.8b9c10' },
      { field: 'username', regex: /.+/, messageKey: '1c364c1c.c6c579' }
    ]
    if (parent.password)
      validations.push({
        field: 'password',
        regex: /^[0-9a-zA-Z]\w{5,17}$/,
        messageKey: '1c364c1c.a1f081'
      })

    let requiredFields = []
    if (params?.operator_id) {
      requiredFields = ['payment_fee', 'mobile']
    } else {
      requiredFields = ['payment_fee', 'mobile', 'password']
    }

    for (const field of requiredFields) {
      if (parent[field] === '') {
        showToast(
          $t(
            field === 'payment_fee'
              ? '1c364c1c.c981a8'
              : field === 'mobile'
              ? '1c364c1c.f0a58a'
              : '1c364c1c.209f2b'
          )
        )
        return
      }
    }

    for (const validation of validations) {
      if (!validation.regex.test(parent[validation.field])) {
        showToast($t(validation.messageKey))
        return
      }
    }
    Taro.showLoading({ title: $t('1c364c1c.415038') })
    let par = {
      ...parent,
      staff_attribute: propertyIndex == 0 ? 'part_time' : 'full_time',
      payment_method: mannerIndex == 0 ? 'order' : 'amount',
      distributor_ids: [
        {
          distributor_id: params.distributor_id,
          name: params.name
        }
      ]
    }
    if (params?.operator_id) {
      await dianwuApi.patchAccountManagement(params.operator_id, par)
      showToast($t('1c364c1c.3bb47b'))
    } else {
      await dianwuApi.accountManagement(par)
      showToast($t('1c364c1c.3fdaea'))
    }

    Taro.hideLoading()
    Taro.navigateBack({
      delta: 1 // 默认值是1，表示返回的页面层数
    })
  }

  return (
    <SpPage className='page-address-edit'>
      <View className='page-address-edit-content'>
        <AtInput
          name='staff_no'
          title={$t('1c364c1c.530880')}
          type='text'
          placeholder={$t('1c364c1c.0f86ab')}
          value={parent.staff_no}
          onChange={(e) => handleChange('staff_no', e)}
        />
        {/* staff_attribute */}
        <View className='attribute'>
          <Text>{$t('1c364c1c.95a141')}</Text>
          {property.map((item, index) => {
            return (
              <View
                key={index}
                onClick={() => propertySwitch(false, index)}
                className={classNames(propertyIndex == index ? 'active' : '')}
              >
                {item.name}
              </View>
            )
          })}
        </View>
        {/* payment_method */}
        <View className='attribute'>
          <Text>{$t('1c364c1c.77d561')}</Text>
          {manner.map((item, index) => {
            return (
              <View
                key={index}
                onClick={() => propertySwitch(true, index)}
                className={classNames(mannerIndex == index ? 'active' : '')}
              >
                {item.name}
              </View>
            )
          })}
        </View>
        <AtInput
          name='payment_fee'
          title={$t('1c364c1c.60a4ae')}
          type='number'
          maxLength='5'
          placeholder={$t('1c364c1c.c981a8')}
          value={parent.payment_fee}
          onChange={(e) => handleChange('payment_fee', e)}
        >
          <View className='remarks'>
            {paymentTitle}
            {$t('1c364c1c.326fec')}
          </View>
        </AtInput>
        <AtInput
          name='mobile'
          title={$t('1c364c1c.ec9c94')}
          type='phone'
          maxLength='11'
          placeholder={$t('1c364c1c.f0a58a')}
          value={parent.mobile}
          onChange={(e) => handleChange('mobile', e)}
        />
        <AtInput
          name='username'
          title={$t('1c364c1c.9b3489')}
          type='text'
          placeholder={$t('1c364c1c.c6c579')}
          value={parent.username}
          onChange={(e) => handleChange('username', e)}
        />
        <AtInput
          name='password'
          title={$t('1c364c1c.2646b8')}
          type='text'
          value={parent.password}
          onChange={(e) => handleChange('password', e)}
        />
      </View>
      <View className='page-address-edit-scroll-establish' onClick={preserve}>
        <View>{$t('1c364c1c.56df61')}</View>
      </View>
    </SpPage>
  )
}

EditDeliveryman.options = {
  addGlobalClass: true
}

export default EditDeliveryman
