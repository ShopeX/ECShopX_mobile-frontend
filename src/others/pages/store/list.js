import React, { Component } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components'
import { connect } from 'react-redux'
import { withPager, withBackToTop } from '@/hocs'
import { AtDrawer, AtTabBar } from 'taro-ui'
import {
  BackToTop,
  Loading,
  TagsBar,
  FilterBar,
  SearchBar,
  GoodsItem,
  SpNote,
  SpNavBar
} from '@/components'
import api from '@/api'
import { pickBy, classNames, getCurrentRoute,getBrowserEnv } from '@/utils'

import './list.scss'
@connect(({ user }) => ({
  favs: user.favs,
}))
@withPager
@withBackToTop
export default class List extends Component {
  $instance = getCurrentInstance();
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      curFilterIdx: 0,
      curTagId: "",
      filterList: [
        { title: "综合" },
        { title: "销量" },
        { title: "价格", sort: -1 },
      ],
      query: null,
      list: [],
      oddList: [],
      evenList: [],
      tagsList: [],
      paramsList: [],
      listType: "grid",
      isShowSearch: false,
      showDrawer: false,
      selectParams: [],
      info: {},
      shareInfo: {},
      localCurrent: 1,
      tabList: [
        {
          title: "店铺首页",
          iconType: "home",
          iconPrefixClass: "iconfont icon",
          url: "/pages/store/index",
        },
        {
          title: "商品列表",
          iconType: "list",
          iconPrefixClass: "iconfont icon",
          url: "/others/pages/store/list",
        },
        {
          title: "商品分类",
          iconType: "category",
          iconPrefixClass: "iconfont icon",
          url: "/others/pages/store/category",
        },
      ],
    };
  }

  componentDidMount() {
    const { cat_id = null, main_cat_id = null } = this.$instance.router.params;
    this.firstStatus = true;

    this.setState(
      {
        query: {
          keywords: this.$instance.router.params.keywords,
          item_type: "normal",
          is_point: "false",
          distributor_id: this.$instance.router.params.dis_id,
          approve_status: "onsale,only_show",
          category: cat_id ? cat_id : "",
          main_category: main_cat_id ? main_cat_id : "",
        },
        curTagId: this.$instance.router.params.tag_id,
      },
      () => {
        this.nextPage();
        api.wx.shareSetting({ shareindex: "itemlist" }).then((res) => {
          this.setState({
            shareInfo: res,
          });
        });
      }
    );
  }

  componentWillReceiveProps(next) {
    if (Object.keys(this.props.favs).length !== Object.keys(next.favs).length) {
      setTimeout(() => {
        const list = this.state.list.map((item) => {
          item.is_fav = Boolean(next.favs[item.item_id]);
          return item;
        });
        this.setState({
          list,
        });
      });
    }
  }

  onShareAppMessage() {
    const res = this.state.shareInfo;
    const { userId } = Taro.getStorageSync("userinfo");
    const query = userId ? `?uid=${userId}` : "";
    return {
      title: res.title,
      imageUrl: res.imageUrl,
      path: `/pages/item/list${query}`,
    };
  }

  onShareTimeline() {
    const res = this.state.shareInfo;
    const { userId } = Taro.getStorageSync("userinfo");
    const query = userId ? `uid=${userId}` : "";
    return {
      title: res.title,
      imageUrl: res.imageUrl,
      query: query,
    };
  }

  async fetch(params) {
    const { page_no: page, page_size: pageSize } = params;
    const { selectParams, tagsList, curTagId } = this.state;
    const { distributor_id } = Taro.getStorageSync("curStore");

    const query = {
      ...this.state.query,
      item_params: selectParams,
      tag_id: curTagId,
      page,
      pageSize,
    };

    if (process.env.APP_PLATFORM === "standard") {
      query.distributor_id = distributor_id;
    }

    const {
      list,
      total_count: total,
      item_params_list = [],
      select_tags_list = [],
    } = await api.item.search(query);
    const { favs } = this.props;

    item_params_list.map((item) => {
      if (selectParams.length < 4) {
        selectParams.push({
          attribute_id: item.attribute_id,
          attribute_value_id: "all",
        });
      }
      item.attribute_values.unshift({
        attribute_value_id: "all",
        attribute_value_name: "全部",
        isChooseParams: true,
      });
    });
    
    const nList = pickBy(list, {
      img: ({ pics }) =>
        typeof pics !== "string" ? pics[0] : JSON.parse(pics)[0],
      item_id: "item_id",
      title: ({ itemName, item_name }) => (itemName ? itemName : item_name),
      desc: "brief",
      distributor_info: "distributor_info",
      distributor_id: "distributor_id",
      promotion_activity_tag: "promotion_activity",
      price: ({ price }) => (price / 100).toFixed(2),
      member_price: ({ member_price }) => (member_price / 100).toFixed(2),
      market_price: ({ market_price }) => (market_price / 100).toFixed(2),
      is_fav: ({ item_id }) => Boolean(favs.find(item => item.item_id == item_id)),
    });
    let odd = [],
      even = [];
    nList.map((item, idx) => {
      if (idx % 2 == 0) {
        odd.push(item);
      } else {
        even.push(item);
      }
    });

    this.setState({
      list: [...this.state.list, ...nList],
      oddList: [...this.state.oddList, ...odd],
      evenList: [...this.state.evenList, ...even],
      showDrawer: false,
      query,
    });

    if (this.firstStatus) {
      this.setState({
        paramsList: item_params_list,
        selectParams,
      });
      this.firstStatus = false;
    }

    if (tagsList.length === 0) {
      let tags = select_tags_list;
      tags.unshift({
        tag_id: 0,
        tag_name: "全部",
      });
      this.setState({
        //curTagId: 0,
        tagsList: tags,
      });
    }

    return {
      total,
    };
  }

  handleTagChange = (data) => {
    const { current } = data;
    this.resetPage();
    this.setState({
      list: [],
      oddList: [],
      evenList: [],
    });

    this.setState(
      {
        curTagId: current,
      },
      () => {
        this.nextPage();
      }
    );
  };

  handleFilterChange = (data) => {
    this.setState({
      showDrawer: false,
    });
    const { current, sort } = data;

    const query = {
      ...this.state.query,
      goodsSort: current === 0 ? null : current === 1 ? 1 : sort > 0 ? 3 : 2,
    };

    /** 当不需要排序且点击一致时 */
    if (current === this.state.curFilterIdx && !sort) {
      return;
    }

    if (
      current !== this.state.curFilterIdx ||
      (current === this.state.curFilterIdx &&
        query.goodsSort !== this.state.query.goodsSort)
    ) {
      this.resetPage();
      this.setState({
        list: [],
        oddList: [],
        evenList: [],
      });
    }

    this.setState(
      {
        curFilterIdx: current,
        query,
      },
      () => {
        this.nextPage();
      }
    );
  };

  handleListTypeChange = () => {
    const listType = this.state.listType === "grid" ? "default" : "grid";

    this.setState({
      listType,
    });
  };

  handleClickItem = (item) => {
    const url = `/pages/item/espier-detail?id=${item.item_id}&dtid=${item.distributor_id}`;
    Taro.navigateTo({
      url,
    });
  };

  handleClickStore = (item) => {
    const url = `/pages/store/index?id=${item.distributor_info.distributor_id}`;
    Taro.navigateTo({
      url,
    });
  };

  handleClickFilter = () => {
    this.setState({
      showDrawer: true,
    });
  };

  handleClickParmas = (id, child_id) => {
    const { paramsList, selectParams } = this.state;
    paramsList.map((item) => {
      if (item.attribute_id === id) {
        item.attribute_values.map((v_item) => {
          if (v_item.attribute_value_id === child_id) {
            v_item.isChooseParams = true;
          } else {
            v_item.isChooseParams = false;
          }
        });
      }
    });
    selectParams.map((item) => {
      if (item.attribute_id === id) {
        item.attribute_value_id = child_id;
      }
    });
    this.setState({
      paramsList,
      selectParams,
    });
  };

  handleClickSearchParams = (type) => {
    this.setState({
      showDrawer: false,
    });
    if (type === "reset") {
      const { paramsList, selectParams } = this.state;
      this.state.paramsList.map((item) => {
        item.attribute_values.map((v_item) => {
          if (v_item.attribute_value_id === "all") {
            v_item.isChooseParams = true;
          } else {
            v_item.isChooseParams = false;
          }
        });
      });
      selectParams.map((item) => {
        item.attribute_value_id = "all";
      });
      this.setState({
        paramsList,
        selectParams,
      });
    }

    this.resetPage();
    this.setState(
      {
        list: [],
        oddList: [],
        evenList: [],
      },
      () => {
        this.nextPage();
      }
    );
  };

  handleViewChange = () => {
    const { listType } = this.state;
    if (listType === "grid") {
      this.setState({
        listType: "list",
      });
    } else {
      this.setState({
        listType: "grid",
      });
    }
  };

  handleSearchOn = () => {
    this.setState({
      isShowSearch: true,
    });
  };

  handleSearchOff = () => {
    this.setState({
      isShowSearch: false,
    });
  };

  handleSearchChange = (val) => {
    this.setState({
      query: {
        ...this.state.query,
        keywords: val,
      },
    });
  };

  handleSearchClear = () => {
    this.setState(
      {
        isShowSearch: false,
        query: {
          ...this.state.query,
          keywords: "",
        },
      },
      () => {
        this.resetPage();
        this.setState(
          {
            list: [],
            oddList: [],
            evenList: [],
          },
          () => {
            this.nextPage();
          }
        );
      }
    );
  };

  handleConfirm = (val) => {
    this.setState(
      {
        isShowSearch: false,
        query: {
          ...this.state.query,
          keywords: val,
        },
      },
      () => {
        this.resetPage();
        this.setState(
          {
            list: [],
            oddList: [],
            evenList: [],
          },
          () => {
            this.nextPage();
          }
        );
      }
    );
  };

  handleClick = (current) => {
    const cur = this.state.localCurrent;
    if (cur !== current) {
      const curTab = this.state.tabList[current];
      const { url } = curTab;
      const options = this.$instance.router.params;
      const id = options.dis_id;
      const param = current === 1 ? `?dis_id=${id}` : `?id=${id}`;
      const fullPath = getCurrentRoute(this.$instance.router).fullPath.split(
        "?"
      )[0];
      if (url && fullPath !== url) {
        Taro.redirectTo({ url: `${url}${param}` });
      }
    }
  };

  render() {
    const {
      localCurrent,
      tabList,
      list,
      oddList,
      evenList,
      listType,
      curFilterIdx,
      filterList,
      showBackToTop,
      scrollTop,
      page,
      showDrawer,
      paramsList,
      selectParams,
      tagsList,
      curTagId,
      info,
      isShowSearch,
      query,
    } = this.state;
    console.log('tagsList==',tagsList)
    console.log('getBrowserEnv().weixin==',getBrowserEnv().weixin)
    return (
      <View className="page-goods-list">
        <SpNavBar title="商品列表" leftIconType="chevron-left" fixed="true" />
        <View
          className={classNames(
            'goods-list__toolbar',
            getBrowserEnv().weixin ? 'goods-list__toolbar__wx' : null
          )}
        >
          <View
            className={`goods-list__search ${
              query && query.keywords && !isShowSearch ? "on-search" : null
            }`}
          >
            <SearchBar
              keyword={query ? query.keywords : ""}
              onFocus={this.handleSearchOn}
              onChange={this.handleSearchChange}
              onClear={this.handleSearchClear}
              onCancel={this.handleSearchOff}
              onConfirm={this.handleConfirm.bind(this)}
            />
            {!isShowSearch && (
              <View
                className={classNames(
                  "goods-list__type iconfont",
                  listType === "grid" ? "icon-list" : "icon-grid"
                )}
                onClick={this.handleViewChange}
              ></View>
            )}
          </View>
          {tagsList.length > 0 && (
            <TagsBar
              current={curTagId}
              list={tagsList}
              onChange={this.handleTagChange.bind(this)}
            />
          )}
          <FilterBar
            className="goods-list__tabs"
            custom
            current={curFilterIdx}
            list={filterList}
            onChange={this.handleFilterChange}
          >
            {/*
              <View className='filter-bar__item' onClick={this.handleClickFilter.bind(this)}>
                <View className='icon-filter'></View>
                <Text>筛选</Text>
              </View>
            */}
          </FilterBar>
        </View>

        <AtDrawer
          show={showDrawer}
          right
          mask
          width={`${Taro.pxTransform(570)}`}
        >
          {paramsList.map((item, index) => {
            return (
              <View className="drawer-item" key={`${index}1`}>
                <View className="drawer-item__title">
                  <Text>{item.attribute_name}</Text>
                  <View className="at-icon at-icon-chevron-down"> </View>
                </View>
                <View className="drawer-item__options">
                  {item.attribute_values.map((v_item, v_index) => {
                    return (
                      <View
                        className={classNames(
                          "drawer-item__options__item",
                          v_item.isChooseParams
                            ? "drawer-item__options__checked"
                            : ""
                        )}
                        // className='drawer-item__options__item'
                        key={`${v_index}1`}
                        onClick={this.handleClickParmas.bind(
                          this,
                          item.attribute_id,
                          v_item.attribute_value_id
                        )}
                      >
                        {v_item.attribute_value_name}
                      </View>
                    );
                  })}
                  <View className="drawer-item__options__none"> </View>
                  <View className="drawer-item__options__none"> </View>
                  <View className="drawer-item__options__none"> </View>
                </View>
              </View>
            );
          })}
          <View className="drawer-footer">
            <Text
              className="drawer-footer__btn"
              onClick={this.handleClickSearchParams.bind(this, "reset")}
            >
              重置
            </Text>
            <Text
              className="drawer-footer__btn drawer-footer__btn_active"
              onClick={this.handleClickSearchParams.bind(this, "submit")}
            >
              确定
            </Text>
          </View>
        </AtDrawer>

        <ScrollView
          className={classNames(
            "goods-list__scroll",
            (tagsList.length > 0 && !getBrowserEnv().weixin) && "with-tag-bar",
            (tagsList.length > 0 && getBrowserEnv().weixin) && "with-tag-bar-wx"
          )}
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
        >
          {listType === "grid" && (
            <View className="goods-list goods-list__type-grid">
              <View className="goods-list__group">
                {oddList.map((item) => {
                  return (
                    <View className="goods-list__item" key={item.item_id}>
                      <GoodsItem
                        key={item.item_id}
                        info={item}
                        onClick={() => this.handleClickItem(item)}
                        onStoreClick={() => this.handleClickStore(item)}
                      />
                    </View>
                  );
                })}
              </View>
              <View className="goods-list__group">
                {evenList.map((item) => {
                  return (
                    <View className="goods-list__item" key={item.item_id}>
                      <GoodsItem
                        key={item.item_id}
                        info={item}
                        onClick={() => this.handleClickItem(item)}
                        onStoreClick={() => this.handleClickStore(item)}
                      />
                    </View>
                  );
                })}
              </View>
            </View>
          )}
          {listType === "list" && (
            <View className="goods-list goods-list__type-list">
              {list.map((item) => {
                return (
                  <View className="goods-list__item">
                    <GoodsItem
                      key={item.item_id}
                      info={item}
                      onClick={() => this.handleClickItem(item)}
                      onStoreClick={() => this.handleClickStore(item)}
                    />
                  </View>
                );
              })}
            </View>
          )}
          {page.isLoading ? <Loading>正在加载...</Loading> : null}
          {!page.isLoading && !page.hasNext && !list.length > 0 && (
            <SpNote img="trades_empty.png">暂无数据~</SpNote>
          )}
        </ScrollView>

        <BackToTop
          show={showBackToTop}
          onClick={this.scrollBackToTop}
          bottom={130}
        />
        <AtTabBar
          fixed
          tabList={tabList}
          onClick={this.handleClick}
          current={localCurrent}
        />
      </View>
    );
  }
}
