import { Tracker } from "@/service";

function resolveOrderInfo(params) {
  const {
    order_id,
    order_time,
    cancel_pay_time,
    cancel_time,
    pay_time,
    refund_time,
    order_status,
    sub_orders
  } = params;
  const baseData = {
    order: {
      order_id,
      order_time: parseInt(order_time * 1000),
      // 用户关闭支付密码的浮层时间，在 cancel_pay 下必填
      cancel_pay_time,
      // 用户取消订单时间，在 cancel_give_order 下必填
      cancel_time,
      // 用户支付订单时间，在 pay 下必填
      pay_time,
      // 用户发起退货退款时间，在 refund 下必填
      refund_time,
      order_status
    },
    sub_orders
  };
  return baseData;
}

function resolveCartInfo(params, action_type) {
  const baseData = {
    sku: {
      sku_id: params.sku_id,
      sku_name: params.sku_name
    },
    spu: {
      spu_id: params.goods_id,
      spu_name: params.goods_title
    },
    sale: {
      original_price: params.market_price / 100,
      current_price: params.price / 100
    },
    goods_title: params.goods_title
  };
  if (action_type) {
    Object.assign(baseData, { action_type });
  }
  if (params.num) {
    Object.assign(baseData, { sku_num: params.num });
  }
  if (params.primary_image_url) {
    Object.assign(baseData, { primary_image_url: params.primary_image_url });
  }
  return baseData;
}

