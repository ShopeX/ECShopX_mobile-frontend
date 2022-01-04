import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { useMemo, useState, useCallback, useEffect } from 'react'
import { classNames, JumpStoreIndex, JumpGoodDetail } from '@/utils'
import { SpImage, SpShopCoupon, SpShopFullReduction, SpNewPrice } from '@/components'
import api from '@/api'
import './index.scss'

function SpShopItem (props) {
  const { className, info, jumpToBusiness, goodCount = 3, showGoods = false } = props
  if (!info) {
    return null
  }
  const { logo, name, cardList, salesCount, distance, is_dada, scoreList, marketingActivityList } =
    info
  const rate = !!(scoreList || {}).avg_star ? <Text>评分：{(scoreList || {}).avg_star}</Text> : ''
  const [unfold, setUnfold] = useState(false)
  const [showActivity, setShowActivity] = useState(false)
  const showMore = (e) => {
    e.stopPropagation()
    setUnfold(!unfold)
    setShowActivity(!showActivity)
  }
  return (
    <View className={classNames('sp-shop-item', className)}>
      <View className='shop-item-block'>
        <View className='shop-item-hd' onClick={jumpToBusiness}>
          <SpImage
            className='shop-logo'
            src={logo || `${process.env.APP_IMAGE_CDN}/shop_default_logo.png`}
          />
        </View>
        <View className='shop-item-bd'>
          <View className='item-bd-hd'>
            <View className='shop-name' onClick={jumpToBusiness}>
              {name}
            </View>
            <View className='shop-distance'>{distance}</View>
          </View>
          <View className='item-bd-sb'>
            <View className='score'>
              {rate} 月销：{salesCount}
            </View>
            {is_dada && <View className='express'>达达配送</View>}
          </View>
          <View className='item-bd-bd' onClick={showMore}>
            {(unfold ? cardList : cardList.slice(0, 3)).map((item, index) => (
              <SpShopCoupon info={item} key={`shop-coupon__${index}`} fromStoreIndex />
            ))}
            {(cardList.length > 3 || marketingActivityList.length > 1) && (
              <Image
                src='/assets/imgs/down_icon.png'
                className={unfold ? 'down_icon translate' : 'down_icon'}
                onClick={showMore}
              ></Image>
            )}
          </View>
          <View className={!showActivity ? 'item-bd-fr' : 'item-bd-fr pick'}>
            {marketingActivityList.map((item, index) => (
              <SpShopFullReduction info={item} key={`shop-full-reduction__${index}`} />
            ))}
          </View>
        </View>
      </View>

      {showGoods && info.itemList && (
        <View className={classNames('good-list', { 'fill': info.itemList.length === goodCount })}>
          {info.itemList.slice(0, goodCount).map((item) => {
            return (
              <View
                className={classNames('good-item')}
                onClick={() => JumpGoodDetail(item.item_id, info.distributor_id)}
              >
                <Image className='img' src={item.pics}></Image>
                <View className='name'>{item.item_name}</View>
                <View className='price'>
                  <SpNewPrice price={item.price} />
                  <View className='margin'></View>
                  <SpNewPrice price={item.market_price} discount equal size='small' />
                </View>
              </View>
            )
          })}
        </View>
      )}
    </View>
  )
}

SpShopItem.options = {
  addGlobalClass: true
}

export default SpShopItem
