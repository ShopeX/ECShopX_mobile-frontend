import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { withPager, withBackToTop } from '@/hocs'
import { AtDrawer } from 'taro-ui'
import { BackToTop, Loading, FilterBar, SearchBar, GoodsItem, NavBar, SpNote } from '@/components'
import api from '@/api'
import { pickBy, classNames } from '@/utils'

import './list.scss'

@connect(({
  member
}) => ({
  favs: member.favs
}))
@withPager
@withBackToTop
export default class List extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      curFilterIdx: 0,
      filterList: [
        { title: '综合' },
        { title: '销量' },
        { title: '价格', sort: -1 }
      ],
      query: null,
      list: [],
      paramsList: [],
      listType: 'grid',
      showDrawer: false,
      selectParams: []
    }
  }

  componentDidMount () {
    this.firstStatus = true
    this.setState({
      query: {
        keywords: this.$router.params.keywords,
        item_type: 'normal',
        is_point: 'false',
        approve_status: 'onsale,only_show',
        category: this.$router.params.cat_id
      }
    }, () => {
      this.nextPage()
    })
  }

  async fetch (params) {
    const { page_no: page, page_size: pageSize } = params
    const { selectParams } = this.state
    const query = {
      ...this.state.query,
      item_params: selectParams,
      page,
      pageSize
    }
    const { list, total_count: total, item_params_list = [] } = await api.item.search(query)
    const { favs } = this.props

    item_params_list.map(item => {
      if(selectParams.length < 4){
        selectParams.push({
          attribute_id: item.attribute_id,
          attribute_value_id: 'all'
        })
      }
      item.attribute_values.unshift({attribute_value_id: 'all', attribute_value_name: '全部', isChooseParams: true})
    })

    const nList = pickBy(list, {
      img: 'pics[0]',
      item_id: 'item_id',
      title: 'itemName',
      desc: 'brief',
      price: ({ price }) => (price/100).toFixed(2),
      market_price: ({ market_price }) => (market_price/100).toFixed(2),
      is_fav: ({ item_id }) => Boolean(favs[item_id])
    })

    this.setState({
      list: [...this.state.list, ...nList],
      showDrawer: false,
      query
    })

    if (this.firstStatus) {
      this.setState({
        paramsList: item_params_list,
        selectParams
      })
      this.firstStatus = false
    }

    return {
      total
    }
  }

  handleFilterChange = (data) => {
    this.setState({
      showDrawer: false
    })
    const { current, sort } = data

    const query = {
      ...this.state.query,
      goodsSort: current === 0
          ? null
          : current === 1
            ? 1
            : (sort > 0 ? 3 : 2)
    }

    if (current !== this.state.curFilterIdx || (current === this.state.curFilterIdx && query.goodsSort !== this.state.query.goodsSort)) {
      this.resetPage()
      this.setState({
        list: []
      })
    }

    this.setState({
      curFilterIdx: current,
      query
    }, () => {
      this.nextPage()
    })
  }

  handleListTypeChange = () => {
    const listType = this.state.listType === 'grid' ? 'default' : 'grid'

    this.setState({
      listType
    })
  }

  handleClickItem = (item) => {
    const url = `/pages/item/espier-detail?id=${item.item_id}`
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
    paramsList.map(item => {
      if(item.attribute_id === id) {
        item.attribute_values.map(v_item => {
          if(v_item.attribute_value_id === child_id) {
            v_item.isChooseParams = true
          } else {
            v_item.isChooseParams = false
          }
        })
      }
    })
    selectParams.map(item => {
      if(item.attribute_id === id) {
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
    if(type === 'reset') {
      const { paramsList, selectParams } = this.state
      this.state.paramsList.map(item => {
        item.attribute_values.map(v_item => {
          if(v_item.attribute_value_id === 'all') {
            v_item.isChooseParams = true
          } else {
            v_item.isChooseParams = false
          }
        })
      })
      selectParams.map(item => {
        item.attribute_value_id = 'all'
      })
      this.setState({
        paramsList,
        selectParams
      })
    }

    this.resetPage()
    this.setState({
      list: []
    }, () => {
      this.nextPage()
    })
  }

  handleConfirm = (val) => {
    this.setState({
      query: {
        ...this.state.query,
        keywords: val,
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

  render () {
    const { list, listType, curFilterIdx, filterList, showBackToTop, scrollTop, page, showDrawer, paramsList, selectParams } = this.state

    return (
      <View className='page-goods-list'>
        <View className='goods-list__toolbar'>
          <NavBar
            title='商城'
            leftIconType='chevron-left'
            fixed='true'
          />
          <SearchBar
            onConfirm={this.handleConfirm.bind(this)}
          />

          <FilterBar
            className='goods-list__tabs'
            current={curFilterIdx}
            list={filterList}
            onChange={this.handleFilterChange}
          >
            <View className='filter-bar__item' onClick={this.handleClickFilter.bind(this)}>
              <View className='in-icon in-icon-filter'></View>
              <Text className='filter-bar__text'>筛选</Text>
            </View>
          </FilterBar>
        </View>

        <AtDrawer
          show={showDrawer}
          right
          mask
          width={`${Taro.pxTransform(570)}`}
        >
          {
            paramsList.map((item, index) => {
              return (
                <View className='drawer-item' key={index}>
                  <View className='drawer-item__title'>
                    <Text>{item.attribute_name}</Text>
                    <View className='at-icon at-icon-chevron-down'> </View>
                  </View>
                  <View className='drawer-item__options'>
                    {
                      item.attribute_values.map((v_item, v_index) => {
                        return (
                          <View
                            className={classNames('drawer-item__options__item' ,v_item.isChooseParams ? 'drawer-item__options__checked' : '')}
                            // className='drawer-item__options__item'
                            key={v_index}
                            onClick={this.handleClickParmas.bind(this, item.attribute_id, v_item.attribute_value_id)}
                          >
                            {v_item.attribute_value_name}
                          </View>
                        )
                      })
                    }
                    <View className='drawer-item__options__none'> </View>
                    <View className='drawer-item__options__none'> </View>
                    <View className='drawer-item__options__none'> </View>
                  </View>
                </View>
              )
            })
          }
          {/*<View className='drawer-item'>
            <View className='drawer-item__title'>
              <Text>系列</Text>
              <View className='at-icon at-icon-chevron-down'> </View>
            </View>
            <View className='drawer-item__options'>
              <View className='drawer-item__options__item'>全部</View>
              <View className='drawer-item__options__item'>茶籽精萃</View>
              <View className='drawer-item__options__item'>橄榄</View>
              <View className='drawer-item__options__item'>火山岩泥</View>
              <View className='drawer-item__options__item'>生机展颜</View>
              <View className='drawer-item__options__none'> </View>
              <View className='drawer-item__options__none'> </View>
              <View className='drawer-item__options__none'> </View>
            </View>
          </View>
          <View className='drawer-item'>
            <View className='drawer-item__title'>
              <Text>系列</Text>
              <View className='at-icon at-icon-chevron-down'> </View>
            </View>
            <View className='drawer-item__options'>
              <View className='drawer-item__options__item'>全部</View>
              <View className='drawer-item__options__item'>茶籽精萃</View>
              <View className='drawer-item__options__item'>橄榄</View>
              <View className='drawer-item__options__item'>火山岩泥</View>
              <View className='drawer-item__options__item'>生机展颜</View>
              <View className='drawer-item__options__none'> </View>
              <View className='drawer-item__options__none'> </View>
              <View className='drawer-item__options__none'> </View>
            </View>
          </View>*/}
          <View className='drawer-footer'>
            <Text className='drawer-footer__btn' onClick={this.handleClickSearchParams.bind(this, 'reset')}>重置</Text>
            <Text className='drawer-footer__btn drawer-footer__btn_active' onClick={this.handleClickSearchParams.bind(this, 'submit')}>确定</Text>
          </View>
        </AtDrawer>

        <ScrollView
          className='goods-list__scroll'
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
        >
          <View className={`goods-list goods-list__type-${listType}`}>
            {
              list.map(item => {
                return (
                  <GoodsItem
                    key={item.item_id}
                    info={item}
                    onClick={() => this.handleClickItem(item)}
                  />
                )
              })
            }
          </View>
          {
            page.isLoading
              ? <Loading>正在加载...</Loading>
              : null
          }
          {
            !page.isLoading && !page.hasNext && !list.length
              && (<SpNote img='trades_empty.png'>暂无数据~</SpNote>)
          }
        </ScrollView>

        <BackToTop
          show={showBackToTop}
          onClick={this.scrollBackToTop}
        />
      </View>
    )
  }
}
