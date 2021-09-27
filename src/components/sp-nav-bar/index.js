import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtNavBar } from "taro-ui";
import { classNames, getBrowserEnv } from "@/utils";

import "./index.scss";

export default class SpNavBar extends Component {
  static defaultProps = {
    leftIconType: "chevron-left",
    fixed: false,
    title: ""
  };

  static options = {
    addGlobalClass: true
  };

  handleClickLeftIcon = () => {
    if (this.props.onClickLeftIcon) return this.props.onClickLeftIcon();
    return Taro.navigateBack();
  };

  render() {
    const { title, leftIconType, fixed } = this.props;
    console.log(getBrowserEnv());
    return (
      process.env.TARO_ENV == "h5" &&
      !getBrowserEnv().weixin && (
        <View
          className={classNames(`sp-nav-bar nav-bar-height`, {
            fixed
          })}
        >
          <AtNavBar
            fixed={fixed}
            color="#000"
            title={title}
            leftIconType={leftIconType}
            onClickLeftIcon={this.handleClickLeftIcon.bind(this)}
          />
        </View>
      )
    );
  }
}
