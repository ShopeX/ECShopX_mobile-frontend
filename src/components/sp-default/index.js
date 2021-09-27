import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { classNames } from "@/utils";

import "./index.scss";

export default class SpDefault extends Component {
  static options = {
    addGlobalClass: true
  };

  defaultProps = {
    icon: false,
    message: ''
  }

  render() {
    const { icon, message, children, className, isUrl } = this.props;

    return (
      <View className={classNames("sp-default", className)}>
        {icon && (
          <Image
            className="sp-default-img"
            mode="widthFix"
            src={`/assets/imgs/cart_empty.png`}
          />
        )}
        <View className="sp-default-text">{message}</View>
        <View className="sp-default-btns">{children}</View>
      </View>
    );
  }
}
