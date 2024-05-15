import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { Text, View } from '@tarojs/components'
import { classNames, validate, showToast } from '@/utils'
import { SpImage, SpPage,SpTime } from '@/components'
import CompTabbar from './comps/comp-tabbar'
import { useImmer } from 'use-immer'
import api from '@/api'
import S from '@/spx'
import './index.scss'

const initialConfigState = {
  funcList: [
    { name: '订单管理', icon: 'icon-dingdanguanli', path: '/subpages/salesman/selectCustomer' },
    { name: '代客下单', icon: 'icon-daikexiadan', path: '/subpages/salesman/selectCustomer' },
    {
      name: '业务员推广',
      icon: 'icon-yewuyuantuiguang',
      path: '/subpages/salesman/selectCustomer'
    },
    { name: '商家列表', icon: 'icon-shangjialiebiao', path: '/subpages/salesman/selectCustomer' }
  ]
}

const Index = () => {
  const [data, setData] = useImmer(initialConfigState)

  const handleCardClick = () => {
    Taro.navigateTo({
      url: `/subpages/salesman/card`
    })
  }

  const handleFuncClick = (path) => {
    Taro.navigateTo({
      url: path
    })
  }

  const onTimeChange = (time) => {
    console.log(time)
  }

  return (
    <SpPage className={classNames('page-sales-index')} renderFooter={<CompTabbar />}>
      <View className='sales-back'></View>
      <View className='sales-header'>
        <View className='sales-header-left'>
          <Text className='iconfont icon-present sales-header-icon'></Text>
          <View className='sales-header-title'>业务员端</View>
        </View>
        <View className='sales-header-left rigth'>
          <Text className='iconfont icon-quanbu'></Text>
          <View className='sales-header-title' onClick={handleCardClick}>
            会员码
          </View>
        </View>
      </View>
      <View className='sales-content'>
        <View className='sales-content-panel'>
          <View className='sales-content-panel-item'>
            <View className='panel-header'>
              <Text className='iconfont icon-present panel-header-icon'></Text>
              <View className='panel-header-title'>实时概况</View>
            </View>
            <View className='panel-header'>
              <View className='panel-header-title'>全部配送店铺</View>
              <Text className='iconfont icon-xialajiantou'></Text>
            </View>
          </View>
          <SpTime onTimeChange={onTimeChange} />
          <View className='panel-content'>
            <View className='panel-content-top'>
              <View className='panel-content-top-title'>
                <View className='real-monet'>
                  <View className='panel-title  mb-0'>实付金额（元）</View>
                  <Text className='iconfont icon-xianshi View-icon'></Text>
                </View>

                <View className='look-detail'>查看数据总览&nbsp; &gt;</View>
              </View>
              <View className='panel-num mt-12'>9,999,999.88</View>
            </View>
            <View className='panel-content-btm'>
              <View className='panel-content-btm-item'>
                <View className='panel-title'>支付订单（笔）</View>
                <View className='panel-num'>1,999</View>
              </View>
              <View className='panel-content-btm-item'>
                <View className='panel-title'>退款订单（笔）</View>
                <View className='panel-num'>999</View>
              </View>
              <View className='panel-content-btm-item'>
                <View className='panel-title'>退款（元）</View>
                <View className='panel-num'>1,999,00</View>
              </View>
              <View className='panel-content-btm-item'>
                <View className='panel-title'>实付会员（人）</View>
                <View className='panel-num'>1,999</View>
              </View>
            </View>
          </View>
        </View>

        <View className='sales-content-func'>
          <View className='func-title'>常用功能</View>
          <View className='func-content'>
            {data.funcList.map((item, index) => (
              <View
                className='func-content-item'
                onClick={() => handleFuncClick(item.path)}
                key={index}
              >
                <Text
                  className={classNames({
                    'iconfont': true,
                    [item.icon]: true,
                    'func-item-icon': true
                  })}
                ></Text>
                <View className='func-item-name'>{item.name}</View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </SpPage>
  )
}

export default Index
