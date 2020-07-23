import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Image } from '@tarojs/components'
import { AtTabBar  } from 'taro-ui'
import { SpToast, BackToTop, Loading } from '@/components'
import S from '@/spx'
import req from '@/api/req'
import api from '@/api'
import { withPager, withBackToTop } from '@/hocs'
import { getCurrentRoute} from '@/utils'
import entry from '@/utils/entry'
import HomeWgts from '../home/comps/home-wgts'

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
        { title: '综合1' },
        { title: '销量' },
        { title: '价格', sort: -1 }
      ],
      query: null,
      showDrawer: false,
      paramsList: [],
      selectParams: [],
      list: [],
      goodsIds: [],
      tabList: [
        { title: '重点推荐', iconType: 'home', iconPrefixClass: 'icon',url: '/pages/distribution/shop-home',urlRedirect: true },
        { title: '分类', iconType: 'category', iconPrefixClass: 'icon', url: '/marketing/pages/distribution/shop-category', urlRedirect: true },
      ],
      wgts:null,
      authStatus: false,
      positionStatus: false,
      def_pic:''
    }
  }

  async componentDidMount () {
    const options = this.$router.params

    const { uid } = await entry.entryLaunch(options, true)
    const distributionShopId = Taro.getStorageSync('distribution_shop_id')
    const { userId } = Taro.getStorageSync('userinfo')
    const shopId = uid || distributionShopId || userId
    const param = distributionShopId ? {
      user_id: distributionShopId,
    } : {
      user_id: userId,
    }    
    if (options.featuredshop) {
      param.user_id = options.featuredshop
    }
    const { banner_img } = await api.distribution.shopBanner(param || null)
    if (shopId) {
      this.firstStatus = true
      this.setState({
        query: {
          item_type: 'normal',
          approve_status: 'onsale,only_show',
          promoter_onsale: true,
          promoter_shop_id: shopId
        },
        def_pic:banner_img
      }, async () => {
        await this.fetchInfo()
        await this.fetch()
        // await this.nextPage()
      })
    }
  }

  async fetchInfo () {
    const options = this.$router.params
    const { userId } = Taro.getStorageSync('userinfo')
    const distributionShopId = Taro.getStorageSync('distribution_shop_id')
    const param = distributionShopId ? {
      user_id: distributionShopId,
    } : {
      user_id: userId,
    }
    if (options.featuredshop) {
      param.user_id = options.featuredshop
    }

    const res = await api.distribution.info(param || null)
    const {shop_name, brief, shop_pic, username, headimgurl, is_valid } = res

    if (!is_valid) {
      Taro.reLaunch({
        url: '/pages/index'
      })
    }

    this.setState({
      localCurrent: 0,
      info: {
        username,
        headimgurl,
        shop_name,
        brief,
        shop_pic
      }
    })
  }

  async fetch () {
    const { custompage_template_id } = await api.distribution.getCustompage()
    const url = `/pageparams/setting?template_name=yykweishop&version=v1.0.1&page_name=custom_${custompage_template_id}&name=search`
    const fixSetting = await req.get(url)

    this.setState({
      positionStatus: (fixSetting.length && fixSetting[0].params.config.fixTop) || false
    }, () => {
      this.fetchTpl()
    })  
  }
  async fetchTpl () {
    const { custompage_template_id } = await api.distribution.getCustompage()
    const url = `/pageparams/setting?template_name=yykweishop&version=v1.0.1&page_name=custom_${custompage_template_id}`
    const info = await req.get(url)

    if (!S.getAuthToken()) {
      this.setState({
        authStatus: true
      })
    }
    this.setState({
      wgts: info.config
    })
    
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

  handleClickItem = (id) => {
    const url = `/pages/item/espier-detail?id=${id}`
    Taro.navigateTo({
      url
    })
  }
  handleClick = (current) => {
    const cur = this.state.localCurrent

    if (cur !== current) {
      const curTab = this.state.tabList[current]
      const { url, urlRedirect } = curTab
      
      const fullPath = ((getCurrentRoute(this.$router).fullPath).split('?'))[0]      
      if (url && fullPath !== url) {
        if (!urlRedirect || (url === '/pages/member/index' && !S.getAuthToken())) {
          Taro.navigateTo({ url })
        } else {
          Taro.redirectTo({ url })
        }
      }
    }
  }

  render () {
    const { wgts,def_pic,positionStatus,authStatus,showBackToTop, list,tabList, page, showDrawer,localCurrent, paramsList, selectParams, scrollTop, goodsIds, curFilterIdx, filterList } = this.state
    if (!wgts) {
      return <Loading />
    }
    console.warn(def_pic)
    return (
      <View className="page-distribution-shop">
        <View className="shop-banner">
          <View className='shop-def'>
          <Image
                className='banner-img'
                src={def_pic || null}
                mode='aspectFill'
          />
          </View>
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
        </View>
        <ScrollView
          className={`wgts-wrap ${positionStatus ? 'wgts-wrap__fixed' : ''}`}
          scrollTop={scrollTop}
          scrollY
        >
          <View className='wgts-wrap__cont'>
            <HomeWgts
              wgts={wgts}
            />
          </View>
        </ScrollView>
        {/* <FilterBar
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
         
        </FilterBar> */}

        {/* <AtDrawer
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
                            key={`${v_index}1`}
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
        </AtDrawer> */}

        {/* <ScrollView
          className='goods-list__scroll'
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
        > */}
          {/* <View className='goods-list'>
            {
              list.map((item, index) =>
                <GoodsItem
                  key={index}
                  info={item}
                  onClick={this.handleClickItem.bind(this, item.goods_id)}
                />
              )
            }
          </View> */}
          {/* {
            isArray(desc) &&
              <View className='wgts-wrap__cont'>
                {
                  desc.map((item, idx) => {
                    return (
                      <View className='wgt-wrap' key={`${idx}1`}>                      
                        {item.name === 'slider' && <WgtSlider info={item} />}
                        {item.name === 'goods' && <WgtGoods info={item} />}
                      </View>
                    )
                  })
                }
              </View>
              
          } */}



          {/* {
            page.isLoading
              ? <Loading>正在加载...</Loading>
              : null
          }
          {
            !page.isLoading && !page.hasNext && !list.length
              && (<SpNote img='trades_empty.png'>暂无数据~</SpNote>)
          }
        </ScrollView> */}
        <BackToTop
          show={showBackToTop}
          onClick={this.scrollBackToTop}
        />
        <SpToast />
        <AtTabBar
          fixed
          tabList={tabList}
          onClick={this.handleClick}  
          current={localCurrent}   
        />
              {/* <AtTabBar
                fixed
                color={color}
                backgroundColor={backgroundColor}
                selectedColor={selectedColor}
                tabList={tabList}
                onClick={this.handleClick}
                current={localCurrent}
              /> */}
      </View>
    )
  }
}
