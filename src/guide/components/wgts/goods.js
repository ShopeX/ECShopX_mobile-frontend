import React, { Component } from 'react';
 import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components'
import { classNames } from '@/utils'
import { connect } from 'react-redux'
import api from '@/api'

import S from '@/spx'

import './goods.scss'

@connect(
  ({ cart, member }) => ({
    cart,
    favs: member.favs
  }),
  (dispatch) => ({
    onFastbuy: (item) => dispatch({ type: 'cart/fastbuy', payload: { item } }),
    onAddCart: (item) => dispatch({ type: 'cart/add', payload: { item } }),
    onAddFav: ({ item_id }) => dispatch({ type: 'member/addFav', payload: { item_id } }),
    onDelFav: ({ item_id }) => dispatch({ type: 'member/delFav', payload: { item_id } })
  })
)
export default class WgtGoods extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  constructor(props) {
    super(props)

    this.state = {
      curIdx: 0,
      is_fav: false,
      count: 0
    }
  }

  handleClickItem = async (id) => {
    try {
      Taro.navigateTo({
        url: `/guide/item/espier-detail?id=${id}`
      })
    } catch (error) {}
  }

  handleSwiperChange = (e) => {
    const { current } = e.detail

    this.setState({
      curIdx: current
    })
  }

  handleClickOperate = async (item_data, type, e) => {
    const { info, sourcetype, title, author, source, componentIndex } = this.props
    e.stopPropagation()
    if (!S.getAuthToken()) {
      S.login(this)
      return false
    }
    /*if(info.data) {
      let onsale = true
      info.data.map(item => {
        if(item_data.item_id === item.item_id){
          if(!item.isOnsale){
            onsale = false
          }
        }
      })
      if(!onsale){
        return false
      }
    }*/
    if (type === 'collect') {
      /*if(this.state.count === 0) {
        let is_fav = Boolean(this.props.favs[item_data.item_id])
        this.setState({
          count: 1,
          is_fav
        })
      }
      if(!this.state.is_fav) {
        await api.member.addFav(item_data.item_id)
        this.props.onAddFav(item_data)
        Taro.showToast({
          title: '已加入收藏',
          icon: 'none'
        })
      } else {
        await api.member.delFav(item_data.item_id)
        this.props.onDelFav(item_data)
        Taro.showToast({
          title: '已移出收藏',
          icon: 'none'
        })
      }
      this.setState({
        is_fav: !this.state.is_fav
      })*/
      if (!item_data.favStatus) {
        await api.member.addFav(item_data.item_id)
        this.props.onAddFav(item_data)
        Taro.showToast({
          title: '已加入收藏',
          icon: 'none'
        })
      } else {
        await api.member.delFav(item_data.item_id)
        this.props.onDelFav(item_data)
        Taro.showToast({
          title: '已移出收藏',
          icon: 'none'
        })
      }
      this.props.onClick()
    }

    if (type === 'buy') {
      try {
        await api.cart.add({
          item_id: item_data.item_id,
          num: 1
        })
        Taro.showToast({
          title: '成功加入购物车',
          icon: 'success'
        })
      } catch (error) {
        console.log(error)
      }
    }
  }

  render() {
    const { info } = this.props
    const { curIdx, is_fav } = this.state
    if (!info) {
      return null
    }

    const { config, base, data } = info
    const curContent = (data[curIdx] || {}).content

    return (
      <View className={`wgt ${base.padded ? 'wgt__padded' : null}`}>
        {base.title && (
          <View className='wgt__header'>
            <View className='wgt__title'>{base.title}</View>
            <View className='wgt__subtitle'>{base.subtitle}</View>
          </View>
        )}
        <View className='slider-wrap'>
          {data.map((item) => {
            return (
              <View
                className='goods-content'
                key={item.item_id}
                onClick={this.handleClickItem.bind(this, item.item_id)}
              >
                <View className='goods-content__info'>
                  <View className='goods-content__info_img'>
                    <Image className='img-style' mode='widthFix' src={item.img_url} />
                  </View>
                  <View className='goods-content__info_text'>
                    <Text>{item.item_name}</Text>
                    <Text className='goods-content__info_status'>
                      {item.itemStatus ? '点击查看产品详情' : '该商品已下架'}
                    </Text>
                  </View>
                </View>
              </View>
            )
          })}
        </View>
      </View>
    )
  }
}
