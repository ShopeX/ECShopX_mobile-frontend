import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { AtCurtain } from 'taro-ui'
import { SpCoupon } from '@/components'
import api from '@/api'
import doc from '@/doc'
import { pickBy, styleNames } from '@/utils'
import S from '@/spx'
import './index.scss'

const initialState = {
  list: [],
  visible: false
}
function SpCouponPackage(props) {
  const { info = 'grade', onClose = () => {} } = props
  const [state, setState] = useImmer(initialState)
  const { list, visible } = state
  useEffect(() => {
    if (S.getAuthToken()) {
      getCouponList()
    }
  }, [])

  const getCouponList = async () => {
    let receiveType
    if(info == 'grade') {
      const { type } = await api.vip.getCurrentGradList()
      receiveType = type
    } else {
      receiveType = info
    }
    const { all_card_list } = await api.vip.getShowCardPackage({ receive_type: receiveType })

    const _list = pickBy(all_card_list, doc.coupon.COUPON_ITEM)
    setState((draft) => {
      draft.list = _list
      draft.visible = _list.length > 0
    })
  }

  return (
    <View className='sp-coupon-package'>
      <AtCurtain
        isOpened={visible}
        onClose={() => {
          setState((draft) => {
            draft.visible = false
          })
          onClose()
        }}
      >
        <View
          className='package-hd'
          style={styleNames({
            'background-image': `url(${process.env.APP_IMAGE_CDN}/coupon_pkg_h.png)`
          })}
        ></View>
        <View className='package-bd'>
          <ScrollView scrollY className='coupon-list'>
            {list.map((item, idx) => (
              <SpCoupon info={item} key={`coupon-item__${idx}`} >去使用</SpCoupon>
            ))}
          </ScrollView>
        </View>
        <View
          className='package-ft'
          onClick={() => {
            Taro.navigateTo({
              url: '/subpages/marketing/coupon'
            })
            onClose()
          }}
          style={styleNames({
            'background-image': `url(${process.env.APP_IMAGE_CDN}/coupon_pkg_f.png)`
          })}
        ></View>
        {/* <View className='title'>福利专享券</View> */}

        {/* <View onClick={() => {}}>放入券包</View> */}
      </AtCurtain>
    </View>
  )
}

SpCouponPackage.options = {
  addGlobalClass: true
}

export default SpCouponPackage
