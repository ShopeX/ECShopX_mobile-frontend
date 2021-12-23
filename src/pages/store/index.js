import { Component } from "react";
import { connect } from "react-redux";
import Taro,{ getCurrentInstance } from "@tarojs/taro";
import { View, Image, ScrollView } from "@tarojs/components";
import {
  SpToast,
  Loading,
  BackToTop,
  SpNewShopItem,
  SpCellCoupon,
} from "@/components";
import { AtTabBar } from "taro-ui";
import req from "@/api/req";
import api from "@/api";
import {
  pickBy,
  normalizeQuerys,
  getCurrentRoute,
  classNames,
  isNavbar,
} from "@/utils";
import { platformTemplateName } from "@/utils/platform";
import {  withPager,withBackToTop } from "@/hocs";
import qs from "qs";
import S from "@/spx";
import {
  WgtSlider,
  WgtImgHotZone,
  WgtMarquees,
  WgtNavigation,
  WgtCoupon,
  WgtGoodsScroll,
  WgtGoodsGrid,
  WgtShowcase,
  WgtSearchHome,
  WgtFilm,
  WgtNearbyShop,
  WgtStore,
  WgtGoodsGridTab,
  WgtGoodsFaverite,
} from "../home/wgts";
import CompHeader from './comps/comp-header'

import "./index.scss";

