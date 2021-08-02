import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { SpImg } from "@/components";
import { classNames } from "@/utils";
import { linkPage } from "./helper";
import { Tracker } from "@/service";
import { withLoadMore } from '@/hocs';
import "./goods-grid.scss";

@withLoadMore
export default class WgtGoodsGrid extends Component {
  static options = {
    addGlobalClass: true
  };

  componentDidMount() {
    this.startTrack(); 
  }

  navigateTo(url, item) {
    Taro.navigateTo({ url });
    if (item) {
      // 商品卡触发
      Tracker.dispatch("TRIGGER_SKU_COMPONENT", item);
    }
  }

  handleClickMore = () => {
    const { moreLink } = this.props.info.config;
    if (moreLink) {
      linkPage(moreLink.linkPage, moreLink);
    } else {
      this.navigateTo(`/pages/item/list?dis_id=${this.props.dis_id || ""}`);
    }
  };

  startTrack() {
    this.endTrack();
    const observer = Taro.createIntersectionObserver(this.$scope, {
      observeAll: true
    });
    observer.relativeToViewport({ bottom: 0 }).observe(".grid-item", res => { 
      if (res.intersectionRatio > 0) {
        const { id } = res.dataset;
        const { data } = this.state.info;
        const curGoods = data.find(item => item.goodsId == id);
        Tracker.dispatch("EXPOSE_SKU_COMPONENT", curGoods);
      }
    });

    this.observe = observer;
  }  

  endTrack() {
    if (this.observer) {
      this.observer.disconnect();
      this.observe = null;
    }
  }

  render() {
    const { info, dis_id = '' } = this.props    
    if (!info) {
      return null;
    }

    const { base, data, config } = info;
    /*let listData = []
    data.map(item => {
      listData.push({
        title: item.title,
        desc: item.desc,
        img: item.imgUrl,
        is_fav: item.is_fav,
        item_id: item.goodsId,
      })
    })*/

    return (
      <View className={`wgt wgt-grid ${base.padded ? "wgt__padded" : null}`}>
        {base.title && (
          <View className="wgt__header">
            <View className="wgt__title">
              <Text>{base.title}</Text>
              <View className="wgt__subtitle">{base.subtitle}</View>
            </View>
            <View className="wgt__more" onClick={this.handleClickMore}>
              <View className="three-dot"></View>
            </View>
            {/* <View
              className='wgt__goods__more'
              onClick={this.navigateTo.bind(this, `/pages/item/list?dis_id=${dis_id}`)}
            >
              <View className='all-goods'>全部商品{dis_id}</View>
            </View> */}
          </View>
        )}
        <View className="wgt__body with-padding">
          <View className="grid-goods out-padding grid-goods__type-grid">
            {data.map((item, idx) => {
              const price = (
                (item.act_price
                  ? item.act_price
                  : item.member_price
                  ? item.member_price
                  : item.price) / 100
              ).toFixed(2);
              //const marketPrice = ((item.act_price ? item.price : item.member_price ? item.price : item.market_price)/100).toFixed(2)
              const marketPrice = (item.market_price / 100).toFixed(2);
              return (
                <View
                  key={`${idx}1`}
                  className={classNames("grid-item", {
                    "grid-item-three": config.style == "grids",
                    "lastItem":idx===data.length-1
                  })}
                  onClick={this.navigateTo.bind(
                    this,
                    `/pages/item/espier-detail?id=${item.goodsId}&dtid=${item.distributor_id}`,
                    item
                  )}
                  data-id={item.goodsId}
                >
                  <View className="goods-wrap">
                    <View className="thumbnail">
                      <SpImg
                        img-class="goods-img"
                        src={item.imgUrl}
                        mode="aspectFill"
                        width="400"
                        lazyLoad
                      />
                    </View>
                    <View className="caption">
                      {config.brand && item.brand && (
                        <SpImg
                          img-class="goods-brand"
                          src={item.brand}
                          mode="aspectFill"
                          width="300"
                        />
                      )}
                      {item.type === "1" && (
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
                      {item.promotionActivity && item.promotionActivity.length > 0 && <View className="activity-label">
                          {item.promotionActivity.map((s, index) => (
                            <Text key={index} className="text">
                              {s.tag_type == 'single_group' ? '团购' : ''}
                              {s.tag_type == 'full_minus' ? '满减' : ''}
                              {s.tag_type == 'full_discount' ? '满折' : ''}
                              {s.tag_type == 'full_gift' ? '满赠' : ''}
                              {s.tag_type == 'normal' ? '秒杀' : ''}
                              {s.tag_type == 'limited_time_sale' ? '限时特惠' : ''}
                              {s.tag_type == 'plus_price_buy' ? '换购' : ''}
                            </Text>
                          ))}</View>}
                      <View
                        className={`goods-title ${
                          !config.brand || !item.brand ? "no-brand" : ""
                        }`}
                      >
                        {item.title}
                      </View>
                      {item.brief && (
                        <View
                          className={`goods-brief ${
                            !config.brand || !item.brand ? "no-brand" : ""
                          }`}
                        >
                          {item.brief}
                        </View>
                      )}
                      {config.showPrice && (
                        <View className="goods-price">
                          <Text className="cur">¥</Text>
                          {price}
                          {marketPrice && marketPrice != 0 && (
                            <Text className="market-price">{marketPrice}</Text>
                          )}
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  }
}
