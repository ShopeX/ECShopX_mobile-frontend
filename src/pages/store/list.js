import React, { Component } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, ScrollView, Picker, Input, Image } from '@tarojs/components'
import { SpNavBar, Loading, SpPageNote } from '@/components'
import api from '@/api'
import { connect } from 'react-redux'
import { withPager, withBackToTop } from '@/hocs'
import S from '@/spx'
import entry from '@/utils/entry'
import StoreListItem from './comps/list-item'
import { classNames, getThemeStyle, styleNames } from '@/utils'

import './list.scss'

@connect(({ colors }) => ({
  colors: colors.current || { data: [{}] }
}))
@withPager
@withBackToTop
export default class StoreList extends Component {
  $instance = getCurrentInstance();
  constructor(props) {
    super(props)

    this.state = {
      ...this.state,
      query: {
        name: '',
        province: '',
        city: '',
        area: '',
        lat: '',
        lng: '',
        type: 0
      },
      // 总店信息
      headquarters: {},
      // 默认店铺
      defaultStore: null,
      baseInfo: null,
      // 当前位置
      formattedAddress: '',
      // 收货地址信息
      deliveryInfo: {},
      // 是否是推荐门店列表
      isRecommedList: false,
      // 门店列表
      list: [],
      // 是否需要定位
      is_open_wechatapp_location: 0,
      loading: false,
      pageTitle: '店铺列表'
    }
  }

  componentDidMount() {
    const { pageTitle } = this.state
    Taro.setNavigationBarTitle({
      title: pageTitle
    })
    this.init()
    this.getHeadquarters()
  }

  // config = {
  //   navigationBarTitleText: '店铺列表'
  // }

  init = async () => {
    const { is_open_wechatapp_location } = Taro.getStorageSync('settingInfo')

    const { formattedAddress } = Taro.getStorageSync('locationAddress')
    let addressList
    if (S.getAuthToken()) {
      addressList = await api.member.addressList()
    }
    this.setState(
      {
        location: {
          ...lnglat,
          address
        },
        is_open_wechatapp_location,
        query
      },
      () => {
        this.resetPage(() => {
          this.setState(
            {
              list: [],
              loading: true
            },
            () => {
              this.nextPage()
            }
          )
        })
      }
    )
  }

  // 获取总店信息
  getHeadquarters = async () => {
    const data = await api.shop.getHeadquarters()
    const baseInfo = await api.shop.getStoreBaseInfo()
    this.setState({
      defaultStore: data,
      baseInfo
    })
  }

  // 省市区选择器
  regionChange = (region) => {
    const { value } = region.detail
    const { query } = this.state
    query.province = value[0]
    query.city = value[1]
    query.area = value[2]
    query.type = 1
    this.setState(
      {
        query
      },
      () => {
        this.confirmSearch()
      }
    )
  }

  // 搜索店铺名称
  inputStoreName = (e) => {
    const { detail } = e
    const { query } = this.state
    this.setState({
      query: {
        ...query,
        name: detail.value
      }
    })
  }

  clearName = () => {
    const { query } = this.state
    this.setState(
      {
        query: {
          ...query,
          name: ''
        }
      },
      () => {
        this.confirmSearch()
      }
    )
  }

  // 确认搜索
  confirmSearch = () => {
    this.resetPage(() => {
      this.setState(
        {
          list: []
        },
        () => {
          this.nextPage()
        }
      )
    })
  }

  async fetch(params) {
    const { card_id = null } = this.$instance.router.params
    const { query: searchParam, location } = this.state
    const { latitude = '', longitude = '' } = location
    const { page_no: page, page_size: pageSize } = params
    const query = {
      ...searchParam,
      page,
      pageSize,
      lat: latitude,
      lng: longitude,
      card_id
    }
    const { list, total_count: total, defualt_address = {}, is_recommend } = await api.shop.list(
      query
    )
    this.setState({
      query,
      list: [...this.state.list, ...list],
      deliveryInfo: defualt_address,
      isRecommedList: is_recommend === 1,
      loading: false
    })
    return {
      total
    }
  }

  // 选择门店
  handleClickItem = (info) => {
    if (info) {
      info.store_id = 0 //新增非门店自提，开启distributor_id 取值为store_id
    }
    Taro.setStorageSync('curStore', info)
    Taro.navigateBack()
  }

  // 获取定位信息
  getLocation = async (e) => {
    if (this.state.loading) {
      return false
    }
    e.stopPropagation()
    const { authSetting } = await Taro.getSetting()
    if (!authSetting['scope.userLocation']) {
      Taro.authorize({
        scope: 'scope.userLocation',
        success: () => {
          this.init()
        },
        fail: () => {
          Taro.showModal({
            title: '提示',
            content: '请打开定位权限',
            success: async (resConfirm) => {
              if (resConfirm.confirm) {
                await Taro.openSetting()
                const setting = await Taro.getSetting()
                if (setting.authSetting['scope.userLocation']) {
                  this.init()
                } else {
                  Taro.showToast({ title: '获取定位权限失败', icon: 'none' })
                }
              }
            }
          })
        }
      })
    } else {
      const { query } = this.state
      query.name = ''
      query.type = 0
      this.setState(
        {
          query
        },
        () => {
          this.init()
        }
      )
    }
  }

