/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpPage, SpScrollView, SpImage } from '@/components'
import api from '@/api'
import { classNames, pickBy, thousandthFormat } from '@/utils'
import doc from '@/subpages/doc'
import './point-detail.scss'

const btns = [
  { title: '全部', key: 0 },
  { title: '获取', key: 1 },
  { title: '支出', key: 2 }
]

const initialState = {
  list: [],
  point: 0,
  active: 0
}
function PointDetail(props) {
  const [state, setState] = useImmer(initialState)
  const { pointName } = useSelector((state) => state.sys)
  const { list, point, active } = state
  const pointRef = useRef()

  useEffect(() => {
    getMemberPointInfo()
  }, [])

  useEffect(() => {
    getPointList()
  }, [active])

  const getPointList = async () => {
    await setState((draft) => {
      draft.list = []
    })
    pointRef.current.reset()
  }

  const getMemberPointInfo = async () => {
    const { point } = await api.pointitem.getMypoint()
    setState((draft) => {
      draft.point = thousandthFormat(point)
    })
  }

  const fetch = async ({ pageIndex, pageSize }) => {
    let query = {
      page_no: pageIndex,
      page_size: pageSize
    }
    if (active == 1 || active == 2) {
      query = {
        ...query,
        outin_type: active == 1 ? 'income' : 'outcome'
      }
    }
    const { list: _list, total_count: total } = await api.pointitem.getMemberPointList(query)
    setState((draft) => {
      draft.list = [...list, ...pickBy(_list, doc.point.POINT_LIST_ITEM)]
    })
    return { total }
  }

  const handleClickPointType = ({ key }) => {
    setState((draft) => {
      draft.active = key
    })
  }

  return (
    <SpPage className='page-point-detail' scrollToTopBtn>
      <View className='point-detail-hd'>
        <View className='point-info'>
          <View className='point-info-hd'>
            <View className='point-table'>
              <SpImage src='point.png' width={48} height={48} />
              <Text className='label'>{`可用${pointName}`}</Text>
            </View>
            <View
              className='point-rule'
              onClick={() => {
                Taro.navigateTo({ url: '/subpages/member/point-rule' })
              }}
            >{`${pointName}规则`}</View>
          </View>
          <View className='point-total'>{point}</View>
        </View>
      </View>
      <View className='point-list'>
        <View className='title'>{`${pointName}收支明细`}</View>
        <View className='point-list-body'>
          <View className='point-type'>
            {btns.map((item, index) => (
              <View
                className={classNames('btn-pointtype', { active: item.key == active })}
                onClick={handleClickPointType.bind(this, item)}
                key={`point-type__${index}`}
              >
                {item.title}
              </View>
            ))}
          </View>
          <SpScrollView className='point-item-wrap' auto={false} ref={pointRef} fetch={fetch}>
            {list.map((item, index) => (
              <View className='point-item' key={`point-item__${index}`}>
                <View className='point-item-hd'>
                  {item?.point_desc && <View className='order-desc'>{item.point_desc}</View>}
                  {item.journalType && <View className='name'>{item.journalType}</View>}
                  <View className='created'>{item.created}</View>
                  {item.orderId && <View className='order-no'>{`订单编号: ${item.orderId}`}</View>}
                </View>
                <View className={classNames('point-value', item.outinType)}>{`${
                  item.outinType == 'in' ? '+' : '-'
                }${item.point}`}</View>
              </View>
            ))}
          </SpScrollView>
        </View>
      </View>
    </SpPage>
  )
}

PointDetail.options = {
  addGlobalClass: true
}

export default PointDetail
