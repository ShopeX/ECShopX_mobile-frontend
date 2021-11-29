import React, { Component } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components'
import { Loading } from '@/components'
import api from '@/api'
import { withLogin } from '@/hocs'
import { connect } from 'react-redux'
import { pickBy } from '@/utils'
import { AtRate, AtTextarea, AtImagePicker } from 'taro-ui'
import imgUploader from '@/utils/upload'

import './rate.scss'

@connect(
  ({ colors }) => ({
    colors: colors.current
  }),
  () => ({})
)
@withLogin()
export default class TradeRate extends Component {
  $instance = getCurrentInstance();
  constructor(props) {
    super(props)

    this.state = {
      id: null,
      goodsList: [],
      anonymousStatus: 0
    }
  }

  componentDidMount() {
    this.fetch()
  }

  async fetch() {
    const { id } = this.$instance.router.params
    const data = await api.trade.detail(id)

    Taro.showLoading({
      mask: true
    })
    const info = pickBy(data.orderInfo, {
      orders: ({ items }) =>
        pickBy(items, {
          item_id: 'item_id',
          item_spec_desc: 'item_spec_desc',
          pic_path: 'pic',
          title: 'item_name',
          price: ({ item_fee }) => (+item_fee / 100).toFixed(2),
          num: 'num',
          star: 0,
          content: '',
          pics: []
        }),
      logistics_items: ({ logistics_items = [] }) =>
        pickBy(logistics_items, {
          item_id: 'item_id',
          item_spec_desc: 'item_spec_desc',
          pic_path: 'pic',
          title: 'item_name',
          price: ({ item_fee }) => (+item_fee / 100).toFixed(2),
          num: 'num',
          star: 0,
          content: '',
          pics: []
        })
    })
    Taro.hideLoading()
    const orders = [...info.orders, ...info.logistics_items]
    let goodsList = []
    let giftList = []
    if (orders && orders.length > 0) {
      orders.map((item) => {
        if (item.order_item_type !== 'gift') {
          goodsList.push(item)
        } else {
          giftList.push(item)
        }
      })
    }

    this.setState({
      goodsList,
      id
    })
  }

  handleChange(index, value) {
    const { goodsList } = this.state
    goodsList[index].star = value
    this.setState({
      goodsList
    })
  }

  handleClickCheckbox = () => {
    let { anonymousStatus } = this.state
    this.setState({
      anonymousStatus: anonymousStatus ? 0 : 1
    })
  }

  handleChangeComment(index, e) {
    const { goodsList } = this.state
    goodsList[index].content = e
    this.setState({
      goodsList
    })
  }

  handleImageChange = async (index, files, type) => {
    const { goodsList } = this.state
    if (type === 'remove') {
      goodsList[index].pics = files
      this.setState({
        goodsList
      })

      return
    }

    if (files.length > 6) {
      Taro.showToast({
        title: '最多上传6张图片',
        icon: false
      })
      return
    }
    const imgFiles = files.slice(0, 6)
    const results = await imgUploader.uploadImageFn(imgFiles)
    goodsList[index].pics = results
    this.setState({
      goodsList
    })
  }

  handleClickSubmit = async (anonymousStatus = false) => {
    const { goodsList, id } = this.state
    let rates = []
    let errText = ''
    for (let item of goodsList) {
      if (!errText) {
        if (!item.star) {
          errText = '请打分'
          break
        }
        if (!item.content) {
          errText = '评价内容不能为空'
          break
        }
      }

      let pics = []
      item.pics.map((pic) => {
        pics.push(pic.url)
      })
      rates.push({
        item_id: item.item_id,
        content: item.content,
        star: item.star,
        pics
      })
    }

    if (errText) {
      Taro.showToast({
        title: errText,
        icon: 'none'
      })
      return
    }

    let params = {
      order_id: id,
      anonymous: anonymousStatus,
      rates
    }
    console.log('-----', params)
    Taro.showLoading({
      mask: true
    })
    await api.trade.createOrderRate(params)
    Taro.hideLoading()
    Taro.navigateTo({
      url: `/marketing/pages/item/success`
    })
  }

  // TODO: 确认原有功能
  render() {
    const { goodsList } = this.state

    const { colors } = this.props

    if (!goodsList.length) {
      return <Loading />
    }

    return (
      <View className='trade-rate'>
        <View className='rate-list'>
          {goodsList.map((item, idx) => {
            return (
              <View className='rate-item' key={item.item_id}>
                <View className='goods-item'>
                  <View className='goods-item__hd'>
                    <Image
                      mode='aspectFill'
                      className='goods-item__img'
                      src={Array.isArray(item.pic_path) ? item.pic_path[0] : item.pic_path}
                    />
                  </View>
                  <View className='goods-item__bd'>{item.title}</View>
                </View>
                <View className='rate-wrap'>
                  <Text className='title'>商品评价</Text>
                  <AtRate
                    size='21'
                    value={item.star}
                    onChange={this.handleChange.bind(this, idx)}
                  />
                  <Text className='rate-num'>{item.star ? item.star + '.0' : 0}分</Text>
                </View>

                <View className='comment-wrap'>
                  <AtTextarea
                    count={false}
                    value={item.content}
                    onChange={this.handleChangeComment.bind(this, idx)}
                    maxLength={500}
                    placeholderStyle='color: #a6a6a6;'
                    placeholder='快分享您的使用新得吧～（请输入评价内容）'
                  />
                  <View className='upload-imgs'>
                    <AtImagePicker
                      multiple
                      mode='aspectFill'
                      count={6}
                      length={4}
                      files={item.pics}
                      showAddBtn={item.pics.length !== 6}
                      onChange={this.handleImageChange.bind(this, idx)}
                    ></AtImagePicker>
                  </View>
                </View>
              </View>
            )
          })}
        </View>

        <View className='submit-btn'>
          <View className='btn noname' onClick={this.handleClickSubmit.bind(this, true)}>
            匿名评价
          </View>
          <View
            className='btn name'
            style={`background: ${colors.data[0].primary}`}
            onClick={this.handleClickSubmit.bind(this, false)}
          >
            立即评价
          </View>
        </View>
      </View>
    )
  }
}
