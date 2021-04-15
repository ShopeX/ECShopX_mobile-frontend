import Taro, { Component } from "@tarojs/taro";
import { View, Text, Button, Image, Canvas } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtButton } from "taro-ui";
import { Price, SpCell, SpToast } from "@/components";
import { Batoolbar, BaOrderItem } from "../components";

import api from "@/api";
import S from "@/spx";
import req from "@/api/req";
import { withLogin } from "@/hocs";
import { pickBy, log, classNames, styleNames, returnFloat } from "@/utils";
import guideCanvasExp from "./guideCanvasExp.js";
import _cloneDeep from "lodash/cloneDeep";
import debounce from "lodash/debounce";
// import logoimg from '@/assets/imgs/logo.png'

import "./espier-checkout.scss";
import { category } from "@/api/item";

const transformCartList = (list, params = {}) => {
  return pickBy(list, {
    item_id: "item_id",
    item_bn: "item_bn",
    cart_id: "cart_id",
    title: "item_name",
    curSymbol: "fee_symbol",
    discount_info: "discount_info",
    order_item_type: "order_item_type",
    item_spec_desc: "item_spec_desc",
    pics: ({ pics, pic }) => pics || pic,
    price: ({ price }) => (+price / 100).toFixed(2),
    total_fee: ({ total_fee }) => (+total_fee / 100).toFixed(2),
    item_fee: ({ item_fee }) => (+item_fee / 100).toFixed(2),
    num: "num",
    support_coupon: "support_coupon",
    coupon_valid: "coupon_valid",
    is_cart: "is_cart"
  })
    .sort(a => (a.order_item_type !== "gift" ? -1 : 1))
    .map(t => ({
      ...t,
      ...params
    }));
};

export default class EspireCheckout extends Component {
  // config = {
  //   navigationBarTitleText: "innisfree 导购商城"
  // };
  constructor(props) {
    super(props);
    const { windowWidth } = Taro.$systemSize;
    const ratio = windowWidth / 375;
    this.state = {
      cart_type: "",
      total: {
        items_count: "",
        total_fee: "0.00",
        item_fee: "",
        freight_fee: "",
        member_discount: "",
        coupon_discount: "",
        point: ""
      },
      payType: "amorepay",
      errorMessage: null,
      orderInfo: null,
      cartlist: [],
      goodsllist: [],
      giftslist: [],
      notgoodslist: [],
      poster: "", // 生成的分享图片
      ratio,
      canvasWidth: 375 * ratio,
      canvasHeight: 600 * ratio,
      isShowQrcode: false, // 分享订单图片显示状态
      cxdid: null //获取二维码携带参数
    };
  }
  componentDidMount() {
    this.calcOrder();
  }
  // 计算接口
  async calcOrder() {
    Taro.showLoading({
      title: "加载中",
      mask: true
    });
    const params = this.getParams();
    params.receipt_type = "logistics";
    let data, cxdid;

    try {
      delete params.items;
      //原悦诗风吟计算金额逻辑
      // data = await api.cart.total(params);
      data = await api.guide.salesPromotion(params);
      data = data.valid_cart[0];
      cxdid = data.sales_promotion_id;

      console.log("获取导购分享订单计算金额", data);
    } catch (e) {
      if (e.status_code === 422) {
        return Taro.navigateBack();
      }

      this.resolvePayError(e);
      Taro.hideLoading();
    }

    if (!data) return;

    const {
      items,
      item_fee,
      gift_warning_item,
      totalItemNum,
      member_discount = 0,
      coupon_discount = 0,
      discount_fee,
      freight_discount,
      freight_fee = 0,
      freight_point = 0,
      point = 0,
      total_fee,
      remainpt,
      deduction,
      is_open_o2o,
      advance_fee,
      tail_fee,
      tail_pay_time,
      order_class,
      order_status,
      pay_status,
      green_discount_fee = 0,
      no_support_coupon_fee = 0,
      support_coupon_fee = 0,
      total_point
    } = data;
    const total = {
      ...this.state.total,
      item_fee,
      discount_fee: -1 * discount_fee,
      freight_discount: -1 * freight_discount,
      member_discount: -1 * member_discount,
      coupon_discount: -1 * coupon_discount,
      total_fee,
      items_count: totalItemNum,
      goodsItems: items,
      items_count: data.list.length
    };

    let cartlist = data.list;
    console.log("计算接口-cartlist", cartlist);
    let goodsllist = [];
    let giftslist = [];
    let notgoodslist = [];
    cartlist.forEach(item => {
      // (item.order_item_type === 'normal' && !item.disabled) || (!item.order_item_type && !item.disabled)||(item.order_item_type === 'gift'&&item.is_cart&&!item.disabled)
      //兑换券兑换的商品都视为赠品，如果赠品是普通商品，组合商品显示在商品区域（is_cart为true），如果是0元赠品显示在赠品区域（is_cart为false）
      if (item.special_type === "normal") {
        goodsllist.push(item);
      } else if (item.special_type === "gift") {
        giftslist.push(item);
      } else if (item.special_type === "normal" && item.disabled) {
        notgoodslist.push(item);
      }
    });
    total.goodsItems = cartlist;
    console.log("计算接口-goodsllist", goodsllist);
    this.setState({
      total,
      cartlist,
      goodsllist,
      giftslist,
      notgoodslist,
      cxdid
    });
    Taro.hideLoading();
  }
  getParams() {
    const { order_id } = this.$router.params;
    const { payType: pay_type } = this.state;
    const { freightCoupon } = this.props;

    const track = Taro.getStorageSync("trackParams");

    let source_id = 0,
      monitor_id = 0;
    if (track) {
      source_id = track.source_id;
      monitor_id = track.monitor_id;
    }
    const freight_discount = freightCoupon ? freightCoupon.value.code : null;

    const params = {
      ...this.params,
      order_type: "normal",
      promotion: "normal",
      member_discount: 0,
      coupon_discount: 0,
      freight_discount,
      pay_type,
      source_id,
      monitor_id,
      order_id
    };
    this.params = params;
    return _cloneDeep(params);
  }

