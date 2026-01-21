/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useMemo } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Swiper, SwiperItem, Video, Image } from '@tarojs/components'
import { SpImage, SpLogin } from '@/components'
import { useImmer } from 'use-immer'
import { classNames, styleNames, linkPage } from '@/utils'
import { needLoginPageType, needLoginPage } from '@/consts'
import { getBaseOuterStyle } from '../helper'
import './index.scss'

const $instance = getCurrentInstance()

const initialState = {
  currentDot: 0,
  curIdx: 0,
  play: false
}

const Slider = (props) => {
  const { info } = props
  const [state, setState] = useImmer(initialState)
  const { currentDot, curIdx, play } = state

  // 从 params 中获取配置和数据，兼容两种数据结构
  // 1. 新结构：info.params.config, info.params.data, info.params.base
  // 2. 旧结构：info.config, info.data, info.base
  const params = info?.params || info || {}
  const base = params.base || {}
  const config = params.config || {}
  const data = params.data || []

  // 获取外层样式（包含 outerMargin）
  const outerStyle = useMemo(() => {
    return getBaseOuterStyle(base)
  }, [base])

  useEffect(() => {
    // 初始化时，如果有视频且设置了自动播放，则播放
    if (data.length > 0 && data[curIdx]?.media_type === 'video' && data[curIdx]?.autoplay) {
      setState((draft) => {
        draft.play = true
      })
    }
  }, [])

  if (!info || !data || data.length === 0) {
    return null
  }

  // 处理点击事件
  const handleClickItem = (item) => {
    linkPage(item)
  }

  // 轮播切换事件
  const dotChange = (e) => {
    const { current } = e.detail
    setState((draft) => {
      draft.currentDot = current
    })
  }

  const swiperChange = (e) => {
    const { current } = e.detail
    const prevIdx = curIdx

    // 先暂停上一个视频
    if (data[prevIdx]?.media_type === 'video') {
      setTimeout(() => {
        const prevVideoRef = Taro.createVideoContext(`sliderVideo_${prevIdx}`, $instance)
        prevVideoRef?.pause()
        if (data[prevIdx]?.interact === 'reset') {
          prevVideoRef?.seek(0)
        }
      }, 100)
    }

    setState((draft) => {
      draft.curIdx = current
    })

    // 处理新视频播放
    if (data[current]?.media_type === 'video') {
      setTimeout(() => {
        const videoRef = Taro.createVideoContext(`sliderVideo_${current}`, $instance)
        if (data[current]?.autoplay) {
          videoRef?.play()
          setState((draft) => {
            draft.play = true
          })
        } else {
          setState((draft) => {
            draft.play = false
          })
        }
      }, 100)
    } else {
      setState((draft) => {
        draft.play = false
      })
    }
  }

  // 切换视频播放状态
  const togglePlay = (index) => {
    const item = data[index]
    if (item?.media_type === 'video') {
      const videoRef = Taro.createVideoContext(`sliderVideo_${index}`, $instance)
      if (play) {
        videoRef?.pause()
        setState((draft) => {
          draft.play = false
        })
      } else {
        videoRef?.play()
        setState((draft) => {
          draft.play = true
        })
      }
    }
  }

  // 渲染热区
  const renderHotZones = (item) => {
    if (!item.hotData || !Array.isArray(item.hotData) || item.hotData.length === 0) {
      return null
    }
    return item.hotData.map((ele, idx) => {
      const styleStr = `width: ${ele.widthPer * 100}%; height: ${ele.heightPer * 100}%; top: ${
        ele.topPer * 100
      }%; left: ${ele.leftPer * 100}%`
      const needLogin = needLoginPageType.includes(ele.id) || needLoginPage.includes(ele.linkPage)
      if (needLogin) {
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

  // 渲染覆盖层热区
  const renderOverlayHotZones = (item) => {
    if (
      !item.overlayHotData ||
      !Array.isArray(item.overlayHotData) ||
      item.overlayHotData.length === 0
    ) {
      return null
    }
    return item.overlayHotData.map((ele, idx) => {
      const styleStr = `width: ${ele.widthPer * 100}%; height: ${ele.heightPer * 100}%; top: ${
        ele.topPer * 100
      }%; left: ${ele.leftPer * 100}%`
      const needLogin = needLoginPageType.includes(ele.id) || needLoginPage.includes(ele.linkPage)
      if (needLogin) {
        return (
          <SpLogin key={`overlayhot_${idx}`} onChange={() => linkPage(ele)}>
            <View className='img-hotzone_zone' style={styleStr} />
          </SpLogin>
        )
      }
      return (
        <View
          key={`overlayhot_${idx}`}
          className='img-hotzone_zone'
          style={styleStr}
          onClick={() => linkPage(ele)}
        />
      )
    })
  }

  // 渲染轮播项
  const renderItems = useMemo(() => {
    return data.map((item, idx) => {
      const needLoginItem =
        needLoginPageType.includes(item.id) || needLoginPage.includes(item.linkPage)

      return (
        <SwiperItem key={`slider-item__${idx}`} className='slider-item'>
          <View
            className={classNames('wrapper-img', {
              rounded: config.rounded
            })}
            onClick={() => {
              if (item.media_type !== 'video') {
                handleClickItem(item)
              } else {
                togglePlay(idx)
              }
            }}
          >
            {/* 图片类型 */}
            {item.media_type === 'img' && item.imgUrl && (
              <>
                {needLoginItem ? (
                  <SpLogin onChange={() => handleClickItem(item)}>
                    <SpImage src={item.imgUrl} className='slider-item__img' lazyLoad />
                  </SpLogin>
                ) : (
                  <SpImage src={item.imgUrl} className='slider-item__img' lazyLoad />
                )}
                {/* 热区 */}
                {renderHotZones(item)}
              </>
            )}

            {/* 视频类型 */}
            {item.media_type === 'video' && item.videoUrl && (
              <>
                <Video
                  src={item.videoUrl}
                  controls={false}
                  autoplay={item.autoplay}
                  objectFit='cover'
                  showCenterPlayBtn={false}
                  showFullscreenBtn={false}
                  muted={false}
                  id={`sliderVideo_${idx}`}
                  className='slider-video'
                >
                  {!play && item.imgUrl && (
                    <Image className='poster' mode='widthFix' src={item.imgUrl} />
                  )}
                </Video>
                {/* 热区 */}
                {renderHotZones(item)}
              </>
            )}

            {/* 覆盖层 */}
            {item.overlay && (
              <View
                className={classNames('overlay-content', {
                  'overlay-visible': curIdx === idx,
                  'overlay-hidden': curIdx !== idx
                })}
                style={styleNames({
                  bottom: `${item.overlaybuttom || 0}%`,
                  left: `${item.overlayLeft || 0}%`,
                  width: `${item.overlayWidth || 100}%`
                })}
              >
                <SpImage src={item.overlay} className='over-lay' />
                {/* 覆盖层热区 */}
                {renderOverlayHotZones(item)}
              </View>
            )}
          </View>
        </SwiperItem>
      )
    })
  }, [data, curIdx, play, config.rounded])

  return (
    <View
      className={classNames('wgt wgt-slider', {
        'wgt__padded': base.padded
      })}
      style={styleNames(outerStyle)}
    >
      {base.title && (
        <View className='wgt-head'>
          <View className='wgt-hd'>
            <View className='wgt-title'>{base.title}</View>
            {base.subtitle && <View className='wgt-subtitle'>{base.subtitle}</View>}
          </View>
        </View>
      )}

      {config && (
        <View
          className={classNames('slider-swiper-wrap', {
            padded: config.padded
          })}
        >
          {data[0] && (
            <SpImage
              className={classNames('placeholder-img', {
                rounded: config.rounded
              })}
              src={data[0].imgUrl || data[0].videoUrl}
            />
          )}
          <Swiper
            className='slider-img'
            circular
            autoplay={config.autoplay !== false}
            current={curIdx}
            interval={config.interval || 3000}
            duration={300}
            onChange={dotChange}
            onAnimationFinish={swiperChange}
          >
            {renderItems}
          </Swiper>
        </View>
      )}

      {data.length > 1 && (
        <View
          className={classNames(
            'slider-pagination',
            config.dotLocation || 'center',
            config.shape || 'circle',
            config.dotColor || 'dark',
            {
              cover: !config.dotCover
            }
          )}
        >
          {config.dot !== false &&
            data.map((dot, dotIdx) => (
              <View
                className={classNames('dot-item', { active: currentDot === dotIdx })}
                key={`dot-item__${dotIdx}`}
              ></View>
            ))}

          {config.dot === false && (
            <View className='pagination-count'>
              {currentDot + 1}/{data.length}
            </View>
          )}
        </View>
      )}
    </View>
  )
}

Slider.options = {
  addGlobalClass: true
}

export default React.memo(Slider)
