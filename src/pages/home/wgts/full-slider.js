import React, { useEffect, useCallback, useContext, useMemo } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import { SpImage } from '@/components'
import { View, Image, Video, Swiper, SwiperItem, Text } from '@tarojs/components'
import { classNames, styleNames, linkPage } from '@/utils'
import { cloneDeep } from 'lodash'
import api from '@/api'
import { WgtsContext } from './wgts-context'
import './full-slider.scss'

// const PlayImg = 'https://cdn-image.tjtjshengtu.com/constxcx/play.png'

const $instance = getCurrentInstance()
const initState = {
  curIdx: 0,
  index: 0,
  autoStatus: false,
  viewPortXShow: false,
  play: false,
  localData: [],
  show: false,
  height: 0
}
function WgtFullSlider(porps) {
  const [state, setState] = useImmer(initState)

  const {
    info = null
  } = porps
  const { base = {}, config = {}, data = {} } = info
  const {
    curIdx,
    play,
    localData,
    show,
    height
  } = state
  const { isTab = false, immersive = false, isShowHomeHeader = false } = useContext(WgtsContext)

  useEffect(() => {
    if (info) {
      setLocalData()
      setHeight()
    }
  }, [info])

  useEffect(() => {
    initPlay()
  }, [])

  const currentPages = () => {
    const pages = Taro.getCurrentPages()
    return pages[pages.length - 1].route
  }

  //获取轮播数据
  const setLocalData = async () => {
    if (!info) return
    setState((draft) => {
      draft.localData = cloneDeep(data)
      draft.show = true
    })
  }

  const initPlay = () => {
    if (data.length == 0) return
    const item = data[curIdx]
    if (item.media_type == 'video' && item.autoplay) {
      setState((draft) => {
        draft.play = true
      })
    }
  }

  const togglePlay = (index) => {
    const item = localData[index]
    if (item.media_type == 'video') {
      const pages = Taro.getCurrentPages()
      const {
        config: pageConfig,
        options: { id }
      } = pages[pages.length - 1]
      const videoRef = Taro.createVideoContext(`swiperVideo_${index}${porps.index}`, $instance)
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

  const setHeight = useCallback(async () => {
    const heightS = immersive ? 0 : 89
    const homeHeight = isShowHomeHeader ? 90 : 0
    const tabHeight = isTab ? 64 : 0
    setState((draft) => {
      draft.height = isTab ? `calc(100vh - ${homeHeight}rpx - ${heightS}px - ${tabHeight}px)` : `calc(100vh - ${homeHeight}rpx  - ${heightS}px)`
    })
  }, [config, show])

  // const setLeft = () => {
  //   if (config?.dotleft == 0) {
  //     return { left: '0px' }
  //   } else if (config?.dotleft == 100) {
  //     return { right: '0px' }
  //   } else {
  //     return {
  //       left: config?.dotleft + '%',
  //       transform: `translateX(-${config?.dotleft}%)`
  //     }
  //   }
  // }
  const setdotPosition = () => {
    return { bottom: `${config?.dotbottom || 0}px` }
  }
  const setColor = (item, index) => {
    if (item.isCustomSlider) {
      return {
        background: curIdx == index ? item.dot_cover : item.dot_noCover
      }
    } else {
      return {
        background: curIdx == index ? config.dot_cover : config.dot_noCover
      }
    }
  }
  const setnumbercolor = (item) => {
    if (item?.isCustomSlider) {
      return {
        background: item.dot_noCover,
        color: item.dot_cover,
        ...setdotPosition()
      }
    } else {
      return {
        background: config.dot_noCover,
        color: config.dot_cover,
        ...setdotPosition()
      }
    }
  }
  const setBgColor = (item, index) => {
    if (item.isCustomSlider) {
      return {
        background: curIdx >= index ? item.dot_cover : item.dot_noCover
      }
    } else {
      return {
        background: curIdx >= index ? config.dot_cover : config.dot_noCover
      }
    }
  }
  const setDefaultColor = (item) => {
    if (item.isCustomSlider) {
      return { background: item.dot_noCover }
    } else {
      return { background: config.dot_noCover }
    }
  }

  const changeSwiper = (e) => {
    const index = e.detail.current
    const videoData = localData[index]
    const prevideoData = localData[curIdx]
    if (videoData.media_type == 'video') {
      const videoRef = Taro.createVideoContext(`swiperVideo_${index}${porps.index}`, $instance)
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
    if (prevideoData.media_type == 'video') {
      const prevideoRef = Taro.createVideoContext(`swiperVideo_${curIdx}${porps.index}`, $instance)
      prevideoRef.pause()
      if (prevideoData.interact == 'reset') {
        prevideoRef.seek(0)
      }
    }
    setState((draft) => {
      draft.curIdx = e.detail.current
    })
  }


  const handlePlayEnd = (e, item) => {
    if (!item.loop) {
      setState((draft) => {
        draft.play = false
      })
    }
  }

  const handlePlayStart = (e, item, index) => {
    if (item?.hidenPoster) return
    const _localData = cloneDeep(localData)
    _localData[index].hidenPoster = true
    setState((draft) => {
      draft.localData = _localData
    })
  }

  const handleTimeUpdate = (e, item, index) => {
    const { currentTime } = e.detail
    const _localData = cloneDeep(localData)
    _localData[index].currentTime = currentTime
    setState((draft) => {
      draft.localData = _localData
    })
  }

  const setIndicator = () => {
    if (!config) return
    console.log(porps)
    const { dotbottom, indicatorText, indicatorFontSize, indicatorColor } = config
    return (
      <View
        className={classNames('indicator-item')}
        style={{ color: indicatorColor, bottom: `${dotbottom || 0}px` }}
      >
        <View className='indicator-current' style={{ fontSize: indicatorFontSize + 'px' }}>
          <Text>{Number(curIdx + 1)}</Text>
          <Text> / </Text>
          <Text>{localData.length}</Text>
        </View>
        <View className='indicator-text' style={{ fontSize: indicatorFontSize + 'px' }}>{indicatorText}</View>
      </View>
    )
  }
  const renderOverlay = useMemo(() => {
    if (localData.length == 0) return null
    return (
      <>
        {localData?.map(
          (item, index) =>
            item.overlay && (
              <View
                className={classNames('overlay-content_out', {
                  'transparent-transition': curIdx !== index,
                  'transparent-transition-active': curIdx == index
                })}
                style={styleNames({
                  bottom: `${item.overlaybuttom}%;`,
                  left: `${item.overlayLeft}%;`,
                  width: `${item.overlayWidth}%;`,
                  transition: `opacity ${config?.trans || 0}s ease-in-out`
                })}
              >
                <SpImage src={item.overlay} className={classNames('over-lay')} />
              </View>
            )
        )}
      </>
    )
  }, [config, localData, curIdx])
  const renderItem = useMemo(() => {
    if (localData.length == 0) return null
    return (
      <>
        {localData?.map((item, index) => (
          <SwiperItem
            key={`slider-swiper_${index}`}
            className={classNames('wgt_full_slider-swiper-item', {})}
            onClick={() => {
              togglePlay(index)
            }}
          >
            <View
              // style={styleNames({
              //   marginLeft: `:${imgpadded?.left || 0}px`,
              //   marginRight: `:${imgpadded?.right || 0}px`
              // })}
              className={classNames('wgt_full_slider-swiper-item-content')}
            >
              {item?.media_type != 'video' && (
                <View
                  onClick={() => {
                    if (item.pic_type) return
                    linkPage(item)
                  }}
                  style={styleNames({ height: '100%' })}
                >
                  <SpImage src={`${item.imgUrl}?x-oss-process=image/quality,Q_50`} />
                </View>
              )}
              {item.hotData &&
                item.hotData.length > 0 &&
                item.hotData.map((ele) => (
                  <View
                    key={`${ele}1`}
                    className='img-hotzone_zone'
                    style={`width: ${ele.widthPer * 100}%; height: ${ele.heightPer * 100}%; top: ${
                      ele.topPer * 100
                    }%; left: ${ele.leftPer * 100}%`}
                    onClick={(e) => linkPage(ele)}
                  />
                ))}
              {item.media_type == 'video' && item.videoUrl && (
                <Video
                  src={item.videoUrl}
                  controls={false}
                  autoplay={item.autoplay}
                  // loop={item.loop}
                  objectFit='cover'
                  showCenterPlayBtn={false}
                  showFullscreenBtn={false}
                  muted
                  id={'swiperVideo_' + index + porps.index}
                  onEnded={(e) => handlePlayEnd(e, item)}
                  onPlay={(e) => handlePlayStart(e, item, index)}
                  onTimeUpdate={(e) => handleTimeUpdate(e, item, index)}
                >
                  {!play && !item?.hidenPoster && (
                    <Image className='poster' mode='widthFix' src={item.imgUrl} />
                  )}
                  {/* {!play && <Image className='play-btn' mode='widthFix' src={PlayImg} />} */}
                </Video>
              )}
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
                  <SpImage src={item.overlay} className={classNames('over-lay')} />
                  {item.overlayHotData.map((citem) => (
                    <View
                      key={`${index}1`}
                      className='img-hotzone_zone'
                      style={`width: ${citem.widthPer * 100}%; height: ${
                        citem.heightPer * 100
                      }%; top: ${citem.topPer * 100}%; left: ${citem.leftPer * 100}%`}
                      onClick={(e) => linkPage(citem)}
                    ></View>
                  ))}
                </View>
              )}
            </View>
          </SwiperItem>
        ))}
      </>
    )
  }, [config, localData, play, porps.index])

  if (localData.length === 0 || !show) return null

  return (
    <View
      className={classNames(`wgt wgt_full_slider`, {
        // 'no-cover': !config.dotCover,
        wgt_padded: base.padded
      })}
    >
      <View
        className={classNames('wgt_full_slider-wrap', {})}
        style={styleNames({ height: `${height}` })}
      >
        <Swiper
          className='wgt_full_slider-swiper'
          autoplay={config.autoplay}
          interval={config.interval}
          circular
          vertical
          onChange={(e) => changeSwiper(e)}
          cacheExtent={1}
          current={curIdx}
        >
          {renderOverlay}
          {renderItem}
        </Swiper>

        {localData.length > 1 && (
          <View
            className={classNames('wgt_full_slider_indicator')}
          >
            {setIndicator()}
          </View>
        )}
      </View>
    </View>
  )
}

export default WgtFullSlider
