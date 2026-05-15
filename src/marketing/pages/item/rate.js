/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { withTranslation } from 'react-i18next'
import { Loading, SpButton, SpPage } from '@/components'
import { $t, ti } from '@/i18n'
import api from '@/api'
import { connect } from 'react-redux'
import { pickBy } from '@/utils'
import { AtRate, AtTextarea, AtImagePicker } from 'taro-ui'
import imgUploader from '@/utils/upload'
import './rate.scss'

class TradeRate extends Component {
  $instance = getCurrentInstance() || {}
  constructor(props) {
    super(props)

    this.state = {
      id: null,
      goodsList: [],
      anonymousStatus: 0
    }
  }

  componentDidMount() {
    this.syncNavTitle()
    this.fetch()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.i18n?.language !== this.props.i18n?.language) {
      this.syncNavTitle()
    }
  }

  syncNavTitle = () => {
    Taro.setNavigationBarTitle({ title: $t('df47be63.da0f48') })
  }

  async fetch() {
    const { id } = this.$instance?.router?.params
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

  handleChangeComment(index, value, e) {
    // value在H5端有bug 所以还是用e.detail.value 的方式！
    console.log(e.detail.value)
    const { goodsList } = this.state
    goodsList[index].content = e.detail.value
    this.setState({
      goodsList
    })
    console.log(goodsList)
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
        title: $t('5ac73b37.2698f6'),
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
    let errKey = ''
    for (let item of goodsList) {
      if (!errKey) {
        if (!item.star) {
          errKey = 'df47be63.d7b5b0'
          break
        }
        if (!item.content) {
          errKey = '5ac73b37.80fff1'
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

    if (errKey) {
      Taro.showToast({
        title: $t(errKey),
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
    console.log(goodsList)

    return (
      <SpPage>
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
                    <Text className='title'>{$t('df47be63.d58254')}</Text>
                    <AtRate
                      size='21'
                      value={item.star}
                      onChange={this.handleChange.bind(this, idx)}
                    />
                    <Text className='rate-num'>
                      {ti('5ac73b37.27d44c', [item.star ? item.star + '.0' : 0])}
                    </Text>
                  </View>

                  <View className='comment-wrap'>
                    <AtTextarea
                      count={false}
                      value={item.content}
                      onChange={this.handleChangeComment.bind(this, idx)}
                      maxLength={500}
                      placeholderStyle='color: #a6a6a6;'
                      placeholder={$t('df47be63.f481db')}
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
            <SpButton
              resetText={$t('df47be63.b15e37')}
              confirmText={$t('5ac73b37.04c8ea')}
              onConfirm={this.handleClickSubmit.bind(this, false)}
              onReset={this.handleClickSubmit.bind(this, true)}
            ></SpButton>
          </View>
        </View>
      </SpPage>
    )
  }
}

export default connect(
  ({ colors }) => ({
    colors: colors.current
  }),
  () => ({})
)(withTranslation()(TradeRate))
