import React, { Component } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, Button, Image, Input } from '@tarojs/components'
import { AtTabBar } from 'taro-ui'
import { BackToTop, Loading, SpNavBar, SpImg, SpNote } from '@/components'
import S from '@/spx'
import api from '@/api'
import throttle from 'lodash/throttle'
import { withPager } from '@/hocs'
import { getCurrentRoute, pickBy } from '@/utils'
import entry from '@/utils/entry'
import CustomHeader from './comps/header'

import './shop-home.scss'

@withPager
export default class DistributionShopHome extends Component {
  $instance = getCurrentInstance();
  constructor(props) {
    super(props)

    this.state = {
      ...this.state,
      info: {},
      localCurrent: 0,
      curFilterIdx: 0,
      list: [],
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
      userId: '',
      // 商品总数
      goods_total: 0,
      // 搜索参数
      params: {
        keywords: '',
        shop_user_id: '',
        goodsSort: ''
      },
      // 是否聚焦
      isFocus: false,
      // 是否显示搜索
      showSearch: false,
      // 搜索关键词
      keywords: '',
      // 价格排序, true为升 false为降
      sort: true,
      // 是否加载
      isLoading: false,
      // 状态栏高度
      statusBarHeight: 44,
      paddindTop: 0,
      // 是否首页
      isHome: false
    }
  }

  componentDidMount() {
    this.getShopInfo()
    this.init()
  }

  componentDidShow() {
    this.handleCloseSearch()
  }

  // 分享
  onShareAppMessage() {
    const { info: shopInfo, userId } = this.state
    const title = shopInfo.shop_name || `${shopInfo.username}的小店`
    return {
      title: shopInfo.share_title || title,
      imageUrl: shopInfo.applets_share_img || shopInfo.shop_pic,
      path: `/marketing/pages/distribution/shop-home?uid=${userId}`
    }
  }

  // 下拉刷新
  onPullDownRefresh = () => {
    this.getShopInfo()
  }

  // 页面滚动
  onPageScroll = throttle((res) => {
    const { showBackToTop, statusBarHeight, paddindTop } = this.state
    const { scrollTop } = res
    const topOffset = statusBarHeight + 40
    const query = Taro.createSelectorQuery()
    query
      .select('.filter')
      .boundingClientRect(({ top }) => {
        if (top <= topOffset && (paddindTop < topOffset || paddindTop > 0)) {
          const diffTop = Math.abs(top - topOffset)
          if (diffTop !== paddindTop) {
            this.setState({
              paddindTop: top > 0 ? diffTop : topOffset
            })
          }
        } else if (paddindTop !== 0) {
          this.setState({
            paddindTop: 0
          })
        }
      })
      .exec()

    if (scrollTop > 300 && !showBackToTop) {
      this.setState({
        showBackToTop: true
      })
    } else if (scrollTop <= 300 && showBackToTop) {
      this.setState({
        showBackToTop: false
      })
    }
  }, 100)

  // 触底事件
  onReachBottom = () => {
    this.nextPage()
  }

  // 回到顶部
  scrollBackToTop = () => {
    Taro.pageScrollTo({
      scrollTop: 0
    })
  }

  // 获取设备信息
  init = async () => {
    const pages = Taro.getCurrentPages()
    const isHome = pages[pages.length - 2]
    const { statusBarHeight = 44 } = await Taro.getSystemInfo()
    this.setState({
      statusBarHeight,
      isHome: !isHome
    })
  }

  // 获取小店信息
  getShopInfo = async () => {
    const options = this.$instance.router.params
    const { tabList } = this.state
    const { userId } = Taro.getStorageSync('userinfo')
    const distributionShopId = Taro.getStorageSync('distribution_shop_id')
    // 执行全局绑定
    entry.entryLaunch(options, false)
    const param = {
      user_id: distributionShopId || userId
    }

    if (options.featuredshop || options.uid) {
      param.user_id = options.featuredshop || options.uid
    }

    const res = await api.distribution.info(param)
    const {
      shop_name,
      brief,
      shop_pic = '',
      username = '',
      headimgurl,
      is_valid,
      nickname = '',
      mobile = '',
      banner_img = '',
      share_title = '',
      headquarters_logo = '',
      applets_share_img = '',
      isOpenPromoterInformation = true
    } = res

    if (!is_valid) {
      Taro.reLaunch({
        url: '/pages/index'
      })
    }
    tabList[0].url += `?featuredshop=${param.user_id}`
    tabList[1].url += `?featuredshop=${param.user_id}`
    // 是否当前页面
    const isCurrentPage = this.$instance.router.path.indexOf('distribution/shop-home') !== -1
    if (isCurrentPage) {
      Taro.setNavigationBarTitle({
        title: shop_name || `${nickname || username || mobile}的小店`
      })
    }

    this.setState(
      {
        info: {
          username: nickname || username || mobile,
          headimgurl: isOpenPromoterInformation ? headimgurl : headquarters_logo,
          shop_name,
          brief,
          is_valid,
          shop_pic: isOpenPromoterInformation ? shop_pic : banner_img,
          share_title,
          applets_share_img
        },
        tabList,
        userId: param.user_id
      },
      () => {
        setTimeout(() => {
          this.resetGet()
        })
      }
    )
  }

