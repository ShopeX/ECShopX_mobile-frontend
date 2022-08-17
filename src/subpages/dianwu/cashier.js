import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtButton, AtCurtain, AtInput } from 'taro-ui'
import {
  SpPage,
  SpSearchInput,
  SpPrice,
  SpImage,
  SpVipLabel,
  SpInputNumber,
  SpFloatLayout,
  SpCell
} from '@/components'
import { useDebounce } from '@/hooks'
import { styleNames, pickBy, showToast } from '@/utils'
import CompGoods from './comps/comp-goods'
import CompGoodsPrice from './comps/comp-goods-price'
import './cashier.scss'

const initialState = {
  keywords: '',
  typeList: [
    { title: '商品', value: 'goods' },
    { title: '会员', value: 'member' }
  ],
  current: 0,
  cartList: [],
  discountDetailLayout: false,
  searchResultLayout: false,
  addUserCurtain: false
}

function DianWuCashier() {
  const [state, setState] = useImmer(initialState)
  const {
    keywords,
    typeList,
    current,
    cartList,
    discountDetailLayout,
    searchResultLayout,
    addUserCurtain
  } = state
  const pageRef = useRef()
  const $instance = getCurrentInstance()
  const { distributor_id } = $instance.router.params

  useEffect(() => {
    getCashierList()
  }, [])

  useEffect(() => {
    if (discountDetailLayout || searchResultLayout || addUserCurtain) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [discountDetailLayout, searchResultLayout, addUserCurtain])

  useEffect(() => {
    if (searchResultLayout) {
      getMembers(keywords)
      getItemList(keywords)
    }
  }, [keywords])

  const handleScanCode = async () => {
    const { errMsg, result } = await Taro.scanCode()
    if (errMsg == 'scanCode:ok') {
      // 会员码
      if (result.indexOf('uc:') > -1) {
        getMembers(result.replace('uc:', ''))
      } else {
        // 商品码
        getItemList(result)
      }
    } else {
      showToast(errMsg)
    }
  }

  // 查询会员
  const getMembers = async (bn) => {
    await api.dianwu.getMembers({ mobile: bn })
  }

  // 查询商品
  const getItemList = async (bn) => {
    const { list: _list, total_count } = await api.dianwu.goodsItems({
      page: 1,
      pageSize: 1000,
      distributor_id,
      keywords: bn
    })
  }

  const getCashierList = async () => {
    const { valid_cart } = await api.dianwu.getCartDataList()
    setState((draft) => {
      draft.cartList = pickBy(valid_cart, doc.dianwu.CART_GOODS_ITEM)
    })
  }

  const onChangeInputNumber = useDebounce(async ({ cartId, itemId }, num) => {
    await api.dianwu.updateCartData({
      cart_id: cartId,
      item_id: itemId,
      num,
      is_checked: true
    })
    getCashierList()
  }, 200)

  const handleDeleteCartItem = async ({ cartId }) => {
    const { confirm } = await Taro.showModal({
      title: '提示',
      content: '将当前商品移出收银台?',
      showCancel: true,
      cancel: '取消',
      cancelText: '取消',
      confirmText: '确认'
    })
    if (!confirm) return
    await api.dianwu.deleteCartData(cartId)
    getCashierList()
  }

  return (
    <SpPage
      className='page-dianwu-cashier'
      ref={pageRef}
      renderFooter={
        <View className='footer-wrap'>
          <View className='total-info'>
            <View className='real-mount'>
              <Text className='label'>实收 </Text>
              <SpPrice value={cartList[0]?.totalPrice} />
            </View>
            <View className='txt'>已选择{cartList[0]?.totalNum}件商品</View>
          </View>
          <View className='g-button'>
            <View className='g-button__first'>挂单</View>
            <View className='g-button__second'>结算收银</View>
          </View>
        </View>
      }
    >
      <View className='block-tools'>
        <SpSearchInput
          placeholder='商品/会员名'
          onConfirm={(val) => {
            setState((draft) => {
              draft.keywords = val
              draft.searchResultLayout = true
            })
          }}
        />
        <View className='g-button'>
          <View
            className='g-button__first'
            onClick={() => {
              setState((draft) => {
                draft.addUserCurtain = true
              })
            }}
          >
            <Text className='iconfont icon-xinzenghuiyuan-01'></Text>添加会员
          </View>
          <View className='g-button__second' onClick={handleScanCode}>
            <Text className='iconfont icon-saoma'></Text>扫商品/会员码
          </View>
        </View>
      </View>
      <View className='member-info'>
        <View className='lf'>
          <Text className='name'>未知</Text>
          <Text className='mobile'>138****8888</Text>
        </View>
        <View className='rg'>
          <View className='cash'>
            会员折扣：<Text className='cash-value'>8.8</Text>
          </View>
          <View className='btn-clear'>清除</View>
        </View>
      </View>
      {/* <View className='block-promation'>
        {[1, 2, 3].map((item, index) => (
          <View className='promation-item' key={`promation-item__${index}`}>
            <View>
              <Text className='tag'>满减</Text>
              <Text className='txt'>还差¥20即可减100</Text>
            </View>
            <View className='btn-add'>
              去凑单<Text className='iconfont icon-qianwang-01'></Text>
            </View>
          </View>
        ))}
      </View> */}
      <View className='block-goods'>
        {cartList.map((shopList, idx) => {
          return shopList.list.map((item, index) => (
            <View className='item-wrap' key={`item-wrap__${idx}_${index}`}>
              <View className='item-hd'>
                <SpImage src={item.pic} width={110} height={110} />
                <View className='btn-delete' onClick={handleDeleteCartItem.bind(this, item)}>
                  <Text className='iconfont icon-trashCan'></Text>
                </View>
              </View>
              <View className='item-bd'>
                <View className='title'>{item.itemName}</View>
                {item.itemSpecDesc && <View className='sku'>{item.itemSpecDesc}</View>}
                <View className='ft-info'>
                  {/* <View className='price-list'>
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
                  </View> */}
                  <CompGoodsPrice info={item} />
                  <SpInputNumber
                    value={item.num}
                    min={1}
                    onChange={(num) => {
                      setState((draft) => {
                        draft.cartList[idx].list[index].num = num
                      })
                      onChangeInputNumber(item, num)
                    }}
                  />
                </View>
              </View>
            </View>
          ))
        })}
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

      <View className='total-bar'>
        <View className='lf'>
          <View className='total-mount'>
            合计 <SpPrice size={38} value={1500} />
          </View>
          <View className='discount-mount'>
            已优惠 <SpPrice size={38} value={50} />
          </View>
        </View>
        <View
          className='rg'
          onClick={() => {
            setState((draft) => {
              draft.discountDetailLayout = true
            })
          }}
        >
          优惠详情<Text className='iconfont icon-qianwang-01'></Text>
        </View>
      </View>

      <SpFloatLayout
        title='优惠详情'
        open={discountDetailLayout}
        onClose={() => {
          setState((draft) => {
            draft.discountDetailLayout = false
          })
        }}
      >
        <View className='discount-detail'>
          <SpCell title='4件商品合计'>
            <SpPrice value={2450}></SpPrice>
          </SpCell>
          <SpCell title='促销优惠'>
            <SpPrice value={-500}></SpPrice>
          </SpCell>
          <SpCell title='会员折扣'>
            <SpPrice value={-500}></SpPrice>
          </SpCell>
        </View>
      </SpFloatLayout>

      <SpFloatLayout
        className='layout-search-result'
        title={
          <Text className='label'>
            查询内容: <Text className='keywords'>{keywords}</Text>
          </Text>
        }
        open={searchResultLayout}
        onClose={() => {
          setState((draft) => {
            draft.searchResultLayout = false
          })
        }}
      >
        <AtTabs
          current={current}
          tabList={typeList}
          onClick={(e) => {
            setState((draft) => {
              draft.current = e
            })
          }}
        >
          <AtTabsPane current={current} index={0}>
            <ScrollView className='tab-scroll-list' scrollY>
              {[1, 2, 3, 4, 5].map((item, index) => (
                <View className='goods-item-wrap' key={`goods-item-wrap__${index}`}>
                  <CompGoods />
                </View>
              ))}
            </ScrollView>
          </AtTabsPane>
          <AtTabsPane current={current} index={1}>
            <ScrollView className='tab-scroll-list' scrollY>
              {[1, 2, 3, 4, 5].map((item, index) => (
                <View className='user-item' key={`user-item__${index}`}>
                  <SpImage width={100} height={100} />
                  <View className='user-item-bd'>
                    <View className='name'>客户昵称</View>
                    <View className='mobile'>138****8888</View>
                    <View className='vip'>白金会员</View>
                  </View>
                  <AtButton circle>选择客户</AtButton>
                </View>
              ))}
            </ScrollView>
          </AtTabsPane>
        </AtTabs>
      </SpFloatLayout>

      <AtCurtain
        isOpened={addUserCurtain}
        onClose={() => {
          setState((draft) => {
            draft.addUserCurtain = false
          })
        }}
      >
        <View
          className='create-user'
          style={styleNames({
            'background-image': `url(${process.env.APP_IMAGE_CDN}/create_member_bk.png)`
          })}
        >
          <View className='create-user-hd'>
            <View className='title'>创建会员</View>
            <View className='sub-title'>引导客户创建会员，领取新客礼</View>
          </View>
          <View className='create-user-bd'>
            <View className='form-field'>
              <AtInput className='mobile' />
            </View>
            <View className='form-field'>
              <AtInput className='code' />
              <View className='send-code'>重新发送</View>
            </View>
          </View>
          <View className='create-user-ft'>
            <View className='btn-submit'>快捷创建</View>
          </View>
        </View>
      </AtCurtain>
    </SpPage>
  )
}

DianWuCashier.options = {
  addGlobalClass: true
}

export default DianWuCashier
