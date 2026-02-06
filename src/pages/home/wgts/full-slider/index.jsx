/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useCallback, useContext, useMemo } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { useImmer } from 'use-immer'
import { SpImage, SpLogin } from '@/components'
import { View, Image, Video, Swiper, SwiperItem, Text } from '@tarojs/components'
import { classNames, styleNames, linkPage } from '@/utils'
import { cloneDeep } from 'lodash'
import { needLoginPageType, needLoginPage } from '@/consts'
import { WgtsContext } from '../wgts-context'
import { getGlobalBaseStyle } from '../helper'
import './index.scss'

const $instance = getCurrentInstance()
const initState = {
  curIdx: 0,
  play: false,
  localData: [],
  show: false,
  height: 0
}

function WgtFullSlider(props) {
  const [state, setState] = useImmer(initState)
  const { info = null, index } = props

  // 从 params 中获取配置和数据，兼容两种数据结构
  // 1. 新结构：info.params.config, info.params.data, info.params.base
  // 2. 旧结构：info.config, info.data, info.base
  const params = info?.params || info || {}
  const base = params.base || {}
  const config = params.config || {}
  const data = params.data || []

  const { curIdx, play, localData, show, height } = state
  const {
    isTab = false,
    immersive = false,
    isShowHomeHeader = false,
    footerHeight
  } = useContext(WgtsContext)

  // 获取外层样式（包含 outerMargin 和背景配置）
  const outerStyle = useMemo(() => {
    return getGlobalBaseStyle(base.outerMargin || {})
  }, [base])

  // 初始化数据
  useEffect(() => {
    if (info && data && data.length > 0) {
      setState((draft) => {
        draft.localData = cloneDeep(data)
        draft.show = true
      })
      setHeight()
    }
  }, [info, data])

  useEffect(() => {
    if (data.length === 0) return
    const item = data[curIdx]
    if (item.media_type === 'video' && item.autoplay) {
      setState((draft) => {
        draft.play = true
      })
    }
  }, [])

  // 设置高度
  const setHeight = useCallback(() => {
    const heightS = immersive ? 0 : 89
    const homeHeight = isShowHomeHeader ? 90 : 0
    const tabHeight = isTab ? footerHeight : 0

    setState((draft) => {
      draft.height = isTab
        ? `calc(100vh - ${homeHeight}rpx - ${heightS}px - ${tabHeight ? tabHeight : '0px'})`
        : `calc(100vh - ${homeHeight}rpx - ${heightS}px)`
    })
  }, [immersive, isShowHomeHeader, isTab, footerHeight])

  // 切换视频播放
  const togglePlay = (itemIndex) => {
    const item = localData[itemIndex]
    if (item.media_type === 'video') {
      const videoRef = Taro.createVideoContext(`swiperVideo_${itemIndex}${index}`, $instance)
      if (play) {
        videoRef.pause()
        setState((draft) => {
          draft.play = false
        })
      } else {
        videoRef.play()
        setState((draft) => {
          draft.play = true
        })
      }
    }
  }

  // 轮播切换
  const changeSwiper = (e) => {
    const currentIndex = e.detail.current
    const videoData = localData[currentIndex]
    const prevideoData = localData[curIdx]
    if (videoData.media_type === 'video') {
      const videoRef = Taro.createVideoContext(`swiperVideo_${currentIndex}${index}`, $instance)
      if (videoData.autoplay) {
        videoRef.play()
        setState((draft) => {
          draft.play = true
        })
      } else {
        setState((draft) => {
          draft.play = false
        })
      }
    }
    if (prevideoData.media_type === 'video') {
      const prevideoRef = Taro.createVideoContext(`swiperVideo_${curIdx}${props.index}`, $instance)
      prevideoRef.pause()
      if (prevideoData.interact === 'reset') {
        prevideoRef.seek(0)
      }
    }
    setState((draft) => {
      draft.curIdx = currentIndex
    })
  }

  // 视频播放结束
  const handlePlayEnd = (e, item) => {
    if (!item.loop) {
      setState((draft) => {
        draft.play = false
      })
    }
  }

  // 视频开始播放
  const handlePlayStart = (e, item, index) => {
    if (item?.hidenPoster) return
    const _localData = cloneDeep(localData)
    _localData[index].hidenPoster = true
    setState((draft) => {
      draft.localData = _localData
    })
  }

  // 视频进度更新
  const handleTimeUpdate = (e, item, index) => {
    const { currentTime } = e.detail
    const _localData = cloneDeep(localData)
    _localData[index].currentTime = currentTime
    setState((draft) => {
      draft.localData = _localData
    })
  }

  // 指示器
  const setIndicator = () => {
    if (!config) return null
    const page = Number(curIdx + 1)
    const { dotbottom, indicatorText, indicatorFontSize, indicatorColor } = config
    const currentItem = localData[curIdx]
    return (
      <View
        className='indicator-item'
        style={{ color: indicatorColor, bottom: `${dotbottom || 0}px` }}
      >
        <View
          className='indicator-current'
          style={{ fontSize: indicatorFontSize + 'px' }}
          onClick={() => {
            if (currentItem?.moreLink) {
              linkPage(currentItem?.moreLink)
            }
          }}
        >
          <Text style={{ fontSize: indicatorFontSize + 4 + 'px' }}>
            {page < 10 ? '0' + page : page}
          </Text>
          <Text> / </Text>
          <Text>{localData.length < 10 ? '0' + localData.length : localData.length}</Text>
        </View>
        {currentItem?.moreLink ? (
          <View
            className='indicator-text'
            style={{ fontSize: indicatorFontSize + 'px' }}
            onClick={() => linkPage(currentItem?.moreLink)}
          >
            {indicatorText}
          </View>
        ) : null}
        {currentItem?.moreLink ? (
          <View
            className='indicator-arrow'
            onClick={() => linkPage(currentItem?.moreLink)}
            style={{
              marginRight: 4,
              width: 0,
              height: 0,
              borderTop: '8px solid transparent',
              borderBottom: '8px solid transparent',
              borderLeft: `12px solid ${indicatorColor}`,
              position: 'absolute',
              right: '-22px',
              top: indicatorText ? '40%' : '30%',
              color: indicatorColor
            }}
          />
        ) : null}
      </View>
    )
  }

  // 覆盖层
  const renderOverlay = useMemo(() => {
    if (localData.length === 0) return null
    return (
      <>
        {localData.map((item, index) =>
          item.overlay ? (
            <View
              key={`overlay_${index}`}
              className={classNames('overlay-content_out', {
                'transparent-transition': curIdx !== index,
                'transparent-transition-active': curIdx === index
              })}
              style={styleNames({
                bottom: `${item.overlaybuttom}%;`,
                left: `${item.overlayLeft}%;`,
                width: `${item.overlayWidth}%;`,
                transition: `opacity ${config?.trans || 0}s ease-in-out`
              })}
            >
              <SpImage src={item.overlay} className='over-lay' />
            </View>
          ) : null
        )}
      </>
    )
  }, [config, localData, curIdx])

  // 热区渲染
  const renderHotZones = (item) => {
    if (!item.hotData) return null
    return item.hotData.map((ele, idx) => {
      const styleStr = `width: ${ele.widthPer * 100}%; height: ${ele.heightPer * 100}%; top: ${
        ele.topPer * 100
      }%; left: ${ele.leftPer * 100}%`
      if (needLoginPageType.includes(item.id) || needLoginPage.includes(item.linkPage)) {
        return (
          <SpLogin key={`hotzone_${idx}`} onChange={() => linkPage(ele)}>
            <View className='img-hotzone_zone' style={styleStr} />
          </SpLogin>
        )
      }
      return (
        <View
          key={`hotzone_${idx}`}
          className='img-hotzone_zone'
          style={styleStr}
          onClick={() => linkPage(ele)}
        />
      )
    })
  }

  // 覆盖层热区渲染
  const renderOverlayHotZones = (item, index) => {
    if (!item.overlayHotData) return null
    return item.overlayHotData.map((citem, idx) => {
      const styleStr = `width: ${citem.widthPer * 100}%; height: ${citem.heightPer * 100}%; top: ${
        citem.topPer * 100
      }%; left: ${citem.leftPer * 100}%`
      if (needLoginPageType.includes(item.id) || needLoginPage.includes(item.linkPage)) {
        return (
          <SpLogin key={`overlayhot_${idx}`} onChange={() => linkPage(citem)}>
            <View className='img-hotzone_zone' style={styleStr} />
          </SpLogin>
        )
      }
      return (
        <View
          key={`overlayhot_${idx}`}
          className='img-hotzone_zone'
          style={styleStr}
          onClick={() => linkPage(citem)}
        />
      )
    })
  }

  // 轮播项渲染
  const renderItem = useMemo(() => {
    if (localData.length === 0) return null
    return (
      <>
        {localData.map((item, itemIndex) => (
          <SwiperItem
            key={`slider-swiper_${itemIndex}`}
            className='wgt_full_slider-swiper-item'
            onClick={() => togglePlay(itemIndex)}
          >
            <View className='wgt_full_slider-swiper-item-content'>
              {/* 图片类型需要登录 */}
              {item?.media_type !== 'video' &&
                (needLoginPageType.includes(item.id) || needLoginPage.includes(item.linkPage)) && (
                  <SpLogin
                    onChange={() => {
                      if (!item.pic_type) linkPage(item)
                    }}
                  >
                    <View style={styleNames({ height: '100%' })}>
                      <SpImage src={`${item.imgUrl}?x-oss-process=image/quality,Q_50`} />
                    </View>
                  </SpLogin>
                )}
              {/* 图片类型不需要登录 */}
              {item?.media_type !== 'video' &&
                !needLoginPageType.includes(item.id) &&
                !needLoginPage.includes(item.linkPage) && (
                  <View
                    style={styleNames({ height: '100%' })}
                    onClick={() => {
                      if (!item.pic_type) linkPage(item)
                    }}
                  >
                    <SpImage src={`${item.imgUrl}?x-oss-process=image/quality,Q_50`} />
                  </View>
                )}
              {/* 热区 */}
              {renderHotZones(item)}
              {/* 视频类型 */}
              {item.media_type === 'video' && item.videoUrl && (
                <Video
                  src={item.videoUrl}
                  controls={false}
                  autoplay={item.autoplay}
                  objectFit='cover'
                  showCenterPlayBtn={false}
                  showFullscreenBtn={false}
                  muted={false}
                  id={`swiperVideo_${itemIndex}${index}`}
                  onEnded={(e) => handlePlayEnd(e, item)}
                  onPlay={(e) => handlePlayStart(e, item, itemIndex)}
                  onTimeUpdate={(e) => handleTimeUpdate(e, item, itemIndex)}
                >
                  {!play && !item?.hidenPoster && (
                    <Image className='poster' mode='widthFix' src={item.imgUrl} />
                  )}
                </Video>
              )}
              {/* 覆盖层 */}
              {item.overlay && (
                <View
                  className='overlay-content'
                  style={styleNames({
                    bottom: `${item.overlaybuttom}%;`,
                    left: `${item.overlayLeft}%;`,
                    width: `${item.overlayWidth}%;`,
                    opacity: 1
                  })}
                >
                  <SpImage src={item.overlay} className='over-lay' />
                  {renderOverlayHotZones(item, itemIndex)}
                </View>
              )}
            </View>
          </SwiperItem>
        ))}
      </>
    )
  }, [localData, play, index])

  if (localData.length === 0 || !show) return null

  return (
    <View
      className={classNames('wgt wgt_full_slider', { wgt_padded: base.padded })}
      style={styleNames({
        ...outerStyle,
        height: height,
        minHeight: height
      })}
    >
      <View className='wgt_full_slider-wrap'>
        <Swiper
          className='wgt_full_slider-swiper'
          autoplay={config.autoplay}
          interval={config.interval}
          circular
          vertical
          onChange={changeSwiper}
          cacheExtent={1}
          current={curIdx}
        >
          {renderItem}
          {renderOverlay}
        </Swiper>
        {localData.length > 1 && (
          <View className='wgt_full_slider_indicator'>{setIndicator()}</View>
        )}
      </View>
    </View>
  )
}

WgtFullSlider.options = {
  addGlobalClass: true
}

export default React.memo(WgtFullSlider)
