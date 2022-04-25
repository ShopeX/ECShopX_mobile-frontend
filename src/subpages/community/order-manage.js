import React, { useEffect, useCallback, useRef, useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import {
  AtTabs,
  AtTabsPane,
  AtModal,
  AtModalContent,
  AtModalAction,
  AtModalHeader,
  AtInput,
  AtTag
} from 'taro-ui'
import { SpPage, SpScrollView, SpSearchBar } from '@/components'
import { pickBy, classNames } from '@/utils'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import doc from '@/doc'
import api from '@/api'
import CompOrderItem from './comps/comp-orderitem/comp-orderitem'

import './order-manage.scss'

const initialState = {
  keywords: undefined,
  orderList: [],
  curTabIdx: 0,
  curDeliverTagIdx: 0,
  curAfterTagIdx: 0,
  isOpened: false,
  remark: ''
}
const tabList = [
  { title: '全部', type: '0' },
  { title: '发货', type: '1' }
  // { title: '核销', type: '2' },
  // { title: '售后', type: '3' },
  // { title: '备注', type: '4' }
]

const deliverTagList = [
  { title: '待收货', type: 6 }
  // { title: '部分发货', type: '1' },
  // { title: '已发货', type: '2' },
  // { title: '已收货', type: '3' }
]

const afterTagList = [
  { title: '待退款', type: '0' },
  { title: '已退款', type: '1' }
]

function OrderManage(props) {
  const [state, setState] = useImmer(initialState)
  const [isShowSearch, setIsShowSearch] = useState(false)
  const { colorPrimary } = useSelector((state) => state.sys)
  const orderRef = useRef()

  const { keywords, orderList, curTabIdx, isOpened, remark, curDeliverTagIdx, curAfterTagIdx } =
    state

  const fetch = async ({ pageIndex, pageSize }) => {
    let params = {
      page: pageIndex,
      pageSize,
      mobile: keywords,
      status: curDeliverTagIdx
      // curDeliverTagIdx,
      // curAfterTagIdx
    }
    const {
      list,
      pager: { count: total }
    } = await api.community.getCommunityList(params)
    const n_list = pickBy(list, doc.community.COMMUNITY_ORDER_LIST)
    setState((draft) => {
      draft.orderList = [...orderList, ...n_list]
    })

    return { total }
  }

  const handleOnFocus = () => {
    setIsShowSearch(true)
  }

  const handleOnChange = (val) => {
    setState((draft) => {
      draft.keywords = val
    })
  }

  const handleOnClear = async () => {
    await setState((draft) => {
      draft.keywords = ''
      draft.orderList = []
    })
    setIsShowSearch(false)
    orderRef.current.reset()
  }

  const handleSearchCancel = () => {
    setState((draft) => {
      draft.keywords = ''
    })
    setIsShowSearch(false)
  }

  const handleConfirm = async (val) => {
    await setState((draft) => {
      draft.orderList = []
      draft.keywords = val
    })
    setIsShowSearch(false)
    orderRef.current.reset()
  }

  const handleClickTab = async (curTabIdx) => {
    await setState((draft) => {
      draft.curTabIdx = curTabIdx
      draft.curAfterTagIdx = 0
      draft.curDeliverTagIdx = 0
      draft.orderList = []
    })
    orderRef.current.reset()
  }

  const renderFooter = () => {
    return (
      <>
        <View
          onClick={() => handleClickBtn('refund')}
          className='page-order-manage-btn'
          style={`border: 1PX solid ${colorPrimary}; color: ${colorPrimary}`}
        >
          申请退款
        </View>
        <View
          onClick={() => handleClickBtn('aftersale')}
          className='page-order-manage-btn'
          style={`border: 1PX solid ${colorPrimary}; color: ${colorPrimary}`}
        >
          售后详情
        </View>
        <View
          onClick={() => handleClickBtn('close')}
          className='page-order-manage-btn'
          style={`border: 1PX solid ${colorPrimary}; color: ${colorPrimary}`}
        >
          关闭订单
        </View>
        <View
          onClick={() => handleClickBtn('gopay')}
          className='page-order-manage-btn'
          style={`border: 1PX solid ${colorPrimary}; color: ${colorPrimary}`}
        >
          去支付
        </View>
        <View
          onClick={() => handleClickBtn('again')}
          className='page-order-manage-btn'
          style={`background: ${colorPrimary};`}
        >
          再来一单
        </View>
      </>
    )
  }

  const handleClickBtn = (type) => {
    if (type == 'refund') {
      Taro.navigateTo({
        url: '/subpages/community/order-refund'
      })
    }
  }

  const onEditClick = (isOpened) => {
    setState((draft) => {
      draft.isOpened = isOpened
    })
  }

  const actionChange = async (isOpened, type) => {
    console.log(type)
    if (type == 'confirm') {
      console.log(remark, '---')
      await setState((draft) => {
        draft.remark = ''
        draft.orderList = []
        draft.curTabIdx = 0
        draft.curAfterTagIdx = 0
        draft.curDeliverTagIdx = 0
      })
      orderRef.current.reset()
    } else {
      setState((draft) => {
        draft.remark = ''
      })
    }
    setState((draft) => {
      draft.isOpened = isOpened
    })
  }

  const handleChange = (value) => {
    setState((draft) => {
      draft.remark = value
    })
  }

  const deliverTagClick = async ({ name }) => {
    const idx = deliverTagList.findIndex((el) => el.type == name.type)
    await setState((draft) => {
      draft.curDeliverTagIdx = idx
      draft.curAfterTagIdx = 0
      draft.orderList = []
    })
    orderRef.current.reset()
  }

  const afterTagClick = async ({ name }) => {
    const idx = afterTagList.findIndex((el) => el.type == name.type)
    console.log(idx)
    await setState((draft) => {
      draft.curAfterTagIdx = idx
      draft.curDeliverTagIdx = 0
      draft.orderList = []
    })
    orderRef.current.reset()
  }

  return (
    <SpPage className='page-order-manage'>
      <SpScrollView className='page-order-manage-scroll' ref={orderRef} fetch={fetch}>
        <View className='page-order-manage-search'>
          <SpSearchBar
            showDailog={false}
            keyword={keywords}
            placeholder='搜索商品名'
            onFocus={handleOnFocus}
            onChange={handleOnChange}
            onClear={handleOnClear}
            onCancel={handleSearchCancel}
            onConfirm={handleConfirm}
          />
        </View>
        <View className='page-order-manage-tabs'>
          <AtTabs
            current={curTabIdx}
            tabList={tabList}
            onClick={handleClickTab}
            customStyle={{ color: colorPrimary }}
          >
            {tabList.map((panes, pIdx) => (
              <AtTabsPane current={curTabIdx} key={panes.status} index={pIdx}></AtTabsPane>
            ))}
          </AtTabs>
          {curTabIdx == 1 && (
            <View className='page-order-manage-tags'>
              {deliverTagList.map((item, idx) => (
                <AtTag
                  name={item}
                  key={item}
                  active={idx == curDeliverTagIdx}
                  onClick={deliverTagClick}
                  className={classNames(
                    'manage-tags',
                    idx === curDeliverTagIdx ? 'manage-tags-active' : ''
                  )}
                >
                  {item.title}
                </AtTag>
              ))}
            </View>
          )}
          {curTabIdx == 3 && (
            <View className='page-order-manage-tags'>
              {afterTagList.map((item, idx) => (
                <AtTag
                  name={item}
                  key={item}
                  active={idx == curAfterTagIdx}
                  onClick={afterTagClick}
                  className={classNames(
                    'manage-tags',
                    idx === curAfterTagIdx ? 'manage-tags-active' : ''
                  )}
                >
                  {item.title}
                </AtTag>
              ))}
            </View>
          )}
        </View>
        {orderList.map((item) => (
          <CompOrderItem
            key={item.order_id}
            info={item}
            renderFooter={renderFooter()}
            onEditClick={onEditClick}
          />
        ))}
      </SpScrollView>
      <AtModal isOpened={isOpened} closeOnClickOverlay={false}>
        <AtModalHeader>添加备注</AtModalHeader>
        <AtModalContent>
          <AtInput
            name='remark'
            title='备注'
            type='text'
            placeholder='最多100个字哦'
            value={remark}
            onChange={handleChange}
          />
        </AtModalContent>
        <AtModalAction>
          <Button onClick={() => actionChange(false, 'cancel')}>取消</Button>
          <Button onClick={() => actionChange(false, 'confirm')}>确定</Button>
        </AtModalAction>
      </AtModal>
    </SpPage>
  )
}

export default OrderManage
