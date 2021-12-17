import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "@tarojs/components";
import { connect } from "react-redux";
import { useImmer } from "use-immer";
import { withPager, withBackToTop } from "@/hocs";
import { AtDrawer, AtTabs } from "taro-ui";
import {
  BackToTop,
  Loading,
  TagsBar,
  SpFilterBar,
  SearchBar,
  GoodsItem,
  SpTagBar,
  SpGoodsItem,
  SpSearchBar,
  SpNote,
  SpNavBar,
  SpLoadMore,
  TabBar,
  SpPage,
  SpScrollView,
  SpDrawer,
  SpSelect,
} from "@/components";
import doc from '@/doc'
import api from "@/api";
import { pickBy, classNames, isWeixin, isWeb } from "@/utils";

import "./list.scss";

const initialState = {
  leftList: [],
  rightList: [],
  brandList: [],
  filterList: [
    { title: "综合" },
    { title: "销量" },
    { title: "价格", icon: "icon-shengxu-01" },
    { title: "价格", icon: "icon-jiangxu-01" },
  ],
  curFilterIdx: 0,
  tagList: [],
  keyword: "",
  show: true,
};

function ItemList() {
  const [state, setState] = useImmer(initialState);

  useEffect(() => {}, []);

  const fetch = async ({ pageIndex, pageSize }) => {
    const params = {
      page: pageIndex,
      pageSize,
    };
    const {
      list,
      total_count,
      item_params_list = [],
      select_tags_list = [],
      brand_list
    } = await api.item.search(params);
    const resLeftList = list.filter((item, index) => {
      if (index % 2 == 0) {
        return item;
      }
    });
    const resRightList = list.filter((item, index) => {
      if (index % 2 == 1) {
        return item;
      }
    });

    setState((v) => {
      v.leftList = [...v.leftList, ...resLeftList];
      v.rightList = [...v.rightList, ...resRightList];
      v.brandList = pickBy(brand_list?.list, doc.goods.WGT_GOODS_BRAND)
      v.tagList = [
        {
          label: "全部",
          id: 0,
        },
        {
          label: "全部",
          id: 1,
        },
        {
          label: "全部",
          id: 2,
        },
      ].concat(select_tags_list);
    });

    return { total: total_count };
  };

  const handleOnFocus = () => {
    setIsShowSearch(true);
  };

  const handleOnChange = (val) => {
    setQuery({ ...query, keywords: val });
  };

  const handleOnClear = () => {
    setQuery({ ...query, keywords: "" });
    setIsShowSearch(false);
    resetPage();
    setList({ leftList: [], rightList: [] });
    nextPage();
  };

  const handleSearchOff = () => {
    setIsShowSearch(false);
  };

  const handleConfirm = (val) => {
    Tracker.dispatch("SEARCH_RESULT", {
      keywords: val,
    });
    setIsShowSearch(false);
    setQuery({ ...query, keywords: val });
    resetPage();
    setList({ leftList: [], rightList: [] });
    nextPage();
  };

  const handleFilterChange = () => {};

  const {
    keyword,
    leftList,
    rightList,
    brandList,
    curFilterIdx,
    filterList,
    tagList,
    show,
  } = state;
  return (
    <SpPage className={classNames("page-item-list")}>
      <View className="item-list-head">
        <View className="search-wrap">
          <SpSearchBar
            keyword={keyword}
            placeholder="搜索商品"
            onFocus={handleOnFocus}
            onChange={handleOnChange}
            onClear={handleOnClear}
            onCancel={handleSearchOff}
            onConfirm={handleConfirm}
          />
        </View>
        <SpTagBar className="tag-list" list={tagList}>
          <View
            className="filter-btn"
            onClick={() => {
              setState((v) => {
                v.show = true;
              });
            }}
          >
            筛选<Text className="iconfont icon-filter"></Text>
          </View>
        </SpTagBar>
        <SpFilterBar
          custom
          current={curFilterIdx}
          list={filterList}
          onChange={handleFilterChange}
        />
      </View>
      <SpScrollView fetch={fetch}>
        <View className="goods-list">
          <View className="left-container">
            {leftList.map((item, index) => (
              <View className="goods-item-wrap" key={`goods-item__${index}`}>
                <SpGoodsItem info={item} />
              </View>
            ))}
          </View>
          <View className="right-container">
            {rightList.map((item, index) => (
              <View className="goods-item-wrap" key={`goods-item__${index}`}>
                <SpGoodsItem info={item} />
              </View>
            ))}
          </View>
        </View>
      </SpScrollView>

      <SpDrawer
        show={show}
        onClose={() => {
          setState((v) => {
            v.show = false;
          });
        }}
      >
        <View className="brand-title">品牌</View>
        <SpSelect info={brandList} />
      </SpDrawer>
    </SpPage>
  );
}

export default ItemList;
