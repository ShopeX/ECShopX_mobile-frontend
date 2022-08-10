import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpImage, SpPrice, SpPoint } from '@/components'
import { GOODS_TYPE } from '@/consts'
import { VERSION_IN_PURCHASE } from '@/utils'
import './index.scss'

function SpGoodsCell(props) {
  const { info, onSelectSku } = props
  const { userInfo = {}, vipInfo = {} } = useSelector((state) => state.user)
  if (!info) {
    return null
  }

  const handleClick = () => {
    onSelectSku && onSelectSku(info)
  }

  const { price, activityPrice, memberPrice, packagePrice, curItem, point, isPoint, cusActivity } =
    info
  let _price = 0
  let t_price, t_activityPrice, t_memberPrice, t_packagePrice
  if (curItem) {
    t_price = curItem.price
    t_activityPrice = curItem.activityPrice
    t_memberPrice = curItem.memberPrice
    t_packagePrice = curItem.packagePrice
  } else {
    t_price = price
    t_activityPrice = activityPrice
    t_memberPrice = memberPrice
    t_packagePrice = packagePrice
  }
  if (!isNaN(t_activityPrice)) {
    _price = t_activityPrice
  } else if (!isNaN(t_packagePrice)) {
    _price = t_packagePrice
  } else if (!isNaN(t_memberPrice)) {
    _price = t_memberPrice
  } else {
    _price = t_price
  }

  // console.log('isNaN(memberPrice):', info.orderItemType)
  return (
    <View className='sp-goods-cell'>
      <View className='goods-item-hd'>
        <SpImage mode='aspectFit' src={info.img} width={180} height={180} />
      </View>
      <View className='goods-item-bd'>
        <View className='item-hd'>
          <View className='goods-title'>{info.itemName}</View>
        </View>
        <View className='item-bd'>
          <View>
            {/* 多规格商品 */}
            {!info.nospec && (
              <View className='goods-sku' onClick={handleClick}>
                {onSelectSku && (
                  <View className='spec-text'>
                    {info.specText || '选择规格'}
                    <Text className='iconfont icon-qianwang-01'></Text>
                  </View>
                )}
                {!onSelectSku && info.itemSpecDesc}
              </View>
            )}
          </View>
        </View>
        <View className='labels-block'>
          {!isNaN(memberPrice) && !VERSION_IN_PURCHASE && (
            <View className='goods-type'>
              {vipInfo?.isVip ? vipInfo?.grade_name : userInfo?.gradeInfo?.grade_name}
            </View>
          )}
          {info?.orderItemType && info?.orderItemType != 'normal' && (
            <View className='goods-type'>{GOODS_TYPE[info.orderItemType]}</View>
          )}
          {info.discount_info?.map((sp, idx) => {
            if (sp.type != 'coupon_discount' && sp.type != 'member_price') {
              return (
                <View className='goods-type' key={`goods-type__${idx}`}>
                  {sp.info}
                </View>
              )
            }
          })}
          {cusActivity?.map((el) => {
            let limitTxt = ''
            let limitNum = ''
            if (el?.activity_type == 'limited_buy') {
              limitNum = el?.limit
              if (el?.day == 0) {
                limitTxt = `限购${limitNum}件`
              } else {
                limitTxt = `每${el?.day}天，限购${limitNum}件`
              }
            }
            {
              /* else if (el?.activity_type == 'seckill' || el?.activity_type == 'limited_time_sale') {
              limitNum = el?.limit
              limitTxt = `（限购${limitNum}件）`
            } else if (el?.activity_type == 'member_tag_targeted_promotion') {
              limitTxt = '专属优惠'
            } */
            }
            return <View className='goods-type'>{limitTxt}</View>
          })}
          {/* {limitTxt && <View className='goods-type'>{limitTxt}</View>} */}
        </View>
        <View className='item-ft'>
          <View className='price-gp'>
            {isPoint && <SpPoint value={point} />}
            {!isPoint && <SpPrice value={_price}></SpPrice>}
            {info.marketPrice > 0 && (
              <SpPrice
                className='market-price'
                size={28}
                lineThrough
                value={info.marketPrice}
              ></SpPrice>
            )}
          </View>

          {info.num && <Text className='item-num'>x {info.num}</Text>}
        </View>
      </View>
    </View>
  )
}

SpGoodsCell.options = {
  addGlobalClass: true
}

export default SpGoodsCell
