import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { SpFloatLayout, SpButton, SpImage, SpPrice, SpInputNumber } from '@/components'
import { useAsyncCallback } from '@/hooks'
import { classNames } from '@/utils'
import './index.scss'

// 数据类型
// interface ISkuItem: {
//   specName: string
//   specId: string
// }
// skuList: ISkuItem[]

// specItems

const initialState = {
  curImage: null,
  selection: [],
  disabledSet: new Set(),
  curItem: null,
  skuText: ''
}

function SpSkuSelect (props) {
  const { info, open = false, onClose = () => {} } = props
  // const [state, setState] = useImmer(initialState)
  const [state, setState] = useAsyncCallback(initialState)
  const { selection, curImage, disabledSet, curItem } = state
  const skuDictRef = useRef({})

  console.log('xxxxx')
  useEffect(() => {
    if (info) {
      init()
    }
  }, [info])

  const init = () => {
    const { skuList, specItems } = info
    console.log('skuList:', skuList)
    console.log('specItems:', specItems)
    specItems.forEach((item) => {
      const key = item.specItem.map((spec) => spec.specId).join('_')
      skuDictRef.current[key] = item
    })
    // 默认选择
    const defaultSpecItem = specItems.find((item) => item.store > 0) || {}
    const selection = defaultSpecItem.specItem.map((item) => item.specId)

    calcDisabled(selection)
  }

  const calcDisabled = (selection) => {
    const disabledSet = new Set()
    const makeReg = (sel, row, val) => {
      const tSel = sel.slice()
      const regStr = tSel.map((s, idx) => (row === idx ? val : !s ? '(\\d+)' : s)).join('_')
      // console.log('regStr:', regStr)
      return new RegExp(regStr)
    }

    const isNotDisabled = (sel, row, val) => {
      const reg = makeReg(sel, row, val)

      return Object.keys(skuDictRef.current).some((key) => {
        return key.match(reg) && skuDictRef.current[key].store > 0
      })
    }

    for (let i = 0, l = skuList.length; i < l; i++) {
      const { skuValue } = skuList[i]
      for (let j = 0, k = skuValue.length; j < k; j++) {
        const id = skuValue[j].specId
        if (!disabledSet.has(id) && !isNotDisabled(selection, i, id)) {
          disabledSet.add(id)
        }
      }
    }
    console.log(
      'skuDict:',
      skuDictRef.current,
      'selection:',
      selection,
      'disabledSet:',
      disabledSet
    )

    const curItem = skuDictRef.current[selection.join('_')]

    setState((draft) => {
      draft.selection = selection
      draft.disabledSet = disabledSet
      draft.curItem = curItem
    })
  }

  // calcDisabled(initSelection)

  // console.log('disabledSet:', disabledSet)

  const handleSelectSku = ({ specId }, idx) => {
    if (disabledSet.has(specId)) return
    setState(
      (draft) => {
        draft.selection[idx] = selection[idx] == specId ? null : specId
        draft.curImage = 1
      },
      ({ selection }) => {
        calcDisabled(selection)
      }
    )
  }

  const getImgs = () => {
    let img = info.imgs[0]
    if (curItem) {
      const { specImgs } = curItem.specItem[curItem.specItem.length - 1]
      if (specImgs.length > 0) {
        img = specImgs[0]
      }
    }
    console.log('img:', img)
    return img
  }

  const handlePreviewImage = () => {
    let imgUrls = info.imgs
    if (curItem) {
      const { specImgs } = curItem.specItem[curItem.specItem.length - 1]
      if (specImgs.length > 0) {
        imgUrls = specImgs
      }
    }
    Taro.previewImage({
      urls: imgUrls
    })
  }

  if (!info) {
    return null
  }

  const { skuList } = info

  return (
    <SpFloatLayout
      className='sp-sku-select'
      open={open}
      onClose={onClose}
      renderFooter={<SpButton resetText='加入购物车' confirmText='立即购买'></SpButton>}
    >
      <View className='sku-info'>
        <SpImage
          className='sku-image'
          src={getImgs()}
          width={170}
          height={170}
          onClick={handlePreviewImage}
        />
        <View className='info-bd'>
          <View className='goods-sku-price'>
            <SpPrice value={100}></SpPrice>
            <SpPrice value={100} lineThrough></SpPrice>
          </View>
          <View className='goods-sku-txt'>xxxxx</View>
        </View>
      </View>
      <View className='sku-list'>
        {skuList.map((item, index) => (
          <View className='sku-group'>
            <View className='sku-name'>{item.skuName}</View>
            <View className='sku-values'>
              {item.skuValue.map((spec) => (
                <View
                  className={classNames('sku-btn', {
                    'active': spec.specId == selection[index],
                    'disabled': disabledSet.has(spec.specId),
                    'sku-img': spec.specImgs.length > 0
                  })}
                  onClick={handleSelectSku.bind(this, spec, index)}
                >
                  {spec.specImgs.length > 0 && (
                    <SpImage src={spec.specImgs[0]} width={214} height={214} />
                  )}
                  <Text className='spec-name'>{spec.specName}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
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
