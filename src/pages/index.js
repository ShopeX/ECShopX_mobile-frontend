import React, { useEffect, memo } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { useSelector, useDispatch } from "react-redux";
import {
  TabBar,
  BackToTop,
  FloatMenus,
  FloatMenuItem,
  AccountOfficial,
  ScreenAd,
  CouponModal,
  SpPage,
  SpSearch,
  SpRecommend,
  SpTabbar,
} from "@/components";

import api from "@/api";
import { pickBy, classNames, isArray, isWeixin, payTypeField } from "@/utils";

import entryLaunch from "@/utils/entryLaunch";
import { SG_APP_CONFIG } from "@/consts";
import { updateLocation } from "@/store/slices/user";
import { useImmer } from "use-immer";
import S from "@/spx";
import HomeWgts from "./home/comps/home-wgts";
import { WgtSearchHome, WgtHomeHeader } from "./home/wgts";
import Automatic from "./home/comps/automatic";
import CompAddTip from "./home/comps/comp-addtip";

import "./home/index.scss";

const MCompAddTip = memo(CompAddTip);

const initState = {
  wgts: [],
};

function Home() {
  const [state, setState] = useImmer(initState);
  const [likeList, setLikeList] = useImmer([]);
  const { openRecommend } = Taro.getStorageSync(SG_APP_CONFIG);

  const dispatch = useDispatch();

  useEffect(() => {
    fetchInit();
    fetchWgts();
    fetchAdConfig();
  }, []);

  const fetchInit = async () => {
    if (openRecommend == 1) {
      const query = {
        page: 1,
        pageSize: 1000,
      };
      const { list } = await api.cart.likeList(query);
      setLikeList(list);
    }

    const res = await entryLaunch.getCurrentAddressInfo();
    dispatch(updateLocation(res));
  };

  const fetchWgts = async () => {
    const { config } = await api.shop.getShopTemplate({
      distributor_id: 0, // 平台版固定值
    });
    setState((v) => {
      v.wgts = config;
    });
  };

  // 获取弹窗广告配置
  const fetchAdConfig = async () => {
    const { general, membercard } = await api.promotion.automatic({
      register_type: "all",
    });

    // let openAdvertList = [general || {}, membercard || {}]
    //   .filter((item) => item.is_open === "true")
    //   .map((item) => ({ adPic: item.ad_pic, title: item.ad_title }));

    // this.setState({
    //   advertList: openAdvertList,
    // });
  };

  // const fetchShareConfig = async () => {

  // }

  // const fetchAdConfig = async () => {
  //   // 获取弹窗广告配置
  //   const { general, membercard } = await api.promotion.automatic({
  //     register_type: 'all'
  //   })

  // }

  const searchComp = state.wgts.find((wgt) => wgt.name == "search");
  let wgts = state.wgts;
  if (searchComp && searchComp.config.fixTop) {
    wgts = state.wgts.filter((wgt) => wgt.name !== "search");
  }

  return (
    <SpPage className="page-index">
      {/* header-block */}
      <WgtHomeHeader>
        {searchComp && searchComp.config.fixTop && <SpSearch />}
      </WgtHomeHeader>

      <View className="home-body">
        <HomeWgts wgts={wgts} />
      </View>

      {/* 猜你喜欢 */}
      {<SpRecommend className="recommend-block" info={likeList} />}

      {/* 小程序搜藏提示 */}
      {isWeixin && <MCompAddTip />}

      <SpTabbar />
    </SpPage>
  );
}

export default Home;
