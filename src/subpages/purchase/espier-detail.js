/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem, Video } from '@tarojs/components'
import { AtFloatLayout, AtButton } from 'taro-ui'
import { useImmer } from 'use-immer'
import {
  SpCell,
  SpImage,
  SpLoading,
  SpRecommend,
  SpHtml,
  SpPage,
  SpPurchaseEnterpriseBar,
  SpPoster,
  SpGoodsPrice
} from '@/components'
import api from '@/api'
import {
  log,
  isArray,
  isWeixin,
  isWeb,
  pickBy,
  classNames,
  VERSION_PLATFORM,
  isAPP,
  getDistributorId,
  isObjectsValue
} from '@/utils'
import doc from '@/doc'
import entryLaunch from '@/utils/entryLaunch'
import { useNavigation } from '@/hooks'
import { ACTIVITY_LIST } from '@/consts'
import { $t, ti, useTranslation } from '@/i18n'
import { WgtFilm, WgtSlider, WgtImgHotZone } from '@/pages/home/wgts'
import CompActivityBar from './comps/comp-activitybar'
import CompStore from './comps/comp-store'
import CompPackageList from './comps/comp-packagelist'
import CompBuytoolbar from './comps/comp-buytoolbar'
import CompShare from './comps/comp-share'
import CompPromation from './comps/comp-promation'
import CompGroup from './comps/comp-group'
import CompSkuSelect from './comps/comp-skuselect'
import './espier-detail.scss'

const MSpSkuSelect = React.memo(CompSkuSelect)

/** 内购详情：限购件数（与 SKU 区、comp-skuselect 规则一致） */
function resolvePurchaseLimitQty(info, curItem) {
  if (!info) return null
  const {
    activityType,
    activityInfo,
    purlimitByCart,
    purlimitByFastbuy,
    limitNum,
    nospec,
    purchaseLimitNum
  } = info
  if (activityType === 'limited_buy' && activityInfo?.rule?.limit != null) {
    return activityInfo.rule.limit
  }
  if (activityType === 'seckill' || activityType === 'limited_time_sale') {
    if (nospec) return limitNum
    return curItem?.limitNum ?? limitNum
  }
  if (activityType === 'group') return 1
  // 内购等多规格：已选 SKU 有 limit_num 时随 SKU 变化（与秒杀多规格一致）
  if (!nospec && curItem != null) {
    const skuL = curItem.limitNum
    if (skuL != null && skuL !== '') {
      return skuL
    }
  }
  // 内购：优先独立字段，再购物车/立即购限购，再商品 limit_num（用 ?? 避免 0 被当成空）
  const v = purchaseLimitNum ?? purlimitByCart ?? purlimitByFastbuy ?? limitNum
  return v != null && v !== '' ? v : null
}

/**
 * 合并 employeepurchase 原始响应与 GOODS_INFO 映射，避免限购字段未进 pickBy 或键名不一致
 */
function enrichEspierPurchaseDetail(mapped, raw) {
  if (!mapped || !raw) return mapped
  const activityInfo = mapped.activityInfo ?? raw.activity_info ?? raw.activityInfo
  const fee = mapped.fee ?? raw.fee
  const rawItemParams = raw.item_params ?? raw.itemParams
  const itemParams =
    Array.isArray(mapped.itemParams) && mapped.itemParams.length > 0
      ? mapped.itemParams
      : Array.isArray(rawItemParams)
        ? rawItemParams
        : mapped.itemParams
  return {
    ...mapped,
    activityInfo,
    fee,
    itemParams,
    purchaseLimitNum:
      mapped.purchaseLimitNum ?? raw.purchase_limit_num ?? raw.item_purchase_limit_num,
    purlimitByCart: mapped.purlimitByCart ?? raw.purchase_limit_num_by_cart,
    purlimitByFastbuy: mapped.purlimitByFastbuy ?? raw.purchase_limit_num_by_fastbuy,
    limitNum: mapped.limitNum ?? raw.limit_num,
    /** 根级扁平限购金额(分)，接口可能只返回 limit_fee / purchase_limit_fee */
    purchaseAmountLimitFee:
      raw.limit_fee ?? raw.purchase_limit_fee ?? raw.activity_limit_fee ?? raw.item_limit_fee
  }
}

