import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, ScrollView, Swiper, SwiperItem } from '@tarojs/components'
import { SpPage, SpImage, SpHtml } from '@/components'
import { styleNames, pickBy } from '@/utils'
import './member-level.scss'

const initialState = {
  list: [],
  activeIndex: 0,
  total_consumption: 0
}
function MemberLevel(props) {
  const { userInfo = {}, vipInfo = {} } = useSelector((state) => state.user)
  const [state, setState] = useImmer(initialState)
  const { list, activeIndex, total_consumption } = state
  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    const { member_card_list, vip_grade_list, total_consumption } = await api.member.getMemberCard()
    let list = []
    // 付费会员
    if (vipInfo?.isVip) {
      list = pickBy(vip_grade_list, doc.member.VIP_GRADE_ITEM)
    } else {
      list = pickBy(member_card_list, doc.member.MEMBER_CARD_ITEM)
    }
    setState((draft) => {
      draft.list = list,
      draft.total_consumption = total_consumption
    })
  }

  const onChangeSwiper = (e) => {
    setState(draft => {
      draft.activeIndex = e.detail.current
    })
  }

  return (
    <SpPage className='page-member-level'>
      <View
        className='level-hd'
      >
        <Swiper
          className='card-swiper'
          previousMargin="75rpx"
          nextMargin="30rpx"
          current={activeIndex}
          onChange={onChangeSwiper}
        >
          {list.map((item, idx) => (
            <SwiperItem key={`swiperitem__${idx}`}>
              <View className='member-card'>
                <SpImage src={item.pic || 'fufei_bg.png'} width={600} height={375} />
                <View className='grade-name'>{item.grade_name}</View>
                <View className='grade-discount'>{`已消费${total_consumption / 100}元`}</View>
              </View>
            </SwiperItem>
          ))}
        </Swiper>
      </View>
      <View className='level-bd'>
        <View className='content-hd'>
          <View className='title'>等级权益</View>
        </View>
        <View className='content-bd'><SpHtml content={list?.[activeIndex]?.description || ''}></SpHtml></View>
      </View>
    </SpPage>
  )
}

MemberLevel.options = {
  addGlobalClass: true
}

export default MemberLevel
