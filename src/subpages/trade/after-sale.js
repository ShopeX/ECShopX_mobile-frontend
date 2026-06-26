/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useMemo } from 'react'
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
import { View, Text, Picker } from '@tarojs/components'
import { AFTER_SALE_TYPE, REFUND_FEE_TYPE, AFTER_SALE_TYPE1 } from '@/consts'
import { pickBy, showToast, classNames, VERSION_STANDARD, VERSION_PLATFORM } from '@/utils'
import { useTranslation, $t, ti } from '@/i18n'
import { useNavigation } from '@/hooks'
import './after-sale.scss'

const initialState = {
  info: null,
  curTabIdx: 0,
  tabList: AFTER_SALE_TYPE(),
  tabList1: AFTER_SALE_TYPE1(),
  reasonIndex: '',
  reasons: [],
  refundFee: 0,
  refundPoint: 0,
  refundType: 'logistics',
  description: '',
  pic: '',
  // 用于云店后台交易设置-到店退货关闭时判断
  offlineAftersalesIsOpen: false,
  offlineAftersales: false,
  refundTypeList: REFUND_FEE_TYPE(),
  refundStore: '', // 退货门店
  contact: '', // 联系人
  offline_freight: '', //运费
  mobile: '', // 联系电话
  openRefundType: false,
  selectRefundValue: 'logistics',
  afterSaleDesc: {
    intro: '',
    is_open: false
  },
  offline_freight_status: false
}

