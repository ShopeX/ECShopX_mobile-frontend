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
import { Tracker } from '@/service'

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
  businessServices: [],
}


function shopList(props) {
  const [state, setState] = useImmer( initialState )
  const {
    brandSelect,
    businessServices,
    keywords,
    curFilterIdx
  } = state;
  const goodsRef = useRef();
  useEffect(() => {}, []);
  const [drawer, setDrawer] = useState(false)
  const [isShowSearch, setIsShowSearch] = useState(false)
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

  const fetch = async ( params ) => {
    const { pageIndex: page, pageSize } = params;
    const query = {
      page,
      pageSize,
      // province: lnglat().province,
      // city: lnglat().city ? lnglat().city : lnglat().province,
      // area: lnglat().district,
      type: curFilterIdx,
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
      brand_id: brandSelect.join(),
      businessServices: businessServices.join(),
      keywords: keywords
      // name
    };
    const { list, total_count, tagList } = await api.shop.list(query);
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
  };


  const handleFilterChange = async (e) => {
    await setState((draft) => {
      draft.curFilterIdx = e;
    });
    goodsRef.current.reset();
  };

  const handleOnFocus = () => {
    setIsShowSearch(true);
  };

  const handleOnChange = (val) => {
    setState(v => {
      v.keywords = val
    })
  };

  const handleOnClear = async () => {
    await setState(v => {
      v.keywords = ''
    });
    setIsShowSearch(false);
    goodsRef.current.reset();
  };

  const handleSearchOff = () => {
    setIsShowSearch(false);
  };

  const handleConfirm = async (val) => {
    Tracker.dispatch("SEARCH_RESULT", {
      keywords: val,
    });
    setIsShowSearch(false);
    await setState(v => {
      v.keywords = val
    });
    goodsRef.current.reset();
  };

  const { filterList, list,tagList,  } = state;
  const onConfirmBrand = async () => {
    await setState((draft) => {
      draft.drawer = false;
    });
    setDrawer(false);
    goodsRef.current.reset();
  };

  const onResetBrand = async () => {
    await setState((draft) => {
      draft.brandSelect = [];
      draft.businessServices = []
      draft.drawer = false;
    });
    goodsRef.current.reset();
  };

  const onChangeBrand = (val) => {
    setState((draft) => {
      draft.brandSelect = val;
    });
  };

  const onChangeBusinessServices = (val) => {
    setState((draft) => {
      draft.businessServices = val;
    });
  };

  const handleClickItem = (item) => {
    Taro.navigateTo({ url: `/pages/store/index?id=${item.distributor_id}` })
  }

  return (
    <SpPage className="page-shop-list">
      <View className="search-block">
        <SpSearchBar 
          keyword={keywords}
          _placeholder="请输入商家、商品"
          onFocus={handleOnFocus}
          onChange={handleOnChange}
          onClear={handleOnClear}
          onCancel={handleSearchOff}
          onConfirm={handleConfirm}
        />
      </View>
      <View className="filter-block">
        <SpTagBar className="tag-list" list={pickBy(filterList, doc.shop.BUSINESS_SORT)} value={curFilterIdx} onChange = {handleFilterChange}>
          <View
            className="filter-btn"
            onClick={() => {
              setDrawer(true);
            }}
          >
            筛选<Text className="iconfont icon-filter"></Text>
          </View>
        </SpTagBar>
      </View>
      <SpScrollView className="shoplist-block" fetch={fetch} ref={goodsRef}>
        {list.map((item, index) => (
          <View className="shop-item-wrapper" key={`shopitem-wrap__${index}`}>
            <SpShopItem info={item} jumpToBusiness={() => handleClickItem(item)}/>
          </View>
        ))}
      </SpScrollView>
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
          value={businessServices}
          onChange={onChangeBusinessServices}
        />
      </SpDrawer>
    </SpPage>
  );
};

export default shopList;
