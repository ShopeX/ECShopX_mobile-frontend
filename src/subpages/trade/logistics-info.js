import React, { useEffect } from "react";
import { useSelector } from "react-redux"
import { useImmer } from "use-immer"
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { AtButton, AtInput } from 'taro-ui'
import api from "@/api"
import doc from "@/doc"
import { View, Picker } from "@tarojs/components"
import { LOGISTICS_CODE } from '@/consts'
import { SpPage, SpCell } from '@/components'
import { showToast } from '@/utils'
import "./logistics-info.scss";

const initialState = {
  corp_code: '',
  logi_no: '',
  corpIndex: 0,
  expressList: []
}
function TradeLogisticsInfo(props) {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const { corp_code, logi_no, expressList, corpIndex } = state

  useEffect(() => {
    const expressList = Object.keys(LOGISTICS_CODE).map(key => {
      return {
        name: LOGISTICS_CODE[key],
        code: key
      }
    })
    setState(draft => {
      draft.expressList = expressList
    })
  }, [])

  const onSubmit = async () => {
    const { item_id, order_id, aftersales_bn } = $instance.router.params
    if (!corp_code) {
      showToast('请填写物流公司')
      return
    }
    if (!logi_no) {
      showToast('请填写物流单号')
      return
    }
    await api.aftersales.sendback({
      item_id,
      order_id,
      aftersales_bn,
      logi_no,
      corp_code
    })
    showToast('操作成功')
    // setTimeout(() => {
    //   Taro.redirectTo({
    //     url: '/subpage/pages/trade/after-sale'
    //   })
    // }, 1000)
  }

  const onChangeExpress = (e) => {
    const { value } = e.detail
    setState(draft => {
      draft.corpIndex = value
    })
  }

  const getLogisticName = () => {
    const { name } = expressList[corpIndex] || {}
    return name
  }

  return <SpPage className='page-trade-logistics-info' renderFooter={<View className='btn-wrap'>
    <AtButton circle type='primary' onClick={onSubmit}>提交</AtButton>
  </View>}>
    <SpCell className='logistics-company' title='物流公司' isLink value={
      <Picker
        mode='selector'
        range={expressList}
        rangeKey='name'
        onChange={onChangeExpress}
      >
        <View className='picker-value'>{getLogisticName()}</View>
      </Picker>}></SpCell>

    <SpCell className='logistics-no' title='物流单号' value={
      <AtInput
        name='logi_no'
        value={logi_no}
        placeholder='请填写物流单号'
        onChange={(e) => {
          setState(draft => {
            draft.logi_no = e
          })
        }}
      />
    }></SpCell>
  </SpPage>;
}

TradeLogisticsInfo.options = {
  addGlobalClass: true
}

export default TradeLogisticsInfo
