/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useTranslation, $t } from '@/i18n'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import * as memberDoc from '@/doc/member'
import { View, Swiper, SwiperItem, Text } from '@tarojs/components'
import { SpPage, SpImage, SpHtml } from '@/components'
import { pickBy } from '@/utils'
import './member-level.scss'

const initialState = {
  list: [],
  activeIndex: 0,
  total_consumption: 0
}
function MemberLevel(props) {
  const { i18n } = useTranslation()
  const { userInfo = {}, vipInfo = {} } = useSelector((state) => state.user)
  const [state, setState] = useImmer(initialState)
  const { list, activeIndex, total_consumption } = state
  useEffect(() => {
    fetch()
  }, [userInfo?.grade_id, vipInfo?.isVip])

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('2d951fb0.de4753') })
  }, [i18n.language])

  const fetch = async () => {
    const { grade_id } = userInfo
    const { member_card_list, vip_grade_list, total_consumption } = await api.member.getMemberCard()

    let list = []
    // 付费会员
    if (vipInfo?.isVip) {
      list = pickBy(vip_grade_list, memberDoc.VIP_GRADE_ITEM)
    } else {
      list = pickBy(member_card_list, memberDoc.MEMBER_CARD_ITEM)
    }
    const grade_index = list.findIndex((item) => item.grade_id == grade_id)
    setState((draft) => {
      draft.list = list?.map((item, index) => {
        if (item.grade_id == grade_id) {
          item.type = 'active'
        } else if (index < grade_index) {
          item.type = 'prev'
        } else if (index > grade_index) {
          item.type = 'next'
        }
        return item
      })
      draft.total_consumption = total_consumption
    })
  }

  const onChangeSwiper = (e) => {
    setState((draft) => {
      draft.activeIndex = e.detail.current
    })
  }
  const renderBackgroundImage = (item) => {
    if (!item.grade_background) {
      return {}
    }
    return {
      'background-image': `url(${item.grade_background})`,
      'background-size': 'cover',
      'background-position': 'center',
      'background-repeat': 'no-repeat'
    }
  }

  return (
    <SpPage className='page-member-level'>
      <View className='level-hd'>
        <Swiper
          className='card-swiper'
          previousMargin='75rpx'
          nextMargin='30rpx'
          current={activeIndex}
          onChange={onChangeSwiper}
        >
          {list.map((item, idx) => (
            <SwiperItem key={`swiperitem__${idx}`}>
              <View className='member-card' style={renderBackgroundImage(item)}>
                <SpImage src={item.pic || 'fufei_bg.png'} width={600} height={375} />
                <View className='grade-name'>{item.grade_name}</View>
                {/* <View className='grade-discount'>{`已消费${total_consumption / 100}元`}</View> */}
                <View className='level-info'>
                  {item.type === 'active' && <Text>{$t('91ae3916.5cd8cb')}</Text>}
                  {item.type === 'prev' && <Text>{$t('91ae3916.42280b')}</Text>}
                  {item.type === 'next' && <Text>{$t('91ae3916.7357b5')}</Text>}
                </View>
              </View>
            </SwiperItem>
          ))}
        </Swiper>
      </View>
      <View className='level-bd'>
        <View className='content-hd'>
          <View className='title'>{$t('91ae3916.1d3970')}</View>
        </View>
        <View className='content-bd'>
          <SpHtml content={list?.[activeIndex]?.description || ''}></SpHtml>
        </View>
      </View>
    </SpPage>
  )
}

MemberLevel.options = {
  addGlobalClass: true
}

export default MemberLevel
