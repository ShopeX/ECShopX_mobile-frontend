import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Text } from '@tarojs/components'
import { SpToast, SearchBar, BackToTop, NavBar } from '@/components'
import api from '@/api'
import { withPager, withBackToTop } from '@/hocs'
import entry from '@/utils/entry'
import StoreListItem from './comps/list-item'

import './list.scss'

@withPager
@withBackToTop
export default class StoreList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      list: [],
      query: null,
      current: null,
      loading: false
    }
  }

  componentDidMount () {
    const lnglat = Taro.getStorageSync('lnglat')
    let query = {}
    if (lnglat) {
      const { latitude, longitude } = lnglat
      query = {
        lat: lnglat.latitude,
        lng: lnglat.longitude
      }
    }
    const store = Taro.getStorageSync('curStore')
    if (store) {
      this.setState({
        current: store,
        query
      }, () => {
        this.nextPage()
      })
    }

  }

  config = {
    navigationBarTitleText: '店铺列表'
  }

  async fetch (params) {
    const { page_no: page, page_size: pageSize } = params
    const { selectParams, areaList, tagsList, curTagId } = this.state
    const query = {
      ...this.state.query,
      page,
      pageSize
    }
    const { list, total_count: total} = await api.shop.list(query)
    this.setState({
      list: [...this.state.list, ...list],
      query
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
    this.setState({
      isShowSearch: false,
      query: {
        ...this.state.query,
        name: ''
      }
    }, () =>{
      this.resetPage()
      this.setState({
        list: []
      }, () => {
        this.nextPage()
      })
    })
  }

  handleConfirm = (val) => {
    this.setState({
      query: {
        ...this.state.query,
        name: val,
      }
    }, () =>{
      this.resetPage()
      this.setState({
        list: []
      }, () => {
        this.nextPage()
      })
    })
  }

  handleGetLocation = async () => {
    this.setState({
      loading: true
    })
    Taro.removeStorageSync('lnglat')
    const store = await entry.getLocal(true)
    if (store) {
      Taro.setStorageSync('curStore', store)
      this.resetPage()
      this.setState({
        list: [],
        current: store,
        loading: false
      }, () => {
        this.nextPage()
      })
    } else {
      this.setState({
        current: null,
        loading: false
      })
    }
  }

  handleClick = (val) => {
    if(val){
      val.store_id = 0 //新增非门店自提，开启distributor_id 取值为store_id
    }
    Taro.setStorageSync('curStore', val)
    Taro.navigateBack()
  }

  render () {
    const { list, scrollTop, showBackToTop, loading, current, query } = this.state

    return (
      <View className='page-store-list'>
        <NavBar
          title='选择店铺'
          leftIconType='chevron-left'
        />
        <View className='store-list__search'>
          <SearchBar
            showDailog={false}
            keyword={query ? query.name : ''}
            onFocus={this.handleSearchOn}
            onChange={this.handleSearchChange}
            onClear={this.handleSearchClear}
            onCancel={this.handleSearchOff}
            onConfirm={this.handleConfirm.bind(this)}
          />
        </View>
        <View className='current-store'>
          <View className='label'>当前位置</View>
          <View className='content view-flex'>
            <View className='view-flex-item'>
              {
                loading
                  ? <Text className='loading'>定位中...</Text>
                  : <Text>{current ? current.name : '定位失败...'}</Text>
              }
            </View>
            <View
              className='view-flex view-flex-middle'
              onClick={this.handleGetLocation}
            >重新定位 <Text className='icon-target' /></View>
          </View>
        </View>
        <ScrollView
          className='page-store-list__scroll'
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
        >
          <View className='store-list'>
            {
              list.map(item => {
                return (
                  <StoreListItem
                    info={item}
                    key={item.distributor_id}
                    onClick={this.handleClick.bind(this, item)}
                  />
                )
              })
            }
          </View>
        </ScrollView>

        <BackToTop
          show={showBackToTop}
          onClick={this.scrollBackToTop}
        />

        <SpToast />
      </View>
    )
  }
}
