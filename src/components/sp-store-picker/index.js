import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { navigateTo } from '@/utils'
import "./index.scss";

export default class SpStorePicker extends Component {
  static options = {
    addGlobalClass: true
  };

  navigateTo = navigateTo

  render() {
    return (
      <View
        className={"sp-store-picker"}
        onClick={this.navigateTo.bind(this, "/pages/store/list")}
      >
        <Text className="iconfont icon-dizhi-01"></Text>
        <Text className="shop-name">{"选择店铺"}</Text>
      </View>
    );
  }
}
