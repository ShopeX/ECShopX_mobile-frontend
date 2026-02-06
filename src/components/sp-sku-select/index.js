/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import { View, Text } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { SG_ROUTER_PARAMS } from '@/consts/localstorage'
import {
  SpFloatLayout,
  SpButton,
  SpImage,
  SpPrice,
  SpInputNumber,
  SpGoodsPrice,
  SpLogin
} from '@/components'
import {
  addCart,
  updateCount,
  updateSalesmanCount,
  updateShopCartCount,
  updateShopSalesmanCartCount
} from '@/store/slices/cart'
import { BUY_TOOL_BTNS } from '@/consts'
import api from '@/api'
import { useAsyncCallback } from '@/hooks'
import {
  classNames,
  showToast,
  entryLaunch,
  getDistributorId,
  VERSION_STANDARD,
  isWeb
} from '@/utils'
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
  loading: false,
  minNum: 1
}
const $instance = Taro.getCurrentInstance()

function SpSkuSelect(props) {
  const {
    info,
    open = false,
    onClose = () => {},
    onChange = () => {},
    type,
    hideInputNumber = false,
    salesman = false,
    onSubscribe = () => {}
  } = props
  // const [state, setState] = useImmer(initialState)
  const [state, setState] = useAsyncCallback(initialState)
  const { selection, disabledSet, curItem, skuText, num, loading, minNum } = state
  const { customerLnformation } = useSelector((state) => state.cart)
  const { shopInfo } = useSelector((state) => state.shop)
  const dispatch = useDispatch()
  const skuDictRef = useRef({})

  useEffect(() => {
    if (info && !info.nospec) {
      init()
    }
    // 防止列表页遗留其他商品信息
    if (info && info.nospec) {
      specItemed()
      setState((draft) => {
        draft.curItem = null
        draft.skuText = ''
      })
    }

    // return () => {
    //   setState((draft) => {
    //     draft.num = 1
    //   })
    // }
  }, [info])

  // useEffect(() => {
  //   if (!open) {
  //     setState((draft) => {
  //       draft.num = 1
  //     })
  //   }
  // }, [open])

  const init = () => {
    const { skuList, specItems } = info
    console.log('skuList:', skuList)
    console.log('specItems:', specItems)
    specItems.forEach((item) => {
      const key = item.specItem.map((spec) => spec.specId).join('_')
      skuDictRef.current[key] = item
    })
    // 默认选中有库存并且前端可销售的sku
    let defaultSpecItem = specItems.find(
      (item) => item.store > 0 && ['onsale'].includes(item.approveStatus)
    )
    // 如果都没有库存，默认选择第一个可销售的规格
    if (!defaultSpecItem) {
      defaultSpecItem = specItems.find((item) => ['onsale'].includes(item.approveStatus))
    }

    let selection = Array(skuList.length).fill(null)
    if (defaultSpecItem) {
      selection = defaultSpecItem.specItem.map((item) => item.specId)
    }

    calcDisabled(selection)
  }

  //起订量
  const specItemed = (val = []) => {
    if (info.startNum > 0) {
      //多规格
      if (info.specItems.length > 0 && val.length > 0) {
        //多规格动态获取起订量
        const newval = val.length == 1 ? val[0] : val.join('-')
        info.specItems.forEach((item) => {
          if (item.customSpecId == newval) {
            setState((draft) => {
              draft.minNum = item.startNum
              draft.num = item.startNum
            })
            return item.startNum
          }
        })
      } else {
        // 单规格
        setState((draft) => {
          draft.minNum = info.startNum
          draft.num = info.startNum
        })
      }
      //单规格
      return info.startNum
    } else {
      setState((draft) => {
        draft.minNum = 1
        draft.num = 1
      })
      return 1
    }
  }

  const calcDisabled = async (selection) => {
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
        return key.match(reg) && ['onsale'].includes(skuDictRef.current[key].approveStatus)
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

    await specItemed(selection) //处理起订量

    await onChange(skuText, curItem)
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
      const { specImgs } = curItem.specItem.find((item) => item.specImgs.length > 0) || {}
      if (specImgs && specImgs.length > 0) {
        img = specImgs[0]
      }
    }
    // console.log('img:', img)
    return img
  }

  const handlePreviewImage = () => {
    let imgUrls = info.imgs
    if (curItem) {
      const { specImgs } = curItem.specItem.find((item) => item.specImgs.length > 0) || {}
      if (specImgs && specImgs.length > 0) {
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
    Taro.showLoading({ title: '' })

    let params = {}

    // 加购
    const dtid = VERSION_STANDARD
      ? shopInfo?.distributor_id
      : Taro.getStorageSync(SG_ROUTER_PARAMS)?.distributor_id

    if (dtid && dtid !== 'undefined') {
      params = {
        shop_type: 'distributor',
        distributor_id: dtid,
        ...customerLnformation
      }
    } else if (salesman) {
      params = {
        shop_type: 'distributor',
        distributor_id: info.distributorId,
        ...customerLnformation
      }
    } else {
      params = {
        shop_type: 'distributor'
      }
    }
    await dispatch(
      addCart({
        item_id: curItem ? curItem.itemId : info.itemId,
        num,
        distributor_id: info.distributorId,
        ...params
      })
    )
    onClose()
    if (salesman) {
      await shoppings()
    } else {
      await shopping()
    }
    dispatch(updateSalesmanCount(params))
    Taro.hideLoading()
    // showToast('成功加入购物车')
  }

  const shopping = async () => {
    const { id, dtid } = await entryLaunch.getRouteParams()
    const distributor_id = getDistributorId(id || dtid)
    let params = {
      distributor_id,
      shop_type: 'distributor'
    }
    const { valid_cart } = await api.cart.get(params)
    let shopCats = {
      shop_id: valid_cart[0]?.shop_id || '', //下单
      cart_total_num: valid_cart[0]?.cart_total_num || '', //数量
      total_fee: valid_cart[0]?.total_fee || '', //实付金额
      discount_fee: valid_cart[0]?.discount_fee || '', //优惠金额
      storeDetails: valid_cart[0] || {}
    }
    dispatch(updateCount({ shop_type: 'distributor', shop_id: distributor_id }))
    dispatch(updateShopCartCount(shopCats))
  }

  const shoppings = async () => {
    const res = Taro.getStorageSync('distributorSalesman')
    console.log(res, 'distributorSalesman')

    let params = {
      distributor_id: res.distributor_id,
      shop_type: 'distributor',
      ...customerLnformation
    }
    const { valid_cart } = await api.cart.get(params)
    let shopCats = {
      shop_id: valid_cart[0]?.shop_id || '', //下单
      cart_total_num: valid_cart[0]?.cart_total_num || '', //数量
      total_fee: valid_cart[0]?.total_fee || '', //实付金额
      discount_fee: valid_cart[0]?.discount_fee || '', //优惠金额
      storeDetails: valid_cart[0] || {}
    }
    dispatch(updateShopSalesmanCartCount(shopCats))
  }

  const fastBuy = async () => {
    const { nospec } = info
    if (!nospec && !curItem) {
      showToast('请选择规格')
      return
    }
    Taro.showLoading({ title: '' })
    onClose()
    let activityType = ''
    const { distributorId, activityInfo } = info
    if (!info.nospec) {
      activityType = curItem.activity_type
    } else {
      activityType = info.activityType
    }

    const itemId = curItem ? curItem.itemId : info.itemId
    await api.cart.fastBuy(
      {
        item_id: curItem ? curItem.itemId : info.itemId,
        num,
        distributor_id: distributorId
      },
      !!info.point
    ) // info.point 有积分值时是积分商品
    let url = !!info.point
      ? '/subpages/pointshop/espier-checkout?cart_type=fastbuy&shop_id=0'
      : `/pages/cart/espier-checkout?cart_type=fastbuy&shop_id=${distributorId}`

    if (VERSION_STANDARD) {
      url += '&type=distributor'
    }

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
    console.log('navigateTo:url', url)
    url += '&_original=1'
    Taro.navigateTo({
      url
    })
  }

  const handleSubscribe = async () => {
    const { dtid } = $instance.router.params
    // console.log('onSubscribe:subscribe', subscribe)

    if (isWeb) {
      showToast('请在小程序完成商品到货通知')
      return
    }

    await api.user.subscribeGoods(curItem ? curItem.itemId : info.itemId, {
      distributor_id: dtid
    })
    const { template_id } = await api.user.newWxaMsgTmpl({
      temp_name: 'yykweishop',
      source_type: 'goods'
    })
    Taro.requestSubscribeMessage({
      tmplIds: template_id,
      success: () => {
        showToast('订阅成功')
        onSubscribe()
      },
      fail: () => {
        onSubscribe()
      }
    })
  }

  const renderFooter = () => {
    console.log('curItem111:', curItem)
    let btnTxt = ''
    Object.keys(BUY_TOOL_BTNS()).forEach((key) => {
      if (BUY_TOOL_BTNS()[key].key == type) {
        btnTxt = BUY_TOOL_BTNS()[key].title
      }
    })
    const isNoStore = info.nospec ? info.store <= 0 : curItem?.store <= 0
    if (isNoStore) {
      return (
        <AtButton circle type='primary' onClick={handleSubscribe}>
          {BUY_TOOL_BTNS().NOTICE.title}
        </AtButton>
      )
    } else if (type == 'picker') {
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
    const { nospec, activityType, activityInfo, purlimitByCart, purlimitByFastbuy } = info
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

    // 内购加购限制 + 内购立即购买限制
    if (type == 'addcart' && purlimitByCart) {
      limitNum = purlimitByCart
      limitTxt = `（限购${purlimitByCart}件）`
    }

    if (type == 'fastbuy' && purlimitByFastbuy) {
      limitNum = purlimitByFastbuy
      limitTxt = `（限购${purlimitByFastbuy}件）`
    }

    if (limitNum) {
      max = parseInt(limitNum)
    } else {
      max = parseInt(curItem ? curItem.store : info.store)
    }

    console.log('curItem:', curItem)

    return (
      <View className='buy-count'>
        <View className='label'>
          购买数量 {limitNum && <Text className='limit-count'>{limitTxt}</Text>}
          {info.startNum > 0 && <Text className='limit-count'>(起订量{minNum}件)</Text>}
        </View>

        <SpInputNumber
          disabled={curItem?.store <= 0}
          value={num}
          min={minNum}
          max={max}
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
          <SpGoodsPrice info={curItem || info} />
          <View className='goods-sku-txt'>{skuText}</View>
          {info.store_setting && (
            <View className='goods-sku-store'>库存：{curItem ? curItem.store : info.store}</View>
          )}
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
                    <SpImage src={spec.specImgs[0]} width={260} height={260} mode='aspectFit' />
                  )}
                  <View className='spec-name'>{spec.specName}</View>
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
