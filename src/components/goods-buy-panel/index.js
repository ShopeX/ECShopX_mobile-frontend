import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, Button, ScrollView } from "@tarojs/components";
// import { AtButton } from 'taro-ui'
import { connect } from "@tarojs/redux";
// import { AtInputNumber } from 'taro-ui'
// import find from 'lodash/find'
import { Price } from "@/components";
import InputNumber from "@/components/input-number";
import { classNames, pickBy, log } from "@/utils";
import { Tracker } from "@/service";
import api from "@/api";
import { floor } from "lodash";
import entry from '@/utils/entry'
import {
  customName
} from '@/utils/point';
import "./index.scss";

@connect(({ colors }) => ({
  colors: colors.current
}))
export default class GoodsBuyPanel extends Component {
  static options = {
    addGlobalClass: true
  };

  static defaultProps = {
    info: null,
    isOpened: false,
    type: "fastbuy",
    orderType: "normal",
    fastBuyText: "立即购买",
    busy: false,
    onClose: () => {},
    onChange: () => {},
    onClickAddCart: () => {},
    onClickFastBuy: () => {},
    onSubmit: () => {},
    isPointitem:false
  };

  constructor(props) {
    super(props);

    this.state = {
      // marketing: 'normal',
      selection: [],
      selectionText:[],
      promotions: [],
      activity: null,
      curSku: null,
      curImg: null,
      curPoint:null,
      curLimit: false,
      quantity: 1,
      isActive: props.isOpened,
      colorStyle: "",
    };

    this.disabledSet = new Set();
  }

  componentDidMount() {
    const { info } = this.props;
    const {
      spec_items,
      promotion_activity,
      activity_info = null,
      activity_type
    } = info;

    if (promotion_activity) {
      const promotions = pickBy(promotion_activity, {
        condition_rules: "condition_rules",
        promotion_tag: "promotion_tag",
        items: "items"
      });
      this.setState({
        promotions
      });
    }

    if (activity_info && activity_type === "limited_buy") {
      const activity = pickBy([activity_info], {
        items: "items",
        rule: "rule"
      });
      this.setState({
        activity: activity[0]
      });
    }

    const marketing = info.activity_type ? info.activity_type : "normal";

    const skuDict = {};
    const originSpecIds = info.item_spec_desc.map(item => item.spec_id)
    const newSpceItems = spec_items.sort((a, b) => {
      const first = a.item_spec[0].spec_value_id
      const second = b.item_spec[0].spec_value_id
      return first - second
    })
    newSpceItems.forEach(t => {
      const specValueId =  t.item_spec.map(s => s.spec_value_id)
      const specIds = t.item_spec.map(s => s.spec_id);
      const propsText = t.item_spec.map(s => s.spec_value_name).join(" ");
      if (specIds.join('') !== originSpecIds.join('')) {
        specValueId.reverse()
      }
      const key = specValueId.join("_");
      t.propsText = propsText;
      skuDict[key] = t;
    });
    const selection = Array(info.item_spec_desc.length).fill(null);
    const selectionText = Array(info.item_spec_desc.length).fill(null);
    this.skuDict = skuDict;
    this.setState({
      // marketing,
      selection,
      selectionText
    });

    if (!spec_items || !spec_items.length) {
      this.noSpecs = true;
    }
    this.initSelect()
  }

  componentWillReceiveProps(nextProps) {
    const { isOpened } = nextProps;
    if (isOpened !== this.state.isActive) {
      this.setState({
        isActive: isOpened
      });
    }
  }

  getSkuProps = () => {
    const { info } = this.props;
    if (!info) return null;

    const { curSku } = this.state;
    let propsText = "";

    if (this.noSpecs) {
      return null;
    }

    if (!curSku) {
      return `请选择`;
    }

    propsText = curSku.propsText;
    return `已选 “${propsText}”`;
  };

