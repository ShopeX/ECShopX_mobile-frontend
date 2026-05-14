/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpImage, SpPrice, SpTradeItem } from '@/components'
import { VERSION_STANDARD } from '@/utils'
import { useTranslation, ti, $t } from '@/i18n'
import tradeHooks from '../hooks'
import btnHooks from '../btn-hooks'
import './comp-tradeitem.scss'

function CompTradeItem(props) {
  useTranslation()
  const {
    info,
    showButton = false,
    updateDelivery = () => {},
    cancelDelivery = () => {},
    pack = () => {}
  } = props

  if (!info) {
    return null
  }
  const { tradeActionBtns, getTradeAction } = tradeHooks()
  const { orderState } = btnHooks()

  const {
    distributorInfo,
    orderId,
    createDate,
    orderStatusMsg,
    items,
    orderStatus,
    totalFee,
    orderClass,
    point,
    distributorId,
    receiverMobile,
    receiverName,
    receiverState,
    receiverCity,
    receiverDistrict,
    receiverAddress,
    selfDeliveryFee,
    selfDeliveryStatus
  } = info
  const { pointName } = useSelector((state) => state.sys)

  const btns = getTradeAction(info)

  const handleClickItem = ({ key, action }) => {
    if (key == 'update_delivery') {
      updateDelivery(info)
    } else if (key == 'cancel_delivery') {
      cancelDelivery(info)
    } else if (key == 'pack') {
      pack(info)
    } else {
      action(info)
    }
  }

  const onViewTradeDetail = () => {
    Taro.navigateTo({
      url: `/subpages/delivery/detail?order_id=${orderId}`
    })
  }

  const onViewStorePage = (e) => {
    if (!VERSION_STANDARD) {
      e.stopPropagation()
      Taro.navigateTo({
        url: `/subpages/store/index?id=${distributorId}`
      })
    }
  }

  const totalNum = items.reduce((preVal, item) => preVal + item.num, 0)

  return (
    <View className='comp-tradeitem'>
      <View className='trade-item-hd' onClick={onViewTradeDetail}>
        <View>
          <View className='shop-info' onClick={onViewStorePage}>
            <SpImage src={distributorInfo?.logo} width={100} height={100} />
            <View className='shop-name'>
              {distributorInfo?.name}
              {!VERSION_STANDARD && <Text className='iconfont icon-qianwang-01'></Text>}
            </View>
          </View>

          {!showButton && <View className='trade-no'>{ti('12f07f54.78f59a', [orderId])}</View>}

          {!showButton && <View className='trade-time'>{ti('12f07f54.8bf28c', [createDate])}</View>}
        </View>
        {!showButton && <View className='trade-state'>{orderState(info)}</View>}
      </View>
      <View className='trade-item-bd' onClick={onViewTradeDetail}>
        {items.map((good, goodIndex) => (
          <SpTradeItem
            key={goodIndex}
            info={{
              ...good,
              orderClass
            }}
          />
        ))}

        <View className='trade-address'>
          <View className='distance'>
            <Text>{$t('b67d1364.aafe5d')}</Text>
            {/* <Text>距离2.5km</Text> */}
          </View>
          <View className='name'>
            <Text>{receiverName}</Text>
            <Text>{receiverMobile}</Text>
          </View>
          <View className='details'>
            {`${receiverState}${receiverCity}${receiverDistrict}${receiverAddress}`}
          </View>
        </View>

        <View className='trade-total'>
          {/* <View className='delivery'></View> */}
          <View className='delivery'>
            <Text>{$t('b67d1364.1138a9')}</Text>
            <SpPrice value={selfDeliveryFee} size={38} />
          </View>
          {orderClass == 'pointsmall' && (
            <View style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Text className='num'>{ti('7c005828.17d01f', [totalNum])}</Text>
              <Text className='label'>{pointName}</Text>
              <Text className='point-value' style='font-size: 20px;'>
                {point}
              </Text>
            </View>
          )}
          {orderClass == 'normal' && (
            <View style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Text className='num'>{ti('7c005828.17d01f', [totalNum])}</Text>
              <Text className='label'>{$t('12f07f54.94a7de')}</Text>
              <SpPrice value={totalFee} size={38} />
            </View>
          )}
        </View>
      </View>

      {!showButton && (
        <View className='trade-item-ft'>
          {btns.map((item, index) => (
            <AtButton
              key={index}
              circle
              className={`btn-${item.btnStatus}`}
              onClick={handleClickItem.bind(this, item)}
            >
              {item.title}
            </AtButton>
          ))}
        </View>
      )}
    </View>
  )
}

CompTradeItem.options = {
  addGlobalClass: true
}

export default CompTradeItem
