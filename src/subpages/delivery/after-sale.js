/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { AtButton, AtTextarea } from 'taro-ui'
import {
  SpPage,
  SpTabs,
  SpCell,
  SpCheckbox,
  SpImage,
  SpInputNumber,
  SpFloatLayout,
  SpUpload,
  SpPrice,
  SpHtml,
  SpInput as AtInput
} from '@/components'
import { View, Text, Picker, ScrollView } from '@tarojs/components'
import { AFTER_SALE_TYPE } from '@/consts'
import { pickBy, showToast, classNames, VERSION_STANDARD, VERSION_PLATFORM } from '@/utils'
import { useTranslation, $t } from '@/i18n'
import './after-sale.scss'

const initialState = {
  info: null,
  curTabIdx: 0,
  fetchDone: false,
  reasonIndex: '',
  reasons: [],
  refundFee: 0,
  refundPoint: 0,
  refundType: 'offline',
  description: '',
  pic: '',
  // 用于云店后台交易设置-到店退货关闭时判断
  offlineAftersalesIsOpen: false,
  offlineAftersales: false,
  hideOfflineReturnOption: false,
  refundStore: '', // 退货门店
  contact: '', // 联系人
  mobile: '', // 联系电话
  openRefundType: false,
  selectRefundValue: 'offline',
  afterSaleDesc: {
    intro: '',
    is_open: false
  }
}

