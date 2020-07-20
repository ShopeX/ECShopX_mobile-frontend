import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Image, Navigator } from '@tarojs/components'
import { SpToast, BackToTop, Loading, FilterBar, SpNote, NavBar } from '@/components'
import DistributionGoodsItem from './comps/goods-item'
import S from '@/spx'
import api from '@/api'
import { withPager, withBackToTop } from '@/hocs'
import { classNames, pickBy } from '@/utils'

import './goods.scss'

@withPager
@withBackToTop
export default class DistributionGoods extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      info: {},
      curFilterIdx: 0,
      filterList: [
        { title: '综合' },
        { title: '销量' },
        { title: '价格', sort: -1 }
      ],
      query: null,
      paramsList: [],
      selectParams: [],
      list: [],
      goodsIds: []
    }
  }

  componentDidMount () {
    Taro.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })    
    this.firstStatus = true
    this.setState({
      query: {
        item_type: 'normal',
        approve_status: 'onsale,only_show',
        is_promoter: true
      }
    }, () => {
      this.nextPage()
    })
  }

  async fetch (params) {
    const { userId } = Taro.getStorageSync('userinfo')
    const { page_no: page, page_size: pageSize } = params
    const { selectParams } = this.state
    const query = {
      ...this.state.query,
      page,
      pageSize
    }

    const { list, total_count: total, item_params_list = []} = await api.item.search(query)

    item_params_list.map(item => {
      if (selectParams.length < 4) {
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
      goods_id: 'goods_id',
      title: 'itemName',
      desc: 'brief',
      price: ({ price }) => (price/100).toFixed(2),
      promoter_price: ({ promoter_price }) => (promoter_price/100).toFixed(2),
      market_price: ({ market_price }) => (market_price/100).toFixed(2)
    })

    let ids = []
    list.map(item => {
      ids.push(item.goods_id)
    })

    const param = {
      goods_id: ids,
      user_id: userId
    }

    const { goods_id } = await api.distribution.items(param)

    this.setState({
      list: [...this.state.list, ...nList],
      goodsIds: [...this.state.goodsIds, ...goods_id],
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

  handleClickItem = async (id) => {
    console.log(id)
    const { goodsIds } = this.state
    const goodsId = {goods_id: id}
    const idx = goodsIds.findIndex(item => id === item)
    const isRelease = idx !== -1
    if (!isRelease) {
      const { status } = await api.distribution.release(goodsId)
      if ( status ) {
        this.setState({
          goodsIds: [...this.state.goodsIds, id]
        }, () => {
          S.toast('上架成功')
        })
      }
    } else {
      const { status } = await api.distribution.unreleased(goodsId)
      if ( status ) {
        goodsIds.splice(idx, 1)
        this.setState({
          goodsIds
        }, () => {
          S.toast('下架成功')
        })
      }
    }
  }

  onShareAppMessage (res) {
    const { userId } = Taro.getStorageSync('userinfo')
    const { info } = res.target.dataset

    return {
      title: info.title,
      imageUrl: info.img,
      path: `/pages/item/espier-detail?id=${info.item_id}&uid=${userId}`
    }
  }

  // onShareTimeline (res) {
  //   const { userId } = Taro.getStorageSync('userinfo')
  //   const { info } = res.target.dataset
  //   const query = {
  //     id: info.item_id,
  //     uid: userId
  //   }
  //   return {
  //     title: info.title,
  //     imageUrl: info.img,
  //     query
  //   }
  // }

  render () {
    const { status } = this.$router.params
    const { list, page, paramsList, selectParams, scrollTop, goodsIds, curFilterIdx, filterList } = this.state

    return (
      <View className="page-distribution-shop">
        <NavBar
          title='推广商品'
          leftIconType='chevron-left'
          fixed='true'
        />        
        <FilterBar
          className='goods-list__tabs'
          custom
          current={curFilterIdx}
          list={filterList}
          onChange={this.handleFilterChange}
        >
        </FilterBar>

        <ScrollView
          className='goods-list__scroll'
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
        >
          <View className='goods-list'>
            {
              list.map((item, index) => {
                const isRelease = goodsIds.findIndex(n => item.goods_id == n) !== -1
                console.log(isRelease)
                return (
                  <DistributionGoodsItem
                    key={index}
                    info={item}
                    isRelease={isRelease}
                    status={status}
                    onClick={() => this.handleClickItem(item.goods_id)}
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
        <SpToast />
      </View>
    )
  }
}
