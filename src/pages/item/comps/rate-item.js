import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { classNames, formatTime } from '@/utils'

import './rate-item.scss'

export default class RateItem extends Component {
  static defaultProps = {
    info: null
  }

  render() {
    const { info, type } = this.props

    if (!info) {
      return null
    }

    return (
      <View className={classNames('rate-item', type ? `rate-item__type-${type}` : null)}>
        <View className='rate-item__hd'>
          <View className='rate-item__user'>
            <Text className='rate-item__user-name'>{info.user_name}</Text>
          </View>
          <Text className='rate-item__time'>{formatTime(info.reply_time * 1000)}</Text>
        </View>
        <View className='rate-item__bd'>
          <View className='rate-item__content'>
            {info.reply_content ? info.reply_content : '无评价'}
          </View>
          {info.rate_pic && info.rate_pic.length > 0 ? (
            <View className='rate-item__imgs'>
              {info.rate_pic.map((img, idx) => (
                <Image key={`${idx}1`} mode='aspectFill' className='rate-item__img' src={img} />
              ))}
            </View>
          ) : null}
        </View>
      </View>
    )
  }
}
