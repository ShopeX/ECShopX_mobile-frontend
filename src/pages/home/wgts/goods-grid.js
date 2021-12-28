import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { SpGoodsItem } from "@/components";
import { pickBy, classNames, log } from "@/utils";
import { Tracker } from "@/service";
import { getDistributorId } from "@/utils/helper";
import { CreateIntersectionObserver } from "@/utils/platform";
import { withLoadMore } from "@/hocs";
import doc from "@/doc";
import "./goods-grid.scss";

function WgtGoodsGrid(props) {
  const { info } = props;
  if (!info) {
    return null;
  }
  const { base, data } = info;
  const goods = pickBy(data, doc.goods.WGT_GOODS_GRID);
  return (
    <View
      className={classNames("wgt", "wgt-goods-grid", {
        wgt__padded: base.padded,
      })}
    >
      {base.title && (
        <View className="wgt-head">
          <View className="wgt-hd">
            <Text className="wgt-title">{base.title}</Text>
            <Text className="wgt-subtitle">{base.subtitle}</Text>
          </View>
        </View>
      )}
      <View className="wgt-body">
        <View className="wgt-goods-grid-list">
          {goods.map((item, idx) => (
            <View className="goods-item-wrap" key={`goods-item-wrap__${idx}`}>
              <SpGoodsItem info={item} />
            </View>
          ))}
        </View>
        <View className="wgt-grid__loader-more"></View>
      </View>
    </View>
  );
}

WgtGoodsGrid.options = {
  addGlobalClass: true,
};

export default WgtGoodsGrid;
