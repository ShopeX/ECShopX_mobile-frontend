/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Image, Input } from '@tarojs/components'
import { connect } from 'react-redux'
import { $t } from '@/i18n'
import api from '@/api'
// import { classNames, pickBy } from '@/utils'
import './coupon-detail.scss'

class CouponDetail extends Component {
  $instance = getCurrentInstance() || {}
  constructor(props) {
    super(props)

    this.state = {
      curStore: '',
      curBranchStore: '',
      code: '',
      curindex: 0,
      storeDialogShow: false,
      show: true,
      beginX: 0,
      beginY: 0,
      lastX: 0,
      lastY: 0,
      storeList: [],
      params: {
        code: '',
        card_id: '',
        shop_id: '',
        verify_code: '',
        remark_amount: '',
        consume_outer_str: ''
      },
      cardCode: {},
      cardDetail: {},
      cardInfo: {},
      showCodeInput: false
    }
  }

  componentDidMount() {
    this.fetch()
  }

  async fetch() {
    const { card_id, code } = this.$instance?.router?.params
    const params = {
      card_id,
      code
    }
    const { detail, card_code, card_info, shop_list } = await api.member.getCardDetail(params)
    if (detail.status == 2) {
      this.setState({
        show: false
      })
    }

    params.shop_id = shop_list.list[0].wxShopId

    this.setState({
      cardCode: card_code,
      cardInfo: card_info,
      storeList: shop_list.list,
      curStore: shop_list.list[0].companyName,
      curBranchStore: shop_list.list[0].storeName,
      params
    })

    if (card_info && card_info['use_scenes'] == 'SELF' && card_info.self_consume_code > 0) {
      this.setState({
        showCodeInput: true
      })
    }
  }

  chooseStore = () => {
    const { storeDialogShow } = this.state

    this.setState({
      storeDialogShow: !storeDialogShow
    })
  }

  storeTap = (item, index) => {
    this.setState({
      curindex: index,
      curStore: item.companyName,
      curBranchStore: item.storeName,
      storeDialogShow: false,
      params: {
        shop_id: item.wxShopId
      }
    })
  }

  handletouchtart = (event) => {
    this.setState({
      beginX: event.touches[0].pageX,
      beginY: event.touches[0].pageY
    })
  }

  handletouchmove = (event) => {
    this.setState({
      lastX: event.touches[0].pageX,
      lastY: event.touches[0].pageY
    })
  }

  handletouchend = (event) => {
    let { lastX, beginX, showCodeInput, params } = this.state
    if (lastX < beginX) return
    if (showCodeInput && !params.verify_code) {
      Taro.showModal({
        title: $t('61e2d21a.02d981'),
        content: $t('3ca883d0.d0c06a')
      })
      return false
    }
    params.consume_outer_str = '用户自助核销'
    this.setState(
      {
        params
      },
      async () => {
        const res = await api.member.userUsedCard(params)
        if (res.error) {
          Taro.showModal({
            title: $t('61e2d21a.02d981'),
            content: res.error.message
          })
          return false
        } else {
          this.setState({
            show: false
          })
        }
      }
    )
  }

  inputBlur = (e) => {
    let { params } = this.state
    params.verify_code = e.detail.value

    this.setState({
      params
    })
  }

  handleClickTab = (idx) => {
    if (this.state.page.isLoading) return

    if (idx !== this.state.curTabIdx) {
      this.resetPage()
      this.setState({
        list: []
      })
    }

    this.setState(
      {
        curTabIdx: idx
      },
      () => {
        this.nextPage()
      }
    )
  }

  render() {
    const { colors } = this.props
    const {
      cardInfo,
      curStore,
      curBranchStore,
      showCodeInput,
      curindex,
      show,
      storeList,
      storeDialogShow
    } = this.state

    return (
      <View>
        {cardInfo.use_scenes && (
          <View className='page-coupon-detail' style={'background: ' + colors.data[0].marketing}>
            {cardInfo.use_scenes !== 'SELF' && cardInfo.use_scenes !== 'SWEEP' && (
              <View className='sweep-coupon-box'>
                <View className='content-padded card-header'>
                  <View className='qrcode'>
                    <View className='qrcode-num'>{$t('1c525225.6e77e7')}</View>
                  </View>
                </View>
              </View>
            )}

            {cardInfo.use_scenes == 'SELF' && (
              <View className='store-box'>
                <View className='view-flex' onClick={this.chooseStore.bind(this)}>
                  <View className='view-flex-item'>{$t('1c525225.86c570')}</View>
                  <View className='view-flex-item content-right cur-store'>
                    {curBranchStore}
                    <View className={`arrow-right${storeDialogShow ? ' down' : ''}`}></View>
                  </View>
                </View>
                <View className={`store-list ${storeDialogShow ? 'act' : ''}`}>
                  {storeList.map((item, index) => (
                    <View
                      className={`store-item ${curindex === index ? 'cur' : ''}`}
                      onClick={this.storeTap.bind(this, item, index)}
                    >
                      <View className='content-padded'>
                        {item.companyName} ({item.storeName})
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
            {cardInfo.use_scenes == 'SWEEP' && (
              <View className='sweep-coupon-box'>
                <View className='content-padded card-header'>
                  <View className='qrcode'>
                    <Image className='qrcode-img' src={cardCode.qrcode_url} mode='aspectFill' />
                    <View className='qrcode-num'>{cardCode.code}</View>
                  </View>
                </View>
              </View>
            )}
            {cardInfo.use_scenes == 'SELF' && (
              <View className='coupon-box'>
                <View
                  className='content-padded card-header'
                  style={`background: radial-gradient(circle at bottom, transparent 3px, ${colors.data[0].primary} 3px); background-size: 20rpx 100%;`}
                >
                  <View className='hr'>
                    <View className='card-title'>{$t('1c525225.e6f169')}</View>
                    <View className='card-val'>{curStore}</View>
                  </View>
                  <View className='hr'>
                    <View className='card-title'>{$t('1c525225.d16b08')}</View>
                    <View className='card-val'>{curBranchStore}</View>
                  </View>
                  {showCodeInput && (
                    <View>
                      <View className='card-title'>{$t('1c525225.983f59')}</View>
                      <View className='card-val'>
                        <Input
                          type='number'
                          focus
                          onInput={this.inputBlur.bind(this)}
                          placeholder={$t('3ca883d0.d0c06a')}
                          maxlength='4'
                          confirm-type='done'
                        />
                      </View>
                    </View>
                  )}
                  <View className={`icon-used use-icon ${show ? '' : 'show'}`}></View>
                  <View
                    className='card-decorate'
                    style={`background:  ${colors.data[0].marketing};`}
                  ></View>
                </View>
                <View
                  className={`content-padded card-footer ${show ? '' : 'act'}`}
                  onTouchStart={this.handletouchtart.bind(this)}
                  onTouchMove={this.handletouchmove.bind(this)}
                  onTouchEnd={this.handletouchend.bind(this)}
                >
                  <View className='gray remind-txt'>{$t('1c525225.a48820')}</View>
                  <View className='view-flex'>
                    <View className='view-flex-item red'>{$t('1c525225.fd7607')}</View>
                    <View className='view-flex-item content-right'>
                      {/* <Image src={require('../images/code.png')} /> */}
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    )
  }
}

export default connect(({ colors }) => ({
  colors: colors.current
}))(withTranslation()(CouponDetail))
