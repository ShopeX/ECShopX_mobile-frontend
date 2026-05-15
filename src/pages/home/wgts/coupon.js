/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, ScrollView, Text } from '@tarojs/components'
import { SpImage, SpCouponPackage, SpLogin } from '@/components'
import { classNames, styleNames, isWeixin, showToast } from '@/utils'
import S from '@/spx'
import { useTranslation, $t } from '@/i18n'
import { SG_GUIDE_PARAMS } from '@/consts/localstorage'
import './coupon.scss'

const initialState = {
  visibleCouponPkg: false,
  showLoginModal: false,
  pendingClaim: null // { type: 'coupon'|'pkg', item }
}
function WgtCoupon(props) {
  useTranslation()
  const { base, data, voucher_package } = props.info
  const [state, setState] = useImmer(initialState)
  const { visibleCouponPkg, showLoginModal, pendingClaim } = state
  const { gu } = Taro.getStorageSync(SG_GUIDE_PARAMS)
  let work_userid = ''
  if (gu) {
    work_userid = gu.split('_')[0]
  }
  useEffect(() => {}, [])

  // 点击领取：未登录弹窗，已登录直接领
  const onClaimCoupon = (item) => {
    if (!S.getAuthToken()) {
      setState((draft) => {
        draft.showLoginModal = true
        draft.pendingClaim = { type: 'coupon', item }
      })
      return
    }
    doClaimCoupon(item)
  }

  const onClaimPkg = (item) => {
    if (!S.getAuthToken()) {
      setState((draft) => {
        draft.showLoginModal = true
        draft.pendingClaim = { type: 'pkg', item }
      })
      return
    }
    doClaimPkg(item)
  }

  // 登录弹窗成功回调：执行待领取并关闭弹窗
  const onLoginSuccess = () => {
    if (!pendingClaim) return
    if (pendingClaim.type === 'coupon') {
      doClaimCoupon(pendingClaim.item)
    } else {
      doClaimPkg(pendingClaim.item)
    }
    setState((draft) => {
      draft.showLoginModal = false
      draft.pendingClaim = null
    })
  }

  // 单张优惠券领取
  const doClaimCoupon = async (item) => {
    if (isWeixin) {
      const { template_id } = await api.user.newWxaMsgTmpl({
        temp_name: 'yykweishop',
        source_type: 'coupon'
      })
      Taro.requestSubscribeMessage({
        tmplIds: template_id,
        success: () => {
          handleGetCard(item.id)
        },
        fail: () => {
          handleGetCard(item.id)
        }
      })
    } else {
      handleGetCard(item.id)
    }
  }

  // 券包领取
  const doClaimPkg = async (item) => {
    await api.vip.getReceiveCardPackage({ package_id: item.package_id })
    showToast($t('e82b4bf3.5ccc9d'))
    setState((draft) => {
      draft.visibleCouponPkg = true
    })
  }

  const handleGetCard = async (id) => {
    const params = {
      card_id: id
    }
    if (work_userid) {
      params.work_userid = work_userid
    }
    await api.member.homeCouponGet(params)
    showToast($t('e82b4bf3.ed4e1b'))
  }

  const len = data.length + (voucher_package?.length ?? 0)

  const getCouponStyle = (item) => {
    if (item.imgUrl) {
      return {
        'background-image': `url(${item.imgUrl})`,
        'background-size': 'cover',
        'background-position': 'center',
        'background-color': 'transparent'
      }
    }
  }

  return (
    <View
      className={classNames('wgt wgt-coupon', {
        'wgt__padded': base.padded
      })}
    >
      {base.title && (
        <View className='wgt-head'>
          <View className='wgt-hd'>
            <Text className='wgt-title'>{base.title}</Text>
            <Text className='wgt-subtitle'>{base.subtitle}</Text>
          </View>
        </View>
      )}

      <ScrollView
        scrollX
        className={classNames('wgt__body with-padding', `coupon-style-${len <= 2 ? len : 3}`)}
      >
        {data.map((item, index) => (
          <View
            key={`coupon-item__${index}`}
            className={classNames('wgt-coupon-item', {
              'has-img': item.imgUrl
            })}
            style={styleNames(getCouponStyle(item))}
            onClick={() => onClaimCoupon(item)}
          >
            {!item.imgUrl && (
              <View class='coupon-bd'>
                {item.type == 'cash' && (
                  <View class='coupon-amount'>
                    <Text class='symbol'>¥</Text>
                    <Text class='value'>{item.amount / 100}</Text>
                  </View>
                )}
                {item.type == 'discount' && (
                  <View class='coupon-amount'>
                    <Text class='value'>{item.amount}</Text>
                    <Text class='symbol'>{$t('e82b4bf3.96c015')}</Text>
                  </View>
                )}
                {item.type == 'new_gift' && (
                  <View class='coupon-amount'>
                    <Text class='value'>{item.amount / 100}</Text>
                    <Text class='symbol'>{$t('e82b4bf3.c16655')}</Text>
                  </View>
                )}
                <View class='coupon-desc'>
                  <Text class='name'>{item.title}</Text>
                  <Text class='desc'>{item.desc}</Text>
                </View>
              </View>
            )}
            {!item.imgUrl && (
              <View class='coupon-ft'>
                <View class='btn'>{$t('e82b4bf3.9c1b27')}</View>
              </View>
            )}
          </View>
        ))}

        {voucher_package.map((item, index) => (
          <View
            key={`coupon-pkg__${index}`}
            className={classNames('wgt-coupon-item', {
              'has-img': item.imgUrl
            })}
            style={styleNames(getCouponStyle(item))}
            onClick={() => onClaimPkg(item)}
          >
            {!item.imgUrl && (
              <View class='coupon-bd'>
                <View class='coupon-amount'>
                  <Text class='package-value'>{$t('e82b4bf3.7fac13')}</Text>
                </View>
                <View class='coupon-desc'>
                  <Text class='name'>{item.title}</Text>
                  <Text class='desc'>{item.desc}</Text>
                </View>
              </View>
            )}
            {!item.imgUrl && (
              <View class='coupon-ft'>
                <View class='btn'>{$t('e82b4bf3.9c1b27')}</View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* 优惠券包 */}
      {visibleCouponPkg && (
        <SpCouponPackage
          info='template'
          onClose={() => {
            setState((draft) => {
              draft.visibleCouponPkg = false
            })
          }}
        />
      )}

      {/* 统一登录弹窗：放在组件根，避免在横向滚动窄条内导致样式异常 */}
      <SpLogin
        visible={showLoginModal}
        onChange={onLoginSuccess}
        onClose={() => {
          setState((draft) => {
            draft.showLoginModal = false
            draft.pendingClaim = null
          })
        }}
      />
    </View>
  )
}

WgtCoupon.options = {
  addGlobalClass: true
}

export default WgtCoupon
