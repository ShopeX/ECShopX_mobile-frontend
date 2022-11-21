import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux"
import { useImmer } from "use-immer"
import Taro, { getCurrentInstance } from "@tarojs/taro";
import api from "@/api"
import doc from "@/doc"
import { AtButton, AtInput, AtTextarea } from 'taro-ui'
import { SpPage, SpCell, SpCheckbox, SpImage, SpChat, SpFloatLayout, SpUpload, SpPrice, SpHtml } from '@/components'
import { View, Text, Picker } from "@tarojs/components"
import { pickBy, showToast, isNumber, copyText } from '@/utils'
import { AFTER_SALE_TYPE, REFUND_FEE_TYPE, AFTER_SALE_STATUS_TEXT } from '@/consts'
import "./after-sale-detail.scss";

const initialState = {
  info: null,
  reasonIndex: '',
  reasons: [],
  refundFee: 0,
  refundPoint: 0,
  refundType: 2,
  description: '',
  pic: '',
  refundTypeList: [
    { title: '自行快递寄回', desc: '自行联系快递，填写物流单号', value: 1 },
    { title: '到店退货', desc: '前往线下门店退货', value: 2 },
  ],
  refundStore: '', // 退货门店
  connect: '', // 联系人
  mobile: '', // 联系电话
  openRefundType: false,
  selectRefundValue: 2,
}

function TradeAfterSaleDetail(props) {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const pageRef = useRef()
  const { info, tabList, reasonIndex, reasons, refundFee, refundPoint, refundType, refundTypeList, description, pic, openRefundType, selectRefundValue,
    refundStore, connect, mobile } = state
  const { aftersales_bn, item_id, order_id } = $instance.router.params

  useEffect(() => {
    fetch()
  }, [])

  useEffect(() => {
    if (openRefundType) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [openRefundType])

  const fetch = async () => {
    const resInfo = await api.aftersales.info({
      aftersales_bn,
      item_id,
      order_id
    })
    console.log(pickBy(resInfo, doc.trade.TRADE_AFTER_SALES_ITEM))
    setState(draft => {
      draft.info = pickBy(resInfo, doc.trade.TRADE_AFTER_SALES_ITEM)
      draft.reasons = reasons
    })
  }

  const getRefundType = () => {
    const { title } = REFUND_FEE_TYPE.find(item => item.value == info?.returnType) || {}
    return title
  }

  const getAfterSalesType = () => {
    const { title } = AFTER_SALE_TYPE.find(item => item.type == info?.afterSalesType) || {}
    return title
  }

  const onCancelApply = async () => {
    const { confirm } = await Taro.showModal({
      content: '请确定是否撤销申请？',
      cancelText: '取消',
      confirmText: '确定'
    })
    if (confirm) {
      Taro.showLoading()
      await api.aftersales.close({ aftersales_bn })
      showToast('撤销申请成功')
      Taro.hideLoading()
      fetch()
    }
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
    if (aftersales_type == 'REFUND_GOODS') {
      params = {
        ...params,
        return_type: refundType == 1 ? 'logistics' : 'offline',
        // aftersales_address_id: '请选择退货门店',
        // contact: '请填写联系人姓名',
        // mobile: '请填写联系人手机号码'
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

  return <SpPage ref={pageRef} className='page-trade-after-sale-detail' renderFooter={
    <View className='btn-wrap'>
      {(info?.progress == 0 || info?.progress == 1) && <AtButton circle onClick={onCancelApply}>撤销申请</AtButton>}
      {/* <AtButton circle onClick={onSubmit}>修改申请</AtButton> */}
      <SpChat>
        <AtButton circle>联系客服</AtButton>
      </SpChat>

    </View>
  }
  >
    <View className='after-progress'>
      {AFTER_SALE_STATUS_TEXT[info?.progress]}
      {info?.distributorRemark && <View className='distributor-remark'>商家备注：{info.distributorRemark}</View>}
    </View>

    <View className='after-address'>
      <SpCell title='回寄信息:'>
        <>
          <View className='contact-mobile'>
            <Text className='contact'>{info?.afterSalesContact}</Text>
            <Text className='mobile'>{info?.afterSalesMobile}</Text>
          </View>
          <View className='btn-copy' circle size='small' onClick={() => {
            copyText(`${info?.afterSalesContact} ${info?.afterSalesMobile}\n${info?.afterSalesAddress}`)
          }}>复制</View>
        </>
      </SpCell>
      <View className='address-detail'>{info?.afterSalesAddress}</View>
      {
        info?.progress == 1 && <View className='btn-container'>
          <View className='btn-logistics'>
            <AtButton circle type='primary' onClick={() => {
              Taro.navigateTo({ url: `/subpages/trade/logistics-info?aftersales_bn=${aftersales_bn}` })
            }}>填写物流信息</AtButton>
          </View>
        </View>
      }

    </View>

    <View className='refund-items'>
      <View className='items-container'>
        {
          info?.items.map((item, index) => (
            <View className='item-wrap' key={`item-wrap__${index}`}>
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
                </View>
              </View>
            </View>
          ))
        }
      </View>
    </View>

    <View className='refund-detail'>
      <View className='refund-amount'>
        <SpCell title='退款金额' value={<SpPrice value={info?.refundFee} />}></SpCell>
      </View>
      <View className='refund-point'>
        <SpCell title='退积分' value={info?.refundPoint}></SpCell>
      </View>
    </View>

    <View className='refund-type'>
      <SpCell title='退货方式'>
        {getRefundType()}
      </SpCell>
      <SpCell title='退货门店'>
        <>
          <View className='store-name'>ShopX徐汇区田尚坊钦州北路店显示全部门店名称</View>
          <View className='store-address'>上海市徐汇区钦州北路282号-2</View>
          <View className='store-connect'>021-33333333</View>
          <View className='store-time'>营业时间 9:00-21:00</View>
        </>
      </SpCell>
    </View>

    <View className='after-sales-type'>
      <SpCell title='售后类型'>
        {getAfterSalesType()}
      </SpCell>
      <SpCell title='退款原因'>{info?.reason}</SpCell>
      <SpCell title='退款凭证'>
        <>
          <View>{info?.description}</View>
          <View className='evidence-pic'>
            {
              info?.evidencePic.map((item, index) => (
                <SpImage key={`pic-image__${index}`} src={item} width={130} height={130} circle={16} />
              ))
            }
          </View>
        </>
      </SpCell>
    </View>

    <View className='after-sales-trade'>
      <SpCell title='订单编号'>
        {info?.orderId}
      </SpCell>
      <SpCell title='申请时间'>{info?.createTime}</SpCell>
      <SpCell title='退款编号'>
        {info?.afterSalesBn}
        <View className='btn-copy' circle size='small' onClick={() => {
          copyText(info?.afterSalesBn)
        }}>复制</View>
      </SpCell>
    </View>


  </SpPage>
}

TradeAfterSaleDetail.options = {
  addGlobalClass: true
}

export default TradeAfterSaleDetail
