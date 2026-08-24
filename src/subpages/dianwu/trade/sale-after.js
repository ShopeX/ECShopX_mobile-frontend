/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useMemo } from 'react'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import * as dianwuApi from '@/api/dianwu'
import { AtTabs, AtTextarea } from 'taro-ui'
import {
  SpPage,
  SpButton,
  SpCell,
  SpCheckbox,
  SpImage,
  SpInputNumber,
  SpSelect,
  SpUpload,
  SpPrice
} from '@/components'
import { View, Text, Picker } from '@tarojs/components'
import { showToast, isNumber, classNames } from '@/utils'
import { useTranslation, $t, ti } from '@/i18n'
import { useNavigation } from '@/hooks'
import { calcDianwuItemRefundPoint } from '@/subpages/doc/dianwu'
import { REFUND_REASON_API, REFUND_REASON_KEYS } from '../const/refund-reason-options'
import CompTradeInfo from './../comps/comp-trade-info'
import './sale-after.scss'

const initialState = {
  info: null,
  curTabIdx: 0,
  reason: '',
  goodsReturned: [1],
  description: '',
  pic: '',
  offline_freight_status: false
}

function DianwuTradeSaleAfter(props) {
  const { i18n } = useTranslation()
  const { setNavigationBarTitle } = useNavigation()
  const $instance = getCurrentInstance() || {}
  const [state, setState] = useImmer(initialState)
  const { info, curTabIdx, reason, goodsReturned, description, pic, offline_freight_status } = state

  const tabList = useMemo(
    () => [
      { title: $t('c3455657.6b8821'), status: 'ONLY_REFUND' },
      { title: $t('c3455657.cc0193'), status: 'REFUND_GOODS' }
    ],
    [i18n.language]
  )

  const tabListRefundGoodsOnly = useMemo(() => [tabList[1]], [tabList])

  const OnlyRefundShow = useMemo(() => {
    return info && info.deliveryStatus != 'DONE'
  }, [info])

  const visibleTabList = OnlyRefundShow ? tabList : tabListRefundGoodsOnly

  const currentAftersalesType = useMemo(() => {
    return visibleTabList[curTabIdx]?.status
  }, [visibleTabList, curTabIdx])

  const isUnshippedItem = (item) => item?.deliveryStatus !== 'DONE'

  const canSelectAftersaleItem = (item) => {
    if (currentAftersalesType === 'ONLY_REFUND') {
      return isUnshippedItem(item) && !!item?.leftRefundOnlyNum
    }
    return !!item?.leftAftersalesNum
  }

  const canChangeRefundNum = (item) => {
    if (currentAftersalesType === 'ONLY_REFUND' && isUnshippedItem(item)) {
      return false
    }
    return canSelectAftersaleItem(item)
  }

  const getRefundNumValue = (item) => {
    if (currentAftersalesType === 'ONLY_REFUND' && isUnshippedItem(item)) {
      return item.leftRefundOnlyNum
    }
    return item.refundNum
  }

  const getRefundNumMax = (item) => {
    if (currentAftersalesType === 'ONLY_REFUND' && isUnshippedItem(item)) {
      return item.leftRefundOnlyNum
    }
    return item.leftAftersalesNum
  }

  const realRefundFee = useMemo(() => {
    if (!info) return '0.00'
    const rFee = info.items
      .filter((item) => item.checked)
      .reduce((sum, item) => {
        const refundNum = getRefundNumValue(item)
        return sum + (item.price / item.num) * refundNum
      }, 0)
    return rFee.toFixed(2)
  }, [info, currentAftersalesType])

  const realRefundPoint = useMemo(() => {
    if (!info) return 0
    return info.items
      .filter((item) => item.checked)
      .reduce(
        (sum, item) =>
          sum + calcDianwuItemRefundPoint(item, getRefundNumValue(item), getRefundNumMax(item)),
        0
      )
  }, [info, currentAftersalesType])

  const isLastAftersalesApply = useMemo(() => {
    if (!info?.items) return false
    const refundableItems = info.items.filter((item) => item.leftAftersalesNum > 0)
    if (refundableItems.length === 0) return false
    return refundableItems.every(
      (item) => item.checked && item.refundNum === item.leftAftersalesNum
    )
  }, [info])

  const fullFreight = useMemo(() => {
    if (!info) return 0
    return info.freightType == 'cash' ? info.freightFee : info.freightFeePoint
  }, [info])

  const refundFreight = useMemo(() => {
    if (!info) return 0
    if (currentAftersalesType !== 'REFUND_GOODS') return 0
    if (!offline_freight_status) return 0
    if (!isLastAftersalesApply) return 0
    return fullFreight
  }, [info, currentAftersalesType, offline_freight_status, isLastAftersalesApply, fullFreight])

  useEffect(() => {
    const syncTitle = () => setNavigationBarTitle($t('b1cd948c.1198ee'))
    syncTitle()
    i18n.on('languageChanged', syncTitle)
    return () => i18n.off('languageChanged', syncTitle)
  }, [setNavigationBarTitle, i18n])

  useEffect(() => {
    if (info && !OnlyRefundShow && curTabIdx !== 0) {
      setState((draft) => {
        draft.curTabIdx = 0
      })
    }
  }, [info, OnlyRefundShow, curTabIdx, setState])

  const reasonPickerRange = useMemo(() => REFUND_REASON_KEYS.map((k) => $t(k)), [i18n.language])

  const goodsReturnedList = useMemo(
    () => [
      { id: 1, name: $t('c3455657.118582') },
      { id: 2, name: $t('c3455657.37d0ec') }
    ],
    [i18n.language]
  )

  const onCancel = () => {
    Taro.navigateBack()
  }

  const onConfirm = async () => {
    if (reason === '' || reason == null) {
      return showToast($t('c3455657.9318de'))
    }
    const { trade_id } = $instance?.router?.params
    const [img] = pic || []
    const checkedItems = info?.items.filter((item) => item.checked) || []
    if (checkedItems.length === 0) {
      return showToast($t('c3455657.d83f4b'))
    }
    const aftersales_type = currentAftersalesType
    if (
      aftersales_type === 'ONLY_REFUND' &&
      checkedItems.some((item) => item.deliveryStatus === 'DONE')
    ) {
      return showToast($t('44d65d28.47107ea8'))
    }
    const refundFee = Number(realRefundFee)
    const refundPoint = realRefundPoint
    if (!isNumber(refundFee)) {
      return showToast($t('c3455657.051593'))
    }
    if (!isNumber(refundPoint)) {
      return showToast($t('c3455657.908bf7'))
    }
    const items = checkedItems.map((item) => {
      const refundQty =
        aftersales_type === 'ONLY_REFUND' && isUnshippedItem(item)
          ? item.leftRefundOnlyNum
          : item.refundNum
      return {
        id: item.id,
        num: refundQty
      }
    })
    const params = {
      order_id: trade_id,
      aftersales_type,
      goods_returned: goodsReturned[0] == 2,
      reason: REFUND_REASON_API[Number(reason)],
      detail: JSON.stringify(items),
      refund_fee: refundFee * 100,
      refund_point: refundPoint,
      description,
      evidence_pic: [img]
    }
    if (aftersales_type === 'REFUND_GOODS' && offline_freight_status && refundFreight) {
      params.freight = info?.freightType == 'cash' ? refundFreight * 100 : refundFreight
    }
    await dianwuApi.salesAfterApply(params)
    let type = 3
    if (params.aftersales_type == 'ONLY_REFUND') {
      type = 3
    } else if (params.aftersales_type == 'REFUND_GOODS' && !params.goods_returned) {
      type = 4
    } else if (params.aftersales_type == 'REFUND_GOODS' && params.goods_returned) {
      type = 5
    }
    Taro.redirectTo({ url: `/subpages/dianwu/trade/result?type=${type}` })
  }

  const onChangeItemCheck = (item, index, e) => {
    setState((draft) => {
      draft.info.items[index].checked = e
      if (e && currentAftersalesType === 'ONLY_REFUND' && isUnshippedItem(item)) {
        draft.info.items[index].refundNum = item.leftRefundOnlyNum
      }
    })
  }

  const onChangeItemNum = (e, index) => {
    setState((draft) => {
      draft.info.items[index].refundNum = Number(e)
    })
  }

  const onTabChange = (e) => {
    setState((draft) => {
      draft.curTabIdx = e
      const nextType = (OnlyRefundShow ? tabList : tabListRefundGoodsOnly)[e]?.status
      if (!nextType || !draft.info?.items) return

      draft.info.items.forEach((item) => {
        item.checked = false
        if (nextType === 'ONLY_REFUND') {
          if (item.deliveryStatus !== 'DONE' && item.leftRefundOnlyNum) {
            item.refundNum = item.leftRefundOnlyNum
          }
        } else if (nextType === 'REFUND_GOODS') {
          if (item.leftAftersalesNum && item.refundNum > item.leftAftersalesNum) {
            item.refundNum = item.leftAftersalesNum
          }
        }
      })
    })
  }

  const reasonDisplayText =
    reason !== '' && reason !== undefined && reason !== null
      ? $t(REFUND_REASON_KEYS[Number(reason)])
      : $t('c3455657.cf234c')

  return (
    <SpPage
      className='page-dianwu-sale-after'
      renderFooter={
        <View className='btn-wrap'>
          <SpButton confirmText={$t('c3455657.939d53')} onReset={onCancel} onConfirm={onConfirm} />
        </View>
      }
    >
      <AtTabs current={curTabIdx} tabList={visibleTabList} onClick={onTabChange} />

      <CompTradeInfo
        onFetch={(data) => {
          setState((draft) => {
            draft.info = data
            draft.offline_freight_status = !!data.offline_freight_status
            draft.curTabIdx = 0
          })
        }}
      />

      <View className='picker-reason'>
        <Picker
          mode='selector'
          range={reasonPickerRange}
          onChange={(e) => {
            setState((draft) => {
              draft.reason = e.detail.value
            })
          }}
        >
          <SpCell
            title={$t('c3455657.220bc2')}
            isLink
            value={<Text>{reasonDisplayText}</Text>}
          ></SpCell>
        </Picker>
      </View>

      <View className='refund-items'>
        <View className='title'>{$t('c3455657.67148e')}</View>
        <View className='items-container'>
          {info?.items.map((item, index) => {
            const selectable = canSelectAftersaleItem(item)
            const onlyRefundBlocked =
              currentAftersalesType === 'ONLY_REFUND' && item.deliveryStatus === 'DONE'
            return (
              <View
                className={classNames('item-wrap', {
                  'item-wrap--disabled': !selectable,
                  'item-wrap--checked': item.checked
                })}
                key={`item-wrap__${index}`}
              >
                <View className='item-hd'>
                  <SpCheckbox
                    disabled={!selectable}
                    checked={item.checked}
                    onChange={onChangeItemCheck.bind(this, item, index)}
                  />
                </View>
                <View className='item-bd'>
                  <View className='goods-pic'>
                    <SpImage src={item.pic} width={128} height={128} radius={8} />
                    {item.deliveryStatus === 'DONE' ? (
                      <Text className='goods-pic__tag goods-pic__tag--done'>
                        {$t('403c9269.355409')}
                      </Text>
                    ) : (
                      <Text className='goods-pic__tag goods-pic__tag--pending'>
                        {$t('403c9269.d8476e')}
                      </Text>
                    )}
                  </View>
                  <View className='goods-info'>
                    <View className='goods-info-hd'>
                      <Text className='goods-title'>
                        {item.isPrescription == 1 && (
                          <Text className='prescription-drug'>{$t('7d82f6d2.e8b7e1')}</Text>
                        )}
                        {item.itemName}
                      </Text>
                      <Text className='goods-num'>{ti('2b4b2b4f.43ebc8', [item.num])}</Text>
                    </View>
                    <View>
                      <SpPrice value={item.price / item.num} />
                    </View>
                    <View className='goods-info-bd'>
                      <View className='sku-info'>
                        {item.itemSpecDesc && (
                          <Text>{ti('c3455657.d0c997', [item.itemSpecDesc])}</Text>
                        )}
                      </View>
                      <View className='goods-info-ft'>
                        <Text className='refund-num-label'>{$t('44d65d28.3a1664')}</Text>
                        <SpInputNumber
                          disabled={!canChangeRefundNum(item)}
                          value={getRefundNumValue(item)}
                          max={getRefundNumMax(item)}
                          min={1}
                          onChange={(val) => onChangeItemNum(val, index)}
                        />
                      </View>
                      {onlyRefundBlocked ? (
                        <View className='goods-info-tip'>{$t('44d65d28.47107ea8')}</View>
                      ) : null}
                    </View>
                  </View>
                </View>
              </View>
            )
          })}
        </View>
      </View>

      <View className='refund-detail'>
        {(currentAftersalesType === 'ONLY_REFUND' ||
          (currentAftersalesType === 'REFUND_GOODS' &&
            offline_freight_status &&
            fullFreight != 0)) && (
          <View className='refund-amount'>
            <SpCell
              title={info?.freightType == 'cash' ? $t('44d65d28.093620') : $t('44d65d28.e4f346')}
              value={<Text className='readonly-value'>{refundFreight}</Text>}
            ></SpCell>
          </View>
        )}

        <View className='refund-amount refund-amount--fee'>
          <SpCell
            title={$t('c3455657.a0cd4c')}
            value={<Text className='readonly-value'>{realRefundFee}</Text>}
          ></SpCell>
        </View>

        <View className='refund-point'>
          <SpCell
            title={$t('44d65d28.401595')}
            value={<Text className='readonly-value'>{realRefundPoint}</Text>}
          ></SpCell>
        </View>
      </View>

      {currentAftersalesType === 'REFUND_GOODS' && (
        <View className='return-goods-type'>
          <SpCell
            title={$t('c3455657.89c604')}
            value={
              <SpSelect
                info={goodsReturnedList}
                value={goodsReturned}
                onChange={(e) => {
                  setState((draft) => {
                    draft.goodsReturned = e
                  })
                }}
              />
            }
          ></SpCell>
        </View>
      )}

      <View className='desc-container'>
        <View className='title'>{$t('c3455657.cf422d')}</View>
        <View className='desc-content'>
          <AtTextarea
            type='textarea'
            name='description'
            value={description}
            placeholder={$t('c3455657.5598b0')}
            maxLength={200}
            onChange={(e) => {
              setState((draft) => {
                draft.description = e
              })
            }}
          />
          <SpUpload
            value={pic}
            multiple={false}
            onChange={(val) => {
              setState((draft) => {
                draft.pic = val
              })
            }}
          />
        </View>
      </View>
    </SpPage>
  )
}

DianwuTradeSaleAfter.options = {
  addGlobalClass: true
}

export default DianwuTradeSaleAfter
