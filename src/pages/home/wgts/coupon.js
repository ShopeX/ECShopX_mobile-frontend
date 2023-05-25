import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, ScrollView, Text } from '@tarojs/components'
import { SpImage, SpCouponPackage } from '@/components'
import { classNames, styleNames, isWeixin, showToast } from '@/utils'
import S from '@/spx'
import './coupon.scss'

const initialState = {
  visibleCouponPkg: false
}
function WgtCoupon(props) {
  const { base, data, voucher_package } = props.info
  const [state, setState] = useImmer(initialState)
  const { visibleCouponPkg } = state
  useEffect(() => { }, [])

  const handleClickItem = async ({ id }) => {
    if (!S.getAuthToken()) {
      showToast('请先登录再领取')
      Taro.navigateTo({
        url: `/subpages/member/index`
      })
      return
    }

    if (isWeixin) {
      const { template_id } = await api.user.newWxaMsgTmpl({
        temp_name: 'yykweishop',
        source_type: 'coupon'
      })
      Taro.requestSubscribeMessage({
        tmplIds: template_id,
        success: () => {
          handleGetCard(id)
        },
        fail: () => {
          handleGetCard(id)
        }
      })
    } else {
      handleGetCard(id)
    }
  }

  // 券包领取
  const handleClickItemPkg = async ({ package_id }) => {
    if (!S.getAuthToken()) {
      showToast('请先登录再领取')
      Taro.navigateTo({
        url: `/subpages/member/index`
      })
      return
    }
    await api.vip.getReceiveCardPackage({ package_id })
    showToast('券包领取成功')
    setState((draft) => {
      draft.visibleCouponPkg = true
    })
  }

  const handleGetCard = async (id) => {
    await api.member.homeCouponGet({
      card_id: id
    })
    showToast('优惠券领取成功')
  }

  const len = data.length + ((voucher_package?.length) ?? 0)

  const getCouponStyle = (item) => {
    if (item.imgUrl) {
      return {
        'background-image': `url(${item.imgUrl})`,
        'background-size': 'cover',
        'background-position': 'center',
        'background-color': 'transparent'
      }
    }
  }

  return (
    <View
      className={classNames('wgt wgt-coupon', {
        wgt__padded: base.padded
      })}
    >
      {base.title && (
        <View className='wgt-head'>
          <View className='wgt-hd'>
            <Text className='wgt-title'>{base.title}</Text>
            <Text className='wgt-subtitle'>{base.subtitle}</Text>
          </View>
        </View>
      )}
      {/* <View className={classNames('wgt__body with-padding', `coupon-style-${len <= 2 ? len : 3}`)}> */}
      <ScrollView scrollX className={classNames('wgt__body with-padding', `coupon-style-${len <= 2 ? len : 3}`)}>
        {
          data.map((item, index) => (
            <View className={classNames('wgt-coupon-item', {
              'has-img': item.imgUrl
            })} style={styleNames(getCouponStyle(item))} onClick={handleClickItem.bind(this, item)}>
              {
                !item.imgUrl && <View class="coupon-bd">
                  {
                    item.type == 'cash' && <View class="coupon-amount">
                      <Text class="symbol">¥</Text>
                      <Text class="value">{item.amount / 100}</Text>
                    </View>
                  }
                  {
                    item.type == 'discount' && <View class="coupon-amount">
                      <Text class="value">{item.amount}</Text>
                      <Text class="symbol">折</Text>
                    </View>
                  }
                  {
                    item.type == 'new_gift' && <View class="coupon-amount">
                      <Text class="value">{item.amount / 100}</Text>
                      <Text class="symbol">元</Text>
                    </View>
                  }
                  <View class="coupon-desc">
                    <Text class="name">{item.title}</Text>
                    <Text class="desc">{item.desc}</Text>
                  </View>
                </View>
              }
              {
                !item.imgUrl && <View class="coupon-ft">
                  <View class="btn">领取</View>
                </View>
              }
            </View>
          ))
        }

        {
          voucher_package.map((item, index) => (
            <View className={classNames('wgt-coupon-item', {
              'has-img': item.imgUrl
            })} style={styleNames(getCouponStyle(item))} onClick={handleClickItemPkg.bind(this, item)}>
              {!item.imgUrl && <View class="coupon-bd">
                <View class="coupon-amount">
                  <Text class="package-value">券包</Text>
                </View>
                <View class="coupon-desc">
                  <Text class="name">{item.title}</Text>
                  <Text class="desc">{item.desc}</Text>
                </View>
              </View>
              }
              {!item.imgUrl && <View class="coupon-ft">
                <View class="btn">领取</View>
              </View>}
            </View>
          ))
        }


      </ScrollView>

      {/* 优惠券包 */}
      {
        visibleCouponPkg && (
          <SpCouponPackage
            info='template'
            onClose={() => {
              setState((draft) => {
                draft.visibleCouponPkg = false
              })
            }}
          />
        )
      }
    </View >
  )
}

WgtCoupon.options = {
  addGlobalClass: true
}

export default WgtCoupon
