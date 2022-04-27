import React, { useEffect, useCallback, useRef, useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
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
import { SpPage, SpScrollView, SpSearchBar, SpPrice } from '@/components'
import { pickBy, copyText } from '@/utils'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import doc from '@/doc'
import api from '@/api'

import CompOrderItem from './comps/comp-orderitem'

import './order-manage.scss'

const initialState = {
  keywords: undefined,
  orderList: [],
  curTabIdx: 0,
  // curDeliverTagIdx: 0,
  // curAfterTagIdx: 0,
  isOpened: false,
  remark: '',
  totalInfo: {},
  orderModal: false,
  orderModalCont: '',
  orderModalTitle: ''
}
const tabList = [
  { title: '全部', type: 0 },
  { title: '待支付', type: 5 },
  { title: '待自提', type: 4 }
  // { title: '核销', type: '2' },
  // { title: '售后', type: '3' },
  // { title: '备注', type: '4' }
]

// const deliverTagList = [
//   { title: '待收货', type: 6 }
//   { title: '部分发货', type: '1' },
//   { title: '已发货', type: '2' },
//   { title: '已收货', type: '3' }
// ]

// const afterTagList = [
//   { title: '待退款', type: '0' },
//   { title: '已退款', type: '1' }
// ]

function CheifOrderManage(props) {
  const [state, setState] = useImmer(initialState)
  const [isShowSearch, setIsShowSearch] = useState(false)
  const { colorPrimary } = useSelector((state) => state.sys)
  const { checkIsChief } = useSelector((state) => state.user)
  const orderRef = useRef()
  const $instance = getCurrentInstance()
  const { activity_id } = $instance.router?.params

  const {
    keywords,
    orderList,
    curTabIdx,
    isOpened,
    remark,
    totalInfo,
    orderModal,
    orderModalCont,
    orderModalTitle
  } = state

  const fetch = async ({ pageIndex, pageSize }) => {
    let params = {
      page: pageIndex,
      pageSize,
      mobile: keywords,
      status: (curTabIdx == 1 && 5) || (curTabIdx == 2 && 4) || '',
      is_seller: 1,
      activity_id
    }
    const {
      list,
      pager: { count: total },
      statistics
    } = await api.community.getCommunityList(params)
    const n_list = pickBy(list, doc.community.COMMUNITY_ORDER_LIST)
    setState((draft) => {
      draft.orderList = [...orderList, ...n_list]
      draft.totalInfo = statistics
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
      // draft.curAfterTagIdx = ''
      // draft.curDeliverTagIdx = ''
      draft.orderList = []
    })
    if (curTabIdx == 3) return
    orderRef.current.reset()
  }

  const renderFooter = (info) => {
    const { orderStatusDes, canApplyCancel, isLogistics, receiver_type, status, communityInfo } =
      info || {}
    let isShowCacel =
      (orderStatusDes == 'PAYED_PENDING' || orderStatusDes == 'NOTPAY') &&
      canApplyCancel != 0 &&
      communityInfo.activity_status != 'success'
    return (
      <>
        {isShowCacel && (
          <View
            onClick={() => handleClickBtn(info)}
            className='page-order-manage-btn'
            style={`border: 1PX solid ${colorPrimary}; color: ${colorPrimary}`}
          >
            取消订单
          </View>
        )}
      </>
    )
  }

  const handleClickBtn = (info) => {
    console.log(info, 'info')
    Taro.navigateTo({
      url: `/subpage/pages/trade/cancel?order_id=${info.orderId}`
    })
    // Taro.navigateTo({
    //   url: '/subpages/community/order-refund'
    // })
  }

  const onOrderClick = (item) => {
    Taro.navigateTo({
      url: `/subpages/community/group-leaderdetail?activity_id=${item?.communityInfo.activity_id}`
    })
  }

  // const onEditClick = (isOpened) => {
  //   setState((draft) => {
  //     draft.isOpened = isOpened
  //   })
  // }

  // const actionChange = async (isOpened, type) => {
  //   console.log(type)
  //   if (type == 'confirm') {
  //     console.log(remark, '---')
  //     await setState((draft) => {
  //       draft.remark = ''
  //       draft.orderList = []
  //       draft.curTabIdx = 0
  //       // draft.curAfterTagIdx = 0
  //       // draft.curDeliverTagIdx = 0
  //     })
  //     orderRef.current.reset()
  //   } else {
  //     setState((draft) => {
  //       draft.remark = ''
  //     })
  //   }
  //   setState((draft) => {
  //     draft.isOpened = isOpened
  //   })
  // }

  const handleChange = (value) => {
    setState((draft) => {
      draft.remark = value
    })
  }

  const onOrderChange = (orderModal, type = 0) => {
    let content = ''
    let title = ''
    if (type == 1) {
      title = '有效订单'
      content = '全部订单-已取消订单'
    } else if (type == 2) {
      title = '订单总金额'
      content = '该活动所有订单实付金额（含退款金额）'
    } else if (type == 3) {
      title = '退款金额'
      content = '所有订单退款金额'
    }
    setState((draft) => {
      draft.orderModal = orderModal
      draft.orderModalTitle = title
      draft.orderModalCont = content
    })
  }

  // const deliverTagClick = async ({ name }) => {
  //   const idx = deliverTagList.findIndex((el) => el.type == name.type)
  //   await setState((draft) => {
  //     draft.curDeliverTagIdx = idx
  //     draft.curAfterTagIdx = 0
  //     draft.orderList = []
  //   })
  //   orderRef.current.reset()
  // }

  // const afterTagClick = async ({ name }) => {
  //   const idx = afterTagList.findIndex((el) => el.type == name.type)
  //   console.log(idx)
  //   await setState((draft) => {
  //     draft.curAfterTagIdx = idx
  //     draft.curDeliverTagIdx = 0
  //     draft.orderList = []
  //   })
  //   orderRef.current.reset()
  // }

  const renderExportFooter = () => {
    if (activity_id && checkIsChief) {
      return (
        <View className='page-order-manage-bot' onClick={onCopyClick}>
          <View className='iconfont icon-dingdandaochu' />
          <View>订单导出</View>
        </View>
      )
    }
  }

  const onCopyClick = async () => {
    const { url } = await api.community.exportOrder({ activity_id })
    await copyText(url, '复制成功，请从浏览器打开')
  }

  const onHefChange = () => {
    Taro.navigateTo({
      url: '/subpages/community/boxlist'
    })
  }

  return (
    <SpPage
      className={`page-order-manage ${checkIsChief && 'paddingMrt'}`}
      renderFooter={renderExportFooter()}
    >
      {checkIsChief && (
        <View className='page-order-manage-top'>
          <View className='order-content'>
            <View className='order-content-num'>{totalInfo?.appliedTotalNum || 0}</View>
            <View className='order-content-desc'>
              有效订单
              <Text className='iconfont icon-info' onClick={() => onOrderChange(true, 1)} />
            </View>
          </View>
          <View className='order-content'>
            <View className='order-content-num'>
              <SpPrice
                className='sale-price'
                size={50}
                unit='cent'
                value={totalInfo?.totalFee || 0}
              />
            </View>
            <View className='order-content-desc'>
              订单总金额
              <Text className='iconfont icon-info' onClick={() => onOrderChange(true, 2)} />
            </View>
          </View>
          <View className='order-content'>
            <View className='order-content-num'>
              <SpPrice
                className='sale-price'
                size={50}
                unit='cent'
                value={totalInfo?.appliedTotalRefundFee || 0}
              />
            </View>
            <View className='order-content-desc'>
              退款金额
              <Text className='iconfont icon-info' onClick={() => onOrderChange(true, 3)} />
            </View>
          </View>
        </View>
      )}
      {checkIsChief && (
        <View className='page-order-manage-boxlist' onClick={onHefChange}>
          <View className='btn'>成团汇总</View>
        </View>
      )}
      <SpScrollView className='page-order-manage-scroll' ref={orderRef} fetch={fetch}>
        <View className='page-order-manage-search'>
          <SpSearchBar
            showDailog={false}
            keyword={keywords}
            placeholder='手机号'
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
              <AtTabsPane current={curTabIdx} key={panes.type} index={pIdx}></AtTabsPane>
            ))}
          </AtTabs>
          {/* {curTabIdx == 1 && (
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
          )} */}
          {/* {curTabIdx == 3 && (
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
          )} */}
        </View>
        {orderList.map((item) => (
          <CompOrderItem
            key={item.order_id}
            info={item}
            renderFooter={renderFooter(item)}
            onClick={onOrderClick}
            // onEditClick={onEditClick}
          />
        ))}
      </SpScrollView>
      {/* <AtModal isOpened={isOpened} closeOnClickOverlay={false}>
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
      </AtModal> */}
      <AtModal
        isOpened={orderModal}
        className='order-modal'
        confirmText='知道了'
        content={orderModalCont}
        title={orderModalTitle}
        closeOnClickOverlay={false}
        onConfirm={() => onOrderChange(false, 0)}
      />
    </SpPage>
  )
}

export default CheifOrderManage
