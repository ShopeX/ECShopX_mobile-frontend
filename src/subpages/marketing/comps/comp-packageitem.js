import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { SpCheckboxNew, SpGoodsCell, SpSkuSelect } from '@/components'
import api from '@/api'
import { pickBy } from '@/utils'
import doc from '@/doc'
import './comp-packageitem.scss'

const initialState = {
  mainGoods: null,
  makeUpGoods: [],
  skuPanelOpen: false,
  skuInfo: null
}

const MSpSkuSelect = React.memo(SpSkuSelect)
function CompPackageItem (props) {
  const { info } = props
  const [state, setState] = useImmer(initialState)
  const { mainGoods, makeUpGoods, skuPanelOpen, skuInfo } = state

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
    console.log(pickBy(mainItem, doc.goods.GOODS_INFO))
    setState((draft) => {
      draft.mainGoods = pickBy(mainItem, doc.goods.GOODS_INFO)
      draft.makeUpGoods = pickBy(itemLists, doc.goods.GOODS_INFO)
    })
  }

  const onSelectSku = (item) => {
    debugger
    setState((draft) => {
      draft.skuInfo = item
      draft.skuPanelOpen = true
    })
  }

  console.log('mainGoods:', mainGoods)
  return (
    <View className='comp-packageitem'>
      <View className='main-goods'>主商品</View>
      <SpGoodsCell info={mainGoods} onSelectSku={onSelectSku.bind(this)} />
      <View className='select-goods'>可选商品</View>
      {makeUpGoods.map((item, index) => (
        <View className='makeup-goods-item' key={`makeup-goods-item__${index}`}>
          <SpCheckboxNew />
          <SpGoodsCell info={item} onSelectSku={onSelectSku.bind(this, item)} />
        </View>
      ))}

      {/* Sku选择器 */}
      <MSpSkuSelect open={skuPanelOpen} info={skuInfo} onClose={() => {}} />
    </View>
  )
}

CompPackageItem.options = {
  addGlobalClass: true
}

export default CompPackageItem
