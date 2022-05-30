import React, { useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, ScrollView, Text } from '@tarojs/components'
import { SpGoodsItem, SpImage } from '@/components'
import { classNames, pickBy, linkPage } from '@/utils'
import doc from '@/doc'
import './goods-grid-tab.scss'

function WgtGoodsGridTab(props) {
  const { info } = props
  if (!info) {
    return null
  }

  const [current, setCurrent] = useState(0)

  const { base, config, list } = info

  const handleClickMore = () => {
    const { moreLink } = info.config
    if (moreLink) {
      linkPage(moreLink)
    } else {
      this.navigateTo(`/pages/item/list?dis_id=${info.distributor_id || ''}`)
    }
  }

  return (
    <View
      className={classNames('wgt', 'wgt-goods-grid-tab', {
        wgt__padded: base.padded
      })}
    >
      {/* {base.title && (
        <View className="wgt-head">
          <Text className="wgt-title">{base.title}</Text>
          <Text className="wgt-subtitle">{base.subtitle}</Text>
        </View>
      )} */}
      {base.title && (
        <View className='wgt-head'>
          <View className='wgt-hd'>
            <Text className='wgt-title'>{base.title}</Text>
            <Text className='wgt-subtitle'>{base.subtitle}</Text>
          </View>
          {config.moreLink.linkPage && (
            <View className='wgt-more' onClick={handleClickMore}>
              <View className='three-dot'></View>
            </View>
          )}
        </View>
      )}
      <View className='wgt-body'>
        <ScrollView className='scroll-tab' scrollX>
          {list.map((item, index) => (
            <View
              className={classNames('tab-item', {
                active: current == index
              })}
              key={`tab-item__${index}`}
              onClick={() => {
                setCurrent(index)
              }}
            >
              {item.tabTitle}
            </View>
          ))}
        </ScrollView>
        <View className='tabs-container'>
          {list.map((item, index) => {
            const leftFilterGoods = item.goodsList.filter((leftgoods, leftindex) => {
              if (leftindex % 2 == 0) {
                return leftgoods
              }
            })
            const rightFilterGoods = item.goodsList.filter((rightgoods, rightindex) => {
              if (rightindex % 2 == 1) {
                return rightgoods
              }
            })

            return (
              current == index && (
                <View className='tab-body' key={`tab-body__${index}`}>
                  <View className='left-container'>
                    {leftFilterGoods.map((good, index) => {
                      const data = pickBy(good, doc.goods.WGT_GOODS_GRID_TAB)
                      return (
                        <View className='goodgrid-item' key={`goods-item__${index}`}>
                          <SpGoodsItem
                            info={data}
                            renderBrand={
                              config.brand && (
                                <SpImage
                                  className='brand-info'
                                  src={good.brand}
                                  width={110}
                                  height={110}
                                  mode='scaleToFill'
                                />
                              )
                            }
                          />
                        </View>
                      )
                    })}
                  </View>
                  <View className='right-container'>
                    {rightFilterGoods.map((good, index) => {
                      const data = pickBy(good, doc.goods.WGT_GOODS_GRID_TAB)
                      return (
                        <View className='goodgrid-item' key={`goods-item__${index}`}>
                          <SpGoodsItem
                            info={data}
                            renderBrand={
                              config.brand && (
                                <SpImage
                                  className='brand-info'
                                  lazyLoad
                                  src={good.brand}
                                  width={110}
                                  height={110}
                                  mode='scaleToFill'
                                />
                              )
                            }
                          />
                        </View>
                      )
                    })}
                  </View>
                </View>
              )
            )
          })}
        </View>
        {config.moreLink.id && (
          <View className='btn-more' onClick={() => linkPage(config.moreLink)}>
            查看更多
          </View>
        )}
      </View>
    </View>
  )
}

WgtGoodsGridTab.options = {
  addGlobalClass: true
}

export default WgtGoodsGridTab
