/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useMemo, useRef } from 'react'
import { useImmer } from 'use-immer'
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { SpPage, SpScrollView } from '@/components'
import { SpTagBar, SpSelectModal } from '@/subpages/components'
import { useTranslation, $t } from '@/i18n'
import api from '@/api'
import * as activityDoc from '@/doc/activity'
import { pickBy } from '@/utils'
import CompActivityItem from './comps/comp-activity-item'
import './item-activity.scss'

const initialState = {
  status: '',
  recordList: [],
  info: null,
  isOpened: false,
  activityInfo: {},
  hasReFreash: false
}
function ItemActivity(props) {
  const { i18n } = useTranslation()
  const [state, setState] = useImmer(initialState)
  const { status, recordList, isOpened, activityInfo, hasReFreash } = state
  const recordRef = useRef()
  const router = useRouter()
  const filterActivityId = router.params?.activity_id

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

  // useEffect(() => {
  //   Taro.eventCenter.on('onEventRecordStatusChange', () => {
  //     setState((draft) => {
  //       draft.recordList = []
  //       draft.hasReFreash = true
  //     });

  //     recordRef.current.reset()
  //   })

  //   return () => {
  //     Taro.eventCenter.off('onEventRecordStatusChange')
  //   }
  // }, [])

  useDidShow(() => {
    // if(hasReFreash){
    //   setState((draft) => {
    //     draft.recordList = []
    //     draft.hasReFreash = false
    //   });
    //   recordRef.current.reset()
    // }

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
  }, [status, filterActivityId])

  const fetch = async ({ pageIndex, pageSize }) => {
    const params = {
      page: pageIndex,
      pageSize,
      order_type: 'normal',
      status
    }
    if (filterActivityId) {
      params.activity_id = filterActivityId
    }
    const { list, total_count: total } = await api.user.registrationRecordList(params)
    const nList = pickBy(list, activityDoc.RECORD_LIST)
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
    const { activityId, recordId, status, hasTemp } = item
    switch (type) {
      case 'reFill':
        //重新填写
        Taro.navigateTo({
          url: `/marketing/pages/reservation/goods-reservate?activity_id=${activityId}&record_id=${recordId}`
        })
        break
      case 'sign':
        //立即报名
        if (hasTemp) {
          // 有模板
          if (['passed', 'canceled', 'verified'].includes(status)) {
            Taro.navigateTo({
              url: `/marketing/pages/reservation/goods-reservate?activity_id=${activityId}`
            })
          } else {
            //有编辑
            setState((draft) => {
              draft.isOpened = true
              draft.activityInfo = item
            })
          }
        } else {
          //没有模板
          registrationSubmitFetch(item)
        }

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

  return (
    <SpPage scrollToTopBtn className='page-item-activity'>
      <SpTagBar list={tradeStatus} value={status} onChange={onChangeTradeState} />
      <ScrollView className='list-scroll-container' scrollY>
        <SpScrollView
          className='trade-list-scroll'
          auto={false}
          ref={recordRef}
          fetch={fetch}
          emptyMsg={$t('11f15792.082a19')}
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
