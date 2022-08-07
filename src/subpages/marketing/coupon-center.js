import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, Text } from '@tarojs/components'
import { pickBy, showToast, isWeixin } from '@/utils'
import { SpPage, SpScrollView, SpCoupon } from '@/components'
import './coupon-center.scss'

const initialState = {
  couponList: []
}
function CouponCenter(props) {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const { couponList } = state

  useEffect(() => {}, [])

  const fetch = async ({ pageIndex, pageSize }) => {
    const { distributor_id, item_id = '', itemid = '', card_id } = $instance.router.params
    const params = {
      page_no: pageIndex,
      page_size: pageSize,
      end_date: 1,
      card_id,
      distributor_id: distributor_id,
      item_id: item_id || itemid
    }
    const {
      list,
      pagers: { total: total }
    } = await api.member.homeCouponList(params)

    console.log(pickBy(list, doc.coupon.COUPON))
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
    const { status } = await api.member.homeCouponGet({
      card_id: cardId
    })
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

  return (
    <SpPage className='page-coupon-center' scrollToTopBtn>
      <SpScrollView className='list-scroll' fetch={fetch}>
        {couponList.map((item, index) => (
          <View className='coupon-item-wrap' key={`coupon-item__${index}`}>
            <SpCoupon info={item} onClick={handleClickCouponItem.bind(this, item, index)}>
              <Text>
                {
                  {
                    0: '已领完',
                    1: '立即领取',
                    2: '已领取'
                  }[item.couponStatus]
                }
                {/* {time > item.send_begin_time && item.getted !== 2 && item.getted !== 1
                  ? '立即领取'
                  : ''} */}
                {/* {item.card_type === 'new_gift' && time < item.send_begin_time ? '未开始' : ''} */}
              </Text>
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