  /**
   * 分享订单
   */
  handleShare = async () => {
    Taro.showLoading({
      title: "加载中..."
    });
    try {
      this.drawCanvas();
    } catch (err) {
      console.log(err);
    }
  };

  drawCanvas = async () => {
    try {
      const params = this.getParams();
      params.receipt_type = "logistics";
      delete params.items;
      const ba_params = Taro.getStorageSync("ba_params");
      const qw_chatId = S.get("qw_chatId", true);
      let entry_form = S.get("entry_form", true);
      let share_id = "888",
        wxshop_name = "wxshop_name",
        item_total = "2";
        // gift_total = "3";

      const {
        giftslist,
        total,
        ratio,
        canvasWidth,
        canvasHeight,
        cxdid
      } = this.state;
      //qrcode参数
      /**
       * 导购参数
       * page: pages/cart/espier-checkout
       * company_id: 1,
       * cxdid: 159,//营销活动
       * smid: 78,//导购id
       * distributor_id: 103,//门店id
       */
      let guideInfo = S.get("GUIDE_INFO", true);
      if (guideInfo && guideInfo.store_name) {
        wxshop_name = guideInfo.store_name;
      }
      const qrcode_params = `appid=${APP_ID}&share_id=${share_id}&page=pages/cart/espier-checkout&cxdid=${cxdid}&company_id=${guideInfo.company_id}&smid=${guideInfo.salesperson_id}&distributor_id=${guideInfo.distributor_id}`;
      const host = req.baseURL.replace("/api/h5app/wxapp/", "");
      // https://ecshopx.shopex123.com/index.php/wechatAuth/wxapp/qrcode.png?temp_name=yykweishop&page=pages/cart/espier-checkout&company_id=1&cxdid=159&smid=78&distributor_id=103
      const url = `${host}/wechatAuth/wxapp/qrcode.png?${qrcode_params}`;
      const { path: qrcode } = await Taro.getImageInfo({ src: url });
      let avatar = null;
      if (guideInfo.avatar) {
        let avatarImgInfo = await Taro.getImageInfo({
          src: guideInfo.avatar.replace("http:", "https:")
        });
        avatar = avatarImgInfo.path;
      }

      console.log("======qrcode===", qrcode);
      console.log("======avatar===", avatar);
      const ctx = Taro.createCanvasContext("myCanvas");
      ctx.setFillStyle("red");
      ctx.setFillStyle("red");
      ctx.fillRect(10, 10, 150, 100);
      ctx.draw();
      ctx.fillRect(50, 50, 150, 100);
      ctx.draw(true);
      // return

      guideCanvasExp.roundRect(ctx, 0, 0, canvasWidth, canvasHeight, 0);
      ctx.save();
      console.log("======ctx.save()===");
      // 头部信息
      if (avatar) {
        guideCanvasExp.imgCircleClip(
          ctx,
          avatar,
          15 * ratio,
          15 * ratio,
          45 * ratio,
          45 * ratio
        );
      }

      ctx.restore();
      guideCanvasExp.textFill(
        ctx,
        guideInfo.salesperson_name || "",
        75 * ratio,
        25 * ratio,
        14,
        "#184337"
      );
      if (wxshop_name) {
        guideCanvasExp.textOverflowFill(
          ctx,
          wxshop_name,
          75 * ratio,
          42 * ratio,
          160 * ratio,
          12,
          "#87C55C"
        );
        guideCanvasExp.textFill(
          ctx,
          "为您推荐",
          75 * ratio,
          65 * ratio,
          12,
          "#666"
        );
      } else {
        guideCanvasExp.textFill(
          ctx,
          "为您推荐",
          75 * ratio,
          45 * ratio,
          12,
          "#666"
        );
      }
      // guideCanvasExp.drawImageFill(
      //   ctx,
      //   "https://bbc-espier-images.amorepacific.com.cn/image/2/2021/02/28/c82701f15f42ee1743d3a779d6a38327Z4zMvCPbp2FhYwf4zzfLBmmaHSVOUqcD",
      //   224 * ratio,
      //   32 * ratio,
      //   98 * ratio,
      //   18 * ratio
      // );

      // 总计
      guideCanvasExp.textFill(
        ctx,
        `共${total.items_count}件商品`,
        15 * ratio,
        425 * ratio,
        12,
        "#101010"
      );
      guideCanvasExp.textFill(ctx, "合计", 15 * ratio, 450 * ratio, 12, "#999");
      guideCanvasExp.textFill(
        ctx,
        `¥${returnFloat(total.item_fee / 100)}`,
        64 * ratio,
        450 * ratio,
        12,
        "#101010"
      );
      guideCanvasExp.textFill(
        ctx,
        "为您省",
        15 * ratio,
        468 * ratio,
        12,
        "#999"
      );
      guideCanvasExp.textFill(
        ctx,
        `¥${returnFloat(total.discount_fee / 100)}`,
        64 * ratio,
        468 * ratio,
        12,
        "#101010"
      );
      guideCanvasExp.textFill(ctx, "实付", 15 * ratio, 493 * ratio, 12, "#999");
      guideCanvasExp.textFill(
        ctx,
        `¥${returnFloat(total.total_fee / 100)}`,
        64 * ratio,
        493 * ratio,
        14,
        "#101010",
        "blod"
      );
      guideCanvasExp.drawImageFill(
        ctx,
        qrcode,
        230 * ratio,
        410 * ratio,
        100 * ratio,
        100 * ratio
      );
      guideCanvasExp.textFill(
        ctx,
        "长按识别下单",
        248 * ratio,
        525 * ratio,
        12,
        "#999"
      );
      // guideCanvasExp.textFill(
      //   ctx,
      //   "长按图片可立即转发",
      //   (canvasWidth / 2) * ratio,
      //   535 * ratio,
      //   12,
      //   "#666",
      //   "",
      //   "center"
      // );
      console.log("guideCanvasExp", guideCanvasExp);
      // 商品信息
      guideCanvasExp.roundRect(
        ctx,
        14 * ratio,
        84 * ratio,
        canvasWidth - 14 * ratio * 2,
        310 * ratio,
        5,
        "#f5f5f5"
      );
      ctx.save();

      ctx.setTextAlign("left");
      guideCanvasExp.textFill(ctx, "商品", 30 * ratio, 112 * ratio, 12, "#666");
      guideCanvasExp.textFill(
        ctx,
        "单价",
        206 * ratio,
        112 * ratio,
        12,
        "#666"
      );
      guideCanvasExp.textFill(
        ctx,
        "数量",
        284 * ratio,
        112 * ratio,
        12,
        "#666"
      );
      for (let i = 0; i < total.goodsItems.length; i++) {
        if (i > 5) {
          guideCanvasExp.textFill(
            ctx,
            "······",
            30 * ratio,
            290 * ratio,
            12,
            "#101010"
          );
          break;
        }
        let item = total.goodsItems[i];
        console.log("canvas-goodsList-item", item);
        guideCanvasExp.textOverflowFill(
          ctx,
          item.item_name,
          30 * ratio,
          (120 + 24 * (i + 1)) * ratio,
          184 * ratio,
          12,
          "#101010"
        );
        guideCanvasExp.textFill(
          ctx,
          `${"¥"}${returnFloat(item.price / 100)}`,
          206 * ratio,
          (120 + 24 * (i + 1)) * ratio,
          12,
          "#101010"
        );
        guideCanvasExp.textFill(
          ctx,
          `x ${item.num}`,
          284 * ratio,
          (120 + 24 * (i + 1)) * ratio,
          12,
          "#666"
        );
      }

      // 分割线
      ctx.beginPath();
      ctx.setStrokeStyle("#ddd");
      ctx.setLineWidth(1);

      ctx.moveTo(30 * ratio, 305 * ratio);
      ctx.lineTo(310 * ratio, 305 * ratio);
      ctx.stroke();

      // 赠品
      ctx.beginPath();
      for (let i = 0; i < giftslist.length; i++) {
        if (i > 1) {
          guideCanvasExp.textFill(
            ctx,
            "······",
            30 * ratio,
            380 * ratio,
            12,
            "#101010"
          );
          break;
        }
        let item = giftslist[i];
        guideCanvasExp.textOverflowFill(
          ctx,
          "【赠品】 " + item.title,
          22 * ratio,
          (310 + 24 * (i + 1)) * ratio,
          220 * ratio,
          12,
          "#87C65C"
        );
        guideCanvasExp.textFill(
          ctx,
          `x ${item.num}`,
          284 * ratio,
          (310 + 24 * (i + 1)) * ratio,
          12,
          "#666"
        );
      }
      // ctx.draw()
      console.log("======ctx.restore()===");
      // ctx.draw(false, async () => {
      //   console.log('checkout-ctx.draw-res2',ctx)
      //   const res = await Taro.canvasToTempFilePath({
      //     x: 0,
      //     y: 0,
      //     canvasId: "myCanvas"
      //   });
      //   console.log("======canvasToTempFilePath====", res);
      //   this.setState({
      //     poster: res.tempFilePath,
      //     isShowQrcode: true
      //   });
      //   Taro.hideLoading();
      // });
      setTimeout(() => {
        console.log("======ctx.setTimeout()===");
        ctx.draw(true, async () => {
          console.log("checkout-ctx.draw-res2", ctx);
          const res = await Taro.canvasToTempFilePath({
            x: 0,
            y: 0,
            canvasId: "myCanvas"
          });
          console.log("======canvasToTempFilePath====", res);
          this.setState({
            poster: res.tempFilePath,
            isShowQrcode: true
          });
          Taro.hideLoading();
        });
      }, 1000);
    } catch (err) {
      console.log("guideCanvasExp", guideCanvasExp);
      console.log(err);
      Taro.hideLoading();
    }
  };

