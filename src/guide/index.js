import Taro, { Component } from "@tarojs/taro";
import { View, Image, ScrollView, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { SpToast, Loading } from "@/components";
import req from "@/api/req";
import api from "@/api";
import { pickBy, styleNames, resolveFavsList } from "@/utils";
import entry from "@/utils/entry";
import { withPager, withBackToTop } from "@/hocs";
import S from "@/spx";

import { WgtSearchHome } from "./components/wgts";
import {
  BaHomeWgts,
  BaTabBar,
  BaStoreList,
  BaStore,
  BaNavBar,
  BaGoodsBuyPanel
} from "./components";

import "../pages/home/index.scss";

@connect(
  store => ({
    store,
    favs: store.member.favs,
    homesearchfocus: store.home.homesearchfocus,
    showhometabbar: store.home.showhometabbar,
    innitShowPopupTempalte: store.home.innitShowPopupTempalte,
    scrollTop: store.home.scrollTop,
    showBuyPanel: store.guide.showBuyPanel,
    goodsSkuInfo: store.guide.goodsSkuInfo   
  }),
  dispatch => ({
    ontabSet: item => dispatch({ type: "home/tabSet", payload: { item } }),
    onCloseCart: item => dispatch({ type: "guideCart/closeCart", payload: item })
  })
)
@withPager
@withBackToTop
export default class BaGuideHomeIndex extends Component {
  config = {
    navigationStyle: "custom"
  };
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      wgts: null,
      goodsFavWgt: null,
      authStatus: false,

      isShowAddTip: false,
      background: null,
      homepopupHostInfo: null,
      scrollPosition: null,
      scrollInputConfig: {},
      isinputfix: false,
      homepopuptimer: null,
      storeCurIndex: 0,
      showStore: false,
      ba_info: null,
      shopList: [],
      defaultStore: null,
      currentIndex: 0
    };
  }

  componentDidShow = () => {};
  componentWillMount() {}

  async componentDidMount() {
    const options = this.$router.params;
    const res = await entry.entryLaunch(options, false);

    let shops = [];
    //设置导购信息
    const QwUserInfo = S.get("QwUserInfo", true);
    console.log("首页设置导购信息-QwUserInfo", QwUserInfo);
    this.setState({ QwUserInfo });
    
    
    let version = res.version;
    this.fetchInfo(version);

    let system = await Taro.getSystemInfoSync();
    if (system && system.environment === "wxwork") {
      //企业微信登录接口
      this.isAppWxWork();
    }
    //获取门店list
    setTimeout(() => {
      this.getStoreList();
    }, 500);
  
  }
  async isAppWxWork() {
    let _this = this;

    // const checkSession = await this.checkSession();
    // console.log("=====checkSession检查结果返回====", checkSession);
    const chatId = await _this.getQyChatId();

      console.log("获取群信息------0", chatId);
      let entry_form = S.get("entry_form", true);
      if (chatId) {
        S.set("qw_chatId", chatId, true);
      } else if (
        entry_form &&
        entry_form.entry === "group_chat_tools" &&
        !chatId
      ) {
        let newchatId = await _this.getNewQyChatId();
        S.set("qw_chatId", newchatId, true);
      }
  }
  checkSession() {
    return new Promise((reslove, reject) => {
      try {
        wx.qy.checkSession({
          success: res => {
            reslove(res);
          },
          fail: err => {
            reslove(err);
          },
          complete: err2 => {
            reslove(err2);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }
  //客户群id
  async getQyChatId() {    
    let ground = null;
    try {
      const context = await new Promise((reslove, reject) => {
        wx.qy.getContext({
          success: res => {
            reslove(res);
          }
        });
      });
      console.log("群=====", context);
      S.set("entry_form", context, true);
      if (context.entry === "group_chat_tools") {
        ground = await new Promise((reslove, reject) => {
          wx.qy.getCurExternalChat({
            success: res => {
              reslove(res);
            }
          });
        });
        return ground.chatId;
      } else {
        S.delete("qw_chatId", true);
        if (
          ["contact_profile", "single_chat_tools", "chat_attachment"].includes(
            context.entry
          )
        ) {
          wx.qy.getCurExternalContact({
            success: function(res) {
              S.set("chat_uid", res.userId, true);
            }
          });
        }
      }

      return ground;
    } catch (err) {
      console.log("找不到函数---1", err);
      S.delete("qw_chatId", true);
      return false;
    }
  }
  async getNewQyChatId() {
    try {
      let ground = await new Promise((reslove, reject) => {
        wx.qy.getCurExternalChat({
          success: res => {
            reslove(res);
          }
        });
      });
      return ground.chatId;
    } catch (err) {
      console.log("再次获取群ID错误====", err);
      S.delete("qw_chatId", true);
      return false;
    }
  }
  //初始化首页模版
  async fetchInfo(version = 'v1.0.1') {
    console.log('初始化首页模版-fetchInfo-version',version)
    // const url = `/pageparams/setting?template_name=yykweishopamore&version=${version}&page_name=dgindex`;
    let params = {
      template_name: 'yykweishop',
      version: version,
      page_name: 'custom_salesperson',
      company_id: 1
    }
    const info = await api.guide.getHomeTmps(params);

    // if (!S.getAuthToken()) {
    //   this.setState({
    //     authStatus: true
    //   })
    // }

    const bkg_item = info.config.find(
      item => item.name === "background" && item.config.background
    );
    const tabSet = info.config.find(item => item.name === "tabSet" && item);

    const { ontabSet, dispatch } = this.props;
    const scrollInputConfig = info.config.find(
      item => item.name === "scroll_input" && item
    );

    const sliderIndex = info.config.findIndex(
      item => item.name === "slider" || item.name === "slider-hotzone"
    );
    if (sliderIndex > -1) {
      let sliderFirstData = info.config[sliderIndex].data[0];
      if (sliderFirstData && sliderFirstData.imgUrl) {
        await Taro.getImageInfo({
          src: sliderFirstData.imgUrl
        }).then(res => {
          let width = res.width;
          let height = res.height;
          let ratio = width / height;

          let imgHeight = +(Taro.$systemSize.screenWidth / ratio).toFixed(2);
          info.config[sliderIndex].config.imgHeight = imgHeight;
        });
      }
    }

    ontabSet(tabSet);

    let tagnavIndex = -1;
    info.config.forEach(wgt_item => {
      if (wgt_item.name === "tagNavigation") {
        tagnavIndex++;
        wgt_item.tagnavIndex = tagnavIndex;
      }
    });
    let QwUserInfo = S.get("QwUserInfo", true);

    this.setState({
      wgts: info.config,
      background: (bkg_item && bkg_item.config.background) || null,
      scrollInputConfig,
      ba_info: QwUserInfo ? QwUserInfo.ba_info : ""
    });
  }

  async getStoreList(params = {}) {
    let QwUserInfo = S.get("QwUserInfo", true),{currentIndex} = this.state
    console.log('getStoreList-QwUserInfo',QwUserInfo)
    
    const  shops  = await api.guide.distributorlist({
      page: 1,
      pageSize: 10000,
      store_type: "distributor",
      store_name: params.store_name
    });
    shops.list.forEach((d,idx)=>{
      if(d.distributor_id == QwUserInfo.distributor_id) currentIndex = idx
    })
    this.handleCurIndex(currentIndex)
    
    console.log('获取门店列表以及当前下标',shops,currentIndex)
    this.setState({
      shopList: shops.list,
      defaultStore: shops.list[currentIndex]
    });
    return shops;
  }

  handleCloseCart = () => {
    setTimeout(() => {
      const { onCloseCart } = this.props;
      onCloseCart(false);
    }, 0);
  };
  handlePageScroll = top => {
    const { scrollPageHeight, scrollTop } = this.state;
    let offsetTop = scrollPageHeight + top; //滑动距离+导航元素距离scrollview元素的距离=导航标签距离页面的距离

    if (offsetTop === scrollTop) {
      offsetTop = offsetTop - 1;
    }
    this.setState({
      scrollTop: offsetTop
    });
  };
  //点击Store
  handleOpenStore = val => {
    console.log('点击Store-val',val)
    this.setState({
      showStore: val
    });
  };
  handleStoreConfirm = () => {
    const { shopList, currentIndex } = this.state;

    this.setState({
      defaultStore: shopList[currentIndex],
      showStore: false
    });
    let QwUserInfo = S.get("QwUserInfo", true);

    QwUserInfo.ba_store = shopList[currentIndex];
    QwUserInfo.store_code = shopList[currentIndex].wxshop_bn;
    S.set("QwUserInfo", QwUserInfo, true);
  };
  //修改当前门店下标
  handleCurIndex = currentIndex => {
    this.setState({
      currentIndex
    });
  };

  render() {
    const {
      wgts,
      scrollTop,
      showStore,
      defaultStore,
      shopList,
      currentIndex
    } = this.state;
    const isLoading = !wgts || !this.props.store;
    console.log('render-isLoading',isLoading)
    const { homesearchfocus, showBuyPanel, goodsSkuInfo } = this.props;
    const ipxClass = S.get("ipxClass");
    const n_ht = S.get("navbar_height");

    // ${showhometabbar?'':'preventTouchMove'}
    return (
      <View className={!isLoading ? "page-index" : ""}>
        <BaNavBar
          title="innisfree 导购商城"
          fixed
          jumpType="home"
          icon="in-icon in-icon-backhome"
        />
        <View >
         <BaStore
                onClick={this.handleOpenStore}
                defaultStore={defaultStore}
              />
              </View>
        {isLoading ? (
          <Loading></Loading>
        ) : (
          <ScrollView
            className={`wgts-wrap wgts-wrap__fixed `}
            scrollTop={scrollTop}
            onScroll={this.handleHomeScroll}
            scrollY
            style={styleNames({ top: n_ht + "PX" })}
          >
            <View className="wgts-wrap__cont">
              <BaHomeWgts
                wgts={wgts}
                source="bahome"
                onChangPageScroll={this.handlePageScroll}
              />

             
            </View>
          </ScrollView>
        )}
        {homesearchfocus && <WgtSearchHome isShow={homesearchfocus} />}
        <SpToast />
        <BaTabBar />
        {showBuyPanel && (
          <BaGoodsBuyPanel
            info={goodsSkuInfo}
            type="cart"
            isOpened={showBuyPanel}
            onClose={this.handleCloseCart}
            onAddCart={this.handleCloseCart}
          />
        )}
        {showStore && (
          <BaStoreList
            shopList={shopList}
            currentIndex={currentIndex}
            onStoreConfirm={this.handleStoreConfirm}
            onSearchStore={this.getStoreList.bind(this)}
            onChangeCurIndex={this.handleCurIndex.bind(this)}
            onClose={this.handleOpenStore}
          />
        )}
      </View>
    );
  }
}
