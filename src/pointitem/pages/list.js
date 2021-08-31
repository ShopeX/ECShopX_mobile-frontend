import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { withPager, withBackToTop } from '@/hocs'
import { AtDrawer, AtInput } from 'taro-ui'
import { BackToTop, Loading, SpNote, NavBar, TabBar, HomeCapsule } from '@/components'
import api from '@/api'
import { Tracker } from "@/service";
import { classNames } from '@/utils'
import Header from './comps/header'
import Tabs from './comps/tabs'
import GoodsItem from './comps/goods_item'
import FilterBlock from './comps/filter-block'
import throttle from 'lodash/throttle'
import CustomHeader from './comps/headerContainer'
import S from '@/spx'
import './list.scss'
import {
  customName
} from '@/utils/point';
@connect(({
  member,
  colors
}) => ({
  favs: member.favs,
  colors: colors.current
}))
@withPager
export default class List extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ...this.state,
      //当前筛选菜单下标
      curFilterIdx: 0,
      //筛选菜单
      filterList: [
        { title: '综合' },
        { title: '销量' },
        { title: '价格', sort: -1 },
      ],
      useInfo: {
        username: '',
        avatar: '',
        point: ""
      },
      activeRef: false,
      //获取用户信息
      userInfo: {},
      query: null,
      list: [],
      showDrawer: false,
      info: {},
      filterConfig: {
        brandList: [],
        categoryList: [],
        scoreInternel: [],
        brandVisible: false,
        categoryVisible: false,
        pointVisible: false
      },
      filterParams: {
        brand: [],
        category: []
      },
      navbarHeight: undefined,
      homeIconInfo: {
        height: 0,
        top: 0,
        left: 0
      },
      paddindTop: 0,
      // 是否首页
      isHome: false,
      filterDom: null,
      filterActive: false,
      inputValue: '',
      sortOrder: null,
    }
  }

  config = {
    enablePullDownRefresh: true,
    onReachBottomDistance: 80,
    backgroundTextStyle: 'dark',
    navigationBarTitleText: '',
    navigationBarTextStyle: 'white',
    navigationStyle: 'custom'
  }

  async componentDidMount() {
    const { keywords, dis_id, cat_id, main_cat_id } = this.$router.params;

    this.init();

    this.fetchUserInfo();

    this.fetchConfig();

    this.setState({
      query: {
        keywords: keywords ? keywords : undefined,
        item_type: 'normal',
        distributor_id: dis_id ? dis_id : undefined,
        category: cat_id ? cat_id : undefined,
        category_id: main_cat_id ? main_cat_id : undefined
      },
    }, () => {
      this.nextPage()
    })
  }

  componentWillReceiveProps(next) {
    if (Object.keys(this.props.favs).length !== Object.keys(next.favs).length) {
      setTimeout(() => {
        const list = this.state.list.map(item => {
          item.is_fav = Boolean(next.favs[item.item_id])
          return item
        })
        this.setState({
          list
        })
      })
    }
  }


  getWechatNavBarHeight = () => {
    //statusBarHeight为状态栏高度
    const { screenWidth } = Taro.getSystemInfoSync();
    const { top, height, right } = Taro.getMenuButtonBoundingClientRect();
    this.setState({
      homeIconInfo: {
        height: height,
        top: top,
        left: screenWidth - right
      }
    })
  }

  componentDidShow() {
    this.getWechatNavBarHeight()
    this.fetchUserInfo()

    const options = this.$router.params;

  }

  async fetchUserInfo() {

    const [res, { point }] = await Promise.all([api.member.memberInfo(), api.pointitem.getMypoint()])

    const userObj = {
      username: res.memberInfo.nickname || res.memberInfo.username || res.memberInfo.mobile,
      avatar: res.memberInfo.avatar,
    }

    this.setState({
      useInfo: {
        username: userObj.username,
        avatar: userObj.avatar,
        point
      }
    })

  }

  getLeafChild = (list) => {
    //获取分类的叶子节点
    function queryList(json, arr) {
      for (var i = 0; i < json.length; i++) {
        var sonList = json[i].children || [];
        if (sonList.length == 0) {
          arr.push(json[i]);
        } else {
          queryList(sonList, arr);
        }
      }
      return arr;
    }
    return queryList(list, []);
  }

  async fetchConfig(params) {
    const query = {
      page: 1,
      item_type: 'normal',
      pageSize: 20
    }
    const [
      {
        list,
        brand_list: { list: brand_list }
      },
      { screen: { brand_openstatus, cat_openstatus, point_openstatus, point_section } },
      categoryList
    ] = await Promise.all([
      api.pointitem.search(query),
      api.pointitem.getPointitemSetting(),
      api.pointitem.getPointitemCategory({ have_items: true })],
    );


    list.map((item) => {
      item.imgUrl = "";
      if (item.pics.length > 0) {
        item.imgUrl = item.pics[0];
      }
    });

    this.setState({
      list: [
        ...list
      ],
      filterConfig: {
        ...this.state.filterConfig,
        scoreInternel: point_section,
        categoryList: this.getLeafChild(categoryList),
        brandList: brand_list,
        brandVisible: brand_openstatus,
        categoryVisible: cat_openstatus,
        pointVisible: point_openstatus
      }
    })
  }

  async fetch(params) {

    const { page_no: page, page_size: pageSize } = params

    const { filterParams: { brand, category, start_price, end_price } } = this.state;

    const query = {
      ...this.state.query,
      page,
      item_type: 'normal',
      pageSize,
      brand_id: brand ? brand[0] : undefined,
      category_id: category ? category[0] : undefined,
      start_price,
      end_price
    }
    let total;
    const { list: prevState } = this.state;
    try {
      const [
        {
          list,
          total_count,
        }
      ] = await Promise.all([
        api.pointitem.search(query)
      ]);

      total = total_count;

      list.map((item) => {
        item.imgUrl = "";
        if (item.pics.length > 0) {
          item.imgUrl = item.pics[0];
        }
      });

      this.setState({
        list: [
          ...prevState,
          ...list
        ],
      })

    } catch (e) {
      total = 0;
      console.log(e);
    }

    return {
      total
    }

  }

  startTrack() {
    this.endTrack();
    const observer = Taro.createIntersectionObserver(this.$scope, {
      observeAll: true
    });
    observer
      .relativeToViewport({ bottom: 0 })
      .observe(".goods-list__item", res => {
        console.log("res.intersectionRatio:", res.intersectionRatio);
        if (res.intersectionRatio > 0) {
          const { id } = res.dataset;
          const { list } = this.state
          const curGoods = list.find(item => item.item_id == id);
          const { item_id, title, market_price, price, img } = curGoods;
          Tracker.dispatch("EXPOSE_SKU_COMPONENT", {
            goodsId: item_id,
            title: title,
            market_price: market_price * 100,
            price: price * 100,
            imgUrl: img
          });
        }
      });

    this.observe = observer;
  }

  endTrack() {
    if (this.observer) {
      this.observer.disconnect();
      this.observe = null;
    }
  }


  filterOpen = (flag) => {
    this.setState({
      showDrawer: flag
    })
  }

  handleOpenFilter = () => {
    this.filterOpen(true);
  }

  handleFilterChange = (data) => {
    // this.setState({
    //   showDrawer: true
    // })
    const { current, sort } = data
    //goodsSort null-综合 1-销量倒序（暂时无正序） 2-积分价格倒序 3-积分价格正序 

    const query = {
      ...this.state.query,
      goodsSort: current === 0
        ? null
        : current === 1
          ? 1
          : (sort > 0 ? 3 : 2)
    }


    // if(this.state.curFilterIdx===current){
    //   //点击相同菜单项不用操作
    //   return ;
    // }

    this.resetPage()

    this.setState({
      curFilterIdx: current,
      query,
      list: [],
    }, () => {
      this.nextPage()
    })
  }

  handleInputConfirm = (value) => {
    const query = {
      ...this.state.query,
      keywords: value
    }
    this.resetPage()
    this.setState({
      list: [],
      query
    }, () => {
      console.log(this.state)
      this.nextPage()
    })
  }

  handleClickItemF(idx) {
    const item = this.state.filterList[idx] || {}

    let sortOrder = null

    if (item.sort) {
      sortOrder = idx === this.state.curFilterIdx ? this.state.sortOrder * -1 : item.sort
    }

    this.setState({
      curFilterIdx: idx,
      sortOrder
    })

    this.handleFilterChange({
      current: idx,
      sort: sortOrder
    })
  }


  handleClickItem = (item) => {
    if (item.goods_store == 0) {
      return;
    }
    const { item_id, title, market_price, price, img } = item;
    Tracker.dispatch("TRIGGER_SKU_COMPONENT", {
      goodsId: item_id,
      title: title,
      market_price: market_price * 100,
      price: price * 100,
      imgUrl: img
    });
    const url = `/pages/item/espier-detail?id=${item.item_id}&dtid=${item.distributor_id||0}&type=pointitem`
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

  handleClickSearchParams = (type) => {
    this.resetPage()
    this.setState({
      showDrawer: false,
      list: [],
    }, () => {
      this.nextPage()
    })
  }

  handleResetFilter = () => {
    this.setState({
      filterParams: {
        brand: [],
        category: []
      }
    })
  }


  handleClickFilterBlock = ({ id, type, start, end, active }) => {
    const { filterParams } = this.state;
    let newFilterParams;
    if (type === 'brand') {
      if (filterParams.brand[0] === id) {
        newFilterParams = {
          ...filterParams,
          brand: [],
        }
      } else {
        newFilterParams = {
          ...filterParams,
          brand: [id],
        }
      }

    } else if (type === 'category') {
      if (filterParams.category[0] === id) {
        newFilterParams = {
          ...filterParams,
          category: [],
        }
      } else {
        newFilterParams = {
          ...filterParams,
          category: [id],
        }
      }

    } else if (type === 'point') {
      if (active) {
        newFilterParams = {
          ...filterParams,
          start_price: undefined,
          end_price: undefined
        }
      } else {
        newFilterParams = {
          ...filterParams,
          start_price: start,
          end_price: end
        }
      }

    }
    this.setState({
      filterParams: newFilterParams
    })
  }

  handleChangeStartprice = (value) => {
    console.log("handleChangeStartprice", value)
    this.setState({
      filterParams: {
        ...this.state.filterParams,
        start_price: value
      }
    })
  }

  handleChangeEndprice = (value) => {
    this.setState({
      filterParams: {
        ...this.state.filterParams,
        end_price: value
      }
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

  // 页面滚动
  onPageScroll = throttle((res) => {
    const { showBackToTop, statusBarHeight, paddindTop } = this.state
    const { scrollTop } = res
    const topOffset = statusBarHeight + 40
    const query = Taro.createSelectorQuery()
    query.select('.filter').boundingClientRect(({ top }) => {
      if (
        top <= topOffset
        && (paddindTop < topOffset || paddindTop > 0)
      ) {
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
    }).exec()

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

  cartNode = node => this.filterRef = node

  handleFocus = () => {
    this.activeRef = true;
    this.setState({
      filterActive: true
    })
  }

  handleBlur = () => {
    this.activeRef = false;
    this.setState({
      filterActive: false,
      inputValue: ''
    })
  }

  handleInputChange = (e) => {
    let value;
    if (this.activeRef) {
      value = e;
    } else {
      value = "";
    }
    this.setState({
      inputValue: value
    })
  }

  scrollBackToTop = () => {
    Taro.pageScrollTo({
      scrollTop: 0
    })
  }

  // 清除搜索
  handleClear = (e) => {
    e.preventDefault && e.preventDefault()
    e.stopPropagation && e.stopPropagation() 
    
    this.resetPage()
    const query = {
      ...this.state.query,
      keywords: ''
    }
    this.setState({
      query,
      list: [], 
    }, () => { 
      this.nextPage()
    })
  }


  render() {
    const {
      list,
      curFilterIdx,
      filterList,
      showBackToTop,
      scrollTop,
      page,
      showDrawer,
      useInfo,
      filterConfig: {
        brandList,
        categoryList,
        scoreInternel,
        brandVisible,
        categoryVisible,
        pointVisible
      },
      filterParams: {
        brand,
        category,
        start_price,
        end_price
      },
      homeIconInfo,
      statusBarHeight,
      paddindTop,
      isHome,
      filterActive,
      inputValue,
      sortOrder
    } = this.state

    const isHidden = !brandVisible && !categoryVisible && !pointVisible;

    const {
      colors
    } = this.props;
    const { isTabBar = '' } = this.$router.params
    const noData = !page.isLoading && !page.hasNext && !list.length;
    const searchTop = paddindTop != 0 ? `${paddindTop + 20}px` : '50%';

    console.log('-----sortOrder----', sortOrder)
    // console.log('-----useInfo----', useInfo)
    // console.log('-----filterConfig----', this.state.filterConfig)
    return (
      <View className='page-pointitem-home'>

        <CustomHeader isWhite={paddindTop > 0} isHome={true} statusBarHeight={statusBarHeight} />

        <View className='pointitem-banner'>
          <View className='pointitem-def'>
            <Image
              mode='aspectFill'
              className='banner-img'
              src={`${APP_IMAGE_CDN}/black.png`}
            />
          </View>
          <Header useInfo={useInfo} />
        </View>

        <View className={classNames('filter-bar', { 'active': filterActive }, `goods-list__tabs filter`)} id="filter" style={`padding-top: ${paddindTop}px; transition: padding ${paddindTop > 20 ? paddindTop * 3.5 : 300}ms linear;`}>
          {/* <Icon className='iconfont search-icon' type='search' size='14' color='#999999'></Icon> */}
          <View class="text">
            {
              filterList.map((item, idx) => {
                const isCurrent = curFilterIdx === idx

                return (
                  <View
                    className={classNames('filter-bar__item', isCurrent && 'filter-bar__item-active', item.key && `filter-bar__item-${item.key}`, item.sort ? `filter-bar__item-sort filter-bar__item-sort-${sortOrder > 0 ? 'asc' : 'desc'}` : null)}
                    style={isCurrent ? 'color: #d42f29' : 'color: #666'}
                    onClick={this.handleClickItemF.bind(this, idx)}
                    key={item.title}
                  >
                    <Text className='filter-bar__item-text'>{item.title}</Text>
                    {/* <View className='active-bar' style={'background: ' + colors.data[0].primary}></View> */}
                  </View>
                )
              })
            }
          </View>
          <View class='action' >
            {!isHidden && <View class="filter" onClick={this.handleOpenFilter}><View class="textFilter">筛选</View><View className={"iconfont icon-filter"}></View></View>}
            <View class="searchInput">

            </View>

          </View>
          <View className={classNames('searchInput', 'searchInput-P', [{ 'isHidden': isHidden },{'active':filterActive}])} style={`top:${searchTop}; transition: top ${paddindTop > 20 ? paddindTop * 3.5 : 300}ms linear;`}>
            {/* <View
              className='iconfont icon-search'
            >
              <Text className='txt'></Text>
            </View> */}
            <AtInput placeholder={filterActive?'搜索积分商品':undefined} clear value={inputValue} onFocus={this.handleFocus} onBlur={this.handleBlur} onConfirm={this.handleInputConfirm} onChange={this.handleInputChange} />

            {<Icon className={classNames('iconfont','icon-search',{
              [`show`]:filterActive
            }) }type='search' size='14' color='#999999'></Icon>}

            {filterActive && <View
              className={`at-icon at-icon-close-circle ${inputValue && 'show'}`}
              onClick={this.handleClear.bind(this)} 
            ></View>}
          </View>
          {this.props.children}
        </View>

        <View className={classNames('main', [
          { 'noData': noData }
        ])}  >
          {
            list.map(item => {
              return (
                <View
                  className="goods-list__item"
                  key={item.item_id}
                  data-id={item.item_id}
                >
                  <GoodsItem
                    key={item.item_id}
                    info={item}
                    isStoreOut={item.goods_store == 0}
                    onClick={() => this.handleClickItem(item)}
                    onStoreClick={() => this.handleClickStore(item)}
                  />
                </View>
              );
            })
          }
          {
            page.isLoading
              ? <Loading className='loadingContent'>正在加载...</Loading>
              : null
          }
          {
            noData && (<SpNote img='trades_empty.png'>暂无数据~</SpNote>)
          }
        </View>

        <AtDrawer
          show={showDrawer}
          right
          mask
          width={`${Taro.pxTransform(630)}`}
          onClose={this.filterOpen.bind(false)}
          class='custom_drawer'
        >
          {
            <View class="wrapper-filter">
              {brandVisible && <View class="brand" >
                <View class="title">品牌</View>
                <View class="content-filter">
                  {
                    brandList.map((item, index) => {
                      return (
                        <FilterBlock info={item} type="brand" active={brand.indexOf(item.attribute_id) > -1} onClickItem={this.handleClickFilterBlock} />
                      )
                    })
                  }
                </View>
              </View>}
              {categoryVisible && <View class="category">
                <View class="title">分类</View>
                <View class="content-filter">
                  {
                    categoryList.map((item, index) => {
                      return (
                        <FilterBlock info={item} type="category" active={category.indexOf(item.category_id) > -1} onClickItem={this.handleClickFilterBlock} />
                      )
                    })
                  }
                </View>
              </View>}
              {pointVisible && <View class="score">
                <View class="title">{customName("积分区间")}</View>
                <View class="input-wrap">
                  <AtInput placeholder={customName("最低积分值")} value={start_price} onChange={this.handleChangeStartprice} />
                  <View class='text'>~</View>
                  <AtInput placeholder={customName("最高积分值")} value={end_price} onChange={this.handleChangeEndprice} />
                </View>
                {
                  scoreInternel.map((item, index) => {
                    return (
                      <FilterBlock info={item} type="score" active={start_price == item[0] && end_price == item[1]} onClickItem={this.handleClickFilterBlock.bind(this, { type: "point", start: item[0], end: item[1], active: start_price == item[0] && end_price == item[1] })} />
                    )
                  })
                }
              </View>}
            </View>
          }

          <View className='drawer-footer'>
            <Text className='drawer-footer__btn' onClick={this.handleResetFilter}>重置</Text>
            <Text className='drawer-footer__btn drawer-footer__btn_active' onClick={this.handleClickSearchParams.bind(this, 'submit')}>确定并筛选</Text>
          </View>
        </AtDrawer>


        <BackToTop
          show={showBackToTop}
          onClick={this.scrollBackToTop}
          bottom={30}
        />
      </View>
    )
  }
}
