import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Image, Navigator } from '@tarojs/components'
import { AtDrawer } from 'taro-ui'
import { SpToast, BackToTop, Loading, FilterBar, SpNote, GoodsItem } from '@/components'
import S from '@/spx'
import api from '@/api'
import { withPager, withBackToTop } from '@/hocs'
import { classNames, pickBy } from '@/utils'

import './shop-home.scss'

@withPager
@withBackToTop
export default class DistributionShopHome extends Component {
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
      showDrawer: false,
      paramsList: [],
      selectParams: [],
      list: [],
      goodsIds: []
    }
  }

  componentDidMount () {
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

  componentDidShow () {
    this.fetchInfo()
  }

  async fetchInfo () {
    const distributionShopId = Taro.getStorageSync('distribution_shop_id')
    const param = distributionShopId && {
      user_id: distributionShopId
    }

    const res = await api.distribution.info(param || null)
    const {shop_name, brief, shop_pic, username, headimgurl } = res

    this.setState({
      info: {
        username,
        headimgurl,
        shop_name,
        brief,
        shop_pic
      }
    })
  }

  async fetch (params) {
    const distributionShopId = Taro.getStorageSync('distribution_shop_id')
    const { userId } = Taro.getStorageSync('userinfo')
    const uid = distributionShopId || userId
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
      market_price: ({ market_price }) => (market_price/100).toFixed(2)
    })

    let ids = []
    list.map(item => {
      ids.push(item.goods_id)
    })

    const param = {
      goods_id: ids,
      user_id: uid
    }

    const { goods_id } = await api.distribution.items(param)

    this.setState({
      goodsIds: [...this.state.goodsIds, ...goods_id],
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

  render () {
    const { list, page, showDrawer, paramsList, selectParams, scrollTop, goodsIds, curFilterIdx, filterList } = this.state

    return (
      <View className="page-distribution-shop">
        <View className="shop-banner">
          <View className="shop-info">
            <Image
              className='shopkeeper-avatar'
              src={info.headimgurl}
              mode='aspectFill'
            />
            <View>
              <View className='shop-name'>{info.shop_name || `${info.username}的小店`}</View>
              <View className='shop-desc'>{info.brief || '店主很懒什么都没留下'}</View>
            </View>
          </View>
          <Image
            className='banner-img'
            src={info.shop_pic}
            mode='aspectFill'
          />
        </View>
        <FilterBar
          className='goods-list__tabs'
          custom
          current={curFilterIdx}
          list={filterList}
          onChange={this.handleFilterChange}
        >
          <View className='filter-bar__item' onClick={this.handleClickFilter.bind(this)}>
            <View className='icon-filter'></View>
            <Text>筛选</Text>
          </View>
        </FilterBar>

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
          <View className='goods-list'>
            {
              list.map((item, index) => {
                const isRelease = goodsIds.findIndex(n => item.goods_id == n) !== -1
                return (
                  isRelease
                  && <GoodsItem
                      key={index}
                      info={item}
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
            !page.isLoading && !page.hasNext && !goodsIds.length
              && (<SpNote img='trades_empty.png'>暂无数据~</SpNote>)
          }
        </ScrollView>
        <SpToast />
      </View>
    )
  }
}
