import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import { useSelector } from 'react-redux'
import { View, Text, Image } from '@tarojs/components'
import { SpPrice, SpInputNumber, SpImage, SpCheckboxNew } from '@/components'
import { VERSION_IN_PURCHASE } from '@/utils'
import { AtButton } from 'taro-ui'

import './index.scss'

const initialState = {}
function CompGoodsItem(props) {
  const [state, setState] = useImmer(initialState)
  const {} = state

  const {
    deletes = () => {},
    onSelectAll = () => {},
    onSingleChoice = () => {},
    onChangeInputNumber = () => {},
    balance = () => {},
    lists = []
  } = props

  const allChecked = lists.cart_total_count == lists.list.length

  return (
    <View>
      {console.log(lists, 'llllist------')}
      <View className='comp-goodsitems'>
        <View className='comp-goodsitems-checkbox'>
          <Text className='iconfont icon-shop' />
          {lists.shop_name || '自营'}
        </View>
        <View className='comp-goodsitems-item'>
          {lists.list.map((item, index) => {
            return (
              <View className='comp-goodsitems-item-del' key={index}>
                <SpCheckboxNew
                  checked={item.is_checked}
                  onChange={() => onSingleChoice(item, 'item', item.is_checked)}
                />
                <SpImage
                  className='comp-goodsitem-item-del-image'
                  mode='aspectFill'
                  circle={16}
                  src={item.pics}
                  width={130}
                  height={130}
                />
                <View className='comp-goodsitems-item-del-info'>
                  <View className='name'>
                    <Text className='names'>{item.item_name}</Text>
                    <Text className='iconfont icon-shanchu-01' onClick={() => deletes(item)} />
                  </View>
                  <View className='details'>{item.item_spec_desc}</View>
                  {/* <View className='new'>新品</View> */}
                  <View className='money'>
                    <View>
                      <SpPrice className='mkt-price' value={item.price / 100} />
                      {item.market_price - item.price > 0 && (
                        <SpPrice
                          className='mkt-price'
                          lineThrough
                          value={item.market_price / 100}
                        />
                      )}
                    </View>
                    <SpInputNumber
                      value={item.num}
                      max={parseInt(item?.limitedBuy ? item?.limitedBuy?.limit_buy : item.store)}
                      min={1}
                      onChange={(event) => onChangeInputNumber(event, item)}
                    />
                  </View>
                </View>
              </View>
            )
          })}

          <View className='comp-goodsitems-item-ft'>
            <View className='lf'>
              <SpCheckboxNew
                checked={allChecked}
                label='全选'
                onChange={() => onSelectAll(lists, 'all', allChecked)}
              />
            </View>
            <View className='rg'>
              <View>
                <View className='total-price-wrap'>
                  合计：
                  <SpPrice className='total-pirce' value={lists.total_fee / 100} />
                </View>
                {lists.discount_fee > 0 && (
                  <View className='discount-price-wrap'>
                    共优惠：
                    <SpPrice className='total-pirce' value={lists.discount_fee / 100} />
                  </View>
                )}
              </View>
              <AtButton
                className='btn-calc'
                type='primary'
                circle
                disabled={lists.cart_total_num <= 0}
                onClick={() => balance(lists)}
              >
                结算({lists.cart_total_num})
              </AtButton>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default CompGoodsItem
