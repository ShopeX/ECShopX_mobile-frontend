import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { useRouter } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { SpPage, SpScrollView, SpTagBar, SpImage, SpTradeItem } from '@/components'
import api from '@/api'
import doc from '@/doc'
import { pickBy } from '@/utils'
import CompActivityItem from './comps/comp-activity-item'
import './activity-detail.scss'

const initialState = {
  tradeStatus: [
    { tag_name: '全部', value: '0' },
    { tag_name: '待审核', value: '1' },
    { tag_name: '已报名', value: '2' },
    { tag_name: '已拒绝', value: '3' },
    { tag_name: '已取消', value: '4' },
    { tag_name: '已审核', value: '5' }
  ],
  status: '0',
  tradeList: [],
  trackDetailList: [],
  openTrackDetail: false,
  info: null,
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
  const { tradeStatus, status, tradeList, trackDetailList, openTrackDetail, info, formData } = state
  const tradeRef = useRef()
  const router = useRouter()

  useEffect(() => {
    const { status = 0 } = router.params
    setState((draft) => {
      draft.status = status
    })
  }, [])

  const fetch = async ({ pageIndex, pageSize }) => {
    const { is_rate } = tradeStatus.find((item) => item.value == status)
    const params = {
      page: pageIndex,
      pageSize,
      order_type: 'normal',
      status,
      is_rate
    }
    const {
      list,
      pager: { count: total },
      rate_status
    } = await api.trade.list(params)
    const tempList = pickBy(list, doc.trade.TRADE_ITEM)
    // console.log('tempList:', tempList)
    setState((draft) => {
      draft.tradeList = [...tradeList, ...tempList]
    })
    return { total }
  }

  const onChangeTradeState = (e) => {
    setState((draft) => {
      draft.status = tradeStatus[e].value
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
        <View className='activity-detail__footer-btn'>取消报名</View>
        <View className='activity-detail__footer-btn refill-btn'>重新填写</View>
      </View>
    )
  }

  return (
    <SpPage scrollToTopBtn className='page-activity-detail' renderFooter={renderFooter()}>
      {/* <SpTagBar list={tradeStatus} value={status} onChange={onChangeTradeState} /> */}
      <View className='activity-detail'>
        <View className='activity-detail__hd'></View>
        <View className='activity-detail__header'>
          <View className='activity-detail__header-left'>已报名</View>
          <View className='activity-detail__header-right'>报名序号：0010</View>
        </View>
        <View className='activity-detail__info'>
          <View className='activity-detail__info-title'>达仁堂2025年度大会</View>
          <View className='activity-detail__info-time'>2025-02-34 周四 10:00:00</View>
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

        <View className='activity-detail__form'>
          {formData.map((item, idx) => (
            <View className='activity-detail__form-item' key={idx}>
              <View className='activity-detail__form-item-label'>{item.label}</View>
              <View className='activity-detail__form-item-value'>
                {renderFormItemValue(item.value)}
              </View>
            </View>
          ))}
        </View>
      </View>
    </SpPage>
  )
}

ActivityDetail.options = {
  addGlobalClass: true
}

export default ActivityDetail