  calcDisabled(selection) {
    const skuDict = this.skuDict;
    const disabledSet = new Set();
    const makeReg = (sel, row, val) => {
      const tSel = sel.slice();
      const regStr = tSel
        .map((s, idx) => (row === idx ? val : !s ? "(\\d+)" : s))
        .join("_");

      return new RegExp(regStr);
    };

    const isNotDisabled = (sel, row, val) => {
      const reg = makeReg(sel, row, val);
      return Object.keys(skuDict).some(key => {
        return key.match(reg) && skuDict[key].store > 0;
      });
    };

    const { info } = this.props;
    for (let i = 0, l = info.item_spec_desc.length; i < l; i++) {
      const { spec_values } = info.item_spec_desc[i];
      for (let j = 0, k = spec_values.length; j < k; j++) {
        const id = spec_values[j].spec_value_id;
        if (!disabledSet.has(id) && !isNotDisabled(selection, i, id)) {
          disabledSet.add(id);
        }
      }
    }

    this.disabledSet = disabledSet;
  }

  getCurSkuImg(sku) {
    let img = this.props.info.pics[0];
    if (!sku) {
      return img;
    }

    sku.item_spec.some(s => {
      if (s.spec_image_url) {
        img = s.spec_image_url;
        return true;
      }
    });
    return img;
  }

  updateCurSku(selection) {
    console.log("----updateCurSku---",selection)
    const { info } = this.props;
    const { activity } = this.state;
    const { activity_type } = info;

    selection = selection || this.state.selection;
    this.calcDisabled(selection);
    if (selection.some(s => !s)) {
      this.setState({
        curSku: null,
        curImg: null
      });
      this.props.onChange(null);
      return;
    }

    const curSku = this.skuDict[selection.join("_")];
    const curImg = this.getCurSkuImg(curSku);

    this.setState({
      curSku,
      curImg
    });

    console.log("----curSku---",curSku)

    if (activity && info.activity_type === "limited_buy") {
      const validItem = activity.items.find(n => n.item_id === curSku.item_id);
      this.setState({
        curLimit: validItem ? true : false
      });
    }

    this.props.onChange(curSku);
    log.debug("[goods-buy-panel] updateCurSku: ", curSku);
  }

  handleImgClick = () => {
    const { curSku, info } = this.state;
    if (!curSku) return;

    const { item_spec } = curSku;
    const { item_image_url, spec_image_url } = item_spec[0];
    const { pics } = info;

    let imgs = [];
    if (item_image_url.length || spec_image_url) {
      imgs = item_image_url.length > 0 ? item_image_url : [spec_image_url];
    } else {
      imgs = pics;
    }

    Taro.previewImage({
      urls: imgs
    });
  };

  handleQuantityChange = val => {
    this.setState({
      quantity: val
    });
  };

  handleSelectSku = (item, idx,spec_name) => {
    const {spec_value_name,spec_custom_value_name}=item;
    const spec_full_text=`${spec_name}:${spec_value_name||spec_custom_value_name}`
  
    if (this.disabledSet.has(item.spec_value_id)) return;

    const { selection,selectionText } = this.state;
    if (selection[idx] === item.spec_value_id) {
      selection[idx] = null;
      selectionText[idx] = null;
    } else {
      selection[idx] = item.spec_value_id;
      selectionText[idx] = spec_full_text;
    }

    console.log(selection, 254);
    console.log("---selectionText---", selectionText);

    this.updateCurSku(selection);
    this.setState({
      selection,
      selectionText
    });
  };

  toggleShow = isActive => {
    if (isActive === undefined) {
      isActive = !this.state.isActive;
    }

    this.setState({ isActive });
    this.props.onClose && this.props.onClose();
  };

