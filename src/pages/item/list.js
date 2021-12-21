import React, { useRef, useEffect } from "react";
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
import doc from "@/doc";
import api from "@/api";
import { pickBy, classNames, isWeixin, isWeb } from "@/utils";

import "./list.scss";

const initialState = {
  leftList: [],
  rightList: [],
  brandList: [],
  brandSelect: [],
  filterList: [
    { title: "综合" },
    { title: "销量" },
    { title: "价格", icon: "icon-shengxu-01" },
    { title: "价格", icon: "icon-jiangxu-01" },
  ],
  curFilterIdx: 0,
  tagList: [],
  curTagIdx: 0,
  keyword: "",
  show: false,
};

function ItemList() {
  const [state, setState] = useImmer(initialState);
  const {
    keyword,
    leftList,
    rightList,
    brandList,
    brandSelect,
    curFilterIdx,
    filterList,
    tagList,
    curTagIdx,
    show,
  } = state;

  const goodsRef = useRef();

  useEffect(() => {}, []);
  
  const fetch = async ( { pageIndex, pageSize } ) => {
  
    let params = {
      page: pageIndex,
      pageSize,
      brand_id: brandSelect.map( ( item ) => item.id ).toString(),
    };

    if ( curFilterIdx == 1 ) {
      // 销量
      params["goodsSort"] = 1;
    } else if ( curFilterIdx == 2 ) {
      // 价格升序
      params["goodsSort"] = 3;
    } else if ( curFilterIdx == 3 ) {
      // 价格降序
      params["goodsSort"] = 2;
    }

    if (curTagIdx) {
      params["tag_id"] = tagList[curTagIdx].id;
    }

    const {
      list,
      total_count,
      item_params_list = [],
      select_tags_list = [],
      brand_list,
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
      v.brandList = pickBy( brand_list?.list, doc.goods.WGT_GOODS_BRAND );
      if ( select_tags_list.length > 0 ) {
        v.tagList = [
          {
            label: "全部",
            id: 0,
          }
        ].concat( select_tags_list );
      }
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

  const onChangeTag = async (e) => {
    await setState((draft) => {
      draft.leftList = [];
      draft.rightList = [];
      draft.curTagIdx = e;
    });
    goodsRef.current.reset();
  }

  const handleFilterChange = async (e) => {
    await setState((draft) => {
      draft.leftList = [];
      draft.rightList = [];
      draft.curFilterIdx = e;
    });
    goodsRef.current.reset();
  };

  const onChangeBrand = (val) => {
    setState((draft) => {
      draft.brandSelect = val;
    });
  };

  const onConfirmBrand = async () => {
    await setState((draft) => {
      draft.leftList = [];
      draft.rightList = [];
      draft.show = false;
    });
    goodsRef.current.reset();
  };

  const onResetBrand = async () => {
    await setState((draft) => {
      draft.brandSelect = [];
      draft.leftList = [];
      draft.rightList = [];
      draft.show = false;
    });
    goodsRef.current.reset();
  };
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
        <SpTagBar className="tag-list" list={tagList} value={curTagIdx} onChange = {onChangeTag}>
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
      <SpScrollView ref={goodsRef} fetch={fetch}>
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
        onConfirm={onConfirmBrand}
        onReset={onResetBrand}
      >
        <View className="brand-title">品牌</View>
        <SpSelect
          multiple
          info={brandList}
          value={brandSelect}
          onChange={onChangeBrand}
        />
      </SpDrawer>
    </SpPage>
  );
}

export default ItemList;
