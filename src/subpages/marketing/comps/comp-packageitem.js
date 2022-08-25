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
  selection: new Set(),
  main_package_price: null,
  package_price: null
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
    curMakeUpGoodsIndex,
    main_package_price,
    package_price
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
    const { itemLists, mainItem, main_package_price, package_price } = await api.item.packageDetail(
      info.package_id
    )
    console.log('packageDetail:', package_price)
    setState((draft) => {
      draft.mainGoods = pickBy(mainItem, doc.goods.GOODS_INFO)
      itemLists.forEach((item) => {
        item.spec_items.forEach((spec) => {
          spec.price = package_price[spec.item_id].price
        })
      })
      draft.makeUpGoods = pickBy(itemLists, doc.goods.GOODS_INFO)
      draft.main_package_price = main_package_price
      draft.package_price = package_price
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
        console.log(package_price[curItem.itemId].price)
        draft.makeUpGoods[curMakeUpGoodsIndex].specText = specText
        draft.makeUpGoods[curMakeUpGoodsIndex]['curItem'] = {
          ...curItem,
          price: package_price[curItem.itemId].price / 100
        }
      })
    }
  }

  // 计算组合优惠
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
        // packageTotalPrice += mainGoods.curItem.packagePrice
        packageTotalPrice += main_package_price[itemId].price / 100
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
            // packageTotalPrice += goods.curItem.packagePrice
            packageTotalPrice += package_price[goods.curItem.itemId].price / 100
          } else {
            sitemIds.push(null)
          }
        }
      }
    })
    onChange && onChange({ itemId, sitemIds, packageTotalPrice })
  }

  console.log('makeUpGoods:', makeUpGoods)
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
        type='picker'
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
