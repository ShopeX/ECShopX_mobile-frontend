import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Video, SwiperItem } from '@tarojs/components'
import { classNames } from '@/utils'
import { linkPage } from './helper'
import { connect } from '@tarojs/redux'
import api from '@/api'

import './goods.scss'
@connect(({ cart, member }) => ({
  cart,
  favs: member.favs
}), (dispatch) => ({
  onFastbuy: (item) => dispatch({ type: 'cart/fastbuy', payload: { item } }),
  onAddCart: (item) => dispatch({ type: 'cart/add', payload: { item } }),
  onAddFav: ({ item_id }) => dispatch({ type: 'member/addFav', payload: { item_id } }),
  onDelFav: ({ item_id }) => dispatch({ type: 'member/delFav', payload: { item_id } })
}))
export default class WgtGoods extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  constructor (props) {
    super(props)

    this.state = {
      curIdx: 0,
      is_fav: false,
      count: 0
    }
  }

  handleClickItem = (id) => {
    Taro.navigateTo({
      url: `/pages/item/espier-detail?id=${id}`
    })
  }

  handleSwiperChange = (e) => {
    const { current  } = e.detail

    this.setState({
      curIdx: current
    })
  }

  /*handleClickOperate = async (item_data, type, e) => {
    e.stopPropagation()
    if(type === 'collect') {
      if(this.state.count === 0) {
        let is_fav = Boolean(this.props.favs[item_data.item_id])
        this.setState({
          count: 1,
          is_fav
        })
      }
      if(!this.state.is_fav) {
        await api.member.addFav(item_data.item_id)
        this.props.onAddFav(item_data)
        console.log(this.props.favs,this.props.favs[1192], 51,'addafter')
        Taro.showToast({
          title: '已加入收藏',
          icon: 'none'
        })
      } else {
        await api.member.delFav(item_data.item_id)
        this.props.onDelFav(item_data)
        console.log(this.props.favs, 51,'delafter')
        Taro.showToast({
          title: '已移出收藏',
          icon: 'none'
        })
      }
      this.setState({
        is_fav: !this.state.is_fav
      })
    }

    if(type === 'buy') {
      try {
        await api.cart.add({
          item_id:item_data.item_id,
          num: 1
        })
      } catch (e) {
        console.log(e)
      }

      Taro.showToast({
        title: '成功加入购物车',
        icon: 'success'
      })
    }
  }*/

  handleClickOperate = (item) => {
    Taro.navigateToMiniProgram({
      appId: 'wxf91925e702efe3e3', // 要跳转的小程序的appid
      path: `pages/recommend/detail?id=${item.item_id}`, // 跳转的目标页面
      success(res) {
        // 打开成功
        console.log(res)
      }
    })
  }

  render () {
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
          {
            data.map(item => {
              return (
                <View className='goods-content' key={item.item_id} onClick={this.handleClickItem.bind(this, item.item_id)}>
                  <View className='goods-content__info'>
                    <View className='goods-content__info_img'>
                      <Image className='img-style' mode='aspectFill' src={item.img_url} />
                    </View>
                    <View className='goods-content__info_text'>
                      <Text>{item.item_name}</Text>
                      <Text>点击查看产品详情</Text>
                      <View>
                        <Text className='in-icon in-icon-yuangong'></Text>
                        <Text>{item.sales}</Text>
                      </View>
                    </View>
                  </View>
                  <View className='goods-content__operate'>
                    <View className='goods-content__operate_btn' onClick={this.handleClickOperate.bind(this, item, 'collect')}>{is_fav ? '移除心愿' : '加入心愿'}</View>
                    <Text>|</Text>
                    <View className='goods-content__operate_btn' onClick={this.handleClickOperate.bind(this, item, 'buy')}>加入购买</View>
                  </View>
                </View>
              )
            })
          }
        </View>
      </View>
    )
  }
}
