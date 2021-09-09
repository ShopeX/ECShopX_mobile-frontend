import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./index.scss";

export default class SpRecommend extends Component {
  static options = {
    addGlobalClass: true
  };

  static defaultProps = {
    info: null
  }

  render() {
    return (
      <View className={"sp-recommend"}>
        <View className="sp-recommend-hd">猜你喜欢</View>
        <View className="sp-recommend-bd">{info}</View>
      </View>
    );
  }
}
