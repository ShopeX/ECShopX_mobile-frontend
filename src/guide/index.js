import Taro, { Component } from "@tarojs/taro";
import { View, Image, ScrollView, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { Loading } from "@/components";
import api from "@/api";
import { pickBy, styleNames, resolveFavsList } from "@/utils";
import { withLogin, withPager, withBackToTop } from "@/hocs";
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
  ({ guide }) => ({
    storeInfo: guide.storeInfo
  }),
  dispatch => ({
    updateStoreInfo: info =>
      dispatch({ type: "guide/updateStoreInfo", payload: { info } })
  })
)
@withLogin()
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
      currentIndex: 0,
      guideInfo: null
    };
  }

  componentDidShow() {
    
  }

  async componentDidMount() {
    const { version } = this.$router.params;
    //设置导购信息
    if(!this.state.wgts){
      this.guideInit(version)
    }
  }

  guideInit(version){
    const guideInfo = S.get("GUIDE_INFO", true);
    console.log('导购 - componentDidShow - index ',guideInfo)
    if(!guideInfo) return setTimeout(()=>{this.guideInit(version)},300)
    this.setState({ guideInfo }, () => {
      this.fetchInfo(version);
      this.getStoreList();
    });
  }


  async isAppWxWork() {
    let _this = this;
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

    this.getStoreList();
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
  async fetchInfo(version = "v1.0.1") {
    console.log("初始化首页模版-fetchInfo-version", version);
    // const url = `/pageparams/setting?template_name=yykweishopamore&version=${version}&page_name=dgindex`;
    let params = {
      template_name: "yykweishop",
      version: version,
      page_name: "custom_salesperson",
      company_id: 1
    };
    const info = await api.guide.getHomeTmps(params);

    const bkg_item = info.config.find(
      item => item.name === "background" && item.config.background
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

    let tagnavIndex = -1;
    info.config.forEach(wgt_item => {
      if (wgt_item.name === "tagNavigation") {
        tagnavIndex++;
        wgt_item.tagnavIndex = tagnavIndex;
      }
    } );
    
    this.setState({
      wgts: info.config,
      background: (bkg_item && bkg_item.config.background) || null,
      // scrollInputConfig
    });
  }

  //获取门店列表
  async getStoreList(params = {}) {
    const { list } = await api.guide.distributorlist({
      page: 1,
      pageSize: 10000,
      store_type: "distributor"
    });
    const { guideInfo } = this.state;
    const fd = list.find(
      item => item.distributor_id == guideInfo.distributor_id
    );
    this.setState({
      shopList: list
    });
    console.log('获取门店列表getStoreList',this.props.storeInfo)
    if(!this.props.storeInfo)
      this.props.updateStoreInfo(fd);
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
    this.setState({
      showStore: val
    });
  };

  handleStoreConfirm = (index) => {
    const { shopList } = this.state;
    this.setState(
      {
        currentIndex: index,
        showStore: false
      },
      () => {
        this.props.updateStoreInfo(shopList[index]);
      }
    );
  };

  render() {
    const {
      wgts,
      scrollTop,
      showStore,
      shopList,
      currentIndex,
      guideInfo
    } = this.state;
    const isLoading = !wgts 
    const {
      homesearchfocus,
      showBuyPanel,
      goodsSkuInfo,
      storeInfo
    } = this.props;
    console.log('首页 - render - guideInfo',guideInfo)
    const ipxClass = S.get("ipxClass");
    const n_ht = S.get("navbar_height");
    return (
      <View className={!isLoading ? "page-index" : ""}>
        <BaNavBar
          title="导购商城"
          fixed
          jumpType="home"
          icon="in-icon in-icon-backhome"
        />
        <View>
          {guideInfo && <BaStore
            onClick={this.handleOpenStore}
            guideInfo={guideInfo}
            defaultStore={storeInfo}
          />}
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
            onClose={this.handleOpenStore}
          />
        )}
      </View>
    );
  }
}
