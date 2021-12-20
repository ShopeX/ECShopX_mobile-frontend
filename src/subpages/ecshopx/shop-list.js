import Taro from "@tarojs/taro";
import { View, ScrollView, Text } from "@tarojs/components";
import { AtDrawer } from 'taro-ui'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import {
  SpNewInput,
  SpSearch,
  SpFilterBar,
  SpShopItem,
  SpNewFilterDrawer,
  SpSearchBar,
  SpPage,
  SpScrollView,
  SpButton,
  SpTagBar,
  SpDrawer,
  SpSelect
} from "@/components";
import doc from '@/doc'
import { classNames, pickBy } from "@/utils";
import api from "@/api";
import "./shop-list.scss";
import {BUSINESS_LIST_SERVICES} from './consts/index'

const initialState = {
  filterList: [
    { title: '综合' },
    { title: '销量' },
    { title: '距离', sort: -1 }
  ],
  curFilterIdx: 0,
  keywords: '',
  list: [],
  tagList: [],
  brandSelect: [],
}


function shopList(props) {
  const [state, setState] = useImmer( initialState )
  const {
    brandSelect,
  } = state;
  const [drawer, setDrawer] = useState(false)
  const goodsRef = useRef();
  const { location } = useSelector( state => state.user )

  // const handleClickFilterLabel = useCallback((item) => {
  //   setFilterValue(item);
  // }, []);

  // const handleDrawer = useCallback(
  //   (flag) => (selectedValue) => {
  //     setFilterVisible(flag);
  //     if (!selectedValue.tag && !Array.isArray(selectedValue.tag)) return;
  //     setTag(selectedValue.tag.length ? selectedValue.tag.join(",") : "");
  //     const is_ziti = selectedValue.logistics.includes("ziti") ? 1 : undefined;
  //     const is_delivery = selectedValue.logistics.includes("delivery")
  //       ? 1
  //       : undefined;
  //     const is_dada = selectedValue.logistics.includes("dada") ? 1 : undefined;
  //     setLogistics({
  //       is_ziti,
  //       is_delivery,
  //       is_dada,
  //     });
  //   },
  //   []
  // );

  const fetch = useCallback( async ( params ) => {
    const { pageIndex: page, pageSize } = params;
    const query = {
      page,
      pageSize,
      // province: lnglat().province,
      // city: lnglat().city ? lnglat().city : lnglat().province,
      // area: lnglat().district,
      type: 0,
      show_discount: 1,
      show_marketing_activity: 1,
      // is_ziti: logistics.is_ziti,
      // is_delivery: logistics.is_delivery,
      // is_dada: logistics.is_dada,
      // distributor_tag_id: tag,
      // lng: lnglat().longitude,
      // lat: lnglat().latitude,
      //是否展示积分
      show_score: 1,
      // sort_type: filterValue,
      show_items: 1,
      brand_id: brandSelect.map( ( item ) => item.id ).toString(),
      // name
    };
    const { list, total_count, tagList } = await api.shop.list( query );
    const _list = pickBy(list, doc.shop.SHOP_ITEM);
    const _tagList = pickBy(tagList, doc.goods.BUSINESS_LIST_TAG)

    setState( ( v ) => {
      v.list = v.list.concat(_list);
      v.tagList = _tagList
    })

    return {
      total: total_count
    };
    // setDataList([...dataList, ...list]);
    // setTotal(total_count);
    // fillFilterTag(tagList);
  }, []);

  const handleFilterChange = () => {

  }

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

  const { filterList, curFilterIdx, list,tagList } = state;
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

  const onChangeBrand = (val) => {
    setState((draft) => {
      draft.brandSelect = val;
    });
  };

  return (
    <SpPage className="page-shop-list">
      <View className="search-block">
        <SpSearchBar 
          _placeholder="请输入商家、商品"
          onFocus={handleOnFocus}
          onChange={handleOnChange}
          onClear={handleOnClear}
          onCancel={handleSearchOff}
          onConfirm={handleConfirm}
        />
      </View>
      <View className="filter-block">
        {/* <SpFilterBar
          custom
          current={curFilterIdx}
          list={filterList}
          onChange={handleFilterChange}
        >
          <View
            className="filter-btn"
            onClick={() => {
              setDrawer(true);
            }}
          >
            筛选<Text className="iconfont icon-filter"></Text>
          </View>
        </SpFilterBar> */}
        <SpTagBar className="tag-list" list={filterList} value={curFilterIdx} onChange = {handleFilterChange}>
          <View
            className="filter-btn"
            onClick={() => {
              setDrawer(true);
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
      <SpScrollView className="shoplist-block" fetch={fetch} ref={goodsRef}>
        {list.map((item, index) => (
          <View className="shop-item-wrapper" key={`shopitem-wrap__${index}`}>
            <SpShopItem info={item} />
          </View>
        ))}
      </SpScrollView>

      {/* <AtDrawer
        show={drawer}
        right
        mask
        onClose={() => {
          setDrawer(false);
        }}
      >
        <View className="drawer-content">
          <View className="drawer-bd"></View>
          <View className="drawer-ft">
            <SpButton />
          </View>
        </View>
      </AtDrawer> */}
      <SpDrawer
        show={drawer}
        onClose={() => {
          setDrawer(false);
        }}
        onConfirm={onConfirmBrand}
        onReset={onResetBrand}
      >
        <View className="brand-title">商家类型</View>
        <SpSelect
          multiple
          info={tagList}
          value={brandSelect}
          onChange={onChangeBrand}
        />
        <View className="brand-title">商家服务</View>
        <SpSelect
          multiple
          info={BUSINESS_LIST_SERVICES}
          value={brandSelect}
          onChange={onChangeBrand}
        />
      </SpDrawer>
    </SpPage>
  );
};

export default shopList;
