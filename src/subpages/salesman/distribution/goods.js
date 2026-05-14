/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { platformTemplateName } from '@/utils/platform'
import { AtTabBar } from 'taro-ui'
import { SpToast, Loading, FilterBar, SpNote, SpSearchInput, SpNavBar, SpPage } from '@/components'
import { SpNavFilter } from '@/subpages/components'
import S from '@/spx'
import { getDtidIdUrl } from '@/utils/helper'
import api from '@/api'
import { withTranslation } from 'react-i18next'
import { withPager, withBackToTop } from '@/hocs'
import { $t } from '@/i18n'
import { pickBy, getCurrentRoute, isAlipay } from '@/utils'
import DistributionGoodsItem from './comps/goods-item'
import './goods.scss'

@withPager
@withBackToTop
class DistributionGoods extends Component {
  $instance = getCurrentInstance() || {}
  constructor(props) {
    super(props)

    this.state = {
      ...this.state,
      shareInfo: {},
      info: {},
      curFilterIdx: 0,
      filterList: [{ title: '' }, { title: '' }, { title: '', sort: -1 }],
      tabList: [
        {
          title: '',
          iconType: 'home',
          iconPrefixClass: 'iconfont icon',
          url: '/subpages/salesman/distribution/goods',
          urlRedirect: true
        },
        {
          title: '',
          iconType: 'category_id',
          iconPrefixClass: 'iconfont icon',
          url: '/subpages/salesman/distribution/good-category',
          urlRedirect: true
        }
      ],
      localCurrent: 0,
      query: null,
      paramsList: [],
      selectParams: [],
      list: [],
      goodsIds: [],
      top: 0,
      searchConditionList: [{ label: '', value: '' }],
      navFilterList: [
        {
          key: 'tag_id',
          name: '',
          label: '',
          activeIndex: null,
          option: []
        },
        {
          key: 'category',
          name: '',
          label: '',
          activeIndex: null,
          option: [
            { category_name: '', category_id: 'all' }
            // {
            //   category_name: '男装',
            //   category_id: '1',
            //   children: [
            //     {
            //       category_name: '上衣',
            //       category_id: '3',
            //       children: [{ category_name: '卫衣', category_id: '4' }]
            //     }
            //   ]
            // },
            // { category_name: '女装', category_id: '2' }
          ]
        },
        {
          key: 'store_status',
          label: '',
          name: '',
          activeIndex: null,
          option: [
            { label: '', value: 1 },
            { label: '', value: 0 }
          ]
        }
      ],
      tag_id: '',
      category: '',
      statused: '',
      isLoading: true,
      first: true
    }
  }

  componentDidMount() {
    Taro.hideShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    this.firstStatus = true
    const { status } = this.$instance?.router?.params
    const { tabList } = this.state
    tabList[1].url += `?status=${status}`
    this.setState(
      {
        query: {
          item_type: 'normal',
          approve_status: 'onsale,only_show',
          is_promoter: true
        },
        tabList,
        isLoading: true
      },
      () => {
        this.nextPage()
      }
    )
    this.distributor()
  }

  async getCategory() {
    const query = {
      template_name: platformTemplateName,
      version: 'v1.0.1',
      page_name: 'category',
      isSalesmanPage: 1,
      distributor_id: this.state.query.distributor_id
    }
    const seriesList = await api.salesman.get(query)
    let nav = JSON.parse(JSON.stringify(this.state.navFilterList))

    const classification = (item) => {
      item.forEach((l, i) => {
        l.category_name = l.category_name
        l.category_id = l.category_id
        if (l?.children) {
          classification(l.children)
        }
      })
      return item
    }

    let res = classification(seriesList)

    nav[1].option = [...nav[1].option, ...(res ?? [])]
    this.setState({
      navFilterList: nav
    })
  }

  async fetch(params) {
    const { userId } = Taro.getStorageSync('userinfo')
    const { page_no: page, page_size: pageSize } = params
    const { selectParams, navFilterList, first } = this.state
    const query = {
      ...this.state.query,
      page,
      pageSize,
      isSalesmanPage: 1
    }

    const {
      list,
      total_count: total,
      item_params_list = [],
      select_tags_list
    } = await api.item.search(query)

    item_params_list.map((item) => {
      if (selectParams.length < 4) {
        selectParams.push({
          attribute_id: item.attribute_id,
          attribute_value_id: 'all'
        })
      }
      item.attribute_values.unshift({
        attribute_value_id: 'all',
        attribute_value_name: $t('f1d3181c.a8b0c2'),
        isChooseParams: true
      })
    })

    let nav = JSON.parse(JSON.stringify(navFilterList))

    select_tags_list?.map((item) => {
      nav[0].option.push({
        label: item.tag_name,
        value: item.tag_id
      })
    })

    const nList = pickBy(list, {
      img: 'pics[0]',
      item_id: 'item_id',
      goods_id: 'goods_id',
      title: 'item_name',
      desc: 'brief',
      price: ({ price }) => (price / 100).toFixed(2),
      promoter_price: ({ promoter_price }) => (promoter_price / 100).toFixed(2),
      market_price: ({ market_price }) => (market_price / 100).toFixed(2),
      commission_type: 'commission_type',
      promoter_point: 'promoter_point',
      distributor_id: 'distributor_id'
    })

    let ids = []
    list.map((item) => {
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
      query,
      isLoading: false,
      first: false
    })

    if (this.firstStatus) {
      this.setState({
        paramsList: item_params_list,
        selectParams
      })
      this.firstStatus = false
    }
    if (first) {
      this.setState({
        navFilterList: nav
      })
      await this.getCategory()
    }
    return {
      total
    }
  }

