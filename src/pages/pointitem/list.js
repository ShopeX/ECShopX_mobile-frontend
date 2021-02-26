import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { withPager, withBackToTop } from '@/hocs'
import { AtDrawer,AtInput } from 'taro-ui'
import { BackToTop, Loading,SpNote, NavBar, TabBar } from '@/components'
import api from '@/api'
import { Tracker } from "@/service";
import { classNames } from '@/utils' 
import Header from './comps/header'
import Tabs from './comps/tabs'
import GoodsItem from './comps/goods_item'
import FilterBlock from './comps/filter-block'
import S from '@/spx'
import './list.scss' 

@connect(({
  member
}) => ({
  favs: member.favs
}))
@withPager
@withBackToTop
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
        { title: '筛选' },
      ],
      //获取用户信息
      userInfo:{},
      query: null,
      list: [],   
      showDrawer: false, 
      info: {}, 
      filterConfig:{
        brandList:[],
        categoryList:[],
        scoreInternel:[],
        brandVisible:true,
        categoryVisible:true,
        scoreVisible:false
      },
      filterParams:{
        brand:[],
        category:[]
      }
    }
  }

  config = {
    // navigationBarBackgroundColor: '#2600b7',
    navigationStyle: 'custom',
    backgroundColor: '#F5F5F5'
  } 

  async componentDidMount() {
    const { keywords,dis_id,cat_id, main_cat_id } = this.$router.params 
 
    this.fetchUserInfo(); 

    this.fetchConfig();

    this.setState({
      query: {
        keywords: keywords?keywords:undefined,
        item_type: 'normal', 
        distributor_id: dis_id?dis_id:undefined, 
        category: cat_id ? cat_id : undefined,
        main_category: main_cat_id ? main_cat_id : undefined
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
  

  async fetchUserInfo(){
    if (!S.getAuthToken()) return 
    let resUser = null
    if(Taro.getStorageSync('userinfo')){
      resUser = Taro.getStorageSync('userinfo')
      this.setState({
        useInfo: {
          username: resUser.username,
          avatar: resUser.avatar, 
        }
      })
    }
    const [res,{point}] = await Promise.all([api.member.memberInfo(),api.pointitem.getMypoint()]) 
    const userObj = {
      username: res.memberInfo.nickname || res.memberInfo.username || res.memberInfo.mobile,
      avatar: res.memberInfo.avatar, 
    }
    if(!resUser || resUser.username !== userObj.username || resUser.avatar !== userObj.avatar) {
      Taro.setStorageSync('userinfo', userObj)
      this.setState({
        useInfo: {
          ...this.state.useInfo,
          username: res.memberInfo.nickname || res.memberInfo.username || res.memberInfo.mobile,
          avatar: res.memberInfo.avatar, 

        }
      })
    }
    this.setState({
      useInfo: {
        ...this.state.useInfo,
        point
      }
    })
  }

  async fetchConfig(params){ 
    const query={ 
      page:1,
      item_type:'normal',
      pageSize:20
    }
    const [
      {
        list, 
        brand_list:{list:brand_list}
      } ,
      { screen:{brand_openstatus,cat_openstatus,point_openstatus,point_section} },
      categoryList
    ]=await  Promise.all([
      api.pointitem.search(query),
      api.pointitem.getPointitemSetting(),
      api.pointitem.getPointitemCategory({have_items:true})],
    );
 

    list.map((item) => {
      item.imgUrl = "";
      if (item.pics.length > 0) {
        item.imgUrl = item.pics[0];
      }
    });

    this.setState({ 
      list:[ 
        ...list
      ],
      filterConfig:{
        ...this.state.filterConfig,
        scoreInternel:point_section,
        categoryList:categoryList,
        brandList:brand_list
      }
    }) 
  }

  async fetch(params){
 
    const { page_no: page, page_size: pageSize } = params

    const {filterParams:{brand,category}}=this.state;

    const query={
      ...this.state.query,
      page,
      item_type:'normal',
      pageSize,
      brand_id:brand?brand[0]:undefined,
      main_category:category?category[0]:undefined,
    }
    let total;
    const { list:prevState }=this.state;
    try {
      const [
        {
          list,
          total_count,  
        } 
      ]=await  Promise.all([
        api.pointitem.search(query)
      ]);
  
      total=total_count;

      list.map((item) => {
        item.imgUrl = "";
        if (item.pics.length > 0) {
          item.imgUrl = item.pics[0];
        }
      });

      this.setState({ 
        list:[
          ...prevState,
          ...list
        ], 
      })  
   
    } catch (e) { 
      total=0;
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
 

  filterOpen=(flag)=>{
    this.setState({
      showDrawer:flag
    })
  }

  handleFilterChange = (data) => {
    // this.setState({
    //   showDrawer: true
    // })
    const { current, sort } = data
    //goodsSort null-综合 1-销量倒序（暂时无正序） 2-积分价格倒序 3-积分价格正序

    if(current===3){//如果点击筛选
      this.filterOpen(true);
      return ;
    }
    
    const query = {
      ...this.state.query,
      goodsSort: current === 0
        ? null
        : current === 1
          ? 1
          : (sort > 0 ? 3 : 2)
    } 

    if(this.state.curFilterIdx===current){
      //点击相同菜单项不用操作
      return ;
    }

    this.setState({
      curFilterIdx: current,
      query
    }, () => {
      this.nextPage()
    })
  }
 
  handleClickItem = (item) => {
    const { item_id, title, market_price, price, img } = item;
    Tracker.dispatch("TRIGGER_SKU_COMPONENT", {
      goodsId: item_id,
      title: title,
      market_price: market_price * 100,
      price: price * 100,
      imgUrl: img
    });
    const url = `/pages/item/espier-detail?id=${item.item_id}&dtid=${item.distributor_id}`
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
      showDrawer:false,
      list: [],
    }, () => {
      this.nextPage()
    })
  }

  handleResetFilter=()=>{
    this.setState({
      filterParams:{
        brand:[],
        category:[]
      }
    })
  }
    
   
  handleClickFilterBlock= ({id,type}) =>{
    const { filterParams }=this.state;
    let newFilterParams;
    if(type==='brand'){
      if(filterParams.brand[0]===id){
        return ;
      } 
      newFilterParams={
        ...filterParams,
        brand:[id], 
      }
    }else if(type==='category'){
      if(filterParams.category[0]===id){
        return ;
      } 
      newFilterParams={
        ...filterParams,
        category:[id], 
      }
    }
    this.setState({
      filterParams:newFilterParams
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
      filterConfig:{
        brandList,
        categoryList,
        scoreInternel
      },
      filterParams:{
        brand,
        category
      }
    } = this.state
    const { isTabBar = '' } = this.$router.params
    const noData=!page.isLoading && !page.hasNext && !list.length;
    console.log('-----isTabBar----', !isTabBar)
    console.log('-----page----', page)
    console.log('-----useInfo----', useInfo)
    console.log('-----filterConfig----', this.state.filterConfig)
    return (
      <View className='page-goods-list'>
        {
          !isTabBar && <NavBar
            title='商品列表'
            leftIconType='chevron-left'
            fixed='true'
          />
        }
        <Header useInfo={useInfo} />

        <View class="navigation">
          <Image src={require('../../assets/imgs/black.png')} class="navigation_image" />

        </View>

        <View class="content">
          <Tabs
            className='goods-list__tabs'
            custom
            current={curFilterIdx}
            list={filterList}
            onChange={this.handleFilterChange}
          >

          </Tabs>
          <ScrollView
            className={classNames(isTabBar ? 'goods-list__scroll_isTabBar' : 'goods-list__scroll', isTabBar && 'isTabBar')}
            scrollY
            scrollTop={scrollTop}
            scrollWithAnimation
            onScroll={this.handleScroll}
            onScrollToLower={this.nextPage}
          > 
              <View className='goods-list goods-list__type-grid'> 
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
                            onClick={() => this.handleClickItem(item)}
                            onStoreClick={() => this.handleClickStore(item)}
                          />
                        </View>
                      );
                    })
                  } 
               
              </View> 
            {
              page.isLoading
                ? <Loading>正在加载...</Loading>
                : null
            }
            {
              noData && (<SpNote img='trades_empty.png'>暂无数据~</SpNote>)
            }
          </ScrollView>
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
              <View class="brand">
                <View class="title">品牌</View>
                <View class="content-filter">
                  {
                    brandList.map((item,index)=>{
                      return (
                        <FilterBlock info={item} type="brand" active={brand.indexOf(item.attribute_id)>-1} onClickItem={this.handleClickFilterBlock} />
                      )
                    })
                  }
                </View>
              </View>
              <View class="category">
                <View class="title">分类</View>
                <View class="content-filter">
                  {
                    categoryList.map((item,index)=>{
                      return (
                        <FilterBlock info={item} type="category" active={category.indexOf(item.category_id)>-1} onClickItem={this.handleClickFilterBlock} />
                      )
                    })
                  }
                </View>
              </View>
              <View class="score">
                <View class="title">积分区间</View>
                <View class="input-wrap"><AtInput placeholder="最低积分值"/><View class='text'>~</View><AtInput placeholder="最高积分值"/></View>
                {
                    scoreInternel.map((item,index)=>{
                      return (
                        <FilterBlock info={item} type="score" />
                      )
                    })
                  }
              </View>
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
        { isTabBar && <TabBar />}
      </View>
    )
  }
}