/** 限购金额：多规格时优先当前 SKU 的 limit_fee，否则 activity_info.fee / 根 fee / 扁平（单位分） */
function resolvePurchaseLimitAmountLine(info, curItem) {
  if (!info) return null
  let limitFee
  if (!info.nospec && curItem != null) {
    limitFee = curItem.limitFee ?? curItem.limit_fee
  }
  if (limitFee == null || limitFee === '') {
    limitFee =
      info.activityInfo?.fee?.limit_fee ??
      info.fee?.limit_fee ??
      info.activityInfo?.limit_fee ??
      info.purchaseAmountLimitFee
  }
  if (limitFee == null || limitFee === '') return null
  const n = Number(limitFee) / 100
  if (Number.isNaN(n)) return null
  return ti('47ac6066.b8e9f0', [n.toFixed(2)])
}

/** 子项目 i18n key：8位hex.6位hex，用于兼容 Redux 里误存的 key 串 */
function looksLikeI18nAutoKey(value) {
  if (value == null || typeof value !== 'string') return false
  return /^[0-9a-f]{8}\.[0-9a-f]{6}$/i.test(value.trim())
}

function resolveAddressDisplayPart(value) {
  if (value == null || value === '') return ''
  const s = String(value).trim()
  if (looksLikeI18nAutoKey(s)) return $t(s)
  return s
}

/** 详情卡片「配送地址」一行展示 */
function formatEspierDetailAddressLine(addr) {
  if (!addr || !isObjectsValue(addr)) return ''
  const { county, city, province, area, adrdetail } = addr
  const rawRegion = county || city || province || area || ''
  const region = resolveAddressDisplayPart(rawRegion)
  const tail = resolveAddressDisplayPart(adrdetail)
  return [region, tail].filter(Boolean).join(' ').trim()
}

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
  makeUpGoods: [],
  packageOpen: false,
  skuPanelOpen: false,
  promotionOpen: false,
  promotionActivity: [],
  sharePanelOpen: false,
  posterModalOpen: false,
  skuText: '',
  selectType: 'picker',
  curItem: null,
  recommendList: [],
  activityId: '',
  enterpriseId: '',
  isParameter: false
}

