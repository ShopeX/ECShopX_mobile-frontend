import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpGoodsItem, SpImage } from '@/components'
import { pickBy, classNames, styleNames, showToast } from '@/utils'
import api from '@/api'
import { useImmer } from 'use-immer'

import doc from '@/doc'
import BaSkuSelect from '../ba-sku-select'
import './goods-grid.scss'

const initialState = {
  info: {},
  skuPanelOpen: false,
  selectType: 'picker'
}

const MBaSkuSelect = React.memo(BaSkuSelect)

function WgtGoodsGrid(props) {
  const { info } = props
  if (!info) {
    return null
  }
  const { base, data, config } = info
  const [state, setState] = useImmer(initialState)
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

  const handleAddToCart = async ({ itemId, distributorId }) => {
    Taro.showLoading()
    try {
      const itemDetail = await api.item.detail(itemId, {
        showError: false,
        distributor_id: distributorId
      })
      Taro.hideLoading()
      setState((draft) => {
        draft.info = pickBy(itemDetail, doc.goods.GOODS_INFO)
        draft.skuPanelOpen = true
        draft.selectType = 'addcart'
      })
    } catch (e) {
      showToast(e.message)
      Taro.hideLoading()
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
                      <View
                        className='brand-info'
                        style={styleNames({
                          'width': '62px',
                          'height': '62px',
                          'border-radius': '32px',
                          'padding': '2px'
                        })}
                      >
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
                      <View
                        className='brand-info'
                        style={styleNames({
                          'width': '64px',
                          'height': '64px',
                          'border-radius': '32px',
                          'padding': '2px'
                        })}
                      >
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
                  onAddToCart={() => handleAddToCart(item)}
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
                      <View
                        className='brand-info'
                        style={styleNames({
                          'width': '64px',
                          'height': '64px',
                          'border-radius': '32px',
                          'padding': '2px'
                        })}
                      >
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

      {/* Sku选择器 */}
      {state.skuPanelOpen && (
        <MBaSkuSelect
          open={state.skuPanelOpen}
          type={state.selectType}
          info={state.info}
          onClose={() => {
            setState((draft) => {
              draft.skuPanelOpen = false
            })
          }}
          onChange={(skuText, curItem) => {
            setState((draft) => {
              draft.skuText = skuText
              draft.curItem = curItem
            })
          }}
        />
      )}
    </View>
  )
}

WgtGoodsGrid.options = {
  addGlobalClass: true
}

export default WgtGoodsGrid
