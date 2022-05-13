import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import { View, Text } from '@tarojs/components'
import { useImmer } from 'use-immer'
import {
  SpFloatLayout,
  SpButton,
  SpImage,
  SpPrice,
  SpInputNumber,
  SpGoodsPrice
} from '@/components'
import { addCart, updateCount } from '@/store/slices/cart'
import { BUY_TOOL_BTNS } from '@/consts'
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
  num: 1,
  loading: false
}

function SpSkuSelect(props) {
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
  const { selection, curImage, disabledSet, curItem, skuText, num, loading } = state
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
    const { nospec } = info
    if (!nospec && !curItem) {
      showToast('请选择规格')
      return
    }
    Taro.showLoading()
    await dispatch(
      addCart({
        item_id: curItem ? curItem.itemId : info.itemId,
        num,
        distributor_id: info.distributorId,
        shop_type: 'distributor'
      })
    )
    dispatch(updateCount({ shop_type: 'distributor' }))
    Taro.hideLoading()
    showToast('成功加入购物车')
  }

  const fastBuy = async () => {
    const { nospec } = info
    if (!nospec && !curItem) {
      showToast('请选择规格')
      return
    }
    Taro.showLoading()
    onClose()
    const { distributorId, activityType, activityInfo } = info
    const itemId = curItem ? curItem.itemId : info.itemId
    await api.cart.fastBuy({
      item_id: curItem ? curItem.itemId : info.itemId,
      num,
      distributor_id: distributorId
    })
    let url = `/pages/cart/espier-checkout?cart_type=fastbuy&shop_id=${distributorId}`
    if (activityType == 'seckill' || activityType === 'limited_time_sale') {
      const { seckill_id } = activityInfo
      const { ticket } = await api.item.seckillCheck({
        item_id: itemId,
        seckill_id: seckill_id,
        num
      })
      url += `&type=${activityType}&seckill_id=${seckill_id}&ticket=${ticket}`
    } else if (activityType == 'group') {
      const { groups_activity_id } = activityInfo
      url += `&type=${activityType}&group_id=${groups_activity_id}`
    }
    Taro.hideLoading()
    Taro.navigateTo({
      url
    })
  }

  const renderFooter = () => {
    let btnTxt = ''
    Object.keys(BUY_TOOL_BTNS).forEach((key) => {
      if (BUY_TOOL_BTNS[key].key == type) {
        btnTxt = BUY_TOOL_BTNS[key].title
      }
    })
    if (type == 'picker') {
      return (
        <AtButton circle type='primary' onClick={onClose}>
          确定
        </AtButton>
      )
    } else if (type == 'addcart') {
      return (
        <AtButton circle loading={loading} type='primary' onClick={addToCart}>
          {btnTxt}
        </AtButton>
      )
    } else {
      return (
        <AtButton circle loading={loading} type='primary' onClick={fastBuy}>
          {btnTxt}
        </AtButton>
      )
    }
  }

  const renderLimitTip = () => {
    const { nospec, activityType, activityInfo } = info
    let limitNum = null
    let limitTxt = ''
    let max = null
    // 商品限购
    if (activityType) {
      if (activityType == 'limited_buy') {
        limitNum = activityInfo.rule.limit
        if (activityInfo.rule.day == 0) {
          limitTxt = `（限购${limitNum}件）`
        } else {
          limitTxt = `（每${activityInfo.rule.day}天，限购${limitNum}件）`
        }
      } else if (activityType == 'seckill' || activityType == 'limited_time_sale') {
        if (nospec) {
          limitNum = info.limitNum
        } else {
          if (curItem) {
            limitNum = curItem.limitNum
          }
        }
        limitTxt = `（限购${limitNum}件）`
      } else if (activityType == 'group') {
        limitNum = 1
      }
    }
    if (limitNum) {
      max = limitNum
    } else {
      max = curItem ? curItem.store : info.store
    }

    return (
      <View className='buy-count'>
        <View className='label'>
          购买数量 {limitNum && <Text className='limit-count'>{limitTxt}</Text>}
        </View>

        <SpInputNumber
          value={num}
          min={1}
          max={limitNum || max}
          onChange={(n) => {
            setState((draft) => {
              draft.num = n
            })
          }}
        />
      </View>
    )
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
          mode='aspectFit'
          onClick={handlePreviewImage}
        />
        <View className='info-bd'>
          {/* <View className='goods-sku-price'>
            <SpPrice value={curItem ? curItem.price : info.price}></SpPrice>
            <SpPrice value={curItem ? curItem.marketPrice : info.marketPrice} lineThrough></SpPrice>
          </View> */}
          <SpGoodsPrice
            info={{
              price: curItem ? curItem.price : info.price,
              marketPrice: curItem ? curItem.marketPrice : info.marketPrice,
              memberPrice: curItem ? curItem.memberPrice : info.memberPrice,
              activityPrice: curItem ? curItem.activityPrice : info.activityPrice
            }}
          />
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
        {!hideInputNumber && renderLimitTip()}
      </View>
    </SpFloatLayout>
  )
}

SpSkuSelect.options = {
  addGlobalClass: true
}

export default SpSkuSelect