  handleBuyClick = async (type, skuInfo, num) => {
    console.warn(this.props);
    if (this.state.busy) return;
    const isOpenStore = await entry.getStoreStatus()
    const { marketing, info ,isPointitem} = this.props;
    const { special_type } = info;
    const isDrug = special_type === "drug";
    const { item_id } = this.noSpecs ? info : skuInfo;
    const { distributor_id } = info;
    const curStore = Taro.getStorageSync('curStore');
    let id = isOpenStore ? curStore.store_id : distributor_id
    let url = `/pages/cart/espier-checkout`;

    this.setState({
      busy: true
    });

    if (type === "cart") {
      url = `/pages/cart/espier-index`;

      try {
        await api.cart.add({
          item_id,
          num,
          distributor_id:id,
          shop_type: isDrug ? "drug" : "distributor"
        });
        Taro.showToast({
          title: "成功加入购物车",
          icon: "success"
        });
      } catch (e) {
        console.log(e);
        this.setState({
          busy: false
        });
        return;
      }

      this.setState({
        busy: false
      })
      const {
        selectionText
      }=this.state;
   
      const sku_name=selectionText && Array.isArray(selectionText) && selectionText.length && selectionText.every(item=>item!==null) ? selectionText.join(',') : undefined;
      
      // 设置添加商品的类型，决定购物车展示的商品类型
      const cartType = info.type == '1' ? 'cross' : 'normal'
      Taro.setStorageSync( 'cartType', cartType )
      // 首次加入购物车  
      Tracker.dispatch("GOODS_ADD_TO_CART", {
        ...info,
        ...skuInfo,
        propsText:sku_name,
        goods_num: +num
      });
      this.props.onAddCart(item_id, num)
    }

    if (type === "fastbuy") {
      
      let pointitemUrlQuery=this.props.isPointitem?`shop_id=0`:`shop_id=${id}`
      url += `?cart_type=fastbuy&${pointitemUrlQuery}`;
      if (marketing === "group") {
        const { groups_activity_id } = info.activity_info;
        url += `&type=${marketing}&group_id=${groups_activity_id}`;
      } else if (marketing === "seckill" || marketing === "limited_time_sale") {
        const { seckill_id } = info.activity_info;
        const { ticket } = await api.item
          .seckillCheck({ item_id, seckill_id, num })
          .catch(res => {
            this.setState({
              busy: false
            });
          });
        url += `&type=${marketing}&seckill_id=${seckill_id}&ticket=${ticket}`;
      }

      if (info.type == '1') {
        url+= '&goodType=cross'
      }

      try {

        await api.cart.fastBuy({
          item_id,
          num,
          distributor_id:id,
        },isPointitem);
      } catch (e) {
        console.log(e);
        this.setState({
          busy: false
        });
        return;
      }

      this.setState({
        busy: false
      });

      this.props.onFastbuy(item_id, num);
      let pointitem=isPointitem?`&type=pointitem`:''
      Taro.navigateTo({
        url:`${url}${pointitem}`
      });
    }

    if (type === "pick") {
      const { info } = this.props;
      // console.log(skuInfo, info, 346)
      //info.checked_spec = skuInfo
      this.setState(
        {
          busy: false
        },
        () => {
          this.props.onClose();
          this.props.onSubmit(skuInfo);
        }
      );
    }
  };

  // 初始化多规格默认选项
  initSelect = () => {
    const { info } = this.props
    const { activity } = this.state
    const keyList = []
    if (this.skuDict) {
      for (let i in this.skuDict) {
        keyList.push(i)
      }
    }
    const last = keyList.length
    for (let i = 0; i < last; i++) {
      if (this.skuDict && this.skuDict[keyList[i]] && this.skuDict[keyList[i]].store > 0) {
        const selection = keyList[i].split('_')
        const curSku = this.skuDict[keyList[i]]
        this.calcDisabled([...selection])
        const curImg = this.getCurSkuImg(curSku)
        this.setState({
          curSku,
          curImg,
          selection
        })
        if (activity && info.activity_type === "limited_buy") {
          const validItem = activity.items.find(n => n.item_id === curSku.item_id)
          this.setState({
            curLimit: validItem ? true : false
          })
        }
    
        this.props.onChange(curSku)
        break
      }
    }
  }

  //获得最大购物数量
  getMaxNum=()=>{
    const { curSku }=this.state;
    const { info,marketing }=this.props;
    const curSkus = this.noSpecs ? info : curSku;  

    const maxStore = +( curSkus ? curSkus.store : info.store || 99999 ); 
    if(marketing==='group'){
      return 1;
    }else if(marketing==='seckill'){
      return curSkus?curSkus.limit_num:info.limit_num;
    }
    return maxStore;
  }

