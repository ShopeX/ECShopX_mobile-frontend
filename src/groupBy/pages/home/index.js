import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView, Swiper, SwiperItem } from '@tarojs/components'
import { debounce } from '@/utils'
import api from '@/api'
import { SpNavBar } from '@/components'
import S from '@/spx'
import entry from '@/utils/entry'
import entryLaunchFun from '@/utils/entryLaunch'
import { formatGood } from '../../utils'
import GroupGood from '../../component/grouoGood'
import LoadingMore from '../../component/loadingMore'
import TabBar from '../../component/tabBar'
import Classification from '../../component/classification'

import './index.scss'

export default class GroupByIndex extends Component {
  constructor (props) {
    super(props)
    this.state = {
      userInfo: {},
      // banner
      banner: [],
      // 菜单列表
      menuList: [],
      // 活动列表
      list: [],
      isRefresh: false,
      isLoading: false,
      isEnd: false,
      isEmpty: false,
      param: {
        page: 1,
        pageSize: 10
      },
      // 当前地区
      current: {
        city: '',
        area: ''
      },
      // 分类
      category: 1,
      // 定位信息
      lbs: {
        lat: '',
        lng: ''
      }
    }
  }

  componentDidMount () {}

  componentDidShow () {
    this.init()
  }

  config = {
    navigationBarTitleText: '团购'
  }

  // 获取定位
  init = async () => {
    // if (!S.getAuthToken()) {
    //   Taro.showToast({
    //     icon: 'none',
    //     title: '请登录'
    //   }).then(() => {
    //     S.login(this, true)
    //   })
    //   return
    // }
    let userInfo = Taro.getStorageSync('userinfo')
    if (S.getAuthToken() && !userInfo) {
      const info = await api.groupBy.info()
      userInfo = {
        username: info.memberInfo.nickname || info.memberInfo.username || info.memberInfo.mobile,
        avatar: info.memberInfo.avatar,
        userId: info.memberInfo.user_id,
        isPromoter: info.is_promoter,
        openid: info.memberInfo.open_id,
        vip: info.vipgrade ? info.vipgrade.vip_type : ''
      }
      Taro.setStorageSync('userinfo', userInfo)
    }
    // const lbs = await this.getLoacl()
    const lbs = await entryLaunchFun.getLocationInfo()
    if (!lbs) return
    const { lat, lng } = lbs
    this.getSetting()
    this.setState(
      {
        lbs: {
          lat,
          lng
        },
        userInfo
      },
      () => {
        this.getNearBuyCommunity()
      }
    )
  }
  // 定位
  // getLoacl = async () => {
  //   let lbs = ''
  //   if (Taro.getEnv() === 'WEAPP') {
  //     lbs = await Taro.getLocation({ type: 'gcj02' }).catch(() => {
  //       Taro.showModal({
  //         content: '您未授权访问您的定位信息，请先更改您的授权设置',
  //         showCancel: false,
  //         success: (res) => {
  //           if (res.confirm) {
  //             Taro.openSetting({
  //               success: () => {
  //                 this.init()
  //               }
  //             })
  //           }
  //         }
  //       })
  //       return false
  //     })
  //   } else {
  //     lbs = await entry.getWebLocal(false).catch(() => false)
  //   }
  //   return lbs
  // }
  // 获取附近活动社区
  getNearBuyCommunity = () => {
    const currentCommunity = Taro.getStorageSync('community')
    const { current } = this.state
    if (currentCommunity) {
      if (currentCommunity.community_id !== current.community_id) {
        this.setState(
          {
            current: currentCommunity
          },
          () => {
            this.handleRefresh(true)
          }
        )
      }
    } else {
      const { lbs } = this.state
      api.groupBy.activityCommunity(lbs).then((res) => {
        Taro.setStorageSync('community', res)
        this.setState(
          {
            current: res
          },
          () => {
            this.handleRefresh(true)
          }
        )
      })
    }
  }
  // 获取活动数据
  getActiveData = async (isRefrsh = false) => {
    Taro.showLoading({ title: '正在加载中', mask: true })
    const { current, category, param, list } = this.state
    // 原列表数据
    const oldList = isRefrsh ? [] : list[0].good

    api.groupBy
      .activityDetail({
        ...param,
        community_id: current.community_id,
        activity_goods_category_key: category
      })
      .then((res) => {
        if (!res.status) {
          this.setState({
            list: [],
            banner: [],
            isRefresh: false,
            isLoading: false,
            isEnd: false,
            isEmpty: true
          })
          Taro.hideLoading()
          return
        }
        const total_count = res.items.total_count
        const isEnd = param.page >= total_count / param.pageSize
        const data =
          res.last_second && res.items
            ? [
                {
                  time: res.last_second,
                  good: [...oldList, ...formatGood(res.items.list, res.cur.symbol)],
                  deliveryDate: res.delivery_date
                }
              ]
            : []
        this.setState({
          list: data,
          isRefresh: false,
          isLoading: false,
          isEnd,
          isEmpty: data.length <= 0,
          banner: res.banner_img ? [res.banner_img] : ''
        })
        Taro.hideLoading()
      })
  }
  // 获取设置
  getSetting = () => {
    api.groupBy
      .getTemplate({
        template_name: 'yykcommunity',
        version: 'v1.0.1',
        page_name: 'index'
      })
      .then((res) => {
        this.setState({
          menuList: res.list || []
        })
      })
  }
  // 滚动事件
  onScroll = debounce((e) => {
    const { scrollTop } = e.detail
    this.setState({
      scrollTop
    })
  }, 1000)

