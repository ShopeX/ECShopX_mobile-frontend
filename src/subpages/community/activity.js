import React, { useRef } from 'react'

import { View, ScrollView, Image } from '@tarojs/components'
import { AtModal } from 'taro-ui'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { SpPage, SpScrollView, SpFilterBar, SpPrice } from '@/components'
import { pickBy, classNames, showToast } from '@/utils'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import doc from '@/doc'
import api from '@/api'

import CompTabbar from './comps/comp-tabbar'

import './activity.scss'

const initialState = {
  activityList: [],
  curTabIdx: 0,
  isOpened: false,
  currentInfo: {}
}
const tabList = [
  { title: '默认', type: '0' },
  { title: '上新', type: '1' },
  { title: '销量', type: '2' }
]

function ActivityPage() {
  const [state, setState] = useImmer(initialState)
  const { colorPrimary } = useSelector((state) => state.sys)
  const activityRef = useRef()

  const { activityList, curTabIdx, isOpened, currentInfo } = state

  const fetch = async ({ pageIndex, pageSize }) => {
    let params = {
      page: pageIndex,
      pageSize
      // order_type: 'normal',
      // status: 0,
      // curTabIdx
    }
    const { list, total_count: total } = await api.community.getActivityLits(params)
    const n_list = pickBy(list, doc.community.COMMUNITY_ACTIVITY_LIST)
    setState((draft) => {
      draft.activityList = [...activityList, ...n_list]
    })

    return { total }
  }

  const onFilterChange = async (e) => {
    await setState((draft) => {
      draft.curTabIdx = e.current || 0
      draft.activityList = []
    })
    activityRef.current.reset()
  }

  const onModalChange = async (isOpened, type) => {
    console.log(type)
    if (type == 'confirm') {
      const { activityId } = currentInfo
      api.community.confirmDelivery(activityId).then((res) => {
        showToast('操作成功')
        setState((draft) => {
          draft.curTabIdx = 0
          draft.activityList = []
        })
        activityRef.current.reset()
      })
    }
    setState((draft) => {
      draft.isOpened = isOpened
    })
  }

  const handleClickBtn = async (info) => {
    await setState((draft) => {
      draft.isOpened = true
      draft.currentInfo = info
    })
  }

  console.log('activityList:', activityList)

  const handleClickActivity = ({ activityId }) => {
    Taro.navigateTo({
      url: `/subpages/community/group-leaderdetail?activity_id=${activityId}`
    })
  }

  return (
    <SpPage className='page-community-activity'>
      <SpScrollView className='page-community-activity-scroll' ref={activityRef} fetch={fetch}>
        <SpFilterBar
          custom
          current={curTabIdx}
          list={tabList}
          onChange={onFilterChange}
          className='page-community-activity-filter'
          color={colorPrimary}
        />
        {activityList.map((info, idx) => (
          <View
            key={idx}
            className='page-community-activity-info'
            onClick={handleClickActivity.bind(this, info)}
          >
            <View className='page-community-activity-head'>
              <View className='goods-hd'>
                <View className='goods-title'>{info.activityName}</View>
                <View className='goods-price'>{info.priceRange}</View>
              </View>
              <View className='goods-time'>{info.startTime}</View>
            </View>
            <View className='page-community-activity-goods'>
              <View className='goods-info'>
                <ScrollView className='scroll-goods' scrollX>
                  {info.items &&
                    info.items.map((el, elidx) => (
                      <View className='scroll-item' key={elidx}>
                        <View className='goods-imgbox'>
                          <Image src={el.pics} className='goods-img' lazyLoad />
                          {/* <View className='img-desc'>商品已核销</View> */}
                        </View>
                        <View className='goods-desc'>{el.itemName}</View>
                        {/* <View className='goods-num'>+11件</View> */}
                      </View>
                    ))}
                </ScrollView>
              </View>
              {/* <View className='goods-sale'>
                <SpPrice className='sale-price' value={0.03} />
                <View className='sale-num'>共5件</View>
              </View> */}
            </View>
            <View className='page-community-activity-static'>
              <View className='activity-static'>
                <SpPrice value={0.03} primary />
                <View className='activity-static-desc'>实际收入(元)</View>
              </View>
              <View className='activity-static'>
                <SpPrice value={10} noSymbol noDecimal />
                <View className='activity-static-desc'>已跟团</View>
              </View>
              <View className='activity-static'>
                <SpPrice value={20} noSymbol noDecimal />
                <View className='activity-static-desc'>已浏览</View>
              </View>
              <View className='activity-static border'>未发货</View>
            </View>
            <View className='page-community-activity-footer'>
              <View className={classNames('footer-status', info.activityStatus)}>
                {info.activityStatusMsg}
              </View>
              {info.deliveryStatus == 'DONE' && (
                <View
                  onClick={() => handleClickBtn(info)}
                  className='footer-btn'
                  style={`border: 1PX solid ${colorPrimary}; color: ${colorPrimary}`}
                >
                  确认收货
                </View>
              )}
            </View>
          </View>
        ))}
      </SpScrollView>
      <AtModal
        isOpened={isOpened}
        className='activity-modal'
        cancelText='取消'
        confirmText='确认'
        content='是否确认收货'
        closeOnClickOverlay={false}
        onCancel={() => onModalChange(false, 'cancel')}
        onConfirm={() => onModalChange(false, 'confirm')}
      />
    </SpPage>
  )
}

export default ActivityPage
