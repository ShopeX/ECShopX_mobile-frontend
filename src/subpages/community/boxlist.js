import React, { useEffect, useRef } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { Image, View, Picker } from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'

import { SpTab, SpScrollView, SpPage, SpCell, SpImage } from '@/components'
import { pickBy, showToast } from '@/utils'
import { usePage, useDepChange, useAsyncEffect } from '@/hooks'
import doc from '@/doc'
import api from '@/api'

import './boxlist.scss'

// const TAB_LIST = [
//   { value: 'notship', label: '待发货' },
//   { value: 'shipping', label: '已发货' }
// ]

const initState = {
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  list: [],
  itemBoxNum: 0,
  itemPieceNum: 0,
  //tab切换
  activeIndex: 0
}

const BoxList = () => {
  const [state, setState] = useImmer(initState)
  const { startDate, startTime, endDate, endTime, activeIndex, list, itemBoxNum, itemPieceNum } =
    state
  const goodsRef = useRef()

  // useEffect(() => {
  //   if (startDate && startTime && endDate && endTime) {
  //     goodsRef.current.reset()
  //   }
  // }, [startDate, startTime, endDate, endTime])

  const fetch = async ({ pageIndex, pageSize }) => {
    // let params = {
    //   order_status: TAB_LIST[activeIndex].value // 未发货; shipping已发货
    // }
    // if (startDate && startTime && endDate && endTime) {
    //   params['start_time'] = `${startDate} ${startTime}`
    //   params['end_time'] = `${endDate} ${endTime}`
    // }

    const { list, total, item_box_num, item_piece_num } = await api.community.activityOrderItem()
    setState((draft) => {
      draft.list = pickBy(list, doc.community.GOOD_LIST)
      draft.itemBoxNum = item_box_num
      draft.itemPieceNum = item_piece_num
    })

    return { total }
  }

  // const handleChangeTab = async (active) => {
  //   await setState((draft) => {
  //     draft.activeIndex = active
  //   })
  //   goodsRef.current.reset()
  // }

  return (
    <SpPage
      className='page-good-boxlist'
      renderFooter={<View className='box-num'>{`总箱数：${itemBoxNum}箱`}</View>}
    >
      {/* <View className='tab-container'>
        <SpTab dataSource={TAB_LIST} onChange={handleChangeTab} />
      </View> */}
      {/* <SpCell border title='开始日期'>
        <View className='date-time-item'>
          <Picker
            className='date-picker'
            mode='date'
            onChange={(e) => {
              setState((draft) => {
                draft.startDate = e.detail.value
              })
            }}
          >
            <View className='picker-value'>{startDate || '选择日期'}</View>
          </Picker>
          <Picker
            className='time-picker'
            mode='time'
            onChange={(e) => {
              setState((draft) => {
                draft.startTime = e.detail.value
              })
            }}
          >
            <View className='picker-value'>{startTime || '选择时间'}</View>
          </Picker>
        </View>
      </SpCell> */}
      {/* <SpCell title='结束日期'>
        <View className='date-time-item'>
          <Picker
            className='date-picker'
            mode='date'
            onChange={(e) => {
              setState((draft) => {
                draft.endDate = e.detail.value
              })
            }}
          >
            <View className='picker-value'>{endDate || '选择日期'}</View>
          </Picker>
          <Picker
            className='time-picker'
            mode='time'
            onChange={(e) => {
              setState((draft) => {
                draft.endTime = e.detail.value
              })
            }}
          >
            <View className='picker-value'>{endTime || '选择时间'}</View>
          </Picker>
        </View>
      </SpCell> */}

      <SpScrollView className='boxlist-scroll' ref={goodsRef} fetch={fetch}>
        <View className='boxlist-list'>
          {list.map((item, index) => (
            <View className='goods-item' key={`goods-item-wrap__${index}`}>
              <View className='item-hd'>
                <SpImage src={item.pic} lazyLoad={false} />
              </View>
              <View className='item-bd'>
                <View className='item-info'>
                  <View className='item-name'>{item.name}</View>
                  <View className='item-sku'>{`${item.unitScale}件成箱`}</View>
                </View>
                <View className='item-no-num'>
                  <View className='item-no'>{item.itemBn}</View>
                  <View className='item-num'>{`${item.itemBoxNum}箱${item.itemPieceNum}件`}</View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </SpScrollView>
    </SpPage>
  )
}

export default BoxList
