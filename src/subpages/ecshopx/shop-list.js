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
import { BUSINESS_LIST_SERVICES, FILTER_DATA, DISTANCE_PLUS_SORT, DISTANCE_MINUS_SORT, DEFAULT_SORT_VALUE } from './consts/index'
import { Tracker } from '@/service'

const initialState = {
  curFilterIdx: 0,
  name: '',
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
    name,
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
      province: location.lat ? location.province : '北京市',
      city: location.lat ? location.city : '北京市',
      area: location.lat ? location.district : '昌平区',
      type: 0,
      show_discount: 1,
      show_marketing_activity: 1,
      is_ziti: businessServices.includes('ziti') ? 1 : undefined,
      is_delivery: businessServices.includes('delivery') ? 1 : undefined,
      is_dada: businessServices.includes('dada') ? 1 : undefined,
      distributor_tag_id: brandSelect.join(),
      lng: location.lng,
      lat: location.lat,
      //是否展示积分
      show_score: 1,
      sort_type: curFilterIdx,
      show_items: 1,
      name,
    };
    const { list, total_count, tagList } = await api.shop.list(query);
    const _list = pickBy(list, doc.shop.SHOP_ITEM);
    const _tagList = pickBy(tagList, doc.goods.BUSINESS_LIST_TAG)

    await setState(v=> {
      v.list = [...v.list, ..._list];
      v.tagList = _tagList
    })

    return {
      total: total_count
    };
    // setDataList([...dataList, ...list]);
    // setTotal(total_count);
    // fillFilterTag(tagList);
  };


  const handleFilterChange = useCallback(async(item) => {
    const lastDistanceFilter = curFilterIdx == DISTANCE_PLUS_SORT || curFilterIdx == DISTANCE_MINUS_SORT
    const distanceFilter = item == DISTANCE_PLUS_SORT || item == DISTANCE_MINUS_SORT
    // console.log("===curFilterIdx", curFilterIdx, item, lastDistanceFilter, distanceFilter)
    await setState((draft) => {
      draft.list = []
    })
    //如果从非距离tab切换回来距离tab  应该是由近到远
    if (!lastDistanceFilter && distanceFilter) {
      setState((draft) => {
        draft.curFilterIdx = DEFAULT_SORT_VALUE;
      })
      goodsRef.current.reset()
      return
    }
    await setState((draft) => {
      draft.curFilterIdx = item;
    })
    goodsRef.current.reset()
  }, [curFilterIdx])

  const handleOnFocus = () => {
    setIsShowSearch(true);
  };

  const handleOnChange = (val) => {
    setState(v => {
      v.name = val
    })
  };

  const handleOnClear = async () => {
    await setState(v => {
      v.name = ''
      v.list = []
    });
    setIsShowSearch(false);
    goodsRef.current.reset();
  };

  const handleSearchOff = () => {
    setState(v => {
      v.name = ''
    })
    setIsShowSearch(false);
  };

  const handleConfirm = async (val) => {
    Tracker.dispatch("SEARCH_RESULT", {
      name: val,
    });
    setIsShowSearch(false);
    await setState(v => {
      v.list = []
      v.name = val
    });
    goodsRef.current.reset();
  };

  const { list, tagList,  } = state;
  const onConfirmBrand = async () => {
    setDrawer(false);
    await setState(v => {
      v.list = []
    })
    goodsRef.current.reset();
  };

  const onResetBrand = async () => {
    await setState((draft) => {
      draft.brandSelect = [];
      draft.businessServices = []
      draft.list = []
    });
    setDrawer(false);
    goodsRef.current.reset();
  };

  const onChangeBrand = async (val) => {
    await setState((draft) => {
      draft.brandSelect = val;
    });
  };

  const onChangeBusinessServices = async (val) => {
    await setState((draft) => {
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
          keyword={name}
          placeholder="请输入商家、商品"
          onFocus={handleOnFocus}
          onChange={handleOnChange}
          onClear={handleOnClear}
          onCancel={handleSearchOff}
          onConfirm={handleConfirm}
        />
      </View>
      <View className="filter-block">
        <SpTagBar className="tag-list" list={FILTER_DATA} value={curFilterIdx} onChange={handleFilterChange}>
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
