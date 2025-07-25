import React, { useEffect, useRef } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { classNames, pickBy, isWeb, isString } from '@/utils'
import { useImmer } from 'use-immer'
import api from '@/api'
import doc from '@/doc'
import recommendation from '@/assets/imgs/recommendation.png'
import { SpScrollView, SpPrice, SpImage, SpShopCoupon, SpGoodsItem } from '@/components'

import './comp-navigation-classification.scss'

/**
 * navList  记录一级分类点击事件
 * navSecon 记录二级分类点击事件
 * list   商家和商品数据
 * activeIndex   记录商家中店铺的点击事件
 * statusIndex   判断展示店铺还是商品
 * mainCategory  记录点击的分类id
 */

const initialState = {
  navList: 0,
  navSecon: 0,
  list: [],
  activeIndex: 0,
  statusIndex: true,
  mainCategory: ''
}

function ConpNavigationClassification(props) {
  const [state, setState] = useImmer(initialState)
  const { navList, navSecon, list, activeIndex, statusIndex, mainCategory } = state
  const { seletedTags, classifyList, onAddToCart = () => {} } = props
  //拿到定位
  const { location, address } = useSelector((state) => state.user)
  // const { onAddToCart } = useContext(WgtsContext)
  const goodsRef = useRef()

  // 获取商家或商品信息
  useEffect(() => {
    if (statusIndex) {
      goodsRef.current.reset()
    }
  }, [activeIndex, mainCategory])

  // 定位后从新获取商品信息
  useEffect(() => {
    if (location) {
      setState((draft) => {
        draft.list = []
      })
      goodsRef.current.reset()
    }
  }, [location])

  /**
   * @param {*} val 判断一级二级点击事件
   * @param {*} index 点击的位置
   * @param {*} item 点击的数据
   */
  const setNav = (val, index, item) => {
    if (val) {
      setState((draft) => {
        draft.navList = index
        draft.navSecon = 0
      })
    } else {
      setState((draft) => {
        draft.navSecon = index
      })
    }
    setState((draft) => {
      draft.list = []
      draft.mainCategory = item?.category_id
      draft.statusIndex = item.category_name == '推荐店铺' ? true : false
    })
    goodsRef.current.reset()
  }

  /**
   * 获得所有商家列表
   * @returns
   */
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
      page: 1,
      pageSize: 100,
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
        province,
        city,
        area: district
      }
    }
    const { list } = await api.shop.getNearbyShop(params)
    return list
  }

  /**
   * 获取商家和商品信息
   * if为true则请求商家接口  false请求商品接口
   *
   * @param {*} param0
   * @returns
   */
  const fetch = async ({ pageIndex, pageSize }) => {
    if (classifyList.children[0]?.category_ids == 0 && statusIndex) {
      //存在推荐走商家接口
      // let distributor_tag_id = seletedTags.map((obj) => obj.tag_id)
      let lat, lng, province, city, district
      if (location) {
        lat = location?.lat
        lng = location?.lng
        province = location?.province || address?.province
        city = location?.city || address?.city
        district = location?.district || address?.district
      }
      let params = {
        page: pageIndex,
        pageSize,
        // distributor_tag_id: distributor_tag_id.join(','),
        distributor_tag_id: seletedTags[activeIndex]?.tag_id,
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
      const { list: lists, total_count } = await api.shop.getNearbyShop(params)
      setState((draft) => {
        draft.list = [...list, ...lists]
      })
      return { total: total_count }
    } else {
      //获取所有的商家 存在商家请求商品数据
      let res = await storeData()
      if (res.length > 0) {
        let _params = {
          page: pageIndex,
          pageSize,
          approve_status: 'onsale,only_show',
          item_type: 'normal',
          is_point: 'false',
          distributor_id: res.map((item) => item.distributor_id).join(','),
          main_category: mainCategory ? mainCategory : classifyList.children[0].category_id
        }
        const { total_count, list: lists } = await api.item.search(_params)
        const n_list = pickBy(lists, doc.goods.ITEM_LIST_GOODS)
        setState((draft) => {
          draft.list = [...list, ...n_list]
        })
        return { total: total_count }
      } else {
        setState((draft) => {
          draft.list = []
        })
        return { total: 0 }
      }
    }
  }

  /**
   * 去店铺首页
   * @param {*} item
   */
  const handleClickItem = (item) => {
    Taro.navigateTo({ url: `/subpages/store/index?id=${item.distributor_id}` })
  }

  /**
   * 去商品详情页
   * @param {*} item
   */
  const handleGoodsClick = (item) => {
    const url = `/pages/item/espier-detail?id=${item.item_id}&dtid=${item.distributor_id}`
    Taro.navigateTo({
      url
    })
  }

  const handleClickStore = (item) => {
    const url = `/subpages/store/index?id=${item.distributor_info.distributor_id}`
    Taro.navigateTo({
      url
    })
  }

  /**
   * 加购 子传父
   */
  const handleAddToCart = async ({ itemId, distributorId }) => {
    onAddToCart({ itemId, distributorId })
  }

  /**
   * 商品列表ui
   * @returns
   */
  const storeProducts = () => {
    return (
      <View className='store-products'>
        <View className='store-products-list'>
          {list.map((item, index) => {
            return (
              <View className='del' key={index}>
                <SpGoodsItem
                  showFav
                  showAddCart
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
        {/* {total_count - shopList.length > 0 && (
          <View className='ac_btn'>
            <View className='more' onClick={() => seeMore()}>
              查看更多
              <View className='in-icon in-icon-youjiantou'></View>
            </View>
          </View>
        )} */}
      </View>
    )
  }

  /**
   * 商家ui
   * @returns
   */
  const storeList = () => {
    return (
      classifyList.children[0]?.category_ids == 0 &&
      statusIndex && (
        <View className='shop-list'>
          <View className='shop-list-title'>附近商家</View>
          {/* 头部滑动 */}
          {seletedTags.length > 0 && (
            <ScrollView className='scroll-tab' scrollX>
              {seletedTags.map((item, index) => (
                <View
                  className={classNames(`tag-item`, {
                    'active': activeIndex == index
                  })}
                  key={item.tag_id}
                  onClick={() =>
                    setState((draft) => {
                      draft.activeIndex = index
                      draft.list = []
                    })
                  }
                >
                  {item.tag_name}
                </View>
              ))}
            </ScrollView>
          )}

          {list.length > 0 &&
            list.map((item, index) => {
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
                        {/* <View className='deliver'>商家自配</View> */}
                      </View>
                      <View className='score' onClick={() => handleClickItem(item)}>
                        <View className='sales'>
                          <Text className='monthly'>评分: {item?.scoreList?.avg_star}</Text>
                          <Text>月销：{item.sales_count}</Text>
                        </View>

                        {item.distance_show &&
                          typeof item.distance_show ==
                            'string'(
                              <View className='sales'>
                                {isString(item.distance_show)
                                  ? item.distance_show.split('.')[0]
                                  : ''}
                                {item.distance_unit}
                              </View>
                            )}
                      </View>
                      <ScrollView scrollX className='coupon-list' scrollLeft={state.scrollLeft}>
                        {item.discountCardList.map((coupon, cindex) => {
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
                    </View>
                  </View>
                  <View>
                    {item.itemList && (
                      <ScrollView scrollX>
                        <View className='coupon-commodity-all'>
                          {/* <View className='coupon-commodity-nolist'></View> */}
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

          {/* <View
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
          </View> */}
        </View>
      )
    )
  }

  return (
    <View className='navigation-classification'>
      {/* 一级分类 */}
      <ScrollView scrollX className='first-level-scroll' style={{ top: isWeb ? '46px' : '0px' }}>
        <View className='first-level'>
          {classifyList.children.map((item, index) => {
            return (
              <View
                key={index}
                className='first-level-item'
                onClick={() => {
                  setNav(true, index, item)
                }}
              >
                <View
                  className={classNames(
                    'first-level-item-img',
                    navList == index ? 'first-level-item-img-index' : null
                  )}
                >
                  {item.image_url ? (
                    <Image
                      src={item?.category_ids == 0 ? recommendation : item.image_url}
                      className='first-level-item-image-url'
                    />
                  ) : (
                    <View className='first-level-item-img-text'> {item.category_name}</View>
                  )}
                </View>
                <View
                  className={classNames(
                    'first-level-item-recommendation',
                    navList == index ? 'first-level-item-recommendation-index' : null
                  )}
                >
                  <View className='first-level-item-recommendation-name'>{item.category_name}</View>
                </View>
              </View>
            )
          })}
        </View>
      </ScrollView>
      {/* 二级分类 */}
      {classifyList.children[navList]?.children && (
        <View className='secondary-classification'>
          {classifyList.children[navList].children.map((item, index) => {
            return (
              <View
                key={index}
                className={classNames(
                  'secondary-classification-name',
                  navSecon == index ? 'secondary-classification-name-index' : null
                )}
                onClick={() => {
                  setNav(false, index, item)
                }}
              >
                {item.category_name}
              </View>
            )
          })}
        </View>
      )}

      <SpScrollView
        className='navigation-classification-scroll'
        auto={false}
        ref={goodsRef}
        fetch={fetch}
      >
        {/* 商家storeList   商品storeProducts */}
        {classifyList.children[0]?.category_ids == 0 && statusIndex ? storeList() : storeProducts()}
      </SpScrollView>
    </View>
  )
}

ConpNavigationClassification.options = {
  addGlobalClass: true
}

export default ConpNavigationClassification