@connect((store) => ({
  store,
}))
@withPager
@withBackToTop
export default class StoreIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      wgts: null,
      authStatus: false,
      isShowAddTip: false,
      localCurrent: 0,
      storeInfo: null,
      tabList: [
        {
          title: "店铺首页",
          iconType: "home",
          iconPrefixClass: "icon",
          url: "/pages/store/index",
        },
        {
          title: "商品分类",
          iconType: "category",
          iconPrefixClass: "icon",
          url: "/others/pages/store/category",
        },
      ],
      couponList: [],
      fixedSearch: false,
      likeList: [],
    };
  }

  async componentDidMount() {
    const current = getCurrentInstance()
    console.log('id==',current.router.params.id)
    // const options = await normalizeQuerys(this.$router.params);
    // const id = options.id || options.dtid;
    const id = current.router.params.id
    if (id) {
      this.fetchInfo(id);
      this.fetchCouponList(id);
    }
  }

  componentDidShow = () => {
    Taro.getStorage({ key: "addTipIsShow" })
      .then(() => {})
      .catch((error) => {
        console.log(error);
        this.setState({
          isShowAddTip: true,
        });
      });
  };

  onShareAppMessage(res) {
    if (res.from === "button") {
      console.log(res.target);
    }
    return {
      title: this.state.storeInfo ? this.state.storeInfo.name : "店铺商品",
      path: `/pages/store/index?id=${this.$router.params.id}`,
    };
  }

  async fetchCouponList(id) {
    const params = {
      page_no: 1,
      page_size: 5,
      end_date: 1,
      distributor_id: id,
    };
    const { list } = await api.member.homeCouponList(params);
    this.setState({
      couponList: list,
    });
  }

  async fetchCouponList(id) {
    const params = {
      page_no: 1,
      page_size: 5,
      end_date: 1,
      distributor_id: id,
    };
    const { list } = await api.member.homeCouponList(params);
    this.setState({
      couponList: list,
    });
  }

  async fetchInfo(distributorId) {
    let id = "";
    let storeInfo = null;
    if (distributorId) {
      id = distributorId;
    } else {
      id = await Taro.getStorageSync("curStore").distributor_id;
    }
    const { name, logo, scoreList, distributor_id } = await api.shop.getShop({
      distributor_id: id,
      show_score: 1,
    });
    storeInfo = {
      name,
      brand: logo,
      scoreList,
      distributor_id,
    };
    const pathparams = qs.stringify({
      template_name: platformTemplateName,
      weapp_pages: "index",
      distributor_id: id,
    });

    const url = `pagestemplate/shopDetail?${pathparams}`;
    try {
      const info = await req.get(url);
      if (!S.getAuthToken()) {
        this.setState({
          authStatus: true,
        });
      }
      //是否有search
      let search = info.config.find((item) => item.name === "search") || {
        config: {},
      };
      let fixedSearch = !!search.config.fixTop;

      this.setState(
        {
          wgts: info.config,
          storeInfo: storeInfo,
          fixedSearch,
        },
        () => {
          this.resetPage(() => {
            this.setState(
              {
                likeList: [],
              },
              () => {
                this.nextPage();
              }
            );
          });

          // this.nextPage()
          // if (info.config) {
          //   info.config.map((item) => {
          //     if (item.name === 'setting' && item.config.faverite) {

          //     }
          //   })
          // }
        }
      );
    } catch (e) {
      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    }
  }

  // 获取猜你喜欢
  fetch = async (params) => {
    const { page_no: page, page_size: pageSize } = params;
    const query = {
      page,
      pageSize,
    };
    const { list, total_count: total } = await api.cart.likeList(query);

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
    });
    this.setState({
      likeList: [...this.state.likeList, ...nList],
    });

    return {
      total,
    };
  };

  handleClickLicense = () => {
    Taro.navigateTo({
      url: "/pages/home/license",
    });
  };

  handleClickCloseAddTip = () => {
    Taro.setStorage({ key: "addTipIsShow", data: { isShowAddTip: false } });
    this.setState({
      isShowAddTip: false,
    });
  };

  handleClick = async (current) => {
    const cur = this.state.localCurrent;
    if (cur !== current) {
      const curTab = this.state.tabList[current];
      const { url } = curTab;
      const options = await normalizeQuerys(this.$router.params);
      const id = options.id || options.dtid;
      const param = current === 1 ? `?dis_id=${id}` : `?id=${id}`;
      const fullPath = getCurrentRoute(this.$router).fullPath.split("?")[0];
      if (url && fullPath !== url) {
        Taro.redirectTo({ url: `${url}${param}` });
      }
    }
  };

  render() {
    const {
      wgts,
      storeInfo,
      showBackToTop,
      scrollTop,
      tabList,
      localCurrent,
      couponList,
      fixedSearch,
      likeList,
    } = this.state;
    const user = Taro.getStorageSync("userinfo");

    if (!wgts || !this.props.store) {
      return <Loading />;
    }

    console.log("===likeList==>", likeList);
    const current = getCurrentInstance()
    const id = current.router.params.id
    return (
      <View
        className={classNames("page-store-index", {
          fixedSearch,
          "has-navbar": isNavbar(),
        })}
      >
        <ScrollView
          className="wgts-wrap wgts-wrap__fixed__page"
          scrollTop={scrollTop}
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
          scrollY
        >
          <View className="wgts-wrap__cont">
            <CompHeader 
              inStore 
              info={storeInfo}
              couponList={couponList}
            />
            {wgts.map((item, idx) => {
              return (
                <View className="wgt-wrap" key={`${item.name}${idx}`}>
                  {item.name === "search" && (
                    <WgtSearchHome info={item} dis_id={id} />
                  )}
                  {item.name === "nearbyShop" && <WgtNearbyShop info={item} />}
                  {item.name === "slider" && <WgtSlider info={item} />}
                  {item.name === "film" && <WgtFilm info={item} />}
                  {item.name === "marquees" && <WgtMarquees info={item} />}
                  {item.name === "navigation" && <WgtNavigation info={item} />}
                  {item.name === "coupon" && (
                    <WgtCoupon info={item} dis_id={id} />
                  )}
                  {item.name === "imgHotzone" && <WgtImgHotZone info={item} />}
                  {item.name === "goodsScroll" && (
                    <WgtGoodsScroll info={item} dis_id={id} />
                  )}
                  {item.name === "goodsGrid" && (
                    <WgtGoodsGrid
                      info={item}
                      dis_id={id}
                      index={idx}
                      type="good-grid"
                    />
                  )}
                  {item.name === "goodsGridTab" && (
                    <WgtGoodsGridTab
                      info={item}
                      index={idx}
                      type="good-grid-tab"
                    />
                  )}
                  {item.name === "showcase" && <WgtShowcase info={item} />}
                  {item.name === "store" && <WgtStore info={item} />}
                </View>
              );
            })}

            <WgtGoodsFaverite info={likeList} />
          </View>
        </ScrollView>

        <BackToTop show={showBackToTop} onClick={this.scrollBackToTop} />

        {/* <SpToast /> */}
        <AtTabBar
          fixed
          tabList={tabList}
          onClick={this.handleClick}
          current={localCurrent}
        />
      </View>
    );
  }
}
