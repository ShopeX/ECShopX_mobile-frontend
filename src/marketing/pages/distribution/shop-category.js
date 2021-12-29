import React, { Component } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, ScrollView, Text } from '@tarojs/components'
import { Loading, SpImg, SpNote, SpNavBar } from '@/components'
import { classNames, pickBy, getCurrentRoute } from '@/utils'
import { AtTabBar } from 'taro-ui'
import S from '@/spx'
import { withPager, withBackToTop } from '@/hocs'
import api from '@/api'

import './shop-category.scss'

@withPager
@withBackToTop
export default class DistributionShopCategory extends Component {
  $instance = getCurrentInstance();
  constructor(props) {
    super(props)

    this.state = {
      ...this.state,
      curTabIdx: 0,
      currentIndex: 0,
      tabList: [
        {
          title: '小店首页',
          iconType: 'home',
          iconPrefixClass: 'icon',
          url: '/marketing/pages/distribution/shop-home',
          urlRedirect: true
        },
        {
          title: '分类',
          iconType: 'category',
          iconPrefixClass: 'icon',
          url: '/marketing/pages/distribution/shop-category',
          urlRedirect: true
        }
      ],
      contentList: [],
      list: [],
      hasSeries: false,
      isChanged: false,
      localCurrent: 1,
      defaultId: 0
    }
  }

