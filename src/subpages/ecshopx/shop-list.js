import Taro from "@tarojs/taro";
import { View, ScrollView, Image } from "@tarojs/components";
import { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import {
  SpNewInput,
  SpSearch,
  SpFilterBar,
  SpShopItem,
  SpNewFilterDrawer,
  SpLoadMore,
  SpPage,
  SpScrollView
} from "@/components";
import doc from '@/doc'
import { classNames, pickBy, JumpPageIndex } from "@/utils";
import api from "@/api";
import "./shop-list.scss";

const initialState = {
  filterList: [
    { title: '综合' },
    { title: '销量' },
    { title: '距离', sort: -1 }
  ],
  curFilterIdx: 0,
  keywords: '',
  list: []
}


function shopList(props) {
  const [state, setState] = useImmer(initialState)

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
      // name
    };
    const { list, total_count, tagList } = await api.shop.list( query );
    
    const _list = pickBy(list, doc.shop.SHOP_ITEM);

    setState( ( v ) => {
      v.list = v.list.concat(_list);
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

  const { filterList, curFilterIdx, list } = state;

  return (
    <SpPage className="page-shop-list">
      <SpSearch />
      <SpFilterBar
        custom
        current={curFilterIdx}
        list={filterList}
        onChange={handleFilterChange}
      />
      <SpScrollView className="shoplist-block" fetch={fetch}>
        {list.map((item, index) => (
          <View className="shop-item-wrapper" key={`shopitem-wrap__${index}`}>
            <SpShopItem info={item} />
          </View>
        ))}
      </SpScrollView>

      {/* <View className={"sp-page-nearbyshoplist-input"}>
        <SpNewInput placeholder={"输入商家、商品"} onConfirm={handleConfirm} />
      </View>

      {!noCompleteData && (
        <SpNewFilterbar
          filterData={FILTER_DATA}
          value={filterValue}
          onClickLabel={handleClickFilterLabel}
          onClickFilter={handleDrawer(true)}
        />
      )}

      <ScrollView
        className={classNames("sp-page-nearbyshoplist-scrollview")}
        scrollY
        scrollWithAnimation
        onScrollToLower={nextPage}
      >
        {dataList.map((item, index) => (
          <SpNewShopItem
            className={classNames("in-shoplist", {
              "in-shoplist-last": index === 99,
            })}
            info={item}
            isShowGoods={!!name}
            logoCanJump
          />
        ))}
        <SpLoadMore loading={loading} hasNext={hasNext} total={total} />
        {!loading && noData && (
          <View className={"sp-page-nearbyshoplist-nodata"}>
            <Image
              className="img"
              src={`${process.env.APP_IMAGE_CDN}/empty_data.png`}
            ></Image>
            <View className="tips">更多商家接入中，尽情期待</View>
            <View className="button" onClick={() => JumpPageIndex()}>
              去首页逛逛
            </View>
          </View>
        )}
      </ScrollView>

      <SpNewFilterDrawer
        visible={filterVisible}
        filterData={FILTER_DRAWER_DATA}
        onCloseDrawer={handleDrawer(false)}
      /> */}
    </SpPage>
  );
};

export default shopList;
