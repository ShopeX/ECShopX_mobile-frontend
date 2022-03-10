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
  skuInfo: null,
  curGoodsType: 0, // 0:主商品； 1:可选商品
  curMakeUpGoodsIndex: 0,
  selection: new Set()
}

const MSpSkuSelect = React.memo(SpSkuSelect)
function CompPackageItem(props) {
  const { info, onChange } = props
  const [state, setState] = useImmer(initialState)
  const {
    mainGoods,
    makeUpGoods,
    skuPanelOpen,
    skuInfo,
    selection,
    curGoodsType,
    curMakeUpGoodsIndex
  } = state

  useEffect(() => {
    fetch()
  }, [])

  useEffect(() => {
    if (mainGoods && makeUpGoods) {
      calcPackage()
    }
  }, [selection])

  useEffect(() => {
    if (mainGoods && makeUpGoods) {
      calcPackage()
    }
  }, [mainGoods, makeUpGoods])

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

  const onSelectSku = (idx, sidx, item) => {
    console.log(mainGoods, makeUpGoods)
    setState((draft) => {
      draft.skuInfo = item
      draft.skuPanelOpen = true
      draft.curGoodsType = idx
      draft.curMakeUpGoodsIndex = sidx
    })
  }

  const handleSelectGoods = ({ itemId }, checked) => {
    const _selection = new Set()
    selection.forEach((value) => {
      _selection.add(value)
    })
    if (checked) {
      _selection.add(itemId)
    } else {
      _selection.delete(itemId)
    }
    setState((draft) => {
      draft.selection = _selection
    })
  }

  const onChangeSkuSelect = (specText, curItem) => {
    console.log(specText, curItem)
    if (curGoodsType == 0) {
      setState((draft) => {
        draft.mainGoods.specText = specText
        draft.mainGoods['curItem'] = curItem
      })
    } else {
      setState((draft) => {
        draft.makeUpGoods[curMakeUpGoodsIndex].specText = specText
        draft.makeUpGoods[curMakeUpGoodsIndex]['curItem'] = curItem
      })
    }
  }

  // 计算优惠组合
  const calcPackage = () => {
    let itemId // 主商品id
    let sitemIds = [] // 可选商品id
    let packageTotalPrice = 0
    // 单规格
    if (mainGoods.nospec) {
      itemId = mainGoods.itemId
      packageTotalPrice += mainGoods.packagePrice
    } else {
      // 已选择规格
      if (mainGoods.curItem) {
        itemId = mainGoods.curItem.itemId
        packageTotalPrice += mainGoods.curItem.packagePrice
      }
    }
    makeUpGoods.forEach((goods) => {
      if (selection.has(goods.itemId)) {
        if (goods.nospec) {
          sitemIds.push(goods.itemId)
          packageTotalPrice += goods.packagePrice
        } else {
          // 已选择规格
          if (goods.curItem) {
            sitemIds.push(goods.curItem.itemId)
            packageTotalPrice += goods.curItem.packagePrice
          } else {
            sitemIds.push(null)
          }
        }
      }
    })
    onChange && onChange({ itemId, sitemIds, packageTotalPrice })
  }

  // console.log('mainGoods:', mainGoods)
  return (
    <View className='comp-packageitem'>
      <View className='main-goods'>主商品</View>
      <SpGoodsCell info={mainGoods} onSelectSku={onSelectSku.bind(this, 0, null)} />
      <View className='select-goods'>可选商品</View>
      {makeUpGoods.map((item, index) => (
        <View className='makeup-goods-item' key={`makeup-goods-item__${index}`}>
          <SpCheckboxNew
            checked={selection.has(item.itemId)}
            onChange={handleSelectGoods.bind(this, item)}
          />
          <SpGoodsCell info={item} onSelectSku={onSelectSku.bind(this, 1, index)} />
        </View>
      ))}

      {/* Sku选择器 */}
      <MSpSkuSelect
        hideInputNumber
        open={skuPanelOpen}
        info={skuInfo}
        onClose={() => {
          setState((draft) => {
            draft.skuPanelOpen = false
          })
        }}
        onChange={onChangeSkuSelect}
      />
    </View>
  )
}

CompPackageItem.options = {
  addGlobalClass: true
}

export default CompPackageItem
