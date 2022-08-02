import React, { useEffect, useRef, useMemo } from 'react'
import { useSelector } from 'react-redux'
import Taro, { getCurrentInstance, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem, Video } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { AtCountdown } from 'taro-ui'
import {
  SpPrice,
  SpCell,
  SpImage,
  SpLoading,
  SpRecommend,
  SpHtml,
  SpPage,
  SpSkuSelect,
  SpPoster,
  SpLogin,
  SpFloatMenuItem,
  SpChat,
  SpGoodsPrice
} from '@/components'
import api from '@/api'
import req from '@/api/req'
import {
  log,
  calcTimer,
  isArray,
  canvasExp,
  normalizeQuerys,
  isAlipay,
  isWeixin,
  isWeb,
  linkPage,
  pickBy,
  classNames,
  navigateTo,
  VERSION_PLATFORM,
  isAPP
} from '@/utils'

import doc from '@/doc'
import entryLaunch from '@/utils/entryLaunch'
import qs from 'qs'
import S from '@/spx'
import { Tracker } from '@/service'
import { useNavigation, useLogin } from '@/hooks'
import { ACTIVITY_LIST } from '@/consts'
import CompEvaluation from './comps/comp-evaluation'
import CompBuytoolbar from './comps/comp-buytoolbar'
import { WgtFilm, WgtSlider, WgtWriting, WgtGoods, WgtHeading } from '@/pages/home/wgts'

import './espier-detail.scss'

const MSpSkuSelect = React.memo(SpSkuSelect)

const initialState = {
  id: null,
  type: null,
  dtid: null,
  info: null,
  curImgIdx: 0,
  play: false,
  isDefault: false,
  defaultMsg: '',
  mainGoods: {},
  makeUpGoods: [], // 组合商品
  skuPanelOpen: false,
  promotionActivity: [],
  skuText: '',
  // sku选择器类型
  selectType: 'picker',
  evaluationList: [],
  evaluationTotal: 0,
  // 多规格商品选中的规格
  curItem: null,
  recommendList: []
}

