import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import { View, ScrollView, Button } from '@tarojs/components'
import { SpPage, SpScrollView, SpTagBar, SpSearchBar, SpSelectModal } from '@/components'
import api from '@/api'
import doc from '@/doc'
import { pickBy } from '@/utils'
import CompActivityItem from './comps/comp-activity-item'
import S from '@/spx'
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
    const nList = pickBy(list, {
      activityId: 'activity_id',
      recordId: 'record_id',
      activityName: 'activity_name',
      status: 'status',
      intro: 'intro',
      activityStartTime: 'start_date',
      createDate: 'create_date',
      endDate: 'end_date',
      reason: 'reason',
      areaName: 'area_name',
      activityStatus: 'status_name',
      pics: ({ pics }) => pics?.split(','),
      hasTemp: ({ temp_id }) => temp_id != '0',
      area: 'area',
      showPlace: ({ show_fields }) => JSON.parse(show_fields)?.place == 1,
      showAddress: ({ show_fields }) => JSON.parse(show_fields)?.address == 1,
      showCity: ({ show_fields }) => JSON.parse(show_fields)?.city == 1,
      joinLimit: 'join_limit',
      totalJoinNum: 'total_join_num',
      isAllowDuplicate: ({ is_allow_duplicate }) => is_allow_duplicate == 1,
      recordId: ({ record_info }) => record_info?.[0]?.record_id,
      recordStatus: ({ record_info }) => record_info?.[0]?.status
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

  const registrationSubmitFetch = async ({ activityId }) => {
    await api.user.joinActivity({ activity_id: activityId})
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

ItemActivity.options = {
  addGlobalClass: true
}

export default ItemActivity