  componentDidMount() {
    this.fetchInfo()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isChanged === true) {
      this.setState({
        currentIndex: 0
      })
    }
  }

  async fetchInfo() {
    const options = this.$instance.router.params
    const { userId } = Taro.getStorageSync('userinfo')
    const distributionShopId = Taro.getStorageSync('distribution_shop_id')
    const query = {
      category_level: 1,
      shop_user_id: distributionShopId || userId
    }

    if (options.featuredshop || options.uid) {
      query.shop_user_id = options.featuredshop || options.uid
    }

    const { list } = await api.distribution.getShopCategorylevel(query)
    const cate_id = list[0] && list[0].category_id
    const nList = pickBy(list, {
      name: 'category_name',
      id: 'category_id'
    })
    this.setState(
      {
        list: nList,
        defaultId: cate_id,
        hasSeries: false,
        tabList: [
          {
            title: '小店首页',
            iconType: 'home',
            iconPrefixClass: 'icon',
            url: `/marketing/pages/distribution/shop-home?featuredshop=${options.featuredshop}`,
            urlRedirect: true
          },
          {
            title: '分类',
            iconType: 'category',
            iconPrefixClass: 'icon',
            url: `/marketing/pages/distribution/shop-category?featuredshop=${options.featuredshop}`,
            urlRedirect: true
          }
        ]
      },
      () => {
        this.nextPage()
      }
    )
  }

  async fetch(params) {
    const { page_no: page, page_size: pageSize } = params
    const { defaultId } = this.state
    const options = this.$instance.router.params
    const { userId } = Taro.getStorageSync('userinfo')
    const distributionShopId = Taro.getStorageSync('distribution_shop_id')

    const query = {
      ...this.state.query,
      category_id: defaultId,
      item_type: 'normal',
      page,
      shop_user_id: distributionShopId || userId,
      pageSize
    }

    if (options.featuredshop || options.uid) {
      query.shop_user_id = options.featuredshop || options.uid
    }

    const { list: goodsList, total_count: total } = await api.distribution.getShopGoods(query)

    const nItem = pickBy(goodsList, {
      img: 'pics[0]',
      item_id: 'item_id',
      goods_id: 'goods_id',
      title: 'itemName',
      desc: 'brief',
      isOutSale: ({ store }) => !store || store <= 0,
      distributor_id: 'distributor_id',
      price: ({ price }) => (price / 100).toFixed(2),
      //promoter_price: ({ promoter_price }) => (promoter_price/100).toFixed(2),
      market_price: ({ market_price }) => (market_price / 100).toFixed(2)
    })

    this.setState({
      contentList: [...this.state.contentList, ...nItem],
      query
    })
    //Taro.stopPullDownRefresh()
    return {
      total
    }
  }

  handleClickCategoryNav = (idx, value) => {
    console.warn(idx)
    if (this.state.page.isLoading) return

    if (idx !== this.state.currentIndex) {
      this.resetPage()
      this.setState({
        contentList: []
      })
    }

    this.setState(
      {
        currentIndex: idx,
        defaultId: value.id
      },
      () => {
        this.nextPage()
      }
    )
  }

  handleClick = (current) => {
    const cur = this.state.localCurrent

    if (cur !== current) {
      const curTab = this.state.tabList[current]
      const { url, urlRedirect } = curTab

      const fullPath = getCurrentRoute(this.$instance.router).fullPath.split('?')[0]
      if (url && fullPath !== url) {
        if (
          !urlRedirect ||
          (url === "/subpages/member/index" && !S.getAuthToken())
        ) {
          Taro.navigateTo({ url });
        } else {
          Taro.redirectTo({ url });
        }
      }
    }
  }

  handleClickItem = (item) => {
    const options = this.$instance.router.params
    const { userId } = Taro.getStorageSync('userinfo')
    const distributionShopId = Taro.getStorageSync('distribution_shop_id')
    let id = distributionShopId || userId

    if (options.featuredshop || options.uid) {
      id = options.featuredshop || options.uid
    }

    const { goods_id, distributor_id } = item
    let url = ''
    if (item.isOutSale) return false
    if (goods_id) {
      url = `/pages/item/espier-detail?id=${goods_id || ''}&dtid=${distributor_id}&uid=${id}`
    }
    if (url) {
      Taro.navigateTo({
        url
      })
    }
  }
  render() {
    const {
      list,
      hasSeries,
      tabList,
      localCurrent,
      contentList,
      currentIndex,
      page,
      scrollTop
    } = this.state
    const isHaveLeft = list.length > 0
    return (
      <View className='page-category-index'>
        <SpNavBar title='分类' leftIconType='chevron-left' fixed='true' />
        <View
          className={`${
            hasSeries && tabList.length !== 0 ? 'category-comps' : 'category-comps-not'
          }`}
        >
          <View className='category-list'>
            {isHaveLeft > 0 && (
              <ScrollView className='category-list__nav' scrollY>
                <View className='category-nav'>
                  {list.map((item, index) => (
                    <View
                      className={classNames(
                        'category-nav__content',
                        currentIndex == index ? 'category-nav__content-checked' : null
                      )}
                      key={`${item.name}${index}`}
                      onClick={this.handleClickCategoryNav.bind(this, index, item)}
                    >
                      {item.hot && <Text className='hot-tag'></Text>}
                      {item.name}
                    </View>
                  ))}
                </View>
              </ScrollView>
            )}
            {/*右*/}
            <View className={`shop-category__wrap ${!isHaveLeft && 'all'}`}>
              <ScrollView
                className='category-list__scroll'
                scrollY
                scrollTop={scrollTop}
                scrollWithAnimation
                onScroll={this.handleScroll}
                onScrollToLower={this.nextPage}
              >
                <View className='grid-goods'>
                  {contentList.length > 0 &&
                    contentList.map((item) => (
                      <View
                        className={`goodItem ${item.isOutSale && 'outSale'}`}
                        key={item.item_id}
                        onClick={this.handleClickItem.bind(this, item)}
                      >
                        <View className='left'>
                          <SpImg
                            lazyLoad
                            width='400'
                            mode='aspectFill'
                            img-class='goodImg'
                            src={item.img}
                          />
                        </View>
                        <View className='right'>
                          <View className='goodName'>{item.title}</View>
                          <View className='goodPrice'>
                            <Text className='symbol'>¥</Text>
                            {item.price}
                          </View>
                        </View>
                      </View>
                    ))}
                </View>
                {page.isLoading ? <Loading>正在加载...</Loading> : null}
                {!page.isLoading && !page.hasNext && !contentList.length && (
                  <SpNote img='trades_empty.png'>暂无数据~</SpNote>
                )}
              </ScrollView>
            </View>
          </View>
        </View>
        <AtTabBar fixed tabList={tabList} onClick={this.handleClick} current={localCurrent} />
      </View>
    )
  }
}
