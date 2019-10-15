import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { QnImg } from '@/components'

import './goods-scroll.scss'

export default class WgtGoodsScroll extends Component {
  static options = {
    addGlobalClass: true,
    info: null
  }

  navigateTo (url) {
    Taro.navigateTo({ url })
  }

  navigateToList = (type, seckillId) => {
    if(type === 'goods') {
      this.navigateTo('/pages/item/list')
    } else if (type === 'limitTimeSale') {
      Taro.navigateTo({
        url: `/pages/item/seckill-goods-list?seckill_type=limited_time_sale&seckill_id=${seckillId}`
      })
    } else {
      Taro.navigateTo({
        url: `/pages/item/seckill-goods-list?seckill_type=normal&seckill_id=${seckillId}`
      })     
    }
  }

  render () {
    const { info } = this.props
    if (!info) {
      return null
    }

    const { base, data, config } = info

    return (
      <View className={`wgt ${base.padded ? 'wgt__padded' : null}`}>
        {base.title && (
          <View className='wgt__header'>
            <View className='wgt__title'>
              <Text>{base.title}</Text>
              <View className='wgt__subtitle'>{base.subtitle}</View>
            </View>
            <View
              className='wgt__more'
              onClick={this.navigateToList.bind(this, config.type, config.seckillId)}
            >
              <View className='three-dot'></View>
            </View>
          </View>
        )}
        <View className='wgt-body'>
          <ScrollView
            className='scroll-goods'
            scrollX
          >
            {data.map((item, idx) => (
              <View
                key={idx}
                className='scroll-item'
                onClick={this.navigateTo.bind(this, `/pages/item/espier-detail?id=${item.goodsId}`)}
              >
                {config.leaderboard && (
                  <View className='subscript'>
                    <View className='subscript-text'>NO.{idx + 1}</View>
                    <Image className='subscript-img' src='/assets/imgs/paihang.png' />
                  </View>
                )}
                <View className='thumbnail'>
                  <QnImg
                    img-class='goods-img'
                    src={item.imgUrl}
                    mode='aspectFill'
                    width='240'
                    lazyLoad
                  />
								</View>
								{
									config.showPrice
									&& <View className='goods-price'>
											<Text className='cur'>¥</Text>{item.price ? item.price/100 : '0.00'}
										</View>
								}
              </View>
            ))}
          </ScrollView>
        </View>
    </View>
    )
  }
}
