import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { useRouter } from '@tarojs/taro'
import { View, ScrollView, Button } from '@tarojs/components'
import { SpPage, SpScrollView, SpTagBar, SpSearchBar, SpSelectModal } from '@/components'
import api from '@/api'
import doc from '@/doc'
import { pickBy } from '@/utils'
import CompActivityItem from './comps/comp-activity-item'
import './activity-list.scss'

const initialState = {
  tradeStatus: [
    { tag_name: '当前活动', value: '0' },
    { tag_name: '精彩回顾', value: '1' }
  ],
  status: '0',
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
  keyword:''
}
function ItemActivity(props) {
  const [state, setState] = useImmer(initialState)
  const {
    tradeStatus,
    status,
    recordList,
    trackDetailList,
    openTrackDetail,
    info,
    isOpened,
    selectOptions,
    activityInfo,
    keyword
  } = state
  const recordRef = useRef()
  const router = useRouter()

  useEffect(() => {
    Taro.eventCenter.on('onEventRecordStatusChange', () => {
      setState((draft) => {
        draft.recordList = []
      })

      recordRef.current.reset()
    })

    return () => {
      Taro.eventCenter.off('onEventRecordStatusChange')
    }
  }, [])

  useEffect(() => {
    setState((draft) => {
      draft.recordList = []
    })
    recordRef.current.reset()
  }, [status,keyword])

  const fetch = async ({ pageIndex, pageSize }) => {
    const params = {
      page: pageIndex,
      pageSize,
      order_type: 'normal',
      status,
      keyword
    }
    const { list, total_count: total } = await api.user.registrationRecordList(params)
    const nList = pickBy(list, {
      activityId: 'activity_id',
      recordId: 'record_id',
      activityName: 'activity_name',
      status: 'status',
      startDate: 'start_date',
      createDate: 'create_date',
      endDate: 'end_date',
      reason: 'reason',
      statusName: ({ activity_info }) => activity_info?.status_name,
      pics: ({ activity_info }) => activity_info?.pics,
      area: 'area',
      actionCancel: ({ action }) => action?.cancel == 1,
      actionEdit: ({ action }) => action?.edit == 1,
      actionApply: ({ action }) => action?.apply == 1,
      activityStatus: ({ activity_info }) => activity_info?.status_name,
      activityStartTime: ({ activity_info }) => activity_info?.start_time
    })
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

  const onBtnAction = (item, type) => {
    const { activityId } = item
    switch (type) {
      case 'reFill':
        //重新填写
        Taro.navigateTo({
          url: `/marketing/pages/reservation/goods-reservate?activity_id=${activityId}`
        })
        break
      case 'sign':
        //立即报名
        setState((draft) => {
          draft.isOpened = true
          draft.activityInfo = item
        })
        break
      default:
        break
    }
  }

  const handleSelectClose = () => {
    setState((draft) => {
      draft.isOpened = false
    })
  }

  const handleSlectConfirm = (value) => {
    const { activityId, recordId } = activityInfo
    let url = `/marketing/pages/reservation/goods-reservate?activity_id=${activityId}`
    if (value == '0') {
      // 编辑
      url += `&record_id=${recordId}`
    }
    Taro.navigateTo({
      url
    })
    handleSelectClose()
  }

  const handleOnClear = async () => {
    await setState((draft) => {
      draft.keyword = ''
    })
  }

  const handleConfirm = async (val) => {
    await setState((draft) => {
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
              <CompActivityItem isActivity info={item} onClick={handleItemClick} onBtnAction={onBtnAction} />
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

ItemActivity.options = {
  addGlobalClass: true
}

export default ItemActivity
