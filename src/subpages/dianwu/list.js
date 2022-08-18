import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { AtButton, AtTabs, AtTabsPane } from 'taro-ui'
import api from '@/api'
import doc from '@/doc'
import { useDianWuLogin } from '@/hooks'
import { View, Text } from '@tarojs/components'
import { SpPage, SpScrollView, SpPrice, SpImage, SpSearchInput, SpVipLabel } from '@/components'
import { classNames, pickBy, showToast } from '@/utils'
import { SG_ROUTER_PARAMS } from '@/consts'
import CompGoods from './comps/comp-goods'
import './list.scss'

const initialState = {
  keywords: '',
  typeList: [
    { title: '全部商品', value: '2' },
    { title: '促销商品', value: '3' }
  ],
  list: [],
  current: 0,
  cartList: []
}

function DianWuList() {
  const [state, setState] = useImmer(initialState)
  const { keywords, typeList, current, list, cartList } = state
  const goodsRef = useRef()
  const $instance = getCurrentInstance()
  const { distributor_id } = $instance.router.params

  useDianWuLogin()

  useEffect(() => {
    getCashierList()
  }, [])

  useEffect(() => {
    goodsRef.current.reset()
  }, [keywords])

  const fetch = async ({ pageIndex, pageSize }) => {
    let params = {
      page: pageIndex,
      pageSize,
      distributor_id
    }
    if (keywords) {
      params = {
        ...params,
        keywords
      }
    }
    const { list: _list, total_count } = await api.dianwu.goodsItems(params)

    setState((draft) => {
      draft.list[pageIndex - 1] = pickBy(_list, doc.dianwu.GOODS_ITEM)
    })

    return {
      total: total_count
    }
  }

  const handleAddToCart = async ({ itemId }) => {
    await api.dianwu.addToCart({
      item_id: itemId,
      num: 1
    })
    getCashierList()
    showToast('加入收银台成功')
  }

  const getCashierList = async () => {
    const { valid_cart } = await api.dianwu.getCartDataList()
    setState((draft) => {
      draft.cartList = pickBy(valid_cart, doc.dianwu.CART_GOODS_ITEM)
    })
  }

  return (
    <SpPage
      className='page-dianwu-list'
      scrollToTopBtn
      renderFooter={
        <View className='footer-wrap'>
          <View className='total-info'>
            <SpPrice value={cartList[0]?.totalPrice} size={38} />
            <View className='txt'>已选择{cartList[0]?.totalNum}件商品</View>
          </View>
          <View
            className='btn-confirm'
            onClick={() => {
              Taro.navigateTo({
                url: `/subpages/dianwu/cashier?distributor_id=${distributor_id}`
              })
            }}
          >
            进入收银台
          </View>
        </View>
      }
    >
      <View className='search-block'>
        <SpSearchInput
          placeholder='请输入商品货号/商品名'
          onConfirm={(val) => {
            setState((draft) => {
              draft.keywords = val
            })
          }}
        />
      </View>
      {/* <AtTabs current={current} tabList={typeList} onClick={() => {}}></AtTabs> */}
      <SpScrollView className='item-list-scroll' auto={false} ref={goodsRef} fetch={fetch}>
        {list.map((items, idx) => {
          return items.map((item, sidx) => (
            <View className='item-wrap' key={`item-wrap__${idx}_${sidx}`}>
              {/* <View className='item-hd'>
                <View className='promotion-list'>
                  <Text className='promotion-tag'>满1000减100</Text>
                  <Text className='promotion-tag'>满1000赠小样</Text>
                  <Text className='promotion-tag'>满1000赠小样</Text>
                </View>
                <View className='view-discount'>
                  查看<Text className='iconfont icon-qianwang-01'></Text>
                </View>
              </View> */}
              <CompGoods info={item}>
                <AtButton
                  circle
                  className={classNames({ 'active': true })}
                  onClick={handleAddToCart.bind(this, item)}
                >
                  <Text className='iconfont icon-plus'></Text>
                </AtButton>
              </CompGoods>
            </View>
          ))
        })}
      </SpScrollView>
    </SpPage>
  )
}

DianWuList.options = {
  addGlobalClass: true
}

export default DianWuList
