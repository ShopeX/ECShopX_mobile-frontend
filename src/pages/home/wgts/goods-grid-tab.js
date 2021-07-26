
import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtTabslist, SpImg } from '@/components'
import { connect } from '@tarojs/redux'
import { getDistributorId } from "@/utils/helper";
import { classNames } from '@/utils'
import { linkPage } from './helper'

import './goods-grid-tab.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
export default class WgtGoodsGridTab extends Component {
  static options = {
    addGlobalClass: true
  };

  static defaultProps = {
    info: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      goodsList: [],
      moreLink: {}
    };
  }

  componentDidMount() {
    const { info = {} } = this.props;
    let { current } = this.state;
    this.setState({
      goodsList: info.list[current] ? info.list[current].goodsList : [],
      moreLink: info.config.moreLink
    });
  }

  componentWillReceiveProps( nextProps ) {
    const { info = {} } = nextProps;
    let { current } = this.state;
    this.setState({
      goodsList: info.list[current] ? info.list[current].goodsList : [],
      moreLink: info.config.moreLink
    });
  }

  handleClick(value) {
    const { info } = this.props;
    this.setState({
      goodsList: info.list[value].goodsList
    });
  }

  handleClickMore = () => {
    const { moreLink } = this.props.info.config;
    if (moreLink) {
      linkPage(moreLink.linkPage, moreLink);
    } else {
      this.navigateTo(`/pages/item/list?dis_id=${this.props.dis_id || ""}`);
    }
  };
  // navigateTo(url) {
  //   Taro.navigateTo({ url });
  // }

  handleClickItem(item) {
    const { distributor_id } = item;
    const dtid = distributor_id ? distributor_id : getDistributorId();
    Taro.navigateTo({
      url: `/pages/item/espier-detail?id=${item.goodsId}&dtid=${dtid}`,
    });
  }
  
  render() {
    const { info, colors } = this.props;
    if (!info) {
      return null;
    }
    const { config, base } = info;
    const { goodsList, moreLink } = this.state; 
    return (
      <View className={`wgt wgt-grid ${base.padded ? "wgt__padded" : null}`}>
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
            {/* <View
                      className='wgt__goods__more'
                      onClick={this.navigateTo.bind(this, `/pages/item/list?dis_id=${dis_id}`)}
                    >
                      <View className='all-goods'>全部商品{dis_id}</View>
                    </View> */}
          </View>
        )}
        <AtTabslist
          tabList={info.list}
          onClick={this.handleClick.bind(this)}
        ></AtTabslist>

        <View className="wgt__body with-padding">
          <View className="grid-goods out-padding grid-goods__type-grid">
            {goodsList.map((item, idx) => {
              const price = (
                (item.act_price
                  ? item.act_price
                  : item.member_price
                  ? item.member_price
                  : item.price) / 100
              ).toFixed(2);
              //const marketPrice = ((item.act_price ? item.price : item.member_price ? item.price : item.market_price)/100).toFixed(2)
              const marketPrice = ((item.market_price || 0) / 100).toFixed(2);
              return (
                <View
                  key={`${idx}1`}
                  className={classNames("grid-item", {
                    "grid-item-three": config && config.style == "grids"
                  })}
                  onClick={() => this.handleClickItem(item)}
                  data-id={item.goodsId}
                >
                  {/* {item.distributor_id} */}
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
                      {config && config.brand && item.brand && (
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
                      {item.promotionActivity &&
                        item.promotionActivity.length > 0 && (
                          <View className="activity-label">
                            {item.promotionActivity.map((s, index) => (
                              <Text key={index} className="text">
                                {s.tag_type == "single_group" ? "团购" : ""}
                                {s.tag_type == "full_minus" ? "满减" : ""}
                                {s.tag_type == "full_discount" ? "满折" : ""}
                                {s.tag_type == "full_gift" ? "满赠" : ""}
                                {s.tag_type == "normal" ? "秒杀" : ""}
                                {s.tag_type == "limited_time_sale"
                                  ? "限时特惠"
                                  : ""}
                                {s.tag_type == "plus_price_buy" ? "换购" : ""}
                              </Text>
                            ))}
                          </View>
                        )}
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
        {moreLink.id && (
          <View className="btn" onClick={this.handleClickMore}>
            <Text
              className="more"
              style={`border-color:${colors.data[0].primary};color:${colors.data[0].primary}`}
            >
              查看更多
            </Text>
          </View>
        )}
      </View>
    );
  }
}
