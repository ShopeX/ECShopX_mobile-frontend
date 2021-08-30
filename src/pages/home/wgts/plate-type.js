import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { classNames } from "@/utils";
import "./plate-type.scss";

export default class WgtPlateType extends Component {
  static options = {};

  static defaultProps = {
    info: {},
    index: "",
    num: "",
    base: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      nowIndex: ""
    };
  }

  render() {
    const { info, index, num, base } = this.props;
    let style = `color:${base.WordColor};border-color:${base.WordColor}`;

    return (
      <View className="index">
        {/* 模板一 */}
        {info.template === "one" && (
          <View className={classNames("template1", "noe")}>
            <View
              className={classNames("li_a", index === num ? "li_aa" : "")}
              style={style}
            >
              {info.mainTitle}
            </View>
            <View
              className={classNames("li_b", index === num ? "li_bb" : "")}
              style={style}
            >
              {info.subtitle}
            </View>
            <View
              className={classNames("li_c", index === num ? "li_cc" : "")}
              style={style}
            >
              {info.subtitleTow}
            </View>
            {info.button && (
              <View
                className={classNames("li_d", index === num ? "li_dd" : "")}
                style={style}
              >
                {info.button}
              </View>
            )}
          </View>
        )}
        {/* 模板二 */}
        {info.template === "two" && (
          <View className={classNames("template1", "two")}>
            <View
              className={classNames("li_b", index === num ? "li_aa" : "")}
              style={style}
            >
              {info.mainTitle}
            </View>
            <View
              className={classNames("li_a", index === num ? "li_bb" : "")}
              style={style}
            >
              {info.subtitle}
            </View>
            <View
              className={classNames("li_c", index === num ? "li_cc" : "")}
              style={style}
            >
              {info.subtitleTow}
            </View>
            {info.button && (
              <View
                className={classNames("li_d", index === num ? "li_dd" : "")}
                style={style}
              >
                {info.button}
              </View>
            )}
          </View>
        )}

        {/* 模板三*/}
        {info.template === "three" && (
          <View className={classNames("template1", "three")}>
            <View
              className={classNames("li_b", index === num ? "li_aa" : "")}
              style={style}
            >
              {info.mainTitle}
            </View>
            <View
              className={classNames("li_a", index === num ? "li_bb" : "")}
              style={style}
            >
              {info.subtitle}
            </View>
            <View
              className={classNames("li_c", index === num ? "li_cc" : "")}
              style={style}
            >
              {info.subtitleTow}
            </View>
            {info.button && (
              <View
                className={classNames("li_d", index === num ? "li_dd" : "")}
                style={style}
              >
                {info.button}
              </View>
            )}
          </View>
        )}

        {/* 模板四*/}
        {info.template === "four" && (
          <View className={classNames("template1", "four")}>
            <View
              className={classNames("li_b", index === num ? "li_aa" : "")}
              style={style}
            >
              {info.mainTitle}
            </View>
            <View
              className={classNames("li_a", index === num ? "li_bb" : "")}
              style={style}
            >
              {info.subtitle}
            </View>
            {info.button && (
              <View
                className={classNames("li_d", index === num ? "li_cc" : "")}
                style={style}
              >
                {info.button}
              </View>
            )}
          </View>
        )}
      </View>
    );
  }
}
