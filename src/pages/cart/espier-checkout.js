import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtButton, AtInput } from "taro-ui";
import {
  Loading,
  Price,
  SpCell,
  AddressChoose,
  SpToast,
  NavBar,
  SpHtmlContent
} from "@/components";
import api from "@/api";
import S from "@/spx";
// import { withLogin } from '@/hocs'
import {
  pickBy,
  log,
  classNames,
  isArray,
  authSetting,
  normalizeQuerys,
  redirectUrl
} from "@/utils";
import { lockScreen } from "@/utils/dom";
import { Tracker } from "@/service";
import find from "lodash/find";
import _cloneDeep from "lodash/cloneDeep";
import CheckoutItems from "./checkout-items";
import PaymentPicker from "./comps/payment-picker";
import SelectPackage from "./comps/selectPackage";

import PointUse from "./comps/point-use";
// import DrugInfo from './drug-info'
import OrderItem from "../../components/orderItem/order-item";

import "./espier-checkout.scss";
import entry from "../../utils/entry";

const transformCartList = list => {
  return pickBy(list, {
    item_id: "item_id",
    cart_id: "cart_id",
    title: "item_name",
    curSymbol: "fee_symbol",
    discount_info: "discount_info",
    order_item_type: "order_item_type",
    type: "type",
    origincountry_img_url: "origincountry_img_url",
    origincountry_name: "origincountry_name",
    pics: "pic",
    point:'point',
    item_point:"item_point",
    price: ({ price }) => (+price / 100).toFixed(2),
    num: "num",
    item_spec_desc: "item_spec_desc"
  }).sort(a => (a.order_item_type !== "gift" ? -1 : 1));
};

@connect(
  ({ address, cart, colors }) => ({
    address: address.current,
    coupon: cart.coupon,
    drugInfo: cart.drugInfo,
    colors: colors.current,
    zitiShop: cart.zitiShop
  }),
  dispatch => ({
    onClearFastbuy: () => dispatch({ type: "cart/clearFastbuy" }),
    onClearCart: () => dispatch({ type: "cart/clear" }),
    onClearCoupon: () => dispatch({ type: "cart/clearCoupon" }),
    onClearDrugInfo: () => dispatch({ type: "cart/clearDrugInfo" }),
    onAddressChoose: address =>
      dispatch({ type: "address/choose", payload: address }),
    onChangeCoupon: coupon =>
      dispatch({ type: "cart/changeCoupon", payload: coupon }),
    onChangeZitiStore: zitiShop =>
      dispatch({ type: "cart/changeZitiStore", payload: zitiShop })
    //onChangeDrugInfo: (drugInfo) => dispatch({ type: 'cart/changeDrugInfo', payload: drugInfo })
  })
)
// @withLogin()
export default class CartCheckout extends Component {
  static defaultProps = {
    list: []
  };

  constructor(props) {
    super(props);

    this.state = {
      info: null,
      submitLoading: false,
      address_list: [],
      shop: null,
      showShippingPicker: false,
      showAddressPicker: false,
      showCheckoutItems: false,
      showCoupons: false,
      express: true,
      receiptType: "logistics",
      curCheckoutItems: [],
      coupons: [],
      drug: null,
      total: {
        items_count: "",
        total_fee: "0.00",
        item_fee: "",
        freight_fee: "",
        member_discount: "",
        coupon_discount: "",
        point: "",
        point_fee: "",
        freight_type:""
      },
      payType: '',
      disabledPayment: null,
      isPaymentOpend: false,
      isDrugInfoOpend: false,
      invoiceTitle: "",
      curStore: {},
      shouldCalcOrder: false,
      shoppingGuideData: null, //代客下单导购信息
      // 跨境富文本
      quota_tip: "",
      // shopData:null, //店铺信息
      // 身份信息
      identity: {
        identity_name: "",
        identity_id: ""
      },
      //积分相关
      isPointOpen: false,
      point_use: 0,
      pointInfo: null,
      isPackage: false,
      isPackageOpen: false,
      isNeedPackage: false,
      pick: {},
      isOpenStore: null
    };
  }


  isPointitemGood() { 
    const options = this.$router.params;
    return options.type === 'pointitem';
  }

