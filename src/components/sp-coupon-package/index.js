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
    
    // const all_card_list = [
    //   {
    //     'id': '1372',
    //     'user_id': '376',
    //     'company_id': '34',
    //     'card_id': '267',
    //     'code': '415160300865',
    //     'status': '1',
    //     'card_type': 'cash',
    //     'begin_date': '2022-07-12',
    //     'end_date': '2022-07-31',
    //     'title': '50\u4f18\u60e0\u5238',
    //     'color': '#000000',
    //     'discount': '0',
    //     'least_cost': '20000',
    //     'reduce_cost': '5000',
    //     'use_condition':
    //       'a:5:{s:15:"accept_category";N;s:15:"reject_category";N;s:10:"least_cost";s:5:"20000";s:14:"object_use_for";N;s:27:"can_use_with_other_discount";s:5:"false";}',
    //     'rel_shops_ids': 'all',
    //     'is_give_by_friend': null,
    //     'old_code': null,
    //     'get_outer_str': null,
    //     'consume_source': null,
    //     'location_name': null,
    //     'staff_open_id': null,
    //     'verify_code': null,
    //     'remark_amount': null,
    //     'consume_outer_str': null,
    //     'trans_id': null,
    //     'fee': null,
    //     'original_fee': null,
    //     'location_id': null,
    //     'friend_open_id': null,
    //     'is_return_back': null,
    //     'is_chat_room': null,
    //     'source_type': 'admin',
    //     'use_scenes': 'ONLINE',
    //     'use_platform': 'mall',
    //     'rel_item_ids': 'all',
    //     'most_cost': '99999900',
    //     'rel_distributor_ids': 'all',
    //     'get_date': '1657632446',
    //     'salesperson_id': '0',
    //     'use_limited': '0',
    //     'remain_times': '1',
    //     'use_bound': '0',
    //     'rel_category_ids': null,
    //     'apply_scope': '',
    //     'used_time': '0',
    //     'expired_time': '0',
    //     'description': '50\u4f18\u60e0\u5238',
    //     'source_id': '0',
    //     'coupon': {
    //       'card_id': '267',
    //       'title': '50\u4f18\u60e0\u5238',
    //       'code': '415160300865',
    //       'card_type': 'cash',
    //       'least_cost': '20000',
    //       'reduce_cost': '5000'
    //     },
    //     'distributor_id': 0,
    //     'distributor_info': {
    //       'distributor_id': 0,
    //       'company_id': 34,
    //       'name': 'shopex\u4e91\u5e97',
    //       'logo':
    //         'https://ecshopx1.yuanyuanke.cn/image/34/2022/03/17/8bec8b2bdb666274d3269496bb8d6e7e4vNky7GMtC3N7cxubqL8rTAiz2utnMfZ',
    //       'shop_code': '0000',
    //       'hour': '08:00-21:00',
    //       'mobile': '13485851236',
    //       'contract_phone': '',
    //       'contact': '\u5f20\u98de',
    //       'store_name': 'shopex\u4e91\u5e97',
    //       'store_address':
    //         '\u4e0a\u6d77\u5e02\u5f90\u6c47\u533a\u5de8\u4eba\u7f51\u7edc\u96c6\u56e2\u6709\u9650\u516c\u53f8',
    //       'shop_id': 0,
    //       'is_distributor': true,
    //       'address': null,
    //       'auto_sync_goods': false,
    //       'banner': null,
    //       'is_valid': 'true',
    //       'lng': null,
    //       'lat': null,
    //       'child_count': 0,
    //       'is_default': 0,
    //       'is_audit_goods': false,
    //       'is_ziti': false,
    //       'regions_id': null,
    //       'regions': null,
    //       'is_domestic': 1,
    //       'is_direct_store': 1,
    //       'province': null,
    //       'is_delivery': true,
    //       'city': null,
    //       'area': null,
    //       'created': null,
    //       'updated': null,
    //       'wechat_work_department_id': 0,
    //       'distributor_self': 0,
    //       'regionauth_id': 0,
    //       'is_open': 'false',
    //       'rate': null,
    //       'is_dada': null,
    //       'business': null,
    //       'dada_shop_create': null,
    //       'review_status': 0,
    //       'dealer_id': 0,
    //       'split_ledger_info': null,
    //       'introduce': null,
    //       'merchant_id': 0,
    //       'distribution_type': 0,
    //       'is_require_subdistrict': false,
    //       'is_require_building': false
    //     }
    //   },
    // ]
    const list = pickBy(all_card_list, doc.coupon.COUPON_ITEM)
    setState((draft) => {
      draft.list = list
      draft.visible = list.length > 0
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
