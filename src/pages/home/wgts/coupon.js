import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, Text } from '@tarojs/components'
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
  useEffect(() => {}, [])

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

  const len = data.length + voucher_package.length

  const renderCouponCell1 = () => {
    return (
      <View className='coupon-wrap coupon-1'>
        {data.map((item, index) => {
          if (item.imgUrl) {
            return (
              <SpImage
                className='coupon-image'
                src={item.imgUrl}
                width={714}
                onClick={handleClickItem.bind(this, item)}
              />
            )
          } else {
            return (
              <View
                className='coupon-item'
                style={styleNames({
                  'background-image': `url(${process.env.APP_IMAGE_CDN}/coupon_one.png)`
                })}
                key={`coupon-item__${index}`}
              >
                <View className='coupon-hd'>
                  {item.type == 'cash' && (
                    <View className='amount'>
                      <Text className='symbol'>¥</Text>
                      <Text className='value'>{item.amount}</Text>
                    </View>
                  )}
                  {item.type == 'discount' && (
                    <View className='amount'>
                      <Text className='value'>{item.amount}</Text>
                      <Text className='symbol'>折</Text>
                    </View>
                  )}
                  <View className='desc'>{item.desc}</View>
                </View>
                <View className='coupon-ft'>
                  <View className='title'>{item.title}</View>
                  <View className='name' onClick={handleClickItem.bind(this, item)}>
                    领取
                    {/* {
                  {
                    'discount': '折扣券',
                    'cash': '优惠券'
                  }[item.type]
                } */}
                  </View>
                </View>
              </View>
            )
          }
        })}
        {voucher_package.map((item, index) => {
          if (item.imgUrl) {
            return (
              <SpImage
                className='coupon-image'
                src={item.imgUrl}
                width={714}
                onClick={handleClickItemPkg.bind(this, item)}
              />
            )
          } else {
            return (
              <View
                className='coupon-item coupon-package'
                style={styleNames({
                  'background-image': `url(${process.env.APP_IMAGE_CDN}/coupon_one.png)`
                })}
                key={`coupon-package-item__${index}`}
              >
                <View className='coupon-hd'>
                  <View className='amount'>券包</View>
                  <View className='desc'>{item.package_describe}</View>
                </View>
                <View className='coupon-ft'>
                  <View className='title'>{item.title}</View>
                  <View className='name' onClick={handleClickItemPkg.bind(this, item)}>
                    领取
                  </View>
                </View>
              </View>
            )
          }
        })}
      </View>
    )
  }

  const renderCouponCell2 = () => {
    let backgroundImg = 'coupon_two.png'
    if (len == 3) {
      backgroundImg = 'coupon_three.png'
    } else if (len >= 4) {
      backgroundImg = 'coupon_four.png'
    }
    return (
      <View className={classNames('coupon-wrap', `coupon-${len > 4 ? 4 : len}`)}>
        {data.map((item, index) => {
          if (item.imgUrl) {
            return (
              <SpImage
                className='coupon-image'
                src={item.imgUrl}
                width={714}
                onClick={handleClickItem.bind(this, item)}
              />
            )
          } else {
            return (
              <View
                className='coupon-item'
                style={styleNames({
                  'background-image': `url(${process.env.APP_IMAGE_CDN}/${backgroundImg})`
                })}
                key={`coupon-item__${index}`}
              >
                <View className='coupon-hd'>
                  {item.type == 'cash' && (
                    <View className='amount'>
                      <Text className='symbol'>¥</Text>
                      <Text className='value'>{item.amount}</Text>
                    </View>
                  )}
                  {item.type == 'discount' && (
                    <View className='amount'>
                      <Text className='value'>{item.amount}</Text>
                      <Text className='symbol'>折</Text>
                    </View>
                  )}
                </View>
                <View className='coupon-ft'>
                  <View className='title'>{item.title}</View>
                  <View className='name' onClick={handleClickItem.bind(this, item)}>
                    领取
                    {/* {
                      {
                        'discount': '折扣券',
                        'cash': '优惠券'
                      }[item.type]
                    } */}
                  </View>
                </View>
              </View>
            )
          }
        })}
        {voucher_package.map((item, index) => {
          if (item.imgUrl) {
            return (
              <SpImage
                className='coupon-image'
                src={item.imgUrl}
                width={714}
                onClick={handleClickItemPkg.bind(this, item)}
              />
            )
          } else {
            return (
              <View
                className='coupon-item coupon-package'
                style={styleNames({
                  'background-image': `url(${process.env.APP_IMAGE_CDN}/${backgroundImg})`
                })}
                key={`coupon-package-item__${index}`}
              >
                <View className='coupon-hd'>
                  <View className='amount'>券包</View>
                </View>
                <View className='coupon-ft'>
                  <View className='title'>{item.title}</View>
                  <View className='name' onClick={handleClickItemPkg.bind(this, item)}>
                    领取
                  </View>
                </View>
              </View>
            )
          }
        })}
      </View>
    )
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
      <View className='wgt__body with-padding'>
        {len == 1 && renderCouponCell1()}
        {len >= 2 && renderCouponCell2()}
      </View>

      {/* 优惠券包 */}
      {visibleCouponPkg && (
        <SpCouponPackage
          info='template'
          onClose={() => {
            setState((draft) => {
              draft.visibleCouponPkg = false
            })
          }}
        />
      )}
    </View>
  )
}

WgtCoupon.options = {
  addGlobalClass: true
}

export default WgtCoupon
