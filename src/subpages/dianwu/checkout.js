import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, Text } from '@tarojs/components'
import { AtTextarea, AtModal, AtModalHeader, AtModalContent } from 'taro-ui'
import {
  SpPage,
  SpImage,
  SpPrice,
  SpVipLabel,
  SpCell,
  SpButton,
  SpFloatLayout,
  SpCheckbox
} from '@/components'
import { selectMember } from '@/store/slices/dianwu'
import { pickBy, showToast } from '@/utils'
import CompGoodsPrice from './comps/comp-goods-price'
import CompGift from './comps/comp-gift'
import CompCoupon from './comps/comp-coupon'
import './checkout.scss'

const initialState = {
  itemList: [],
  itemsPromotion: [],
  totalItemNum: 0,
  itemFee: 0,
  discountFee: 0,
  totalFee: 0,
  memberDiscount: 0,
  couponDiscount: 0,
  promotionDiscount: 0,
  couponInfo: null,
  selectCoupon: null,
  couponList: [],
  remark: '',
  isOpened: false,
  couponLayout: false
}
function DianwuCheckout(props) {
  const [state, setState] = useImmer(initialState)
  const {
    itemList,
    itemsPromotion,
    totalItemNum,
    itemFee,
    discountFee,
    totalFee,
    memberDiscount,
    couponDiscount,
    promotionDiscount,
    remark,
    isOpened,
    couponLayout,
    couponList,
    couponInfo,
    selectCoupon
  } = state
  const pageRef = useRef()
  const $instance = getCurrentInstance()
  const { distributor_id } = $instance.router.params
  const { member } = useSelector((state) => state.dianwu)
  const dispatch = useDispatch()

  const onPendingOrder = () => {}

  // 收款
  const onCollection = async () => {
    setState((draft) => {
      draft.isOpened = true
      // draft.orderId = order_id
    })
  }

  useEffect(() => {
    getCheckout()
    getUserCardList()
  }, [])

  useEffect(() => {
    if (isOpened || couponLayout) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [isOpened, couponLayout])

  const getUserCardList = async () => {
    const { list } = await api.dianwu.getUserCardList({
      user_id: member?.userId,
      distributor_id
    })
    setState((draft) => {
      draft.couponList = pickBy(list, doc.dianwu.COUPON_ITEM)
    })
  }

  const getCheckout = async () => {
    let params = {
      user_id: member?.userId,
      not_use_coupon: 1,
      distributor_id
    }
    if(selectCoupon) {
      params = {
        ...params,
        not_use_coupon: 0,
        coupon_discount: selectCoupon
      }
    }
    Taro.showLoading()
    const res = await api.dianwu.checkout(params)
    const {
      items,
      itemsPromotion: _itemsPromotion,
      totalItemNum: _totalItemNum,
      itemFee: _itemFee,
      discountFee: _discountFee,
      totalFee: _totalFee,
      memberDiscount: _memberDiscount,
      couponDiscount: _couponDiscount,
      promotionDiscount: _promotionDiscount,
      couponInfo: _couponInfo
    } = pickBy(res, doc.dianwu.CHECKOUT_GOODS_ITEM)
    setState((draft) => {
      draft.itemList = items.filter(item => item.orderItemType != 'gift')
      draft.itemsPromotion = _itemsPromotion
      draft.totalItemNum = _totalItemNum
      draft.itemFee = _itemFee
      draft.discountFee = _discountFee
      draft.totalFee = _totalFee
      draft.memberDiscount = _memberDiscount
      draft.couponDiscount = _couponDiscount
      draft.promotionDiscount = _promotionDiscount
      draft.couponInfo = _couponInfo
      draft.selectCoupon = _couponInfo ? _couponInfo.coupon_code : null
    })
    Taro.hideLoading()
  }

  const onChangeRemark = (e) => {
    setState((draft) => {
      draft.remark = e
    })
  }

  const createOrder = async () => {
    let params = {
      user_id: member?.userId,
      remark,
      not_use_coupon: 1,
      distributor_id
    }
    if(couponInfo) {
      params = {
        ...params,
        not_use_coupon: 0,
        coupon_discount: couponInfo.coupon_code
      }
    }
    const { order_id } = await api.dianwu.createOrder(params)
    return order_id
  }

  // 扫码收款
  const handleClickScanCode = async () => {
    const { errMsg, result } = await Taro.scanCode()
    if (errMsg == 'scanCode:ok') {
      console.log(`handleClickScanCode:`, result)
      const order_id = await createOrder()
      const { trade_info } = await api.dianwu.orderPayment({
        order_id,
        auth_code: result
      })
      dispatch(selectMember(null))
      onEventCreateOrder()
      Taro.redirectTo({
        url: `/subpages/dianwu/collection-result?order_id=${order_id}&trade_id=${trade_info.trade_id}`
      })
    } else {
      showToast(errMsg)
    }
  }

  // 现金收款
  const handleClickCash = async () => {
    const res = await Taro.showModal({
      title: '现金收款确认提示',
      content: '请确认是否已收到商品款?',
      showCancel: true,
      cancel: '取消',
      cancelText: '未收到',
      confirmText: '确认收到'
    })
    if (!res.confirm) return
    const order_id = await createOrder()
    await api.dianwu.orderPayment({
      order_id,
      pay_type: 'pos'
    })
    dispatch(selectMember(null))
    onEventCreateOrder()
    Taro.redirectTo({ url: `/subpages/dianwu/collection-result?order_id=${order_id}&pay_type=pos` })
  }

  const onEventCreateOrder = () => {
    const pages = Taro.getCurrentPages()
    const current = pages[pages.length - 1]
    const eventChannel = current.getOpenerEventChannel()
    eventChannel.emit('onEventCreateOrder');
  }

  // 使用优惠券
  const handleUseCoupon = async () => {
    getCheckout()
    setState(draft => {
      draft.couponLayout = false
    })
  }

  const couponIsChecked = ({ couponCode }) => {
    if (selectCoupon == couponCode) {
      return true
    } else {
      return false
    }
  }

  const onChangeCoupon = ({ couponCode }, e) => {
    setState(draft => {
      draft.selectCoupon = e ? couponCode : null
    })
  }

  return (
    <SpPage
      className='page-dianwu-checkout'
      ref={pageRef}
      renderFooter={
        <View className='btn-wrap'>
          <SpButton
            resetText='挂单'
            confirmText='收款'
            onConfirm={onCollection}
            onReset={onPendingOrder}
          ></SpButton>
        </View>
      }
    >
      <View className='block-user'>
        <SpImage src={member?.avatar || 'user_icon.png'} width={110} height={110} />
        <View className='user-info'>
          <View className='info-hd'>
            <Text className='name'>{member?.username || '匿名'}</Text>
            <Text className='mobile'>{member?.mobile}</Text>
          </View>
          <View className='info-bd'>
            <View className='filed-item'>
              <Text className='label'>积分:</Text>
              <Text className='value'>{member?.point || 0}</Text>
            </View>
            <View className='filed-item'>
              <Text className='label'>券:</Text>
              <Text className='value'>{member?.couponNum || 0}</Text>
            </View>
            <View className='filed-item'>
              <Text className='label'>会员折扣:</Text>
              <Text className='value'>{member?.vipDiscount || 0}</Text>
            </View>
          </View>
        </View>
      </View>
      <View className='block-goods'>
        {itemList.map((item, index) => (
          <View className='item-wrap' key={`item-wrap__${index}`}>
            <View className='item-hd'>
              <SpImage src={item.pic} width={110} height={110} />
            </View>
            <View className='item-bd'>
              <View className='title'>{item.name}</View>
              {item.itemSpecDesc && <View className='sku'>{item.itemSpecDesc}</View>}
              <View className='ft-info'>
                <CompGoodsPrice info={item} />
                <View className='num'>数量：{item.num}</View>
              </View>
            </View>
          </View>
        ))}
      </View>
      {itemsPromotion && (
        <View className='block-gift'>
          {itemsPromotion.map((item, idx) => {
            return item.activity_desc?.gifts?.map((gift, index) => (
              <View className='gift-item' key={`gift-item__${idx}_${index}`}>
                <CompGift info={gift} />
              </View>
            ))
          })}
        </View>
      )}

      <View className='block-coupon'>
        {couponList.length > 0 && (
          <SpCell
            title='使用券'
            border
            isLink
            onClick={() => {
              setState((draft) => {
                draft.couponLayout = true
              })
            }}
          >
            <Text>{`${couponInfo ? couponInfo.rule : '请选择'}`}</Text>
          </SpCell>
        )}

        {/* <SpCell title='使用积分' isLink>
          暂无可用
        </SpCell> */}
      </View>

      <View className='block-checkout-info'>
        <SpCell title={`${totalItemNum}件商品合计`} border>
          <SpPrice value={itemFee} />
        </SpCell>
        <SpCell title='促销优惠' border>
          <SpPrice value={`-${promotionDiscount}`} />
        </SpCell>
        <SpCell title='会员折扣' border>
          <SpPrice value={`-${memberDiscount}`} />
        </SpCell>
        <SpCell title='券优惠' border>
          <SpPrice value={`-${couponDiscount}`} />
        </SpCell>
        {/* <SpCell title='积分抵扣' border>
          <SpPrice value={-50} />
        </SpCell> */}
        <SpCell title='应收款'>
          <SpPrice value={totalFee} />
        </SpCell>
      </View>

      <View className='block-remark'>
        <View className='title'>订单备注</View>
        <AtTextarea
          count
          value={remark}
          onChange={onChangeRemark}
          maxLength={150}
          placeholder='请输入您的备注'
        ></AtTextarea>
      </View>

      <AtModal className='collection-modal' isOpened={isOpened} onClose={() => {
        setState(draft => {
          draft.isOpened = false
        })
      }}>
        <AtModalHeader>应收款</AtModalHeader>
        <AtModalContent>
          <View className='total-mount'>
            <SpPrice size={48} value={totalFee} />
          </View>
          {/* <SpCell isLink border>
            <Text className='iconfont icon-weixinzhifu'></Text>
            <Text>微信收款</Text>
          </SpCell> */}
          <SpCell isLink border onClick={handleClickScanCode}>
            <Text className='iconfont icon-saoma'></Text>
            <Text>微信/支付宝收款</Text>
          </SpCell>
          <SpCell isLink onClick={handleClickCash}>
            <Text className='iconfont icon-money1'></Text>
            <Text>现金收款</Text>
          </SpCell>
        </AtModalContent>
      </AtModal>

      <SpFloatLayout
        title='优惠券'
        className='coupon-layout'
        open={couponLayout}
        onClose={() => {
          setState((draft) => {
            draft.couponLayout = false
          })
        }}
        renderFooter={
          <SpButton
            resetText='取消'
            confirmText='确定'
            onConfirm={handleUseCoupon}
            onReset={() => {
              setState((draft) => {
                draft.couponLayout = false
              })
            }}
          ></SpButton>
        }
      >
        <View className='coupon-list'>
          {couponList.map((item, index) => (
            <CompCoupon info={item} key={`coupon-item__${index}`}>
              <SpCheckbox
                checked={couponIsChecked(item)}
                onChange={onChangeCoupon.bind(this, item)}
              />
            </CompCoupon>
          ))}
        </View>
      </SpFloatLayout>
    </SpPage>
  )
}

DianwuCheckout.options = {
  addGlobalClass: true
}

export default DianwuCheckout
