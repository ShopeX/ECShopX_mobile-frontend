import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Image, Text, Button } from '@tarojs/components'
import { Loading, SpNote } from '@/components'
import { classNames, pickBy, getCurrentRoute } from '@/utils'
import { AtTabBar } from 'taro-ui'
import { withPager, withBackToTop } from '@/hocs'
import api from '@/api'

import './shop-category.scss'

@withPager
@withBackToTop
export default class DistributionShopCategory extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ...this.state,
      curTabIdx: 0,
      currentIndex: 0,
      tabList: [
        {
          title: '推广商品',
          iconType: 'home',
          iconPrefixClass: 'icon',
          url: '/marketing/pages/distribution/goods',
          urlRedirect: true
        },
        {
          title: '分类',
          iconType: 'category',
          iconPrefixClass: 'icon',
          url: '/marketing/pages/distribution/good-category',
          urlRedirect: true
        }
      ],
      contentList: [],
      list: [],
      hasSeries: false,
      isChanged: false,
      localCurrent: 1,
      defaultId: 0,
      shop_pic: '',
      // 上下架商品
      goodIds: []
    }
  }

  componentDidMount() {
    Taro.hideShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    const { status } = this.$router.params
    const { tabList } = this.state
    tabList[0].url += `?status=${status}`
    this.setState({
      tabList
    })
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
    const query = {
      category_level: 2
    }

    const { userId } = Taro.getStorageSync('userinfo')
    const distributionShopId = Taro.getStorageSync('distribution_shop_id')
    const param = distributionShopId
      ? {
          user_id: distributionShopId
        }
      : {
          user_id: userId
        }
    const { banner_img } = await api.distribution.shopBanner(param || null)
    const { list } = await api.distribution.getCategorylevel(query)
    //const [banner_img,list] = await Promise.all([api.distribution.shopBanner(param || null),api.distribution.getCategorylevel(query)])
    const cate_id = list[0].category_id
    const nList = pickBy(list, {
      name: 'category_name',
      id: 'category_id'
    })
    this.setState(
      {
        list: nList,
        defaultId: cate_id,
        hasSeries: false,
        shop_pic: banner_img
      },
      () => {
        this.nextPage()
      }
    )
  }

  async fetch(params) {
    const { page_no: page, page_size: pageSize } = params
    const { defaultId } = this.state
    // let distribution_shop_id = Taro.getStorageSync('distribution_shop_id')

    const query = {
      ...this.state.query,
      category: defaultId,
      item_type: 'normal',
      page,
      pageSize,
      // promoter_shop_id:distribution_shop_id,
      promoter_onsale: true,
      approve_status: 'onsale,only_show',
      is_promoter: true
    }
    //console.warn('83',params)
    const { list: goodsList, total_count: total } = await api.item.search(query)
    const nItem = pickBy(goodsList, {
      img: 'pics[0]',
      item_id: 'item_id',
      goods_id: 'goods_id',
      title: 'itemName',
      desc: 'brief',
      price: ({ price }) => (price / 100).toFixed(2),
      //promoter_price: ({ promoter_price }) => (promoter_price/100).toFixed(2),
      market_price: ({ market_price }) => (market_price / 100).toFixed(2)
    })
    const { userId } = Taro.getStorageSync('userinfo')
    const ids = nItem.map((item) => item.goods_id)
    const param = {
      goods_id: ids,
      user_id: userId
    }
    const { goods_id } = await api.distribution.items(param)
    this.setState({
      contentList: [...this.state.contentList, ...nItem],
      query,
      goodIds: goods_id
    })
    //Taro.stopPullDownRefresh()
    return {
      total
    }
  }
  //  handleClickCategoryNav = (gIndex,value) => {
  //    console.warn(value)
  //   this.setState({
  //     currentIndex: gIndex,
  //     defaultId:value.id
  //   },() => {
  //     this.nextPage()
  //   })
  //  // console.warn(categoryId)
  // }
  onShareAppMessage(res) {
    const { userId } = Taro.getStorageSync('userinfo')
    const { info } = res.target.dataset
    console.log(info)
    return {
      title: info.title,
      imageUrl: info.img,
      path: `/pages/item/espier-detail?id=${info.item_id}&uid=${userId}`
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
      const { url } = curTab

      const fullPath = getCurrentRoute(this.$router).fullPath.split('?')[0]
      if (url && fullPath !== url) {
        Taro.redirectTo({ url })
      }
    }
  }

  // 上下架
  handleClickItem = async (id) => {
    const { goodIds } = this.state
    const goodsId = { goods_id: id }
    const idx = goodIds.findIndex((item) => id === item)
    const isRelease = idx !== -1
    if (!isRelease) {
      const { status } = await api.distribution.release(goodsId)
      if (status) {
        this.setState(
          {
            goodIds: [...this.state.goodIds, id]
          },
          () => {
            Taro.showToast({
              icon: 'none',
              title: '上架成功'
            })
          }
        )
      }
    } else {
      const { status } = await api.distribution.unreleased(goodsId)
      if (status) {
        goodIds.splice(idx, 1)
        this.setState(
          {
            goodIds
          },
          () => {
            Taro.showToast({
              icon: 'none',
              title: '下架成功'
            })
          }
        )
      }
    }
  }

  render() {
    const { status } = this.$router.params
    const {
      list,
      hasSeries,
      tabList,
      localCurrent,
      contentList,
      currentIndex,
      page,
      scrollTop,
      goodIds
    } = this.state
    return (
      <View className='page-category-index good-category'>
        {/* <View className='category-banner'>
              <Image
                className='banner-img'
                src={shop_pic || null}
                mode='aspectFill'
          />
      </View> */}
        <View
          className={`${
            hasSeries && tabList.length !== 0 ? 'category-comps' : 'category-comps-not'
          }`}
        >
          {/* <SeriesItem
            isChanged={isChanged}
            info={list}
            content= {contentList}
            defaultId={defaultId}
            onClick = {this.handleClickCategory.bind(this)}
          /> */}
          <View className='category-list'>
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
            {/*右*/}
            <View className='shop-category__wrap'>
              <ScrollView
                className='category-list__scroll'
                scrollY
                scrollTop={scrollTop}
                scrollWithAnimation
                onScroll={this.handleScroll}
                onScrollToLower={this.nextPage}
              >
                <View className='grid-goods'>
                  {contentList.length &&
                    contentList.map((item) => {
                      const isRelease = goodIds.findIndex((n) => item.goods_id == n) !== -1
                      return (
                        <View key={item.goods_id} className='goodItem category'>
                          <View className='left'>
                            <Image className='itemImg' mode='aspectFix' src={item.img} />
                          </View>
                          <View className='right'>
                            <View className='goodName'>{item.title}</View>
                            <View className='goodPrice'>
                              <Text className='symbol'>¥</Text>
                              {item.price}
                            </View>
                            <View className='itemextra'>
                              <View className='itemStatus'>
                                {status === 'true' && (
                                  <View
                                    className={classNames(
                                      'goods-item__release-btn',
                                      isRelease ? 'released' : null
                                    )}
                                    onClick={this.handleClickItem.bind(this, item.item_id)}
                                  >
                                    {isRelease ? <Text>从小店下架</Text> : <Text>上架到小店</Text>}
                                  </View>
                                )}
                              </View>
                              <Button
                                className='itemShareBtn'
                                dataInfo={item}
                                openType='share'
                                size='small'
                              >
                                <Text class='iconfont icon-share2'></Text>
                              </Button>
                            </View>
                          </View>
                        </View>
                      )
                    })}
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