  componentDidMount() {
    // this.fetchAddress()
    if (this.$router.params.scene) {

      Taro.setStorageSync(
        "espierCheckoutData",
        normalizeQuerys(this.$router.params)
      );
    }

    let token = S.getAuthToken();
    if (!token) {
      let source = "";
      if (this.$router.params.scene) {
        source = "other_pay";
      }
      Taro.redirectTo({
        url: `/subpage/pages/auth/wxauth?source=${source}`
      });

      return;
    }
    const { cart_type, pay_type: payType, shop_id } = this.$router.params;
    let curStore = null,
      info = null;

    if (cart_type === "fastbuy") {
      curStore = Taro.getStorageSync("curStore");
      this.props.onClearFastbuy();
      info = null;
    } else if (cart_type === "cart") {
      const {
        shop_id,
        name,
        store_address,
        is_delivery,
        is_ziti = {},
        lat,
        lng,
        hour,
        phone
      } = this.$router.params;
      // 积分购买不在此种情况
      curStore = {
        shop_id,
        name,
        store_address,
        is_delivery: JSON.parse(is_delivery),
        is_ziti: JSON.parse(is_ziti),
        lat,
        lng,
        hour,
        phone
      };
      this.props.onClearFastbuy();
      info = null;
    }

    this.setState({
      curStore,
      info,
      payType: payType || this.state.payType
    });

    let total_fee = 0;
    let items_count = 0;
    const items =
      info && info.cart
        ? info.cart[0].list.map(item => {
          const { item_id, num } = item;
          total_fee += +item.price;
          items_count += +item.num;
          return {
            item_id,
            num
          };
        })
        : [];

    this.params = {
      cart_type,
      items,
      pay_type: payType || "wxpay"
    };

    this.setState({

      total: {
        items_count,
        total_fee: total_fee.toFixed(2)
      }
    });
    // this.handleAddressChange(this.props.defaultAddress)


    this.props.onAddressChoose(null);
    this.props.onChangeZitiStore(null);
    Taro.removeStorageSync('selectShop')
    this.getSalespersonNologin();
    this.tradeSetting()
    // this.getShop()
    this.fetchAddress();
    this.fetchZiTiShop();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.address !== this.props.address) {
      this.fetchAddress();
    }
    if (nextProps.zitiShop !== this.props.zitiShop) {
      this.fetchZiTiShop();
    }
  }
  componentWillUnmount() {
    // teardown clean
    this.props.onClearCoupon();
    this.props.onClearDrugInfo();
    Taro.removeStorageSync('selectShop');
  }

  componentDidShow() {
    this.setState({
      isPaymentOpend: false,
      isDrugInfoOpend: false,
      isPointOpen: false
    });
    if (this.state.shouldCalcOrder) {
      this.setState(
        {
          shouldCalcOrder: false
        },
        () => {
          this.calcOrder();
        }
      );
    }
  }

  async fetchZiTiShop() {
    const { shop_id, scene, cart_type, seckill_id = null, ticket = null, order_type } = this.$router.params;
    //const { zitiShop } = this.props;
    const params = this.getParams()
    const selectShop = Taro.getStorageSync('selectShop')
    let id = shop_id;
    let ztparams = {}
    if (scene) {
      const { dtid } = normalizeQuerys(this.$router.params);
      id = dtid;
    }
    const isOpenStore = await entry.getStoreStatus()
    this.setState({
      isOpenStore
    })
    if (isOpenStore) {//是否开启非门店自提
      ztparams = {
        isNostores: 1,//1 开启
        order_type: params.order_type,
        cart_type,
        seckill_id: seckill_id,
        seckill_ticket: ticket,
        bargain_id: params.bargain_id || ''
      }
      if (selectShop) {
        ztparams = {
          ...ztparams,
          distributor_id: selectShop.distributor_id,

        }
      } else {
        let lnglat = Taro.getStorageSync('lnglat')
        ztparams = {
          ...ztparams,
          lat: lnglat.latitude,
          lng: lnglat.longitude,
          //cart_type: cart_type,
        }
      }
    } else {
      ztparams = {
        isNostores: 0//0 未开启
      }
      if (!selectShop) {
        ztparams = {
          ...ztparams,
          distributor_id: id
        }
      }
    }
    if (APP_PLATFORM === 'platform') {
      delete ztparams.isNostores
    }
    const shopInfo = await api.shop.getShop(ztparams);
    isOpenStore && Taro.setStorageSync('selectShop', shopInfo)
    this.setState({
      curStore: shopInfo,
      receiptType: selectShop ? 'ziti' : shopInfo.is_delivery ? "logistics" : "ziti",
      express: selectShop ? false : shopInfo.is_delivery ? true : false,
    }, () => {
      isOpenStore && this.calcOrder()
    });
  }

  async fetchAddress(cb) {
    const { type } = this.$router.params;
    const isDrug = type === "drug";
    Taro.showLoading({
      mask: true
    });
    // if (!isDrug) {
    const { list } = await api.member.addressList();
    this.setState(
      {
        address_list: list
      },
      () => {
        this.changeSelection();
        cb && cb(list);
      }
    );
    /* } else {
      const { store_name, store_address, shop_id, hour } = await api.shop.getShop()
      this.setState({
        shop: {
          store_name,
          store_address,
          shop_id,
          hour
        }
      }, () => {
        this.calcOrder()
      })
    } */
    Taro.hideLoading();
  }

  /**
   * 获取代下单导购
   * */
  async getSalespersonNologin() {
    const { source, scene } = this.$router.params;
    let salesperson_id = "";
    if (source === "other_pay" || scene) {
      let espierCheckoutData = {};
      if (source === "other_pay") {
        espierCheckoutData = Taro.getStorageSync("espierCheckoutData");
      } else {
        espierCheckoutData = normalizeQuerys(this.$router.params);
      }
      salesperson_id = espierCheckoutData.smid;
    }

    if (!salesperson_id) return;

    let shoppingGuideData = await api.member.getSalespersonNologin({
      salesperson_id
    });

    shoppingGuideData.store_name =
      shoppingGuideData.store_name.length > 4
        ? shoppingGuideData.store_name.substring(0, 4) + "..."
        : shoppingGuideData.store_name;

    this.setState({
      shoppingGuideData
    });
  }

  async getShop() {
    const { source, scene } = this.$router.params;
    let distributor_id = "";
    if (source === "other_pay" || scene) {
      let espierCheckoutData = {};
      if (source === "other_pay") {
        espierCheckoutData = Taro.getStorageSync("espierCheckoutData");
      } else {
        espierCheckoutData = normalizeQuerys(this.$router.params);
      }
      distributor_id = espierCheckoutData.dtid;
    }

    if (!distributor_id) return;

    let shopData = await api.shop.getShop({
      distributor_id
    });

    this.setState({ shopData });
  }

  getShopId() {
    const { source, scene } = this.$router.params;
    if (source === "other_pay" || scene) {
      let espierCheckoutData = {};
      if (source === "other_pay") {
        espierCheckoutData = Taro.getStorageSync("espierCheckoutData");
      } else {
        espierCheckoutData = normalizeQuerys(this.$router.params);
      }
      return espierCheckoutData.dtid;
    }
  }

  changeSelection(params = {}) {
    const { address_list } = this.state;
    if (address_list.length === 0) {
      // this.props.address = {
      //   current: null
      // }
      this.props.onAddressChoose(null);
      this.setState({
        address: null
      });
      // this.handleAddressChange()
      this.calcOrder();
      /*Taro.navigateTo({
        url: '/pages/member/edit-address'
      })*/
      return;
    }

    let address = this.props.address;
    if (!address) {
      const { address_id } = params;
      address =
        find(address_list, addr =>
          address_id ? address_id === addr.address_id : addr.is_def > 0
        ) ||
        address_list[0] ||
        null;
    }

    log.debug("[address picker] selection: ", address);
    this.props.onAddressChoose(address);
    this.handleAddressChange(address);
  }

  getParams() {
    // console.log('/////////////////')
    let { isNeedPackage, pack } = this.state

    const {
      type,
      seckill_id = null,
      ticket = null,
      group_id = null,
      team_id = null,
      shop_id,
      source,
      scene,
      goodType,
      bargain_id = ""
    } = this.$router.params;
    console.log("---this.$router.params---", this.$router.params)
    let cxdid = null;
    let dtid = null;
    let smid = null;
    if (source === "other_pay" || scene) {
      let espierCheckoutData = {};
      if (source === "other_pay") {
        espierCheckoutData = Taro.getStorageSync("espierCheckoutData");
      } else {
        espierCheckoutData = normalizeQuerys(this.$router.params);
      }
      cxdid = espierCheckoutData.cxdid;
      dtid = espierCheckoutData.dtid;
      smid = espierCheckoutData.smid;
    }
    let orderType = "";
    let activity = {};
    orderType = (() => {
      const key = type;
      let value = "";
      switch (key) {
        case "drug":
          value = "normal_drug";
          break;
        case "group":
          value = "normal_groups";
          activity = Object.assign(activity, { bargain_id: group_id });
          if (team_id) {
            activity = Object.assign(activity, { team_id });
          }
          break;
        case "seckill":
          value = "normal_seckill";
          activity = Object.assign(activity, {
            seckill_id: seckill_id,
            seckill_ticket: ticket
          });
          break;
        default:
          value = "normal";
      }
      return value;
    })();
    const receiver = pickBy(this.state.address, {
      receiver_name: "name",
      receiver_mobile: "mobile",
      receiver_state: "state",
      receiver_city: "city",
      receiver_district: "district",
      receiver_address: "address",
      receiver_zip: "zip"
    });
    let buyerInfo = {};
    if (type === "drug") {
      buyerInfo = pickBy(this.state.drug, {
        drug_buyer_name: "name",
        drug_buyer_id_card: "id_card",
        drug_list_image: "imgs"
      });
    }
    const trackParams = Taro.getStorageSync("trackParams");
    let tracks = {};
    if (trackParams) {
      tracks = {
        source_id: trackParams.source_id,
        monitor_id: trackParams.monitor_id
      };
    }
    const distributionShopId = Taro.getStorageSync("distribution_shop_id")
    const curStorageStore = Taro.getStorageSync('curStore')
    let miniShopId = {};
    if (distributionShopId) {
      miniShopId = {
        promoter_shop_id: distributionShopId
      };
    }
    const { payType, receiptType, point_use, isOpenStore, curStore } = this.state;
    const { coupon, drugInfo, zitiShop } = this.props;
    if (drugInfo) {
      this.setState({
        drug: drugInfo
      });
    }
    let params = {
      ...this.params,
      ...receiver,
      ...buyerInfo,
      ...tracks,
      ...miniShopId,
      ...activity,
      receipt_type: receiptType,
      order_type: bargain_id ? "bargain" : orderType,
      promotion: "normal",
      member_discount: 0,
      coupon_discount: 0,
      pay_type: payType,
      isNostores: isOpenStore ? 1 : 0,
      //distributor_id:this.getShopId() || (shop_id === "undefined" ? 0 : shop_id),
      distributor_id: isOpenStore
        ? receiptType === 'logistics'
          ? curStorageStore.store_id
          : zitiShop
            ? zitiShop.distributor_id
            : curStore
              ? curStore.distributor_id
              : this.getShopId() || (shop_id === "undefined" ? 0 : shop_id)
        : this.getShopId() || (shop_id === "undefined" ? curStorageStore.distributor_id : shop_id),
      ...drugInfo,
      point_use: point_use
    };
    if (isNeedPackage) {
      params.pack = pack
    }
    if (cxdid) {
      params.cxdid = cxdid;
      params.distributor_id = dtid;
      params.cart_type = "cxd";
      params.order_type = "normal_shopguide";
      params.salesman_id = smid;
    }

    if (this.isPointitemGood()) {
      params.order_type = "normal_pointsmall";
      params.pay_type='point';
      //params.distributor_id=0;
    }

    if (payType === "point") {
      delete params.point_use;
    }
    if (APP_PLATFORM === 'platform') {
      delete params.isNostores
    }
    if (coupon) {
      if (coupon.not_use_coupon === 1) {
        params.not_use_coupon = 1;
      } else {
        params.not_use_coupon = 0;
      }
      if (coupon.type === "coupon" && coupon.value.code) {
        params.coupon_discount = coupon.value.code;
      } else if (coupon.type === "member") {
        params.member_discount = coupon.value ? 1 : 0;
      }
    }
    if (goodType === "cross") {
      params.iscrossborder = 1;
    } else {
      delete params.iscrossborder;
    }
    if (bargain_id) {
      params.bargain_id = bargain_id;
    }
    this.params = params;
    return _cloneDeep(params);
  }
  async tradeSetting() {
    let res = await api.trade.tradeSetting()
    let { is_open, packName, packDes } = res

    this.setState({
      isPackage: is_open,
      pack: {
        packName, packDes
      }
    })

    console.log(res, 'res');
  }
  async calcOrder() {
    Taro.showLoading({
      title: "加载中",
      mask: true
    });
    const params = this.getParams();

    let salesperson_id = Taro.getStorageSync("s_smid");
    if (salesperson_id) {
      params.salesperson_id = salesperson_id;
    }
    let data;
    try {
      data = await api.cart.total(params);
    } catch (e) {
      this.resolvePayError(e);
    }

    if (!data) return;

    const {
      items,
      item_fee,
      item_point,
      totalItemNum,
      member_discount = 0,
      coupon_discount = 0,
      discount_fee,
      freight_fee = 0,
      freight_type,
      freight_point = 0,
      point = 0,
      total_fee,
      remainpt,
      deduction,
      third_params,
      coupon_info,
      total_tax,
      quota_tip,
      identity_name = "",
      identity_id = "",
      taxable_fee,
      point_fee = 0,
      point_use,
      user_point = 0,
      max_point = 0,
      is_open_deduct_point,
      deduct_point_rule,
      real_use_point,
      invoice_status
    } = data;

    //const { items, item_fee, totalItemNum, member_discount = 0, coupon_discount = 0, discount_fee, freight_fee = 0, freight_point = 0, point = 0, total_fee, remainpt, deduction,third_params, coupon_info,point_fee=0,point_use, user_point = 0,max_point = 0 ,is_open_deduct_point,deduct_point_rule,real_use_point } = data      // 测试数据
    if (coupon_info && !this.props.coupon) {
      this.props.onChangeCoupon({
        type: "coupon",
        value: {
          title: coupon_info.info,
          card_id: coupon_info.id,
          code: coupon_info.coupon_code,
          discount: coupon_info.discount_fee
        }
      });
    }
    const total = {
      ...this.state.total,
      item_fee,
      discount_fee: -1 * discount_fee,
      member_discount: -1 * member_discount,
      coupon_discount: -1 * coupon_discount,
      taxable_fee,
      freight_fee,
      total_tax,
      total_fee: params.pay_type === "point" ? 0 : total_fee,
      items_count: totalItemNum,
      point,
      freight_point,
      // 是否开启开发票
      invoice_status,
      remainpt, // 总积分
      deduction, // 抵扣
      point_fee: -1 * point_fee, //积分抵扣金额,
      item_point,
      freight_type
    };

    let info = this.state.info;
    let pointInfo = this.state.pointInfo;
    if (items) {
      //debugger ;
      console.log('--------items-------',items)
      // 从后端获取订单item
      info = {
        cart: [
          {
            list: transformCartList(items),
            cart_total_num: items.reduce((acc, item) => +item.num + acc, 0)
          }
        ]
      };
      pointInfo = {
        deduct_point_rule,
        is_open_deduct_point,
        user_point, //用户现有积分
        max_point, //最大可使用积分
        real_use_point: real_use_point,
        point_use: point_use
      };
      if (
        pointInfo.real_use_point &&
        pointInfo.real_use_point < pointInfo.point_use
      ) {
        S.toast("积分有调整");
      }

      this.params.items = items;
      //this.params.pointInfo = pointInfo
    }
    //console.warn('third_params',third_params)

    Taro.hideLoading();
    this.setState({
      total,
      info,
      third_params,
      quota_tip,
      identity: {
        identity_id,
        identity_name
      },
      pointInfo
    });
  }

  handleSwitchExpress = key => {
    const receiptType = JSON.parse(key) ? "logistics" : "ziti";
    this.clearPoint();
    this.setState(
      {
        express: JSON.parse(key),
        receiptType
      },
      () => {
        this.calcOrder();
      }
    );
  };

  handleAddressChange = address => {
    if (!address) {
      return;
    }
    address = pickBy(address, {
      state: "province",
      city: "city",
      district: "county",
      address_id: "address_id",
      mobile: "telephone",
      name: "username",
      zip: "postalCode",
      address: "adrdetail",
      area: "area"
    });
    this.clearPoint();
    this.setState(
      {
        address
      },
      () => {
        this.calcOrder();
      }
    );
    if (!address) {
      this.setState({
        showAddressPicker: true
      });
    }
  };

  handleMapClick = () => {
    const { curStore } = this.state;
    const { lat, lng } = curStore ? curStore : Taro.getStorageSync("curStore");
    Taro.openLocation({
      latitude: Number(lat),
      longitude: Number(lng),
      scale: 18
    });
  };
  handleEditZitiClick = (id) => {
    const { cart_type, seckill_id = null, ticket = null, goodType } = this.$router.params;
    const params = this.getParams()
    Taro.navigateTo({
      url: `/pages/store/ziti-list?shop_id=${id}&cart_type=${cart_type}&order_type=${params.order_type}&seckill_id=${seckill_id}&ticket=${ticket}&goodType=${goodType}&bargain_id=${params.bargain_id || ''}`
    })
  }

  handleShippingChange = type => {
    console.log(type);
  };

  handleClickItems(items) {
    this.setState({
      curCheckoutItems: items
    });
    this.toggleCheckoutItems();
  }

  handleInvoiceClick = async () => {
    const res = await Taro.chooseInvoiceTitle();

    if (res.errMsg === "chooseInvoiceTitle:ok") {
      log.debug("[invoice] info:", res);
      const {
        type,
        title: content,
        companyAddress: company_address,
        taxNumber: registration_number,
        bankName: bankname,
        bankAccount: bankaccount,
        telephone: company_phone
      } = res;
      this.params = {
        ...this.params,
        invoice_type: "normal",
        invoice_content: {
          title: type !== 0 ? "individual" : "unit",
          content,
          company_address,
          registration_number,
          bankname,
          bankaccount,
          company_phone
        }
      };
      this.setState({
        invoiceTitle: content
      });
    }
  };

  handleChange = val => {
    let drug = null;
    const arr = Object.values(val);
    const isNan = arr.length > 0 && arr.find(item => item !== "");
    if (isNan) drug = val;
    this.setState(
      {
        drug,
        isDrugInfoOpend: false
      },
      () => {
        this.calcOrder();
      }
    );
  };

  toggleCheckoutItems(isOpened) {
    if (isOpened === undefined) {
      isOpened = !this.state.showCheckoutItems;
    }

    lockScreen(isOpened);
    this.setState({ showCheckoutItems: isOpened });
  }

  toggleState(key, val) {
    if (val === undefined) {
      val = !this.state[key];
    }

    this.setState({
      [key]: val
    });
  }

  handlePaymentShow = () => {
    this.setState({
      isPaymentOpend: true,
      isDrugInfoOpend: false,
      isPointOpen: false
    });
  };

  handleDrugInfoShow = () => {
    // this.setState({
    //   isPaymentOpend: false,
    //   isDrugInfoOpend: true
    // })
    const { drug } = this.state;
    Taro.navigateTo({
      url: `/others/pages/cart/drug-info`
    });
  };

  handleDrugChange = val => {
    console.log(val);
  };

  resolvePayError(e) {
    const { payType, disabledPayment } = this.state;
    if (payType === "point" || payType === "deposit") {
      const disabledPaymentMes = {};
      disabledPaymentMes[payType] = e.message;
      if (
        payType === "deposit" &&
        e.message === "当前余额不足以支付本次订单费用，请充值！"
      ) {
        Taro.hideLoading();
        Taro.showModal({
          content: e.message,
          confirmText: "去充值",
          success: res => {
            if (res.confirm) {
              Taro.redirectTo({
                url: "/others/pages/recharge/index"
              });
            } else {

              this.setState({
                disabledPayment: { ...disabledPaymentMes, ...disabledPayment },
                payType: 'wxpay'
              }, () => {
                this.calcOrder()
              })
            }
          }
        });
        return;
      }
      // let payTypeNeedsChange = ['当前积分不足以支付本次订单费用', '当月使用积分已达限额'].includes(e.message)
      this.setState({
        disabledPayment: { ...disabledPaymentMes, ...disabledPayment },
        payType: ''
      }, () => {
        this.calcOrder()
      })
    }
  }

  submitPay = () => {
    let { receiptType, submitLoading } = this.state;
    if (receiptType === "logistics") {
      if (this.state.curStore.is_delivery && !this.state.address) {
        return S.toast("请选择地址");
      }
    }
    if (submitLoading) {
      return false;
    }
    this.setState({
      submitLoading: true
    });
    let _this = this;
    console.log("---Taro.getEnv()--",Taro.getEnv())
    if (Taro.getEnv() === "WEAPP") {
      let templeparams = {
        temp_name: "yykweishop",
        source_type:
          receiptType === "logistics" ? "logistics_order" : "ziti_order"
      };
      api.user.newWxaMsgTmpl(templeparams).then(
        tmlres => {
          console.log("templeparams---1", tmlres);
          if (tmlres.template_id && tmlres.template_id.length > 0) {
            wx.requestSubscribeMessage({
              tmplIds: tmlres.template_id,
              success() {
                _this.handlePay();
              },
              fail() {
                _this.handlePay();
              }
            });
          } else {
            _this.handlePay();
          }
        },
        () => {
          _this.handlePay();
        }
      );
    } else {
      _this.handlePay();
    }
  };

  async createByType(params){  
    let info;
    if(this.isPointitemGood()){
      info = await api.trade.create({
        ...params, 
      })
    }else{
      info = await api.trade.create(params)
    } 
    return info;
  }

  async h5CreateByType(params){  
    let info;
    if(this.isPointitemGood()){
      info = await api.trade.h5create({
        ...params, 
      })
    }else{
      info = await api.trade.h5create(params)
    } 
    return info;
  }

  handlePay = async () => {/*  */
    // if (!this.state.address) {
    //   return S.toast('请选择地址')
    // }
    const { payType, total, identity, isOpenStore, curStore, receiptType } = this.state;
    const { type, goodType, cart_type } = this.$router.params;

    // const { payType, total,point_use } = this.state
    // const { type } = this.$router.params
    const isDrug = type === "drug";
    if (payType === "point" || payType === "deposit") {
      try {
        const content =
          payType === "point"
            ? `确认使用${total.point}积分全额抵扣商品总价吗`
            : "确认使用余额支付吗？";
        const { confirm } = await Taro.showModal({
          title: payType === "point" ? "积分支付" : "余额支付",
          content,
          confirmColor: "#0b4137",
          confirmText: "确认使用",
          cancelText: "取消"
        });
        if (!confirm) {
          this.setState({
            submitLoading: false
          });
          return;
        }
      } catch (e) {
        this.setState({
          submitLoading: false
        });
        console.log(e);
        return;
      }
    }

    Taro.showLoading({
      title: "正在提交",
      mask: true
    });

    this.setState({
      submitLoading: true
    });

    let order_id, config, payErr;
    try {
      let params = this.getParams();

      console.log("-----paramsparams----",params)
      if (APP_PLATFORM === "standard" && cart_type !== "cart") {
        const { distributor_id, store_id } = Taro.getStorageSync("curStore");
        params.distributor_id = isOpenStore ? receiptType === 'ziti' ? curStore.distributor_id : store_id : this.getShopId() || distributor_id;
      }
      delete params.items;
      // 积分不开票
      if (payType === "point") {
        delete params.invoice_type;
        delete params.invoice_content;
        delete params.point_use;
      }

      let salesman_id = Taro.getStorageSync("s_smid");
      if (salesman_id) {
        params.salesman_id = salesman_id;
      }

      // 如果是跨境商品
      if (goodType === "cross") {
        if (!identity.identity_id || !identity.identity_name) {
          Taro.showToast({
            title: identity.identity_id
              ? "请填写订购人姓名"
              : "请填写订购人身份证号",
            icon: "none",
            mask: true
          });
          this.setState({
            submitLoading: false
          });
          return false;
        }
        params = { ...params, ...identity };
      }

      if (
        process.env.TARO_ENV === "h5" &&
        payType !== "point" &&
        payType !== "deposit" &&
        !isDrug
      ) {
        config = await this.h5CreateByType({
          ...params,
          pay_type:this.state.total.freight_type==="point"?'point':'wxpay'
        });
        redirectUrl(api, `/subpage/pages/cashier/index?order_id=${config.order_id}&type=pointitem`)
        // Taro.redirectTo({
        //   url: `/subpage/pages/cashier/index?order_id=${config.order_id}`
        // });
        return;
      } else {
        console.log("----this.state.total---",this.state.total)
        config = await this.createByType({
          ...params,
          pay_type:this.state.total.freight_type==="point"?'point':payType
        });
        order_id = isDrug ? config.order_id : config.trade_info.order_id;
      }  
      // 提交订单埋点
      Tracker.dispatch("CREATE_ORDER", {
        ...total,
        ...config
      });

      this.cancelpay = () => {
        Tracker.dispatch("CANCEL_PAY", {
          ...total,
          ...config
        });
      };
    } catch (e) {
      Taro.showToast({
        title: e.message,
        icon: "none",
        mask: true
      });
      payErr = e;
      this.resolvePayError(e);
      this.setState({
        submitLoading: false
      });
      // dhpoint 判断
      if (payType === "point") {
        this.setState({
          submitLoading: false
        });
      }
    }

    Taro.hideLoading();
    if (!order_id) return;

    if (isDrug) {
      Taro.redirectTo({
        url: "/subpage/pages/trade/drug-list"
      });
      return;
    }
    // 支付流程
    const paymentParams = {
      order_id,
      pay_type: this.state.payType,
      order_type: config.order_type
    };

    this.setState({
      submitLoading: false
    }); 

    const isExtraPoint=this.isPointitemGood() && this.state.total.freight_type==="point";
 
    // 积分流程
    if (payType === "point" || payType === "deposit" || isExtraPoint ) { 
      if (!payErr) {
        Taro.showToast({
          title: "支付成功",
          icon: "none"
        });

        this.props.onClearCart();

        let url=`/subpage/pages/trade/detail?id=${order_id}`;

        if(isExtraPoint){
          url+="&type=pointitem";
        }
  
        Taro.redirectTo({
          url
        });
      }

      return;
    }

    payErr = null;
    console.log("-----config-----",config)
    try {
      const payRes = await Taro.requestPayment(config);
      // 支付上报
      const { total } = this.state;
      Tracker.dispatch("ORDER_PAY", {
        ...total,
        ...config
      });

      log.debug(`[order pay]: `, payRes);
    } catch (e) {
      payErr = e;
      console.log(e)
      // Taro.showToast({
      //   //title: e.err_desc || e.errMsg || "支付失败",
      //   title:"支付失败",
      //   icon: "none"
      // });
    }

    if (!payErr) {
      await Taro.showToast({
        title: "支付成功",
        icon: "success"
      });

      this.props.onClearCart();

      let purl=`/subpage/pages/trade/detail?id=${order_id}`;

      if(this.isPointitemGood()){
        purl+="&type=pointitem";
      } 
      
      Taro.redirectTo({
        url:
          type === "group"
            ? `/marketing/pages/item/group-detail?team_id=${config.team_id}`
            : purl
      });

      /*this.props.onClearCart()
      Taro.redirectTo({
        url: `/subpage/pages/trade/detail?id=${order_id}`
      })*/
    } else {
      if (payErr.errMsg.indexOf("fail cancel") >= 0) {
        this.cancelpay();

        let purl=`/subpage/pages/trade/detail?id=${order_id}`;

        if(this.isPointitemGood()){
          purl+="&type=pointitem";
        } 

        Taro.redirectTo({
          url: purl
        });
      }
    }
    return;

    // const url = `/pages/cashier/index?order_id=${order_id}`
    // this.props.onClearCart()
    // Taro.navigateTo({ url })
  };

  handleRemarkChange = val => {
    this.params = {
      ...this.params,
      remark: val
    };
  };

  handleCouponsClick = () => {
    // if (this.state.payType === 'point'){
    //   return
    // }
    // if (this.params.order_type === 'normal' || this.params.order_type === 'normal_seckill' || this.params.order_type === 'single_group' || this.params.order_type === 'limited_time_sale') {
    //   return S.toast('该活动不支持使用优惠券')
    // }

    const items = this.params.items
      .filter(item => item.order_item_type !== "gift")
      .map(item => {
        const { item_id, num, total_fee: price } = item;
        return {
          item_id,
          price,
          num
        };
      });

    const { shop_id, source, scene, cart_type, goodType } = this.$router.params;

    let m_source = "";
    if (source === "other_pay" || scene) {
      m_source = "other_pay";
    }

    // let { point_use, shopData } = this.state

    // S.set('point_use',point_use)
    let id = "";
    if (APP_PLATFORM === "standard" && cart_type !== "cart") {
      const { distributor_id } = Taro.getStorageSync("curStore");
      id = distributor_id;
    } else {
      id = shop_id;
    }
    if (scene) {
      const espierCheckoutData = normalizeQuerys(this.$router.params);
      id = espierCheckoutData.dtid;
    }
    this.clearPoint();
    this.setState(
      {
        shouldCalcOrder: true
      },
      () => {
        Taro.navigateTo({
          url: `/others/pages/cart/coupon-picker?items=${JSON.stringify(
            items
          )}&is_checkout=true&cart_type=${this.params.cart_type
            }&distributor_id=${id}&source=${m_source}&goodType=${goodType}`
        });
      }
    );
    // Taro.navigateTo({
    //   url: `/pages/cart/coupon-picker?items=${JSON.stringify(items)}&is_checkout=true&cart_type=${this.params.cart_type}&distributor_id=${id}`
    // })
  };

  handlePaymentChange = async payType => {
    // if (payType === 'point') {
    //   this.props.onClearCoupon()
    // }
    this.setState({
      point_use: 0,
      payType,
      isPaymentOpend: false
    }, () => {
      this.calcOrder()
    })
  }

  handleLayoutClose = () => {
    this.setState({
      isPaymentOpend: false,
      isDrugInfoOpend: false,
      isPointOpen: false
    });
  };

  // 开发票
  handleInvoiceClick = async () => {
    authSetting("invoiceTitle", async () => {
      const res = await Taro.chooseInvoiceTitle();

      if (res.errMsg === "chooseInvoiceTitle:ok") {
        log.debug("[invoice] info:", res);
        const {
          type,
          title: content,
          companyAddress: company_address,
          taxNumber: registration_number,
          bankName: bankname,
          bankAccount: bankaccount,
          telephone: company_phone
        } = res;
        console.log(type, 440);
        this.params = {
          ...this.params,
          invoice_type: "normal",
          invoice_content: {
            title: type == 0 ? "unit" : "individual",
            content,
            company_address,
            registration_number,
            bankname,
            bankaccount,
            company_phone
          }
        };
        this.setState({
          invoiceTitle: content
        });
      }
    });
  };

  //使用积分
  handlePointShow = () => {
    this.setState({
      isPointOpen: true,
      isPaymentOpend: false,
      isDrugInfoOpend: false
    });
  };
  handlePointUseChange = async (point_use, payType) => {
    this.setState(
      {
        point_use,
        payType,
        isPointOpen: false
      },
      () => {
        this.calcOrder();
      }
    );
  };

  //清除使用积分
  clearPoint = () => {
    this.setState({
      point_use: 0,
      payType: "wxpay"
    });
  };
  // 选择是否需要礼袋
  changeNeedPackage = (isChecked) => {
    this.setState({
      isNeedPackage: isChecked
    })
  }
  resetInvoice = e => {
    e.stopPropagation();
    this.setState({ invoiceTitle: "" });
    delete this.params.invoice_type;
    delete this.params.invoice_content;
  };
  resetPoint = e => {
    e.stopPropagation();
    const { pointInfo } = this.state;
    pointInfo.point_use = 0;
    this.setState(
      {
        point_use: 0,
        payType: "wxpay",
        pointInfo
      },
      () => {
        this.calcOrder();
      }
    );
  };

  // 复制链接
  copyLink = () => {
    Taro.setClipboardData({
      data: "https://app.singlewindow.cn/ceb2pubweb/sw/personalAmount"
    });
  };

  // 输入跨境信息
  inputChange = (type, e) => {
    const { identity } = this.state;
    identity[type] = e;
    this.setState({
      identity
    });
  };

  render() {
    // 支付方式文字
    const payTypeText = {
      point: '积分支付',
      wxpay: process.env.TARO_ENV === 'weapp' ? '微信支付' : '现金支付',
      deposit: '余额支付',
      delivery: '货到付款',
      hfpay: '汇付支付'
    }
    const { coupon, colors } = this.props
    const {
      info,
      express,
      address,
      total,
      showAddressPicker,
      showCheckoutItems,
      curCheckoutItems,
      payType,
      invoiceTitle,
      submitLoading,
      disabledPayment,
      isPaymentOpend,
      isDrugInfoOpend,
      drug,
      third_params,
      shoppingGuideData,
      curStore,
      pointInfo,
      isPointOpen,
      identity,
      quota_tip,
      isNeedPackage,
      isPackage,
      pack,
      isOpenStore
    } = this.state;
    console.log("---total---",total);
    console.log("---info---",info);
    // let curStore = {}
    // if (shopData) {
    //   curStore = shopData
    // } else {
    //   curStore = this.state.curStore
    // }
    //const curStore = Taro.getStorageSync('curStore')
    // const { curStore } = this.state
    const { type, goodType, bargain_id } = this.$router.params;
    const isDrug = type === "drug";

    console.log("----cart.list-----",info)

    if (!info) {
      return <Loading />;
    }

    const couponText = !coupon
      ? ""
      : coupon.type === "member"
        ? "会员折扣"
        : (coupon.value && coupon.value.title) || "";
    //const isBtnDisabled = !address
    const isBtnDisabled = express ? !address : false;
    return (
      <View className="page-checkout">
        {showAddressPicker === false ? (
          <NavBar
            title="填写订单信息"
            leftIconType="chevron-left"
            fixed="true"
          />
        ) : null}
        {shoppingGuideData ? (
          <View className="shopping-guide-header">
            此订单商品来自“{shoppingGuideData.store_name}”导购“
            {shoppingGuideData.name}”的推荐
          </View>
        ) : null}
        <ScrollView scrollY className="checkout__wrap">
          {curStore &&
            !isArray(curStore) &&
            curStore.is_ziti &&
            curStore.is_delivery &&
            !bargain_id &&
            goodType !== "cross" && (
              <View className="switch-tab">
                <View
                  className={classNames("switch-item", express ? "active" : "")}
                  onClick={this.handleSwitchExpress.bind(this, true)}
                >
                  配送
                </View>
                {!this.isPointitemGood() && <View
                  className={classNames(
                    "switch-item",
                    !express ? "active" : ""
                  )}
                  onClick={this.handleSwitchExpress.bind(this, false)}
                >
                  自提
                </View>}
              </View>
            )}
          {bargain_id ||
            (express && curStore && curStore.is_delivery) ||
            (curStore && !curStore.is_delivery && !curStore.is_ziti) ||
            goodType === "cross" ? (
              <AddressChoose isAddress={address} />
            ) : (
              <View className="address-module">
                <View className="addr">
                  <View className="view-flex-item">
                    <View className="addr-title">{curStore.name}</View>
                    <View className="addr-detail">{curStore.store_address}</View>
                  </View>
                  {
                    isOpenStore && (APP_PLATFORM === 'standard')
                      ? <View
                        className="icon-edit"
                        onClick={this.handleEditZitiClick.bind(this, curStore.distributor_id)}>
                      </View>
                      : <View
                        className="icon-location"
                        onClick={this.handleMapClick.bind(this)}
                      ></View>
                  }
                </View>
                <View className="view-flex">
                  <View className="view-flex-item">
                    <View className="text-muted">营业时间：</View>
                    <View>{curStore.hour}</View>
                  </View>
                  <View className="view-flex-item">
                    <View className="text-muted">联系电话：</View>
                    <View>{curStore.phone}</View>
                  </View>
                </View>
              </View>
            )}
          {goodType === "cross" && (
            <SpCell border={false} className="coupons-list">
              <AtInput
                name="name"
                title="订购人"
                type="text"
                className="identity"
                border={false}
                placeholder="请输入身份证上的姓名"
                value={identity.identity_name}
                onChange={this.inputChange.bind(this, "identity_name")}
              />
              <AtInput
                name="cardId"
                title="身份证号"
                type="idcard"
                className="identity"
                border={false}
                placeholder="请输入身份证号码"
                value={identity.identity_id}
                ticket
                onChange={this.inputChange.bind(this, "identity_id")}
              />
              <Text className="extDesc">
                根据海关规定，购买人身份信息需与支付软件认证信息一致才可通关。本信息仅作通关用户，将被严格保密
              </Text>
            </SpCell>
          )}
          {/* type !== 'limited_time_sale' */}
          {type !== "group" && type !== "seckill" && !bargain_id && !this.isPointitemGood() && (
            <SpCell
              isLink
              className="coupons-list"
              title="选择优惠券"
              onClick={this.handleCouponsClick}
              value={couponText || ""}
            />
          )}

          <View className="cart-list">
            {info.cart.map(cart => {
              return (
                <View className="cart-group" key={cart.shop_id}>
                  <View className="sec cart-group__cont">
                    {cart.list.map((item, idx) => {
                      return (
                        <View className="order-item__wrap" key={item.item_id}>
                          {item.order_item_type === "gift" ? (
                            <View className="order-item__idx">
                              <Text>赠品</Text>
                            </View>
                          ) : (
                              <View className="order-item__idx national">
                                <Text>第{idx + 1}件商品</Text>
                                {item.type == "1" && (
                                  <View className="nationalInfo">
                                    <Image
                                      className="nationalFlag"
                                      src={item.origincountry_img_url}
                                      mode="aspectFill"
                                      lazyLoad
                                    />
                                    <Text className="nationalTitle">
                                      {item.origincountry_name}
                                    </Text>
                                  </View>
                                )}
                              </View>
                            )}
                          <OrderItem
                            // isShowNational
                            info={item}
                            showExtra={false}
                            showDesc={true}
                            isPointitemGood={this.isPointitemGood()}
                            renderDesc={
                              <View className="order-item__desc">
                                {item.discount_info && item.order_item_type !== "gift" &&
                                  item.discount_info.map(discount => (
                                    <Text
                                      className="order-item__discount"
                                      key={discount.type}
                                    >
                                      {discount.info}
                                    </Text>
                                  ))}
                              </View>
                            }
                            customFooter
                            renderFooter={
                              <View className="order-item__ft">
                                {
                                  this.isPointitemGood() ?
                                    <Price className='order-item__price' appendText='积分' noSymbol noDecimal value={item.item_point}></Price>
                                    : <Price
                                      className="order-item__price"
                                      value={item.price}
                                    ></Price>}

                                <Text className="order-item__num">
                                  x {item.num}
                                </Text>
                              </View>
                            }
                          />
                        </View>
                      );
                    })}
                  </View>
                  {isDrug && (
                    <SpCell
                      isLink
                      className="coupons-list"
                      title="用药人信息"
                      onClick={this.handleDrugInfoShow}
                      //onChange={this.handleDrugChange}
                      value={drug ? "已上传" : "用药人及处方上传"}
                      drug={drug}
                    />
                  )}
                  <View className="sec cart-group__cont">
                    <SpCell className="sec trade-remark" border={false}>
                      <AtInput
                        className="trade-remark__input"
                        placeholder="给商家留言：选填（50字以内）"
                        onChange={this.handleRemarkChange.bind(this)}
                      />
                    </SpCell>
                  </View>
                </View>
              );
            })}
          </View>
 
          {process.env.TARO_ENV === "weapp" && !this.isPointitemGood() && !bargain_id &&  total.invoice_status(
            <SpCell
              isLink
              className="trade-invoice"
              title="开发票"
              onClick={this.handleInvoiceClick}
            >
              <View className="invoice-title">
                {invoiceTitle && (
                  <View
                    className="icon-close invoice-guanbi"
                    onClick={this.resetInvoice.bind(this)}
                  ></View>
                )}
                {invoiceTitle || "否"}
              </View>
            </SpCell>
          )}
          {(isPackage && express) && <SelectPackage isPointitem={this.isPointitemGood()} isChecked={isNeedPackage} onHanleChange={this.changeNeedPackage.bind(this)} packInfo={pack} />}

          {/*<SpCell
            isLink
            className='trade-invoice'
            title='开发票'
            onClick={this.handleInvoiceClick}
          >
            <Text>{invoiceTitle || '否'}</Text>
          </SpCell>*/}

          {/*<SpCell
            className='trade-shipping'
            title='配送方式'
            value='[快递免邮]'
          >
          </SpCell>*/}
          {goodType !== "cross" && !this.isPointitemGood() && pointInfo.is_open_deduct_point && !bargain_id && (
            <SpCell
              isLink
              className="trade-invoice"
              title="积分抵扣"
              onClick={this.handlePointShow}
            >
              <View className="invoice-title">
                {(pointInfo.point_use > 0 || payType === "point") && (
                  <View
                    className="icon-close invoice-guanbi"
                    onClick={this.resetPoint.bind(this)}
                  ></View>
                )}
                {payType === "point"
                  ? "全额抵扣"
                  : pointInfo.point_use > 0
                    ? `已使用${pointInfo.real_use_point}积分`
                    : "使用积分"}
              </View>
            </SpCell>
          )}

          {!bargain_id && !this.isPointitemGood() && (
            <View className="trade-payment">
              <SpCell
                isLink
                border={false}
                title="支付方式"
                onClick={this.handlePaymentShow}
              >
                {total.deduction && (
                  <Text className="trade-payment__hint">
                    {total.remainpt}积分可用
                  </Text>
                )}
                <Text>{payTypeText[payType]}</Text>
              </SpCell>
              {total.deduction && (
                <View className="trade-payment__hint">
                  可用{total.point}积分，抵扣{" "}
                  <Price unit="cent" value={total.deduction} /> (包含运费{" "}
                  <Price unit="cent" value={total.freight_fee}></Price>)
                </View>
              )}
            </View>
          )}

          {/* {payType === "point" && !bargain_id && (
            <View className="sec trade-sub-total">
              <SpCell title="运费">
                <Price unit="cent" value={total.freight_fee} />
              </SpCell> */}
          {/*
                <SpCell
                  className='trade-sub-total__item'
                  title='积分'
                >
                  <Price
                    noSymbol
                    noDecimal
                    appendText='积分'
                    value={total.point}
                  />
                </SpCell>
              */}
          {/* </View>
          )} */}


          {!this.isPointitemGood() && <View className="sec trade-sub-total">
            <SpCell className="trade-sub-total__item" title="商品金额：">
              <Price unit="cent" value={total.item_fee} />
            </SpCell>
            {goodType === "cross" && (
              <SpCell className="trade-sub-total__item" title="应税商品金额">
                <Price unit="cent" value={total.taxable_fee} />
              </SpCell>
            )}
            {/*<SpCell
                className='trade-sub-total__item'
                title='会员折扣：'
              >
                <Price
                  unit='cent'
                  value={total.member_discount}
                />
              </SpCell>*/}
            <SpCell className="trade-sub-total__item" title="优惠金额：">
              <Price unit="cent" value={total.discount_fee} />
            </SpCell>
            {goodType !== "cross" && pointInfo.is_open_deduct_point && (
              <SpCell className="trade-sub-total__item" title="积分抵扣：">
                <Price unit="cent" value={total.point_fee} />
              </SpCell>
            )}
            <SpCell className="trade-sub-total__item" title="运费：">
              <Price unit="cent" value={total.freight_fee} />
             
              
            </SpCell>
            {goodType === "cross" && (
              <SpCell className="trade-sub-total__item" title="税费：">
                <Price unit="cent" value={total.total_tax} />
              </SpCell>
            )}
          </View>}


          {this.isPointitemGood() && <View className="sec trade-sub-total">
          
            <SpCell className="trade-sub-total__item" title="积分消费：">
              <Price className='order-item__price' appendText='积分' noSymbol noDecimal value={total.item_point}></Price> 
            </SpCell>
            <SpCell className="trade-sub-total__item" title="运费：">
              {total.freight_type==="point"?<Price className='order-item__price' appendText='积分' noSymbol noDecimal value={total.freight_fee} />:<Price unit="cent" value={total.freight_fee} />}
            </SpCell>
          </View>}

          {goodType === "cross" && (
            <View className="nationalNotice">
              <View className="title">
                关于跨境电子商务年度个人额度注意事项
              </View>
              <SpHtmlContent content={quota_tip} className="info" />
              <View className="copyLink" onClick={this.copyLink}>
                跨境电子商务年度个人额度查询 点我复制
              </View>
            </View>
          )}
        </ScrollView>

        <CheckoutItems
          isOpened={showCheckoutItems}
          list={curCheckoutItems}
          onClickBack={this.toggleCheckoutItems.bind(this, false)}
        />

        <View className="toolbar checkout-toolbar">
          <View className="checkout__total">
            共<Text className="total-items">{total.items_count}</Text>
            件商品　总计:
            {payType !== "point" && !this.isPointitemGood() ? (
              <Price primary unit="cent" value={total.total_fee} />
            ) : (
                total.point && (
                  <View class="last_price">
                    <Price className='order-item__price' appendText='积分' noSymbol noDecimal value={total.point} />
                    {!total.freight_fee==0 && total.freight_type==="cash" && this.isPointitemGood() && <Price unit="cent" plus value={total.freight_fee} className='order-item__plus'/>}
                  </View>
                )
              )}
          </View>
          <AtButton
            type="primary"
            className="btn-confirm-order"
            customStyle={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary}`}
            loading={submitLoading}
            disabled={isBtnDisabled}
            onClick={this.submitPay}
          >
            {isDrug ? "提交预约" : "提交订单"}
          </AtButton>
        </View>

        {/* {
          <DrugInfo
            isOpened={isDrugInfoOpend}
            info={drug}
            onClose={this.handleLayoutClose}
            onChange={this.handleChange}
          />
        } */}

        <PaymentPicker
          isOpened={isPaymentOpend}
          type={payType}
          isShowPoint={false}
          isShowBalance={goodType !== "cross"}
          isShowDelivery={false}
          disabledPayment={disabledPayment}
          onClose={this.handleLayoutClose}
          onChange={this.handlePaymentChange}
        ></PaymentPicker>
        {/* 积分使用 */}
        <PointUse
          isOpened={isPointOpen}
          type={payType}
          info={pointInfo}
          onClose={this.handleLayoutClose}
          onChange={this.handlePointUseChange}
        ></PointUse>

        <SpToast />
      </View>
    );
  }
}
