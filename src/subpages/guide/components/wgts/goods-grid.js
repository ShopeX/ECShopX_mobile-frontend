import { useContext } from 'react'
import Taro, { Component, useRouter } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { SpGoodsItem, SpImage } from '@/components'
import { pickBy, classNames, styleNames, linkPage } from '@/utils'
import doc from '@/doc'
import './goods-grid.scss'

function WgtGoodsGrid(props) {
  const { info } = props
  if (!info) {
    return null
  }
  const { base, data, config } = info
  const newData = Array.isArray(data) ? data : []
  const goods = pickBy(newData, doc.goods.WGT_GOODS_GRID) || []

  const handleClickMore = () => {
    Taro.navigateTo({ url: `/subpages/guide/item/list` })
  }

  const handleClickItem = (item, index) => {
    Taro.navigateTo({
      url: `/subpages/guide/item/espier-detail?id=${item.itemId}`
    })
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
          <View className='all-goods' onClick={handleClickMore}>
            全部商品
          </View>
        </View>
      )}
      <View className='wgt-body'>
        {config.style == 'grid' && (
          <View className='container'>
            <View className='goods-item-wrap two-inrow left-container'>
              {leftFilterGoods.map((item, leftidx) => (
                <SpGoodsItem
                  lazyLoad={false}
                  renderBrand={
                    config.brand && (
                      <View className='brand-info' style={styleNames({
                        'width': '62px',
                        'height': '62px',
                        'border-radius': '32px',
                        'padding': '2px'
                      })}>
                        <SpImage
                          src={item.brand}
                          width={120}
                          height={120}
                          circle
                          mode='scaleToFill'
                        />
                      </View>
                    )
                  }
                  showPrice={config.showPrice}
                  showAddCart={config.addCart}
                  jumpType={config.type}
                  info={item}
                  key={`left_${leftidx}`}
                  onClick={() => handleClickItem(item)}
                />
              ))}
            </View>
            <View className='goods-item-wrap two-inrow right-container'>
              {rightFilterGoods.map((item, rightidx) => (
                <SpGoodsItem
                  lazyLoad={false}
                  renderBrand={
                    config.brand && (
                      <View className='brand-info' style={styleNames({
                        'width': '64px',
                        'height': '64px',
                        'border-radius': '32px',
                        'padding': '2px'
                      })}>
                        <SpImage
                          src={item.brand}
                          width={120}
                          height={120}
                          circle
                          mode='scaleToFill'
                        />
                      </View>
                    )
                  }
                  showPrice={config.showPrice}
                  showAddCart={config.addCart}
                  jumpType={config.type}
                  info={item}
                  key={`right_${rightidx}`}
                  onClick={() => handleClickItem(item)}
                />
              ))}
            </View>
          </View>
        )}
        <View className='wgt-goods-grid-list'>
          {config.style === 'grids' &&
            goods.map((item, idx) => (
              <View className='goods-item-wrap three-inrow' key={`goods-item-wrap__${idx}`}>
                <SpGoodsItem
                  lazyLoad={false}
                  renderBrand={
                    config.brand && (
                      <View className='brand-info' style={styleNames({
                        'width': '64px',
                        'height': '64px',
                        'border-radius': '32px',
                        'padding': '2px'
                      })}>
                        <SpImage
                          src={item.brand}
                          width={120}
                          height={120}
                          circle
                          mode='scaleToFill'
                        />
                      </View>
                    )
                  }
                  showPrice={config.showPrice}
                  showAddCart={config.addCart}
                  showPromotion={false}
                  info={item}
                  mode='aspectFill'
                  onClick={() => handleClickItem(item)}
                />
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
