/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro, { useRouter } from '@tarojs/taro'
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import { View, Text } from '@tarojs/components'
import api from '@/api'
import { classNames, getDistributorId, VERSION_IN_PURCHASE, showToast, pickBy } from '@/utils'
import doc from '@/doc'
import { SpPage } from '@/components'
import {
  updateEnterpriseId,
  updateCurEnterpriseName,
  updateActivityInfo,
  updateCount,
  updateIsPasscodeLogin
} from '@/store/slices/purchase'
import CompPurchaseNav from '@/pages/purchase/comps/comp-purchase-nav'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation, $t } from '@/i18n'
import './select-identity.scss'

function handlePriceConfig(val) {
  if (!val) return {}
  const priceConfig = JSON.parse(JSON.stringify(val))
  Object.keys(priceConfig).forEach((key) => {
    const c_config = priceConfig[key]
    if (c_config) {
      for (const ckey in c_config) {
        c_config[ckey] = c_config[ckey] == 'true'
      }
    }
  })
  return priceConfig
}

const initialState = {
  identity: [],
  invalidIdentity: [],
  loading: true,
  selectedEnterpriseId: ''
}

function SelectIdentity(props) {
  const { i18n } = useTranslation()
  const [state, setState] = useImmer(initialState)

  const { identity, loading, selectedEnterpriseId } = state
  const { curEnterpriseId, curDistributorId } = useSelector((_state) => _state.purchase)
  const dispatch = useDispatch()

  const { params } = useRouter()
  let { activity_id = '', is_redirt = 0 } = params
  /** 与 activity-list 一致：仅 is_redirt==1 时在本页完成活动资格校验并直达活动页 */
  const isRedirtStrict = is_redirt == 1

  /**
   * is_redirt==1：等价于原 activity-list 内 fetch + onClickChange(redirectTo)
   */
  const goToPurchaseHomeAfterVerify = async (enterpriseItem) => {
    const enterprise_id = enterpriseItem?.enterprise_id
    if (!enterprise_id) {
      showToast('缺少企业信息')
      setState((d) => {
        d.loading = false
      })
      return false
    }
    if (!activity_id) {
      showToast('缺少活动参数')
      setState((d) => {
        d.loading = false
      })
      return false
    }
    dispatch(updateEnterpriseId(enterprise_id))
    dispatch(updateCurEnterpriseName(enterpriseItem.name))

    if (VERSION_IN_PURCHASE) {
      const pdata = await api.purchase.getUserEnterprises({
        disabled: 0,
        distributor_id: getDistributorId()
      })
      const validIdentityLen = pdata.filter((item) => item.disabled == 0).length
      if (!validIdentityLen) {
        Taro.redirectTo({ url: '/pages/purchase/auth' })
        return false
      }
    }

    try {
      const { list } = await api.purchase.getEmployeeActivityList({
        page: 1,
        pageSize: 10,
        enterprise_id,
        activity_id,
        status: 'warm_up,ongoing'
      })
      const _list = pickBy(list, doc.purchase.ACTIVITY_ITEM)
      const _eligibilityList = _list.filter((item) => item.id == activity_id)
      if (_eligibilityList.length === 0) {
        setState((d) => {
          d.loading = false
        })
        const { confirm } = await Taro.showModal({
          content: $t('c2581d4c.d7c2a1'),
          showCancel: false,
          confirmText: $t('c2581d4c.5f4112')
        })
        if (confirm) {
          Taro.navigateBack()
        }
        return false
      }
      const item = _eligibilityList[0]
      const {
        id,
        enterpriseId,
        pages_template_id,
        priceDisplayConfig = {},
        isDiscountDescriptionEnabled,
        discountDescription,
        isPassphraseEnabled,
        passphraseUserVerified
      } = item
      try {
        const eligibility = await api.purchase.getInternalSaleEligibility({
          activity_id: id,
          enterprise_id: enterpriseId
        })
        if (Number(eligibility?.internal_sale_eligible) !== 1) {
          showToast($t('c2581d4c.d7c2a1'))
          setState((d) => {
            d.loading = false
          })
          return false
        }
      } catch (e) {
        showToast(e?.message || $t('e32a7439.c2d481'))
        setState((d) => {
          d.loading = false
        })
        return false
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
      if (isPassphraseEnabled) {
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
      try {
        await Taro.redirectTo({ url })
        return true
      } catch (err) {
        showToast(err?.errMsg || err?.message || '跳转失败')
        setState((d) => {
          d.loading = false
        })
        return false
      }
    } catch (error) {
      showToast(error?.message || '加载失败')
      setState((d) => {
        d.loading = false
      })
      return false
    }
  }

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('5f46773c.f0c92e') })
  }, [i18n.language])

  const getUserEnterprises = async () => {
    const data = await api.purchase.getUserEnterprises({
      activity_id
      // distributor_id: curDistributorId ?? getDistributorId()
    })
    const _identity = data.filter((item) => item.disabled == 0)
    // 内购入口且无可用企业：提示后返回上一页
    if (_identity.length == 0 && (is_redirt || VERSION_IN_PURCHASE)) {
      setState((draft) => {
        draft.loading = false
      })
      const { confirm } = await Taro.showModal({
        content: $t('c2581d4c.d7c2a1'),
        showCancel: false,
        confirmText: $t('c2581d4c.5f4112')
      })
      if (confirm) {
        Taro.navigateBack()
      }
      return
    }

    // 仅一个企业：is_redirt==1 在本页校验活动资格并直达活动首页；其它仍进活动列表
    if (_identity.length == 1 && isRedirtStrict) {
      const ok = await goToPurchaseHomeAfterVerify(_identity[0])
      if (!ok) {
        setState((draft) => {
          draft.loading = false
          draft.identity = _identity
          draft.invalidIdentity = data.filter((item) => item.disabled == 1)
          const preferred = _identity.find((it) => it.enterprise_id == curEnterpriseId)
          draft.selectedEnterpriseId = preferred
            ? preferred.enterprise_id
            : _identity[0]?.enterprise_id ?? ''
        })
      }
      return
    }
    if (_identity.length == 1 && is_redirt) {
      dispatch(updateEnterpriseId(_identity[0]?.enterprise_id))
      dispatch(updateCurEnterpriseName(_identity[0]?.name))
      Taro.redirectTo({
        url: `/subpages/purchase/activity-list?activity_id=${activity_id}&is_redirt=${is_redirt}`
      })
      return
    }

    setState((draft) => {
      draft.loading = false
      draft.identity = _identity
      draft.invalidIdentity = data.filter((item) => item.disabled == 1)
      const preferred = _identity.find((it) => it.enterprise_id == curEnterpriseId)
      draft.selectedEnterpriseId = preferred
        ? preferred.enterprise_id
        : _identity[0]?.enterprise_id ?? ''
    })
  }

  useEffect(() => {
    getUserEnterprises()
  }, [])

  const onSelectCard = (enterprise_id) => {
    setState((draft) => {
      draft.selectedEnterpriseId = enterprise_id
    })
  }

  const onConfirm = async () => {
    const item = identity.find((it) => it.enterprise_id == selectedEnterpriseId)
    if (!item) {
      return
    }
    if (isRedirtStrict) {
      setState((d) => {
        d.loading = true
      })
      const ok = await goToPurchaseHomeAfterVerify(item)
      if (!ok) {
        setState((d) => {
          d.loading = false
        })
      }
      return
    }
    dispatch(updateEnterpriseId(item.enterprise_id))
    dispatch(updateCurEnterpriseName(item.name))
    Taro.navigateTo({
      url: `/subpages/purchase/activity-list?activity_id=${activity_id}&is_redirt=${is_redirt}`
    })
  }

  return (
    <SpPage
      className='select-identity'
      loading={loading}
      title={$t('c2581d4c.6fb7d0')}
      pageConfig={{ navigateBackgroundColor: '#ffffff' }}
      renderNavigation={(navProps) => <CompPurchaseNav {...navProps} />}
    >
      <View className='select-identity__wrap'>
        <View className='select-identity__hd-bar'>
          <Text className='select-identity__hd-text'>{$t('c2581d4c.0067d7')}</Text>
        </View>
        <View className='select-identity__inner'>
          <View className='select-identity__list'>
            {identity.map((item, index) => {
              const active = selectedEnterpriseId == item.enterprise_id
              return (
                <View
                  key={item.enterprise_id ?? index}
                  className={classNames('select-identity__card', {
                    'select-identity__card--active': active
                  })}
                  onClick={() => onSelectCard(item.enterprise_id)}
                >
                  <View className='select-identity__card-main'>
                    <Text className='select-identity__card-name'>{item.name}</Text>
                  </View>
                  {active ? (
                    <View className='select-identity__card-check'>
                      <Text className='select-identity__card-check-mark'>✓</Text>
                    </View>
                  ) : (
                    <View className='select-identity__card-check select-identity__card-check--placeholder' />
                  )}
                </View>
              )
            })}
          </View>
        </View>
        {!loading && identity.length > 0 ? (
          <View className='select-identity__footer'>
            <View className='select-identity__confirm' onClick={onConfirm}>
              {$t('c2581d4c.e83a25')}
            </View>
          </View>
        ) : null}
      </View>
    </SpPage>
  )
}

SelectIdentity.options = {
  addGlobalClass: true
}

export default SelectIdentity
