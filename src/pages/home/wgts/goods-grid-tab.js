import React, { useState } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, ScrollView, Text } from "@tarojs/components";
import { SpGoodsItem, SpImage } from "@/components";
import { getDistributorId } from "@/utils/helper";
import { classNames, pickBy, linkPage } from "@/utils";
import doc from '@/doc'
import "./goods-grid-tab.scss";

function WgtGoodsGridTab(props) {
  const { info } = props;
  if (!info) {
    return null;
  }

  const [current, setCurrent] = useState(0)

  const { base, config, list } = info;



  return (
    <View
      className={classNames("wgt", "wgt-goods-grid-tab", {
        wgt__padded: base.padded,
      })}
    >
      {/* {base.title && (
        <View className="wgt-head">
          <Text className="wgt-title">{base.title}</Text>
          <Text className="wgt-subtitle">{base.subtitle}</Text>
        </View>
      )} */}
      {base.title && (
        <View className="wgt-head">
          <View className="wgt-hd">
            <Text className="wgt-title">{base.title}</Text>
            <Text className="wgt-subtitle">{base.subtitle}</Text>
          </View>
        </View>
      )}
      <View className="wgt-body">
        <ScrollView className="scroll-tab" scrollX>
          {list.map((item, index) => (
            <View
              className={classNames("tab-item", {
                active: current == index,
              })}
              key={`tab-item__${index}`}
              onClick={() => {
                setCurrent(index);
              }}
            >
              {item.tabTitle}
            </View>
          ))}
        </ScrollView>
        <View className="tabs-container">
          {list.map(
            (item, index) =>
              current == index && (
                <View className="tab-body" key={`tab-body__${index}`}>
                  {item.goodsList.map((good, index) => {
                    const data = pickBy(good, doc.goods.WGT_GOODS_GRID_TAB);
                    return (
                      <View
                        className="goodgrid-item"
                        key={`goods-item__${index}`}
                      >
                        <SpGoodsItem info={data} />
                        {config.brand && (
                          <View className="brand-info">
                            <SpImage src={data.brand} />
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              )
          )}
        </View>
        {config.moreLink.id && (
          <View
            className="btn-more"
            onClick={() =>
              linkPage(config.moreLink)
            }
          >
            查看更多
          </View>
        )}
      </View>
    </View>
  );
}

WgtGoodsGridTab.options = {
  addGlobalClass: true,
};

export default WgtGoodsGridTab;
