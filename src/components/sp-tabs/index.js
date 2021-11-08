import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { classNames, navigateTo } from "@/utils";
import "./index.scss";

function SpTabs(props) {
  let { tablist = [], current, onChange } = this.props;

  console.log( "current", current );

  return (
    <View className={"sp-tabs"}>
      <View className="sp-tabs-hd">
        {tablist.map((tab, index) => (
          <View
            className={classNames({
              "tab-item": true,
              "tab-item-active": current == index
            })}
            key={`tab-item__${index}`}
            onClick={onChange.bind(this, index)}
          >
            {tab.icon && (
              <Text className={classNames(`iconfont`, tab.icon)}></Text>
            )}
            <Text>{tab.title}</Text>
          </View>
        ))}
      </View>
      <View className="sp-tabs-bd">{this.props.children}</View>
    </View>
  );
}

export default SpTabs;
