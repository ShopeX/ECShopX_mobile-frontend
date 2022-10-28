import React, { useEffect } from "react";
import { useSelector } from "react-redux"
import { useImmer } from "use-immer"
import Taro, { getCurrentInstance } from "@tarojs/taro";
import api from "@/api"
import doc from "@/doc"
import { AtTabs, AtInput, AtTextarea } from 'taro-ui'
import { SpPage, SpButton, SpCell, SpCheckbox, SpImage, SpInputNumber, SpSelect, SpUpload } from '@/components'
import { View, Text, Picker } from "@tarojs/components"
import { pickBy, showToast, isNumber } from '@/utils'
import CompTradeInfo from './../comps/comp-trade-info'
import "./sale-after.scss";

const initialState = {
  tradeId: '',
  info: null,
  curTabIdx: 0,
  tabList: [
    { title: '仅退款', status: 'ONLY_REFUND' },
    { title: '退货退款', status: 'REFUND_GOODS' }
  ],
  reason: '',
  reasons: [
    '客户现在不想购买',
    '客户商品价格较贵',
    '客户价格波动',
    '客户商品缺货',
    '客户重复下单',
    '客户订单商品选择有误',
    '客户支付方式选择有误',
    '客户收货信息填写有误',
    '客户发票信息填写有误',
    '客户无法支付订单',
    '客户长时间未付款',
    '客户其他原因'
  ],
  refundFee: 0,
  refundPoint: 0,
  goodsReturned: [1],
  goodsReturnedList: [
    { id: 1, name: '快递发货' },
    { id: 2, name: '到店退货(店员已验货)' }
  ],
  description: '',
  pic: ''
}

function DianwuTradeSaleAfter(props) {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const { tradeId, info, curTabIdx, tabList, reason, reasons, refundFee, refundPoint, goodsReturned, goodsReturnedList, description, pic } = state

  const onCancel = () => {
    Taro.navigateBack()
  }

  const onConfirm = async () => {
    if (!reason) {
      return showToast('请选择退款原因')
    }
    const { trade_id } = $instance.router.params
    const [img] = pic || []
    const items = info?.items.filter(item => item.checked).map(item => {
      return {
        id: item.itemId,
        num: item.refundNum
      }
    })
    if(items.length == 0) {
      return showToast('请选择需要售后的商品')
    }
    if(!isNumber(refundFee)) {
      return showToast('请填写退款金额')
    }
    if(!isNumber(refundPoint)) {
      return showToast('请填写积分')
    }
    const params = {
      order_id: trade_id,
      aftersales_type: tabList[curTabIdx].status,
      goods_returned: goodsReturned[0] == 2,
      reason: reasons?.[reason],
      detail: JSON.stringify(items),
      refund_fee: refundFee * 100,
      refund_point: refundPoint,
      description,
      pic: img
    }
    await api.dianwu.salesAfterApply(params)
    let type = 3
    if(params.aftersales_type == 'ONLY_REFUND') {
      type = 3
    } else if(params.aftersales_type == 'REFUND_GOODS' && !params.goods_returned) {
      type = 4
    } else if(params.aftersales_type == 'REFUND_GOODS' && params.goods_returned) {
      type = 5
    }
    Taro.redirectTo({ url: `/subpages/dianwu/trade/result?type=${type}` })
    // showToast('订单取消成功')
    // setTimeout(() => {
    //   Taro.navigateBack()
    // }, 2000)
  }

  const onChangeItemCheck = (item, index, e) => {
    setState(draft => {
      draft.info.items[index].checked = e
    })
   }

  const onChangeItemNum = (e, index) => {
    setState(draft => {
      draft.info.items[index] = e
    })
  }

  return <SpPage className='page-dianwu-sale-after' renderFooter={
    <View className='btn-wrap'>
      <SpButton confirmText='提交' onReset={onCancel} onConfirm={onConfirm} />
    </View>
  }
  >

    <AtTabs
      current={curTabIdx}
      tabList={tabList}
      onClick={(e) => {
        setState(draft => {
          draft.curTabIdx = e
        })
      }}
    />

    <CompTradeInfo onFetch={(data) => {
      setState(draft => {
        draft.info = data
      })
    }} />

    <View className='picker-reason'>
      <Picker
        mode='selector'
        range={reasons}
        onChange={(e) => {
          setState(draft => {
            draft.reason = e.detail.value
          })
        }}
      >
        <SpCell title='退款原因' isLink value={<Text>{`${reasons?.[reason] || '请选择取消原因'}`}</Text>}></SpCell>
      </Picker>
    </View>

    <View className='refund-items'>
      <View className='title'>退款商品</View>
      <View className='items-container'>
        {
          info?.items.map((item, index) => (
            <View className='item-wrap' key={`item-wrap__${index}`}>
              <View className='item-hd'>
                <SpCheckbox checked={item.checked} onChange={onChangeItemCheck.bind(this, item, index)} />
              </View>
              <View className='item-bd'>
                <SpImage src={item.pic} width={110} height={110} radius={8} />
                <View className='goods-info'>
                  <View className='goods-info-hd'><Text className='goods-title'>{item.itemName}</Text>
                    <Text className='goods-num'>{`数量：${item.num}`}</Text></View>
                  <View className='goods-info-bd'>
                    <View className='sku-info'>{item.itemSpecDesc && <Text>{`规格：${item.itemSpecDesc}`}</Text>}</View>
                    <SpInputNumber
                      value={item.refundNum}
                      max={item.num}
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

    <View className='refund-amount'>
      <SpCell title='退款金额' value={<AtInput
        name='refund_fee'
        value={refundFee}
        onChange={(e) => {
          setState(draft => {
            draft.refundFee = e
          })
        }}
      />}></SpCell>
      <View className='cell-tip'>{`实际可退金额：${info?.refundFee.toFixed(2)}`}</View>
    </View>

    <View className='refund-point'>
      <SpCell title='退积分' value={<AtInput
        name='refund_point'
        value={refundPoint}
        onChange={(e) => {
          setState(draft => {
            draft.refundPoint = e
          })
        }}
      />}></SpCell>
      <View className='cell-tip'>{`实际可退积分：${info?.refundPoint}`}</View>
    </View>

    <View className='return-goods-type'>
      <SpCell title='回寄方式' value={<SpSelect
        info={goodsReturnedList}
        value={goodsReturned}
        onChange={(e) => {
          setState((draft) => {
            draft.goodsReturned = e
          })
        }}
      />}></SpCell>
    </View>

    <View className='desc-container'>
      <View className='title'>补充描述和凭证（选填）</View>
      <View className='desc-content'>
        <AtTextarea type='textarea' name='description' value={description} placeholder='添加描述' maxLength={200} onChange={(e) => {
          setState(draft => {
            draft.description = e
          })
        }} />
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
}

DianwuTradeSaleAfter.options = {
  addGlobalClass: true
}

export default DianwuTradeSaleAfter
