import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import doc from '@/doc'
import { SpScrollView, SpNote, SpPage } from '@/components'
import api from '@/api'
import { pickBy } from '@/utils'

import './limit-list.scss'

const initialState = {
  listData: []
}

function LimitList(props) {
  const [state, setState] = useImmer(initialState)
  const { persist_purchase_share_info: purchase_share_info = {} } = useSelector(
    (state) => state.purchase
  )

  const { listData } = state

  const fetch = async ({ pageIndex, pageSize }) => {
    const { list, total_count } = await api.purchase.getEmployeeActivityList({
      page: pageIndex,
      pageSize,
      need_aggregate: '1',
      enterprise_id: purchase_share_info?.enterprise_id
    })

    const _list = pickBy(list, doc.purchase.ACTIVITY_LIMIT_ITEM)
    setState((draft) => {
      draft.listData = [...listData, ..._list]
    })

    return { total: total_count }
  }

  const limitNode = (
    { limitFee, aggregateFee, leftFee, employeeBeginTime, employeeEndTime, name },
    idx
  ) => {
    return (
      <View key={idx} className='list-item'>
        <View className='list-item__title'>{name}</View>
        <View className='list-item__time'> {`${employeeBeginTime} - ${employeeEndTime}`}</View>
        <View className='list-item__content'>
          <View className='list-item__content-item'>
            <View className='list-item__content-item-key'>总额度</View>
            <View className='list-item__content-item-val'>{limitFee}</View>
          </View>
          <View className='list-item__content-item'>
            <View className='list-item__content-item-key'>已使用额度</View>
            <View className='list-item__content-item-val'>{aggregateFee}</View>
          </View>
          <View className='list-item__content-item'>
            <View className='list-item__content-item-key'>剩余额度</View>
            <View className='list-item__content-item-val'>{leftFee}</View>
          </View>
        </View>
      </View>
    )
  }

  return (
    <SpPage className='page-limit-list' scrollToTopBtn>
      {listData.length > 0 && <View className='limit-list__hd'></View>}
      <SpScrollView
        auto='true'
        fetch={fetch}
        renderEmpty={<SpNote img='empty_activity.png' title='没有查询到数据' />}
      >
        <View className='scroll-view-container'>
          {listData.map((item, idx) => limitNode(item, idx))}
        </View>
      </SpScrollView>
    </SpPage>
  )
}

export default LimitList
