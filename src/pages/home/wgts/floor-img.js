import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import { classNames } from "@/utils";
import { linkPage } from "./helper";
import "./floor-img.scss";

export default class WgtFloorImg extends Component {
  static options = {
    addGlobalClass: true
  };

  static defaultProps = {
    info: {}
  };

  constructor(props) {
    super(props);
  }
  onRoute = linkPage;

  render() {
    const { info } = this.props;
    if (!info) {
      return null;
    }
    const { base, data } = info;

    return (
      <View className={`wgt ${base.padded ? "wgt__padded" : null}`}>
        {base.title && (
          <View className="wgt__header">
            <View className="wgt__title">
              <Text>{base.title}</Text>
              <View className="wgt__subtitle">{base.subtitle}</View>
            </View>
            {/* <View
											className='wgt__more'
											onClick={this.handleClickMore}
										>
											<View className='three-dot'></View>
										</View> */}
          </View>
        )}
        <View
          className={classNames("exclusive_list_two", "exclusive_list")}
          style={
            base && base.openBackImg
              ? `background: url(${base && base.backgroundImg});`
              : null
          }
        >
          <ScrollView scrollX className="img_list">
            {data &&
              data.map((item, idx) => {
                return (
                  <View
                    className="lis"
                    key={item.id}
                    onClick={this.onRoute.bind(this, item.linkPage, item)}
                  >
                    <Image lazyLoad className="img" src={item.imgUrl}></Image>
                    <View
                      className="title"
                      style={"color:" + base && base.WordColor}
                    >
                      {item.ImgTitle}
                    </View>
                  </View>
                );
              })}
          </ScrollView>
        </View>
      </View>
    );
  }
}