  distributor = async () => {
    const { list } = await api.salesman.getSalespersonSalemanShopList({
      page: 1,
      page_size: 1000
    })
    list.forEach((element) => {
      element.value = element.distributor_id
      element.label = element.name
    })
    list.unshift({
      value: '',
      label: ''
    })
    this.setState({
      searchConditionList: list
    })
  }

  handleFilterChange = (data) => {
    const { current, sort } = data

    const query = {
      ...this.state.query,
      goodsSort: current === 0 ? null : current === 1 ? 1 : sort > 0 ? 3 : 2
    }

    if (current == this.state.curFilterIdx && current !== 2) {
      return
    }

    if (
      current !== this.state.curFilterIdx ||
      (current === this.state.curFilterIdx && query.goodsSort !== this.state.query.goodsSort)
    ) {
      this.resetPage()
      this.setState({
        list: []
      })
    }

    this.setState(
      {
        curFilterIdx: current,
        query,
        isLoading: true
      },
      () => {
        this.nextPage()
      }
    )
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
        isLoading: true
      },
      () => {
        this.nextPage()
      }
    )
  }

  handleClickItem = async (id) => {
    const { goodsIds } = this.state
    const goodsId = { goods_id: id }
    const idx = goodsIds.findIndex((item) => id === item)
    const isRelease = idx !== -1
    if (!isRelease) {
      const { status } = await api.distribution.release(goodsId)
      if (status) {
        this.setState(
          {
            goodsIds: [...this.state.goodsIds, id],
            scrollTop: this.state.top
          },
          () => {
            S?.toast($t('f1d3181c.e241a8'))
          }
        )
      }
    } else {
      const { status } = await api.distribution.unreleased(goodsId)
      if (status) {
        goodsIds.splice(idx, 1)
        this.setState(
          {
            goodsIds,
            scrollTop: this.state.top
          },
          () => {
            S?.toast($t('f1d3181c.0c6d64'))
          }
        )
      }
    }
  }

  onShareAppMessage(res) {
    // const { userId } = Taro.getStorageSync('userinfo')
    const { userId } = Taro.getStorageSync('userinfo')
    const { info } = res.target.dataset
    console.log(info, 'kkkkkkkkk')

    if (isAlipay) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const info = Taro.getStorageSync('shareData')
          resolve({
            title: info.title,
            imageUrl: info.img,
            path: `/subpages/item/espier-detail?id=${info.item_id}&uid=${userId}&dtid=${info.distributor_id}&qr=Y`
          })
        }, 10)
      })
    }

    return {
      title: info.title,
      imageUrl: info.img,
      path: `/subpages/item/espier-detail?id=${info.item_id}&uid=${userId}&dtid=${info.distributor_id}&qr=Y`
    }
  }

  handleSearchChange = (val) => {
    this.setState({
      query: {
        ...this.state.query,
        keywords: val
      }
    })
  }

  handleConfirm = (val) => {
    this.setState(
      {
        query: {
          ...this.state.query,
          keywords: val.keywords,
          distributor_id: val.key
        },
        isLoading: true
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

  handleClick = (current) => {
    const cur = this.state.localCurrent

    if (cur !== current) {
      const curTab = this.state.tabList[current]
      const { url } = curTab

      const fullPath = getCurrentRoute(this.$instance?.router).fullPath.split('?')[0]

      if (url && fullPath !== url) {
        Taro.redirectTo({ url })
      }
    }
  }

  localizeNavFilterList(navFilterList) {
    if (!navFilterList?.length) return navFilterList
    const copy = JSON.parse(JSON.stringify(navFilterList))
    if (copy[0]) {
      copy[0].name = copy[0].label = $t('f1d3181c.14d342')
    }
    if (copy[1]) {
      copy[1].name = copy[1].label = $t('f1d3181c.d0771a')
      copy[1].option = (copy[1].option || []).map((o) =>
        o.category_id === 'all' ? { ...o, category_name: $t('f1d3181c.a8b0c2') } : o
      )
    }
    if (copy[2]) {
      copy[2].name = copy[2].label = $t('f1d3181c.3fea7c')
      copy[2].option = (copy[2].option || []).map((o) => ({
        ...o,
        label:
          o.value === 1 ? $t('f1d3181c.72c0c7') : o.value === 0 ? $t('f1d3181c.7cfe76') : o.label
      }))
    }
    return copy
  }
  shareDataChange = (shareInfo) => {
    this.setState({ shareInfo })
  }
  // 滚动事件
  onScroll = (e) => {
    const { scrollTop } = e.detail
    this.setState({
      top: scrollTop
    })
  }

  // 递归函数用于查找指定ID的数据
  findDataById = (data, id) => {
    let result = null

    const searchById = (items) => {
      for (const item of items) {
        if (item.category_id === id) {
          result = item
          return
        }
        if (item.children) {
          searchById(item.children)
          if (result) return
        }
      }
    }

    searchById(data)
    return result
  }

  handleFilterChanges = async (key, value) => {
    console.log(789, key, value)
    let params = {}
    if (key == 'category') {
      // let res = this.findDataById(this.state.navFilterList[1].option, value)
      // if (res?.statusNum) {
      //   params['category_id'] = value
      // } else {
      //   params['main_category'] = value
      // }
      params['category_id'] = value
    } else {
      params[key] = value
    }

    this.setState(
      {
        query: {
          ...this.state.query,
          ...params
        },
        isLoading: true
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

  onHandleSearch(item) {
    let res = JSON.parse(JSON.stringify(this.state.navFilterList))
    res[1] = {
      key: 'category',
      name: '',
      label: '',
      activeIndex: null,
      option: [{ category_name: '', category_id: 'all' }]
    }
    this.setState(
      {
        query: {
          // ...this.state.query,
          tag_id: '',
          category_id: '',
          store_status: '',
          distributor_id: item.distributor_id
        },
        isLoading: true,
        navFilterList: res
      },
      async () => {
        await this.resetPage()
        await this.getCategory()
        this.setState(
          {
            list: []
          },
          async () => {
            await this.nextPage()
          }
        )
      }
    )
  }
  render() {
    const { status } = this.$instance?.router?.params
    const {
      list,
      page,
      scrollTop,
      goodsIds,
      curFilterIdx,
      filterList,
      query,
      tabList,
      localCurrent,
      searchConditionList,
      navFilterList,
      tag_id,
      category,
      statused,
      isLoading
    } = this.state

    return (
      <SpPage className='page-distribution-shop'>
        <View>
          <SpNavBar title={$t('f1d3181c.7f8121')} leftIconType='chevron-left' fixed='true' />
          <SpSearchInput
            placeholder={$t('f1d3181c.ec47d2')}
            // isShowArea
            isShowSearchCondition
            searchConditionList={searchConditionList.map((row) =>
              row.value === '' ? { ...row, label: row.label || $t('f1d3181c.77678b') } : row
            )}
            onConfirm={this.handleConfirm.bind(this)}
            onHandleSearch={this.onHandleSearch.bind(this)}
          />
          <SpNavFilter
            info={this.localizeNavFilterList(navFilterList)}
            onChange={this.handleFilterChanges.bind(this)}
          />

          {/* <FilterBar
            className='goods-list__tabs'
            custom
            current={curFilterIdx}
            list={filterList}
            onChange={this.handleFilterChange}
          ></FilterBar> */}

          <ScrollView
            className='goods-list__scroll'
            scrollY
            scrollTop={scrollTop}
            scrollWithAnimation
            onScroll={this.onScroll}
            onScrollToLower={this.nextPage}
          >
            <View className='goods-list'>
              {list.map((item) => {
                const isRelease = goodsIds.findIndex((n) => item.goods_id == n) !== -1
                return (
                  <DistributionGoodsItem
                    key={item.goods_id}
                    info={item}
                    isRelease={isRelease}
                    shareDataChange={this.shareDataChange}
                    status={status}
                    onClick={() => this.handleClickItem(item.goods_id)}
                    integral
                  />
                )
              })}
            </View>
            {isLoading && <Loading>{$t('f1d3181c.bd0271')}</Loading>}
            {!page.isLoading && !page.hasNext && !list.length && (
              <SpNote img='trades_empty.png'>{$t('f1d3181c.ba1de9')}</SpNote>
            )}
          </ScrollView>
          <SpToast />
          <AtTabBar
            fixed
            tabList={tabList.map((item, index) => ({
              ...item,
              title: index === 0 ? $t('f1d3181c.7f8121') : $t('f1d3181c.d0771a')
            }))}
            onClick={this.handleClick}
            current={localCurrent}
          />
        </View>
      </SpPage>
    )
  }
}

export default withTranslation()(DistributionGoods)
