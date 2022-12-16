import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux"
import { useImmer } from "use-immer"
import Taro, { getCurrentInstance } from "@tarojs/taro";
import api from "@/api"
import doc from "@/doc"
import { AtButton, AtInput, AtTextarea } from 'taro-ui'
import { SpPage, SpTabs, SpCell, SpCheckbox, SpImage, SpInputNumber, SpFloatLayout, SpUpload, SpPrice, SpHtml } from '@/components'
import { View, Text, Picker } from "@tarojs/components"
import { AFTER_SALE_TYPE, REFUND_FEE_TYPE } from '@/consts'
import { pickBy, showToast, classNames, VERSION_STANDARD, VERSION_PLATFORM } from '@/utils'
import "./after-sale.scss";

const initialState = {
  info: null,
  curTabIdx: 0,
  tabList: AFTER_SALE_TYPE,
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
  refundTypeList: REFUND_FEE_TYPE,
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
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const pageRef = useRef()
  const { info, curTabIdx, tabList, reasonIndex, reasons, refundFee, refundPoint, refundType, refundTypeList, description, pic, openRefundType, selectRefundValue,
    refundStore, contact, mobile, afterSaleDesc, offlineAftersalesIsOpen, offlineAftersales } = state

  useEffect(() => {
    fetch()
    Taro.eventCenter.on('onEventPickerStore', (item) => {
      console.log('onEventPickerStore:', item)
      setState(draft => {
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
    const { id } = $instance.router.params
    const { orderInfo, offline_aftersales_is_open, distributor } = await api.trade.detail(id)
    const reasons = await api.aftersales.reasonList()
    const { intro, is_open } = await api.aftersales.remindDetail()
    const { offline_aftersales } =  distributor
    const _info = pickBy(orderInfo, doc.trade.TRADE_ITEM)
    setState(draft => {
      draft.info = _info
      draft.reasons = reasons
      draft.offlineAftersalesIsOpen = offline_aftersales_is_open
      draft.offlineAftersales = offline_aftersales == 1
      draft.afterSaleDesc = {
        intro,
        is_open
      }
      if ((VERSION_STANDARD && !offline_aftersales_is_open) || (VERSION_PLATFORM && offline_aftersales == 0)) {
        draft.refundTypeList = REFUND_FEE_TYPE.filter(item => item.value != 'offline')
        draft.refundType = 'logistics'
      }
    })
  }

  const onChangeItemCheck = (item, index, e) => {
    setState(draft => {
      draft.info.items[index].checked = e
    })
  }

  const onChangeItemNum = (e, index) => {

    setState(draft => {
      draft.info.items[index].refundNum = e
    })
  }

  const getRealRefundFee = () => {
    let rFee = 0
    if (info) {
      const { items } = info
      rFee = items
        .filter((item) => item.checked)
        .reduce((sum, { price, num, refundNum }) => sum + price / num * refundNum, 0)
    }
    return rFee
  }

  const onChangeRefundType = ({ value }) => {
    setState(draft => {
      draft.selectRefundValue = value
    })
  }

  const getRefundTypeName = () => {
    const { title } = refundTypeList.find(item => item.value == refundType) || {}
    return title
  }

  const onSubmit = async () => {
    const { id } = $instance.router.params
    const checkedItems = info?.items.filter(item => !!item.checked)
    if (checkedItems.length == 0) {
      return showToast('请选择需要售后的商品')
    }

    if (!reasons?.[reasonIndex]) {
      return showToast('请选择售后原因')
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
      evidence_pic: pic
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
          return showToast('请选择退货门店')
        }
        if (!contact) {
          return showToast('请输入联系人姓名')
        }
        if (!mobile) {
          return showToast('请输入联系人电话')
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
    showToast('提交成功')
    setTimeout(() => {
      Taro.redirectTo({
        url: `/subpage/pages/trade/detail?id=${id}`
      })
    }, 200)
  }

  return <SpPage ref={pageRef} className='page-trade-after-sale' renderFooter={
    <View className='btn-wrap'>
      <AtButton circle type='primary' onClick={onSubmit}>提交</AtButton>
    </View>
  }
  >
    <SpTabs current={curTabIdx} tablist={tabList} onChange={(e) => {
      setState(draft => {
        draft.curTabIdx = e
      })
    }} />

    <View className='refund-items'>
      <View className='items-container'>
        {
          info?.items.map((item, index) => (
            <View className='item-wrap' key={`item-wrap__${index}`}>
              <View className='item-hd'>
                <SpCheckbox disabled={!item.leftAftersalesNum} checked={item.checked} onChange={onChangeItemCheck.bind(this, item, index)} />
              </View>
              <View className='item-bd'>
                <SpImage src={item.pic} width={128} height={128} radius={8} circle={8} />
                <View className='goods-info'>
                  <View className='goods-info-hd'>
                    <Text className='goods-title'>{item.itemName}</Text>
                  </View>
                  <View className='goods-info-bd'>
                    <View>{item.itemSpecDesc && <Text className='sku-info'>{`${item.itemSpecDesc}`}</Text>}</View>
                    <View><SpPrice size={28} value={item.price / item.num} /> x <Text className='num'>{item.num}</Text></View>
                  </View>
                  <View className='goods-info-ft'>
                    <Text>退款数量</Text>
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
          ))
        }
      </View>
    </View>

    <View className='picker-reason'>
      <Picker
        mode='selector'
        range={reasons}
        onChange={(e) => {
          setState(draft => {
            draft.reasonIndex = e.detail.value
          })
        }}
      >
        <SpCell title='退款原因' isLink value={<Text>{`${reasons?.[reasonIndex] || '请选择取消原因'}`}</Text>}></SpCell>
      </Picker>
    </View>

    <View className='refund-detail'>
      <View className='refund-amount'>
        <SpCell title='退款金额' value={getRealRefundFee()
          // <>
          //   <AtInput
          //     name='refund_fee'
          //     value={refundFee}
          //     onChange={(e) => {
          //       setState(draft => {
          //         draft.refundFee = parseFloat(e)
          //       })
          //     }}
          //   />
          //   <Text className='iconfont icon-bianji1'></Text>
          // </>
        }></SpCell>
        {/* <View className='cell-tip'>{`实际最多可退商品金额：${getRealRefundFee()}`}</View> */}
      </View>

      <View className='refund-point'>
        <SpCell title='退积分' value={info?.point
          // <><AtInput
          //   name='refund_point'
          //   value={refundPoint}
          //   onChange={(e) => {
          //     setState(draft => {
          //       draft.refundPoint = parseFloat(e)
          //     })
          //   }}
          // /><Text className='iconfont icon-bianji1'></Text></>
        }></SpCell>
        {/* <View className='cell-tip'>{`实际最多可退还积分：${info?.point}`}</View> */}
      </View>
    </View>

    {curTabIdx == 1 && <View className='return-goods-type'>
      <SpCell border title='退货方式' value={getRefundTypeName()} isLink onClick={() => {
        setState(draft => {
          draft.openRefundType = true
          draft.selectRefundValue = refundType
        })
      }}></SpCell>
      {
        refundType == 'offline' && ((offlineAftersalesIsOpen && VERSION_STANDARD) || (VERSION_PLATFORM && offlineAftersales)) && <>
          <SpCell border title='退货门店' isLink value={<Text className={classNames({
            'placeholder': !refundStore
          })}>{refundStore ? refundStore.name : '请选择退货门店'}</Text>} onClick={() => {
            Taro.navigateTo({
              url: `/subpages/trade/store-picker?distributor_id=${info.distributorId}&refund_store=${refundStore?.address_id}`
            })
          }} />
          <SpCell border title='联系人' value={<AtInput
            name='contact'
            value={contact}
            placeholder='请填写联系人姓名'
            onChange={(e) => {
              setState(draft => {
                draft.contact = e
              })
            }}
          />}>
          </SpCell>
          <SpCell title='联系电话' value={<AtInput
            name='mobile'
            value={mobile}
            placeholder='请填写联系人电话'
            onChange={(e) => {
              setState(draft => {
                draft.mobile = e
              })
            }}
          />}></SpCell>
        </>
      }
    </View>}

    <View className='desc-container'>
      <View className='title'>补充描述</View>
      <View className='desc-content'>
        <Text className='iconfont icon-bianji1'></Text>
        <AtTextarea type='textarea' name='description' value={description} placeholder='请输入您的补充描述（选填）' maxLength={200} onChange={(e) => {
          setState(draft => {
            draft.description = e
          })
        }} />
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

    {
      afterSaleDesc.is_open && <View className='after-sale-desc'>
        <View className='desc-title'><Text className='iconfont icon-xinxi'></Text>售后提醒</View>
        <SpHtml content={afterSaleDesc.intro} />
      </View>
    }

    <SpFloatLayout
      title='选择退货方式'
      className='refund-type'
      open={openRefundType}
      onClose={() => {
        setState((draft) => {
          draft.openRefundType = false
        })
      }}
      renderFooter={
        <AtButton circle type='primary' onClick={() => {
          setState(draft => {
            draft.refundType = selectRefundValue
            draft.openRefundType = false
          })
        }}>
          确定
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
}

TradeAfterSale.options = {
  addGlobalClass: true
}

export default TradeAfterSale
