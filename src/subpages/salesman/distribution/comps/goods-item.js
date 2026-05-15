/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
// import { AtButton } from 'taro-ui'
import { withTranslation } from 'react-i18next'
import { $t } from '@/i18n'
import { classNames } from '@/utils'
// import api from '@/api'
import './goods-item.scss'

class DistributionGoodsItem extends Component {
  static defaultProps = {
    onClick: () => {},
    onShare: () => {}
  }

  static options = {
    addGlobalClass: true
  }

  render() {
    const {
      info,
      onClick,
      className,
      isRelease,
      status,
      shareDataChange,
      integral = false
    } = this.props
    if (!info) {
      return null
    }

    const img = info.img || info.image_default_id
    return (
      <View className={classNames('goods-item', className)}>
        <View className='goods-item__bd'>
          <View className='goods-item__img-wrap'>
            <Image className='goods-item__img' mode='aspectFix' src={img} />
          </View>
          <View className='goods-item__cont'>
            <View>
              <View className='goods-item__title'>{info.title}</View>
              <View className='goods-item__price'>
                <Text className='cur'>¥</Text>
                {info.price}
              </View>
              {integral ? (
                <View className='goods-item__promoter-price'>
                  {$t('0af7b49a.c1c74e')}
                  <Text className='cur'>
                    ¥{info.commission_type === 'money' ? info.promoter_price : '0.00'}
                  </Text>
                </View>
              ) : (
                <View className='goods-item__promoter-price'>
                  {$t('0af7b49a.c1c74e')}
                  {info.commission_type === 'money' ? (
                    <Text className='cur'>¥{info.promoter_price}</Text>
                  ) : (
                    <Text className='cur'>
                      {info.promoter_point} {$t('0af7b49a.9f68a8')}
                    </Text>
                  )}
                </View>
              )}
            </View>
            <View className='goods-item__extra'>
              <View className='goods-item__author'>
                {status === 'true' && (
                  <View
                    className={classNames('goods-item__release-btn', isRelease ? 'released' : null)}
                    onClick={onClick}
                  >
                    {isRelease ? (
                      <Text>{$t('0af7b49a.12910e')}</Text>
                    ) : (
                      <Text>{$t('0af7b49a.39177b')}</Text>
                    )}
                  </View>
                )}
              </View>
              <View className='goods-item__actions'>
                <Button
                  className='goods-item__share-btn'
                  data-info={info}
                  openType='share'
                  onClick={() => Taro.setStorageSync('shareData', info)}
                  size='small'
                >
                  <Text class='iconfont icon-share2'></Text>
                </Button>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default withTranslation()(DistributionGoodsItem)