  handleClickHideImage = () => {
    this.setState({
      isShowQrcode: false
    });
  };

  handleDownloadImage = async () => {
    const { poster } = this.state;
    const res = await Taro.getSetting();
    try {
      if (!res.authSetting["scope.writePhotosAlbum"]) {
        Taro.authorize({
          scope: 'scope.writePhotosAlbum',
          success: async () => {
            await Taro.saveImageToPhotosAlbum({ filePath: poster });
            Taro.showToast({ title: "保存成功" });
          },
          fail: () => {
            Taro.showModal({
              title: '提示',
              content: '请打开保存到相册权限',
              success: async resConfirm => {
                if (resConfirm.confirm) {
                  await Taro.openSetting();
                  const setting = await Taro.getSetting();
                  if (setting.authSetting["scope.writePhotosAlbum"]) {
                    await Taro.saveImageToPhotosAlbum({ filePath: poster });
                    Taro.showToast({ title: "保存成功" });
                  } else {
                    Taro.showToast({ title: "保存失败", icon: "none" });
                  }
                }
              }
            })
          }
        })
      } else {
        await Taro.saveImageToPhotosAlbum({ filePath: poster });
        Taro.showToast({ title: "保存成功" });
      }
    } catch (err) {
      console.log(err)
      Taro.showToast({ title: "保存失败", icon: "none" });
    }
  };

