import React, { useEffect, useState, useCallback } from "react";
import Taro, {
  useShareAppMessage,
  useShareTimeline,
  useDidShow,
} from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { useSelector, useDispatch } from "react-redux";
import {
  SpScreenAd,
  SpCouponPackage,
  SpPage,
  SpSearch,
  SpRecommend,
  SpPrivacyModal,
  SpTabbar,
} from "@/components";
import api from "@/api";
import { isWeixin } from "@/utils";
import entryLaunch from "@/utils/entryLaunch";
import { updateLocation } from "@/store/slices/user";
import { useImmer } from "use-immer";
import { useLogin } from "@/hooks";
import HomeWgts from "./home/comps/home-wgts";
import { WgtHomeHeader } from "./home/wgts";
import CompAddTip from "./home/comps/comp-addtip";
import CompFloatMenu from "./home/comps/comp-floatmenu";

import "./home/index.scss";

const MCompAddTip = React.memo( CompAddTip );
const MSpPrivacyModal = React.memo(SpPrivacyModal);

const initState = {
  wgts: [],
  shareInfo: {},
  showBackToTop: false
};

function Home() {
  const [state, setState] = useImmer(initState);
  const [likeList, setLikeList] = useImmer( [] );
  const { isLogin, login, updatePolicyTime, checkPolicyChange } = useLogin({
    policyUpdateHook: () => {
      setPolicyModal(true);
    },
  } );
  
  const [policyModal, setPolicyModal] = useState( false );
  const sys = useSelector(state => state.sys);
  const { openRecommend } = sys;
  const { wgts, shareInfo } = state

  const dispatch = useDispatch();

  // useEffect( () => {
  //   fetchWgts();
  //   fetchLikeList();
  //   fetchShareInfo()
  // }, []);

  useDidShow(() => {
    fetchWgts();
    fetchLikeList();
    fetchShareInfo()
  })

  const fetchWgts = async () => {
    const { config } = await api.shop.getShopTemplate({
      distributor_id: 0, // 平台版固定值
    });
    setState((v) => {
      v.wgts = config;
    } );
    // 检查隐私协议是否变更或同意
    const checkRes = await checkPolicyChange();
    if ( checkRes ) {
      fetchLocation()
    }
  };

  const fetchLikeList = async () => {
    if (openRecommend == 1) {
      const query = {
        page: 1,
        pageSize: 1000,
      };
      const { list } = await api.cart.likeList(query);
      setLikeList(list);
    }
  };

  const fetchShareInfo = async () => {
    const res = await api.wx.shareSetting({ shareindex: "index" });
    setState( ( draft ) => {
      draft.shareInfo = res
    })
  }

  // 定位
  const fetchLocation = async () => {
    const res = await entryLaunch.getCurrentAddressInfo();
    dispatch(updateLocation(res));
  }

  const handleConfirmModal = useCallback(async () => {
    // fetchLocation()
    fetchWgts();
    setPolicyModal(false);
  }, []);

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
    <SpPage className="page-index" renderFloat={<CompFloatMenu />}>
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

      {/* 隐私政策 */}
      <MSpPrivacyModal
        open={policyModal}
        onCancel={() => {
          setPolicyModal(false);
        }}
        onConfirm={handleConfirmModal}
      />

      {/* 优惠券包 */}
      {/* <SpCouponPackage /> */}

      <SpTabbar />
    </SpPage>
  );
}

export default Home;
