/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 首页
 * @FilePath: /unite-vshop/src/pages/index.js
 * @Date: 2021-01-06 15:46:54
 * @LastEditors: PrendsMoi
 * @LastEditTime: 2021-03-05 11:10:41
 */
import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import {
  TabBar,
  Loading,
  SpNote,
  BackToTop,
  FloatMenus,
  FloatMenuItem,
  AccountOfficial,
  ScreenAd
} from "@/components";
import req from "@/api/req";
import api from "@/api";
import { pickBy, classNames, isArray } from "@/utils";
import entry from "@/utils/entry";
import { withPager, withBackToTop } from "@/hocs";
import S from "@/spx";
import { Tracker } from "@/service";
import { WgtGoodsFaverite, HeaderHome } from "./home/wgts";
import HomeWgts from "./home/comps/home-wgts";
import Automatic from "./home/comps/automatic";

import "./home/index.scss";

@connect(
  ({ cart, member, store }) => ({
    store,
    list: cart.list,
    cartIds: cart.cartIds,
    cartCount: cart.cartCount,
    showLikeList: cart.showLikeList,
    showAdv: member.showAdv,
    favs: member.favs
  }),
  dispatch => ({
    onUpdateLikeList: show_likelist =>
      dispatch({ type: "cart/updateLikeList", payload: show_likelist }),
    onUpdateCartCount: count =>
      dispatch({ type: "cart/updateCount", payload: count })
  })
)
@withPager
@withBackToTop
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.autoCloseTipId = null;
    this.state = {
      ...this.state,
      wgts: [],
      likeList: [],
      isShowAddTip: false,
      curStore: {
        distributor_id: 0
      },
      positionStatus: false,
      automatic: null,
      showAuto: true,
      // top: 0,
      isShop: null,
      salesperson_id: "",
      // 店铺精选id
      featuredshop: "",
      // 分享配置
      shareInfo: {},
      is_open_recommend: null,
      is_open_scan_qrcode: null,
      is_open_official_account: null,
      is_open_store_status: null,
      show_official: true,
      showCloseBtn: false,
      // 是否有跳转至店铺页
      isGoStore: false,
      show_tabBar: true
    };
  }

  componentDidMount() {
    this.getHomeSetting();
    this.getShareSetting();
    this.isShowTips();
  }

  // 检测收藏变化
  componentWillReceiveProps(next) {
    if (Object.keys(this.props.favs).length !== Object.keys(next.favs).length) {
      setTimeout(() => {
        const likeList = this.state.likeList.map(item => {
          item.is_fav = Boolean(next.favs[item.item_id]);
          return item;
        });
        this.setState({
          likeList
        });
      });
    }
  }

  componentDidShow() {
    this.showInit();
    this.isShoppingGuide();
    this.getDistributionInfo();
    // 检测白名单
    this.checkWhite();
    // 购物车数量
    this.fetchCartCount();
  }

  // 配置信息
  config = {
    enablePullDownRefresh: true,
    backgroundTextStyle: "dark",
    onReachBottomDistance: 50
  };

  // 下拉刷新
  onPullDownRefresh = () => {
    Tracker.dispatch("PAGE_PULL_DOWN_REFRESH");
    this.resetPage();
    this.setState(
      {
        likeList: [],
        wgts: []
      },
      () => {
        let { curStore } = this.state;
        const curStoreLocal = Taro.getStorageSync("curStore");
        if (curStore) {
          this.getWgts();
          this.getAutoMatic();
        } else if (!isArray(curStoreLocal)) {
          this.setState(
            {
              curStore: curStoreLocal
            },
            () => {
              this.getWgts();
              this.getAutoMatic();
            }
          );
        }
      }
    );
  };

  // 页面滚动
  // onPageScroll = (res) => {
  //   const { scrollTop } = res
  //   this.setState({
  //     top: scrollTop
  //   })
  // }

  // 触底事件
  onReachBottom = () => {
    this.nextPage();
  };

  // 分享
  onShareAppMessage() {
    const shareInfo = this.shareInfo();
    return {
      ...shareInfo
    };
  }

  // 分享朋友圈
  onShareTimeline() {
    const shareInfo = this.shareInfo("time");
    return {
      ...shareInfo
    };
  }

  // 分享信息
  shareInfo = (type = "") => {
    const res = this.state.shareInfo;
    const { userId } = Taro.getStorageSync("userinfo");
    let query = userId ? `/pages/index?uid=${userId}` : "/pages/index";
    if (type) {
      query = userId ? `uid=${userId}` : "";
    }
    const path = type ? "query" : "path";
    const params = {
      title: res.title,
      imageUrl: res.imageUrl,
      [path]: query
    };
    return params;
  };

  // 获取分享配置
  getShareSetting = async () => {
    const res = await api.wx.shareSetting({ shareindex: "index" });
    this.setState({
      shareInfo: res
    });
  };

  // show显示初始化
  showInit = () => {
    const { curStore, is_open_store_status, isGoStore } = this.state;
    const curStoreLocal = Taro.getStorageSync("curStore") || {};
    //非自提门店判断
    const localdis_id = is_open_store_status
      ? curStoreLocal.store_id
      : curStoreLocal.distributor_id;
    // 是否切换店铺
    if (!isArray(curStoreLocal) && isGoStore) {
      if (!curStore || localdis_id != curStore.distributor_id) {
        this.setState(
          {
            isGoStore: false,
            curStore: curStoreLocal,
            likeList: [],
            wgts: []
          },
          () => {
            this.getWgts();
            this.getAutoMatic();
          }
        );
      } else {
        this.setState({
          isGoStore: false
        });
      }
    }
  };

  // 是否显示tips
  isShowTips = () => {
    const addTipIsShow = Taro.getStorageSync("addTipIsShow");
    if (addTipIsShow !== false) {
      this.setState(
        {
          isShowAddTip: true
        },
        () => {
          this.autoCloseTipId = setTimeout(() => {
            this.handleClickCloseAddTip();
          }, 30000);
        }
      );
    }
  };

  // 是否绑定导购
  isShoppingGuide = async () => {
    let token = S.getAuthToken();
    if (!token) return false;
    let salesperson_id = Taro.getStorageSync("s_smid");
    if (!salesperson_id) return;
    // 判断是否已经绑定导购员
    let info = await api.member.getUsersalespersonrel({
      salesperson_id
    });
    if (info.is_bind === "1") return false;
    // 绑定导购
    await api.member.setUsersalespersonrel({
      salesperson_id
    });
  };

  // 获取店铺精选
  getDistributionInfo = async () => {
    const distributionShopId = Taro.getStorageSync("distribution_shop_id");
    const { userId } = Taro.getStorageSync("userinfo");
    let featuredshop = "";
    if (!S.getAuthToken() && !distributionShopId) {
      return;
    }
    const param = {
      user_id: distributionShopId || userId
    };
    const res = await api.distribution.info(param);
    const { user_id, is_valid, selfInfo = {}, parentInfo = {} } = res;
    if (is_valid) {
      featuredshop = user_id;
    } else if (selfInfo.is_valid) {
      featuredshop = selfInfo.user_id;
    } else if (parentInfo.is_valid) {
      featuredshop = parentInfo.user_id;
    }
    this.setState({
      featuredshop
    });
  };

  // 白名单
  checkWhite = () => {
    const setting = Taro.getStorageSync("otherSetting");
    if (!S.getAuthToken()) {
      if (setting.whitelist_status == true) {
        this.setState({
          show_tabBar: false
        });
        S.login(this, true);
      }
    }
  };

  // 获取首页配置
  getHomeSetting = async () => {
    const is_open_store_status = await entry.getStoreStatus();
    const {
      is_open_recommend,
      is_open_scan_qrcode,
      is_open_wechatapp_location,
      is_open_official_account
    } = Taro.getStorageSync("settingInfo");
    const isNeedLoacate = is_open_wechatapp_location == 1;
    const options = this.$router.params;
    options.isStore = is_open_store_status;
    const res = await entry.entryLaunch(options, isNeedLoacate);
    const { store } = res;
    if (!isArray(store)) {
      this.setState(
        {
          curStore: store,
          is_open_recommend,
          is_open_scan_qrcode,
          is_open_store_status,
          is_open_wechatapp_location,
          is_open_official_account
        },
        () => {
          this.getWgts();
          this.getAutoMatic();
        }
      );
    }
  };

  // 获取挂件配置
  getWgts = async () => {
    const { curStore, is_open_store_status, is_open_recommend } = this.state;
    const curdis_id =
      curStore && is_open_store_status
        ? curStore.store_id
        : curStore.distributor_id;
    if (!curStore.distributor_id && curStore.distributor_id !== 0) {
      return;
    }
    const url = `/pagestemplate/detail?template_name=yykweishop&weapp_pages=index&distributor_id=${curdis_id}`;
    const info = await req.get(url);
    const wgts = isArray(info) ? [] : info.config;
    this.setState(
      {
        wgts: wgts.length > 5 ? wgts.slice(0, 5) : wgts
      },
      () => {
        // 0.5s后补足缺失挂件
        setTimeout(() => {
          this.setState({
            wgts
          });
        }, 500);
        Taro.stopPullDownRefresh();
        if (!isArray(info) && info.config) {
          const searchWgt = info.config.find(item => item.name == "search");
          this.setState({
            positionStatus:
              searchWgt && searchWgt.config && searchWgt.config.fixTop
          });
          if (is_open_recommend === 1) {
            this.props.onUpdateLikeList(true);
            this.resetPage();
            this.setState(
              {
                likeList: []
              },
              () => {
                this.nextPage();
              }
            );
          } else {
            this.props.onUpdateLikeList(false);
          }
        }
      }
    );
  };

  // 获取弹窗广告配置
  getAutoMatic = async () => {
    const { is_open, ad_pic, ad_title } = await api.promotion.automatic({
      register_type: "general"
    });
    this.setState({
      automatic: {
        title: ad_title,
        isOpen: is_open === "true",
        adPic: ad_pic
      }
    });
  };

  // 获取猜你喜欢
  fetch = async params => {
    const { page_no: page, page_size: pageSize } = params;
    const query = {
      page,
      pageSize
    };
    const { list, total_count: total } = await api.cart.likeList(query);
    const { favs } = this.props;

    const nList = pickBy(list, {
      img: "pics[0]",
      item_id: "item_id",
      title: "itemName",
      distributor_id: "distributor_id",
      origincountry_name: "origincountry_name",
      origincountry_img_url: "origincountry_img_url",
      promotion_activity_tag: "promotion_activity",
      type: "type",
      price: ({ price }) => (price / 100).toFixed(2),
      member_price: ({ member_price }) => (member_price / 100).toFixed(2),
      market_price: ({ market_price }) => (market_price / 100).toFixed(2),
      desc: "brief",
      is_fav: ({ item_id }) => Boolean(favs[item_id])
    });

    this.setState({
      likeList: [...this.state.likeList, ...nList]
    });

    return {
      total
    };
  };

  // 获取购物车数量
  async fetchCartCount() {
    if (!S.getAuthToken()) return;
    try {
      const res = await api.cart.count({ shop_type: "distributor" });
      this.props.onUpdateCartCount(res.item_count);
    } catch (e) {
      console.log(e);
    }
  }

  // 跳转选择店铺
  goStore = () => {
    this.setState({
      isGoStore: true
    });
  };

  // 订阅错误事件
  handleOfficialError = () => {};

  // 关闭订阅公众号
  handleOfficialClose = () => {
    this.setState({
      show_official: false
    });
    Taro.setStorageSync("close_official", true);
  };

  // 注册享大礼品
  handleGift = async () => {
    if (!S.getAuthToken()) {
      setTimeout(() => {
        S.login(this);
      }, 1000);
    }
  };

  // 关闭tips
  handleClickCloseAddTip = () => {
    if (this.autoCloseTipId) clearTimeout(this.autoCloseTipId);
    Taro.setStorageSync("addTipIsShow", false);
    this.setState({
      isShowAddTip: false
    });
  };

  // 跳转店铺页面
  handleClickShop = () => {
    const { featuredshop } = this.state;
    Taro.navigateTo({
      url: `/marketing/pages/distribution/shop-home?featuredshop=${featuredshop}`
    })
  }

  handleClickShop2 = () => {
    const { featuredshop } = this.state
    Taro.navigateTo({
      url: `/pages/pointitem/list`
    })
  }

  // 显示浮窗广告
  handleAutoClick = () => {
    const { showAuto } = this.state;
    this.setState({
      showAuto: !showAuto
    });
  };

  render() {
    const {
      show_tabBar,
      isShowAddTip,
      showBackToTop,
      automatic,
      showAuto,
      featuredshop,
      wgts,
      positionStatus,
      curStore,
      is_open_recommend,
      likeList,
      page,
      is_open_official_account,
      is_open_scan_qrcode,
      is_open_store_status,
      show_official
    } = this.state;

    const pages = Taro.getCurrentPages()
    console.log("-----pages----",pages)

    // 广告屏
    const { showAdv } = this.props;
    // 是否是标准版
    const isStandard = APP_PLATFORM === "standard" && !is_open_store_status;
    // 否是fixed
    const isFixed = positionStatus;

    return (
      <View className="page-index">
        {is_open_official_account === 1 && show_official && (
          <AccountOfficial
            isClose
            onHandleError={this.handleOfficialError.bind(this)}
            onClick={this.handleOfficialClose.bind(this)}
          ></AccountOfficial>
        )}
        {isStandard && curStore && (
          <HeaderHome
            store={curStore}
            onClickItem={this.goStore.bind(this)}
            isOpenScanQrcode={is_open_scan_qrcode}
            isOpenStoreStatus={is_open_store_status}
          />
        )}
        <View
          className={classNames(
            "wgts-wrap",
            !isStandard && "wgts-wrap_platform",
            !isFixed || !isStandard
              ? "wgts-wrap__fixed"
              : "wgts-wrap__fixed_standard",
            !curStore && "wgts-wrap-nolocation",
            !isFixed && !isStandard && "platform"
          )}
        >
          {/* 挂件内容和猜你喜欢 */}
          <View className="wgts-wrap__cont">
            <HomeWgts wgts={wgts} />
            {likeList.length > 0 && is_open_recommend == 1 && (
              <View className="faverite-list">
                <WgtGoodsFaverite info={likeList} />
                {page.isLoading ? <Loading>正在加载...</Loading> : null}
                {!page.isLoading && !page.hasNext && !likeList.length && (
                  <SpNote img="trades_empty.png">暂无数据~</SpNote>
                )}
              </View>
            )}
          </View>
        </View>
        {/* 浮动按钮 */}
        <FloatMenus>
          {show_tabBar && featuredshop && (
            <Image
              className="distribution-shop"
              src="/assets/imgs/gift_mini.png"
              mode="widthFix"
              onClick={this.handleClickShop.bind(this)}
            />)
          } 
          {
            automatic && automatic.isOpen && !S.getAuthToken() &&
            (<FloatMenuItem
              iconPrefixClass="icon"
              icon="present"
              onClick={this.handleAutoClick.bind(this)}
            />
          )}
        </FloatMenus>
        {/* 浮窗广告 */}
        {automatic && automatic.isOpen && !S.getAuthToken() && (
          <Automatic
            info={automatic}
            isShow={showAuto}
            onClick={this.handleGift.bind(this)}
            onClose={this.handleAutoClick.bind(this)}
          />
        )}
        {/* 返回顶部 */}
        <BackToTop
          show={showBackToTop}
          onClick={this.scrollBackToTop.bind(this)}
        />
        {/* addTip */}
        {isShowAddTip && (
          <View className="add_tip">
            <View class="tip-text">
              点击“•●•”添加到我的小程序，微信首页下拉即可快速访问店铺
            </View>
            <View
              className="icon-close icon-view"
              onClick={this.handleClickCloseAddTip.bind(this)}
            >
              {" "}
            </View>
          </View>
        )}
        {/* tabBar */}
        <TabBar showbar={show_tabBar} />
        {/* 开屏广告 */}
        {showAdv && <ScreenAd />}
      </View>
    );
  }
}
