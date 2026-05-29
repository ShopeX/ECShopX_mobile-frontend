/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 *
 * 内购 SKU 弹窗：仅 Figma 稿一种形态（顶弧、把手+关闭、头图+价+已选+步进器、规格、限购双列、购物车+主按钮）
 */
import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpFloatLayout, SpImage, SpInputNumber, SpGoodsPrice } from '@/components'
import { addCart, updateCount } from '@/store/slices/purchase'
import { BUY_TOOL_BTNS } from '@/consts'
import { useAsyncCallback } from '@/hooks'
import { classNames, showToast, navigateTo } from '@/utils'
import { useTranslation, $t, ti } from '@/i18n'
import './comp-skuselect.scss'

function resolvePurchaseLimitQty(info, curItem, type) {
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
  let qty = null
  const skuLimit =
    !nospec && curItem != null && curItem.limitNum != null && curItem.limitNum !== ''
      ? curItem.limitNum
      : null
  if (activityType === 'limited_buy' && activityInfo?.rule?.limit != null) {
    qty = activityInfo.rule.limit
  } else if (activityType === 'seckill' || activityType === 'limited_time_sale') {
    qty = nospec ? limitNum : skuLimit ?? limitNum
  } else if (activityType === 'group') {
    qty = 1
  } else if (skuLimit != null) {
    qty = skuLimit
  }
  if (qty == null || qty === '') {
    qty = purchaseLimitNum ?? purlimitByCart ?? purlimitByFastbuy ?? limitNum
  }
  if (skuLimit == null && type == 'addcart' && purlimitByCart != null && purlimitByCart !== '') {
    qty = purlimitByCart
  }
  if (
    skuLimit == null &&
    type == 'fastbuy' &&
    purlimitByFastbuy != null &&
    purlimitByFastbuy !== ''
  ) {
    qty = purlimitByFastbuy
  }
  return qty != null && qty !== '' ? qty : null
}

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
  return ti('47ac6066.c8d3e2', [n.toFixed(2)])
}

function resolvePurchaseQtyMax(info, curItem, type) {
  const limitQty = resolvePurchaseLimitQty(info, curItem, type)
  if (limitQty != null && limitQty !== '') {
    return parseInt(limitQty, 10)
  }
  return parseInt(curItem ? curItem.store : info?.store, 10)
}

const initialState = {
  selection: [],
  disabledSet: new Set(),
  curItem: null,
  skuText: '',
  num: 1
}

