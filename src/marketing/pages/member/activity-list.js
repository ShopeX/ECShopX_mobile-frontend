/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import { View, ScrollView, Button } from '@tarojs/components'
import { SpPage, SpScrollView, SpTagBar, SpSearchBar, SpSelectModal } from '@/components'
import api from '@/api'
import doc from '@/doc'
import { pickBy } from '@/utils'
import CompActivityItem from './comps/comp-activity-item'
import './activity-list.scss'

const initialState = {
  tradeStatus: [
    { tag_name: '当前活动', value: '1' },
    { tag_name: '精彩回顾', value: '2' }
  ],
  status: '1',
  recordList: [],
  trackDetailList: [],
  openTrackDetail: false,
  info: null,
  isOpened: false,
  selectOptions: [
    { label: '编辑报名信息', value: '0' },
    { label: '代他人报名', value: '1' }
  ],
  activityInfo: {},
  keyword: ''
}
function ActivityIist(props) {
  const [state, setState] = useImmer(initialState)
  const { tradeStatus, status, recordList, isOpened, selectOptions, activityInfo, keyword } = state
  const recordRef = useRef()
  const router = useRouter()

  useDidShow(() => {
    setState((draft) => {
      draft.recordList = []
    })

    recordRef.current.reset()
  })

  useEffect(() => {
    setState((draft) => {
      draft.recordList = []
    })
    recordRef.current.reset()
  }, [status, keyword])

  const fetch = async ({ pageIndex, pageSize }) => {
    const params = {
      page: pageIndex,
      pageSize,
      order_type: 'normal',
      status,
      activity_name: keyword
    }

    const { list, total_count: total } = await api.user.registrationActivityList(params)
    const nList = pickBy(list, doc.activity.ACTIVITY_LIST)
    setState((draft) => {
      draft.recordList = [...recordList, ...nList]
    })
    return { total }
  }

  const onChangeTradeState = (e) => {
    setState((draft) => {
      draft.status = tradeStatus[e].value
    })
  }

  const handleItemClick = ({ activityId }) => {
    Taro.navigateTo({
      url: `/marketing/pages/member/activity-info?activity_id=${activityId}`
    })
  }

  const registrationSubmitFetch = async ({ activityId }) => {
    await api.user.joinActivity({ activity_id: activityId })
    Taro.showToast({
      icon: 'none',
      title: '报名成功'
    })
    setTimeout(() => {
      Taro.navigateTo({
        url: `/marketing/pages/reservation/goods-reservate-result?activity_id=${activityId}`
      })
    }, 400)
  }

  const onBtnAction = (item, type) => {
    const { recordId, hasTemp, recordStatus } = item
    if (!recordId) {
      //新用户
      if (hasTemp) {
        //有模板：去表单页面
        handleToGoodsReservate(false, item)
      } else {
        //没模板：直接报名
        registrationSubmitFetch(item)
      }
    } else {
      //老用户
      if (hasTemp) {
        if (['pending', 'rejected'].includes(recordStatus)) {
          //立即报名
          setState((draft) => {
            draft.isOpened = true
            draft.activityInfo = item
          })
        } else {
          // 不能编辑
          handleToGoodsReservate(false, item)
        }
      } else {
        //没模板：直接报名
        registrationSubmitFetch(item)
      }
    }
  }

  const handleSelectClose = () => {
    setState((draft) => {
      draft.isOpened = false
    })
  }

  const handleSlectConfirm = (value) => {
    const isEdit = value == '0'
    handleToGoodsReservate(isEdit, activityInfo)
    handleSelectClose()
  }

  const handleToGoodsReservate = (isEdit = false, item) => {
    const { activityId, recordId } = item
    let url = `/marketing/pages/reservation/goods-reservate?activity_id=${activityId}`
    if (isEdit) {
      // 编辑
      url += `&record_id=${recordId}`
    }
    Taro.navigateTo({
      url
    })
  }

  const handleOnClear = () => {
    setState((draft) => {
      draft.keyword = ''
    })
  }

  const handleConfirm = (val) => {
    setState((draft) => {
      draft.keyword = val
    })
  }

  return (
    <SpPage scrollToTopBtn className='page-activity-list'>
      <SpSearchBar
        keyword={keyword}
        placeholder='搜索活动'
        showDailog={false}
        onFocus={() => {}}
        onChange={() => {}}
        onClear={handleOnClear}
        onCancel={handleOnClear}
        onConfirm={handleConfirm}
      />
      <SpTagBar list={tradeStatus} value={status} onChange={onChangeTradeState} />
      <ScrollView className='list-scroll-container' scrollY>
        <SpScrollView
          className='trade-list-scroll'
          auto={false}
          ref={recordRef}
          fetch={fetch}
          emptyMsg='没有查询到订单'
        >
          {recordList.map((item, index) => (
            <View className='trade-item-wrap' key={index}>
              <CompActivityItem
                isActivity
                info={item}
                onClick={handleItemClick}
                onBtnAction={onBtnAction}
              />
            </View>
          ))}
        </SpScrollView>
      </ScrollView>

      <SpSelectModal
        isOpened={isOpened}
        options={selectOptions}
        onClose={handleSelectClose}
        onConfirm={handleSlectConfirm}
      />
    </SpPage>
  )
}

ActivityIist.options = {
  addGlobalClass: true
}

export default ActivityIist