  // 根据收货地址搜索
  getDeliver = () => {
    const { query } = this.state
    query.name = ''
    query.type = 2
    this.setState(
      {
        query
      },
      () => {
        this.init()
      }
    )
  }

  render() {
    const {
      scrollTop,
      query,
      list,
      location,
      isRecommedList,
      deliveryInfo,
      page,
      defaultStore,
      baseInfo,
      is_open_wechatapp_location,
      pageTitle,
      formattedAddress
    } = this.state
    const { province, city, area } = query

    let areaData = [province, city, area]

    // if (query.type === 0 && !location.address && deliveryInfo.address_id) {
    //   const { province: p = "", city: c = "", county: ct = "" } = deliveryInfo;
    //   areaData = [p, c === "市辖区" || !c ? province : city, ct];
    // }

    // const  = defaultStore.is_valid === "true";

    return (
      <View className='page-store-list' style={styleNames(getThemeStyle())}>
        <SpNavBar title={pageTitle} leftIconType='chevron-left' />
        <View className='search-block'>
          <View className='main'>
            <Picker mode='region' value={areaData} onChange={this.regionChange.bind(this)}>
              <View className='filterArea'>
                <View className='areaName'>{areaData.join('') || '筛选地区'}</View>
                <View className='iconfont icon-arrowDown'></View>
              </View>
            </Picker>

            <Input
              className='searchInput'
              placeholder='请输入想搜索的店铺'
              confirmType='search'
              value={query.name}
              onInput={this.inputStoreName.bind(this)}
              onConfirm={this.confirmSearch.bind(this)}
            />
            {query.name && query.name.length > 0 && (
              <View className='iconfont icon-close' onClick={this.clearName.bind(this)}></View>
            )}
          </View>
        </View>

        <View className='block-content'>
          <View className='block-hd'>当前位置</View>
          <View className='block-bd location-wrap'>
            <View className='location-address'>{formattedAddress}</View>
            <View className='btn-location'>
              <Text className='iconfont icon-target'></Text>
              重新定位
            </View>
          </View>
        </View>

        <View className='block-content'>
          <View className='block-hd'>按收货地址定位</View>
          <View className='block-bd'>
            <View className='receive-address'></View>
          </View>
        </View>

        <View className='block-content'>
          <View className='block-hd'>附近门店</View>
          <View className='block-bd'></View>
        </View>

        {/* <View className="content">
          <View className="location">
            <View className="title">当前位置</View>
            <View className="locationData">
              {query.type !== 2 && location.address && (
                <View className="lngName">
                  {location.address || "无法获取您的位置信息"}
                </View>
              )}
              {(query.type === 2 ||
                (!location.address && deliveryInfo.address_id)) && (
                <View className="lngName">
                  {deliveryInfo.province}
                  {deliveryInfo.city}
                  {deliveryInfo.county}
                  {deliveryInfo.adrdetail}
                </View>
              )}

              {is_open_wechatapp_location === 1 && (
                <View
                  className="resetLocal"
                  onClick={this.getLocationInfo.bind(this)}
                >
                  <View className="iconfont icon-target"></View>
                  重新定位
                </View>
              )}
            </View>
          </View>

          {deliveryInfo.address_id && (
            <View className="delivery" onClick={this.getDeliver.bind(this)}>
              <View className="title">按收货地址定位</View>
              <View className="locationData">
                <View className="lngName">
                  {deliveryInfo.province}
                  {deliveryInfo.city}
                  {deliveryInfo.county}
                  {deliveryInfo.adrdetail}
                </View>
              </View>
            </View>
          )}
        </View>

        {isRecommedList && !deliveryInfo.address_id && !location.latitude && (
          <View className="noContent">
            <Image className="img" src={baseInfo.logo} mode="aspectFill" />
            <View className="tip">您想要地区的店铺暂时未入驻网上商城</View>
          </View>
        )} */}

        <View
          className={`list ${!deliveryInfo.address_id && 'noDelivery'} ${isRecommedList &&
            'recommedList'}`}
        >
          {/* {!isRecommedList ? (
            <View className="title">
              {deliveryInfo.address_id || location.latitude
                ? "附近门店"
                : "全部门店"}
            </View>
          ) : (
            <View className="recommed">
              <View className="title">推荐门店</View>
            </View>
          )} */}

          <ScrollView
            className={classNames('scroll', {
              'has-default-shop': defaultStore
            })}
            scrollY
            scrollTop={scrollTop}
            scrollWithAnimation
            onScroll={this.handleScroll.bind(this)}
            onScrollToLower={this.nextPage.bind(this)}
          >
            {list.map((item) => (
              <StoreListItem
                info={item}
                key={item.distributor_id}
                onClick={this.handleClickItem.bind(this, item)}
              />
            ))}
            {/* {page.isLoading ? <Loading>正在加载...</Loading> : null}
            {!page.isLoading && !list.length && (
              <SpNote img="trades_empty.png">暂无数据~</SpNote>
            )} */}
            <SpPageNote info={page}></SpPageNote>
          </ScrollView>
        </View>

        {defaultStore && (
          <View className='bottom' onClick={this.handleClickItem.bind(this)}>
            <Image className='img' src={baseInfo.logo} mode='aspectFill' />
            {defaultStore.store_name}
            <View className='iconfont icon-arrowRight'></View>
          </View>
        )}
      </View>
    )
  }
}
