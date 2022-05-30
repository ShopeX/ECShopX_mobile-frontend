import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpScrollView, SpSearch } from '@/components'
import { log } from '@/utils'
import {
  WgtSearchHome,
  WgtFilm,
  WgtMarquees,
  WgtSlider,
  WgtImgHotZone,
  WgtNavigation,
  WgtCoupon,
  WgtGoodsScroll,
  WgtGoodsGrid,
  WgtGoodsGridTab,
  WgtShowcase,
  WgtStore,
  WgtHeadline,
  WgtImgGif,
  WgtHotTopic,
  WgtFloorImg,
  WgtNearbyShop
} from '../wgts'
import './home-wgts.scss'

const initialState = {
  localWgts: []
}
function HomeWgts(props) {
  const { wgts } = props
  const [state, setState] = useImmer(initialState)
  const { localWgts } = state

  const fetch = ({ pageIndex, pageSize }) => {
    const x = pageSize * pageIndex
    const twgt = wgts.slice(x - pageSize, x > wgts.length ? wgts.length : x)
    log.debug(
      `${pageIndex}; ${pageSize}; ${wgts.length}; ${x - pageSize}; ${
        x > wgts.length ? wgts.length : x
      }`
    )
    setState((draft) => {
      draft.localWgts[pageIndex - 1] = twgt
    })

    return {
      total: wgts.length
    }
  }

  return (
    <SpScrollView className='home-wgts' fetch={fetch} pageSize={3}>
      {localWgts.map((list) => {
        return list.map((item, idx) => (
          <View
            className='wgt-wrap'
            key={`${item.name}${idx}`}
            data-idx={idx}
            data-name={item.name}
          >
            {/* {item.name === "search" && <WgtSearchHome info={item} />} */}
            {item.name === 'search' && <SpSearch info={item} />} {/** 搜索 */}
            {item.name === 'film' && <WgtFilm info={item} />} {/** 视频 */}
            {item.name === 'marquees' && <WgtMarquees info={item} />} {/** 文字轮播 */}
            {item.name === 'slider' && <WgtSlider isHomeSearch info={item} />} {/** 轮播 */}
            {item.name === 'navigation' && <WgtNavigation info={item} />} {/** 图片导航 */}
            {item.name === 'coupon' && <WgtCoupon info={item} />} {/** 优惠券 */}
            {item.name === 'imgHotzone' && <WgtImgHotZone info={item} />} {/** 热区图 */}
            {/** 商品滚动 */}
            {item.name === 'goodsScroll' && (
              <WgtGoodsScroll info={item} index={idx} type='good-scroll' />
            )}
            {/** 商品栅格 */}
            {item.name === 'goodsGrid' && <WgtGoodsGrid info={item} index={idx} type='good-grid' />}
            {/** 商品Tab */}
            {item.name === 'goodsGridTab' && (
              <WgtGoodsGridTab info={item} index={idx} type='good-grid-tab' />
            )}
            {item.name === 'showcase' && <WgtShowcase info={item} />} {/** 橱窗 */}
            {item.name === 'headline' && <WgtHeadline info={item} />} {/** 文字标题 */}
            {item.name === 'img-gif' && <WgtImgGif info={item} />} {/** 视频图 */}
            {item.name === 'hotTopic' && <WgtHotTopic info={item} />} {/** 热点话题 */}
            {item.name === 'floorImg' && <WgtFloorImg info={item} />} {/** 楼层图片 */}
            {item.name === 'store' && <WgtStore info={item} />} {/** 推荐商铺 */}
            {item.name === 'nearbyShop' && <WgtNearbyShop info={item} />} {/** 附近商家 */}
          </View>
        ))
      })}
    </SpScrollView>
  )
}

HomeWgts.options = {
  addGlobalClass: true
}

export default HomeWgts
