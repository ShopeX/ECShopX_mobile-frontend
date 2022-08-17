import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, Text } from '@tarojs/components'
import { AtTextarea, AtModal, AtModalHeader, AtModalContent } from 'taro-ui'
import { SpPage, SpImage, SpPrice, SpVipLabel, SpCell, SpButton, SpFloatLayout, SpCheckbox } from '@/components'
import CompCoupon from './comps/comp-coupon'
import './checkout.scss'

const initialState = {
  remark: '',
  isOpened: false,
  couponLayout: true
}
function DianwuCheckout(props) {
  const [state, setState] = useImmer(initialState)
  const { remark, isOpened, couponLayout } = state
  const pageRef = useRef()

  const onPendingOrder = () => {}
  const onCollection = () => {}

  useEffect(() => {
    if (isOpened || couponLayout) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [isOpened, couponLayout])

  return (
    <SpPage
      className='page-dianwu-checkout'
      ref={pageRef}
      renderFooter={
        <View className='btn-wrap'>
          <SpButton
            resetText='挂单'
            confirmText='收款'
            onConfirm={onPendingOrder}
            onReset={onCollection}
          ></SpButton>
        </View>
      }
    >
      <View className='block-user'>
        <SpImage width={110} height={110} />
        <View className='user-info'>
          <View className='info-hd'>
            <Text className='name'>未知</Text>
            <Text className='mobile'>138****8888</Text>
          </View>
          <View className='info-bd'>
            <View className='filed-item'>
              <Text className='label'>积分:</Text>
              <Text className='value'>888888</Text>
            </View>
            <View className='filed-item'>
              <Text className='label'>券:</Text>
              <Text className='value'>888</Text>
            </View>
            <View className='filed-item'>
              <Text className='label'>会员折扣:</Text>
              <Text className='value'>8.8</Text>
            </View>
          </View>
        </View>
      </View>
      <View className='block-goods'>
        {[1, 2, 3].map((item, index) => (
          <View className='item-wrap' key={`item-wrap__${index}`}>
            <View className='item-hd'>
              <SpImage width={110} height={110} />
            </View>
            <View className='item-bd'>
              <View className='title'>
                我商品名我商品名我商品名最多只显示一行我商品名我商品名我商品名最多只显示一行
              </View>
              <View className='sku'>白色、XL、印花</View>
              <View className='ft-info'>
                <View className='price-list'>
                  <View className='price-wrap'>
                    <SpPrice className='sale-price' value={999.99}></SpPrice>
                  </View>
                  <View className='price-wrap'>
                    <SpPrice className='vip-price' value={888.99}></SpPrice>
                    <SpVipLabel content='VIP' type='vip' />
                  </View>
                  <View className='price-wrap'>
                    <SpPrice className='svip-price' value={666.99}></SpPrice>
                    <SpVipLabel content='SVIP' type='svip' />
                  </View>
                </View>
                <View className='num'>数量：20</View>
              </View>
            </View>
          </View>
        ))}
      </View>
      <View className='block-gift'>
        {[1, 2, 3].map((item, index) => (
          <View className='gift-item' key={`gift-item__${index}`}>
            <View className='gift-tag'>赠品</View>
            <View className='gift-info'>
              <View className='title'>
                我商品名我商品名我商品名最多只显示一行我商品名我商品名我商品名最多只显示一行
              </View>
              <View className='sku-num'>
                <View className='sku'>白色、XL、印花</View>
                <View className='num'>数量：20</View>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View className='block-coupon'>
        <SpCell title='使用券' border isLink>
          <Text>共5张优惠券可用</Text>
        </SpCell>
        <SpCell title='使用积分' isLink>
          暂无可用
        </SpCell>
      </View>

      <View className='block-checkout-info'>
        <SpCell title='43件商品合计' border>
          <SpPrice value={2450} />
        </SpCell>
        <SpCell title='促销优惠' border>
          <SpPrice value={-500} />
        </SpCell>
        <SpCell title='会员折扣' border>
          <SpPrice value={-50} />
        </SpCell>
        <SpCell title='券优惠' border>
          <SpPrice value={-50} />
        </SpCell>
        <SpCell title='积分抵扣' border>
          <SpPrice value={-50} />
        </SpCell>
        <SpCell title='应收款'>
          <SpPrice value={1450} />
        </SpCell>
      </View>

      <View className='block-remark'>
        <View className='title'>订单备注</View>
        <AtTextarea
          count
          value={remark}
          onChange={() => {}}
          maxLength={150}
          placeholder='请输入您的备注'
        ></AtTextarea>
      </View>

      <AtModal className='collection-modal' isOpened={isOpened}>
        <AtModalHeader>应收款</AtModalHeader>
        <AtModalContent>
          <View className='total-mount'>
            <SpPrice size={48} value={1450} />
          </View>
          <SpCell isLink border>
            <Text className='iconfont icon-weixinzhifu'></Text>
            <Text>微信收款</Text>
          </SpCell>
          <SpCell isLink border>
            <Text className='iconfont icon-zhifubao'></Text>
            <Text>支付宝收款</Text>
          </SpCell>
          <SpCell isLink>
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
            resetText='暂不使用'
            confirmText='确定'
            onConfirm={onPendingOrder}
            onReset={onCollection}
          ></SpButton>
        }
      >
        <View className='coupon-list'>
          {[1, 2, 3, 4, 5, 6].map((item, index) => (
            <CompCoupon key={`coupon-item__${index}`}><SpCheckbox /></CompCoupon>
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