function TradeAfterSale(props) {
  const $instance = getCurrentInstance() || {}
  const [state, setState] = useImmer(initialState)
  const pageRef = useRef()
  const {
    info,
    curTabIdx,
    fetchDone,
    reasonIndex,
    reasons,
    refundFee,
    refundPoint,
    refundType,
    description,
    pic,
    openRefundType,
    selectRefundValue,
    refundStore,
    contact,
    mobile,
    afterSaleDesc,
    offlineAftersalesIsOpen,
    offlineAftersales,
    hideOfflineReturnOption
  } = state
  const { deliveryPersonnel } = useSelector((state) => state.cart)
  const { i18n } = useTranslation()

  const tabList = useMemo(
    () =>
      AFTER_SALE_TYPE().map((item) => ({
        ...item,
        title: item.type === 'ONLY_REFUND' ? $t('a956013f.6b8821') : $t('a956013f.cc0193')
      })),
    [i18n.language]
  )

  const refundTypeListBase = useMemo(
    () => [
      { title: $t('a956013f.ed91f2'), desc: $t('a956013f.64435c'), value: 'logistics' },
      { title: $t('a956013f.11b600'), desc: $t('a956013f.6bd56e'), value: 'offline' }
    ],
    [i18n.language]
  )

  const refundTypeList = useMemo(() => {
    if (!fetchDone) {
      return refundTypeListBase
    }
    if (hideOfflineReturnOption) {
      return refundTypeListBase.filter((item) => item.value != 'offline')
    }
    return refundTypeListBase
  }, [fetchDone, refundTypeListBase, hideOfflineReturnOption])

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('a956013f.45eb0c') })
  }, [i18n.language])

  useEffect(() => {
    fetch()
    Taro.eventCenter.on('onEventPickerStore', (item) => {
      console.log('onEventPickerStore:', item)
      setState((draft) => {
        draft.refundStore = item
      })
    })

    return () => {
      Taro.eventCenter.off('onEventPickerStore')
    }
  }, [])

  useEffect(() => {
    if (openRefundType) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [openRefundType])

  const onCancel = () => {
    Taro.navigateBack()
  }

  const fetch = async () => {
    const { id } = $instance?.router?.params
    const { orderInfo, offline_aftersales_is_open, distributor } = await api.trade.detail(id, {
      ...deliveryPersonnel
    })
    const reasons = await api.aftersales.reasonList({ ...deliveryPersonnel })
    const { intro, is_open } = await api.aftersales.remindDetail({ ...deliveryPersonnel })
    const { offline_aftersales } = distributor
    const _info = pickBy(orderInfo, doc.trade.TRADE_ITEM)
    setState((draft) => {
      draft.info = _info
      draft.reasons = reasons
      draft.offlineAftersalesIsOpen = offline_aftersales_is_open
      draft.offlineAftersales = offline_aftersales == 1
      draft.afterSaleDesc = {
        intro,
        is_open
      }
      draft.hideOfflineReturnOption =
        (VERSION_STANDARD && !offline_aftersales_is_open) ||
        (VERSION_PLATFORM && offline_aftersales == 0)
      if (draft.hideOfflineReturnOption) {
        draft.refundType = 'logistics'
      }
      draft.fetchDone = true
    })
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
        .reduce((sum, { price, num, refundNum }) => sum + (price / num) * refundNum, 0)
    }
    return rFee.toFixed(2)
  }

  const getRealRefundPoint = () => {
    let rPoint = 0
    if (info) {
      const { items } = info
      rPoint = items
        .filter((item) => item.checked)
        .reduce((sum, { point, num, refundNum }) => sum + (point / num) * refundNum, 0)
    }
    return rPoint.toFixed(2)
  }

  const onChangeRefundType = ({ value }) => {
    setState((draft) => {
      draft.selectRefundValue = value
    })
  }

  const getRefundTypeName = () => {
    const { title } = refundTypeList.find((item) => item.value == refundType) || {}
    return title
  }

  const onSubmit = async () => {
    const { id } = $instance?.router?.params
    const checkedItems = info?.items.filter((item) => !!item.checked)
    if (checkedItems.length == 0) {
      return showToast($t('a956013f.d83f4b'))
    }

    if (!reasons?.[reasonIndex]) {
      return showToast($t('a956013f.d030d6'))
    }
    const aftersales_type = tabList[curTabIdx].type
    const reason = reasons?.[reasonIndex]
    let params = {
      detail: checkedItems.map(({ id: _id, refundNum }) => {
        return {
          id: _id,
          num: refundNum
        }
      }),
      order_id: id,
      aftersales_type,
      reason,
      description,
      evidence_pic: pic,
      self_delivery_operator_id: info.selfDeliveryOperatorId,
      user_id: info.userId
    }
    // 退货退款
    if (aftersales_type == 'REFUND_GOODS') {
      params = {
        ...params,
        return_type: refundType
      }
      // 到店退货
      if (refundType == 'offline') {
        if (!refundStore) {
          return showToast($t('a956013f.504d95'))
        }
        if (!contact) {
          return showToast($t('a956013f.e30625'))
        }
        if (!mobile) {
          return showToast($t('a956013f.0e606b'))
        }
        params = {
          ...params,
          return_type: refundType,
          aftersales_address_id: refundStore.address_id,
          contact,
          mobile
        }
      }
    }
    await api.aftersales.apply(params)
    showToast($t('a956013f.23b62e'))
    Taro.eventCenter.trigger('onEventOrderStatusChange')
    Taro.eventCenter.trigger('onEventAfterSalesApply')
    setTimeout(() => {
      Taro.navigateBack()
    }, 200)
  }

  return (
    <SpPage
      ref={pageRef}
      className='page-trade-after-sale'
      renderFooter={
        <View className='btn-wrap'>
          <AtButton circle type='primary' onClick={onSubmit}>
            {$t('a956013f.939d53')}
          </AtButton>
        </View>
      }
    >
      <ScrollView scrollY className='scroll-view'>
        <View className='scroll-view-body'>
          <SpTabs
            current={curTabIdx}
            tablist={tabList}
            onChange={(e) => {
              setState((draft) => {
                draft.curTabIdx = e
              })
            }}
          />

          <View className='refund-items'>
            <View className='items-container'>
              {info?.items?.map((item, index) => (
                <View className='item-wrap' key={`item-wrap__${index}`}>
                  <View className='item-hd'>
                    <SpCheckbox
                      disabled={!item.leftAftersalesNum}
                      checked={item.checked}
                      onChange={onChangeItemCheck.bind(this, item, index)}
                    />
                  </View>
                  <View className='item-bd'>
                    <SpImage src={item.pic} width={128} height={128} radius={8} circle={8} />
                    <View className='goods-info'>
                      <View className='goods-info-hd'>
                        <Text className='goods-title'>{item.itemName}</Text>
                      </View>
                      <View className='goods-info-bd'>
                        <View>
                          {item.itemSpecDesc && (
                            <Text className='sku-info'>{`${item.itemSpecDesc}`}</Text>
                          )}
                        </View>
                        <View>
                          <SpPrice size={28} value={item.price / item.num} /> x{' '}
                          <Text className='num'>{item.num}</Text>
                        </View>
                      </View>
                      <View className='goods-info-ft'>
                        <Text>{$t('a956013f.3a1664')}</Text>
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

          <View className='picker-reason'>
            <Picker
              mode='selector'
              range={reasons}
              onChange={(e) => {
                setState((draft) => {
                  draft.reasonIndex = e.detail.value
                })
              }}
            >
              <SpCell
                title={$t('a956013f.220bc2')}
                isLink
                value={<Text>{`${reasons?.[reasonIndex] || $t('a956013f.cf234c')}`}</Text>}
              ></SpCell>
            </Picker>
          </View>

          <View className='refund-detail'>
            <View className='refund-amount'>
              <SpCell title={$t('a956013f.a0cd4c')} value={getRealRefundFee()} />
            </View>

            <View className='refund-point'>
              {/* <SpCell title='退积分' value={info?.point} /> */}
              <SpCell title={$t('a956013f.401595')} value={getRealRefundPoint()} />
            </View>
          </View>

          {curTabIdx == 1 && (
            <View className='return-goods-type'>
              <SpCell
                border
                title={$t('a956013f.b85b43')}
                value={getRefundTypeName()}
                isLink
                onClick={() => {
                  setState((draft) => {
                    draft.openRefundType = true
                    draft.selectRefundValue = refundType
                  })
                }}
              ></SpCell>
              {refundType == 'offline' &&
                ((offlineAftersalesIsOpen && VERSION_STANDARD) ||
                  (VERSION_PLATFORM && offlineAftersales)) && (
                  <>
                    <SpCell
                      border
                      title={$t('a956013f.611301')}
                      isLink
                      value={
                        <Text
                          className={classNames({
                            'placeholder': !refundStore
                          })}
                        >
                          {refundStore ? refundStore.name : $t('a956013f.504d95')}
                        </Text>
                      }
                      onClick={() => {
                        Taro.navigateTo({
                          url: `/subpages/trade/store-picker?distributor_id=${info.distributorId}&refund_store=${refundStore?.address_id}`
                        })
                      }}
                    />
                    <SpCell
                      border
                      title={$t('a956013f.52409d')}
                      value={
                        <AtInput
                          name='contact'
                          value={contact}
                          placeholder={$t('a956013f.12761a')}
                          onChange={(e) => {
                            setState((draft) => {
                              draft.contact = e
                            })
                          }}
                        />
                      }
                    ></SpCell>
                    <SpCell
                      title={$t('a956013f.09a1f6')}
                      value={
                        <AtInput
                          name='mobile'
                          value={mobile}
                          placeholder={$t('a956013f.a5e898')}
                          onChange={(e) => {
                            setState((draft) => {
                              draft.mobile = e
                            })
                          }}
                        />
                      }
                    ></SpCell>
                  </>
                )}
            </View>
          )}

          <View className='desc-container'>
            <View className='title'>{$t('a956013f.f55683')}</View>
            <View className='desc-content'>
              <Text className='iconfont icon-bianji1'></Text>
              <AtTextarea
                type='textarea'
                name='description'
                value={description}
                placeholder={$t('a956013f.4ab433')}
                maxLength={200}
                onChange={(e) => {
                  setState((draft) => {
                    draft.description = e
                  })
                }}
              />
            </View>
            <SpUpload
              value={pic}
              max={3}
              onChange={(val) => {
                setState((draft) => {
                  draft.pic = val
                })
              }}
            />
          </View>

          {afterSaleDesc.is_open && (
            <View className='after-sale-desc'>
              <View className='desc-title'>
                <Text className='iconfont icon-xinxi'></Text>
                {$t('a956013f.be1476')}
              </View>
              <SpHtml content={afterSaleDesc.intro} />
            </View>
          )}
        </View>
      </ScrollView>

      <SpFloatLayout
        title={$t('a956013f.5add21')}
        className='refund-type'
        open={openRefundType}
        onClose={() => {
          setState((draft) => {
            draft.openRefundType = false
          })
        }}
        renderFooter={
          <AtButton
            circle
            type='primary'
            onClick={() => {
              setState((draft) => {
                draft.refundType = selectRefundValue
                draft.openRefundType = false
              })
            }}
          >
            {$t('a956013f.38cf16')}
          </AtButton>
        }
      >
        {refundTypeList?.length > 0 &&
          refundTypeList?.map((item, index) => (
            <View className='refund-type-item' key={`refund-type-item__${index}`}>
              <SpCheckbox
                checked={item.value == selectRefundValue}
                onChange={onChangeRefundType.bind(this, item)}
              >
                <View className='refund-item-wrap'>
                  <View className='title'>{item.title}</View>
                  <View className='desc'>{item.desc}</View>
                </View>
              </SpCheckbox>
            </View>
          ))}
      </SpFloatLayout>
    </SpPage>
  )
}

TradeAfterSale.options = {
  addGlobalClass: true
}

export default TradeAfterSale
