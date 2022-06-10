import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { SpGoodsItem } from '@/components'
import { pickBy, classNames, linkPage } from '@/utils'
import { Tracker } from '@/service'
import { CreateIntersectionObserver } from '@/utils/platform'
import { withLoadMore } from '@/hocs'
import doc from '@/doc'
import './goods-grid.scss'

function WgtGoodsGrid(props) {
  const { info } = props
  if (!info) {
    return null
  }
  const { base, data, config } = info
  const goods = pickBy(data, doc.goods.WGT_GOODS_GRID)

  const handleClickMore = () => {
    const { moreLink } = config
    if (moreLink) {
      linkPage(moreLink)
    } else {
      this.navigateTo(`/pages/item/list?dis_id=${info.distributor_id || ''}`)
    }
  }

  const leftFilterGoods = goods.filter((leftgoods, leftindex) => {
    if (leftindex % 2 == 0) {
      return leftgoods
    }
  })
  const rightFilterGoods = goods.filter((rightgoods, rightindex) => {
    if (rightindex % 2 == 1) {
      return rightgoods
    }
  })
  console.log(config, 'config')
  return (
    <View
      className={classNames('wgt', 'wgt-goods-grid', {
        wgt__padded: base.padded
      })}
    >
      {base.title && (
        <View className='wgt-head'>
          <View className='wgt-hd'>
            <Text className='wgt-title'>{base.title}</Text>
            <Text className='wgt-subtitle'>{base.subtitle}</Text>
          </View>
          {config.moreLink?.linkPage && (
            <View className='wgt-more' onClick={handleClickMore}>
              <View className='three-dot'></View>
            </View>
          )}
        </View>
      )}
      <View className='wgt-body'>
        {config.style == 'grid' && (
          <View className='container'>
            <View className='goods-item-wrap two-inrow left-container'>
              {leftFilterGoods.map((item, leftidx) => (
                <SpGoodsItem showPrice={config.showPrice} info={item} key={`left_${leftidx}`} />
              ))}
            </View>
            <View className='goods-item-wrap two-inrow right-container'>
              {rightFilterGoods.map((item, rightidx) => (
                <SpGoodsItem showPrice={config.showPrice} info={item} key={`right_${rightidx}`} />
              ))}
            </View>
          </View>
        )}
        <View className='wgt-goods-grid-list'>
          {config.style === 'grids' &&
            goods.map((item, idx) => (
              <View className='goods-item-wrap three-inrow' key={`goods-item-wrap__${idx}`}>
                <SpGoodsItem showPrice={config.showPrice} showPromotion={false} info={item} mode="aspectFill" />
              </View>
            ))}
        </View>
      </View>
    </View>
  )
}

WgtGoodsGrid.options = {
  addGlobalClass: true
}

export default WgtGoodsGrid