function TradeAfterSale(props) {
  const { i18n } = useTranslation()
  const { setNavigationBarTitle } = useNavigation()
  const $instance = getCurrentInstance() || {}
  const [state, setState] = useImmer(initialState)
  const {
    info,
    curTabIdx,
    tabList,
    tabList1,
    reasonIndex,
    reasons,
    refundFee,
    refundPoint,
    refundType,
    refundTypeList,
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
    offline_freight_status,
    offline_freight
  } = state

  const OnlyRefundShow = useMemo(() => {
    return info && info.deliveryStatus != 'DONE'
  }, [info])

  const currentAftersalesType = useMemo(() => {
    const list = OnlyRefundShow ? tabList : tabList1
    return list[curTabIdx]?.type
  }, [OnlyRefundShow, tabList, tabList1, curTabIdx])

  const realRefundFee = useMemo(() => {
    if (!info) return '0.00'
    const rFee = info.items
      .filter((item) => item.checked)
      .reduce((sum, { price, num, refundNum }) => sum + (price / num) * refundNum, 0)
    return rFee.toFixed(2)
  }, [info])

  const realRefundPoint = useMemo(() => {
    if (!info) return 0
    return info.items
      .filter((item) => item.checked)
      .reduce((sum, { point, num, refundNum, leftAftersalesNum }) => {
        if (leftAftersalesNum == refundNum) {
          return Math.ceil(sum + (point / num) * refundNum)
        }
        if (num > refundNum) {
          return Math.floor(sum + (point / num) * refundNum)
        }
        return sum + (point / num) * refundNum
      }, 0)
  }, [info])

  useEffect(() => {
    const syncTitle = () => setNavigationBarTitle($t('b3d4a245.45eb0c'))
    syncTitle()
    i18n.on('languageChanged', syncTitle)
    return () => i18n.off('languageChanged', syncTitle)
  }, [setNavigationBarTitle, i18n])

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

  const onCancel = () => {
    Taro.navigateBack()
  }

  const fetch = async () => {
    const { id } = $instance?.router?.params
    const { orderInfo, offline_aftersales_is_open, distributor } = await api.trade.detail(id)
    const reasons = await api.aftersales.reasonList()
    const { intro, is_open } = await api.aftersales.remindDetail()
    const { offline_aftersales, is_refund_freight } = distributor || {}
    const _info = pickBy(orderInfo, doc.trade.TRADE_ITEM)
    setState((draft) => {
      draft.info = _info
      draft.reasons = reasons
      draft.offlineAftersalesIsOpen = offline_aftersales_is_open
      draft.offlineAftersales = offline_aftersales == 1
      draft.offline_freight_status = is_refund_freight == 1
      draft.afterSaleDesc = {
        intro,
        is_open
      }
      draft.offline_freight =
        _info?.freightType == 'cash' ? _info?.freightFee : _info?.freightFeePoint
      if (
        (VERSION_STANDARD && !offline_aftersales_is_open) ||
        (VERSION_PLATFORM && offline_aftersales == 0)
      ) {
        draft.refundTypeList = REFUND_FEE_TYPE().filter((item) => item.value != 'offline')
        draft.refundType = 'logistics'
      }
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
      return showToast($t('44d65d28.d83f4b'))
    }

    if (!reasons?.[reasonIndex]) {
      return showToast($t('44d65d28.d030d6'))
    }
    const aftersales_type = currentAftersalesType
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
      evidence_pic: pic
    }
    if (offline_freight_status) {
      params.freight = info?.freightType == 'cash' ? offline_freight * 100 : offline_freight
    }
    // 退货退款
    if (aftersales_type == 'REFUND_GOODS') {
      params = {
        ...params,
        return_type: refundType
      }
      if (offline_freight > info?.freightFee && info?.freightType == 'cash') {
        return showToast(ti('44d65d28.3ee197', [info?.freightFee]))
      }
      if (offline_freight > info?.freightFeePoint && info?.freightType == 'point') {
        return showToast(ti('44d65d28.a5b3a4', [info?.freightFeePoint]))
      }
      // 到店退货
      if (refundType == 'offline') {
        if (!refundStore) {
          return showToast($t('44d65d28.504d95'))
        }
        if (!contact) {
          return showToast($t('44d65d28.e30625'))
        }
        if (!mobile) {
          return showToast($t('44d65d28.0e606b'))
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
    console.log(params)
    await api.aftersales.apply(params)
    showToast($t('44d65d28.23b62e'))
    Taro.eventCenter.trigger('onEventOrderStatusChange')
    Taro.eventCenter.trigger('onEventAfterSalesApply')
    setTimeout(() => {
      Taro.navigateBack()
    }, 200)
  }

  return (
    <SpPage
      className='page-trade-after-sale'
      renderFooter={
        <View className='btn-wrap'>
          <AtButton circle type='primary' onClick={onSubmit}>
            {$t('44d65d28.939d53')}
          </AtButton>
        </View>
      }
    >
      <View className='page-content'>
          <SpTabs
            current={curTabIdx}
            tablist={OnlyRefundShow ? tabList : tabList1}
            onChange={(e) => {
              setState((draft) => {
                draft.curTabIdx = e
              })
            }}
          />

          <View className='refund-items'>
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
                    <SpImage
                      mode='aspectFit'
                      src={item.pic}
                      width={128}
                      height={128}
                      radius={8}
                      circle={8}
                    />
                    <View className='goods-info'>
                      <View className='goods-info-hd'>
                        <Text className='goods-title'>
                          {item?.isPrescription == 1 && (
                            <Text className='prescription-drug'>{$t('44d65d28.e8b7e1')}</Text>
                          )}
                          {item.itemName}
                        </Text>
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
                        <Text>{$t('44d65d28.3a1664')}</Text>
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
                title={$t('44d65d28.220bc2')}
                isLink
                value={<Text>{`${reasons?.[reasonIndex] || $t('44d65d28.cf234c')}`}</Text>}
              ></SpCell>
            </Picker>
          </View>

          <View className='refund-detail'>
            {/* 输入的运费不能大于可退款的运费 */}
            {info?.freightFee != 0 && offline_freight_status && (
              <View className='refund-amount'>
                <SpCell
                  border
                  title={
                    info?.freightType == 'cash' ? $t('44d65d28.093620') : $t('44d65d28.e4f346')
                  }
                  value={
                    <AtInput
                      name='offline_freight'
                      value={offline_freight}
                      placeholder={$t('44d65d28.5b78b0')}
                      onChange={(e) => {
                        setState((draft) => {
                          draft.offline_freight = e
                        })
                      }}
                    />
                  }
                ></SpCell>
              </View>
            )}

            <View className='refund-amount'>
              <SpCell title={$t('44d65d28.a0cd4c')} value={realRefundFee} />
            </View>

            <View className='refund-point'>
              {/* <SpCell title='退积分' value={info?.point} /> */}
              <SpCell title={$t('44d65d28.401595')} value={realRefundPoint} />
            </View>
          </View>

          {currentAftersalesType === 'REFUND_GOODS' && (
            <View className='return-goods-type'>
              <SpCell
                border
                title={$t('44d65d28.b85b43')}
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
                      title={$t('44d65d28.611301')}
                      isLink
                      value={
                        <Text
                          className={classNames({
                            'placeholder': !refundStore
                          })}
                        >
                          {refundStore ? refundStore.name : $t('44d65d28.504d95')}
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
                      title={$t('44d65d28.52409d')}
                      value={
                        <AtInput
                          name='contact'
                          value={contact}
                          placeholder={$t('44d65d28.12761a')}
                          onChange={(e) => {
                            setState((draft) => {
                              draft.contact = e
                            })
                          }}
                        />
                      }
                    ></SpCell>
                    <SpCell
                      title={$t('44d65d28.09a1f6')}
                      value={
                        <AtInput
                          name='mobile'
                          value={mobile}
                          placeholder={$t('44d65d28.a5e898')}
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
            <View className='title'>{$t('44d65d28.f55683')}</View>
            <View className='desc-content'>
              <Text className='iconfont icon-bianji1'></Text>
              <AtTextarea
                type='textarea'
                name='description'
                value={description}
                placeholder={$t('44d65d28.4ab433')}
                maxLength={200}
                placeholderStyle='padding-left: 10px;'
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
                {$t('44d65d28.be1476')}
              </View>
              <SpHtml content={afterSaleDesc.intro} />
            </View>
          )}
      </View>

      <SpFloatLayout
        title={$t('44d65d28.5add21')}
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
            {$t('44d65d28.38cf16')}
          </AtButton>
        }
      >
        {refundTypeList.map((item, index) => (
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