  // 获取小店商品列表
  fetch = async (params) => {
    const { userId } = this.state
    const { page_no: page, page_size: pageSize } = params
    const query = {
      page,
      pageSize,
      ...this.state.params,
      shop_user_id: userId
    }

    const { list, total_count: total, goods_total = 0 } = await api.distribution.getShopGoods(query)

    const nList = pickBy(list, {
      img: 'pics[0]',
      item_id: 'item_id',
      title: 'itemName',
      distributor_id: 'distributor_id',
      type: 'type',
      isOutSale: ({ store }) => !store || store <= 0,
      price: ({ price }) => (price / 100).toFixed(2),
      member_price: ({ member_price }) => (member_price / 100).toFixed(2),
      market_price: ({ market_price }) => (market_price / 100).toFixed(2),
      desc: 'brief'
    })

    this.setState({
      list: [...this.state.list, ...nList],
      goods_total
    })

    // 停止刷新
    Taro.stopPullDownRefresh()

    return {
      total
    }
  }

  // 点击商品跳转
  handleClickItem = (item) => {
    if (item.isOutSale) return false
    const { userId } = this.state
    const url = `/pages/item/espier-detail?id=${item.item_id}&dtid=${item.distributor_id}&uid=${userId}`
    setTimeout(() => {
      Taro.navigateTo({
        url
      })
    })
  }

  // 切换tab
  handleClick = (current) => {
    const cur = this.state.localCurrent
    if (cur !== current) {
      const curTab = this.state.tabList[current]
      const { url, urlRedirect } = curTab

      const fullPath = getCurrentRoute(this.$instance.router).fullPath.split('?')[0]
      if (url && fullPath !== url) {
        if (!urlRedirect || (url === '/pages/member/index' && !S.getAuthToken())) {
          Taro.navigateTo({ url })
        } else {
          Taro.redirectTo({ url })
        }
      }
    }
  }

  // 显示搜索
  handleShowSearch = (e) => {
    this.handleDisable(e)
    const { showSearch } = this.state
    if (!showSearch) {
      this.setState(
        {
          showSearch: true
        },
        () => {
          // 延迟获取焦点
          setTimeout(() => {
            this.setState({
              isFocus: true
            })
          }, 300)
        }
      )
    }
  }

  // 搜索输入框
  searchInput = (data) => {
    const { value = '' } = data.detail || {}
    this.setState({
      keywords: value
    })
  }

  // 确认搜索
  handleConfirm = () => {
    const { keywords, params } = this.state
    params.keywords = keywords.trim()
    this.setState(
      {
        showSearch: false,
        isFocus: false,
        keywords: params.keywords,
        params
      },
      () => {
        this.resetGet()
      }
    )
  }

  // 防止点击穿透
  handleDisable = (e) => {
    e.preventDefault && e.preventDefault()
    e.stopPropagation && e.stopPropagation()
  }

  // 清除搜索
  handleClear = (e) => {
    e.preventDefault && e.preventDefault()
    e.stopPropagation && e.stopPropagation()
    const { params } = this.state
    params.keywords = ''
    this.setState(
      {
        params,
        keywords: '',
        isFocus: false,
        showSearch: false
      },
      () => {
        this.resetGet()
      }
    )
  }

