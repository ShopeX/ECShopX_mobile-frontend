import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import { View, Text } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { SpFloatLayout, SpButton, SpImage, SpPrice, SpInputNumber } from '@/components'
import { addCart, updateCount } from '@/store/slices/cart'
import api from '@/api'
import { useAsyncCallback } from '@/hooks'
import { classNames, showToast } from '@/utils'
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
  skuText: '',
  num: 1
}

function SpSkuSelect (props) {
  const {
    info,
    open = false,
    onClose = () => {},
    onChange = () => {},
    type,
    hideInputNumber = false
  } = props
  // const [state, setState] = useImmer(initialState)
  const [state, setState] = useAsyncCallback(initialState)
  const { selection, curImage, disabledSet, curItem, skuText, num } = state
  const dispatch = useDispatch()
  const skuDictRef = useRef({})

  useEffect(() => {
    if (info && !info.nospec) {
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
    const defaultSpecItem = specItems.find((item) => item.store > 0)
    let selection = Array(specItems.length).fill(null)
    if (defaultSpecItem) {
      selection = defaultSpecItem.specItem.map((item) => item.specId)
    }

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
    const skuText = curItem
      ? `已选：${curItem.specItem.map((item) => `${item.skuName}:${item.specName}`).join(',')}`
      : '请选择规格'

    setState((draft) => {
      draft.selection = selection
      draft.disabledSet = disabledSet
      draft.curItem = curItem
      draft.skuText = skuText
    })

    onChange(skuText, curItem)
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
    // console.log('img:', img)
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

  const addToCart = async () => {
    await dispatch(
      addCart({
        item_id: curItem ? curItem.itemId : info.itemId,
        num,
        distributor_id: info.distributorId,
        shop_type: 'distributor'
      })
    )
    dispatch(updateCount({ shop_type: 'distributor' }))
    showToast('成功加入购物车')
  }

  const fastBuy = async () => {
    const { distributorId } = info
    await api.cart.fastBuy({
      item_id: curItem ? curItem.itemId : info.itemId,
      num,
      distributor_id: distributorId
    })
    Taro.navigateTo({
      url: `/pages/cart/espier-checkout`
    })
  }

  const renderFooter = () => {
    if (type == 'picker') {
      return (
        <AtButton circle type='primary' onClick={onClose}>
          确定
        </AtButton>
      )
      // if (info.store == 0) {
      //   return (
      //     <AtButton circle onClick={onClose}>
      //       取消
      //     </AtButton>
      //   )
      // } else {
      //   return (
      //     <SpButton
      //       resetText='加入购物车'
      //       confirmText='立即购买'
      //       onReset={addToCart}
      //       onConfirm={fastBuy}
      //     ></SpButton>
      //   )
      // }
    } else if (type == 'addcart') {
      return (
        <AtButton circle type='primary' onClick={addToCart}>
          确定
        </AtButton>
      )
    } else if (type == 'fastbuy') {
      return (
        <AtButton circle type='primary' onClick={fastBuy}>
          立即购买
        </AtButton>
      )
    }
  }
  return (
    <SpFloatLayout
      className='sp-sku-select'
      open={open}
      onClose={onClose}
      renderFooter={renderFooter()}
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
            <SpPrice value={curItem ? curItem.price : info.price}></SpPrice>
            <SpPrice value={curItem ? curItem.marketPrice : info.marketPrice} lineThrough></SpPrice>
          </View>
          <View className='goods-sku-txt'>{skuText}</View>
          <View className='goods-sku-store'>库存：{curItem ? curItem.store : info.store}</View>
        </View>
      </View>
      <View className='sku-list'>
        {skuList.map((item, index) => (
          <View className='sku-group' key={`sku-group__${index}`}>
            <View className='sku-name'>{item.skuName}</View>
            <View className='sku-values'>
              {item.skuValue.map((spec, idx) => (
                <View
                  className={classNames('sku-btn', {
                    'active': spec.specId == selection[index],
                    'disabled': disabledSet.has(spec.specId),
                    'sku-img': spec.specImgs.length > 0
                  })}
                  onClick={handleSelectSku.bind(this, spec, index)}
                  key={`sku-values-item__${idx}`}
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
        {!hideInputNumber && (
          <View className='buy-count'>
            <View className='label'>
              购买数量<Text className='limit-count'>（限购5件）</Text>
            </View>

            <SpInputNumber
              value={num}
              min={1}
              onChange={(n) => {
                setState((draft) => {
                  draft.num = n
                })
              }}
            />
          </View>
        )}
      </View>
    </SpFloatLayout>
  )
}

SpSkuSelect.options = {
  addGlobalClass: true
}

export default SpSkuSelect
