import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { useRouter } from '@tarojs/taro'
import { View, ScrollView, Text } from '@tarojs/components'
import { SpPage, SpScrollView, SpTagBar, SpImage, SpTradeItem } from '@/components'
import api from '@/api'
import doc from '@/doc'
import { pickBy } from '@/utils'
import CompActivityItem from './comps/comp-activity-item'
import './activity-detail.scss'

const initialState = {
  tradeList: [],
  trackDetailList: [],
  openTrackDetail: false,
  info: {},
  formData: [
    { label: '昵称', value: 'dbajw' },
    { label: '手机号', value: 'dbajw' },
    { label: '股东姓名', value: 'dbajw' },
    { label: '身份证号', value: 'dbajw' },
    { label: '持股', value: 'dbajw' },
    { label: '联系电话', value: 'dbajw' },
    { label: '的年纪啊我好', value: 'dbajw' },
    {
      label: '营业执照',
      value: [
        'https://daogou-public.oss-cn-hangzhou.aliyuncs.com/image/34/2025/03/14/0658f505f76766bc2caa57ecfe53fe601741918027692.分类01.jpg'
      ]
    },
    {
      label: '股东身份证',
      value: [
        'https://daogou-public.oss-cn-hangzhou.aliyuncs.com/image/34/2025/03/14/0658f505f76766bc2caa57ecfe53fe601741918027692.分类01.jpg',
        'https://daogou-public.oss-cn-hangzhou.aliyuncs.com/image/34/2025/03/14/0658f505f76766bc2caa57ecfe53fe601741918027692.分类01.jpg',
        'https://daogou-public.oss-cn-hangzhou.aliyuncs.com/image/34/2025/03/14/0658f505f76766bc2caa57ecfe53fe601741918027692.分类01.jpg',
        'https://daogou-public.oss-cn-hangzhou.aliyuncs.com/image/34/2025/03/14/0658f505f76766bc2caa57ecfe53fe601741918027692.分类01.jpg',
        'https://daogou-public.oss-cn-hangzhou.aliyuncs.com/image/34/2025/03/14/0658f505f76766bc2caa57ecfe53fe601741918027692.分类01.jpg',
        'https://daogou-public.oss-cn-hangzhou.aliyuncs.com/image/34/2025/03/14/0658f505f76766bc2caa57ecfe53fe601741918027692.分类01.jpg'
      ]
    }
  ]
}
function ActivityDetail(props) {
  const [state, setState] = useImmer(initialState)
  const {  tradeList, trackDetailList, openTrackDetail, info, formData } = state
  const tradeRef = useRef()
  const router = useRouter()

  const statusMap = {
    'pending': 'daishenhe1',
    'passed': 'yibaoming',
    'rejected': 'yijujue',
    'verified': 'yihexiao',
    'canceled': 'yiquxiao'
  }

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    const res = await api.user.registrationRecordInfo({
      record_id: router.params.record_id
    })
    console.log(res)
    const _info = pickBy(res, {
      activityId: 'activity_id',
      recordId: 'record_id',
      activityName: 'activity_name',
      status: 'status',
      startDate: 'start_date',
      createDate: 'create_date',
      endDate: 'end_date',
      reason: 'reason',
      statusName: ({ activity_info }) => activity_info?.status_name,
      area: 'area',
      intro: ({ activity_info }) => activity_info?.intro,
      formData: ({ content }) => content?.[0]?.formdata
    })
    setState((draft) => {
      draft.info = _info
    })
  }



  const renderFormItemValue = (value) => {
    if (Array.isArray(value)) {
      return (
        <View className='pic-item'>
          {value.map((item, idx) => (
            <SpImage src={item} key={idx} width={173} />
          ))}
        </View>
      )
    } else {
      return value
    }
  }

  const renderFooter = () => {
    return (
      <View className='activity-detail__footer'>
        {/* 配置能取消，且状态不能为已取消、已核销 */}
        <View className='activity-detail__footer-btn'>取消报名</View>
        {/* 已拒绝 */}
        <View className='activity-detail__footer-btn refill-btn'>重新填写</View>
        {/* 未开启报名，状态为已报名 */}
        <View className='activity-detail__footer-btn disabled-btn'>已报名</View>
        {/* 开启重复报名，且状态不能为已取消、已核销 */}
        <View className='activity-detail__footer-btn refill-btn'>立即报名</View>
      </View>
    )
  }

  console.log('info',info)
  return (
    <SpPage scrollToTopBtn className='page-activity-detail' renderFooter={renderFooter()}>
      <View className='activity-detail'>
        <View className='activity-detail__hd'></View>
        <View className='activity-detail__header'>
          <View className='activity-detail__header-left'>
            <View className='activity-detail__header-left-status'>
              <Text className={`iconfont icon-${statusMap['canceled']}`}></Text>
              已报名
            </View>

            {info.reason && (
              <View className='activity-detail__header-left-reason'>{info.reason}</View>
            )}
          </View>
          <View className='activity-detail__header-right'>报名序号：0010</View>
        </View>

        <View className='activity-detail__info'>
          <View className='activity-detail__info-title'>{info.activityName}</View>
          <View className='activity-detail__info-time'>{info?.intro}</View>
          <View className='activity-detail__info-area'>
            <View className='activity-detail__info-area-label'>活动地点：</View>
            <View className='activity-detail__info-area-content'>北辰三角洲</View>
          </View>
          <View className='activity-detail__info-area no-margin'>
            <View className='activity-detail__info-area-label'>详细地址：</View>
            <View className='activity-detail__info-area-content'>
              北辰三角洲北辰三角洲北辰三角洲北辰三角洲北辰三角洲北辰三角洲北辰三角洲北辰三角洲北辰三角洲
            </View>
          </View>
        </View>

        {info?.formData?.length > 0 && (
          <View className='activity-detail__form'>
            {info?.formData.map((item, idx) => (
              <View className='activity-detail__form-item' key={idx}>
                <View className='activity-detail__form-item-label'>{item.field_title}</View>
                <View className='activity-detail__form-item-value'>
                  {renderFormItemValue(item.answer)}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </SpPage>
  )
}

ActivityDetail.options = {
  addGlobalClass: true
}

export default ActivityDetail