  render() {
    // packItem={packagePrices}
    //                 mainItem={mainPackagePrice}
    const {
      info,
      type,
      fastBuyText,
      colors,
      isPackage,
      packItem,
      mainpackItem,
      isPointitem
    } = this.props;
    const {
      curImg,
      quantity,
      selection,
      isActive,
      busy,
      curSku,
      promotions,
      activity,
      curLimit
    } = this.state;
    if ( !info ) {
      return null;
    }

    console.log("--info--",info)

    const { special_type } = info;
    const isDrug = special_type === "drug";
    const curSkus = this.noSpecs ? info : curSku; 
    const hasStore = curSkus ? curSkus.store > 0 : info.store > 0;

    let price = "",
      marketPrice = "",
      ruleDay = 0;
    if ( curSkus ) {
      price = curSkus.act_price
        ? curSkus.act_price
        : curSkus.member_price
          ? curSkus.member_price
          : curSkus.price;
      //marketPrice = curSkus.act_price || curSkus.member_price ? curSkus.member_price : curSkus.market_price
      marketPrice = curSkus.market_price;
      if ( info.activity_type === "limited_buy" ) {
        ruleDay = JSON.parse( activity.rule.day );
      }
    } else {
      price = info.act_price
        ? info.act_price
        : info.member_price
          ? info.member_price
          : info.price;
      //marketPrice = info.act_price || info.member_price ? info.member_price : info.market_price
      marketPrice = info.market_price;
    }

    if ( isPackage === "package" ) {
      price = info.price * 100;
      marketPrice = info.market_price * 100;
      if ( curSkus ) {
        console.log(
          curSkus.item_id,
          packItem[curSkus.item_id],
          mainpackItem[curSkus.item_id],
          394
        );
        price =
          ( packItem[curSkus.item_id] && packItem[curSkus.item_id].price ) ||
          ( mainpackItem[curSkus.item_id] &&
            mainpackItem[curSkus.item_id].price );
        marketPrice =
          ( packItem[curSkus.item_id] &&
            packItem[curSkus.item_id].market_price ) ||
          ( mainpackItem[curSkus.item_id] &&
            mainpackItem[curSkus.item_id].market_price );
      } else {
        price = info.price * 100;
        marketPrice = info.market_price * 100;
      }
    }

    const taxRate = info ? ( Number( info.cross_border_tax_rate || 0 ) / 100 ) : 0
    if ( info.type == '1' ) {
      price = floor(price * ( 1 + taxRate ))
      marketPrice = info.price
    } 
    
    return (
      <View
        className={classNames(
          "goods-buy-panel",
          isActive ? "goods-buy-panel__active" : null
        )}
      >
        <View className="goods-buy-panel__overlay"></View>

        <View className="goods-buy-panel__wrap">
          <View
            className="at-icon at-icon-close"
            onClick={() => this.toggleShow(false)}
          />
          <View className="goods-buy-panel__hd">
            <View
              className="goods-img__wrap"
              onClick={this.handleImgClick.bind(this)}
            >
              <Image
                className="goods-img"
                mode="aspectFill"
                src={curImg || info.pics[0]}
              />
            </View>
            {isPointitem && (
              <View className="goods-point">
                <View className="number">
                  {curSku ? curSku.point : info.point}
                </View>
                <View className="text">{customName("积分")}</View>
              </View>
            )}
            {!isPointitem && (
              <View className="goods-sku__price">
                <Price primary symbol="¥" unit="cent" value={price} />
                <View className="goods-sku__price-market">
                  {marketPrice !== 0 && marketPrice && (
                    <Price
                      className="price-market"
                      symbol="¥"
                      unit="cent"
                      lineThrough
                      value={marketPrice}
                    />
                  )}
                </View>
              </View>
            )}
            <View className="goods-sku__info">
              {this.noSpecs ? (
                <Text className="goods-sku__props">{info.item_name}</Text>
              ) : (
                <Text className="goods-sku__props">
                  <Text>
                    {curSkus ? `已选择 ${curSkus.propsText}` : "请选择规格"}
                  </Text>
                </Text>
              )}
              {curSku ? (
                <View className="goods-sku__limit">
                  {info.store_setting && (
                    <Text className="goods-sku__stock">
                      库存{curSku.store}
                      {info.unit}
                    </Text>
                  )}
                  {activity && curLimit ? (
                    <Text>
                      {ruleDay ? <Text>每{ruleDay}天</Text> : null}
                      <Text>限购{activity.rule.limit}件</Text>
                    </Text>
                  ) : null}
                </View>
              ) : (
                <View className="goods-sku__limit">
                  {info.store_setting && (
                    <Text className="goods-sku__stock">
                      库存：{info.store}
                      {info.unit}
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>
          {curSkus && promotions && promotions.length > 0 && (
            <View className="promotions">
              {promotions.map(
                item =>
                  item.items[curSkus.item_id] && (
                    <View
                      key={item.items[curSkus.item_id]}
                      className="promotions__item"
                    >
                      <Text className="promotions__item-tag">
                        {item.promotion_tag}
                      </Text>
                      <Text className="promotions__item-title">
                        {item.condition_rules}
                      </Text>
                    </View>
                  )
              )}
            </View>
          )}
          <View className="goods-buy-panel__bd">
            <ScrollView className="goods-skus__wrap">
              {info.item_spec_desc.map((spec, idx) => {
                return (
                  <View className="sku-item__group" key={spec.spec_id}>
                    {info.item_spec_desc.length > 1 && (
                      <Text className="sku-item__group-hd">
                        {spec.spec_name}
                      </Text>
                    )}
                    <View className="sku-item__group-bd">
                      {spec.spec_values.map(sku => {
                        return (
                          <Text
                            className={classNames("sku-item", {
                              "is-active": sku.spec_value_id === selection[idx],
                              "is-disabled": this.disabledSet.has(
                                sku.spec_value_id
                              )
                            })}
                            key={sku.spec_value_id}
                            onClick={this.handleSelectSku.bind(
                              this,
                              sku,
                              idx,
                              spec.spec_name
                            )}
                          >
                            {sku.spec_value_name}
                          </Text>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
            {type !== "pick" && isActive && (
              <View className="goods-quantity__wrap">
                <Text className="goods-quantity__hd"></Text>
                <View className="goods-quantity__bd">
                  <InputNumber
                    min={1}
                    max={this.getMaxNum()}
                    value={quantity}
                    onChange={this.handleQuantityChange.bind(this)}
                  />
                </View>
              </View>
            )}
          </View>
          <View className="goods-buy-panel__ft">
            <View className="goods-buy-panel__btns">
              {type === "cart" &&
                hasStore &&
                (!curSkus ||
                  (curSkus && curSkus.approve_status === "onsale")) && (
                  <View
                    onClick={this.handleBuyClick.bind(
                      this,
                      "cart",
                      curSkus,
                      quantity
                    )}
                  >
                    <Button
                      loading={busy}
                      className={classNames(
                        "goods-buy-panel__btn btn-add-cart",
                        {
                          "is-disabled": !curSkus
                        }
                      )}
                      style={`background: ${colors.data[0].accent}`}
                      disabled={Boolean(!curSkus)}
                    >
                      {isDrug ? "加入药品清单" : "加入购物车"}
                    </Button>
                  </View>
                )}
              {type === "fastbuy" &&
                hasStore &&
                (!curSkus ||
                  (curSkus && curSkus.approve_status === "onsale")) && (
                  <View
                    onClick={this.handleBuyClick.bind(
                      this,
                      "fastbuy",
                      curSkus,
                      quantity
                    )}
                  >
                    <Button
                      loading={busy}
                      className={classNames(
                        "goods-buy-panel__btn btn-fast-buy",
                        {
                          "is-disabled": !curSkus
                        }
                      )}
                      style={`background: ${colors.data[0].primary}`}
                      disabled={Boolean(!curSkus)}
                    >
                      {fastBuyText}
                    </Button>
                  </View>
                )}
              {type === "pick" &&
                hasStore &&
                (!curSkus ||
                  (curSkus && curSkus.approve_status === "onsale")) && (
                  <Button
                    loading={busy}
                    className={classNames("goods-buy-panel__btn btn-fast-buy", {
                      "is-disabled": !curSkus
                    })}
                    style={`background: ${colors.data[0].primary}`}
                    onClick={this.handleBuyClick.bind(
                      this,
                      "pick",
                      curSkus,
                      quantity
                    )}
                    disabled={Boolean(!curSkus)}
                  >
                    确定
                  </Button>
                )}
              {!hasStore && (
                <Button disabled className="goods-buy-panel__btn btn-fast-buy">
                  当前商品无货
                </Button>
              )}
              {curSkus && curSkus.approve_status !== "onsale" && (
                <Button disabled className="goods-buy-panel__btn btn-fast-buy">
                  暂不可售
                </Button>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  } 
}