  resolvePayError = e => {
    this.setState({
      errorMessage: e
    });
  };

  render() {
    const {
      goodsllist,
      notgoodslist,
      giftslist,
      total,
      poster,
      isShowQrcode,
      canvasWidth,
      canvasHeight
    } = this.state;

    const ipxClass = S.get("ipxClass") || "";
    console.log("checkout-goodsllist-render", goodsllist);
    console.log("checkout-poster-render", poster);
    console.log("checkout-total-render", total);
    return (
      <View className={`page-checkout ${ipxClass}`}>
        <View className="checkout__wrap">
          {goodsllist.length && (
            <View className="sec cart-group__cont">
              {goodsllist.map((item, idx) => {
                return (
                  <View
                    className={classNames("order-item__wrap")}
                    key="item_id"
                  >
                    <View className="order-item__idx">
                      <Text>第{idx + 1}件商品</Text>
                    </View>
                    <BaOrderItem
                      info={item}
                      showExtra={false}
                      renderDesc={
                        <View className="order-item__desc">
                          {item.discount_info &&
                            item.discount_info.map(discount => (
                              <View key="id" style="display:inline-block;">
                                {discount.info && !discount.is_special ? (
                                  <Text
                                    className="order-item__discount"
                                    key={discount.type}
                                  >
                                    {discount.info}
                                  </Text>
                                ) : (
                                  discount.is_special && (
                                    <Image
                                      className="order-item__discount-vipimg"
                                      mode="widthFix"
                                      src={item.pics}
                                    />
                                  )
                                )}
                              </View>
                            ))}
                        </View>
                      }
                      renderActLimit={
                        <View className="order-item__actlimit">
                          {item.discount_info &&
                            item.discount_info.map(
                              discount =>
                                discount.limited === "single" &&
                                item.num > 1 && (
                                  <View
                                    key="id"
                                    className="limit_warn"
                                    style="display:inline-block;"
                                  >
                                    <Text>
                                      任选专区单品限一件，超过部分原价购买
                                    </Text>
                                  </View>
                                )
                            )}
                        </View>
                      }
                      customFooter
                      renderFooter={
                        <View className="order-item__ft">
                          <View>
                            <Price
                              className="order-item__oragin-price"
                              value={returnFloat(item.price / 100)}
                            />
                            <Price
                              className="order-item__price"
                              beforeText="实付"
                              value={returnFloat(item.total_fee / 100)}
                            />
                          </View>
                          {item.disabled ? (
                            <Text className="order-item__notnum">无库存</Text>
                          ) : (
                            <Text className="order-item__num">
                              x {item.num}
                            </Text>
                          )}
                        </View>
                      }
                    />
                  </View>
                );
              })}
            </View>
          )}
          {notgoodslist.length && (
            <View className="sec cart-group__cont">
              {notgoodslist.map((item, idx) => {
                return (
                  <View
                    className={classNames("order-item__wrap")}
                    key="item_id"
                  >
                    <View className="order-item__idx">
                      <Text>第{idx + 1}件商品</Text>
                    </View>
                    <BaOrderItem
                      info={item}
                      showExtra={false}
                      renderDesc={
                        <View className="order-item__desc">
                          {item.discount_info &&
                            item.discount_info.map(discount => (
                              <View key="id" style="display:inline-block;">
                                {discount.info && !discount.is_special ? (
                                  <Text
                                    className="order-item__discount"
                                    key={discount.type}
                                  >
                                    {discount.info}
                                  </Text>
                                ) : (
                                  discount.is_special && (
                                    <Image
                                      className="order-item__discount-vipimg"
                                      mode="widthFix"
                                      src={item.pics}
                                      // src={require("../../assets/imgs/vip-exclusive-discount.png")}
                                    />
                                  )
                                )}
                              </View>
                            ))}
                        </View>
                      }
                      customFooter
                      renderFooter={
                        <View className="order-item__ft">
                          <View>
                            <Price
                              className="order-item__oragin-price"
                              value={returnFloat(item.price / 100)}
                            />
                            <Price
                              className="order-item__price"
                              beforeText="实付"
                              value={returnFloat(item.total_fee / 100)}
                            />
                          </View>
                          {item.disabled ? (
                            <Text className="order-item__notnum">无库存</Text>
                          ) : (
                            <Text className="order-item__num">
                              x {item.num}
                            </Text>
                          )}
                        </View>
                      }
                    />
                  </View>
                );
              })}
            </View>
          )}

          {giftslist.length && (
            <View className="sec cart-group__cont">
              {giftslist.length > 0 && (
                <View className="promotion-goods__giftstitle">赠品</View>
              )}
              {giftslist.length > 0 && (
                <View className="promotion-goods">
                  {giftslist.length > 0 &&
                    giftslist.map((item, idx) => {
                      return (
                        <View key="item_id">
                          {item.order_item_type === "gift" ? (
                            <View
                              className={classNames({
                                "is-disabled": item.disabled
                              })}
                            >
                              <Text className="promotion-goods__tag">
                                【赠品】
                              </Text>
                              <Text className="promotion-goods__name">
                                {item.title}{" "}
                              </Text>
                              <Text className="promotion-goods__num">
                                {" "}
                                x{item.num}
                              </Text>
                            </View>
                          ) : null}
                        </View>
                      );
                    })}
                </View>
              )}
            </View>
          )}

          <View className="sec trade-sub-total">
            <SpCell className="trade-sub-total__item" title="商品金额：">
              <Price unit="cent" value={total.item_fee} />
            </SpCell>

            <SpCell className="trade-sub-total__item" title="优惠金额：">
              <Price unit="cent" value={total.discount_fee} />
            </SpCell>
            {total.freight_discount && (
              <SpCell className="trade-sub-total__item" title="运费优惠：">
                <Price unit="cent" value={total.freight_discount} />
              </SpCell>
            )}

            <SpCell className="trade-sub-total__item" title="运费：">
              <Price unit="cent" value={total.freight_fee} />
            </SpCell>
            {/* {info.order_class==='presale'&&<AtSwitch  title='我已同意定金不退预售协议：' color='#0b4137' border={false} checked={isAgreement} onChange={this.handleAgreement} />} */}
          </View>
          <Batoolbar>
            <View className="checkout-toolbar">
              <View className="checkout-toolbar__total">
                <Text className="total-items">共{total.items_count}件商品</Text>
                <View className="checkout-toolbar__prices">
                  <View className="total-price">
                    <Text className="price-text">总计:　</Text>
                    <Price primary unit="cent" value={total.total_fee} />
                  </View>
                  <Text className="checkout-toolbar__hint">
                    以实际支付金额为准
                  </Text>
                </View>
              </View>
              <AtButton
                type="primary"
                className="btn-confirm-order"
                onClick={this.handleShare}
              >
                分享订单
              </AtButton>
            </View>
          </Batoolbar>
          {isShowQrcode && (
            <View
              className="qrcode-index"
              onClick={this.handleClickHideImage}
              catchtouchmove
            >
              <Image
                onClick={e => e.stopPropagation()}
                showMenuByLongpress
                mode="widthFix"
                style="width: 80%"
                src={poster}
              />
              <View
                className="at-button at-button--primary download-btn"
                onClick={this.handleDownloadImage}
                type="primary"
              >
                下载到相册
              </View>
            </View>
          )}
          {/* 'canvas' */}
          <Canvas
            className="canvas-tag"
            style={styleNames({
              width: canvasWidth + "px",
              height: canvasHeight + "px"
            })}
            canvas-id="myCanvas"
          ></Canvas>
          <SpToast />
        </View>
      </View>
    );
  }
}
