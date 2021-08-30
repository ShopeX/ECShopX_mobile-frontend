import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import { classNames, styleNames } from "@/utils";
import "./coupon.scss";

// TODO: 用户信息验证
export default class WgtCoupon extends Component {
  static options = {
    addGlobalClass: true
  };

  static defaultProps = {
    info: null
  };

  constructor(props) {
    super(props);
    this.state = {
      scrollLeft: 0,
      moveLeft: -1,
      currentIndex: 0,
      imgwidth: 0
    };
  }
  componentDidMount() {
    let query = Taro.createSelectorQuery().in(this.$scope);
    let _this = this;
    query
      .selectAll(".coupon-scroller__item-img")
      .boundingClientRect(rec => {
        _this.setState({
          imgwidth: rec[0] ? rec[0].width : 0
        });
      })
      .exec();
  }

  navigateTo(url) {
    Taro.navigateTo({ url });
  }
  handleScroll = e => {
    // console.log('e-----1',e)
    const { imgwidth } = this.state;
    const scrollLeft = e.detail.scrollLeft;
    this.setState({
      scrollLeft: scrollLeft,
      currentIndex: Math.floor(scrollLeft / imgwidth)
      // moveLeft:e.detail.scrollLeft
    });
  };
  handleprescroll = () => {
    let { scrollLeft, moveLeft, currentIndex, imgwidth } = this.state;

    if (currentIndex == 0) {
      this.setState({
        moveLeft: moveLeft === 0 ? -1 : 0,
        currentIndex: 0
      });
    } else {
      currentIndex = currentIndex - 1;
      this.setState({
        currentIndex,
        moveLeft: scrollLeft - imgwidth
      });
    }
  };
  handlenextscroll = () => {
    let { scrollLeft, moveLeft, currentIndex, imgwidth } = this.state;
    let {
      info: { data }
    } = this.props;

    if (currentIndex >= data.length - 4) return;
    currentIndex += 1;

    this.setState({
      currentIndex,
      moveLeft: moveLeft + imgwidth,
      scrollLeft: moveLeft + imgwidth
    });
  };

  render() {
    const { info } = this.props;
    if (!info) {
      return null;
    }

    let { base, data, config } = info;
    const { moveLeft } = this.state;

    return (
      <View className={`wgt ${base.padded ? "wgt__padded" : null}`}>
        {base.title && (
          <View className="wgt__header">
            <View className="wgt__title">
              <Text>{base.title}</Text>
              <View className="wgt__subtitle">{base.subtitle}</View>
            </View>
            <View className="wgt__more">
              <View className="three-dot"></View>
            </View>
          </View>
        )}
        <View>
          <View className="coupon-title">
            <Text>先领券</Text>
            <Image
              className="coupon-title__img"
              mode="widthFix"
              src="/assets/imgs/like-coupon.png"
            ></Image>
            <Text>更优惠</Text>
          </View>
          <View
            className={classNames(
              "coupon-title__smtitle",
              data.length < 4 ? "coupon-title__smtitle-smagrin" : ""
            )}
          >
            COUPONS
          </View>
        </View>

        <View
          style={styleNames(
            config && config.background
              ? { background: config.background }
              : null
          )}
        >
          {config && config.style === "row" && data && data.length > 3 ? (
            <View className="coupon-scroller__padding">
              {data && data.length > 3 && (
                <View className="coupon-scroller__leftmask">
                  <View
                    className="at-icon at-icon-chevron-left left-icon"
                    onClick={this.handleprescroll}
                  ></View>
                </View>
              )}

              <ScrollView
                className="coupon-scroller"
                scrollWithAnimation
                scrollX
                scrollLeft={moveLeft}
                onScroll={this.handleScroll}
              >
                <View
                  className={classNames(
                    "coupon-scroller__item",
                    data && data.length > 3
                      ? "coupon-scroller__item-padding1"
                      : "coupon-scroller__item-padding2"
                  )}
                >
                  {data.map((item, idx) => {
                    return (
                      <Image
                        key={item.item_id}
                        className="coupon-scroller__item-img"
                        mode="aspectFit"
                        src={item.imgUrl}
                        onClick={this.navigateTo.bind(
                          this,
                          `/guide/coupon-home/index?card_id=${item.id}`,
                          item,
                          idx
                        )}
                      ></Image>
                    );
                  })}
                </View>
              </ScrollView>
              {data && data.length > 3 && (
                <View className="coupon-scroller__rightmask">
                  <View
                    className="at-icon at-icon-chevron-right left-icon"
                    onClick={this.handlenextscroll}
                  ></View>
                </View>
              )}
            </View>
          ) : (
            <View
              className={`wgt__body with-padding conpon-container ${config &&
                config.style}`}
              style={styleNames(
                config && config.background
                  ? { background: config.background }
                  : null
              )}
            >
              {data.map((item, idx) => {
                return (
                  <View
                    className={classNames("coupon-wgt")}
                    key="id"
                    onClick={this.navigateTo.bind(
                      this,
                      `/guide/coupon-home/index?card_id=${item.id}`,
                      item,
                      idx
                    )}
                  >
                    <Image
                      className="coupon-wgt__image"
                      mode="aspectFit"
                      src={item.imgUrl}
                    ></Image>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </View>
    );
  }
}
