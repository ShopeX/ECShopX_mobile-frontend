import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text } from '@tarojs/components'
import { SpImage, SpLogin } from '@/components'
import api from '@/api'
import S from '@/spx'
import { isArray, classNames, styleNames } from '@/utils'
import { closeCart, setGoodsSkuInfo } from '@/store/slices/guide'
import { linkPage } from './helper'
import './imghot-zone.scss'

function WgtImgHotZone(props) {
  const { info } = props
  const { base, config, data } = info
  const dispatch = useDispatch()

  const handleClickItem = (item) => {
    if (item.linkPage === 'cashcoupon') {
      const toke = S.getAuthToken()
      if (!toke) {
        S.login()
      } else {
        api.member.sendCashCoupon({ stock_id: item.id }).then((res) => {
          S.toast(res.msg)
        })
      }
      return
    }
    if (item.linkPage == 'addCart') {
      onClickAddCart(item.id)
      return
    }

    linkPage(item.linkPage, item.id, item)
  }
  const onClickAddCart = async (id) => {
    if (!S.getAuthToken()) {
      Taro.showToast({
        title: '请先登录再购买',
        icon: 'none'
      })

      setTimeout(() => {
        S.login()
      }, 50)

      return
    }
    try {
      const skuinfo = await api.item.detail(id)
      setTimeout(async () => {
        await dispatch(closeCart(true))
        await dispatch(setGoodsSkuInfo(skuinfo))
      }, 10)
    } catch (e) {}
  }
  return (
    <View
      className={classNames('wgt wgt-imghot-zone', {
        wgt__padded: base.padded
      })}
    >
      {base.title && (
        <View className='wgt-head'>
          <View className='wgt-hd'>
            <Text className='wgt-title'>{base.title}</Text>
            <Text className='wgt-subtitle'>{base.subtitle}</Text>
          </View>
        </View>
      )}

      <View className={`slider-wra wgt-body img-hotzone ${config.padded ? 'padded' : ''}`}>
        <SpImage img-class='img-hotzone_img' src={config.imgUrl} lazyLoad />
        {isArray(data) &&
          data.map((item, index) => {
            return (
              <View
                key={`${index}1`}
                className='img-hotzone_zone'
                style={styleNames({
                  width: `${item.widthPer * 100}%`,
                  height: `${item.heightPer * 100}%`,
                  top: `${item.topPer * 100}%`,
                  left: `${item.leftPer * 100}%`
                })}
                onClick={handleClickItem.bind(this, item)}
              />
            )
          })}
      </View>
    </View>
  )
}

WgtImgHotZone.options = {
  addGlobalClass: true
}

WgtImgHotZone.defaultProps = {
  info: null
}

export default WgtImgHotZone