  // 下拉刷新
  handleRefresh = () => {
    const { param } = this.state
    param.page = 1
    this.setState({
      isRefresh: true,
      param
    })
    this.getActiveData(true)
  }

  // 上拉加载
  handleLoadMore = () => {
    const { isLoading, isEnd, param, isEmpty } = this.state
    if (isEnd || isLoading || isEmpty) return
    this.setState({
      param: {
        page: ++param.page,
        pageSize: param.pageSize
      },
      isLoading: true
    })
    this.getActiveData()
  }

  // 跳转社区列表
  goCommunity = () => {
    Taro.navigateTo({
      url: '/groupBy/pages/community/index'
    })
  }

  render () {
    const {
      userInfo,
      banner,
      list,
      scrollTop,
      isRefresh,
      isLoading,
      isEnd,
      isEmpty,
      current,
      menuList
    } = this.state

    return (
      <View className='groupByHome'>
        <SpNavBar
          title={this.config.navigationBarTitleText}
          leftIconType='chevron-left'
          fixed='true'
        />
        <View className='header' onClick={this.goCommunity}>
          {userInfo.avatar && <Image className='avatar' src={userInfo.avatar}></Image>}
          <View className='info'>
            <View className='name'>{userInfo.username || '当前社区：'}</View>
            <View className={`address ${!userInfo.username && 'noLogin'}`}>
              {!userInfo.username ? <View className='icon icon-periscope'></View> : '提货:'}
              {current.city + current.area}({current.community_name})
            </View>
          </View>
        </View>
        <ScrollView
          className='list'
          scrollY
          scroll-anchoring
          refresherEnabled
          scrollWithAnimation
          scrollTop={scrollTop}
          onScroll={this.onScroll}
          refresherTriggered={isRefresh}
          onRefresherRefresh={this.handleRefresh}
          onScrollToLower={this.handleLoadMore}
        >
          {/* banner */}
          {banner.length > 0 && (
            <Swiper className='banner'>
              {banner.map((item) => (
                <SwiperItem key={item} className='bannerItem'>
                  <Image className='bannerImg' src={item}></Image>
                </SwiperItem>
              ))}
            </Swiper>
          )}
          {/* 菜单 */}
          {menuList.length > 0 && <Classification list={menuList} />}
          {/* 列表图 */}
          {list.map((item) => (
            <GroupGood key={item.time} info={item} onRefesh={this.handleRefresh.bind(this)} />
          ))}
          {/* 加载更多 */}
          <LoadingMore isLoading={isLoading} isEnd={isEnd} isEmpty={isEmpty} />
          {/* 防止子内容无法支撑scroll-view下拉刷新 */}
          <View style='width:2rpx;height:2rpx;bottom:-2rpx;position:absolute;' />
        </ScrollView>
        <TabBar current={0} />
      </View>
    )
  }
}
