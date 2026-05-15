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
  SpPrice,
  SpInput as AtInput
} from '@/components'
import { View, Text, Picker } from '@tarojs/components'
import { showToast, isNumber } from '@/utils'
import { useTranslation, $t, ti } from '@/i18n'
import { useNavigation } from '@/hooks'
import { REFUND_REASON_API, REFUND_REASON_KEYS } from '../const/refund-reason-options'
import CompTradeInfo from './../comps/comp-trade-info'
import './sale-after.scss'

const initialState = {
  info: null,
  curTabIdx: 0,
  reason: '',
  refundFee: 0,
  refundPoint: 0,
  goodsReturned: [1],
  description: '',
  pic: ''
}

function DianwuTradeSaleAfter(props) {
  const { i18n } = useTranslation()
  const { setNavigationBarTitle } = useNavigation()
  const $instance = getCurrentInstance() || {}
  const [state, setState] = useImmer(initialState)
  const { info, curTabIdx, reason, refundFee, refundPoint, goodsReturned, description, pic } = state

  useEffect(() => {
    const syncTitle = () => setNavigationBarTitle($t('b1cd948c.1198ee'))
    syncTitle()
    i18n.on('languageChanged', syncTitle)
    return () => i18n.off('languageChanged', syncTitle)
  }, [setNavigationBarTitle, i18n])

  const tabList = useMemo(
    () => [
      { title: $t('c3455657.6b8821'), status: 'ONLY_REFUND' },
      { title: $t('c3455657.cc0193'), status: 'REFUND_GOODS' }
    ],
    [i18n.language]
  )

  const reasonPickerRange = useMemo(() => REFUND_REASON_KEYS.map((k) => $t(k)), [i18n.language])

  const goodsReturnedList = useMemo(
    () => [
      { id: 1, name: $t('c3455657.118582') },
      { id: 2, name: $t('c3455657.37d0ec') }
    ],
    [i18n.language]
  )

  useEffect(() => {
    if (info) {
      const { items } = info
      setState((draft) => {
        draft.refundFee = items
          .filter((item) => item.checked)
          .reduce((sum, { totalFee, num, refundNum }) => sum + (totalFee / num) * refundNum, 0)
      })
    }
  }, [info])

  const onCancel = () => {
    Taro.navigateBack()
  }

  const onConfirm = async () => {
    if (reason === '' || reason == null) {
      return showToast($t('c3455657.9318de'))
    }
    const { trade_id } = $instance?.router?.params
    const [img] = pic || []
    const items = info?.items
      .filter((item) => item.checked)
      .map((item) => {
        return {
          id: item.id,
          num: item.refundNum
        }
      })
    if (items.length == 0) {
      return showToast($t('c3455657.d83f4b'))
    }
    console.log(isNumber(refundFee), refundFee)
    if (!isNumber(refundFee)) {
      return showToast($t('c3455657.051593'))
    }
    if (refundFee > getRealRefundFee()) {
      return showToast($t('c3455657.c8f20b'))
    }
    if (!isNumber(refundPoint)) {
      return showToast($t('c3455657.908bf7'))
    }
    const params = {
      order_id: trade_id,
      aftersales_type: tabList[curTabIdx].status,
      goods_returned: goodsReturned[0] == 2,
      reason: REFUND_REASON_API[Number(reason)],
      detail: JSON.stringify(items),
      refund_fee: refundFee * 100,
      refund_point: refundPoint,
      description,
      evidence_pic: [img]
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
    })
  }

  const onChangeItemNum = (e, index) => {
    setState((draft) => {
      draft.info.items[index].refundNum = e
    })
  }

  const getRealRefundFee = () => {
    let rFee = 0
    if (info) {
      const { items } = info
      rFee = items
        .filter((item) => item.checked)
        .reduce((sum, { totalFee, num, refundNum }) => sum + (totalFee / num) * refundNum, 0)
    }

    return rFee
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
      <AtTabs
        current={curTabIdx}
        tabList={tabList}
        onClick={(e) => {
          setState((draft) => {
            draft.curTabIdx = e
          })
        }}
      />

      <CompTradeInfo
        onFetch={(data) => {
          setState((draft) => {
            draft.info = data
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
          {info?.items.map((item, index) => (
            <View className='item-wrap' key={`item-wrap__${index}`}>
              <View className='item-hd'>
                <SpCheckbox
                  disabled={!item.leftAftersalesNum}
                  checked={item.checked}
                  onChange={onChangeItemCheck.bind(this, item, index)}
                />
              </View>
              <View className='item-bd'>
                <SpImage src={item.pic} width={128} height={128} radius={8} />
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
                    <SpPrice value={item.totalFee / item.num} />
                  </View>
                  <View className='goods-info-bd'>
                    <View className='sku-info'>
                      {item.itemSpecDesc && (
                        <Text>{ti('c3455657.d0c997', [item.itemSpecDesc])}</Text>
                      )}
                    </View>
                    <SpInputNumber
                      disabled={!item.leftAftersalesNum}
                      value={item.refundNum}
                      max={item.leftAftersalesNum}
                      min={1}
                      onChange={(e) => onChangeItemNum(e, index)}
                    />
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className='refund-amount'>
        <SpCell
          title={$t('c3455657.a0cd4c')}
          value={
            <AtInput
              name='refund_fee'
              value={refundFee}
              onChange={(e) => {
                setState((draft) => {
                  draft.refundFee = parseFloat(e)
                })
              }}
            />
          }
        ></SpCell>
        <View className='cell-tip'>{ti('c3455657.a6da72', [getRealRefundFee()])}</View>
      </View>

      <View className='refund-point'>
        <SpCell
          title={$t('c3455657.401595')}
          value={
            <AtInput
              name='refund_point'
              value={refundPoint}
              onChange={(e) => {
                setState((draft) => {
                  draft.refundPoint = parseFloat(e)
                })
              }}
            />
          }
        ></SpCell>
        <View className='cell-tip'>{ti('c3455657.d2f35c', [info?.refundPoint ?? ''])}</View>
      </View>

      {curTabIdx == 1 && (
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
