import Taro from '@tarojs/taro'
import { View, Text, ScrollView, Button } from '@tarojs/components'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import { useAsyncCallback } from '@/hooks'
import api from '@/api'
import { SpNoShop, SpImage } from '@/components'
import { classNames, isEmpty } from '@/utils'
import './nearby-shop.scss'

const initialState = {
  activeIndex: 0,
  shopList: [],
  scrollLeft: 0
}

function WgtNearbyShop(props) {
  const { info } = props
  if (!info) {
    return null
  }

  const [state, setState] = useAsyncCallback(initialState)
  const { activeIndex } = state
  const { location } = useSelector((state) => state.user)

  const { base, seletedTags } = info

  // useEffect(() => {
  //   console.log(state.activeIndex, location)
  //   init()
  // }, [state.activeIndex])

  useEffect(() => {
    console.log('location:', location)
    init(activeIndex)
  }, [location])

  const init = async (idx) => {
    let lat, lng, province, city, district
    if (location) {
      lat = location?.lat
      lng = location?.lng
      province = location?.province || '北京市'
      city = location?.city || '北京市'
      district = location?.district || '昌平区'
    }
    let params = {
      distributor_tag_id: seletedTags[idx]?.tag_id,
      show_discount: 1,
      // 根据经纬度或地区查询
      type: location?.lat ? 0 : 1,
      sort_type: 1
    }
    if (location) {
      params = {
        ...params,
        lat,
        lng,
        province: province,
        city: city,
        area: district
      }
    }
    const { list } = await api.shop.getNearbyShop(params)
    setState((v) => {
      v.shopList = list
      v.scrollLeft = 0 + Math.random() //  //在小程序端必须这么写才能回到初始值
    })
  }

  const showMore = () => {
    Taro.navigateTo({
      url: '/subpages/ecshopx/shop-list'
    })
  }

  const handleStoreClick = (id) => {
    const url = `/subpages/store/index?id=${id}`
    Taro.navigateTo({
      url
    })
  }

  return (
    <View
      className={classNames('wgt', {
        wgt__padded: base.padded
      })}
    >
      <View className='wgt-nearbyshop'>
        {base.title && (
          <View className='wgt-head'>
            <View className='wgt-hd'>
              <Text className='wgt-title'>{base.title}</Text>
              <Text className='wgt-subtitle'>{base.subtitle}</Text>
            </View>
            <View className='wgt-more' onClick={showMore}>
              <View className='three-dot'></View>
            </View>
            {/* <Text className='more' onClick={showMore}>
              查看更多
            </Text> */}
          </View>
        )}

        <View className='nearby_shop_wrap'>
          <ScrollView className='scroll-tab' scrollX>
            {seletedTags.map((item, index) => (
              <View
                className={classNames(`tag`, {
                  active: state.activeIndex == index
                })}
                key={item.tag_id}
                onClick={() =>
                  setState(
                    (draft) => {
                      draft.activeIndex = index
                    },
                    ({ activeIndex }) => {
                      init(activeIndex)
                    }
                  )
                }
              >
                {item.tag_name}
              </View>
            ))}
          </ScrollView>

          <ScrollView className='scroll-list' scrollX scrollLeft={state.scrollLeft}>
            {state.shopList.map((item) => (
              <View
                className='shop'
                key={item.distributor_id}
                onClick={() => handleStoreClick(item.distributor_id)}
              >
                <View className='shop-image'>
                  <SpImage
                    src={item.banner || 'shop_default_bg.png'}
                    mode="aspectFill"
                    width={200}
                    height={130}
                  />
                </View>
                <View className='shop-logo'>
                  <SpImage src={item.logo || 'shop_default_logo.png'} mode='scaleToFill' />
                </View>
                <View className='shop-info-block'>
                  <View className='shop-name'>{item.name}</View>

                  <View className='shop-ft'>
                    {item.discountCardList.length > 0 && (
                      <View className='sp-nearby-shop-coupon'>
                        <View className='coupon-wrap'>
                          <Text className='coupon-text'>{item.discountCardList[0].title}</Text>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))}

            {state.shopList.length == 0 && (
              <View className='empty-con'>
                <SpImage className='empty-img' src='empty_data.png' />
                <View className='empty-tip'>更多商家接入中，敬请期待</View>
              </View>
            )}
          </ScrollView>
          {/* <View className='no_shop_content'>
            <Image mode='widthFix' className='no_shop_img' src={`${process.env.APP_IMAGE_CDN}/empty_data.png`}></Image>
            <View className='tips'>更多商家接入中，敬请期待</View>
          </View> */}
        </View>
      </View>
    </View>
  )
}

WgtNearbyShop.options = {
  addGlobalClass: true
}

export default WgtNearbyShop
