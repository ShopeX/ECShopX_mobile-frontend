import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { AtCountdown } from 'taro-ui'
import { calcTimer } from '@/utils'
import { QnImg } from '@/components'

import './goods-scroll.scss'

export default class WgtGoodsScroll extends Component {
  static options = {
    addGlobalClass: true,
    info: null
  }

  constructor (props) {
    super(props)

    this.state = {
      timer: null
    }
  }

  componentDidMount() {
    const { info } = this.props
    const { config } = info

    const timer = calcTimer(config.lastSeconds)
    this.setState({
      timer
    })
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
    const { timer } = this.state

    return (
      <View className={`wgt ${base.padded ? 'wgt__padded' : null}`}>
        {base.title && (
          <View className='wgt__header'>
            <View className='wgt__title'>
              <Text>{base.title}</Text>
              {
                config.type === 'goods'
                  ? <View className='wgt__subtitle'>{base.subtitle}</View>
                  : <AtCountdown
                      className='countdown__time'
                      isShowDay
                      day={timer.dd}
                      hours={timer.hh}
                      minutes={timer.mm}
                      seconds={timer.ss}
                    />
              }
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
            {
              data.map((item, idx) => {
                const price = ((item.act_price ? item.act_price : item.member_price ? item.member_price : item.price)/100).toFixed(2)
                const marketPrice = ((item.act_price ? item.price : item.member_price ? item.price : item.market_price)/100).toFixed(2)
                return (
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
    											<Text className='cur'>¥</Text>{price}
                          <Text className='market-price'>{marketPrice}</Text>
    										</View>
    								}
                  </View>
                )
              })
            }
          </ScrollView>
        </View>
      </View>
    )
  }
}
