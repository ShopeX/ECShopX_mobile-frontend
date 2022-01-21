import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { SpFloatLayout, SpButton, SpImage, SpPrice, SpInputNumber } from '@/components'
import { classNames } from '@/utils'
import './index.scss'

// 数据类型
// interface IskuItem: {

// }
// skuItem: {
//   specName: ''
//   specId: ''
// }
// skuList: skuItem[]

// specItems

const initialState = {
  curImage: null,
  selection: [],
  disabledSet: new Set()
}
function SpSkuSelect (props) {
  const { info, open = false, onClose = () => {} } = props
  const [state, setState] = useImmer(initialState)
  const { selection, curImage, disabledSet } = state
  if (!info) {
    return null
  }
  const { skuList, specItems } = info

  useEffect(() => {
    console.log('skuList:', skuList)
    console.log('specItems:', specItems)
    const skuDict = {}
    // 默认选择sku
    const res = specItems.filter((item) => item.store > 0)
    res.forEach((item) => {
      const key = item.itemSpec.map((spec) => spec.spec_value_id).join('_')
      skuDict[key] = item
    })

    const defaultSelectSku = res.length > 0 ? res[0] : {}
    const initSelection = defaultSelectSku.itemSpec.map((item) => item.spec_value_id)

    console.log('skuDict:', skuDict, 'selection:', selection)

    calcDisabled(initSelection)

    console.log('disabledSet:', disabledSet)
  }, [info])

  const calcDisabled = (selection) => {
    const _disabledSet = new Set()
    const makeReg = (sel, row, val) => {
      const tSel = sel.slice()
      const regStr = tSel.map((s, idx) => (row === idx ? val : !s ? '(\\d+)' : s)).join('_')
      // console.log('regStr:', regStr)
      return new RegExp(regStr)
    }

    const isNotDisabled = (sel, row, val) => {
      const reg = makeReg(sel, row, val)

      return Object.keys(skuDict).some((key) => {
        return key.match(reg) && skuDict[key].store > 0
      })
    }

    for (let i = 0, l = skuList.length; i < l; i++) {
      const { spec_values } = skuList[i]
      for (let j = 0, k = spec_values.length; j < k; j++) {
        const id = spec_values[j].spec_value_id
        if (!_disabledSet.has(id) && !isNotDisabled(selection, i, id)) {
          _disabledSet.add(id)
        }
      }
    }

    setState((draft) => {
      draft.selection = selection
      draft.disabled = _disabledSet
    })
  }

  const handleSelectSku = ({ spec_value_id }, idx) => {
    debugger
    if (disabledSet.has(spec_value_id)) return

    if (selection[idx] == spec_value_id) {
      selection[idx] = null
    } else {
      selection[idx] = spec_value_id
    }

    calcDisabled(selection)
  }

  return (
    <SpFloatLayout
      className='sp-sku-select'
      open={open}
      onClose={onClose}
      renderFooter={<SpButton resetText='加入购物车' confirmText='立即购买'></SpButton>}
    >
      <View className='sku-info'>
        <SpImage className='sku-image' width={170} height={170} />
        <View className='info-bd'>
          <View className='goods-sku-price'>
            <SpPrice value={100}></SpPrice>
          </View>
          <View className='goods-sku-txt'>xxxxx</View>
        </View>
      </View>
      <View className='sku-list'>
        {/* {skuList.map((item, index) => (
          <View className='sku-group'>
            <View className='sku-name'>{item.spec_name}</View>
            <View className='sku-values'>
              {item.spec_values.map((spec) => (
                <View
                  className={classNames('sku-btn', {
                    'active': spec.spec_value_id == selection[index],
                    'disabled': disabledSet.has(spec.spec_value_id)
                  })}
                  onClick={handleSelectSku.bind(this, spec, index)}
                >
                  {spec.spec_custom_value_name || spec.spec_value_name}
                </View>
              ))}
            </View>
          </View>
        ))} */}
        <View className='buy-count'>
          <View className='label'>
            购买数量<Text className='limit-count'>（限购5件）</Text>
          </View>

          <SpInputNumber />
        </View>
      </View>
    </SpFloatLayout>
  )
}

SpSkuSelect.options = {
  addGlobalClass: true
}

export default SpSkuSelect