function PurchaseSkuSelect(props) {
  useTranslation()
  const {
    info,
    open = false,
    onClose = () => {},
    onChange = () => {},
    selectedItem = null,
    type,
    hideInputNumber = false
  } = props
  const [state, setState] = useAsyncCallback(initialState)
  const { purchase_share_info = {}, cartCount = 0 } = useSelector((state) => state.purchase)
  const { selection, disabledSet, curItem, skuText, num } = state
  const dispatch = useDispatch()
  const skuDictRef = useRef({})
  const router = useRouter()

  useEffect(() => {
    if (info && !info.nospec) {
      init({ selectedItem, commit: true })
    }
  }, [info])

  useEffect(() => {
    if (open && info && !info.nospec) {
      init({ selectedItem })
    }
  }, [open])

  const init = (options = {}) => {
    const { selectedItem: committedItem = null, commit = false } = options
    const { skuList, specItems } = info
    skuDictRef.current = {}
    specItems.forEach((item) => {
      const key = item.specItem.map((spec) => spec.specId).join('_')
      skuDictRef.current[key] = item
    })
    const defaultSpecItem = specItems.find(
      (item) => item.store > 0 && ['onsale', 'offline_sale'].includes(item.approveStatus)
    )
    let selection = Array(specItems.length).fill(null)
    const committedSpecItem =
      committedItem?.itemId != null
        ? specItems.find((item) => String(item.itemId) === String(committedItem.itemId))
        : null
    const committedSelection = committedSpecItem?.specItem?.map((item) => item.specId)
    if (committedSelection && skuDictRef.current[committedSelection.join('_')]) {
      selection = committedSelection
    } else if (defaultSpecItem) {
      selection = defaultSpecItem.specItem.map((item) => item.specId)
    }

    calcDisabled(selection, { commit })
  }

  const calcDisabled = (selection, options = {}) => {
    const { commit = false, resetNum = false } = options
    const { skuList } = info
    const disabledSet = new Set()
    const makeReg = (sel, row, val) => {
      const tSel = sel.slice()
      const regStr = tSel.map((s, idx) => (row === idx ? val : !s ? '(\\d+)' : s)).join('_')
      return new RegExp(regStr)
    }

    const isNotDisabled = (sel, row, val) => {
      const reg = makeReg(sel, row, val)

      return Object.keys(skuDictRef.current).some((key) => {
        return (
          key.match(reg) &&
          skuDictRef.current[key].store > 0 &&
          ['onsale', 'offline_sale'].includes(skuDictRef.current[key].approveStatus)
        )
      })
    }

    for (let i = 0, l = skuList.length; i < l; i++) {
      const { skuValue } = skuList[i]
      for (let j = 0, k = skuValue.length; j < k; j++) {
        const id = skuValue[j].specId
        if (!disabledSet.has(id) && !isNotDisabled(selection, i, id)) {
          disabledSet.add(id)
        }
      }
    }

    const curItem = skuDictRef.current[selection.join('_')]
    const skuText = curItem
      ? ti('47ac6066.aa995b', [
          curItem.specItem.map((item) => `${item.skuName}:${item.specName}`).join(',')
        ])
      : $t('46dc5ce5.4fd966')

    setState((draft) => {
      if (resetNum) {
        draft.num = 1
      }
      const max = resolvePurchaseQtyMax(info, curItem, type)
      if (!Number.isNaN(max) && Number(draft.num) > max) {
        draft.num = max
      }
      draft.selection = selection
      draft.disabledSet = disabledSet
      draft.curItem = curItem
      draft.skuText = skuText
    })
    if (commit) {
      onChange(skuText, curItem)
    }
  }

  const handleSelectSku = ({ specId }, idx) => {
    if (disabledSet.has(specId)) return
    setState(
      (draft) => {
        draft.selection[idx] = selection[idx] == specId ? null : specId
      },
      ({ selection }) => {
        calcDisabled(selection, { resetNum: true })
      }
    )
  }

  const getImgs = () => {
    let img = info.imgs[0]
    if (curItem) {
      const { specImgs } = curItem.specItem[curItem.specItem.length - 1]
      if (specImgs.length > 0) {
        img = specImgs[0]
      }
    }
    return img
  }

  const handlePreviewImage = () => {
    let imgUrls = info.imgs
    if (curItem) {
      const { specImgs } = curItem.specItem[curItem.specItem.length - 1]
      if (specImgs.length > 0) {
        imgUrls = specImgs
      }
    }
    Taro.previewImage({
      urls: imgUrls
    })
  }

  if (!info) {
    return null
  }

  const { skuList, specItems = [] } = info
  const shouldShowSelectedWrap = !info.nospec && specItems.length > 1

  const addToCart = async () => {
    const { activity_id, enterprise_id } = purchase_share_info
    let _activity_id = activity_id
    let _enterprise_id = enterprise_id
    if (router?.params.activity_id && router?.params.enterprise_id) {
      _activity_id = router?.params.activity_id
      _enterprise_id = router?.params.enterprise_id
    }

    const { nospec } = info
    if (!nospec && !curItem) {
      showToast($t('d95e19a2.4fd966'))
      return
    }
    Taro.showLoading({ title: '' })
    await dispatch(
      addCart({
        item_id: curItem ? curItem.itemId : info.itemId,
        num,
        distributor_id: info.distributorId,
        shop_type: 'distributor',
        activity_id: _activity_id,
        enterprise_id: _enterprise_id
      })
    )
    onClose()
    dispatch(
      updateCount({
        shop_type: 'distributor',
        activity_id: _activity_id,
        enterprise_id: _enterprise_id
      })
    )

    Taro.hideLoading()
  }

  const computePurchaseQtyLimits = () => {
    const { nospec, activityType, activityInfo } = info
    let limitNum = resolvePurchaseLimitQty(info, curItem, type)
    let limitTxt = ''
    let max = 1
    if (activityType) {
      if (activityType == 'limited_buy') {
        if (activityInfo.rule.day == 0) {
          limitTxt = ti('47ac6066.244ae6', [limitNum])
        } else {
          limitTxt = ti('47ac6066.21bb9b', [activityInfo.rule.day, limitNum])
        }
      } else if (activityType == 'seckill' || activityType == 'limited_time_sale') {
        limitTxt = ti('47ac6066.244ae6', [limitNum])
      } else if (activityType == 'group') {
        limitTxt = ti('47ac6066.244ae6', [limitNum])
      }
    }
    if (!limitTxt && limitNum != null && limitNum !== '') {
      limitTxt = ti('47ac6066.244ae6', [limitNum])
    }
    if (limitNum) {
      max = parseInt(limitNum, 10)
    } else {
      max = parseInt(curItem ? curItem.store : info.store, 10)
    }
    return { limitNum, limitTxt, max }
  }

  const renderQtyStepper = () => {
    const { max } = computePurchaseQtyLimits()
    return (
      <View className='sp-sku-select-espier__stepper-wrap'>
        <SpInputNumber
          value={num}
          min={1}
          max={max}
          onChange={(n) => {
            setState((draft) => {
              draft.num = n
            })
          }}
        />
      </View>
    )
  }

  const renderSkuFooter = () => {
    const limitQty = resolvePurchaseLimitQty(info, curItem, type)
    const amountLine = resolvePurchaseLimitAmountLine(info, curItem)
    const showLimits = limitQty != null || !!amountLine
    const limitsKey = curItem?.itemId ?? curItem?.item_id ?? 'none'
    let btnTxt = $t('250b375e.38cf16')
    Object.keys(BUY_TOOL_BTNS()).forEach((key) => {
      if (BUY_TOOL_BTNS()[key].key == type) {
        btnTxt = BUY_TOOL_BTNS()[key].title
      }
    })
    const onMain = () => {
      if (!info.nospec && !curItem) {
        showToast($t('d95e19a2.4fd966'))
        return
      }
      addToCart()
    }
    return (
      <View className='sp-sku-select-espier__footer-inner'>
        {showLimits && (
          <View className='sp-sku-select-espier__limits' key={`purchase-sku-limits-${limitsKey}`}>
            <Text className='sp-sku-select-espier__limit-left'>
              {limitQty != null ? ti('47ac6066.f7a2b1', [limitQty]) : ''}
            </Text>
            <Text className='sp-sku-select-espier__limit-right'>{amountLine || ''}</Text>
          </View>
        )}
        <View className='sp-sku-select-espier__bar'>
          <View
            className='sp-sku-select-espier__cart'
            onClick={navigateTo.bind(null, '/subpages/purchase/espier-index?tabbar=0')}
          >
            <View className='sp-sku-select-espier__cart-icon-wrap'>
              <Text className='iconfont icon-gouwuche sp-sku-select-espier__cart-icon' />
              {cartCount > 0 && (
                <Text className='sp-sku-select-espier__cart-badge'>
                  {cartCount > 99 ? '99+' : cartCount}
                </Text>
              )}
            </View>
            <Text className='sp-sku-select-espier__cart-label'>{$t('91cdd6e0.c017be')}</Text>
          </View>
          <View className='sp-sku-select-espier__btn-solid' onClick={onMain}>
            <Text className='sp-sku-select-espier__btn-text'>
              {type == 'picker' ? $t('cd0f027b.38cf16') : btnTxt}
            </Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <SpFloatLayout
      className='sp-sku-select'
      hideClose
      beforeScroll={
        <View className='sp-sku-select-espier__sheet-head'>
          <View className='sp-sku-select-espier__handle' />
        </View>
      }
      open={open}
      onClose={onClose}
      renderFooter={renderSkuFooter}
    >
      <View className='sp-sku-select-espier__header'>
        <SpImage
          className='sp-sku-select-espier__thumb'
          src={getImgs()}
          width={188}
          height={186}
          radius={16}
          mode='aspectFit'
          onClick={handlePreviewImage}
        />
        <View className='sp-sku-select-espier__header-main'>
          <View className='sp-sku-select-espier__price-row'>
            <SpGoodsPrice isPurchase info={curItem || info} />
          </View>
          {shouldShowSelectedWrap && (
            <View
              className={classNames('sp-sku-select-espier__selected-wrap', {
                'sp-sku-select-espier__selected-wrap--placeholder': !curItem
              })}
            >
              <Text className='sp-sku-select-espier__selected-label'>{$t('47ac6066.7c9aea')}</Text>
              <Text className='sp-sku-select-espier__selected'>
                {curItem && curItem.specItem
                  ? curItem.specItem.map((s) => s.specName).join(' ')
                  : $t('e7ecd058.708c9d')}
              </Text>
            </View>
          )}
          {!hideInputNumber && renderQtyStepper()}
          {/* {info.store_setting && (
            <Text className='sp-sku-select-espier__store'>
              库存：{curItem ? curItem.store : info.store}
            </Text>
          )} */}
        </View>
      </View>

      <View className='sku-list'>
        {skuList.map((item, index) => (
          <View className='sku-group' key={`sku-group__${index}`}>
            <View className='sku-name'>{item.skuName}</View>
            <View className='sku-values'>
              {item.skuValue.map((spec, idx) => (
                <View
                  className={classNames('sku-btn', {
                    'active': spec.specId == selection[index],
                    'disabled': disabledSet.has(spec.specId),
                    'sku-img': spec.specImgs.length > 0
                  })}
                  onClick={handleSelectSku.bind(this, spec, index)}
                  key={`sku-values-item__${idx}`}
                >
                  {spec.specImgs.length > 0 && (
                    <SpImage src={spec.specImgs[0]} width={214} height={214} />
                  )}
                  <Text className='spec-name'>{spec.specName}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </SpFloatLayout>
  )
}

PurchaseSkuSelect.options = {
  addGlobalClass: true
}

export default PurchaseSkuSelect
