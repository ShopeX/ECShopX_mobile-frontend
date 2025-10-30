// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { ScrollView, View, Text } from '@tarojs/components'
import { classNames, JumpStoreIndex, JumpGoodDetail } from '@/utils'
import './index.scss'

function CompGroupNeighbour(props) {
  const { info } = props

  if (!info) {
    return null
  }
  const [isOpen, setIsOpen] = useState(false)

  const handleClickMore = () => {
    setIsOpen(!isOpen)
  }
  return (
    <View className='comp-group-neighbour'>
      <Text className='title'>支持配送的小区</Text>
      <View className='main'>
        <View className={classNames('comp-group-neighbour-contanier', isOpen ? 'open' : '')}>
          {info.map((item, index) => (
            <View className='comp-group-neighbour-item' key={index}>
              <View className='head'>
                <View className='head__l'>
                  {/* <Text className='icon iconfont icon-gouwuche'></Text> */}
                  <Text className='name'>{item.zitiName}</Text>
                </View>
                {/* <View className='head__r'>{item.distance}km</View> */}
              </View>
              <View className='ziti-item'>
                <View className='ziti-area'>{item.area}</View>
                <View className='ziti-address'>{item.address}</View>
              </View>
              {/* <View className='info'>
                    <View className='progress'>
                      <AtProgress
                        percent={(item.hasJoin / item.groupTotal) * 100}
                        color='#0bc262'
                        strokeWidth={8}
                        isHidePercent
                      ></AtProgress>
                    </View>
                    <Text>还差{item.lessJoin}件起送</Text>
                  </View> */}
            </View>
          ))}
        </View>

        {/* <View className='more' onClick={handleClickMore.bind(this)}>
          查看全部
          <Text className={classNames('icon-arrowDown iconfont icon', isOpen ? 'open' : '')}></Text>
        </View> */}
      </View>
    </View>
  )
}

CompGroupNeighbour.options = {
  addGlobalClass: true
}

export default CompGroupNeighbour
