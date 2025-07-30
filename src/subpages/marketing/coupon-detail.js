import React, { useState, useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpImage, SpPoster, SpPage, SpLoading, SpLogin, SpHtml } from '@/components'
import SpShare from '@/components/sp-share'
import doc from '@/doc'
import api from '@/api'
import { pickBy, formatTime, entryLaunch } from '@/utils'
import { useModal } from '@/hooks'
import './coupon-detail.scss'

const initialState = {
  sharePanelOpen: false,
  posterModalOpen: false,
  posterIsReady: false,
  info: {},
  pageLoading: false
}
const $instance = getCurrentInstance()

const SpCouponDetail = (props) => {
  const [isValid, setIsValid] = useState(false)
  const [type, setType] = useState(2)
  const [qrcode, setQrcode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const posterRef = useRef()
  const { showModal, closeModal } = useModal()
  const [state, setState] = useImmer(initialState)
  const { info, sharePanelOpen, posterModalOpen, posterIsReady } = state

  const { params } = $instance?.router || {}
  const init = async () => {
    const {
      type: routeType,
      card_id,
      cardSource,
      couponSn,
      c,
      t
    } = await entryLaunch.getRouteParams()
    setType(routeType)
    setState((draft) => {
      draft.pageLoading = true
    })
    if (t) {
      setType(t)
    }
    if (routeType == 1 || t == 1) {
      let cardId = card_id || c
      const data = await api.member.getCouponDetail(cardId)
      const { couponStatus } = pickBy(data, doc.coupon.COUPON_STATUS)
      setState((draft) => {
        draft.info = {
          ...data,
          couponStatus
        }
        draft.pageLoading = false
      })
      return
    }

    if (cardSource == 'ecshopx') {
      const data = await api.member.getCardDetail({ card_id, code: couponSn })
      const detail = pickBy(data, doc.coupon.COUPON_DETAIL)
      console.log('detail', detail)
      setState((draft) => {
        draft.info = detail
        draft.pageLoading = false
      })
      if (detail.use_scenes !== 'online') {
        refreshCode(detail.qr_code)
      }
      return
    }

    if (couponSn) {
      const mob_data = await api.member.getMobCouponDetail({ couponSn })
      setState((draft) => {
        draft.info = mob_data
        draft.pageLoading = false
      })
      if (mob_data.use_scenes !== 'online') {
        refreshCode(mob_data.qr_code)
      }
    }
  }
  // 模拟获取优惠券详情数据
  useEffect(() => {
    init()
  }, [])

  const refreshCode = async (qr_code) => {
    //更新qrcode
    const { qr_code_img } = await api.member.getCouponQrcode({ qr_code })
    setQrcode(qr_code_img)
  }

  // 领取优惠券
  const handleReceiveCoupon = async () => {
    if (info?.couponStatus?.type !== 1) {
      return
    }
    setIsLoading(true)
    const { status } = await api.member.homeCouponGet({
      card_id: info.card_id
    })
    console.log('status', status)
    if (!status) {
      setIsLoading(false)
      return
    }
    if (status.get_limit != 0 && status.user_get_num >= status.get_limit) {
      setIsValid(true)
    }
    setIsLoading(false)
    const modal = await showModal({
      title: '领取成功',
      showClose: true,
      content: <View className='content-center'>优惠券已经发放至您的券包</View>,
      renderFooter: (
        <View className='modal-footer coupon-modal-footer'>
          <AtButton
            type='primary'
            className='coupon-modal-footer-btn'
            onClick={async () => {
              await closeModal()
              handleUseCoupon()
            }}
          >
            去使用
          </AtButton>
        </View>
      )
    })
  }

  // 分享优惠券
  const handleShare = () => {
    // 微信小程序分享功能
    setState((draft) => {
      draft.sharePanelOpen = true
    })
  }
  const goList = () => {
    const { channel_id, source } = params || {}
    Taro.navigateTo({
      url: info.use_all_items
        ? `/pages/index`
        : `/pages/item/list?card_id=${info.card_id || info.id
        }&channel_id=${channel_id}&source=${source}`
    })
  }

  const handleUseCoupon = async () => {
    console.log('info', info)
    // const { channel_id, source } = params || {}
    const {
      type: routeType,
      cardSource,
      t,
      channel_id,
      source,
      shop_code
    } = await entryLaunch.getRouteParams()
    if (routeType == 1 || t == 1 || cardSource == 'ecshopx') {
      if (info.use_scenes == 'online' || info.use_scenes == 'common') {
        Taro.redirectTo({
          url: info.use_all_items
            ? `/pages/index`
            : `/pages/item/list?card_id=${info.card_id || info.id
            }&channel_id=${channel_id}&source=${source}`
        })
        return
      }
    } else {
      if (!shop_code) {
        Taro.reLaunch({ url: '/pages/index' })
      } else {
        Taro.navigateTo({
          url: `/pages/item/list?shop_code=${shop_code || ''}`
        })
      }
    }
  }
  console.log('state.info', info)
  return (
    <SpPage showLive>
      {state.pageLoading && <SpLoading />}
      {!state.pageLoading && (
        <View className='sp-coupon-detail'>
          <View className='sp-coupon-detail__header'>
            <SpImage
              className='sp-coupon-detai__header-image'
              src={info.cover_pic}
              mode='aspectFill'
              width={160}
              height={160}
              circle={8}
            />
            <View className='sp-coupon-detail__header-info'>
              <View className='sp-coupon-detail__header-title'>{info.title}</View>
              <View className='sp-coupon-detail__header-tags'>
                {info.card_type && (
                  <Text className='sp-coupon-detail__header-tag red'>
                    {info.card_type_name || info.card_type}
                  </Text>
                )}
                {info.use_scenes && (
                  <View className='sp-coupon-detail__header-tag'>
                    {info.use_scenes === 'online'
                      ? '线上商城专享'
                      : info.use_scenes === 'common'
                        ? '通用券'
                        : '线下专享'}
                  </View>
                )}
              </View>
              {type == 2 && (
                <View className='sp-coupon-detail__header-time'>{info.valid_date}</View>
              )}
            </View>
          </View>
          {['shopSalerOrder', 'onSiteSale'].includes(info.use_scenes)&& (
                <View className='sp-coupon-detail__sale-tips'>
                  <SpImage src='fv_sale-tips.png' width={40} height={40} />
                  在线开单付款时可直接使用此券
                </View>
              )}
          {!['online'].includes(info.use_scenes) && qrcode && type == 2 && (
            <View className='sp-coupon-detail__code'>
              <View className='sp-coupon-detail__code-text1'>线下使用时向商户出示此码</View>
              <SpImage
                className='sp-coupon-detai__code-image'
                src={qrcode}
                key={qrcode}
                width={338}
                height={338}
              />
              <View className='sp-coupon-detail__code-text2'>券号 {info.couponSn}</View>
              <View className='sp-coupon-detail__code-text3'>温馨提示：如商户无法识别二维码</View>
              <View
                className='sp-coupon-detail__code-text4'
                onClick={() => refreshCode(info.qr_code)}
              >
                <Text className='iconfont icon-a-iconautorenew'></Text>
                <Text>您可以尝试刷新重试</Text>
              </View>
            </View>
          )}

          <View className='sp-coupon-detail__card'>
            <View className='sp-coupon-detail__info-section'>
              {type == 1 && (
                <>
                  <View className='sp-coupon-detail__info-item view-flex view-flex-justify view-flex-middle'>
                    <View>
                      <View className='sp-coupon-detail__info-label'>领取时间</View>
                      <Text className='sp-coupon-detail__info-value'>
                        {formatTime(info.send_begin_time * 1000, 'YYYY-MM-DD HH:mm')}
                        <Text className='m-l-2 m-r-2'> - </Text>
                        {formatTime(info.send_end_time * 1000, 'YYYY-MM-DD HH:mm')}
                      </Text>
                    </View>
                    {info.is_shareable == '1' && (
                      <View className='sp-coupon-detail__share' onClick={handleShare}>
                        <View className='iconfont icon-a-iconreply'></View>
                        <View className='sp-coupon-detail__share-text'>分享</View>
                      </View>
                    )}
                  </View>

                  <View className='sp-coupon-detail__info-item'>
                    <Text className='sp-coupon-detail__info-label'>使用有效期</Text>
                    <Text className='sp-coupon-detail__info-value'>{info.valid_date}</Text>
                  </View>

                  <View className='sp-coupon-detail__info-item'>
                    <Text className='sp-coupon-detail__info-label'>优惠券介绍</Text>
                    <Text className='sp-coupon-detail__info-value'>{info.intro}</Text>
                  </View>
                </>
              )}
              {
                (info.description || info.useCondition) && (
                  <View className='sp-coupon-detail__info-item'>
                    <Text className='sp-coupon-detail__info-label'>使用说明</Text>
                    {/* <RichText
                      className='sp-coupon-detail__info-value'
                      nodes={info.description}
                    ></RichText> */}
                    <SpHtml content={info.description || info.useCondition} />
                  </View>
                )
              }{
                info.card_source == 'mob' ? (
                  <View className='sp-coupon-detail__info-item'>
                    <Text className='sp-coupon-detail__info-label'>适用范围</Text>
                    <View className='sp-coupon-detail__info-value f500'>
                      {info.useShopNameLimit ?
                        <>
                          <Text>仅限指定店铺可用</Text>
                          <View className='sp-coupon-detail__stores mt-18'>
                            {info.useShopNameLimit.split(',')?.map((store, index) => (
                              <View key={index} className='sp-coupon-detail__store-item'>
                                {store}
                              </View>
                            ))}
                          </View>
                        </> : <>{info.shopInfo ? <View className='sp-coupon-detail__stores'>
                          <View className='sp-coupon-detail__store-item'>
                            {info.shopInfo?.name}
                          </View>
                        </View> : <View className='sp-coupon-detail__info-value f500'>
                          <Text>详见使用说明</Text>
                        </View>}</>}
                    </View>
                    {/* {info.shopInfo ? (
                      <View className='sp-coupon-detail__info-value f500'>
                        {!info.use_all_items ? (<>
                          <Text>仅限指定店铺可用</Text>
                          <View className='sp-coupon-detail__stores'>
                            {info.useShopNameLimit.split(',')?.map((store, index) => (
                              <View key={index} className='sp-coupon-detail__store-item'>
                                {store}
                              </View>
                            ))}
                          </View></>) : <View className='sp-coupon-detail__stores'>
                          <View className='sp-coupon-detail__store-item'>
                            {info.shopInfo?.name}
                          </View>
                        </View>}
                      </View>
                    ) : <View className='sp-coupon-detail__info-value f500'>
                      <Text>详见使用说明</Text>
                    </View>} */}
                  </View>
                ) :
                  info.use_bound && (
                    <View className='sp-coupon-detail__info-item'>
                      <Text className='sp-coupon-detail__info-label'>适用范围</Text>
                      {info.use_bound == 6 && (
                        <View className='sp-coupon-detail__info-value f500'>
                          <Text>仅限指定店铺可用</Text>
                          <View className='sp-coupon-detail__stores mt-18'>
                            {info.useShopNameLimit.split(',')?.map((store, index) => (
                              <View key={index} className='sp-coupon-detail__store-item'>
                                {store}
                              </View>
                            ))}
                          </View>
                        </View>
                      )}
                      {(info.use_bound == 1 || info.use_bound == 2) && (
                        <View className='sp-coupon-detail__info-value available-product f500'>
                          <Text>仅限指定商品可用</Text>
                          <View className='sp-coupon-detail__available-product' onClick={goList}>
                            <View>查看可用商品</View>
                            <View className='iconfont icon-arrowRight'></View>
                          </View>
                        </View>
                      )}

                      {(info.use_bound == '0' || !info.use_bound) && (
                        <View className='sp-coupon-detail__info-value f500'>
                          <Text>详见使用说明</Text>
                        </View>
                      )}
                    </View>
                  )
              }
            </View>
          </View>
          {type == 1 ? <View className='sp-coupon-detail__footer'>
            <SpLogin onChange={handleReceiveCoupon}>
              <AtButton
                className={`sp-coupon-detail__receive-btn ${info.couponStatus.type !== 1 ? 'disabled' : ''
                  }`}
                type='primary'
                loading={isLoading}
              >
                {info.couponStatus.text}
              </AtButton>
            </SpLogin>
          </View> :
            ['online', 'common'].includes(info.use_scenes) && <View className='sp-coupon-detail__footer'>
              <SpLogin onChange={handleUseCoupon}>
                <AtButton className='sp-coupon-detail__receive-btn' type='primary'>
                  立即使用
                </AtButton>
              </SpLogin>
            </View>
          }

          {/* 分享 */}
          <SpShare
            title='分享至'
            open={sharePanelOpen}
            posterIsReady={posterIsReady}
            onSavePoster={() => {
              posterRef.current.saveToAlbum()
            }}
            onClose={() => {
              setState((draft) => {
                draft.sharePanelOpen = false
                draft.posterModalOpen = false
              })
            }}
            onCreatePoster={() => {
              setState((draft) => {
                // draft.sharePanelOpen = false
                draft.posterModalOpen = true
              })
            }}
            onShareEdit={() => {
              const { card_id, company_id } = info
              Taro.navigateTo({
                url: `/subpage/pages/editShare/index?id=${card_id}&company_id=${company_id}`
              })
            }}
          />

          {/* 海报 */}
          {posterModalOpen && (
            <SpPoster
              ref={posterRef}
              info={info}
              type='couponDetail'
              onReadyPosterChange={(posterIsReady) => {
                setState((draft) => {
                  draft.posterIsReady = posterIsReady
                })
              }}
              onClose={() => {
                setState((draft) => {
                  draft.posterModalOpen = false
                })
              }}
            />
          )}
        </View>
      )}
    </SpPage>
  )
}

export default SpCouponDetail
