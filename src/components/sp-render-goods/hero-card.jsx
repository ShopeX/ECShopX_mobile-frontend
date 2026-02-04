import React from 'react'
import { View, Text } from '@tarojs/components'
import { SpImage, SpPrice } from '@/components'
import SpTag from '@/components/sp-tag/index'
import Taro from '@tarojs/taro'
import qs from 'qs'
import { classNames } from '@/utils'
import './hero-card.scss'

function SpGoodsHeroCard(props) {
  const { info = null, onClick, mode = 'aspectFill' } = props

  const handleClick = async () => {
    if (!info) return
    const { itemId, distributorId } = info
    if (onClick) {
      onClick(info)
      return
    }
    let query = { id: itemId, dtid: distributorId ?? '' }
    const url = `/pages/item/espier-detail?${qs.stringify(query)}`
    Taro.navigateTo({
      url
    })
  }

  if (!info) {
    return null
  }
  const finalPrice = info.activityPrice || info.price
  return (
    <View
      id={`sp-goods-hero-card-${info.itemId}`}
      key={props.key}
      className={classNames('sp-goods-hero-card', props.className)}
      onClick={handleClick}
    >
      <View className='sp-goods-hero-card__image'>
        <SpImage
          lazyLoad
          src={info.pic}
          mode={mode}
          style={{ width: '100%', height: '100%' }}
          placeholderColor='#f2f3f5'
        />
        {info.store <= 0 && (
          <View className='soldout-mask'>
            <View className='soldout-mask-text'>
              <Text>已售罄</Text>
            </View>
          </View>
        )}
      </View>
      <View className='sp-goods-hero-card__content'>
        <View
          className={classNames('sp-goods-hero-card__title', {
            'sp-goods-hero-card__title-skill':
              info.promotionSkill || info.memberPreference?.marketing_name
          })}
        >
          {info.promotionSkill && (
            <View className='sp-goods-hero-card__title-img'>
              <SpImage src='fv_activity_seckill.png' mode='heightFix' width={62} height={31} />
            </View>
          )}
          {info.memberPreference?.marketing_name && (
            <View className='sp-goods-hero-card__title-img'>
              <SpImage src='fv_member_preference.png' mode='heightFix' height={31} />
            </View>
          )}
          {info.itemName}
        </View>

        {(info.couponList?.length > 0 || info.promotion?.length > 0) && (
          <View id={`${props.id}-tag-wrapper`} className='tag-wrapper flex align-center'>
            {info.promotion?.map((tag, index) => (
              <SpTag
                className='tag-wrapper__tag'
                key={index}
                label={tag.tag_name}
                type={tag.type}
              />
            ))}
            {info.couponList?.map((tag, index) => (
              <SpTag key={index} label={tag.discount_rule} type='warning'></SpTag>
            ))}
          </View>
        )}
        <View className='sp-goods-hero-card__price'>
          <View className='price-wrapper'>
            <SpPrice
              className='current-price'
              size={34}
              value={finalPrice}
              style={{ marginRight: '6px' }}
              weight={600}
            />
            {Number(info.marketPrice || 0) > 0 &&
              Number(finalPrice || 0) < Number(info.marketPrice || 0) && (
                <SpPrice
                  size={24}
                  noSymbol
                  className='market-price'
                  lineThrough
                  value={info.marketPrice}
                />
              )}
            {info.discountRate && (
              <View className='discount-tag'>
                <Text className='discount-tag__value'>{info.discountRate}</Text>
                <Text className='discount-tag__unit'>折</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  )
}

SpGoodsHeroCard.options = {
  addGlobalClass: true
}

SpGoodsHeroCard.defaultProps = {
  className: '',
  id: '',
  info: null,
  key: '',
  onClick: null,
  mode: 'aspectFill',
  width: 200,
  onLoad: () => {}
}

export default SpGoodsHeroCard
