import Taro, { Component, useState, useEffect } from "@tarojs/taro";
import { View, ScrollView, Text, Image, Button } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import {
  TabBar,
  SpLogin,
  SpImage,
  SpPrice,
  SpFloatPrivacy,
  CouponModal,
  SpModal
} from "@/components";
import api from "@/api";
import {
  navigateTo,
  getThemeStyle,
  classNames,
  showToast,
  showModal,
  styleNames,
  isWeixin,
  getPointName
} from "@/utils";
import { useLogin } from "@/hooks";
import { useImmer } from 'use-immer'
import CompsVipCard from "./comps/comp-vipcard";
import CompsPanel from "./comps/comp-panel";
import CompMenu from './comps/comp-menu'
import "./index.scss";

const initConfig = {
  banner: {
    loginBanner: "",
    noLoginBanner: "",
    pageUrl: "",
    urlOpen: false,
    appId: null
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
    memberinfo_enable: false // 个人信息
  },
  openPolicyModal: false
};

function MemberIndex(props) {
  const { isLogin, showPolicy } = useLogin();
  const [counter, setcounter] = useState( 0 );
  
  function handleClick() {
    setTimeout(() => {
      console.log('counter:', counter);
    }, 3000);
  }
  
  const [config, setConfig] = useState(initConfig);

  useEffect(async () => {
    console.log(`isLogin:`, isLogin);
    if (isLogin) {
      await api.member.getSalesperson();
      await api.trade.getCount();
      await api.vip.getList();
      await api.member.memberAssets();
      // 大转盘
      await api.wheel.getTurntableconfig();
    }
  }, []);

  useEffect(async () => {
    getMemberCenterConfig();
    // // 菜单配置
    // const res = await api.shop.getPageParamsConfig({
    //   page_name: "member_center_menu_setting"
    // });
    // setMenu({
    //   ...menu,
    //   ...res.list[0].params.data
    // } );
  }, []);

  const getMemberCenterConfig = async () => {
    const [bannerRes, menuRes, pointShopRes] = await Promise.all([
      // 会员中心banner
      await api.shop.getPageParamsConfig({
        page_name: "member_center_setting"
      }),
      // 菜单自定义
      await api.shop.getPageParamsConfig({
        page_name: "member_center_menu_setting"
      }),
      // 积分商城
      await api.pointitem.getPointitemSetting()
    ]);
    let banner, menu;
    if (bannerRes.list.length > 0) {
      const {
        app_id,
        is_show,
        login_banner,
        no_login_banner,
        page,
        url_is_open
      } = bannerRes.list[0].params.data;
      banner = {
        isShow: is_show,
        loginBanner: login_banner,
        noLoginBanner: no_login_banner,
        pageUrl: page,
        urlOpen: url_is_open,
        appId: app_id
      };
    }
    if ( menuRes.list.length > 0 ) {
      menu = menuRes.list[0].params.data;
    }
    setConfig( (state) => {
      state.banner = banner;
      state.menu = {
        ...menu,
        pointMenu: pointShopRes.entrance.mobile_openstatus
      };
    })
  };

  const handleCloseModal = () => {

  }
  
  const handleConfirmModal = () => {
    
  }

  console.info( "showPolicy:", showPolicy );
  return (
    <View className="pages-member-index" style={styleNames(getThemeStyle())}>
      <View
        className="header-block"
        style={styleNames({
          "background-image": `url(${process.env.APP_IMAGE_CDN}/m_bg.png)`
        })}
      >
        <View className="header-hd">
          <SpImage className="usericon" src="default_user.png" width="110" />
          <View>
            <View className="username-wrap">
              <Text className="username">获取昵称</Text>
              <Text className="iconfont icon-erweima-01"></Text>
            </View>
            <View className="join-us">
              <Text className="join-us-txt">加入我们?</Text>
            </View>
          </View>
        </View>
        <View className="header-bd">
          <View className="bd-item">
            <View className="bd-item-label">优惠券(张)</View>
            <View className="bd-item-value">0</View>
          </View>
          <View className="bd-item">
            <View className="bd-item-label">积分(分)</View>
            <View className="bd-item-value">0</View>
          </View>
          <View className="bd-item">
            <View className="bd-item-label">储值(¥)</View>
            <View className="bd-item-value">
              <SpPrice value={0} />
            </View>
          </View>
          <View className="bd-item">
            <View className="bd-item-label">收藏(个)</View>
            <View className="bd-item-value">0</View>
          </View>
        </View>
        <View className="header-ft">
          {/* 会员卡等级 */}
          <CompsVipCard />
        </View>
      </View>
      <View className="body-block">
        <CompsPanel title="订单" extra="查看全部订单">
          <View className="ziti-order">
            <View className="ziti-order-info">
              <View className="title">自提订单</View>
              <View className="ziti-txt">
                您有<Text className="ziti-num">0</Text>个等待自提的订单
              </View>
            </View>
            <Text className="iconfont icon-qianwang-01"></Text>
          </View>
          <View className="order-con">
            <View className="order-item">
              <SpImage src="daizhifu.png" width="70" />
              <Text className="order-txt">待支付</Text>
            </View>
            <View className="order-item">
              <SpImage src="daifahuo.png" width="70" />
              <Text className="order-txt">待发货</Text>
            </View>
            <View className="order-item">
              <SpImage src="daishouhuo.png" width="70" />
              <Text className="order-txt">待收货</Text>
            </View>
            <View className="order-item">
              <SpImage src="pingjia.png" width="70" />
              <Text className="order-txt">待评价</Text>
            </View>
            <View className="order-item">
              <SpImage src="daishouhuo.png" width="70" />
              <Text className="order-txt">售后</Text>
            </View>
          </View>
        </CompsPanel>

        
        <CompsPanel title="我的服务">
          <CompMenu />
        </CompsPanel>
        
        
        <CompsPanel title="帮助中心"></CompsPanel>
      </View>

            <SpModal
              type="policy"
              open={ }
              onCancel={handleCloseModal}
              onConfirm={handleConfirmModal}
            />

      <TabBar />
    </View>
  );
}

export default MemberIndex;