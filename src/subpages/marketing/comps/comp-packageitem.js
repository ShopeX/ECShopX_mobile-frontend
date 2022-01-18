import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { SpCheckboxNew, SpGoodsCell } from '@/components'
import api from '@/api'
import { pickBy } from '@/utils'
import doc from '@/doc'
import './comp-packageitem.scss'

const initialState = {
  mainGoods: null
}
function CompPackageItem (props) {
  const { info } = props
  const [state, setState] = useImmer(initialState)
  const { mainGoods } = state

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    const {
      itemLists,
      mainItem,
      main_package_price,
      package_price: packagePrice
    } = await api.item.packageDetail(info.package_id)

    setState((draft) => {
      draft.mainGoods = pickBy(mainItem, doc.goods.GOODS_INFO)
    })
  }

  return (
    <View className='comp-packageitem'>
      <View className='main-goods'>主商品</View>
      <SpCheckboxNew>
        <SpGoodsCell info={mainGoods} />
      </SpCheckboxNew>
      <View className='select-goods'>可选商品</View>
    </View>
  )
}

CompPackageItem.options = {
  addGlobalClass: true
}

export default CompPackageItem
