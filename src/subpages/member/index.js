import Taro, { useShareAppMessage, useDidShow } from "@tarojs/taro";
import { useState, useEffect, useCallback, useRef } from "react";
import { View, ScrollView, Text, Image, Button } from "@tarojs/components";
import { useSelector } from "react-redux";
import { useImmer } from "use-immer";
import {
  TabBar,
  SpLogin,
  SpImage,
  SpPrice,
  CouponModal,
  SpModal,
  SpPrivacyModal,
  SpTabbar,
  SpPage,
} from "@/components";
import api from "@/api";
import {
  navigateTo,
  getThemeStyle,
  styleNames,
  classNames,
  showToast,
  showModal,
  isWeixin,
  log,
} from "@/utils";
import { useLogin } from "@/hooks";
import CompVipCard from "./comps/comp-vipcard";
import CompBanner from "./comps/comp-banner";
import CompPanel from "./comps/comp-panel";
import CompMenu from "./comps/comp-menu";
import CompHelpCenter from "./comps/comp-helpcenter";
import "./index.scss";

const initialConfigState = {
  banner: {
    isShow: false,
    loginBanner: "",
    noLoginBanner: "",
    pageUrl: "",
    urlOpen: false,
    appId: null,
  },
  menu: {
    pointMenu: false, // 积分菜单
    activity: false, // 活动预约
    offline_order: false, // 线下订单
    boost_activity: false, // 助力活动
    boost_order: false, // 助力订单
    complaint: false, // 投诉记录
    community_order: false, // 社区团购
    ext_info: false,
    group: false, // 我的拼团
    member_code: false, // 会员二维码
    recharge: false, // 储值
    ziti_order: false, // 自提
    share_enable: false, // 分享
    memberinfo_enable: false, // 个人信息
  },
  infoAppId: "",
  infoPage: "",
  infoUrlIsOpen: true,
  pointAppId: "",
  pointPage: "",
  pointUrlIsOpen: true,
};

const initialState = {
  favCount: 0,
  point: 0,
  couponCount: 0,
  username: "",
  avatar: "",
  mobile: "",
  waitPayNum: 0,
  waitSendNum: 0,
  waitRecevieNum: 0,
  waitEvaluateNum: 0,
  afterSalesNum: 0,
  zitiNum: 0,
};

