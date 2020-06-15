import Taro, { Component } from '@tarojs/taro'
import {View, Text, Image, Button} from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { isObject, classNames } from '@/utils'
import api from '@/api'

import './goods-item.scss'

export default class DistributionGoodsItem extends Component {
  static defaultProps = {
    onClick: () => {},
    onShare: () => {}
  }

  static options = {
    addGlobalClass: true
  }

  render () {
    const { info, onClick, className, isRelease, status } = this.props
    if (!info) {
      return null
    }

    const img = info.img || info.image_default_id

    return (
      <View className={classNames('goods-item', className)}>
        <View className='goods-item__bd'>
          <View className='goods-item__img-wrap'>
            <Image className='goods-item__img'
              mode='aspectFix'
              src={img}
            />
          </View>
          <View className='goods-item__cont'>
            <View>
              <View className='goods-item__title'>{info.title}</View>
              <View className='goods-item__price'><Text className="cur">¥</Text>{info.price}</View>
              <View className='goods-item__promoter-price'>预计收益：<Text className="cur">¥</Text>{info.promoter_price}</View>
            </View>
            <View className='goods-item__extra'>
              <View className='goods-item__author'>
                {
                  status === 'true' &&
                    <View className={classNames('goods-item__release-btn', isRelease ? 'released' : null)} onClick={onClick}>
                      {
                        isRelease
                          ? <Text>从小店下架</Text>
                          : <Text>上架到小店</Text>
                      }
                    </View>
                }
              </View>
              <View className='goods-item__actions'>
                <Button
                  className='goods-item__share-btn'
                  dataInfo={info}
                  openType='share'
                  size="small"
                >
                  <Text class="icon-share2"></Text>
                </Button>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
