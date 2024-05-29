import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import { useSelector } from 'react-redux'
import { View, Text, Image } from '@tarojs/components'
import { SpPrice, SpInputNumber, SpImage, SpCheckboxNew } from '@/components'
import { VERSION_IN_PURCHASE } from '@/utils'

import './comp-goodsitems.scss'

const initialState = {
  allChecked: true
}
function CompGoodsItem(props) {
  const [state, setState] = useImmer(initialState)
  const { allChecked } = state

  const onChangeGoodsIsCheck = () => {}

  const onChangeInputNumber = (value) => {}

  return (
    <View>
      <View className='comp-goodsitems'>
        <SpCheckboxNew
          checked={allChecked}
          label='方方的徐汇点'
          onChange={onChangeGoodsIsCheck()}
          className='comp-goodsitems-checkbox'
        />
        <View className='comp-goodsitems-item'>
          <View className='comp-goodsitems-item-del'>
            <SpCheckboxNew checked={allChecked} onChange={onChangeGoodsIsCheck()} />
            <SpImage
              className='comp-goodsitem-item-del-image'
              mode='aspectFill'
              circle={16}
              src='https://img2.baidu.com/it/u=3976722208,1729629707&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1716915600&t=9ca8874bd9a1a056913a5d41488bf99e'
              width={130}
              height={130}
            />
            <View className='comp-goodsitems-item-del-info'>
              <View className='name'>
                <Text>斗罗第100弹六一特别款</Text>
                <Text className='iconfont icon-shanchu-01' />
              </View>
              <View className='new'>新品</View>
              <View className='money'>
                <SpPrice className='mkt-price' value='1000' />
                <SpInputNumber value='7' max='8' min={1} onChange={onChangeInputNumber} />
              </View>
            </View>
          </View>

          <View className='comp-goodsitems-item-del'>
            <SpCheckboxNew checked={allChecked} onChange={onChangeGoodsIsCheck()} />
            <SpImage
              className='comp-goodsitem-item-del-image'
              mode='aspectFill'
              circle={16}
              src='https://img2.baidu.com/it/u=3976722208,1729629707&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1716915600&t=9ca8874bd9a1a056913a5d41488bf99e'
              width={130}
              height={130}
            />
            <View className='comp-goodsitems-item-del-info'>
              <View className='name'>
                <Text>斗罗第100弹六一特别款</Text>
                <Text className='iconfont icon-shanchu-01' />
              </View>
              <View className='new'>新品</View>
              <View className='money'>
                <SpPrice className='mkt-price' value='1000' />
                <SpInputNumber value='7' max='8' min={1} onChange={onChangeInputNumber} />
              </View>
            </View>
          </View>

          <View className='comp-goodsitems-item-del'>
            <SpCheckboxNew checked={allChecked} onChange={onChangeGoodsIsCheck()} />
            <SpImage
              className='comp-goodsitem-item-del-image'
              mode='aspectFill'
              circle={16}
              src='https://img2.baidu.com/it/u=3976722208,1729629707&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1716915600&t=9ca8874bd9a1a056913a5d41488bf99e'
              width={130}
              height={130}
            />
            <View className='comp-goodsitems-item-del-info'>
              <View className='name'>
                <Text>斗罗第100弹六一特别款</Text>
                <Text className='iconfont icon-shanchu-01' />
              </View>
              <View className='new'>新品</View>
              <View className='money'>
                <SpPrice className='mkt-price' value='1000' />
                <SpInputNumber value='7' max='8' min={1} onChange={onChangeInputNumber} />
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className='comp-goodsitems-invalid'>
        <View className='comp-goodsitems-invalid-title'>
          <View>失效商品2件</View>
          <View>清空失效商品</View>
        </View>
        <View className='comp-goodsitems-item'>
          <View className='comp-goodsitems-item-del'>
            <SpCheckboxNew checked={allChecked} onChange={onChangeGoodsIsCheck()} />
            <SpImage
              className='comp-goodsitem-item-del-image'
              mode='aspectFill'
              circle={16}
              src='https://img2.baidu.com/it/u=3976722208,1729629707&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1716915600&t=9ca8874bd9a1a056913a5d41488bf99e'
              width={130}
              height={130}
            />
            <View className='comp-goodsitems-item-del-info'>
              <View className='name'>
                <Text>斗罗第100弹六一特别款</Text>
                <Text className='iconfont icon-shanchu-01' />
              </View>
              <View className='reason'>所在地区该商品无法配送</View>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default CompGoodsItem
