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
import { useTranslation, $t } from '@/i18n'
import { useNavigation } from '@/hooks'
import './logistics-info.scss'

const initialState = {
  logi_no: '',
  corpIndex: 0,
  expressList: [],
  afterInfo: null
}
function TradeLogisticsInfo(props) {
  const { i18n } = useTranslation()
  const { setNavigationBarTitle } = useNavigation()
  const $instance = getCurrentInstance() || {}
  const [state, setState] = useImmer(initialState)
  const { logi_no, expressList, corpIndex, afterInfo } = state
  const { item_id, order_id, aftersales_bn, type = 'single' } = $instance?.router?.params

  useEffect(() => {
    const syncTitle = () => setNavigationBarTitle($t('a9f390ef.f33f84'))
    syncTitle()
    i18n.on('languageChanged', syncTitle)
    return () => i18n.off('languageChanged', syncTitle)
  }, [setNavigationBarTitle, i18n])

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
      showToast($t('3d2b7bcd.08faf4'))
      return
    }
    if (!logi_no) {
      showToast($t('3d2b7bcd.6a74f5'))
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
      showToast($t('3d2b7bcd.33130f'))
      setTimeout(() => {
        Taro.navigateBack({
          delta: 2
        })
      }, 1000)
    } catch (error) {
      console.log(error)
      S?.toast(error.message)
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
            {$t('3d2b7bcd.939d53')}
          </AtButton>
        </View>
      }
    >
      {type == 'more' && (
        <View className='after-address'>
          <SpCell title={$t('3d2b7bcd.35b68f')}>
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
                {$t('3d2b7bcd.79d3ab')}
              </View>
            </>
          </SpCell>
          <View className='address-detail'>{afterInfo?.address?.aftersales_address}</View>
        </View>
      )}
      <SpCell
        className='logistics-company'
        title={$t('3d2b7bcd.eb6d92')}
        isLink
        value={
          <Picker mode='selector' range={expressList} rangeKey='name' onChange={onChangeExpress}>
            <View className='picker-value'>{getLogisticName()}</View>
          </Picker>
        }
      ></SpCell>

      <SpCell
        className='logistics-no'
        title={$t('3d2b7bcd.0bb075')}
        value={
          <AtInput
            name='logi_no'
            value={logi_no}
            placeholder={$t('3d2b7bcd.6a74f5')}
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
