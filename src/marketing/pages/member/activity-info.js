/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
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
  loading: false,
  imgHeightList: [], // 用于存储banner高度
  curImgIdx: 0,
  defaultImageHeight: 375 // 默认图片高度，避免空白
}
function ActivityInfo(props) {
  const [state, setState] = useImmer(initialState)
  const { info, isOpened, selectOptions, imgHeightList, defaultImageHeight, curImgIdx } = state
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
      draft.imgHeightList = new Array(_info?.pics?.length).fill(draft.defaultImageHeight)
    })
    // 异步计算图片真实高度，不阻塞页面渲染
    getMultipleImageInfo(_info?.pics)
      .then((heights) => {
        setState((draft) => {
          draft.imgHeightList = heights
        })
      })
      .catch((error) => {
        console.log('计算图片高度失败，使用默认高度:', error)
      })
  }

  const getMultipleImageInfo = async (imageUrls = []) => {
    let windowsWidth = defaultImageHeight
    try {
      const sys = Taro.getSystemInfoSync()
      if (sys && sys.windowWidth) {
        windowsWidth = sys.windowWidth
      }
    } catch (e) {
      console.log('获取系统信息失败，使用默认宽度:', e)
    }

    const promises = imageUrls.map(async (url) => {
      try {
        const imageInfo = await Taro.getImageInfo({ src: url })
        const imgWidth = Number(imageInfo?.width) || 0
        const imgHeight = Number(imageInfo?.height) || 0
        if (imgWidth > 0 && imgHeight > 0) {
          return Math.round((windowsWidth * imgHeight) / imgWidth)
        }
        return Math.round(windowsWidth)
      } catch (error) {
        console.log('获取图片信息失败:', url, error)
        return Math.round(windowsWidth)
      }
    })

    return Promise.all(promises)
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

  const onChangeSwiper = async (e) => {
    await setState((draft) => {
      draft.curImgIdx = e.detail.current
    })
  }

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
        <ScrollView scrollY className='activity-info__pic' style={{ height: `calc(100vh - 71px)` }}>
          <View className='ctivity-info__pic-container'>
            <Swiper
              className='activity-swiper'
              indicatorDots
              onChange={onChangeSwiper}
              style={{ height: (imgHeightList[curImgIdx] || defaultImageHeight) + 'px' }}
            >
              {info?.pics.map((img, idx) => (
                <SwiperItem key={`swiperitem__${idx}`}>
                  <SpImage mode='widthFix' src={img} width={windowWidth * 2}></SpImage>
                </SwiperItem>
              ))}
            </Swiper>
          </View>
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
        </ScrollView>
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
