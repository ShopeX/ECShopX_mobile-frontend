// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import { View, ScrollView, Text } from '@tarojs/components'
import { SpPage, SpScrollView, SpTagBar, SpImage, SpSelectModal } from '@/components'
import api from '@/api'
import QRCode from 'qrcode'
import doc from '@/doc'
import { pickBy } from '@/utils'
import './activity-detail.scss'

const initialState = {
  info: {},
  isOpened: false,
  selectOptions: [
    { label: '编辑报名信息', value: '0' },
    { label: '代他人报名', value: '1' }
  ],
  qrcode: ''
}
function ActivityDetail(props) {
  const colors = useSelector((state) => state.sys)
  const [state, setState] = useImmer(initialState)
  const { info, isOpened, selectOptions, qrcode } = state
  const router = useRouter()
  const verifyRef = useRef()

  const statusMap = {
    'pending': 'daishenhe1',
    'passed': 'yibaoming',
    'rejected': 'yijujue',
    'verified': 'yihexiao',
    'canceled': 'yiquxiao'
  }

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
      record_id: router.params.record_id
    })

    console.log(res)
    const _info = pickBy(res, doc.activity.RECORD_DETAIL)
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
      title: '提示',
      content: `确定要取消吗?`,
      showCancel: true,
      cancel: '取消',
      cancelText: '取消',
      confirmText: '确定',
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
      // 编辑
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
      title: '报名成功'
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
        //重新填写
        Taro.navigateTo({
          url: `/marketing/pages/reservation/goods-reservate?activity_id=${activityId}&record_id=${recordId}`
        })
        break
      case 'sign':
        //立即报名
        if (hasTemp) {
          //有模板
          if (['passed', 'canceled', 'verified'].includes(status)) {
            Taro.navigateTo({
              url: `/marketing/pages/reservation/goods-reservate?activity_id=${activityId}`
            })
          } else {
            //有编辑
            setState((draft) => {
              draft.isOpened = true
            })
          }
        } else {
          // 没有模板
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
            取消报名
          </View>
        )}
        {actionEdit && (
          <View
            className='activity-detail__footer-btn refill-btn'
            onClick={() => onBtnAction('reFill')}
          >
            重新填写
          </View>
        )}
        {actionApply && (
          <View
            className='activity-detail__footer-btn refill-btn'
            onClick={() => onBtnAction('sign')}
          >
            立即报名
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
            <View className='activity-detail__header-right'>报名序号：{info.recordNo}</View>
          )}
        </View>

        <View className='activity-detail__info'>
          <View className='activity-detail__info-title'>{info.activityName}</View>
          <View className='activity-detail__info-time'>{info?.intro}</View>
          <View className='activity-detail__info-area'>
            <View className='activity-detail__info-area-label'>活动地点：</View>
            <View className='activity-detail__info-area-content'>{info?.activityPlace}</View>
          </View>
          <View className='activity-detail__info-area  no-margin'>
            <View className='activity-detail__info-area-label'>详细地址：</View>
            <View className='activity-detail__info-area-content'>{info?.activityAddress}</View>
          </View>

          {qrcode && info?.status == 'passed' && (
            <View className='activity-detail__info-code'>
              <View className='activity-detail__info-code-box'>
                <View className='activity-detail__info-code-title'>请凭二维码进行签到</View>
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
            <View className='activity-detail__form-item-label'>手机号</View>
            <View className='activity-detail__form-item-value'>{info?.mobile}</View>
          </View>
          <View className='activity-detail__form-item'>
            <View className='activity-detail__form-item-label'>获取积分</View>
            <View className='activity-detail__form-item-value'>{info?.getPoints}</View>
          </View>
          {/* 动态表单 */}
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
