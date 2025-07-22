import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, {
  useShareAppMessage,
  useShareTimeline,
  useDidShow,
  getCurrentInstance
} from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { SpImage, SpLogin, SpShopCoupon, SpPrice, SpCheckboxNew, SpFloatLayout } from '@/components'
import { pickBy, showToast, classNames, entryLaunch, getDistributorId } from '@/utils'
import { useNavigation, useDebounce } from '@/hooks'
import {
  updateShopCartCount,
  fetchCartList,
  updateCount,
  updateCartItemNum,
  deleteCartItem
} from '@/store/slices/cart'
import './comp-add-cart.scss'
import CompTab from './comp-tab'

const initialState = {
  hideClose: true
}

function CompAddCart(props) {
  const { shopCartCount } = useSelector((state) => state.cart)
  const { openRecommend, colorPrimary } = useSelector((state) => state.sys)
  const { open = false, onMaskCloses = {}, parameter = {} } = props
  const [state, setState] = useImmer(initialState)
  const { hideClose } = state
  const $instance = getCurrentInstance()
  const router = $instance.router
  const plus_buy_activity = shopCartCount?.storeDetails?.plus_buy_activity?.[0]
  const exchange_item = plus_buy_activity?.plus_item
    ? pickBy(plus_buy_activity?.plus_item, { ...doc.cart.PLUS_BUY_ITEM })
    : ''

  const allChecked =
    shopCartCount.storeDetails?.cart_total_count == shopCartCount.storeDetails?.list?.length
  const dispatch = useDispatch()

  const onChangeGoodsIsCheck = async (item, type, checked) => {
    // return
    Taro.showLoading({ title: '' })
    let parmas = { is_checked: checked }
    if (type === 'all') {
      const cartIds = item.list.map((item) => item.cart_id)
      parmas['cart_id'] = cartIds
    } else {
      parmas['cart_id'] = item.cart_id
    }
    try {
      await api.cart.select(parmas)
    } catch (e) {
      console.log(e)
    }
    getCartList()
  }

  const onDelete = async () => {
    const { id, dtid } = await parameter()
    const distributor_id = getDistributorId(id || dtid)
    const res = await Taro.showModal({
      title: '提示',
      content: '将当前商品移出购物车?',
      showCancel: true,
      cancel: '取消',
      cancelText: '取消',
      confirmText: '确认',
      confirmColor: colorPrimary
    })
    if (!res.confirm) return
    await dispatch(deleteCartItem({ distributor_id }))
    getCartList()
    onMaskCloses()
  }

  const getCartList = async () => {
    Taro.showLoading({ title: '' })
    const { type = 'distributor' } = router?.params || {}
    const params = {
      shop_type: type
    }
    await shopping()
    await dispatch(fetchCartList(params))
    await dispatch(updateCount(params))
    Taro.hideLoading()
  }

  const shopping = async () => {
    const { id, dtid } = await parameter()
    const distributor_id = getDistributorId(id || dtid)
    let params = {
      distributor_id,
      shop_type: 'distributor'
    }
    const { valid_cart } = await api.cart.get(params)
    let shopCats = {
      shop_id: valid_cart === undefined ? '' : valid_cart[0]?.shop_id || '', //下单
      cart_total_num: valid_cart === undefined ? '' : valid_cart[0]?.cart_total_num || '', //数量
      total_fee: valid_cart === undefined ? '' : valid_cart[0]?.total_fee || '', //实付金额
      discount_fee: valid_cart === undefined ? '' : valid_cart[0]?.discount_fee || '', //优惠金额
      storeDetails: valid_cart === undefined ? '' : valid_cart[0] || {}
    }
    dispatch(updateShopCartCount(shopCats))
  }

  const handleClick = useDebounce(async (item, num) => {
    console.log(`onChangeCartGoodsItem:`, item, num)
    let { shop_id, cart_id } = item
    const { type = 'distributor' } = router.params
    await dispatch(updateCartItemNum({ shop_id, cart_id, num, type }))
    getCartList()
  }, 200)

  return (
    <SpFloatLayout open={open} hideClose={hideClose} onClose={onMaskCloses} className='cart-layout'>
      <View className='comp-add-cart'>
        {/* 全选 */}
        <View className='selec-atll'>
          <View className='selec-atll-num'>
            <SpCheckboxNew
              checked={allChecked}
              label='全选'
              onChange={onChangeGoodsIsCheck.bind(this, shopCartCount.storeDetails, 'all')}
            />
            <Text className='selec-atll-num-commodity'>
              （共{shopCartCount.storeDetails?.list?.length}件商品）
            </Text>
          </View>
          <View onClick={() => onDelete()}>
            <Text className='iconfont icon-shanchu-01' />
            <Text className='empty-cart'>清空购物车</Text>
          </View>
        </View>
        {/** 换购开始 */}
        {plus_buy_activity?.discount_desc && (
          <View className='shop-cart-activity'>
            <View className='shop-cart-activity-item'>
              <View
                className='shop-cart-activity-item-left'
                onClick={() =>
                  Taro.navigateTo({
                    url: `/marketing/pages/plusprice/detail-plusprice-list?marketing_id=${plus_buy_activity?.activity_id}`
                  })
                }
              >
                <Text className='shop-cart-activity-label'>换购</Text>
                <Text>{plus_buy_activity?.discount_desc?.info}</Text>
              </View>
              <View
                className='shop-cart-activity-item-right'
                onClick={() =>
                  Taro.navigateTo({
                    url: `/marketing/pages/plusprice/cart-plusprice-list?marketing_id=${plus_buy_activity?.activity_id}`
                  })
                }
              >
                去选择
                <Text className='at-icon at-icon-chevron-right'></Text>
              </View>
            </View>
          </View>
        )}

        {/** 换购结束 */}
        {/* 列表 */}
        <ScrollView className='tabulation' scrollY>
          {shopCartCount.storeDetails?.list?.map((item) => {
            return (
              <View className='tabulation-list' key={item.cart_id}>
                <SpCheckboxNew
                  checked={item.is_checked}
                  onChange={onChangeGoodsIsCheck.bind(this, item, 'single')}
                />
                <View className='tabulation-list-details'>
                  <Image className='tabulation-list-details-img' src={item.pics}></Image>
                  <View className='tabulation-list-details-text'>
                    <View className='name'>{item.item_name}</View>
                    <View className='addition-and-subtraction'>
                      <View className='details-name'>
                        <View className='details-name-ml'>{item.item_spec_desc}</View>
                        <SpPrice
                          className='market-price'
                          size={32}
                          value={item.price / 100}
                        ></SpPrice>
                      </View>
                      <View className='addition-and-subtraction-btn'>
                        <Text
                          className='iconfont icon-jianhao'
                          onClick={() => handleClick(item, item.num - 1)}
                        />
                        <Text>{item.num}</Text>
                        <Text
                          className='iconfont icon-jiahao'
                          onClick={() => handleClick(item, item.num + 1)}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )
          })}
          {plus_buy_activity?.discount_desc && (
            <View className='exchange-purchase'>
              <SpImage
                className='exchange-purchase-img'
                src={exchange_item?.pics}
                width={120}
                height={120}
              />
              <View className='exchange-purchase-details'>
                <View className='details-title'>
                  <Text className='details-title-jiagou'>加购价</Text>
                  <Text>{exchange_item?.item_name}</Text>
                </View>
                <View className='exchange-purchase-desc'>{exchange_item?.item_spec_desc}</View>
                <View className='exchange-purchase-price'>
                  <View>
                    <SpPrice value={exchange_item?.price / 100} />
                    {exchange_item?.market_price > exchange_item?.price && (
                      <Text className='goods-price-wrap'>
                        <SpPrice
                          className='mkt-price'
                          lineThrough
                          value={exchange_item?.market_price / 100}
                        />
                      </Text>
                    )}
                  </View>
                  <View>x {exchange_item?.num}</View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
        {/* 底部 */}
        <CompTab />
      </View>
    </SpFloatLayout>
  )
}

CompAddCart.options = {
  addGlobalClass: true
}

export default CompAddCart
