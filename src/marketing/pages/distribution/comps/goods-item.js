/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2022-02-28 00:39:48
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2022-11-02 19:30:26
 * @FilePath: /ecshopxx-vshop/src/marketing/pages/distribution/comps/goods-item.js
 * @Description: 
 * 
 * Copyright (c) 2022 by wangzhanyuan dreamworks.cnn@gmail.com, All Rights Reserved. 
 */
import React, { Component } from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
// import { AtButton } from 'taro-ui'
import { classNames } from '@/utils'
import Taro from '@tarojs/taro'
// import api from '@/api'

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
    const { info, onClick, className, isRelease, status, shareDataChange } = this.props
    console.log('DistributionGoodsItem', this.props)
    if (!info) {
      return null
    }

    const img = info.img || info.image_default_id
    console.log('DistributionGoodsItem:info', info)
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
              <View className='goods-item__promoter-price'>
                预计收益：
                {info.commission_type === 'money' ? (
                  <Text className='cur'>¥{info.promoter_price}</Text>
                ) : (
                  <Text className='cur'>{info.promoter_point} 积分</Text>
                )}
              </View>
            </View>
            <View className='goods-item__extra'>
              <View className='goods-item__author'>
                {status === 'true' && (
                  <View
                    className={classNames('goods-item__release-btn', isRelease ? 'released' : null)}
                    onClick={onClick}
                  >
                    {isRelease ? <Text>从小店下架</Text> : <Text>上架到小店</Text>}
                  </View>
                )}
              </View>
              <View className='goods-item__actions'>
                <Button
                  className='goods-item__share-btn'
                  dataInfo={info}
                  openType='share'
                  onClick={()=>Taro.setStorageSync('shareData',info)}
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
