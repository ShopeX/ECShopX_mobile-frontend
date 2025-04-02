import React, { useEffect, useRef, useMemo } from 'react'
import { useImmer } from 'use-immer'
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import { View, ScrollView, Text, Swiper, SwiperItem } from '@tarojs/components'
import { SpPage, SpHtml, SpLoading, SpImage, SpSelectModal } from '@/components'
import api from '@/api'
import doc from '@/doc'
import { AtButton } from 'taro-ui'
import { pickBy, isArray, classNames } from '@/utils'
import { useNavigation } from '@/hooks'
import { WgtFilm, WgtSlider, WgtWriting, WgtGoods, WgtHeadline } from '@/pages/home/wgts'
import './activity-info.scss'

const initialState = {
  info: null,
  isOpened: false,
  selectOptions: [
    { label: '编辑报名信息', value: '0' },
    { label: '代他人报名', value: '1' }
  ],
  keyword: '',
  loading: false
}
function ActivityInfo(props) {
  const [state, setState] = useImmer(initialState)
  const { info, isOpened, selectOptions, keyword, loading } = state
  const router = useRouter()
  const { windowWidth } = Taro.getSystemInfoSync()
  const { setNavigationBarTitle } = useNavigation()

  useDidShow(() => {
    fetch()
  })

  const fetch = async () => {
    const { activity_info, total_join_num } = await api.user.registrationActivity({
      activity_id: router.params.activity_id
    })

    let _info = pickBy(activity_info, doc.activity.ACTIVITY_DETAIL)
    _info.totalJoinNum = total_join_num
    setNavigationBarTitle(_info?.activityName)
    setState((draft) => {
      draft.info = _info
    })
  }

  const registrationSubmitFetch = async () => {
    setState((draft) => {
      draft.loading = true
    })
    const { activityId } = info
    try {
      await api.user.joinActivity({ activity_id: info.activityId })
      Taro.showToast({
        icon: 'none',
        title: '报名成功'
      })
      setState((draft) => {
        draft.loading = false
      })
      setTimeout(() => {
        Taro.navigateTo({
          url: `/marketing/pages/reservation/goods-reservate-result?activity_id=${activityId}`
        })
      }, 400)
    } catch (error) {
      setState((draft) => {
        draft.loading = false
      })
    }
  }

  const onBtnAction = () => {
    if (signDisabled) return

    const { recordId, hasTemp, recordStatus } = info

    //如果自己第一次报名，则判断是否有模板
    //有模板跳表单页面
    //没有模板 直接请求跳结果页面
    //如果老用户
    //选择编辑/代新人
    //编辑：有模板跳转表单 / 没有模板则不能编辑
    //代新人:有模板跳转表单 / 直接请求跳结果页面
    //  info.hasTemp  是否有模板
    if (!recordId) {
      //新用户
      if (hasTemp) {
        //有模板：去表单页面
        handleToGoodsReservate()
      } else {
        //没模板：直接报名
        registrationSubmitFetch()
      }
    } else {
      //老用户
      if (hasTemp) {
        //有模板：选择编辑还是代他人
        if (['pending', 'rejected'].includes(recordStatus)) {
          //选择编辑还是代他人
          setState((draft) => {
            draft.isOpened = true
          })
        } else {
          // 不能编辑
          handleToGoodsReservate()
        }
      } else {
        //没模板：直接报名
        registrationSubmitFetch()
      }
    }
  }

  const handleSelectClose = () => {
    setState((draft) => {
      draft.isOpened = false
    })
  }

  const handleSlectConfirm = (value) => {
    const isEdit = value == '0'
    handleToGoodsReservate(isEdit)
    handleSelectClose()
  }

  const handleToGoodsReservate = (isEdit = false) => {
    const { activityId, recordId } = info
    let url = `/marketing/pages/reservation/goods-reservate?activity_id=${activityId}`
    if (isEdit) {
      // 编辑
      url += `&record_id=${recordId}`
    }
    Taro.navigateTo({
      url
    })
  }

  const signDisabled = useMemo(() => {
    const { joinLimit, totalJoinNum, isAllowDuplicate, recordId, status } = info || {}
    if (!info || status == 'end') return true

    //已报名次数 == 报名次数上限
    //不能重复报名，有报名记录了
    return (joinLimit <= totalJoinNum && joinLimit != 0) || (!isAllowDuplicate && recordId)
  }, [info])

  const renderFooter = () => {
    return (
      <View className='activity-info__footer'>
        <View className='activity-info__footer-num'>
          已报名
          <Text className='activity-info__footer-num-active'>{info?.totalJoinNum}</Text>家
        </View>
        <AtButton
          circle
          type='primary'
          className='activity-info__footer-btn'
          disabled={signDisabled}
          onClick={onBtnAction}
        >
          立即报名
        </AtButton>
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

          {(info.showPlace || info.showAddress || info.showTime) && (
            <View className='activity-info__content'>
              {info.showPlace && (
                <View className='activity-info__address'>
                  <Text className='iconfont icon-didian'></Text>
                  {info.place}
                </View>
              )}
              {info.showAddress && (
                <View className='activity-info__address detail-address'>
                  <Text className='iconfont icon-dizhi'></Text>
                  {info.address}
                </View>
              )}
              {info.showTime && (
                <View className='activity-info__time'>
                  活动时间：{info?.startDate} 至 {info?.endDate}
                </View>
              )}
            </View>
          )}

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

ActivityInfo.options = {
  addGlobalClass: true
}

export default ActivityInfo
