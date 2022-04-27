import React, { useEffect } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { AtCountdown, AtCountdown , AtCountdown } from 'taro-ui'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { SpPrice } from '@/components'
import { useSelector } from 'react-redux'
import { classNames } from '@/utils'

import './index.scss'

function CompOrderItem(props) {
  const {
    info = {},
    renderFooter = null,
    onEditClick = () => {},
    onCountDownEnd = () => {},
    checkIsChief = true,
    onClick = () => {}
  } = props
  // const { checkIsChief: isChief } = useSelector((state) => state.user)

  return (
    <View className='comp-order-item'>
      {!checkIsChief && info.autoCancelSeconds?.ss > 0 && (
        <View className='comp-order-item-timer'>
          请在
          <AtCountdown
            format={{ day: '天', hours: ':', minutes: ':', seconds: '' }}
            isShowDay={info.autoCancelSeconds.dd > 0}
            day={info.autoCancelSeconds.dd}
            hours={info.autoCancelSeconds.hh}
            minutes={info.autoCancelSeconds.mm}
            seconds={info.autoCancelSeconds.ss}
            onTimeUp={() => onCountDownEnd()}
          />
          内支付，过期订单自动关闭
        </View>
      )}
      <View className='comp-order-item-head'>
        <View className='head-info'>
          <View className='head-info-group'>
            <Text>跟团号：</Text>
            <Text className='head-info-num'>{info?.communityInfo?.activity_trade_no}</Text>
          </View>
          <View className='head-info-date'>{info.createDate}</View>
        </View>
        <View className={classNames('head-info-status', info.orderStatus)}>
          {info.orderStatusMsg}
        </View>
      </View>
      <View className='comp-order-item-content'>
        <View className='comp-order-item-title'>
          <View className='content-imgbox'>
            <Image src={info?.communityInfo?.chief_avatar} className='content-img' />
          </View>
          <Text>{info?.communityInfo?.chief_name}</Text>
        </View>
        <View className='comp-order-item-active'>
          <View className='active-name'>{info?.communityInfo?.activity_name}</View>
          {/* {checkIsChief && ( */}
          <View onClick={() => onClick(info)}>
            <Text className='active-font'>查看</Text>
            <Text className='iconfont icon-qianwang-01' />
          </View>
          {/* )} */}
        </View>
        <View className='comp-order-item-goods'>
          <View className='goods-info'>
            <ScrollView className='scroll-goods' scrollX>
              {info?.items.map((good, goodIdx) => (
                <View className='scroll-item' key={goodIdx}>
                  <View className='goods-imgbox'>
                    <Image src={good.pic} className='goods-img' lazyLoad />
                    {/* {!checkIsChief && <View className='img-desc'>商品已核销（只有团员有）</View>} */}
                  </View>
                  <View className='goods-desc'>{good.itemName}</View>
                  <View className='goods-num'>+{good.num}件</View>
                </View>
              ))}
            </ScrollView>
          </View>
          <View className='goods-sale'>
            <SpPrice className='sale-price' unit='cent' value={info.totalFee} />
            <View className='sale-num'>共{info.totalNum}件</View>
          </View>
        </View>
        <View className='comp-order-item-info'>
          <View className='ziti-title'>顾客自提</View>
          <View className='ziti-box'>
            <View className='ziti-label'>
              <Text className='iconfont icon-dizhi-01' />
              <Text className='ziti-desc'>自提点：</Text>
              <Text className='ziti-desc'>{info?.communityInfo?.ziti_name}</Text>
            </View>
            <View className='ziti-address'>
              <Text>{info?.communityInfo?.name}</Text>
              {/* <Text className='iconfont icon-dizhi-01 showaddress-icon' /> */}
            </View>
          </View>
          <View className='ziti-info'>
            <View className='ziti-label'>
              <Text className='iconfont icon-dizhi-01' />
              <Text className='ziti-desc'>{info.receiver_name}</Text>
              <Text className='ziti-desc ml'>{info.receiver_mobile}</Text>
            </View>
            <View className='ziti-address'>{info.receiver_address}</View>
            {info.buildingNumber && (
              <View className='ziti-address'>{info.buildingNumber}(如10)</View>
            )}
            {info.houseNumber && <View className='ziti-address'>{info.houseNumber}(如101)</View>}
            {/* <View className='ziti-address'>多少弄：</View> */}
          </View>
          {info.remark && (
            <View className='ziti-tuan'>
              <View className='ziti-label'>
                <Text className='iconfont icon-dizhi-01' />
                <Text className='ziti-desc'>团员备注：</Text>
                <Text className='ziti-desc'>{info.remark}</Text>
                {/* <Text onClick={onEditClick} className='iconfont icon-edit address-icon' /> */}
              </View>
            </View>
          )}
        </View>
      </View>
      {renderFooter && <View className='comp-order-item-footer'>{renderFooter}</View>}
      {/* <View className='comp-order-item-record'>
        <View className='money'>已退0.01</View>
        <View className='iconfont icon-qianwang-01' />
      </View> */}
    </View>
  )
}

export default CompOrderItem
