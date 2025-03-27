import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import { View, ScrollView, Text } from '@tarojs/components'
import { SpPage, SpScrollView, SpTagBar, SpImage, SpSelectModal } from '@/components'
import api from '@/api'
import doc from '@/doc'
import { pickBy } from '@/utils'
import './activity-detail.scss'

const initialState = {
  info: {},
  isOpened: false,
  selectOptions: [
    { label: '编辑报名信息', value: '0' },
    { label: '代他人报名', value: '1' }
  ]
}
function ActivityDetail(props) {
  const colors = useSelector((state) => state.sys)
  const [state, setState] = useImmer(initialState)
  const { info, isOpened, selectOptions } = state
  const router = useRouter()

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

  const fetch = async () => {
    const res = await api.user.registrationRecordInfo({
      record_id: router.params.record_id
    })
    console.log(res)
    const _info = pickBy(res, doc.activity.RECORD_DETAIL)
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
      console.log(123, answer?.split(','))
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

  const onBtnAction = (type) => {
    const { activityId, recordId, status } = info
    switch (type) {
      case 'reFill':
        //重新填写
        Taro.navigateTo({
          url: `/marketing/pages/reservation/goods-reservate?activity_id=${activityId}&record_id=${recordId}`
        })
        break
      case 'sign':
        //立即报名
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

          {/* <View className='activity-detail__info-code'>
            <View className='activity-detail__info-code-box'>
              <View className='activity-detail__info-code-title'>请凭二维码进行签到</View>
              <View className='activity-detail__info-code-img'>
              <SpImage
                src={
                  'https://daogou-public.oss-cn-hangzhou.aliyuncs.com/image/34/2025/03/25/b567aaef7e0c232aea996e17f779d47f1742886204580.平台验证白名单.png'
                }
                width={270}
              />
              </View>

            </View>
          </View> */}
        </View>

        {info?.formData?.length > 0 && (
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
            {info?.formData.map((item, idx) => (
              <View className='activity-detail__form-item' key={idx}>
                <View className='activity-detail__form-item-label'>{item.field_title}</View>
                <View className='activity-detail__form-item-value'>
                  {renderFormItemValue(item)}
                </View>
              </View>
            ))}
          </View>
        )}
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
