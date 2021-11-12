import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { SpImg, SpPoint, SpPrice } from '@/components'
import api from '@/api'
import { connect } from '@tarojs/redux'

import { isObject, classNames } from '@/utils'
import { PROMOTION_TAG } from '@/consts'

import './index.scss'

export default class SpGoodsItem extends Component {
  static defaultProps = {
    onClick: () => {},
    onStoreClick: () => {},
    showMarketPrice: true,
    showFav: true,
    showSku: false,
    noCurSymbol: false,
    type: 'item',
    isPointitem: false
  }

  static options = {
    addGlobalClass: true
  }

  handleFavClick = async () => {
    const { item_id, is_fav } = this.props.info
    if (!is_fav) {
      const favRes = await api.member.addFav(item_id)
      this.props.onAddFav(favRes)
    } else {
      await api.member.delFav(item_id)
      this.props.onDelFav(this.props.info)
    }
    Taro.showToast({
      title: is_fav ? '已移出收藏' : '已加入收藏',
      mask: true
    })
  }

  handleClick = () => {
    // const { item_id, distributor_id } = this.props.info;
    const { itemId, distributor_id } = this.props.info
    const url = `/pages/item/espier-detail?id=${itemId}&dtid=${distributor_id}`
    Taro.navigateTo({
      url
    })
  }

  render() {
    const {
      info,
      showMarketPrice,
      showFav,
      noCurSymbol,
      noCurDecimal,
      onClick,
      onStoreClick,
      appendText,
      className,
      isPointDraw,
      colors,
      type,
      isPointitem
    } = this.props
    // console.log('this.props',this.props)

    if (!info) {
      return null
    }

    const img = info.pics.length > 0 ? info.pics[0] : ''

    // let promotion_activity = null,
    //   act_price = null;
    // if (info.promotion_activity_tag && info.promotion_activity_tag.length > 1) {
    //   info.promotion_activity_tag.map(tag_item => {
    //     if (
    //       tag_item.tag_type === "single_group" ||
    //       tag_item.tag_type === "normal" ||
    //       tag_item.tag_type === "limited_time_sale"
    //     ) {
    //       promotion_activity = tag_item.tag_type;
    //       act_price = tag_item.activity_price;
    //       return;
    //     }
    //   });
    // } else if (
    //   info.promotion_activity_tag &&
    //   info.promotion_activity_tag.length === 1
    // ) {
    //   promotion_activity = info.promotion_activity_tag[0].tag_type;
    //   act_price = info.promotion_activity_tag[0].activity_price;
    // } else {
    //   promotion_activity = null;
    //   act_price = null;
    // }

    // act_price = (act_price / 100).toFixed(2);
    // let price = "",
    //   marketPrice = "";
    // if (isObject(info.price)) {
    //   price = info.price.total_price;
    // } else {
    //   price = Boolean(+act_price)
    //     ? act_price
    //     : Boolean(+info.member_price)
    //     ? info.member_price
    //     : info.price;
    //   marketPrice = info.market_price;
    // }

    // const isShow = info.store && info.store == 0;

    return (
      <View className={classNames('sp-goods-item')} onClick={this.handleClick.bind(this)}>
        <View className='goods-item__hd'>
          <SpImg img-class='order-item__img' src={img} mode='widthFix' width='300' />
        </View>
        <View className='goods-item__bd'>
          {/* 跨境商品 */}
          {info.type === '1' && (
            <View className='national-info'>
              <Image
                className='nationalFlag'
                src={info.origincountry_img_url}
                mode='aspectFill'
                lazyLoad
              />
              <Text className='nationalTitle'>{info.origincountry_name}</Text>
            </View>
          )}

          <View className='goods-info'>
            <View className='goods-title'>{info.itemName}</View>
            <View className='goods-desc'>{info.brief}</View>
          </View>

          <View className='bd-block'>
            <View className='bd-block-lf'>
              {/* 商品价格、积分 */}
              {info.is_point && (
                <View className='goods-price'>
                  <SpPoint value={info.point} />
                </View>
              )}

              {!info.is_point && (
                <View className='goods-price'>
                  <View className='gd-price'>
                    <SpPrice value={info.price / 1000}></SpPrice>
                  </View>
                  <View className='mk-price'>
                    <SpPrice lineThrough value={info.market_price / 1000}></SpPrice>
                  </View>
                </View>
              )}
            </View>
            <View className='bd-block-rg'>
              <Text className='iconfont icon-shoucang-01'></Text>
            </View>
          </View>

          {/* 促销活动标签 */}
          {info.promotion_activity && info.promotion_activity.length > 0 && (
            <View className='promotions'>
              {info.promotion_activity.map((item, index) => (
                <Text className='promotion-tag' key={`promotion-tag__${index}`}>
                  {PROMOTION_TAG[item.tag_type]}
                </Text>
              ))}
            </View>
          )}
        </View>
        <View className='goods-item__ft'>{this.props.renderFooter}</View>
      </View>
    )
  }
}
