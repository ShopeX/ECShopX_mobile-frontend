import React, { useEffect } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { SpPrice } from '@/components'
import { useSelector } from 'react-redux'

import './comp-orderitem.scss'

const statusList = [{ name: '已支付', status: 0, fontColor: '#4da915', backgroundColor: '#e1fff3' }]

function CompOrderItem(props) {
  const { info, renderFooter = null, showActions = true, onEditClick = () => {} } = props
  const { colorPrimary } = useSelector((state) => state.sys)

  useEffect(() => {}, [])

  return (
    <View className='comp-order-item'>
      <View className='comp-order-item-timer'>请在000000</View>
      <View className='comp-order-item-hd'>
        <View className='hd-time'>
          <View className='group'>
            <Text>跟团号：</Text>
            <Text className='num'>10</Text>
          </View>
          <View className='date'>2022/04/21 22:33</View>
        </View>
        {statusList.map((item) => (
          <View
            className='hd-status'
            key={item.status}
            style={{ color: item.fontColor, backgroundColor: item.backgroundColor }}
          >
            {item.name}
          </View>
        ))}
      </View>
      <View className='comp-order-item-content'>
        <View className='comp-order-item-title'>
          <View className='left'>
            <Image
              src='https://preissue-b-img-cdn.yuanyuanke.cn/image/42/2022/01/12/16c76febe685d4249e419259ad979f9bxZsiiZARkIXx70VrEOdbVANzU96nH7hU'
              className='img'
            ></Image>
          </View>
          <View className='right'>
            <View className='text'>活动名称</View>
            <Text className='iconfont icon-qianwang-01' />
          </View>
        </View>
        <View className='comp-order-item-goods'>
          <View className='left'>
            <ScrollView className='scroll-goods' scrollX>
              <View className='scroll-item'>
                <View className='thumbnail'>
                  <Image
                    src='https://preissue-b-img-cdn.yuanyuanke.cn/image/42/2022/01/12/16c76febe685d4249e419259ad979f9bxZsiiZARkIXx70VrEOdbVANzU96nH7hU'
                    className='goods-img'
                    lazyLoad
                  />
                  <View className='img-desc'>商品已核销</View>
                </View>
                <View className='describe'>商品描述啊啊啊啊啊啊</View>
                <View className='size'>+11件</View>
              </View>
            </ScrollView>
          </View>
          <View className='right'>
            <SpPrice className='sale-price' value={0.03} />
            <View className='desc'>共5件</View>
          </View>
        </View>
        <View className='comp-order-item-info'>
          <View className='ziti-title'>顾客自提</View>
          <View className='ziti-box'>
            <View className='ziti-label'>
              <Text className='iconfont icon-dizhi-01' />
              <Text className='desc'>自提点：</Text>
              <Text className='desc'>嘻嘻嘻谢谢</Text>
            </View>
            <View className='ziti-address'>
              <Text>详细地址写在这里啊</Text>
              <Text className='iconfont icon-dizhi-01 address-icon' />
            </View>
          </View>
          <View className='ziti-info'>
            <View className='ziti-label'>
              <Text className='iconfont icon-dizhi-01' />
              <Text className='desc'>XXXXX</Text>
              <Text className='desc ml'>186738383933</Text>
            </View>
            <View className='ziti-address'>详细地址写在这里啊</View>
            <View className='ziti-address'>楼号(如10)</View>
            <View className='ziti-address'>房号(如101)</View>
            <View className='ziti-address'>多少弄：</View>
          </View>
          <View className='ziti-tuan'>
            <View className='ziti-label'>
              <Text className='iconfont icon-dizhi-01' />
              <Text className='desc'>团员备注：</Text>
              <Text className='desc'>暂无</Text>
              <Text onClick={onEditClick} className='iconfont icon-edit address-icon' />
            </View>
          </View>
        </View>
      </View>
      {renderFooter && <View className='comp-order-item-footer'>{renderFooter}</View>}
      <View className='comp-order-item-record'>
        <View className='money'>已退0.01</View>
        <View className='iconfont icon-qianwang-01' />
      </View>
    </View>
  )
}

export default CompOrderItem
