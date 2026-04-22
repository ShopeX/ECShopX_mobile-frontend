/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import qs from 'qs'
import { View, Text } from '@tarojs/components'
import { pickBy, showToast, isWeixin, entryLaunch } from '@/utils'
import { SpPage, SpScrollView, SpCoupon, SpLogin } from '@/components'
import { useLogin } from '@/hooks'
import { SG_GUIDE_PARAMS } from '@/consts/localstorage'
import './coupon-center.scss'

const initialState = {
  couponList: []
}
function CouponCenter(props) {
  const $instance = getCurrentInstance() || {}
  const [state, setState] = useImmer(initialState)
  const { couponList } = state
  const { isLogin } = useLogin({ autoLogin: false })
  const { gu } = Taro.getStorageSync(SG_GUIDE_PARAMS)
  let work_userid = ''
  if (gu) {
    work_userid = gu.split('_')[0]
  }
  useEffect(() => {
    entryLaunch.postGuideUV()
    entryLaunch.postGuideTask()
  }, [])

  const fetch = async ({ pageIndex, pageSize }) => {
    const {
      distributor_id,
      item_id = '',
      itemid = '',
      card_id
    } = await entryLaunch.getRouteParams($instance?.router?.params)
    const params = {
      page_no: pageIndex,
      page_size: pageSize,
      end_date: 1,
      card_id,
      distributor_id,
      item_id: item_id || itemid
    }
    if (work_userid) {
      params.work_userid = work_userid
    }
    const {
      list,
      pagers: { total: total }
    } = await api.member.homeCouponList(params)

    setState((draft) => {
      draft.couponList = couponList.concat(pickBy(list, doc.coupon.COUPON))
    })
    return {
      total
    }
  }

  const handleClickCouponItem = async (item, index) => {
    if (item.couponStatus == 0) {
      showToast('优惠券已领完')
    } else if (item.couponStatus == 1) {
      if (isWeixin) {
        const templeparams = {
          temp_name: 'yykweishop',
          source_type: 'coupon'
        }
        const { template_id } = await api.user.newWxaMsgTmpl(templeparams)
        if (template_id.length > 0) {
          Taro.requestSubscribeMessage({
            tmplIds: template_id,
            success: () => {
              getCoupon(item, index)
            },
            fail: () => {
              getCoupon(item, index)
            }
          })
        } else {
          getCoupon(item, index)
        }
      } else {
        getCoupon(item, index)
      }
    } else {
      showToast('优惠券领取机会已用完')
    }
  }

  const getCoupon = async ({ cardId }, index) => {
    const params = {
      card_id: cardId
    }
    if (work_userid) {
      params.work_userid = work_userid
    }
    const { status } = await api.member.homeCouponGet(params)
    if (status) {
      if (status.total_lastget_num <= 0) {
        setState((draft) => {
          draft.couponList[index].couponStatus = 0
        })
      } else if (status.lastget_num <= 0) {
        setState((draft) => {
          draft.couponList[index].couponStatus = 2
        })
      }
      showToast('优惠券领取成功')
    } else {
      showToast('优惠券领取失败')
    }
  }

  const couponBtnLabel = (status) =>
    ({
      0: '已领完',
      1: '立即领取',
      2: '已领取'
    }[status])

  const renderCouponBtn = (item, index) => {
    const label = couponBtnLabel(item.couponStatus)
    const text = <Text>{label}</Text>
    // 未登录领取：用 SpLogin 在本页弹窗登录，避免请求 401 被全局重定向到个人中心
    if (item.couponStatus === 1 && !isLogin) {
      return <SpLogin onChange={() => handleClickCouponItem(item, index)}>{text}</SpLogin>
    }
    return text
  }

  return (
    <SpPage className='page-coupon-center' scrollToTopBtn>
      <SpScrollView className='list-scroll' fetch={fetch}>
        {couponList.map((item, index) => (
          <View className='coupon-item-wrap' key={`coupon-item__${index}`}>
            <SpCoupon
              info={item}
              onClick={
                item.couponStatus === 1 && !isLogin
                  ? () => {}
                  : handleClickCouponItem.bind(this, item, index)
              }
            >
              {renderCouponBtn(item, index)}
            </SpCoupon>
          </View>
        ))}
      </SpScrollView>
    </SpPage>
  )
}

CouponCenter.options = {
  addGlobalClass: true
}

export default CouponCenter
