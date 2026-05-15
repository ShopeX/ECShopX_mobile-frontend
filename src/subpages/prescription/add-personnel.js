/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { View, Text, Picker } from '@tarojs/components'
import { SpCell, SpPage, SpCheckbox, SpInput as AtInput } from '@/components'
import { useImmer } from 'use-immer'
import { AtButton } from 'taro-ui'
import { showToast, validate } from '@/utils'
import Taro, { useRouter } from '@tarojs/taro'
import api from '@/api'
import { useNavigation } from '@/hooks'
import { useTranslation, $t } from '@/i18n'
import { P_MALE, P_FEMALE } from './i18n-keys'
import { getRelationshipOptions } from './relationship-options'
import './add-personnel.scss'

const initialStateBase = {
  info: {
    user_family_name: '',
    user_family_id_card: '',
    user_family_phone: '',
    user_family_age: '',
    user_family_gender: '',
    relationship: 0
  },
  handlechecked: null
}

function AddPersonnel() {
  const { i18n } = useTranslation()
  const [state, setState] = useImmer(() => ({
    ...initialStateBase,
    selector: getRelationshipOptions($t)
  }))
  const { setNavigationBarTitle } = useNavigation()

  const { info, selector, handlechecked } = state
  const router = useRouter()

  const navTitle = () => (router?.params?.id ? $t('3bb83dc0.1b62dc') : $t('3bb83dc0.ae3786'))

  useEffect(() => {
    medicationPersonnel()
  }, [])

  useEffect(() => {
    setNavigationBarTitle(navTitle())
    setState((draft) => {
      draft.selector = getRelationshipOptions($t)
    })
  }, [i18n.language, router?.params?.id])

  const medicationPersonnel = async () => {
    const { id } = router?.params
    if (id) {
      let res = await api.prescriptionDrug.medicationPersonnelDetail({ id })
      res.relationship = res.relationship - 1
      setState((draft) => {
        draft.info = res
        draft.handlechecked = res.user_family_gender
      })
    }
  }
  const handleClickToEdit = async () => {
    if (info.user_family_name == '') {
      showToast($t('3bb83dc0.629b2e'))
      return
    }
    if (info.user_family_id_card == '') {
      showToast($t('3bb83dc0.64e8f2'))
      return
    }
    if (!/^\d{17}[\dXx]$/.test(info.user_family_id_card)) {
      showToast($t('3bb83dc0.947a89'))
      return
    }
    if (info.user_family_phone == '') {
      showToast($t('3bb83dc0.395447'))
      return
    }
    if (!validate.isMobileNum(info.user_family_phone)) {
      showToast($t('3bb83dc0.e9a2ae'))
      return
    }
    if (info.user_family_gender == '') {
      showToast($t('3bb83dc0.694f88'))
      return
    }
    if (!selector?.[info.relationship]?.key) {
      showToast($t('3bb83dc0.87e6d5'))
      return
    }
    let params = {
      ...info,
      relationship: Number(info.relationship) + 1
    }
    if (router?.params.id) {
      await api.prescriptionDrug.putMedicationPersonnel(params)
    } else {
      await api.prescriptionDrug.medicationPersonnel(params)
    }
    showToast(router?.params.id ? $t('3bb83dc0.3bb47b') : $t('3bb83dc0.3fdaea'))
    setTimeout(() => {
      Taro.navigateBack()
    }, 300)
  }

  const handleChange = (name, val) => {
    const nInfo = JSON.parse(JSON.stringify(state.info || {}))
    if (name == 'user_family_id_card' && val.length == 18) {
      nInfo.user_family_age = calculateAgeByIdCard(val)
    }
    nInfo[name] = val
    setState((draft) => {
      draft.info = nInfo
      draft.handlechecked = name === 'user_family_gender' ? val : handlechecked
    })
  }

  const pickerChange = (e) => {
    const nInfo = JSON.parse(JSON.stringify(state.info || {}))
    nInfo.relationship = e.detail.value
    setState((draft) => {
      draft.info = nInfo
    })
  }

  const calculateAgeByIdCard = (idCard) => {
    if (!/^\d{17}[\dXx]$/.test(idCard)) {
      throw new Error('invalid id')
    }

    const birthDateStr = idCard.substring(6, 14)
    const year = parseInt(birthDateStr.substring(0, 4), 10)
    const month = parseInt(birthDateStr.substring(4, 6), 10)
    const day = parseInt(birthDateStr.substring(6, 8), 10)

    const birthDate = new Date(year, month - 1, day)

    const today = new Date()

    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    const dayDiff = today.getDate() - birthDate.getDate()

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--
    }
    return age
  }

  return (
    <SpPage
      className='add-personnel'
      renderFooter={
        <View className='btn-wrap'>
          <AtButton circle type='primary' onClick={handleClickToEdit}>
            {$t('3bb83dc0.be5fbb')}
          </AtButton>
        </View>
      }
    >
      <View className='prompt'>
        <Text className='iconfont icon-bg-security'></Text>
        {$t('3bb83dc0.7f87d4')}
      </View>

      <View className='scroll-view-container'>
        <View className='scroll-view-body'>
          <View className='page-address-edit__form'>
            <SpCell className='logistics-no border-bottom' certainly title={$t('3bb83dc0.d78d18')}>
              <AtInput
                name='user_family_name'
                value={info?.user_family_name}
                cursor={info?.user_family_name?.length}
                placeholder={$t('3bb83dc0.0197ac')}
                onChange={(e) => handleChange('user_family_name', e)}
              />
            </SpCell>

            <SpCell className='logistics-no border-bottom' certainly title={$t('3bb83dc0.32ffa2')}>
              <AtInput
                name='user_family_id_card'
                value={info?.user_family_id_card}
                cursor={info?.user_family_id_card?.length}
                placeholder={$t('3bb83dc0.cf8361')}
                onChange={(e) => handleChange('user_family_id_card', e)}
              />
            </SpCell>

            <SpCell className='logistics-no border-bottom' certainly title={$t('3bb83dc0.92448a')}>
              <AtInput
                name='user_family_phone'
                maxLength={11}
                value={info?.user_family_phone}
                cursor={info?.user_family_phone?.length}
                placeholder={$t('3bb83dc0.46d2f3')}
                onChange={(e) => handleChange('user_family_phone', e)}
              />
            </SpCell>

            <SpCell className='logistics-no border-bottom' certainly title={$t('3bb83dc0.51591a')}>
              <View className='ages'>
                {info?.user_family_age ? info?.user_family_age : $t('3bb83dc0.9731fb')}
              </View>
            </SpCell>

            <SpCell className='logistics-no border-bottom' certainly title={$t('3bb83dc0.297968')}>
              <View className='gender'>
                <SpCheckbox
                  checked={handlechecked == 1}
                  label={$t(P_MALE)}
                  onChange={handleChange.bind(this, 'user_family_gender', 1)}
                />

                <SpCheckbox
                  checked={handlechecked == 2}
                  label={$t(P_FEMALE)}
                  className='genders'
                  onChange={handleChange.bind(this, 'user_family_gender', 2)}
                />
              </View>
            </SpCell>

            <Picker mode='selector' range={selector} rangeKey='value' onChange={pickerChange}>
              <SpCell
                className='logistics-no province border-bottom'
                title={$t('3bb83dc0.3f28e7')}
                isLink
                arrow
                certainly
              >
                <View className='picker'>{selector?.[info.relationship]?.value}</View>
              </SpCell>
            </Picker>
          </View>
        </View>
      </View>
    </SpPage>
  )
}

export default AddPersonnel
