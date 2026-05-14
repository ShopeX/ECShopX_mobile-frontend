/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpFloatLayout, SpGoodsCell } from '@/components'
import { pickBy } from '@/utils'
import doc from '@/doc'
import { useTranslation, $t, ti } from '@/i18n'
import './comp-promation.scss'

function CompPromation(props) {
  useTranslation()
  const { open = false, info = [], onClose = () => {} } = props

  const renderFullGift = ({ gifts }) => {
    const _gifts = pickBy(gifts, doc.goods.GOODS_INFO)
    return (
      <View className='gift-list'>
        <View className='gift-list-title'>{$t('dc155244.fccea5')}</View>
        {_gifts.map((item, index) => (
          <View className='gift-item-wrap' key={`gift-item-wrap-1__${index}`}>
            <SpGoodsCell info={item} />
          </View>
        ))}
      </View>
    )
  }

  const renderPlusPriceBuy = ({ plusItems }) => {
    const _plusItems = pickBy(plusItems, doc.goods.GOODS_INFO)
    return (
      <View className='gift-list'>
        <View className='gift-list-title'></View>
        {_plusItems.map((item, index) => (
          <View className='gift-item-wrap' key={`gift-item-wrap-2__${index}`}>
            <SpGoodsCell info={item} />
          </View>
        ))}
      </View>
    )
  }

  const handleClick = ({ marketingType, marketingId }) => {
    if (marketingType == 'plus_price_buy') {
      Taro.navigateTo({
        url: `/marketing/pages/plusprice/detail-plusprice-list?marketing_id=${marketingId}`
      })
    }
  }

  return (
    <SpFloatLayout
      className='comp-promation'
      open={open}
      hideClose
      title={$t('dc155244.cd5666')}
      renderFooter={
        <AtButton circle className='at-button--txt' onClick={onClose}>
          {$t('dc155244.625fb2')}
        </AtButton>
      }
    >
      <View className='promation-list'>
        {info.map((item, index) => (
          <View className='promation-item' key={`promation-item__${index}`}>
            {item.joinLimit > 0 && (
              <View className='join-times'>{ti('dc155244.78035a', [item.joinLimit])}</View>
            )}
            <View className='promation' onClick={handleClick.bind(this, item)}>
              <View className='promation-tag'>{item.promotionTag}</View>
              <View className='promation-name'>{item.marketingName}</View>
              {item.marketingType == 'plus_price_buy' && (
                <Text className='iconfont icon-qianwang-01'></Text>
              )}
            </View>

            <View className='promation-date'>{ti('dc155244.7cd7be', [item.endDate])}</View>
            <View className='promation-rule'>{ti('dc155244.7f8043', [item.conditionRules])}</View>

            {item.marketingType == 'full_gift' && renderFullGift(item)}
            {item.marketingType == 'plus_price_buy' && renderPlusPriceBuy(item)}
          </View>
        ))}
      </View>
    </SpFloatLayout>
  )
}

CompPromation.options = {
  addGlobalClass: true
}

export default CompPromation
