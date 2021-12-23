import React, { useEffect, memo } from "react";
import Taro, {
  useShareAppMessage,
  useShareTimeline,
  usePageScroll,
} from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { useSelector, useDispatch } from "react-redux";
import {
  TabBar,
  BackToTop,
  FloatMenus,
  FloatMenuItem,
  AccountOfficial,
  SpScreenAd,
  CouponModal,
  SpPage,
  SpSearch,
  SpRecommend,
  SpFloatMenuItem,
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
import CompFloatMenu from "./home/comps/comp-floatmenu";

import "./home/index.scss";

const MCompAddTip = memo(CompAddTip);

const initState = {
  wgts: [],
  shareInfo: {},
  showBackToTop: false
};

function Home() {
  const [state, setState] = useImmer(initState);
  const [likeList, setLikeList] = useImmer([]);
  const { openRecommend } = Taro.getStorageSync( SG_APP_CONFIG );
  const { wgts, shareInfo } = state

  const dispatch = useDispatch();

  useEffect(() => {
    fetchInit();
    fetchWgts();
    fetchShareInfo()
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

  const fetchShareInfo = async () => {
    const res = await api.wx.shareSetting({ shareindex: "index" });
    setState( ( draft ) => {
      draft.shareInfo = res
    })
  }

  useShareAppMessage(async (res) =>  {
    return {
      title: shareInfo.title,
      imageUrl: shareInfo.imageUrl,
      path: "/pages/index",
    };
  } )
  
  useShareTimeline( async ( res ) => {
    return {
      title: shareInfo.title,
      imageUrl: shareInfo.imageUrl,
      query: "/pages/index",
    };
  } )
  


  const searchComp = wgts.find( ( wgt ) => wgt.name == "search" );
  let filterWgts = []
  if (searchComp && searchComp.config.fixTop) {
    filterWgts = wgts.filter((wgt) => wgt.name !== "search");
  } else {
    filterWgts = wgts;
  }
  return (
    <SpPage className="page-index" renderFloat={ <CompFloatMenu /> }>
      {/* header-block */}
      <WgtHomeHeader>
        {searchComp && searchComp.config.fixTop && <SpSearch />}
      </WgtHomeHeader>

      <View className="home-body">
        <HomeWgts wgts={filterWgts} />
      </View>

      {/* 猜你喜欢 */}
      {<SpRecommend className="recommend-block" info={likeList} />}

      {/* 小程序搜藏提示 */}
      {isWeixin && <MCompAddTip />}

      {/* 开屏广告 */}
      {isWeixin && <SpScreenAd />}

      {/* 浮动菜单 */}
      {/* <CompFloatMenu /> */}

      <SpTabbar />
    </SpPage>
  );
}

export default Home;
