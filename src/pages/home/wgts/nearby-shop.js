import Taro from '@tarojs/taro'
import { View, Text, ScrollView, Button, Image } from '@tarojs/components'
import React, { useEffect, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import { useAsyncCallback } from '@/hooks'
import doc from '@/doc'
import api from '@/api'
import { WgtsContext } from './wgts-context'
import { SpNoShop, SpImage, SpShopCoupon, SpPrice, SpGoodsItem, SpSkuSelect } from '@/components'
import { classNames, styleNames, isEmpty, entryLaunch, showToast, pickBy } from '@/utils'
import { AtActivityIndicator } from 'taro-ui'
import './nearby-shop.scss'

const initialState = {
  activeIndex: 0,
  shopList: [],
  scrollLeft: 0,
  listTypes: [],
  isFirstRender: true,
  indicator: true,
  noData: false,
  page: {
    page: 1,
    pageSize: 4
  },
  total_count: 0
}

function WgtNearbyShop(props) {
  const { info } = props
  if (!info) {
    return null
  }

  const [state, setState] = useAsyncCallback(initialState)
  const { activeIndex, shopList, listTypes, isFirstRender, page, total_count, indicator, noData } =
    state
  const { location, address } = useSelector((state) => state.user)

  const { base, seletedTags, productLabel } = info
  const MSpSkuSelect = React.memo(SpSkuSelect)
  const { onAddToCart } = useContext(WgtsContext)

  useEffect(() => {
    console.log('location:', location)
    listType()
    if (base.navigation_display == 'productLabels') {
      commodity(true)
    } else {
      init(activeIndex)
    }
    setState((v) => {
      v.isFirstRender = false
    })
  }, [])

  useEffect(() => {
    if (isFirstRender) return
    if (listTypes[activeIndex].types == 'productLabels') {
      commodity()
    } else {
      init(activeIndex)
    }
  }, [activeIndex, location, page])

  const listType = () => {
    let modifiedSelectedTags = []
    let modifiedProductLabel = []
    if (base.navigation_display == 'business') {
      //商家
      modifiedSelectedTags = seletedTags.map((obj) => ({ ...obj, types: 'business' }))
    } else if (base.navigation_display == 'productLabels') {
      //商品标签
      modifiedProductLabel = productLabel.map((obj) => ({ ...obj, types: 'productLabels' }))
    } else {
      modifiedSelectedTags = seletedTags.map((obj) => ({ ...obj, types: 'business' }))
      modifiedProductLabel = productLabel.map((obj) => ({ ...obj, types: 'productLabels' }))
    }
    setState((v) => {
      v.listTypes = [...modifiedSelectedTags, ...modifiedProductLabel]
    })
  }

  const storeData = async () => {
    let distributor_tag_id = seletedTags.map((obj) => obj.tag_id)
    let lat, lng, province, city, district
    if (location) {
      lat = location?.lat
      lng = location?.lng
      province = location?.province || address?.province
      city = location?.city || address?.city
      district = location?.district || address?.district
    }
    let params = {
      distributor_tag_id: distributor_tag_id.join(','),
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
    return list
  }

  const commodity = async (val) => {
    let res = await storeData()
    if (res.length) {
      let params = {
        ...page,
        approve_status: 'onsale,only_show',
        item_type: 'normal',
        is_point: 'false',
        distributor_id: res.map((item) => item.distributor_id).join(','),
        tag_id: val ? productLabel[0].tag_id : listTypes[activeIndex].tag_id
      }
      const { total_count, list } = await api.item.search(params)
      const n_list = pickBy(list, doc.goods.ITEM_LIST_GOODS)
      setState((v) => {
        v.shopList = [...v.shopList, ...n_list]
        v.total_count = total_count
        v.indicator = false
        v.noData = v.shopList.length > 0 ? false : true
      })
    } else {
      setState((v) => {
        v.shopList = []
        v.total_count = 0
        v.indicator = false
        v.noData = true
      })
    }
  }

  const init = async (idx) => {
    let lat, lng, province, city, district
    if (location) {
      lat = location?.lat
      lng = location?.lng
      province = location?.province || address?.province
      city = location?.city || address?.city
      district = location?.district || address?.district
    }
    let params = {
      distributor_tag_id: seletedTags[idx]?.tag_id,
      item_tag_id: productLabel.map((item) => item.tag_id),
      show_discount: 1,
      // 根据经纬度或地区查询
      type: location?.lat ? 0 : 1,
      sort_type: 1,
      show_items: 1,
      show_score: 1,
      show_sales_count: 1
    }
    if (location) {
      params = {
        ...params,
        lat,
        lng,
        province,
        city,
        area: district
      }
    }
    const { list } = await api.shop.getNearbyShop(params)
    setState((v) => {
      v.shopList = list
      v.indicator = false
      v.noData = list.length > 0 ? false : true
      v.scrollLeft = 0 + Math.random() //  //在小程序端必须这么写才能回到初始值
    })
  }

  const showMore = () => {
    Taro.navigateTo({
      url: '/subpages/ecshopx/shop-list'
    })
  }

  const storeList = () => {
    return (
      shopList.length > 0 && (
        <View className='shop-list'>
          {shopList.slice(0, 2).map((item, index) => {
            return (
              <View key={index} className='shop-list-item'>
                <View className='shop-list-item-del'>
                  <SpImage
                    className='shop-logo'
                    src={item.logo || 'shop_default_logo.png'}
                    circle={16}
                    width={100}
                    height={100}
                    onClick={() => handleClickItem(item)}
                  />
                  <View className='shop-del'>
                    <View className='shop-names' onClick={() => handleClickItem(item)}>
                      <View className='name'>{item.name}</View>
                      {item?.selfDeliveryRule?.is_open && item?.is_self_delivery && (
                        <View className='deliver'>商家自配</View>
                      )}
                    </View>
                    <View className='score' onClick={() => handleClickItem(item)}>
                      <View className='sales'>
                        <Text className='monthly'>评分: {item?.scoreList.avg_star}</Text>
                        <Text>月销：{item.sales_count}</Text>
                      </View>
                      {item.distance_show && (
                        <View className='sales'>
                          {item.distance_show.split('.')[0]}
                          {item.distance_unit}
                        </View>
                      )}
                    </View>
                    {item?.selfDeliveryRule?.is_open && item?.is_self_delivery && (
                      <View className='freight'>
                        <Text>
                          起送¥{item.selfDeliveryRule.min_amount} ｜
                          {item.selfDeliveryRule.rule[0].selected == 'true'
                            ? item.selfDeliveryRule.rule[0].freight_fee == '0'
                              ? `满¥${item.selfDeliveryRule.rule[0].full}元免运费`
                              : `满¥${item.selfDeliveryRule.rule[0].full}元运费${item.selfDeliveryRule.rule[0].freight_fee}元`
                            : item.selfDeliveryRule.rule[1].freight_fee == '0'
                            ? `满¥${item.selfDeliveryRule.rule[1].full}元免运费`
                            : `满¥${item.selfDeliveryRule.rule[1].full}元运费${item.selfDeliveryRule.rule[1].freight_fee}元`}
                        </Text>
                        <Text class='freight-money'>¥{item.selfDeliveryRule.freight_fee}</Text>
                      </View>
                    )}
                    {base.show_coupon && (
                      <ScrollView scrollX className='coupon-list' scrollLeft={state.scrollLeft}>
                        {console.log(item.discountCardList, 'item.discountCardList1')}
                        {item.discountCardList.slice(0, 3).map((coupon, cindex) => {
                          return (
                            <SpShopCoupon
                              fromStoreIndex
                              className='coupon-index'
                              info={coupon}
                              key={`shop-coupon__${cindex}`}
                              // onClick={() => {
                              //   Taro.navigateTo({
                              //     url: `/subpages/marketing/coupon-center`
                              //   })
                              // }}
                            />
                          )
                        })}
                      </ScrollView>
                    )}
                  </View>
                </View>
                <View>
                  {item.itemList && (
                    <ScrollView scrollX>
                      <View className='coupon-commodity-all'>
                        <View className='coupon-commodity-nolist'></View>
                        {item.itemList.map((goods, gindex) => {
                          return (
                            <View
                              className='coupon-commodity-list'
                              key={gindex}
                              onClick={() => {
                                handleGoodsClick(goods)
                              }}
                            >
                              <Image
                                src={goods.pics || 'shop_default_logo.png'}
                                className='shop-logo'
                              ></Image>
                              <View className='coupon-commodity-title'>{goods.item_name}</View>
                              <SpPrice
                                className='market-price'
                                size={32}
                                value={goods.price / 100}
                              ></SpPrice>
                              {goods.market_price > 0 && goods.pric > goods.market_price && (
                                <View className='coupon-commodity-price'>
                                  ¥{goods.market_price / 100}
                                </View>
                              )}
                            </View>
                          )
                        })}
                      </View>
                    </ScrollView>
                  )}
                </View>
              </View>
            )
          })}

          <View
            className='ac_btn'
            onClick={() => {
              Taro.navigateTo({
                url: '/subpages/ecshopx/shop-list'
              })
            }}
          >
            <View className='more'>
              <Text className='iconfont icon-spiritling-dingwei'></Text>
              更多附近商家
            </View>
            <Text className='iconfont icon-qianwang-01'></Text>
          </View>
        </View>
      )
    )
  }

  const storeProducts = () => {
    return (
      <View className='store-products'>
        <View className='store-products-list'>
          {shopList.map((item, index) => {
            return (
              <View className='del' key={index}>
                <SpGoodsItem
                  showFav
                  showAddCart={base.addCart}
                  onStoreClick={handleClickStore}
                  onAddToCart={handleAddToCart}
                  info={{
                    ...item
                  }}
                />
              </View>
            )
          })}
        </View>
        {total_count - shopList.length > 0 && (
          <View className='ac_btn'>
            <View className='more' onClick={() => seeMore()}>
              查看更多
              <View className='in-icon in-icon-youjiantou'></View>
            </View>
          </View>
        )}
      </View>
    )
  }

  const handleClickStore = (item) => {
    const url = `/subpages/store/index?id=${item.distributor_info.distributor_id}`
    Taro.navigateTo({
      url
    })
  }

  const handleAddToCart = async ({ itemId, distributorId }) => {
    onAddToCart({ itemId, distributorId })
  }

  const handleClickItem = (item) => {
    Taro.navigateTo({ url: `/subpages/store/index?id=${item.distributor_id}` })
  }

  const handleGoodsClick = (item) => {
    const url = `/pages/item/espier-detail?id=${item.item_id}&dtid=${item.distributor_id}`
    Taro.navigateTo({
      url
    })
  }

  const seeMore = () => {
    setState((v) => {
      v.page = {
        page: v.page.page + 1,
        pageSize: 4
      }
    })
  }

  return (
    <View
      className={classNames('wgt wgt-nearby-shop', {
        wgt__padded: base.padded
      })}
    >
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

      <View className='nearby-shop-content'>
        {/* 头部滑动 */}
        <ScrollView className='scroll-tab' scrollX>
          {listTypes.map((item, index) => (
            <View
              className={classNames(`tag-item`, {
                'active': state.activeIndex == index
              })}
              key={item.tag_id}
              onClick={() =>
                setState((draft) => {
                  draft.activeIndex = index
                  draft.shopList = []
                  draft.total_count = 0
                  draft.indicator = true
                  draft.noData = false
                })
              }
            >
              {item.tag_name}
            </View>
          ))}
        </ScrollView>

        {listTypes.length && listTypes[activeIndex].types == 'business'
          ? storeList()
          : storeProducts()}

        {indicator && <AtActivityIndicator size={32} content='正在拼命加载数据...' />}

        {/* {noData && ( */}
        {base.show_nearby_merchants && (
          <View className='empty-con'>
            <SpImage src='empty_data.png' width={292} height={224} />
            <View className='empty-tip'>
              更多{listTypes.length && listTypes[activeIndex].types == 'business' ? '商家' : '商品'}
              接入中，敬请期待
            </View>
          </View>
        )}
      </View>
    </View>
  )
}

WgtNearbyShop.options = {
  addGlobalClass: true
}

export default WgtNearbyShop
