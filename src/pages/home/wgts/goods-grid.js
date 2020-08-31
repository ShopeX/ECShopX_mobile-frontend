import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { QnImg } from '@/components'
import { classNames } from '@/utils'
import { linkPage } from './helper'
import './goods-grid.scss'

export default class WgtGoodsGrid extends Component {
  static options = {
    addGlobalClass: true
  }

  navigateTo (url) {
    Taro.navigateTo({ url })
  }

  handleClickItem = (item) => {
    const url = `/pages/item/espier-detail?id=${item.item_id}&dtid=${item.distributor_id}`
    Taro.navigateTo({
      url
    })
  }

  handleClickMore = () => {
    const { moreLink } = this.props.info.config
    if (moreLink) {
      linkPage(moreLink.linkPage, moreLink.id)
    } else {
      this.navigateTo(`/pages/item/list?dis_id=${this.props.dis_id || ''}`)
    }
  }

  render () {
    const { info, dis_id = '' } = this.props
    console.log(dis_id)
    if (!info) {
      return null
    }

    const { base, data, config } = info
    console.log(info, 31)
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
      <View className={`wgt wgt-grid ${base.padded ? 'wgt__padded' : null}`}>
        {base.title && (
          <View className='wgt__header'>
            <View className='wgt__title'>
              <Text>{base.title}</Text>
              <View className='wgt__subtitle'>{base.subtitle}</View>
            </View>
            <View
              className='wgt__more'
              onClick={this.handleClickMore}
            >
              <View className='three-dot'></View>
            </View>
            {/* <View
              className='wgt__goods__more'
              onClick={this.navigateTo.bind(this, `/pages/item/list?dis_id=${dis_id}`)}
            >
              <View className='all-goods'>全部商品{dis_id}</View>
            </View> */}
          </View>
        )}
        <View className='wgt__body with-padding'>
          <View className='grid-goods out-padding grid-goods__type-grid'>
            {
              data.map((item, idx) => {
                const price = ((item.act_price ? item.act_price : item.member_price ? item.member_price : item.price)/100).toFixed(2)
                //const marketPrice = ((item.act_price ? item.price : item.member_price ? item.price : item.market_price)/100).toFixed(2)
                const marketPrice = ((item.market_price)/100).toFixed(2)
                return (
                  <View
                    key={`${idx}1`}
                    className={classNames('grid-item',{'grid-item-three': config.style=='grids'})}
                    onClick={this.navigateTo.bind(this, `/pages/item/espier-detail?id=${item.goodsId}&dtid=${item.distributor_id}`)}
                  >
                    <View className='goods-wrap'>
                      <View className='thumbnail'>
                        <QnImg
                          img-class='goods-img'
                          src={item.imgUrl}
                          mode='aspectFill'
                          width='400'
                          lazyLoad
                        />
                      </View>
                      <View className='caption'>
                        {config.brand && item.brand && (
                          <QnImg
                            img-class='goods-brand'
                            src={item.brand}
                            mode='aspectFill'
                            width='300'
                          />
                        )}
                        <View className={`goods-title ${!config.brand || !item.brand ? 'no-brand' : ''}`}>{item.title}</View>
                        {item.brief && <View className={`goods-brief ${!config.brand || !item.brand ? 'no-brand' : ''}`}>{item.brief}</View>}
                        {
                          config.showPrice
                          && <View className='goods-price'>
                              <Text className='cur'>¥</Text>{price}
                              {
                                marketPrice != 0 &&
                                <Text className='market-price'>{marketPrice}</Text>
                              }
                            </View>
                        }
                      </View>
                    </View>
                  </View>
                )
              })
            }
          </View>
        </View>
      </View>
    )
  }
}
