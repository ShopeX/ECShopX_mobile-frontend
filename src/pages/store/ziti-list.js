import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Text, Picker } from '@tarojs/components'
import { SpToast, SearchBar, BackToTop, SpNavBar, SpCheckbox, SpNote } from '@/components'
import api from '@/api'
import { withPager, withBackToTop } from '@/hocs'
import entry from '@/utils/entry'
import StoreListItem from './comps/list-item'
import { pickBy } from '@/utils'
import { connect } from '@tarojs/redux'

import './ziti-list.scss'
import { de } from 'date-fns/locale'

@connect(
  ({ cart }) => ({
    curZitiShop: cart.zitiShop
  }),
  (dispatch) => ({
    onChangeZitiStore: (zitiShop) => dispatch({ type: 'cart/changeZitiStore', payload: zitiShop })
  })
)
@withPager
@withBackToTop
export default class StoreZitiList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ...this.state,
      list: [],
      query: null,
      current: null,
      loading: false,
      is_open_store_status: false,
      multiIndex: [],
      areaList: [],
      info: {}
    }
  }
  config = {
    navigationBarTitleText: '选择自提门店'
  }

  componentDidMount() {
    const lnglat = Taro.getStorageSync('lnglat')
    const cityInfo = Taro.getStorageSync('selectShop')
    let query = {}
    // if (lnglat) {
    //   query = {
    //     lat: lnglat.latitude,
    //     lng: lnglat.longitude
    //   }
    // }
    if (cityInfo) {
      query = {
        lat: lnglat.latitude,
        lng: lnglat.longitude,
        province: cityInfo.province,
        city: cityInfo.city,
        area: cityInfo.area
      }
    }
    const store = Taro.getStorageSync('curStore')
    if (store) {
      this.setState(
        {
          query,
          current: cityInfo ? cityInfo : store
        },
        () => {
          this.nextPage()
        }
      )
    } else {
      this.handleGetLocation()
    }
  }
  async fetch(params) {
    const isOpenStore = await entry.getStoreStatus()
    const { page_no: page, page_size: pageSize } = params
    const { shop_id, order_type, cart_type, seckill_id, ticket, bargain_id } = this.$router.params
    const query = {
      ...this.state.query,
      page,
      pageSize,
      cart_type,
      order_type,
      seckill_id,
      seckill_ticket: ticket,
      isNostores: isOpenStore ? 1 : 0,
      bargain_id
    }

    const { list, total_count: total } = await api.shop.list(query)
    const nList = pickBy(list, {
      name: 'name',
      store_address: 'store_address',
      hour: 'hour',
      mobile: 'mobile',
      distributor_id: 'distributor_id',
      regions: 'regions',
      regions_id: 'regions_id',
      is_checked: 'is_checked',
      lat: 'lat',
      lng: 'lng',
      distributor_self: 'distributor_self',
      distance: 'distance',
      distance_show: 'distance_show',
      distance_unit: 'distance_unit',
      store_id: isOpenStore ? '' : 0
    })
    let res = await api.member.areaList()
    const nAreaList = pickBy(res, {
      label: 'label',
      children: 'children'
    })
    this.nAreaList = nAreaList
    let arrProvice = []
    let arrCity = []
    let arrCounty = []
    nAreaList.map((item, index) => {
      arrProvice.push(item.label)
      if (index === 0) {
        item.children.map((c_item, c_index) => {
          arrCity.push(c_item.label)
          if (c_index === 0) {
            c_item.children.map((cny_item) => {
              arrCounty.push(cny_item.label)
            })
          }
        })
      }
    })
    this.setState({
      list: [...this.state.list, ...nList],
      query,
      is_open_store_status: isOpenStore,
      areaList: [arrProvice, arrCity, arrCounty]
    })

    return {
      total
    }
  }

  handleSearchOn = () => {
    this.setState({
      isShowSearch: true
    })
  }

  handleSearchOff = () => {
    this.setState({
      isShowSearch: false
    })
  }

  handleSearchChange = (val) => {
    this.setState({
      query: {
        ...this.state.query,
        name: val
      }
    })
  }

  handleSearchClear = () => {
    this.setState(
      {
        isShowSearch: false,
        query: {
          ...this.state.query,
          name: ''
        }
      },
      () => {
        this.resetPage()
        this.setState(
          {
            list: []
          },
          () => {
            this.nextPage()
          }
        )
      }
    )
  }

  handleConfirm = (val) => {
    this.setState(
      {
        query: {
          ...this.state.query,
          name: val
        }
      },
      () => {
        this.resetPage()
        this.setState(
          {
            list: []
          },
          () => {
            this.nextPage()
          }
        )
      }
    )
  }

  handleGetLocation = async () => {
    this.setState({
      loading: true
    })
    Taro.removeStorageSync('lnglat')
    const store = await entry.getLocal(true)
    if (store) {
      this.resetPage()
      this.setState(
        {
          list: [],
          current: store,
          loading: false
        },
        () => {
          this.nextPage()
        }
      )
    } else {
      this.setState({
        current: null,
        loading: false
      })
    }
  }
  handleSelectStore = (item) => {
    const { list } = this.state
    list.map((v) => {
      ;(v.is_checked = false), v.distributor_id == item.distributor_id && (v.is_checked = true)
      return {
        ...v,
        is_checked: v.is_checked
      }
    })
    this.setState({
      list
    })
  }

  // handleClick = (val) => {
  //   Taro.setStorageSync('curStore', val)
  //   Taro.navigateBack()
  // }

  // 选定开户地区
  handleClickPicker = () => {
    console.log('handleClickPicker')
    let arrProvice = []
    let arrCity = []
    let arrCounty = []
    if (this.nAreaList) {
      this.nAreaList.map((item, index) => {
        arrProvice.push(item.label)
        if (index === 0) {
          item.children.map((c_item, c_index) => {
            arrCity.push(c_item.label)
            if (c_index === 0) {
              c_item.children.map((cny_item) => {
                arrCounty.push(cny_item.label)
              })
            }
          })
        }
      })
      this.setState({
        showDrawer: false,
        areaList: [arrProvice, arrCity, arrCounty],
        multiIndex: [0, 0, 0]
      })
    }
  }

  bindMultiPickerChange = async (e) => {
    const { info, query } = this.state
    this.nAreaList.map((item, index) => {
      if (index === e.detail.value[0]) {
        info.province = item.label
        item.children.map((s_item, sIndex) => {
          if (sIndex === e.detail.value[1]) {
            info.city = s_item.label
            s_item.children.map((th_item, thIndex) => {
              if (thIndex === e.detail.value[2]) {
                info.county = th_item.label
              }
            })
          }
        })
      }
    })
    const { province, city, county } = info
    // delete query.lat
    // delete query.lng
    this.setState(
      {
        query: {
          ...this.state.query,
          province,
          city,
          area: county
        }
      },
      () => {
        this.resetPage()
        this.setState(
          {
            list: []
          },
          () => {
            this.nextPage()
          }
        )
      }
    )
    this.setState({ info })
  }
  bindMultiPickerColumnChange = (e) => {
    const { areaList, multiIndex } = this.state
    if (e.detail.column === 0) {
      this.setState({
        multiIndex: [e.detail.value, 0, 0]
      })
      this.nAreaList.map((item, index) => {
        if (index === e.detail.value) {
          let arrCity = []
          let arrCounty = []
          item.children.map((c_item, c_index) => {
            arrCity.push(c_item.label)
            if (c_index === 0) {
              c_item.children.map((cny_item) => {
                arrCounty.push(cny_item.label)
              })
            }
          })
          areaList[1] = arrCity
          areaList[2] = arrCounty
          this.setState({ areaList })
        }
      })
    } else if (e.detail.column === 1) {
      multiIndex[1] = e.detail.value
      multiIndex[2] = 0
      this.setState(
        {
          multiIndex
        },
        () => {
          this.nAreaList[multiIndex[0]].children.map((c_item, c_index) => {
            if (c_index === e.detail.value) {
              let arrCounty = []
              c_item.children.map((cny_item) => {
                arrCounty.push(cny_item.label)
              })
              areaList[2] = arrCounty
              this.setState({ areaList })
            }
          })
        }
      )
    } else {
      multiIndex[2] = e.detail.value
      this.setState({
        multiIndex
      })
    }
  }

  handleChangeStore = () => {
    let { list, info } = this.state
    if (!list.length) return
    const selected = list.filter((v) => v.is_checked)
    if (!selected.length) {
      Taro.showToast({
        title: '请选择店铺～',
        icon: 'none'
      })
      return
    }
    this.props.onChangeZitiStore(selected[0])
    Taro.setStorageSync('selectShop', selected[0])
    setTimeout(() => {
      Taro.navigateBack()
    }, 300)
  }

  render() {
    const {
      list,
      scrollTop,
      showBackToTop,
      loading,
      current,
      query,
      is_open_store_status,
      areaList,
      multiIndex,
      page,
      info
    } = this.state
    return (
      <View className='page-store-list'>
        <SpNavBar title='选择自提门店' leftIconType='chevron-left' />
        {/* <View className='store-list__search'>
          <SearchBar
            showDailog={false}
            keyword={query ? query.name : ''}
            onFocus={this.handleSearchOn}
            onChange={this.handleSearchChange}
            onClear={this.handleSearchClear}
            onCancel={this.handleSearchOff}
            onConfirm={this.handleConfirm.bind(this)}
          />
        </View> */}
        <Picker
          mode='multiSelector'
          onClick={this.handleClickPicker}
          onChange={this.bindMultiPickerChange}
          onColumnChange={this.bindMultiPickerColumnChange}
          value={multiIndex}
          range={areaList}
        >
          <View className='current-store'>
            {/* <View className='label'>当前位置</View> */}
            <View className='content view-flex'>
              <View className='view-flex-item'>
                {loading ? (
                  <Text className='loading'>定位中...</Text>
                ) : (
                  <Text>
                    <Text className='icon-periscope'></Text>
                    {info && info.province ? (
                      <Text>
                        {info.province}
                        {info.city}
                        {info.county}
                      </Text>
                    ) : current ? (
                      <Text>
                        {' '}
                        {current.regions[0]}
                        {current.regions[1]}
                        {current.regions[2]}{' '}
                      </Text>
                    ) : (
                      '定位失败'
                    )}
                  </Text>
                )}
              </View>
              <View className='view-flex view-flex-middle'>
                <Text className='icon-arrowRight' />
              </View>
            </View>
          </View>
        </Picker>
        <ScrollView
          className='page-store-list__scroll'
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
        >
          <View className='store-list'>
            {list.map((item) => {
              return (
                <View className='store-item' key={item.distributor_id}>
                  <View className='store-content'>
                    <StoreListItem
                      info={item}
                      isStore={is_open_store_status}
                      key={item.distributor_id}
                      //onClick={this.handleClick.bind(this, item)}
                    />
                  </View>
                  <View>
                    <SpCheckbox
                      checked={item.is_checked}
                      onChange={this.handleSelectStore.bind(this, item)}
                    ></SpCheckbox>
                  </View>
                </View>
              )
            })}
            {list.length && (
              <View className='store-list_footer'>
                <View className='sure-button' onClick={this.handleChangeStore.bind(this)}>
                  确定
                </View>
              </View>
            )}
          </View>
          {page.isLoading ? <Loading>正在加载...</Loading> : null}
          {!page.isLoading && !page.hasNext && !list.length && (
            <SpNote img='trades_empty.png'>暂无数据~</SpNote>
          )}
        </ScrollView>

        <BackToTop show={showBackToTop} onClick={this.scrollBackToTop} />

        <SpToast />
      </View>
    )
  }
}
