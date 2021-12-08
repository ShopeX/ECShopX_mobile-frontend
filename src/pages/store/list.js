import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Picker, Input, Image } from '@tarojs/components'
import { SpNavBar, Loading, SpPageNote } from '@/components'
import api from '@/api'
import { connect } from '@tarojs/redux'
import { withPager, withBackToTop } from '@/hocs'
import S from '@/spx'
import entry from '@/utils/entry'
import entryLaunchFun from '@/utils/entryLaunch'
import { classNames, getThemeStyle, styleNames } from '@/utils'
import CusStoreListItem from './comps/cus-list-item'
import CusNoPosition from './comps/cus-no-position'

import './list.scss'

@connect(
  ({ colors, address }) => ({
    colors: colors.current || { data: [{}] },
    address: address.current
  }),
  (dispatch) => ({
    onAddressChoose: (address) => dispatch({ type: 'address/choose', payload: address })
  })
)
@withPager
@withBackToTop
export default class StoreList extends Component {
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
      pageTitle: '选择门店'
    }
  }

  componentDidMount() {
    const { pageTitle } = this.state
    Taro.setNavigationBarTitle({
      title: pageTitle
    })
    Taro.setNavigationBarColor({
      backgroundColor: '#F5F5F5'
    })
    this.init()
    this.getHeadquarters()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.address !== this.props.address) {
      const { province, city, county, adrdetail } = nextProps.address
      let addressdetail = province + city + county + adrdetail
      this.setState({ deliveryInfo: {...nextProps.address, addressdetail} }, () => {
        this.init()
      })
    }
  }

  config = {
    navigationBarBackgroundColor: '#F5F5F5'
  }

  init = async () => {
    const { is_open_wechatapp_location } = Taro.getStorageSync('settingInfo')
    const { query, deliveryInfo } = this.state
    const lnglat = Taro.getStorageSync('lnglat') || {}

    // const address = `${lnglat.province}${(Array.isArray(lnglat.city) ? lnglat.city.length : lnglat.city) ? `${lnglat.city}` : ''}${lnglat.district}${lnglat.township}`
    // const address = lnglat.latitude ? `${lnglat.city}${lnglat.district}${lnglat.street}${lnglat.street_number}` : ''
    const addressdetail = lnglat.latitude ? lnglat.addressdetail : null
    query.province = lnglat.province || ''
    query.city = lnglat.city || ''
    query.area = lnglat.district || ''
    if (query.type === 2) {
      let adress_detail = !!this.props.address ? this.props.address : deliveryInfo
      const { province = '', city = '', county = '' } = adress_detail
      query.province = province
      query.city = (city === '市辖区' || !city) ? province : city
      query.area = county
    }

    this.setState({
      location: {
        ...lnglat,
        addressdetail
      },
      is_open_wechatapp_location,
      query
    },() => {
      this.resetPage(() => {
        this.setState({
          list: [],
          loading: true
        },
        () => {
          this.nextPage()
        })
      })
    })
  }

  // 获取总店信息
  getHeadquarters = async () => {
    const data = await api.shop.getDefaultShop()
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
    this.setState({
      query
    },
    () => {
      this.confirmSearch()
    })
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
    const { card_id = null } = this.$router.params
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
    const { province, city, county, adrdetail } = this.props.address || defualt_address
    let addressdetail = province + city + county + adrdetail
    this.setState({
      query,
      list: [...this.state.list, ...list],
      deliveryInfo: !!this.props.address ? {...this.props.address, addressdetail} : {...defualt_address, addressdetail},
      isRecommedList: is_recommend === 1,
      loading: false
    })
    return {
      total
    }
  }

  // 选择门店
  handleClickItem = (info) => {
    Taro.navigateTo({ url: `/pages/store/index?id=${info.distributor_id}` })
    // if (info) {
    //   info.store_id = 0 //新增非门店自提，开启distributor_id 取值为store_id
    // }
    // Taro.setStorageSync('curStore', info)
    // Taro.navigateBack()
  }

  // 获取定位信息
  getLocation = async (e) => {
    // if (this.state.loading) {
    //   return false
    // }
    // Taro.eventCenter.on('lnglat-success', () => {
      // })
    await entryLaunchFun.isOpenPosition(() => {
      const { query } = this.state
      query.name = ''
      query.type = 0
      this.setState({ query }, () => {
        this.init()
      })
    })
  }

  // 根据收货地址搜索
  onLocationChange = async (info) => {
    await entry.positiveAnalysisGaode(info)
    if (info) {
      info.store_id = 0 //新增非门店自提，开启distributor_id 取值为store_id
    }
    Taro.navigateBack()
    // Taro.setStorageSync('curStore', info)
    const { query } = this.state
    query.name = ''
    query.type = 2
    this.setState({ query }, () => {
      this.init()
    })
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

    if (query.type === 0 && location && !location.addressdetail && deliveryInfo && deliveryInfo.address_id) {
      const { province: p = "", city: c = "", county: ct = "" } = deliveryInfo;
      areaData = [p, c === "市辖区" || !c ? province : city, ct];
    }
    console.log(location, deliveryInfo, 'location--deliveryInfo')
    // const  = defaultStore.is_valid === "true";

    return (
      ((location && location.addressdetail) || (deliveryInfo && deliveryInfo.addressdetail))
      ? <View className='page-store-list' style={styleNames(getThemeStyle())}>
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
                placeholder='输入收货地址寻找周边门店'
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

          <View className="block-content">
            <View className="location">
              <View className="block-hd">当前定位地址</View>
              <View className='block-bd location-wrap'>
                {query.type !== 2 && location && location.addressdetail && (
                  <View className="lngName" onClick={this.onLocationChange.bind(this, location)} style={{ width: '77%', fontWeight: 'bold' }}>
                    {location.addressdetail || "无法获取您的位置信息"}
                  </View>
                )}
                <View
                  className="btn-location'"
                  onClick={this.getLocation.bind(this)}
                >
                  <View className="iconfont icon-zhongxindingwei iconcss"></View>
                  重新定位
                </View>
                {/* )} */}
              </View>
            </View>
            <View className="currentadress">
              <View className="block-hd flex-header">
                <View>我的收货地址</View>
                {deliveryInfo && deliveryInfo.address_id && <View className='arrow' onClick={() => Taro.navigateTo({ url: '/marketing/pages/member/address?isPicker=choose'})}>选择其他地址<View className='iconfont icon-qianwang-01'></View></View>}
              </View>
              {
                deliveryInfo && deliveryInfo.address_id &&
                <View className="block-bd" onClick={this.onLocationChange.bind(this, deliveryInfo)}>
                  <View className="lngName">
                    {deliveryInfo.province}
                    {deliveryInfo.city}
                    {deliveryInfo.county}
                    {deliveryInfo.adrdetail}
                  </View>
                </View>
              }
              {
                deliveryInfo && !deliveryInfo.address_id &&
                <View className='address-btn' onClick={() => Taro.navigateTo({ url: '/marketing/pages/member/edit-address' })}>添加新地址</View>
              }
            </View>
          </View>

            

          {isRecommedList && !deliveryInfo.address_id && !location.latitude && (
            <View className="block-content">
              <Image className="img" src={baseInfo.logo} mode="aspectFill" />
              <View className="tip">您想要地区的店铺暂时未入驻网上商城</View>
            </View>
          )}

          <View
            className={`list ${!deliveryInfo.address_id && 'noDelivery'} ${isRecommedList &&
              'recommedList'}`}
          >
            {!isRecommedList ? (
              <View className="title">
                {(deliveryInfo && deliveryInfo.address_id) || (location && location.latitude)
                  ? "附近商家"
                  : "全部商家"}
              </View>
            ) : (
              <View className="recommed">
                <View className="title">推荐商家</View>
              </View>
            )}

            <ScrollView
              className={classNames('scroll store-scroll', {
                'has-default-shop': defaultStore
              })}
              scrollY
              scrollTop={scrollTop}
              scrollWithAnimation
              onScroll={this.handleScroll.bind(this)}
              onScrollToLower={this.nextPage.bind(this)}
            >
              {list.map((item) => (
                <CusStoreListItem
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

          {/* {defaultStore && (
            <View className='bottom' onClick={this.handleClickItem.bind(this)}>
              <Image className='img' src={baseInfo.logo} mode='aspectFill' />
              {defaultStore.store_name}
              <View className='iconfont icon-arrowRight'></View>
            </View>
          )} */}
        </View>
      : <View className='page-store-list' style={styleNames(getThemeStyle())}>
        <CusNoPosition onClick={this.getLocation}>
          <Image className='position-imgs' src={`${process.env.APP_IMAGE_CDN}/no-position-img.png`}></Image>
        </CusNoPosition>
      </View>
    )
  }
}
