/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useMemo, useRef } from 'react'
import { useImmer } from 'use-immer'
import Taro, { useDidShow } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpPage, SpScrollView, SpSearchBar } from '@/components'
import { SpTagBar, SpSelectModal } from '@/subpages/components'
import { useTranslation, $t } from '@/i18n'
import api from '@/api'
import * as activityDoc from '@/doc/activity'
import { pickBy } from '@/utils'
import './activity-list.scss'
import CompActivityItem from './comps/comp-activity-item'

const initialState = {
  status: '1',
  recordList: [],
  trackDetailList: [],
  openTrackDetail: false,
  info: null,
  isOpened: false,
  activityInfo: {},
  keyword: ''
}
function ActivityIist(props) {
  const { i18n } = useTranslation()
  const [state, setState] = useImmer(initialState)
  const { status, recordList, isOpened, activityInfo, keyword } = state
  const recordRef = useRef()

  const tradeStatus = useMemo(
    () => [
      { tag_name: $t('da5ae518.a8b0c2'), value: '' },
      { tag_name: $t('da5ae518.dd4e55'), value: '0' },
      { tag_name: $t('da5ae518.fb852f'), value: '1' },
      { tag_name: $t('da5ae518.047fab'), value: '2' }
    ],
    [i18n.language]
  )

  const selectOptions = useMemo(
    () => [
      { label: $t('c012603a.1f8f1b'), value: '0' },
      { label: $t('c012603a.78206f'), value: '1' }
    ],
    [i18n.language]
  )

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

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('f330b238.2bc045') })
  }, [i18n.language])

  const fetch = async ({ pageIndex, pageSize }) => {
    const params = {
      page: pageIndex,
      pageSize,
      order_type: 'normal',
      status,
      activity_name: keyword
    }

    const { list, total_count: total } = await api.user.registrationActivityList(params)
    const nList = pickBy(list, activityDoc.ACTIVITY_LIST)
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

  const handleViewRecords = (item) => {
    const id = item?.activityId
    if (id == null || id === '') return
    Taro.navigateTo({
      url: `/marketing/pages/member/item-activity?activity_id=${encodeURIComponent(id)}`
    })
  }

  const registrationSubmitFetch = async ({ activityId }) => {
    await api.user.joinActivity({ activity_id: activityId })
    Taro.showToast({
      icon: 'none',
      title: $t('c012603a.b90d81')
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
        placeholder={$t('c012603a.853068')}
        showDailog={false}
        onFocus={() => {}}
        onChange={() => {}}
        onClear={handleOnClear}
        onCancel={handleOnClear}
        onConfirm={handleConfirm}
      />
      <SpTagBar list={tradeStatus} value={status} onChange={onChangeTradeState} />
      <SpScrollView
        className='trade-list-scroll'
        auto={false}
        ref={recordRef}
        fetch={fetch}
        emptyMsg={$t('11f15792.082a19')}
      >
        <View className='trade-item-wrap'>
          {recordList.map((item, index) => (
            <View className='trade-item-wrap-item' key={index}>
              <CompActivityItem
                isActivity
                info={item}
                onClick={handleItemClick}
                onBtnAction={onBtnAction}
                onViewRecords={handleViewRecords}
              />
            </View>
          ))}
        </View>
      </SpScrollView>

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
