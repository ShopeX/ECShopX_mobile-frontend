/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro, { useRouter } from '@tarojs/taro'
import React, { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import { View, Text, ScrollView } from '@tarojs/components'
import dayjs from 'dayjs'
import api from '@/api'
import { classNames, pickBy, getDistributorId, VERSION_IN_PURCHASE, showToast } from '@/utils'
import { updateUserInfo } from '@/store/slices/user'
import { updateActivityInfo, updateCount, updateIsPasscodeLogin } from '@/store/slices/purchase'
import doc from '@/doc'
import S from '@/spx'
import { SpPage, SpNote, SpScrollView, SpImage, SpPurchaseEnterpriseBar } from '@/components'
import CompPurchaseNav from '@/pages/purchase/comps/comp-purchase-nav'
import { $t, useTranslation } from '@/i18n'
import './activity-list.scss'

const initialState = {
  activityList: [],
  loading: true
}

/** @returns {'upcoming' | 'ongoing' | 'ended'} */
function getActivityPhase(item) {
  let begin = Number(item.beginTs)
  let end = Number(item.endTs)
  const tsMissing =
    !begin ||
    !end ||
    Number.isNaN(begin) ||
    Number.isNaN(end)
  if (tsMissing && item.employeeBeginTime && item.employeeEndTime) {
    begin = dayjs(item.employeeBeginTime).valueOf()
    end = dayjs(item.employeeEndTime).valueOf()
  }
  const now = Date.now()
  if (!begin || !end || Number.isNaN(begin) || Number.isNaN(end)) {
    return 'ongoing'
  }
  if (now < begin) return 'upcoming'
  if (now > end) return 'ended'
  return 'ongoing'
}

function PurchaseActivityList() {
  useTranslation()
  const [state, setState] = useImmer(initialState)
  const { activityList, loading } = state
  const { curEnterpriseId, curEnterpriseName } = useSelector((_state) => _state.purchase)

  const scrollRef = useRef()
  const dispatch = useDispatch()

  const { params } = useRouter()
  let { activity_id, is_redirt = 0 } = params

  useEffect(() => {
    if (!S.getAuthToken()) {
      Taro.redirectTo({
        url: '/pages/purchase/auth'
      })
      return
    }
    scrollRef.current?.reset()
  }, [])

  useEffect(() => {
    if (is_redirt == 1) {
      fetch({ pageIndex: 1, pageSize: 10 })
    }
  }, [is_redirt])

  const updataMemberInfo = async () => {
    const _userInfo = await api.member.memberInfo()
    dispatch(updateUserInfo(_userInfo))
  }

  const fetch = async ({ pageIndex, pageSize }) => {

    if (pageIndex === 1) {
      if (VERSION_IN_PURCHASE) {
        const data = await api.purchase.getUserEnterprises({
          disabled: 0,
          distributor_id: getDistributorId()
        })
        const validIdentityLen = data.filter((item) => item.disabled == 0).length
        if (!validIdentityLen) {
          Taro.redirectTo({
            url: '/pages/purchase/auth'
          })
          return { total: 0 }
        }
      }
    }
    try {
      const { list, total_count } = await api.purchase.getEmployeeActivityList({
        page: pageIndex,
        pageSize,
        enterprise_id: curEnterpriseId,
        activity_id,
        status: 'warm_up,ongoing'
      })
      const _list = pickBy(list, doc.purchase.ACTIVITY_ITEM)
      const _eligibilityList = _list.filter((item) => item.id == activity_id)
      if (is_redirt == 1) {
        if (_eligibilityList.length == 0) {
          const { confirm } = await Taro.showModal({
            content: $t('c2581d4c.d7c2a1'),
            showCancel: false,
            confirmText: $t('c2581d4c.5f4112')
          })
          if (confirm) {
            Taro.navigateBack()
          }
          return { total: 0 }
        }
        onClickChange(_eligibilityList[0], 'redirectTo')
        return { total: 0 }
      }
      setState((draft) => {
        draft.activityList = [...draft.activityList, ..._list]
        if (pageIndex === 1) {
          draft.loading = false
          updataMemberInfo()
        }
      })

      return { total: total_count }
    } catch (error) {
      return { total: 0 }
    }
  }

  const onClickChange = async (item, type) => {
    const {
      id,
      enterpriseId,
      pages_template_id,
      priceDisplayConfig = {},
      isDiscountDescriptionEnabled,
      discountDescription,
      isPassphraseEnabled,
      passphraseUserVerified,
      authType
    } = item
    try {
      const eligibility = await api.purchase.getInternalSaleEligibility({
        activity_id: id,
        enterprise_id: enterpriseId
      })
      if (Number(eligibility?.internal_sale_eligible) !== 1) {
        showToast($t('c2581d4c.d7c2a1'))
        return
      }
    } catch (e) {
      showToast(e?.message || $t('e32a7439.c2d481'))
      return
    }
    const _priceDisplayConfig = handlePriceConfig(priceDisplayConfig)
    dispatch(
      updateActivityInfo({
        priceDisplayConfig: _priceDisplayConfig,
        isDiscountDescriptionEnabled,
        discountDescription
      })
    )
    await dispatch(
      updateCount({
        shop_type: 'distributor',
        enterprise_id: enterpriseId,
        activity_id: id
      })
    )
    let url = ''
    if (isPassphraseEnabled) { //是否开启口令通道
      dispatch(updateIsPasscodeLogin(true))
      if (passphraseUserVerified == 1) {
        url = `/subpages/purchase/index?activity_id=${id}&enterprise_id=${enterpriseId}&pages_template_id=${pages_template_id}`
      } else {
        url = `/subpages/purchase/select-company-passcode?activity_id=${id}&enterprise_id=${enterpriseId}&pages_template_id=${pages_template_id}`
      }
    } else {
      dispatch(updateIsPasscodeLogin(false))
      url = `/subpages/purchase/index?activity_id=${id}&enterprise_id=${enterpriseId}&pages_template_id=${pages_template_id}`
    }
    if (type == 'redirectTo') {
      Taro.redirectTo({ url })
    } else {
      Taro.navigateTo({ url })
    }
  }

  const handlePriceConfig = (val) => {
    if (!val) return {}
    const priceConfig = JSON.parse(JSON.stringify(val))
    const isEnabled = (value) => ![false, 'false', 0, '0'].includes(value)
    Object.keys(priceConfig).forEach((key) => {
      const c_config = priceConfig[key]
      if (c_config) {
        for (let ckey in c_config) {
          c_config[ckey] = isEnabled(c_config[ckey])
        }
      }
    })
    return priceConfig
  }

  const handleCardAction = (item) => {
    const phase = getActivityPhase(item)
    if (phase === 'upcoming') {
      Taro.showToast({ title: $t('e32a7439.f1a90b'), icon: 'none' })
      return
    }
    if (phase === 'ended') {
      Taro.showToast({ title: $t('c4d2fddd.cdae1c'), icon: 'none' })
      return
    }
    onClickChange(item)
  }

  if (is_redirt == 1) {
    return <SpPage loading title={$t('c2581d4c.6fb7d0')}
      pageConfig={{ navigateBackgroundColor: '#ffffff' }}
      renderNavigation={(navProps) => <CompPurchaseNav {...navProps} />}
    />
  }


  return (
    <SpPage
      className='page-purchase-index page-purchase-activitylist'
      title={$t('c2581d4c.6fb7d0')}
      pageConfig={{ navigateBackgroundColor: '#ffffff' }}
      renderNavigation={(navProps) => <CompPurchaseNav {...navProps} />}
    >
      <View className='page-purchase-activitylist__inner'>
        <SpPurchaseEnterpriseBar name={curEnterpriseName} showMore={false} showSearch={false} />

        <ScrollView className='purchase-activity-scroll' scrollY>
          <SpScrollView
            ref={scrollRef}
            className=''
            auto={false}
            fetch={fetch}
            renderEmpty={<SpNote img='empty_activity.png' title={$t('e32a7439.dd530e')} />}
          >
            <View className='purchase-activity-list'>
              {activityList.map((item) => {
                const phase = getActivityPhase(item)
                const badgeText =
                  phase === 'upcoming'
                    ? $t('e32a7439.b73c8a')
                    : phase === 'ended'
                      ? $t('e32a7439.047fab')
                      : $t('da5ae518.fb852f')
                const btnText =
                  phase === 'upcoming'
                    ? $t('e32a7439.e82c9f')
                    : phase === 'ended'
                      ? $t('e32a7439.047fab')
                      : $t('e32a7439.a61d4e')
                return (
                  <View key={item.id} className='activity-card'>
                    <View className='activity-card__cover'>
                      <SpImage className='activity-card__img' mode='aspectFill' src={item.pic} />
                      <View
                        className={classNames('activity-card__badge', `activity-card__badge--${phase}`)}
                      >
                        <Text>{badgeText}</Text>
                      </View>
                    </View>
                    <View className='activity-card__body'>
                      <Text className='activity-card__title'>{item.name}</Text>
                      <View className='activity-card__time-row'>
                        <Text className='iconfont icon-riqi activity-card__time-icon' />
                        <Text className='activity-card__time-text'>
                          {$t('e32a7439.7c4b1a')}
                          {item.employeeBeginTime}
                        </Text>
                      </View>
                      <View className='activity-card__time-row'>
                        <Text className='iconfont icon-clock1 activity-card__time-icon' />
                        <Text className='activity-card__time-text'>
                          {$t('e32a7439.8d5c2b')}
                          {item.employeeEndTime}
                        </Text>
                      </View>
                      <View
                        className={classNames('activity-card__btn', {
                          'activity-card__btn--primary': phase === 'ongoing',
                          'activity-card__btn--muted': phase !== 'ongoing'
                        })}
                        onClick={() => handleCardAction(item)}
                      >
                        <Text>{btnText}</Text>
                      </View>
                    </View>
                  </View>
                )
              })}
            </View>
          </SpScrollView>
        </ScrollView>
      </View>
    </SpPage>
  )
}

PurchaseActivityList.options = {
  addGlobalClass: true
}

export default PurchaseActivityList
