import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import { View, ScrollView, Button } from '@tarojs/components'
import { SpPage, SpScrollView, SpTagBar, SpImage, SpSelectModal } from '@/components'
import api from '@/api'
import doc from '@/doc'
import { pickBy } from '@/utils'
import CompActivityItem from './comps/comp-activity-item'
import './item-activity.scss'

const initialState = {
  tradeStatus: [
    { tag_name: '全部', value: '' },
    { tag_name: '待审核', value: 'pending' },
    { tag_name: '已报名', value: 'passed' },
    { tag_name: '已拒绝', value: 'rejected' },
    { tag_name: '已取消', value: 'canceled' },
    { tag_name: '已核销', value: 'verified' }
  ],
  status: '',
  recordList: [],
  info: null,
  isOpened: false,
  selectOptions: [
    { label: '编辑报名信息', value: '0' },
    { label: '代他人报名', value: '1' }
  ],
  activityInfo: {},
  hasReFreash:false
}
function ItemActivity(props) {
  const [state, setState] = useImmer(initialState)
  const {
    tradeStatus,
    status,
    recordList,
    isOpened,
    selectOptions,
    activityInfo,
    hasReFreash
  } = state
  const recordRef = useRef()
  const router = useRouter()

  useEffect(() => {
    Taro.eventCenter.on('onEventRecordStatusChange', () => {
      setState((draft) => {
        draft.recordList = []
        draft.hasReFreash = true
      });

      recordRef.current.reset()
    })

    return () => {
      Taro.eventCenter.off('onEventRecordStatusChange')
    }
  }, [])

  useDidShow(()=>{
    if(hasReFreash){
      setState((draft) => {
        draft.recordList = []
        draft.hasReFreash = false
      });
      recordRef.current.reset()
    }
  })

  useEffect(() => {
    setState((draft) => {
      draft.recordList = []
    })
    recordRef.current.reset()
  }, [status])

  const fetch = async ({ pageIndex, pageSize }) => {
    const params = {
      page: pageIndex,
      pageSize,
      order_type: 'normal',
      status
    }
    const { list, total_count: total } = await api.user.registrationRecordList(params)
    const nList = pickBy(list,doc.activity.RECORD_LIST)
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

  const handleItemClick = ({ recordId }) => {
    Taro.navigateTo({
      url: `/marketing/pages/member/activity-detail?record_id=${recordId}`
    })
  }

  const onBtnAction = (item, type) => {
    const { activityId, recordId } = item
    switch (type) {
      case 'reFill':
        //重新填写
        Taro.navigateTo({
          url: `/marketing/pages/reservation/goods-reservate?activity_id=${activityId}&record_id=${recordId}`
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
    const { activityId,recordId } = activityInfo
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

  return (
    <SpPage scrollToTopBtn className='page-item-activity'>
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
              <CompActivityItem info={item} onClick={handleItemClick} onBtnAction={onBtnAction} />
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
