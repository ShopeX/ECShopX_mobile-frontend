/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import api from '@/api'
import S from '@/spx'
import { View, Picker, Text } from '@tarojs/components'
import { LOGISTICS_CODE } from '@/consts'
import { SpPage, SpCell, SpInput as AtInput, SpToast } from '@/components'
import { showToast, copyText } from '@/utils'
import './logistics-info.scss'

const initialState = {
  logi_no: '',
  corpIndex: 0,
  expressList: [],
  afterInfo: null
}
function TradeLogisticsInfo(props) {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const { logi_no, expressList, corpIndex, afterInfo } = state
  const { item_id, order_id, aftersales_bn, type = 'single' } = $instance.router.params

  useEffect(() => {
    const aftersInfo = Taro.getStorageSync('moreAftersalesBn') || null
    const _expressList = Object.keys(LOGISTICS_CODE()).map((key) => {
      return {
        name: LOGISTICS_CODE()[key],
        code: key
      }
    })
    setState((draft) => {
      draft.expressList = _expressList
      draft.afterInfo = aftersInfo
    })
    return () => {
      Taro.removeStorageSync('moreAftersalesBn')
    }
  }, [])

  const onSubmit = async () => {
    const aftersInfo = Taro.getStorageSync('moreAftersalesBn') || null
    const corp_code = expressList[corpIndex]?.code
    if (!corp_code) {
      showToast('请填写物流公司')
      return
    }
    if (!logi_no) {
      showToast('请填写物流单号')
      return
    }
    try {
      await api.aftersales.sendback({
        item_id,
        order_id,
        aftersales_bn: aftersales_bn,
        logi_no,
        corp_code,
        showError: false,
        aftersales_data: aftersInfo?.aftersalesBn
      })
      showToast('操作成功')
      setTimeout(() => {
        Taro.navigateBack({
          delta: 2
        })
      }, 1000)
    } catch (error) {
      console.log(error)
      S.toast(error.message)
    }
  }

  const onChangeExpress = (e) => {
    const { value } = e.detail
    setState((draft) => {
      draft.corpIndex = value
    })
  }

  const getLogisticName = () => {
    const { name } = expressList[corpIndex] || {}
    return name
  }

  return (
    <SpPage
      className='page-trade-logistics-info'
      renderFooter={
        <View className='btn-wrap'>
          <AtButton circle type='primary' onClick={onSubmit}>
            提交
          </AtButton>
        </View>
      }
    >
      {type == 'more' && (
        <View className='after-address'>
          <SpCell title='回寄信息:'>
            <>
              <View className='contact-mobile'>
                <Text className='contact'>{afterInfo?.address?.aftersales_contact}</Text>
                <Text className='mobile'>{afterInfo?.address?.aftersales_mobile}</Text>
              </View>
              <View
                className='btn-copy'
                circle
                size='small'
                onClick={() => {
                  copyText(
                    `${afterInfo?.address?.aftersales_contact} ${afterInfo?.address?.aftersales_mobile}\n${afterInfo?.address?.aftersales_address}`
                  )
                }}
              >
                复制
              </View>
            </>
          </SpCell>
          <View className='address-detail'>{afterInfo?.address?.aftersales_address}</View>
        </View>
      )}
      <SpCell
        className='logistics-company'
        title='物流公司'
        isLink
        value={
          <Picker mode='selector' range={expressList} rangeKey='name' onChange={onChangeExpress}>
            <View className='picker-value'>{getLogisticName()}</View>
          </Picker>
        }
      ></SpCell>

      <SpCell
        className='logistics-no'
        title='物流单号'
        value={
          <AtInput
            name='logi_no'
            value={logi_no}
            placeholder='请填写物流单号'
            onChange={(e) => {
              setState((draft) => {
                draft.logi_no = e
              })
            }}
          />
        }
      ></SpCell>
      <SpToast />
    </SpPage>
  )
}

TradeLogisticsInfo.options = {
  addGlobalClass: true
}

export default TradeLogisticsInfo
