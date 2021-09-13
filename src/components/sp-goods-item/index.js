import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { SpImg, PointLine } from "@/components";
import api from "@/api";
import { connect } from "@tarojs/redux";

import { isObject, classNames } from "@/utils";

import "./index.scss";

export default class SpGoodsItem extends Component {
  static defaultProps = {
    onClick: () => {},
    onStoreClick: () => {},
    showMarketPrice: true,
    showFav: true,
    showSku: false,
    noCurSymbol: false,
    type: "item",
    isPointitem: false
  };

  static options = {
    addGlobalClass: true
  };

  handleFavClick = async () => {
    const { item_id, is_fav } = this.props.info;
    if (!is_fav) {
      const favRes = await api.member.addFav(item_id);
      this.props.onAddFav(favRes);
    } else {
      await api.member.delFav(item_id);
      this.props.onDelFav(this.props.info);
    }
    Taro.showToast({
      title: is_fav ? "已移出收藏" : "已加入收藏",
      mask: true
    });
  };

  render() {
    const {
      info,
      showMarketPrice,
      showFav,
      noCurSymbol,
      noCurDecimal,
      onClick,
      onStoreClick,
      appendText,
      className,
      isPointDraw,
      colors,
      type,
      isPointitem
    } = this.props;
    // console.log('this.props',this.props)

    if (!info) {
      return null;
    }
      
    const img = info.pics.length > 0 ? info.pics[0] : '';

    let promotion_activity = null,
      act_price = null;
    // console.log("act_price",act_price)
    // console.log("info.promotion_activity_tag",info.promotion_activity_tag)
    if (info.promotion_activity_tag && info.promotion_activity_tag.length > 1) {
      info.promotion_activity_tag.map(tag_item => {
        if (
          tag_item.tag_type === "single_group" ||
          tag_item.tag_type === "normal" ||
          tag_item.tag_type === "limited_time_sale"
        ) {
          promotion_activity = tag_item.tag_type;
          act_price = tag_item.activity_price;
          return;
        }
      });
    } else if (
      info.promotion_activity_tag &&
      info.promotion_activity_tag.length === 1
    ) {
      promotion_activity = info.promotion_activity_tag[0].tag_type;
      act_price = info.promotion_activity_tag[0].activity_price;
    } else {
      promotion_activity = null;
      act_price = null;
    }

    act_price = (act_price / 100).toFixed(2);
    let price = "",
      marketPrice = "";
    if (isObject(info.price)) {
      price = info.price.total_price;
    } else {
      price = Boolean(+act_price)
        ? act_price
        : Boolean(+info.member_price)
        ? info.member_price
        : info.price;
      //marketPrice = Boolean(+act_price) || Boolean(+info.member_price) ? info.price : info.market_price
      marketPrice = info.market_price;
    }

    const isShow = info.store && info.store == 0;

    return (
      <View className={classNames("sp-goods-item")}>
        <View className="goods-item__hd">
          <SpImg
            img-class="order-item__img"
            src={img}
            mode="aspectFill"
            width="300"
            lazyLoad
          />
        </View>
        <View className="goods-item__bd">
          
        </View>
        <View className="goods-item__ft">{this.props.renderFooter}</View>
      </View>
    );
  }
}
