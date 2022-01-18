import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtFloatLayout, AtButton } from 'taro-ui'
import { SpCell, SpPrice, SpFloatLayout, SpCheckboxNew, SpGoodsCell } from '@/components'
import api from '@/api'
import './comp-packagelist.scss'

function CompPackageList (props) {
  const { open = false, info, onClose } = props
  if (!info) {
    return null
  }
  const { mainGoods, makeUpGoods } = info

  // useEffect(() => {
  //   fetch()
  // }, [])

  // const fetch = async () =>{
  //   const { itemLists, mainItem, main_package_price, package_price: packagePrice } = await api.item.packageDetail(info.package_id)
  // }

  return (
    <SpFloatLayout
      className='comp-packagelist'
      title='优惠组合'
      open={open}
      onClose={onClose}
      renderFooter={
        <View className='flay-ft'>
          <View>
            组合价：
            <SpPrice value={100} />
          </View>
          <View className='btn-wrap'>
            <AtButton type='primary' circle>
              加入购物车
            </AtButton>
          </View>
        </View>
      }
    >
      <View className='main-goods'>主商品</View>
      <View className='main-goods-list'>
        <View className='main-goods-item'>
          <SpCheckboxNew />
          <SpGoodsCell info={mainGoods} />
        </View>
      </View>
      <View className='makeup-goods'>可选商品</View>
      <View className='makeup-goods-list'>
        {makeUpGoods.map((item, index) => (
          <View className='makeup-goods-item'>
            <SpCheckboxNew />
            <SpGoodsCell info={item} />
          </View>
        ))}
      </View>
    </SpFloatLayout>
  )
}

CompPackageList.options = {
  addGlobalClass: true
}

export default CompPackageList
