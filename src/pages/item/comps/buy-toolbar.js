import React, { Component } from 'react';
 import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View } from '@tarojs/components'
import { connect } from 'react-redux'
import { AtBadge } from 'taro-ui'
import api from '@/api'
import configStore from "@/store";
import { fetchUserFavs, addUserFav, deleteUserFav } from "@/store/slices/user";
import { FormIdCollector, SpLogin } from '@/components'
import { classNames, isWeb, showToast } from "@/utils";
import './buy-toolbar.scss'

const store = configStore();
@connect(
  ({ colors, user }) => ({
    colors: colors.current,
    favs: user.favs
  })
)
export default class GoodsBuyToolbar extends Component {
  static options = {
    addGlobalClass: true
  };

  static defaultProps = {
    type: "normal",
    onClickAddCart: () => {},
    onClickFastBuy: () => {},
    onFavItem: () => {},
    cartCount: "",
    info: {},
    isPointitem: false
  };

  handleClickCart = (id, type) => {
    if (isWeb) {
      Taro.redirectTo({
        url: `/pages/cart/espier-index?type=${type}`
      });
    } else {
      Taro.reLaunch({
        url: `/pages/cart/espier-index?type=${type}`
      });
    }
  };

  handleNaviationToHome = () => {
    const url = `/pages/index`;
    Taro.navigateTo({
      url
    });
  };

  handleFavClick = async () => {
    const { item_id } = this.props.info;
    const isFaved =
      this.props.favs.findIndex( item => item.item_id == item_id ) > -1;
    if (!isFaved) {
      await store.dispatch(addUserFav(item_id));
    } else {
      await store.dispatch(deleteUserFav(item_id));
    }
    await store.dispatch(fetchUserFavs());
    showToast(isFaved ? "已移出收藏" : "已加入收藏");
  };

  render() {
    const {
      onClickAddCart,
      onClickFastBuy,
      cartCount,
      type,
      info,
      colors,
      isPointitem,
      favs = []
    } = this.props;
    if (!info) {
      return null;
    }

    let special_type = info.special_type;

    const isDrug = special_type === "drug";
    const fastBuyText = isPointitem
      ? "立即兑换"
      : type === "normal" || type === "limited_time_sale"
      ? "立即购买"
      : type === "seckill"
      ? "立即抢购"
      : "我要开团";
    const isFaved = favs.findIndex(item => item.item_id == info.itemId) > -1;
    return (
      <View
        className={classNames(
          isPointitem ? "goods-isPointitem" : null,
          "goods-buy-toolbar"
        )}
      >
        <View className="goods-buy-toolbar__menus">
          <SpLogin>
            <View
              className="goods-buy-toolbar__menu-item"
              onClick={this.handleFavClick}
            >
              <View
                className={classNames(
                  "iconfont",
                  isFaved ? "icon-shoucanghover-01" : "icon-shoucang-01"
                )}
              />
            </View>
          </SpLogin>
          {!isPointitem ? (
            <View
              className="goods-buy-toolbar__menu-item"
              onClick={this.handleClickCart.bind(
                this,
                info.item_id,
                isDrug ? "drug" : "distributor"
              )}
            >
              <AtBadge value={cartCount || null}>
                <View className="iconfont icon-cart"></View>
              </AtBadge>
            </View>
          ) : (
            <View
              className="goods-buy-toolbar__menu-item"
              onClick={this.handleNaviationToHome}
            >
              <View className="iconfont icon-home"></View>
            </View>
          )}
        </View>
        {this.props.customRender ? (
          this.props.children
        ) : (
          <SpLogin>
            {info.approve_status === "onsale" ? (
              <View className="goods-buy-toolbar__btns">
                {(type === "normal" || type === "limited_time_sale") &&
                  !isPointitem && (
                    <View sync onClick={onClickAddCart}>
                      <View
                        className={`goods-buy-toolbar__btn btn-add-cart ${isDrug &&
                          "drug-btn"}`}
                        style={"background: " + colors.data[0].accent}
                      >
                        {isDrug ? "加入药品清单" : "添加至购物车"}
                      </View>
                    </View>
                  )}
                {!isDrug && (
                  <View sync onClick={onClickFastBuy}>
                    <View
                      className={`goods-buy-toolbar__btn btn-fast-buy ${type !==
                        "normal" &&
                        type !== "limited_time_sale" &&
                        "marketing-btn"}`}
                      style={"background: " + colors.data[0].primary}
                    >
                      {fastBuyText}
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <View className="goods-buy-toolbar__btns">
                <View className="goods-buy-toolbar__btn disabled">
                  暂不可售
                </View>
              </View>
            )}
          </SpLogin>
        )}
      </View>
    );
  }
}
