// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Textarea } from '@tarojs/components'
import { SpPage, SpButton, SpImage, SpUpload } from '@/components'
import { AtRate, AtTextarea } from 'taro-ui'
import { useImmer } from 'use-immer'
import api from '@/api'
import doc from '@/doc'
import { pickBy, showToast } from '@/utils'
import './trade-evaluate.scss'

const initialState = {
  info: null,
  formList: []
}
function TradeEvaluate(props) {
  const router = useRouter()
  const [state, setState] = useImmer(initialState)
  const { info, formList } = state

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    const { order_id } = router.params
    const { orderInfo } = await api.trade.detail(order_id)
    const _orderInfo = pickBy(orderInfo, doc.trade.TRADE_ITEM)
    setState((draft) => {
      draft.info = _orderInfo
      draft.formList = _orderInfo.items.map((item) => {
        return {
          item_id: item.itemId,
          content: '',
          star: 0,
          pics: []
        }
      })
    })
  }

  const onChangeRate = (e, index) => {
    setState((draft) => {
      draft.formList[index].star = e
    })
  }

  const onChangeContent = (e, index) => {
    // console.log("🚀🚀🚀 ~ file: trade-evaluate.js:51 ~ onChangeContent ~ e:", e, index)
    setState((draft) => {
      draft.formList[index].content = e
    })
  }

  const onRateSubmit = async (anonymous) => {
    const { order_id } = router.params
    if (formList.find((item) => item.star === 0)) {
      showToast('请打分')
      return
    }

    if (formList.find((item) => item.content === '')) {
      showToast('请填写评价')
      return
    }
    const params = {
      order_id: order_id,
      anonymous,
      rates: formList
    }
    await api.trade.createOrderRate(params)
    Taro.eventCenter.trigger('onEventOrderStatusChange')
    Taro.redirectTo({
      url: '/subpages/trade/evaluate-success'
    })
  }

  return (
    <SpPage
      className='page-trade-evaluate'
      renderFooter={
        <View className='btn-wraps'>
          <SpButton
            resetText='匿名评价'
            confirmText='发表评价'
            onConfirm={() => onRateSubmit(false)}
            onReset={() => onRateSubmit(true)}
          />
        </View>
      }
    >
      {info &&
        info.items.map((goods, index) => (
          <View className='goods-item-wrap' key={index}>
            <View className='goods-info'>
              <SpImage src={goods.pic} width={130} circle={16} />
              <View className='goods-name'>{goods.itemName}</View>
            </View>
            <View className='goods-rate'>
              <View className='label'>商品评价</View>
              <AtRate
                size='18'
                margin='20'
                value={formList[index].star}
                onChange={(e) => {
                  onChangeRate(e, index)
                }}
              />
            </View>
            <View className='goods-textarea'>
              <AtTextarea
                type='textarea'
                placeholder='快分享您的使用心得吧...'
                value={formList[index].content}
                count={false}
                onChange={(e) => {
                  onChangeContent(e, index)
                }}
              />
            </View>
            <View className='goods-rate-images'>
              <SpUpload
                value={formList[index].pics}
                max={3}
                placeholder='添加图片'
                onChange={(val) => {
                  setState((draft) => {
                    draft.formList[index].pics = val
                  })
                }}
              />
            </View>
          </View>
        ))}
    </SpPage>
  )
}

TradeEvaluate.options = {
  addGlobalClass: true
}

TradeEvaluate.defaultProps = {}

export default TradeEvaluate
