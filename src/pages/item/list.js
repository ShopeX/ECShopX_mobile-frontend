import Taro, { Component, useState, useEffect } from "@tarojs/taro";
import { View, Text, ScrollView } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { withPager, withBackToTop } from "@/hocs";
import { AtDrawer, AtTabs } from "taro-ui";
import {
  BackToTop,
  Loading,
  TagsBar,
  SpFilterBar,
  SearchBar,
  GoodsItem,
  SpGoodsItem,
  SpSearchBar,
  SpNote,
  SpNavBar,
  SpTagBar,
  TabBar
} from "@/components";
import api from "@/api";
import { Tracker } from "@/service";
import {
  pickBy,
  classNames,
  isWeixin,
  isWeb,
  isNavbar,
  styleNames,
  getThemeStyle
} from "@/utils";
import { usePage } from "@/sphooks";
import entry from "../../utils/entry";

import "./list.scss";

// @connect(({ member }) => ({
//   favs: member.favs
// }))
// @withPager
// @withBackToTop

const filterList = [
  { title: "综合" },
  { title: "销量" },
  { title: "价格", icon: "icon-shengxu-01" },
  { title: "价格", icon: "icon-jiangxu-01" }
];

function ItemList() {
  const [list, setList] = useState({
    leftList: [],
    rightList: []
  });
  const { leftList, rightList } = list;
  const fetch = async ({ pageIndex, pageSize }) => {
    console.log("fetch.........");
    const params = {
      page: pageIndex,
      pageSize
    };
    const {
      list,
      total_count: total,
      item_params_list = [],
      select_tags_list = []
    } = await api.item.search(params);
    const leftList = list.filter((item, index) => {
      if (index % 2 == 0) {
        return item;
      }
    });
    const rightList = list.filter((item, index) => {
      if (index % 2 == 1) {
        return item;
      }
    });
    setList({
      leftList,
      rightList
    });
  };

  const { nextPage } = usePage({ fetch });

  // useEffect(() => {
  //   nextPage();
  // });

  // useEffect( async () => {

  // }, [])

  return (
    <View
      className={classNames("page-goods-list", {
        "has-navbar": isNavbar()
      })}
      style={styleNames(getThemeStyle())}
    >
      <SpNavBar title="商品列表" leftIconType="chevron-left" fixed />

      <ScrollView
        className={classNames("scroll-view")}
        scrollY
        scrollWithAnimation
        onScrollToLower={nextPage}
      >
        <View className="search-wrap">
          <View></View>
          <SpSearchBar />
        </View>

        <View className="tag-block">
          <View className="tag-container">
            {/* <SpTagBar list={tagsList} /> */}
          </View>
          <View className="filter-btn">
            <Text className="filter-text">刷选</Text>
            <Text className="iconfont icon-shaixuan-01"></Text>
          </View>
        </View>

        {/* <SpFilterBar
          className="goods-tabs"
          custom
          current={curFilterIdx}
          list={filterList}
          onChange={this.handleFilterChange}
        /> */}

        <View className="goods-list">
          <View className="left-container">
            {leftList.map(item => (
              <View className="goods-list-wrap" key={item.item_id}>
                <SpGoodsItem info={item} />
              </View>
            ))}
          </View>
          <View className="right-container">
            {rightList.map(item => (
              <View className="goods-list-wrap" key={item.item_id}>
                <SpGoodsItem info={item} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* <BackToTop
        show={showBackToTop}
        onClick={this.scrollBackToTop}
        bottom={30}
      /> */}
    </View>
  );
}

export default ItemList;
