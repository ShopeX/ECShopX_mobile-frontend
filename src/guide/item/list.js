import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { withPager, withBackToTop } from '@/hocs'
import { AtDrawer } from 'taro-ui'
import {
  BackToTop,
  Loading,
  TagsBar,
  FilterBar,
  SearchBar,
  GoodsItem,
  SpNote,
  SpNavBar,
  TabBar
} from '@/components'
import api from '@/api'
import S from '@/spx'
import { Tracker } from '@/service'
import { pickBy, classNames } from '@/utils'
import entry from '../../utils/entry'
import { BaNavBar } from '../components'

import './list.scss'

@connect(({ member, guide }) => ({
  favs: member.favs,
  storeInfo: guide.storeInfo
}))
@withPager
@withBackToTop
export default class List extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      curFilterIdx: 0,
      curTagId: '',
      filterList: [{ title: '综合' }, { title: '销量' }, { title: '价格', sort: -1 }],
      query: null,
      list: [],
      oddList: [],
      evenList: [],
      tagsList: [],
      paramsList: [],
      listType: 'grid',
      isShowSearch: false,
      showDrawer: false,
      selectParams: [],
      info: {},
      shareInfo: {},
      isOpenStore: null
    }
  }

  async componentDidMount () {
    const { cat_id = null, main_cat_id = null, gu, sence } = this.$router.params

    this.firstStatus = true
    const isOpenStore = await entry.getStoreStatus()
    const { store_id } = Taro.getStorageSync('curStore')
    const { storeInfo } = this.props
    this.setState({
      isOpenStore
    })

    this.setState(
      {
        query: {
          keywords: this.$router.params.keywords,
          item_type: 'normal',
          is_point: 'false',
          distributor_id: storeInfo.distributor_id,
          //approve_status: 'onsale,only_show',
          goodsSort: '',
          category: cat_id ? cat_id : '',
          main_category: main_cat_id ? main_cat_id : ''
        },
        curTagId: this.$router.params.tag_id
      },
      () => {
        this.nextPage()
        api.wx.shareSetting({ shareindex: 'itemlist' }).then((res) => {
          this.setState({
            shareInfo: res
          })
        })
      }
    )
  }

  componentWillReceiveProps (next) {
    if (Object.keys(this.props.favs).length !== Object.keys(next.favs).length) {
      setTimeout(() => {
        const list = this.state.list.map((item) => {
          item.is_fav = Boolean(next.favs[item.item_id])
          return item
        })
        this.setState({
          list
        })
      })
    }
  }

  config = {
    navigationStyle: 'custom',
    navigationBarTitleText: '导购商城'
  }

  // onShareAppMessage() {
  //   const res = this.state.shareInfo
  //   const { cat_id = '', main_cat_id = '' } = this.$router.params
  //   const { userId } = Taro.getStorageSync('userinfo')
  //   const query = userId ? `?uid=${userId}&cat_id=${cat_id}&main_cat_id=${main_cat_id}` : `?cat_id=${cat_id}&main_cat_id=${main_cat_id}`
  //   return {
  //     title: res.title,
  //     imageUrl: res.imageUrl,
  //     path: `/pages/item/list${query}`
  //   }
  // }

  onShareTimeline () {
    const res = this.state.shareInfo
    const { cat_id = null, main_cat_id = null } = this.$router.params
    const { userId } = Taro.getStorageSync('userinfo')
    const query = userId
      ? `uid=${userId}&cat_id=${cat_id}&main_cat_id=${main_cat_id}`
      : `cat_id=${cat_id}&main_cat_id=${main_cat_id}`
    return {
      title: res.title,
      imageUrl: res.imageUrl,
      query: query
    }
  }

  async fetch (params) {
    const { page_no: page, page_size: pageSize } = params
    const { selectParams, tagsList, curTagId, isOpenStore } = this.state
    //const { distributor_id,store_id } = Taro.getStorageSync('curStore')
    const { cardId } = this.$router.params
    const query = {
      ...this.state.query,
      item_params: selectParams,
      tag_id: curTagId,
      page,
      pageSize
    }

    if (cardId) {
      query.card_id = cardId
    }
    console.log('query---->', query)

    const {
      list,
      total_count: total,
      item_params_list = [],
      select_tags_list = []
    } = await api.guide.salespersonItems(query)
    const { favs } = this.props

    item_params_list.map((item) => {
      if (selectParams.length < 4) {
        selectParams.push({
          attribute_id: item.attribute_id,
          attribute_value_id: 'all'
        })
      }
      item.attribute_values.unshift({
        attribute_value_id: 'all',
        attribute_value_name: '全部',
        isChooseParams: true
      })
    })

    const nList = pickBy(list, {
      img: ({ pics }) => (pics ? (typeof pics !== 'string' ? pics[0] : JSON.parse(pics)[0]) : ''),
      item_id: 'item_id',
      title: ({ itemName, item_name }) => (itemName ? itemName : item_name),
      desc: 'brief',
      distributor_id: 'distributor_id',
      distributor_info: 'distributor_info',
      promotion_activity_tag: 'promotion_activity',
      origincountry_name: 'origincountry_name',
      origincountry_img_url: 'origincountry_img_url',
      type: 'type',
      price: ({ price }) => (price / 100).toFixed(2),
      member_price: ({ member_price }) => (member_price / 100).toFixed(2),
      market_price: ({ market_price }) => (market_price / 100).toFixed(2),
      is_fav: ({ item_id }) => Boolean(favs[item_id])
    })

    let odd = [],
      even = []
    nList.map((item, idx) => {
      if (idx % 2 == 0) {
        odd.push(item)
      } else {
        even.push(item)
      }
    })

    this.setState(
      {
        list: [...this.state.list, ...nList],
        oddList: [...this.state.oddList, ...odd],
        evenList: [...this.state.evenList, ...even],
        showDrawer: false,
        query
      },
      () => {
        this.startTrack()
      }
    )

    if (this.firstStatus) {
      this.setState({
        paramsList: item_params_list,
        selectParams
      })
      this.firstStatus = false
    }

    if (tagsList.length === 0) {
      let tags = select_tags_list
      tags.unshift({
        tag_id: 0,
        tag_name: '全部'
      })
      this.setState({
        //curTagId: 0,
        tagsList: tags
      })
    }

    return {
      total
    }
  }

  startTrack () {
    this.endTrack()
    const observer = Taro.createIntersectionObserver(this.$scope, {
      observeAll: true
    })
    observer.relativeToViewport({ bottom: 0 }).observe('.goods-list__item', (res) => {
      // console.log("res.intersectionRatio:", res.intersectionRatio);
      if (res.intersectionRatio > 0) {
        const { id } = res.dataset
        const { list } = this.state
        const curGoods = list.find((item) => item.item_id == id)
        const { item_id, title, market_price, price, img } = curGoods
        Tracker.dispatch('EXPOSE_SKU_COMPONENT', {
          goodsId: item_id,
          title: title,
          market_price: market_price * 100,
          price: price * 100,
          imgUrl: img
        })
      }
    })

    this.observe = observer
  }

  endTrack () {
    if (this.observer) {
      this.observer.disconnect()
      this.observe = null
    }
  }

  handleTagChange = (data) => {
    const { current } = data
    this.resetPage()
    this.setState({
      list: [],
      oddList: [],
      evenList: []
    })

    this.setState(
      {
        curTagId: current
      },
      () => {
        this.nextPage()
      }
    )
  }

  handleFilterChange = (data) => {
    this.setState({
      showDrawer: false
    })
    const { current, sort } = data
    console.log('data---->', data)

    const query = {
      ...this.state.query,
      goodsSort: current === 0 ? null : current === 1 ? 1 : sort > 0 ? 3 : 2
    }

    if (
      current !== this.state.curFilterIdx ||
      (current === this.state.curFilterIdx && query.goodsSort !== this.state.query.goodsSort)
    ) {
      this.resetPage()
      this.setState({
        list: [],
        oddList: [],
        evenList: []
      })
    }

    this.setState(
      {
        curFilterIdx: current,
        query
      },
      () => {
        this.nextPage()
      }
    )
  }

  handleListTypeChange = () => {
    const listType = this.state.listType === 'grid' ? 'default' : 'grid'

    this.setState({
      listType
    })
  }

  handleClickItem = (item) => {
    const { item_id, title, market_price, price, img, member_price } = item
    Tracker.dispatch('TRIGGER_SKU_COMPONENT', {
      goodsId: item_id,
      title: title,
      market_price: market_price * 100,
      member_price: member_price * 100,
      price: price * 100,
      imgUrl: img
    })
    const url = `/guide/item/espier-detail?id=${item.item_id}&dtid=${item.distributor_id}`
    Taro.navigateTo({
      url
    })
  }

  handleClickStore = (item) => {
    const url = `/pages/store/index?id=${item.distributor_info.distributor_id}`
    Taro.navigateTo({
      url
    })
  }

  handleClickFilter = () => {
    this.setState({
      showDrawer: true
    })
  }

  handleClickParmas = (id, child_id) => {
    const { paramsList, selectParams } = this.state
    paramsList.map((item) => {
      if (item.attribute_id === id) {
        item.attribute_values.map((v_item) => {
          if (v_item.attribute_value_id === child_id) {
            v_item.isChooseParams = true
          } else {
            v_item.isChooseParams = false
          }
        })
      }
    })
    selectParams.map((item) => {
      if (item.attribute_id === id) {
        item.attribute_value_id = child_id
      }
    })
    this.setState({
      paramsList,
      selectParams
    })
  }

  handleClickSearchParams = (type) => {
    this.setState({
      showDrawer: false
    })
    if (type === 'reset') {
      const { paramsList, selectParams } = this.state
      this.state.paramsList.map((item) => {
        item.attribute_values.map((v_item) => {
          if (v_item.attribute_value_id === 'all') {
            v_item.isChooseParams = true
          } else {
            v_item.isChooseParams = false
          }
        })
      })
      selectParams.map((item) => {
        item.attribute_value_id = 'all'
      })
      this.setState({
        paramsList,
        selectParams
      })
    }

    this.resetPage()
    this.setState(
      {
        list: [],
        oddList: [],
        evenList: []
      },
      () => {
        this.nextPage()
      }
    )
  }

  handleViewChange = () => {
    const { listType } = this.state
    if (listType === 'grid') {
      this.setState({
        listType: 'list'
      })
    } else {
      this.setState({
        listType: 'grid'
      })
    }
  }

  handleSearchOn = () => {
    console.log('handleSearchOn')
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
        keywords: val
      }
    })
  }

  handleSearchClear = () => {
    this.setState(
      {
        isShowSearch: false,
        query: {
          ...this.state.query,
          keywords: ''
        }
      },
      () => {
        this.resetPage()
        this.setState(
          {
            list: [],
            oddList: [],
            evenList: []
          },
          () => {
            this.nextPage()
          }
        )
      }
    )
  }

  handleConfirm = (val) => {
    Tracker.dispatch('SEARCH_RESULT', {
      keywords: val
    })
    this.setState(
      {
        isShowSearch: false,
        query: {
          ...this.state.query,
          keywords: val
        }
      },
      () => {
        this.resetPage()
        this.setState(
          {
            list: [],
            oddList: [],
            evenList: []
          },
          () => {
            this.nextPage()
          }
        )
      }
    )
  }

  render () {
    const {
      list,
      oddList,
      evenList,
      listType,
      curFilterIdx,
      filterList,
      showBackToTop,
      scrollTop,
      page,
      showDrawer,
      paramsList,
      selectParams,
      tagsList,
      curTagId,
      info,
      isShowSearch,
      query
    } = this.state
    const { isTabBar = '' } = this.$router.params
    const navbar_height = S.get('navbar_height', true)
    return (
      <View className='page-goods-list'>
        <BaNavBar title='导购商城' fixed />
        <View className='goods-list__toolbar' style={`top:${navbar_height}PX`}>
          <View
            className={`goods-list__search ${
              query && query.keywords && !isShowSearch ? 'on-search' : null
            }`}
          >
            <SearchBar
              keyword={query ? query.keywords : ''}
              onFocus={this.handleSearchOn}
              onChange={this.handleSearchChange}
              onClear={this.handleSearchClear}
              onCancel={this.handleSearchOff}
              onConfirm={this.handleConfirm.bind(this)}
            />
            {!isShowSearch && (
              <View
                className={classNames(
                  'goods-list__type',
                  listType === 'grid' ? 'icon-list' : 'icon-grid'
                )}
                onClick={this.handleViewChange}
              ></View>
            )}
          </View>
          {tagsList.length && (
            <TagsBar
              current={curTagId}
              list={tagsList}
              onChange={this.handleTagChange.bind(this)}
            />
          )}
          <FilterBar
            className='goods-list__tabs'
            custom
            current={curFilterIdx}
            list={filterList}
            onChange={this.handleFilterChange}
          >
            {/*
              <View className='filter-bar__item' onClick={this.handleClickFilter.bind(this)}>
                <View className='icon-filter'></View>
                <Text>筛选</Text>
              </View>
            */}
          </FilterBar>
        </View>

        <AtDrawer show={showDrawer} right mask width={`${Taro.pxTransform(570)}`}>
          {paramsList.map((item, index) => {
            return (
              <View className='drawer-item' key={`${index}1`}>
                <View className='drawer-item__title'>
                  <Text>{item.attribute_name}</Text>
                  <View className='at-icon at-icon-chevron-down'> </View>
                </View>
                <View className='drawer-item__options'>
                  {item.attribute_values.map((v_item, v_index) => {
                    return (
                      <View
                        className={classNames(
                          'drawer-item__options__item',
                          v_item.isChooseParams ? 'drawer-item__options__checked' : ''
                        )}
                        // className='drawer-item__options__item'
                        key={`${v_index}1`}
                        onClick={this.handleClickParmas.bind(
                          this,
                          item.attribute_id,
                          v_item.attribute_value_id
                        )}
                      >
                        {v_item.attribute_value_name}
                      </View>
                    )
                  })}
                  <View className='drawer-item__options__none'> </View>
                  <View className='drawer-item__options__none'> </View>
                  <View className='drawer-item__options__none'> </View>
                </View>
              </View>
            )
          })}
          <View className='drawer-footer'>
            <Text
              className='drawer-footer__btn'
              onClick={this.handleClickSearchParams.bind(this, 'reset')}
            >
              重置
            </Text>
            <Text
              className='drawer-footer__btn drawer-footer__btn_active'
              onClick={this.handleClickSearchParams.bind(this, 'submit')}
            >
              确定
            </Text>
          </View>
        </AtDrawer>

        <ScrollView
          className={classNames(
            isTabBar ? 'goods-list__scroll_isTabBar' : 'goods-list__scroll',
            tagsList.length > 0 && 'with-tag-bar',
            isTabBar && 'isTabBar'
          )}
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
          style={`padding-top:${navbar_height}PX`}
        >
          {listType === 'grid' && (
            <View className='goods-list goods-list__type-grid'>
              <View className='goods-list__group'>
                {oddList.map((item) => {
                  return (
                    <View className='goods-list__item' key={item.item_id} data-id={item.item_id}>
                      <GoodsItem
                        key={item.item_id}
                        info={item}
                        onClick={() => this.handleClickItem(item)}
                        onStoreClick={() => this.handleClickStore(item)}
                      />
                    </View>
                  )
                })}
              </View>
              <View className='goods-list__group'>
                {evenList.map((item) => {
                  return (
                    <View className='goods-list__item' key={item.item_id} data-id={item.item_id}>
                      <GoodsItem
                        key={item.item_id}
                        info={item}
                        onClick={() => this.handleClickItem(item)}
                        onStoreClick={() => this.handleClickStore(item)}
                      />
                    </View>
                  )
                })}
              </View>
            </View>
          )}
          {listType === 'list' && (
            <View className='goods-list goods-list__type-list'>
              {list.map((item) => {
                return (
                  <View className='goods-list__item' key={item.item_id}>
                    <GoodsItem
                      info={item}
                      onClick={() => this.handleClickItem(item)}
                      onStoreClick={() => this.handleClickStore(item)}
                    />
                  </View>
                )
              })}
            </View>
          )}
          {page.isLoading ? <Loading>正在加载...</Loading> : null}
          {!page.isLoading && !page.hasNext && !list.length && (
            <SpNote img='trades_empty.png'>暂无数据~</SpNote>
          )}
        </ScrollView>

        <BackToTop show={showBackToTop} onClick={this.scrollBackToTop} bottom={30} />
        {/* {isTabBar && <TabBar />} */}
      </View>
    )
  }
}
