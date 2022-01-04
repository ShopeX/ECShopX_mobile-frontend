import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtModal } from 'taro-ui'
import api from '@/api'
import doc from '@/doc'
import { pickBy } from '@/utils'
import S from '@/spx'
import './index.scss'

const initialState = {
  list: []
}
function SpCouponPackage (props) {
  const [state, setState] = useImmer(initialState)
  useEffect(() => {
    if (S.getAuthToken()) {
      getCouponList()
    }
  }, [])

  const getCouponList = async () => {
    const { type } = await api.vip.getCurrentGradList()
    const { all_card_list } = await api.vip.getShowCardPackage({ receive_type: type })
    setState((draft) => {
      draft.list = pickBy(all_card_list, doc.coupon.COUPON_LIST)
    })
  }

  return (
    <View className='sp-coupon-package'>
      {/* <AtModal isOpened={visible} closeOnClickOverlay={false}>
        <View className="title">
          福利专享券
          <View
            className="icon-close poster-close-btn"
            onClick={() => onChange(false, "close")}
          ></View>
        </View>
        <ScrollView scrollY className="coupon-scroll">
          <View className="coupon-list-ticket">
            {list &&
              list.map((item, idx) => {
                let time = parseInt(new Date().getTime() / 1000);
                return (
                  <CouponItem info={item} key={item.card_id}>
                    <View
                      style={{ fontSize: "22rpx" }}
                      onClick={this.handleClickNews.bind(this, item, idx)}
                    >
                      待领取
                    </View>
                  </CouponItem>
                );
              })}
          </View>
        </ScrollView>
        <View onClick={() => onChange(false, "jump")} className="button">
          放入券包
        </View>
      </AtModal> */}
    </View>
  )
}

SpCouponPackage.options = {
  addGlobalClass: true
}

export default SpCouponPackage
