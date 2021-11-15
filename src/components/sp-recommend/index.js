import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { SpGoodsItem, SpImage } from '@/components'
import { classNames } from '@/utils'
import './index.scss'

export default class SpRecommend extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: []
  }

  render() {
    const { info, className } = this.props
    const leftList = info.filter((item, index) => {
      if (index % 2 == 0) {
        return item
      }
    })
    const rightList = info.filter((item, index) => {
      if (index % 2 == 1) {
        return item
      }
    })
    return (
      <View className={classNames('sp-recommend', className)}>
        <View className='sp-recommend-hd'>
          <SpImage className='recommend-icon' src='like_list.png' width='200' />
        </View>
        <View className='sp-recommend-bd'>
          <View className='left-container'>
            {leftList.map((goods, index) => (
              <View className='goods-item-wrap' key={`goods-item-wrap__${index}`}>
                <SpGoodsItem info={goods} />
              </View>
            ))}
          </View>
          <View className='rigth-container'>
            {rightList.map((goods, index) => (
              <View className='goods-item-wrap' key={`goods-item-wrap__${index}`}>
                <SpGoodsItem info={goods} />
              </View>
            ))}
          </View>
        </View>
      </View>
    )
  }
}