function MemberIndex(props) {
  const { isLogin, updatePolicyTime, getUserInfoAuth } = useLogin({
    autoLogin: true,
    policyUpdateHook: () => {
      setPolicyModal(true);
    },
  });
  const [config, setConfig] = useImmer(initialConfigState);
  const [state, setState] = useImmer(initialState);
  const [policyModal, setPolicyModal] = useState(false);

  const { userInfo = {}, vipInfo = {} } = useSelector((state) => state.user);
  log.debug(`store userInfo: ${JSON.stringify(userInfo)}`);

  useEffect(() => {
    if (isLogin) {
      getMemberCenterData();
    }
  }, [isLogin]);

  useEffect(() => {
    getMemberCenterConfig();
  }, []);

  // 分享
  useShareAppMessage(async (res) => {
    const { share_title = "震惊！这店绝了！", share_pic_wechatapp } =
      await api.member.getMemberShareConfig();
    const { logo } = await api.distribution.getDistributorInfo({
      distributor_id: 0,
    });
    return {
      title: share_title,
      imageUrl: share_pic_wechatapp || logo,
      path: "/pages/index",
    };
  });

  const getMemberCenterConfig = async () => {
    const [bannerRes, menuRes, redirectRes, pointShopRes] = await Promise.all([
      // 会员中心banner
      await api.shop.getPageParamsConfig({
        page_name: "member_center_setting",
      }),
      // 菜单自定义
      await api.shop.getPageParamsConfig({
        page_name: "member_center_menu_setting",
      }),
      // 积分跳转配置
      await api.shop.getPageParamsConfig({
        page_name: "member_center_redirect_setting",
      }),
      // 积分商城
      await api.pointitem.getPointitemSetting(),
    ]);
    let banner, menu, redirectInfo;
    if (bannerRes.list.length > 0) {
      const {
        app_id,
        is_show,
        login_banner,
        no_login_banner,
        page,
        url_is_open,
      } = bannerRes.list[0].params.data;
      banner = {
        isShow: is_show,
        loginBanner: login_banner,
        noLoginBanner: no_login_banner,
        pageUrl: page,
        urlOpen: url_is_open,
        appId: app_id,
      };
    }
    if (menuRes.list.length > 0) {
      menu = menuRes.list[0].params.data;
    }
    if (redirectRes.list.length > 0) {
      const {
        info_app_id,
        info_page,
        info_url_is_open,
        point_app_id,
        point_page,
        point_url_is_open,
      } = redirectRes.list[0].params.data;
      redirectInfo = {
        infoAppId: info_app_id,
        infoPage: info_page,
        infoUrlIsOpen: info_url_is_open,
        pointAppId: point_app_id,
        pointPage: point_page,
        pointUrlIsOpen: point_url_is_open,
      };
    }
    setConfig((draft) => {
      draft.banner = banner;
      draft.menu = {
        ...menu,
        pointMenu: pointShopRes.entrance.mobile_openstatus,
      };
      draft.infoAppId = redirectInfo.info_app_id;
      draft.infoPage = redirectInfo.info_page;
      draft.infoUrlIsOpen = redirectInfo.info_url_is_open;
      draft.pointAppId = redirectInfo.point_app_id;
      draft.pointPage = redirectInfo.point_page;
      draft.pointUrlIsOpen = redirectInfo.point_url_is_open;
    });
  };

  const getMemberCenterData = async () => {
    const resSales = await api.member.getSalesperson();
    const resTrade = await api.trade.getCount();
    const resVip = await api.vip.getList();
    const resAssets = await api.member.memberAssets();
    // 大转盘
    const resTurntable = await api.wheel.getTurntableconfig();

    const { discount_total_count, fav_total_count, point_total_count } =
      resAssets;
    const {
      aftersales, // 待处理售后
      normal_notpay_notdelivery, // 未付款未发货
      normal_payed_daifahuo, // 待发货
      normal_payed_daishouhuo, // 待收货
      normal_payed_daiziti, // 待自提订单
      normal_not_rate // 待评论
    } = resTrade;

    setState((draft) => {
      draft.favCount = fav_total_count;
      draft.point = point_total_count;
      draft.couponCount = discount_total_count;
      draft.waitPayNum = normal_notpay_notdelivery;
      draft.waitSendNum = normal_payed_daifahuo;
      draft.waitRecevieNum = normal_payed_daishouhuo;
      draft.afterSalesNum = aftersales;
      draft.zitiNum = normal_payed_daiziti;
      draft.waitEvaluateNum = normal_not_rate
    });
  };

  const handleClickLink = async (link) => {
    await getUserInfoAuth();
    Taro.navigateTo({ url: link });
  };

  const handleClickPoint = () => {
    const { pointAppId, pointPage, pointUrlIsOpen } = config;
    if (pointUrlIsOpen) {
      Taro.navigateToMiniProgram({
        appId: pointAppId,
        path: pointPage,
      });
    }
  };

  const handleClickService = async (item) => {
    const { link, key } = item;
    await getUserInfoAuth();
    // 分销推广
    if (key == "popularize") {
      // 已经是分销员
      if (userInfo.isPromoter) {
        Taro.navigateTo({ url: link });
      } else {
        const { confirm } = await Taro.showModal({
          title: "邀请推广",
          content: "确定申请成为推广员？",
          showCancel: true,
          cancel: "取消",
          confirmText: "确认",
          confirmColor: "#0b4137",
        });
        if (!confirm) return;
        const { status } = await api.distribution.become();
        if (status) {
          Taro.showModal({
            title: "恭喜",
            content: "已成为推广员",
            showCancel: false,
            confirmText: "好",
          });
        }
      }
      return;
    }
    if (key == "useinfo") {
      const { infoAppId, infoPage, infoUrlIsOpen } = config;
      if (infoUrlIsOpen) {
        Taro.navigateToMiniProgram({
          appId: infoAppId,
          path: infoPage,
        });
      }
    }
    if (link) {
      Taro.navigateTo({ url: link });
    }
  };

  const VipGradeDom = () => {
    if (isLogin) {
      return (
        <View className="gradename">
          {
            {
              true: vipInfo.grade_name || "会员",
              false: userInfo?.gradeInfo?.grade_name || "",
            }[vipInfo.isVip]
          }
        </View>
      );
    } else {
      return (
        <SpLogin>
          <Text className="join-us-txt">加入我们?</Text>
        </SpLogin>
      );
    }
  };

  if (!config) {
    return null;
  }

  // console.log(`member page:`, state, config);

  return (
    <SpPage className="pages-member-index">
      <View
        className="header-block"
        style={styleNames({
          "background-image": `url(${process.env.APP_IMAGE_CDN}/m_bg.png)`,
        })}
      >
        <View className="header-hd">
          <SpImage
            className="usericon"
            src={(userInfo && userInfo.avatar) || "default_user.png"}
            width="110"
            onClick={handleClickLink.bind(
              this,
              "/marketing/pages/member/userinfo"
            )}
          />
          <View className="header-hd__body">
            <View className="username-wrap">
              <Text className="username">
                {(userInfo && (userInfo.username || userInfo.mobile)) ||
                  "获取昵称"}
              </Text>
              {config.menu.member_code && (
                <Text
                  className="iconfont icon-erweima-01"
                  onClick={handleClickLink.bind(
                    this,
                    "/marketing/pages/member/member-code"
                  )}
                ></Text>
              )}
            </View>
            <View className="join-us">{VipGradeDom()}</View>
          </View>
        </View>
        <View className="header-bd">
          <View
            className="bd-item"
            onClick={handleClickLink.bind(
              this,
              "/marketing/pages/member/coupon"
            )}
          >
            <View className="bd-item-label">优惠券(张)</View>
            <View className="bd-item-value">{state.couponCount}</View>
          </View>
          <View className="bd-item" onClick={handleClickPoint}>
            <View className="bd-item-label">积分(分)</View>
            <View className="bd-item-value">{state.point}</View>
          </View>
          {/* <View className='bd-item'>
            <View className='bd-item-label'>储值(¥)</View>
            <View className='bd-item-value'>
              <SpPrice value={state.deposit} />
            </View>
          </View> */}
          <View
            className="bd-item"
            onClick={handleClickLink.bind(this, "/pages/member/item-fav")}
          >
            <View className="bd-item-label">收藏(个)</View>
            <View className="bd-item-value">{state.favCount}</View>
          </View>
        </View>
        <View className="header-ft">
          {/* 会员卡等级 */}
          {vipInfo.isOpen && (
            <CompVipCard
              info={vipInfo}
              onLink={handleClickLink.bind(
                this,
                "/subpage/pages/vip/vipgrades"
              )}
              userInfo={userInfo}
            />
          )}
        </View>
      </View>

      <View className="body-block">
        {config.banner.isShow && (
          <CompBanner
            info={config.banner}
            src={
              isLogin ? config.banner.loginBanner : config.banner.noLoginBanner
            }
          />
        )}

        <CompPanel
          title="订单"
          extra="查看全部订单"
          onLink={handleClickLink.bind(this, "/subpage/pages/trade/list")}
        >
          {config.menu.ziti_order && (
            <View
              className="ziti-order"
              onClick={handleClickLink.bind(
                this,
                "/subpage/pages/trade/customer-pickup-list"
              )}
            >
              <View className="ziti-order-info">
                <View className="title">自提订单</View>
                <View className="ziti-txt">
                  您有<Text className="ziti-num">{state.zitiNum}</Text>
                  个等待自提的订单
                </View>
              </View>
              <Text className="iconfont icon-qianwang-01"></Text>
            </View>
          )}

          <View className="order-con">
            <View
              className="order-item"
              onClick={handleClickLink.bind(
                this,
                "/subpage/pages/trade/list?status=5"
              )}
            >
              <SpImage src="daizhifu.png" className="icon-style" />
              {state.waitPayNum > 0 && (
                <View className="order-bradge">
                  <Text>{state.waitPayNum}</Text>
                </View>
              )}
              <Text className="order-txt">待支付</Text>
            </View>
            <View
              className="order-item"
              onClick={handleClickLink.bind(
                this,
                "/subpage/pages/trade/list?status=1"
              )}
            >
              <SpImage src="daishouhuo.png" className="icon-style" />
              {state.waitRecevieNum + state.waitSendNum > 0 && (
                <View className="order-bradge">
                  <Text>{state.waitRecevieNum + state.waitSendNum}</Text>
                </View>
              )}
              <Text className="order-txt">待收货</Text>
            </View>
            <View
              className="order-item"
              onClick={handleClickLink.bind(
                this,
                "/subpage/pages/trade/list?status=7"
              )}
            >
              <SpImage src="pingjia.png" className="icon-style" />
              {state.waitEvaluateNum > 0 && (
                <View className="order-bradge">
                  <Text>{state.waitEvaluateNum}</Text>
                </View>
              )}
              <Text className="order-txt">待评价</Text>
            </View>
            <View
              className="order-item"
              onClick={handleClickLink.bind(
                this,
                "/subpage/pages/trade/after-sale"
              )}
            >
              <SpImage src="shouhou.png" className="icon-style" />
              {state.afterSalesNum > 0 && (
                <View className="order-bradge">
                  <Text>{state.afterSalesNum}</Text>
                </View>
              )}
              <Text className="order-txt">售后</Text>
            </View>
          </View>
        </CompPanel>

        <CompPanel title="我的服务">
          <CompMenu
            accessMenu={{
              ...config.menu,
              popularize: userInfo ? userInfo.popularize : false,
            }}
            isPromoter={userInfo ? userInfo.isPromoter : false}
            onLink={handleClickService}
          />
        </CompPanel>

        <CompPanel title="帮助中心">
          <CompHelpCenter onLink={handleClickService} />
        </CompPanel>
      </View>
      {/* <View className="dibiao-block">
        <SpImage className="dibiao-image" src="dibiao.png" />
      </View> */}

      {/* 隐私政策 */}
      <SpPrivacyModal
        open={policyModal}
        onCancel={() => {
          setPolicyModal(false);
        }}
        onConfirm={() => {
          setPolicyModal(false);
        }}
      />

      <SpTabbar />
    </SpPage>
  );
}

export default MemberIndex;
