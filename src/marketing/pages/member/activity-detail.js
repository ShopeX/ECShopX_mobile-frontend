/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import { View, ScrollView, Text } from '@tarojs/components'
import { useTranslation } from 'react-i18next'
import { SpPage, SpScrollView, SpImage } from '@/components'
import { SpTagBar, SpSelectModal } from '@/subpages/components'
import { $t, ti } from '@/i18n'
import api from '@/api'
import QRCode from 'qrcode'
import * as activityDoc from '@/doc/activity'
import { pickBy } from '@/utils'
import './activity-detail.scss'

const initialState = {
  info: {},
  isOpened: false,
  qrcode: ''
}
function ActivityDetail(props) {
  const { i18n } = useTranslation()
  const colors = useSelector((state) => state.sys)
  const [state, setState] = useImmer(initialState)
  const { info, isOpened, qrcode } = state
  const router = useRouter()
  const verifyRef = useRef()

  const selectOptions = useMemo(
    () => [
      { label: $t('c012603a.1f8f1b'), value: '0' },
      { label: $t('c012603a.78206f'), value: '1' }
    ],
    [i18n.language]
  )

  const statusMap = {
    'pending': 'daishenhe1',
    'passed': 'yibaoming',
    'rejected': 'yijujue',
    'verified': 'yihexiao',
    'canceled': 'yiquxiao'
  }

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('c012603a.41c54a') })
  }, [i18n.language])

  useDidShow(() => {
    fetch()
  })

  useEffect(() => {
    return () => {
      verifyRef.current && clearInterval(verifyRef.current)
    }
  }, [])

  const getQrCode = ({ verifyCode, recordId }) => {
    if (!verifyCode) return
    const params = {
      verify_code: verifyCode,
      record_id: recordId
    }
    QRCode.toDataURL(JSON.stringify(params)).then((res) => {
      console.log('getQrCode', res)
      setState((draft) => {
        draft.qrcode = res
      })
      verifyRef.current = setInterval(() => {
        fetch('isVerify')
      }, 3000)
    })
  }

  const fetch = async (isVerify) => {
    const res = await api.user.registrationRecordInfo({
      record_id: router?.params.record_id
    })

    console.log(res)
    const _info = pickBy(res, activityDoc.RECORD_DETAIL)
    if (isVerify) {
      if (_info.status == 'passed') return
      if (_info.status == 'verified' && verifyRef.current) {
        clearInterval(verifyRef.current)
      }
    }

    if (!isVerify) {
      verifyRef.current && clearInterval(verifyRef.current)
    }

    if (_info.isOfflineVerify && _info.status == 'passed') {
      getQrCode(_info)
    }
    setState((draft) => {
      draft.info = _info
    })
  }

  const renderFormItemValue = ({ answer, field_name }) => {
    console.log('answer', answer)
    if (
      typeof answer == 'string' &&
      ['Attachment upload', 'Attendance IDCard'].includes(field_name)
    ) {
      return (
        <View className='pic-item'>
          {answer?.split(',')?.map((item, idx) => (
            <SpImage src={item} key={idx} width={173} height={173} mode='aspectFit' />
          ))}
        </View>
      )
    } else {
      return answer
    }
  }

  const handleCancel = async () => {
    const res = await Taro.showModal({
      title: $t('61e2d21a.02d981'),
      content: $t('c012603a.f8b026'),
      showCancel: true,
      cancel: $t('61e2d21a.625fb2'),
      cancelText: $t('61e2d21a.625fb2'),
      confirmText: $t('settings.confirm'),
      confirmColor: colors.colorPrimary
    })
    if (res.confirm) {
      await api.user.cancelRecord({
        record_id: info.recordId
      })
      fetch()
      setTimeout(() => {
        Taro.eventCenter.trigger('onEventRecordStatusChange')
      }, 200)
    }
  }

  const handleSelectClose = () => {
    setState((draft) => {
      draft.isOpened = false
    })
  }

  const handleSlectConfirm = (value) => {
    const { activityId, recordId } = info
    let url = `/marketing/pages/reservation/goods-reservate?activity_id=${activityId}`
    if (value == '0') {
      url += `&record_id=${recordId}`
    }
    Taro.navigateTo({
      url
    })
    handleSelectClose()
  }

  const registrationSubmitFetch = async ({ activityId }) => {
    await api.user.joinActivity({ activity_id: activityId })
    Taro.showToast({
      icon: 'none',
      title: $t('c012603a.b90d81')
    })
    setTimeout(() => {
      Taro.navigateTo({
        url: `/marketing/pages/reservation/goods-reservate-result?activity_id=${activityId}`
      })
    }, 400)
  }

  const onBtnAction = (type) => {
    const { activityId, recordId, status, hasTemp } = info
    switch (type) {
      case 'reFill':
        Taro.navigateTo({
          url: `/marketing/pages/reservation/goods-reservate?activity_id=${activityId}&record_id=${recordId}`
        })
        break
      case 'sign':
        if (hasTemp) {
          if (['passed', 'canceled', 'verified'].includes(status)) {
            Taro.navigateTo({
              url: `/marketing/pages/reservation/goods-reservate?activity_id=${activityId}`
            })
          } else {
            setState((draft) => {
              draft.isOpened = true
            })
          }
        } else {
          registrationSubmitFetch(info)
        }

        break
      default:
        break
    }
  }

  const renderFooter = () => {
    const { actionCancel, actionEdit, actionApply } = info || {}

    if (!actionCancel && !actionEdit && !actionApply) return null

    return (
      <View className='activity-detail__footer'>
        {actionCancel && (
          <View className='activity-detail__footer-btn' onClick={handleCancel}>
            {$t('c012603a.caca39')}
          </View>
        )}
        {actionEdit && (
          <View
            className='activity-detail__footer-btn refill-btn'
            onClick={() => onBtnAction('reFill')}
          >
            {$t('c012603a.a5c7b5')}
          </View>
        )}
        {actionApply && (
          <View
            className='activity-detail__footer-btn refill-btn'
            onClick={() => onBtnAction('sign')}
          >
            {$t('c012603a.1e6c87')}
          </View>
        )}
      </View>
    )
  }

  console.log('info', info)

  return (
    <SpPage className='page-activity-detail' renderFooter={renderFooter()}>
      <View className='activity-detail'>
        <View className='activity-detail__hd'></View>
        <View className='activity-detail__header'>
          <View className='activity-detail__header-left'>
            <View className='activity-detail__header-left-status'>
              <Text className={`iconfont icon-${statusMap[info?.status]}`}></Text>
              {info?.statusName}
            </View>

            {info.reason && (
              <View className='activity-detail__header-left-reason'>{info.reason}</View>
            )}
          </View>
          {info?.recordNo && (
            <View className='activity-detail__header-right'>
              {ti('c012603a.e6bb26', [info.recordNo])}
            </View>
          )}
        </View>

        <View className='activity-detail__info'>
          <View className='activity-detail__info-title'>{info.activityName}</View>
          <View className='activity-detail__info-time'>{info?.intro}</View>
          <View className='activity-detail__info-area'>
            <View className='activity-detail__info-area-label'>{$t('c012603a.adb1b6')}</View>
            <View className='activity-detail__info-area-content'>{info?.activityPlace}</View>
          </View>
          <View className='activity-detail__info-area  no-margin'>
            <View className='activity-detail__info-area-label'>{$t('c012603a.75c1f8')}</View>
            <View className='activity-detail__info-area-content'>{info?.activityAddress}</View>
          </View>

          {qrcode && info?.status == 'passed' && (
            <View className='activity-detail__info-code'>
              <View className='activity-detail__info-code-box'>
                <View className='activity-detail__info-code-title'>{$t('c012603a.0a029e')}</View>
                <View className='activity-detail__info-code-img'>
                  <SpImage src={qrcode} width={270} />
                </View>
                <View className='activity-detail__info-code-code'>{info?.verifyCode}</View>
              </View>
            </View>
          )}
        </View>

        <View className='activity-detail__form'>
          <View className='activity-detail__form-item'>
            <View className='activity-detail__form-item-label'>{$t('c012603a.8098e2')}</View>
            <View className='activity-detail__form-item-value'>{info?.mobile}</View>
          </View>
          <View className='activity-detail__form-item'>
            <View className='activity-detail__form-item-label'>{$t('c012603a.c07abe')}</View>
            <View className='activity-detail__form-item-value'>{info?.getPoints}</View>
          </View>
          {info?.formData?.length > 0 &&
            info.formData.map((item, idx) => (
              <View className='activity-detail__form-item' key={idx}>
                <View className='activity-detail__form-item-label'>{item.field_title}</View>
                <View className='activity-detail__form-item-value'>
                  {renderFormItemValue(item)}
                </View>
              </View>
            ))}
        </View>
      </View>

      <SpSelectModal
        isOpened={isOpened}
        options={selectOptions}
        onClose={handleSelectClose}
        onConfirm={handleSlectConfirm}
      />
    </SpPage>
  )
}

ActivityDetail.options = {
  addGlobalClass: true
}

export default ActivityDetail
