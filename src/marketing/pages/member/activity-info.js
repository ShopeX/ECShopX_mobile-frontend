import React, { useEffect, useRef, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { useRouter } from '@tarojs/taro'
import { View, ScrollView, Text, Swiper, SwiperItem } from '@tarojs/components'
import { SpPage, SpHtml, SpLoading, SpImage, SpSelectModal } from '@/components'
import api from '@/api'
import doc from '@/doc'
import { pickBy, isArray, classNames } from '@/utils'
import { useNavigation } from '@/hooks'
import CompActivityItem from './comps/comp-activity-item'
import {
  WgtFilm,
  WgtSlider,
  WgtWriting,
  WgtGoods,
  WgtHeading,
  WgtHeadline
} from '@/pages/home/wgts'
import './activity-info.scss'

const initialState = {
  info: null,
  isOpened: false,
  selectOptions: [
    { label: '编辑报名信息', value: '0' },
    { label: '代他人报名', value: '1' }
  ],
  activityInfo: {},
  keyword: ''
}
function ItemActivity(props) {
  const [state, setState] = useImmer(initialState)
  const { info, isOpened, selectOptions, activityInfo, keyword } = state
  const recordRef = useRef()
  const router = useRouter()
  const { windowWidth } = Taro.getSystemInfoSync()
  const { setNavigationBarTitle } = useNavigation()

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    const { activity_info } = await api.user.registrationActivity({
      activity_id: router.params.activity_id
    })

    console.log(888, activity_info)

    let _info = pickBy(activity_info, {
      pics: ({ pics }) => pics.split(','),
      activityName: 'activity_name',
      content: 'content'
    })
    setNavigationBarTitle(_info?.activityName)
    setState((draft) => {
      draft.info = _info
    })
  }

  const onBtnAction = (item, type) => {
    if (signDisabled) return
    const { activityId, recordId } = item
    switch (type) {
      case 'reFill':
        //重新填写
        Taro.navigateTo({
          url: `/marketing/pages/reservation/goods-reservate?activity_id=${activityId}&record_id=${recordId}`
        })
        break
      case 'sign':
        //立即报名
        setState((draft) => {
          draft.isOpened = true
          draft.activityInfo = item
        })
        break
      default:
        break
    }
  }

  const handleSelectClose = () => {
    setState((draft) => {
      draft.isOpened = false
    })
  }

  const handleSlectConfirm = (value) => {
    const { activityId, recordId } = activityInfo
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

  const signDisabled = useMemo(() => 0, [activityInfo])

  const renderFooter = () => {
    return (
      <View className='activity-info__footer'>
        <View className='activity-info__footer-num'>
          已报名
          <Text className='activity-info__footer-num-active'>2</Text>家
        </View>
        <View
          className={classNames('activity-info__footer-btn', { 'is-disabled': signDisabled })}
          onClick={() => onBtnAction(activityInfo, 'sign')}
        >
          立即报名
        </View>
      </View>
    )
  }

  return (
    <SpPage scrollToTopBtn className='page-activity-info' renderFooter={renderFooter()}>
      {!info && <SpLoading />}
      {info && (
        <>
          <ScrollView scrollY className='activity-info__pic' style='height: 100%;'>
            <View className='ctivity-info__pic-container'>
              <Swiper className='activity-swiper' indicatorDots>
                {info?.pics.map((img, idx) => (
                  <SwiperItem key={`swiperitem__${idx}`}>
                    <SpImage mode='widthFix' src={img} width={windowWidth * 2}></SpImage>
                  </SwiperItem>
                ))}
              </Swiper>
            </View>
          </ScrollView>

          <View className='activity-info__content'>
            <View className='activity-info__title'>{info.activityName}</View>
            <View className='activity-info__member'>
              <View className='activity-info__member-detail'>会员免费</View>
            </View>
          </View>

          <View className='activity-info__content'>
            <View className='activity-info__address'>
              <Text className='iconfont icon-didian'></Text>
              {info.activityName}
            </View>
            <View className='activity-info__address detail-address'>
              <Text className='iconfont icon-dizhi'></Text>
              {info.activityName}
            </View>
            <View className='activity-info__time'>活动时间：ddddwadwa</View>
          </View>

          <View className='activity-info__content'>
            <View className='activity-info__detail'>活动详情</View>
            {isArray(info.content) ? (
              <View>
                {info.content.map((item, idx) => (
                  <View className='wgt-wrap' key={`wgt-wrap__${idx}`}>
                    {item.name === 'film' && <WgtFilm info={item} />}
                    {item.name === 'slider' && <WgtSlider info={item} />}
                    {item.name === 'writing' && <WgtWriting info={item} />}
                    {/* {item.name === 'heading' && <WgtHeading info={item} />} */}
                    {item.name === 'headline' && <WgtHeadline info={item} />}
                    {item.name === 'goods' && <WgtGoods info={item} />}
                  </View>
                ))}
              </View>
            ) : (
              <SpHtml content={info.content} />
            )}
          </View>
        </>
      )}

      <SpSelectModal
        isOpened={isOpened}
        options={selectOptions}
        onClose={handleSelectClose}
        onConfirm={handleSlectConfirm}
      />
    </SpPage>
  )
}

ItemActivity.options = {
  addGlobalClass: true
}

export default ItemActivity
