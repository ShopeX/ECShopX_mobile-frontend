import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { ScrollView, View, Text } from '@tarojs/components'
import { SpImage, SpPrice } from '@/components'
import './index.scss'
import { AtInput, AtButton, AtProgress, AtIcon } from 'taro-ui'
import { classNames, JumpStoreIndex, JumpGoodDetail } from '@/utils'

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