function EspierDetail(props) {
  const { i18n } = useTranslation()
  const pageRef = useRef()
  const { userInfo, address } = useSelector((state) => state.user)
  const { colorPrimary, openRecommend } = useSelector((state) => state.sys)
  const { purchase_share_info = {}, curDistributorId, curEnterpriseId } = useSelector(
    (state) => state.purchase
  )
  const { setNavigationBarTitle } = useNavigation()

  const [enterpriseName, setEnterpriseName] = useState('')
  const [state, setState] = useImmer(initialState)
  const {
    info,
    play,
    isDefault,
    defaultMsg,
    curImgIdx,
    // promotionPackage,
    packageOpen,
    skuPanelOpen,
    promotionOpen,
    promotionActivity,
    sharePanelOpen,
    posterModalOpen,
    mainGoods,
    makeUpGoods,
    skuText,
    selectType,
    id,
    type,
    dtid,
    curItem,
    recommendList,
    activityId,
    enterpriseId,
    isParameter
  } = state

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    const eid = curEnterpriseId || enterpriseId || purchase_share_info?.enterprise_id
    if (!eid) {
      setEnterpriseName('')
      return
    }
    const loadEnterpriseName = async () => {
      try {
        const data = await api.purchase.getUserEnterprises({
          disabled: 0,
          distributor_id: getDistributorId()
        })
        const found = data?.find((x) => x.enterprise_id == eid)
        setEnterpriseName(found?.name || found?.enterprise_name || '')
      } catch (e) {
        setEnterpriseName('')
      }
    }
    loadEnterpriseName()
  }, [curEnterpriseId, enterpriseId, purchase_share_info?.enterprise_id])

  useEffect(() => {
    if (id) {
      fetch()
    }
  }, [userInfo])

  useEffect(() => {
    if (id) {
      fetch()
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
        video.play()
      }, 200)
    } else {
      isWeixin ? video.stop() : video.pause()
    }
  }, [play])

  useEffect(() => {
    if (packageOpen || skuPanelOpen || sharePanelOpen || posterModalOpen || promotionOpen) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [packageOpen, skuPanelOpen, sharePanelOpen, posterModalOpen, promotionOpen])

  const init = async () => {
    const { type, id, dtid, activity_id, enterprise_id } = await entryLaunch.getRouteParams()
    setState((draft) => {
      draft.id = id
      draft.type = type
      draft.dtid = curDistributorId ?? getDistributorId()
      draft.activityId = activity_id
      draft.enterpriseId = enterprise_id
    })
  }

  const fetch = async () => {
    let { activity_id, enterprise_id } = purchase_share_info

    if (activityId && enterpriseId) {
      activity_id = activityId
      enterprise_id = enterpriseId
    }

    let data
    let itemDetail
    if (type == 'pointitem') {
    } else {
      try {
        itemDetail = await api.purchase.getPurchaseDetail(id, {
          showError: false,
          activity_id,
          enterprise_id
        })
        data = enrichEspierPurchaseDetail(pickBy(itemDetail, doc.goods.GOODS_INFO), itemDetail)
        if (data.approveStatus == 'instock') {
          setState((draft) => {
            draft.isDefault = true
            draft.defaultMsg = $t('a8427e1f.1b81ee')
          })
        }
      } catch (e) {
        setState((draft) => {
          draft.isDefault = true
          draft.defaultMsg = e.res?.data?.data?.message
        })
        return
      }
    }

    if (!data) {
      return
    }

    const { user_id: subscribe = false } = await api.user.isSubscribeGoods(id, {
      distributor_id: dtid
    })

    setNavigationBarTitle(data.itemName)

    if (ACTIVITY_LIST()[data.activityType]) {
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

    if (isAPP() && userInfo) {
      try {
        Taro.SAPPShare.init({
          title: data.itemName,
          content: data.brief,
          pic: `${data.img}?time=${new Date().getTime()}`,
          link: `${process.env.APP_CUSTOM_SERVER}/subpages/purchase/espier-detail?id=${data.itemId}&dtid=${data.distributorId}&company_id=${data.companyId}`,
          path: `/subpages/purchase/espier-detail?company_id=${data.company_id}&id=${data.v}&dtid=${data.distributor_id}&uid=${userInfo.user_id}`,
          price: data.price,
          weibo: false,
          miniApp: true
        })
        log.debug('app share init success...')
      } catch (e) {
        console.error(e)
      }
    }

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

  const handleChooseDeliveryAddress = () => {
    Taro.navigateTo({
      url: '/marketing/pages/member/address?isPicker=choose'
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

  const purchaseLimitQty = useMemo(
    () => (info ? resolvePurchaseLimitQty(info, curItem) : null),
    [info, curItem]
  )
  const purchaseLimitAmountLine = useMemo(
    () => (info ? resolvePurchaseLimitAmountLine(info, curItem) : null),
    [info, curItem, i18n.language]
  )
  const showPurchaseLimits = purchaseLimitQty != null || !!purchaseLimitAmountLine
  const deliveryAddressLine = formatEspierDetailAddressLine(address)

  const displayItemParams = useMemo(() => {
    if (!info || !Array.isArray(info.itemParams)) return []
    return info.itemParams.filter((item) => {
      const v = item?.attribute_value_name
      if (v == null || v === '') return false
      return typeof v === 'string' ? v.trim() !== '' : String(v).trim() !== ''
    })
  }, [info, info?.itemParams])

  const handleGoodsParamsFlatClose = () => {
    setState((draft) => {
      draft.isParameter = !draft.isParameter
    })
  }

  return (
    <SpPage
      className='page-item-purchase-espierdetail'
      scrollToTopBtn
      isDefault={isDefault}
      defaultMsg={defaultMsg}
      ref={pageRef}
      footerHeight={160}
      renderFooter={
        <CompBuytoolbar
          curItem={curItem}
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
        <View className='goods-contents espier-detail-main'>
          <SpPurchaseEnterpriseBar
            name={enterpriseName}
            showMore={false}
            showSearch={false}
            rightExtra={
              <View className='espier-detail-enterprise-policy'>
                <Text className='iconfont icon-info espier-detail-enterprise-policy__icon' />
                <Text className='espier-detail-enterprise-policy__text'>
                  {$t('e32a7439.d4e8f1')}
                </Text>
              </View>
            }
          />
          <View className='goods-pic-container'>
            <Swiper
              className='goods-swiper'
              // current={curImgIdx}
              onChange={onChangeSwiper}
            >
              {info.imgs.map((img, idx) => (
                <SwiperItem key={`swiperitem__${idx}`}>
                  <SpImage
                    mode='aspectFit'
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
                {play ? $t('a8427e1f.85f859') : $t('a8427e1f.c27cf5')}
              </View>
            )}
          </View>

          {/* 拼团、秒杀、限时特惠显示活动价 */}
          {ACTIVITY_LIST()[info.activityType] && (
            <CompActivityBar
              info={{
                ...info.activityInfo,
                priceObj: curItem ? curItem : info
              }}
              type={info.activityType}
              onTimeUp={() => {
                fetch()
              }}
            >
              <SpGoodsPrice isPurchase info={curItem ? curItem : info} />
            </CompActivityBar>
          )}

          <View className='espier-detail-hero-info'>
            <View className='goods-name-wrap'>
              <View className='goods-name'>
                <View className='title'>{info.itemName}</View>
                {!!info.brief && <View className='brief'>{info.brief}</View>}
              </View>
            </View>
            {showPurchaseLimits && (
              <View className='espier-detail-purchase-limits'>
                {purchaseLimitQty != null && (
                  <View className='espier-detail-purchase-limits__col'>
                    <Text className='espier-detail-purchase-limits__line'>
                      <Text className='espier-detail-purchase-limits__label'>限购数量：</Text>
                      <Text className='espier-detail-purchase-limits__value'>
                        限购 {purchaseLimitQty} 件
                      </Text>
                    </Text>
                  </View>
                )}
                {purchaseLimitAmountLine && (
                  <View className='espier-detail-purchase-limits__col'>
                    <Text className='espier-detail-purchase-limits__line'>
                      <Text className='espier-detail-purchase-limits__label'>限购金额：</Text>
                      <Text className='espier-detail-purchase-limits__value'>
                        {purchaseLimitAmountLine}
                      </Text>
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* 灰底上的独立圆角白卡片：仅规格 + 配送 */}
          <View className='espier-detail-spec-wrap'>
            <View className='espier-detail-spec-sheet'>
              {!info.nospec && (
                <View className='sku-block espier-detail-spec-sheet__cell'>
                  <SpCell
                    className='espier-detail-spec-sheet__cell-inner'
                    title='选择规格：'
                    isLink
                    onClick={() => {
                      setState((draft) => {
                        draft.skuPanelOpen = true
                        draft.selectType = 'picker'
                      })
                    }}
                  >
                    <Text className='cell-value espier-detail-spec-sheet__value-text'>
                      {skuText || '请选择'}
                    </Text>
                  </SpCell>
                </View>
              )}

              <View className='sku-block espier-detail-spec-sheet__cell'>
                <SpCell
                  className='espier-detail-spec-sheet__cell-inner'
                  title='配送地址：'
                  isLink
                  onClick={handleChooseDeliveryAddress}
                >
                  <Text className='cell-value espier-detail-spec-sheet__value-text'>
                    {deliveryAddressLine || '请选择'}
                  </Text>
                </SpCell>
              </View>
            </View>
          </View>

          {displayItemParams.length > 0 && (
            <View className='goods-params-flat'>
              <View className='parameter'>参数</View>
              <View className='parameter-content'>
                {displayItemParams.map((item, index) => (
                  <View className='parameter-item' key={`goods-params-flat__${index}`}>
                    <View className='attribute'>{item.attribute_value_name}</View>
                    <View className='configuration'>{item.attribute_name}</View>
                  </View>
                ))}
              </View>
              <Text className='iconfont icon-arrowRight' onClick={handleGoodsParamsFlatClose} />
            </View>
          )}

          {promotionActivity.length > 0 && (
            <View className='espier-detail-promo-card'>
              <SpCell
                className='espier-detail-spec-sheet__cell-inner'
                title='优惠活动：'
                isLink
                onClick={() => {
                  setState((draft) => {
                    draft.promotionOpen = true
                  })
                }}
              >
                {promotionActivity.map((item, index) => (
                  <View className='promotion-tag' key={`promotion-tag__${index}`}>
                    {item.promotionTag}
                  </View>
                ))}
              </SpCell>
            </View>
          )}

          <CompGroup info={info} />

          {/* 店铺 */}
          {VERSION_PLATFORM && <CompStore info={info.distributorInfo} />}

          <View className='goods-desc'>
            {isArray(info.intro) ? (
              <View>
                {info.intro.map((item, idx) => (
                  <View className='wgt-wrap' key={`wgt-wrap__${idx}`}>
                    {item.name === 'film' && <WgtFilm info={item} />}
                    {item.name === 'slider' && <WgtSlider info={item} />}
                    {item.name === 'imgHotzone' && <WgtImgHotZone info={item} />}
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

      {/* 组合优惠 */}
      <CompPackageList
        open={packageOpen}
        onClose={() => {
          setState((draft) => {
            draft.packageOpen = false
          })
        }}
        info={{
          mainGoods,
          makeUpGoods
        }}
      />

      {/* 促销优惠活动 */}
      <CompPromation
        open={promotionOpen}
        info={promotionActivity}
        onClose={() => {
          setState((draft) => {
            draft.promotionOpen = false
          })
        }}
      />

      {/* Sku选择器 */}
      <MSpSkuSelect
        open={skuPanelOpen}
        type={selectType}
        info={info}
        selectedItem={curItem}
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

      {/* 分享 */}
      <CompShare
        open={sharePanelOpen}
        onClose={() => {
          setState((draft) => {
            draft.sharePanelOpen = false
          })
        }}
        onCreatePoster={() => {
          setState((draft) => {
            draft.sharePanelOpen = false
            draft.posterModalOpen = true
          })
        }}
        onShareEdit={() => {
          const { itemId, companyId, distributorId } = info
          Taro.navigateTo({
            url: `/subpage/pages/editShare/index?id=${itemId}&dtid=${distributorId}&company_id=${companyId}`
          })
        }}
      />

      {/* 海报 */}
      {posterModalOpen && (
        <SpPoster
          info={info}
          type='goodsDetial'
          onClose={() => {
            setState((draft) => {
              draft.posterModalOpen = false
            })
          }}
        />
      )}

      {info && displayItemParams.length > 0 && (
        <AtFloatLayout
          isOpened={isParameter}
          title='商品参数'
          onClose={handleGoodsParamsFlatClose}
        >
          <View className='product-parameter'>
            <View className='product-parameter-all'>
              {displayItemParams.map((item, index) => (
                <View className='product-parameter-item' key={`product-parameter-item__${index}`}>
                  <Text className='title'>{item.attribute_name}</Text>
                  <Text className='content'>{item.attribute_value_name}</Text>
                </View>
              ))}
            </View>
            <AtButton type='primary' circle onClick={handleGoodsParamsFlatClose}>
              确认
            </AtButton>
          </View>
        </AtFloatLayout>
      )}
    </SpPage>
  )
}

export default EspierDetail