const actions = {
  // 发起咨询
  ["START_CONSULT"](params) {
    Tracker.trackEvents("start_consult", "发起咨询", {
      action_type: "consult_online",
      ...params
    });
  },
  // 注册
  ["MEMBER_REG"](params) {
    Tracker.trackEvents("register_wxapp", "用户注册", {
      ...params
    });
  },
  /**
   * give_order：用户提交订单；
   * cancel_pay：用户关闭支付密码浮层；
   * cancel_give_order：用户取消订单；
   * pay：用户发起支付；
   * refund：用户发起退货退款
   */
  // 用户提交订单
  ["CREATE_ORDER"](params) {
    const data = resolveOrderInfo({
      order_id: params.trade_info.order_id,
      order_time: params.timeStamp,
      order_status: "give_order",
      sub_orders: [
        {
          sub_order_id: params.trade_info.order_id,
          order_amt: params.item_fee / 100,
          pay_amt: parseInt(params.total_fee) / 100
        }
      ]
    });
    Tracker.trackEvents("custom_order", "用户提交订单", data);
  },
  // 用户关闭支付密码浮层
  ["CANCEL_PAY"](params) {
    const data = resolveOrderInfo({
      order_id: params.trade_info.order_id,
      order_time: params.timeStamp,
      cancel_pay_time: new Date().getTime(),
      order_status: "cancel_pay",
      sub_orders: [
        {
          sub_order_id: params.trade_info.order_id,
          order_amt: params.item_fee / 100,
          pay_amt: parseInt(params.total_fee) / 100
        }
      ]
    });
    Tracker.trackEvents("custom_order", "用户关闭支付密码浮层", data);
  },
  // 用户取消订单
  ["CANCEL_ORDER"](params) {
    const { orderInfo } = params;
    const data = resolveOrderInfo({
      order_id: orderInfo.order_id,
      order_time: orderInfo.create_time,
      order_status: "cancel_give_order",
      cancel_time: new Date().getTime(),
      sub_orders: [
        {
          sub_order_id: orderInfo.order_id,
          order_amt: orderInfo.item_fee / 100,
          pay_amt: parseInt(orderInfo.total_fee) / 100
        }
      ]
    });
    Tracker.trackEvents("custom_order", "用户取消订单", data);
  },
  // 用户发起支付
  ["ORDER_PAY"](params) {
    const data = resolveOrderInfo({
      order_id: params.trade_info.order_id,
      order_time: params.timeStamp,
      order_status: "pay",
      pay_time: new Date().getTime(),
      sub_orders: [
        {
          sub_order_id: params.trade_info.order_id,
          order_amt: params.item_fee / 100,
          pay_amt: parseInt(params.total_fee) / 100
        }
      ]
    });
    Tracker.trackEvents("custom_order", "用户发起支付", data);
  },
  // 用户发起退货退款
  ["ORDER_REFUND"](params) {
    const data = resolveOrderInfo({
      order_id: params.order_id,
      order_time: params.create_time,
      order_status: "refund",
      refund_time: new Date().getTime(),
      sub_orders: [
        {
          sub_order_id: params.order_id,
          order_amt: params.item_fee / 100,
          pay_amt: parseInt(params.total_fee) / 100
        }
      ]
    });
    Tracker.trackEvents("custom_order", "用户发起退货退款", data);
  },
  // 页面上拉触底
  ["PAGE_REACH_BOTTOM"]() {
    Tracker.trackEvents("page_reach_bottom", "页面上拉触底");
  },
  // 页面下拉刷新
  ["PAGE_PULL_DOWN_REFRESH"]() {
    Tracker.trackEvents("page_pull_down_refresh", "页面下拉刷新");
  },
  // 领取优惠券
  ["GET_COUPON"](params) {
    Tracker.trackEvents("get_coupon", "领取优惠券", {
      coupon: {
        coupon_id: params.card_id,
        coupon_name: params.title
      }
    });
  },
  // 分享
  ["GOODS_SHARE_TO_CHANNEL_CLICK"](params) {
    const data = {
      from_type: params.from_type || "button",
      share_title: params.item_name,
      share_image_url: params.pics ? params.pics[0] : "",
      shareType: params.shareType
    };

    Tracker.trackEvents("page_share_app_message", "分享", data);
  },
  // 搜索
  ["SEARCH_RESULT"](params) {
    const { keywords: keyword } = params;

    Tracker.trackEvents("search", "搜索返回结果", {
      keyword
    });
  },
  // 商品收藏
  ["GOODS_COLLECT"](params) {
    const { itemId, itemName, market_price, price, pics } = params;
    const data = resolveCartInfo({
      sku_id: itemId,
      sku_name: itemName,
      market_price,
      price,
      goods_id: itemId,
      goods_title: itemName,
      primary_image_url: pics[0]
    });
    Tracker.trackEvents("sku_collect", "商品收藏", data);
  },
  // 商品页浏览
  ["GOODS_DETAIL_VIEW"](params) {
    const { itemId, goods_id, itemName, market_price, price, pics } = params;
    const data = resolveCartInfo({
      sku_id: itemId,
      sku_name: itemName,
      market_price,
      price,
      goods_id: goods_id,
      goods_title: itemName,
      primary_image_url: pics[0]
    });
    Tracker.trackEvents("browse_sku_page", "浏览商品详情页", data);
  },
  // 商品卡曝光
  ["EXPOSE_SKU_COMPONENT"]( params ) {
    const { goodsId, title, market_price, price, imgUrl } = params;
    const data = resolveCartInfo({
      sku_id: goodsId,
      sku_name: title,
      market_price,
      price,
      goods_id: goodsId,
      goods_title: title,
      primary_image_url: imgUrl
    });
    Tracker.trackEvents("expose_sku_component", "商品卡曝光", data);
  },
  // 商品卡触发
  ["TRIGGER_SKU_COMPONENT"](params) {
    const { goodsId, title, market_price, price, imgUrl } = params;
    const data = resolveCartInfo({
      sku_id: goodsId,
      sku_name: title,
      market_price,
      price,
      goods_id: goodsId,
      goods_title: title,
      primary_image_url: imgUrl
    });
    Tracker.trackEvents("trigger_sku_component", "商品卡触发", data);
  },
  /**
   * first_add_to_cart：首次加车；
   * append_to_cart：再次加车；
   * append_to_cart_in_cart：购物车追加；
   * remove_from_cart：从购物车彻底移除
   */
  // 从购物车彻底移除
  ["REMOVE_FROM_CART"](params) {
    const {
      item_id: sku_id,
      item_spec_desc: sku_name,
      num,
      market_price,
      price,
      title
    } = params;
    const data = resolveCartInfo(
      {
        sku_id,
        sku_name,
        num,
        market_price: parseInt(market_price * 100),
        price: parseInt(price * 100),
        goods_id: sku_id,
        goods_title: title
      },
      "remove_from_cart"
    );

    Tracker.trackEvents("add_to_cart", "从购物车彻底移除", data);
  },
  // 再次加车
  ["append_to_cart"](params) {},
  // 购物车追加
  ["APPEND_TO_CART_IN_CART"](params) {
    const {
      item_id: sku_id,
      item_spec_desc: sku_name,
      num,
      market_price,
      price,
      title
    } = params;
    const data = resolveCartInfo(
      {
        sku_id,
        sku_name,
        num,
        market_price: parseInt(market_price * 100),
        price: parseInt(price * 100),
        goods_id: sku_id,
        goods_title: title
      },
      "append_to_cart_in_cart"
    );

    Tracker.trackEvents("add_to_cart", "购物车追加", data);
  },
  // 首次加车
  ["GOODS_ADD_TO_CART"](params) {
    const {
      item_id: sku_id,
      propsText: sku_name,
      goods_num: num,
      market_price,
      price,
      goods_id,
      itemName: goods_title
    } = params;

    const data = resolveCartInfo(
      { sku_id, sku_name, num, market_price, price, goods_id, goods_title },
      "first_add_to_cart"
    );
    Tracker.trackEvents("add_to_cart", "首次加车", data);
  }
};

export default actions;