  // 重新获取
  resetGet = () => {
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

  // 点击搜索蒙层
  handleCloseSearch = (e = {}) => {
    e.preventDefault && e.preventDefault()
    e.stopPropagation && e.stopPropagation()
    const { params } = this.state
    this.setState({
      keywords: params.keywords,
      showSearch: false,
      isFocus: false
    })
  }

  // 筛选切换
  handleFilterChange = (filterInfo) => {
    const { type } = filterInfo
    const { curFilterIdx, sort, params } = this.state
    if (curFilterIdx === type && type !== 2) return
    if (curFilterIdx === type && type === 2) {
      params.goodsSort = !sort ? 3 : 2
    } else {
      params.goodsSort = type === 0 ? '' : 1
    }

    this.setState(
      {
        params,
        curFilterIdx: type,
        sort: curFilterIdx === type && type === 2 ? !sort : true
      },
      () => {
        this.resetGet()
      }
    )
  }

  render() {
    const {
      showBackToTop,
      tabList,
      localCurrent,
      info,
      sort,
      list,
      goods_total,
      params,
      page,
      showSearch,
      keywords,
      curFilterIdx,
      isFocus,
      statusBarHeight,
      paddindTop,
      isHome
    } = this.state

    // 筛选选项
    const filterList = [
      {
        title: '综合',
        type: 0
      },
      {
        title: '销量',
        type: 1
      },
      {
        title: '价格',
        type: 2
      }
    ]

    if (!info.is_valid) {
      return <Loading />
    }

    return (
      <View className='page-distribution-shop'>
        <CustomHeader isWhite={paddindTop > 0} isHome={isHome} statusBarHeight={statusBarHeight} />
        <SpNavBar title='小店' leftIconType='chevron-left' fixed='true' />
        <View className='shop-banner'>
          <View className='shop-def'>
            <Image
              mode='aspectFill'
              className='banner-img'
              src={info.shop_pic || `${process.env.APP_IMAGE_CDN}/black.png`}
            />
          </View>
          <View className='shop-info'>
            <View className='left'>
              <Image
                className='shopkeeper-avatar'
                src={info.headimgurl || require('../../assets/shop.png')}
                mode='aspectFill'
              />
              <View className='shop-name-goods'>
                <View className='names'>{info.shop_name || `${info.username}的小店`}</View>
                <View className='num'>
                  {goods_total}
                  <View className='text'>件商品</View>
                </View>
              </View>
            </View>
            <View className='right'>
              <Button className='share' open-type='share'>
                <View className='iconfont icon-share'></View>
                <View className='text'>分享店铺</View>
              </Button>
            </View>
          </View>
        </View>
        <View
          className='filter'
          style={`padding-top: ${paddindTop}px; transition: padding ${
            paddindTop > 20 ? paddindTop * 3.5 : 300
          }ms linear;`}
        >
          <View className='filterMain'>
            {filterList.map((item) => (
              <View
                className={`filterItem ${curFilterIdx === item.type && 'active'}`}
                key={item.type}
                onClick={this.handleFilterChange.bind(this, item)}
              >
                {item.title}
                {item.type === 2 && item.title === '价格' && (
                  <View className={`sort ${sort ? 'down' : 'up'}`}></View>
                )}
              </View>
            ))}

            <View
              className={`searchContent ${showSearch && 'unfold'}`}
              onClick={this.handleShowSearch.bind(this)}
            >
              <View className='iconfont icon-search'>
                <Text className='txt'>{params.keywords}</Text>
              </View>
              {showSearch && (
                <View className='inputContent'>
                  <Input
                    className='keywords'
                    value={keywords}
                    focus={isFocus}
                    placeholder='搜索小店商品'
                    confirmType='search'
                    onConfirm={this.handleConfirm.bind(this)}
                    onBlur={this.handleCloseSearch.bind(this)}
                    onInput={this.searchInput.bind(this)}
                  />
                  <View
                    className={`at-icon at-icon-close-circle ${keywords.length > 0 && 'show'}`}
                    onClick={this.handleClear.bind(this)}
                  ></View>
                </View>
              )}
            </View>
          </View>
        </View>
        <View className='main'>
          {list.map((item) => (
            <View
              key={item.item_id}
              className='goodItem'
              onClick={this.handleClickItem.bind(this, item)}
            >
              <View className={`content ${item.isOutSale && 'disable'}`}>
                <View className='imgContent'>
                  <SpImg
                    lazyLoad
                    width='400'
                    mode='aspectFill'
                    img-class='goodImg'
                    src={item.img}
                  />
                  <View className='outSale'></View>
                </View>
                <View className='info'>
                  <View className='goodName'>{item.title}</View>
                  <View className='price'>
                    <Text className='symbol'>¥</Text>
                    {item.price}
                  </View>
                </View>
              </View>
            </View>
          ))}
          {page.isLoading ? <Loading className='loadingContent'>正在加载...</Loading> : null}
          {!page.isLoading && !page.hasNext && list.length <= 0 && (
            <SpNote className='empty' img='trades_empty.png'>
              暂无数据~
            </SpNote>
          )}
        </View>
        <BackToTop show={showBackToTop} onClick={this.scrollBackToTop.bind(this)} />

        <AtTabBar fixed tabList={tabList} onClick={this.handleClick} current={localCurrent} />
      </View>
    )
  }
}