function PointShopEspierDetail(props) {
  const $instance = getCurrentInstance()
  const { getUserInfoAuth } = useLogin()
  const pageRef = useRef()
  const { userInfo } = useSelector((state) => state.user)
  const { colorPrimary, openRecommend } = useSelector((state) => state.sys)
  const { setNavigationBarTitle } = useNavigation()

  const [state, setState] = useImmer(initialState)
  const {
    info,
    play,
    isDefault,
    defaultMsg,
    evaluationList,
    curImgIdx,
    skuPanelOpen,
    skuText,
    selectType,
    id,
    type,
    dtid,
    curItem,
    recommendList
  } = state

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    const { path } = $instance.router
    if (id && path === '/subpages/pointshop/espier-detail') {
      fetch()
    }
  }, [userInfo])

  useEffect(() => {
    if (id) {
      fetch()
      getEvaluationList()
    }
  }, [id])

  useEffect(() => {
    let video
    if (isWeixin) {
      video = Taro.createVideoContext('goods-video')
    } else if (isWeb) {
      video = document.getElementById('goods-video')
    }

    if (!video) {
      return
    }

    if (play) {
      setTimeout(() => {
        console.log('video:', video)
        video.play()
      }, 200)
    } else {
      isWeixin ? video.stop() : video.pause()
    }
  }, [play])

  useEffect(() => {
    if (skuPanelOpen) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [skuPanelOpen])

  useShareAppMessage(async () => {
    return getAppShareInfo()
  })

  useShareTimeline(async () => {
    return getAppShareInfo()
  })

  const getAppShareInfo = () => {
    const { itemName, imgs } = info
    const query = {
      id,
      dtid
    }
    if (userInfo) {
      query['uid'] = userInfo.user_id
    }
    const path = `/subpages/pointshop/espier-detail?${qs.stringify(query)}`
    log.debug(`share path: ${path}`)
    return {
      title: itemName,
      imageUrl: imgs.length > 0 ? imgs[0] : [],
      path
    }
  }

  const init = async () => {
    const { type, id, dtid } = await entryLaunch.getRouteParams()
    setState((draft) => {
      draft.id = id
      draft.type = type
      draft.dtid = dtid
    })
  }

  const fetch = async () => {
    let data
    try {
      const itemDetail = await api.pointitem.detail(id, {
        showError: false,
        distributor_id: dtid
      })
      data = pickBy({ ...itemDetail, is_point: true }, doc.goods.GOODS_INFO)
      if (data.approveStatus == 'instock') {
        setState((draft) => {
          draft.isDefault = true
          draft.defaultMsg = '商品已下架'
        })
      }
    } catch (e) {
      setState((draft) => {
        draft.isDefault = true
        draft.defaultMsg = e.res.data.data.message
      })
      console.log(e.res)
    }

    // 是否订阅
    const { user_id: subscribe = false } = await api.user.isSubscribeGoods(id)

    setNavigationBarTitle(data.itemName)

    console.log(ACTIVITY_LIST[data.activityType])
    if (ACTIVITY_LIST[data.activityType]) {
      Taro.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: colorPrimary,
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
    }
    setState((draft) => {
      draft.info = {
        ...data,
        subscribe
      }
      draft.promotionActivity = data.promotionActivity
    })

    if (openRecommend == 1) {
      getRecommendList() // 猜你喜欢
    }
  }

  const getRecommendList = async () => {
    const { list } = await api.cart.likeList({
      page: 1,
      pageSize: 30
    })
    setState((draft) => {
      draft.recommendList = list
    })
  }

  // 获取评论
  const getEvaluationList = async () => {
    const { list, total_count } = await api.item.evaluationList({
      page: 1,
      pageSize: 2,
      item_id: id,
      order_type: 'pointsmall'
    })
    setState((draft) => {
      draft.evaluationList = list
      draft.evaluationTotal = total_count
    })
  }

  const onChangeSwiper = (e) => {
    setState((draft) => {
      draft.curImgIdx = e.detail.current
    })
  }

  const onChangeToolBar = (key) => {
    setState((draft) => {
      draft.skuPanelOpen = true
      draft.selectType = key
    })
  }

  const { windowWidth } = Taro.getSystemInfoSync()

  let sessionFrom = {}
  if (info) {
    sessionFrom['商品'] = info.itemName
    if (userInfo) {
      sessionFrom['昵称'] = userInfo.username
    }
  }

  return (
    <SpPage
      className='page-pointshop-espierdetail'
      scrollToTopBtn
      isDefault={isDefault}
      defaultMsg={defaultMsg}
      ref={pageRef}
      renderFloat={
        <View>
          <SpFloatMenuItem
            onClick={() => {
              Taro.navigateTo({ url: '/subpages/member/index' })
            }}
          >
            <Text className='iconfont icon-huiyuanzhongxin'></Text>
          </SpFloatMenuItem>
          <SpChat sessionFrom={JSON.stringify(sessionFrom)}>
            <SpFloatMenuItem>
              <Text className='iconfont icon-headphones'></Text>
            </SpFloatMenuItem>
          </SpChat>
        </View>
      }
      renderFooter={
        <CompBuytoolbar
          info={info}
          onChange={onChangeToolBar}
          onSubscribe={() => {
            fetch()
          }}
        />
      }
    >
      {!info && <SpLoading />}
      {info && (
        <View className='goods-contents'>
          <View className='goods-pic-container'>
            <Swiper className='goods-swiper' onChange={onChangeSwiper}>
              {info.imgs.map((img, idx) => (
                <SwiperItem key={`swiperitem__${idx}`}>
                  <SpImage
                    mode='aspectFill'
                    src={img}
                    width={windowWidth * 2}
                    height={windowWidth * 2}
                  ></SpImage>
                </SwiperItem>
              ))}
            </Swiper>

            {info.imgs.length > 1 && (
              <View className='swiper-pagegation'>{`${curImgIdx + 1}/${info.imgs.length}`}</View>
            )}

            {info.video && play && (
              <View className='video-container'>
                <Video
                  id='goods-video'
                  className='item-video'
                  src={info.video}
                  showCenterPlayBtn={false}
                />
              </View>
            )}

            {info.video && (
              <View
                className={classNames('btn-video', {
                  playing: play
                })}
                onClick={() => {
                  setState((draft) => {
                    play ? (draft.play = false) : (draft.play = true)
                  })
                }}
              >
                {!play && <SpImage className='play-icon' src='play2.png' width={50} height={50} />}
                {play ? '退出视频' : '播放视频'}
              </View>
            )}
          </View>

          <View className='goods-info'>
            <View className='goods-info-title'>
              <SpGoodsPrice info={curItem ? curItem : info} />
              {info.store_setting && <View className='kc'>库存：{info.store}</View>}
            </View>

            <View className='goods-name-wrap'>
              <View className='goods-name'>
                <View className='title'>{info.itemName}</View>
                <View className='brief'>{info.brief}</View>
              </View>
            </View>
            <View className='item-bn-sales'>
              {/* <View className='item-bn'></View> */}
              {info.salesSetting && (
                <View className='item-sales'>{`销量：${info.sales || 0}`}</View>
              )}
            </View>
          </View>

          {!info.nospec && (
            <View className='sku-block'>
              <SpCell
                title='规格'
                isLink
                onClick={() => {
                  setState((draft) => {
                    draft.skuPanelOpen = true
                    draft.selectType = 'picker'
                  })
                }}
              >
                <Text className='cell-value'>{skuText}</Text>
              </SpCell>
            </View>
          )}

          <View className='goods-params'>
            <View className='params-hd'>商品参数</View>
            <View className='params-bd'>
              {info.itemParams.map((item, index) => (
                <View className='params-item' key={`params-item__${index}`}>
                  <View className='params-label'>{`${item.attribute_name}：`}</View>
                  <View className='params-value'>{item.attribute_value_name}</View>
                </View>
              ))}
            </View>
          </View>

          {/* 商品评价 */}
          <CompEvaluation list={evaluationList} itemId={info.itemId}></CompEvaluation>

          <View className='goods-desc'>
            <View className='desc-hd'>
              <Text className='desc-title'>宝贝详情</Text>
            </View>
            {isArray(info.intro) ? (
              <View>
                {info.intro.map((item, idx) => (
                  <View className='wgt-wrap' key={`wgt-wrap__${idx}`}>
                    {item.name === 'film' && <WgtFilm info={item} />}
                    {item.name === 'slider' && <WgtSlider info={item} />}
                    {item.name === 'writing' && <WgtWriting info={item} />}
                    {item.name === 'heading' && <WgtHeading info={item} />}
                    {item.name === 'goods' && <WgtGoods info={item} />}
                  </View>
                ))}
              </View>
            ) : (
              <SpHtml content={info.intro} />
            )}
          </View>
        </View>
      )}

      <SpRecommend info={recommendList} />

      {/* Sku选择器 */}
      <MSpSkuSelect
        open={skuPanelOpen}
        type={selectType}
        info={info}
        onClose={() => {
          setState((draft) => {
            draft.skuPanelOpen = false
          })
        }}
        onChange={(skuText, curItem) => {
          setState((draft) => {
            draft.skuText = skuText
            draft.curItem = curItem
          })
        }}
      />
    </SpPage>
  )
}

export default PointShopEspierDetail
