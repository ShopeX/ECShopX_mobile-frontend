/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { REFUND_STATUS } from '@/consts'
import { formatTime, isWeb } from '@/utils'
import { Loading, SpHtml } from '@/components'
import { FloatMenuMeiQia } from '@/subpages/components'
import api from '@/api'
import { $t, ti } from '@/i18n'
import './refund-detail.scss'

const REFUND_DETAIL_STATUS_KEYS = [
  'a2ba615a.d89d86',
  'a2ba615a.b276ad',
  'a2ba615a.6b28d0',
  'a2ba615a.df5eee',
  'a2ba615a.529daf',
  'a2ba615a.771b8b',
  'a2ba615a.714e43',
  'a2ba615a.1c0852',
  'a2ba615a.74759b',
  'a2ba615a.73ce8f'
]

class TradeRefundDetail extends Component {
  $instance = getCurrentInstance() || {}
  constructor(props) {
    super(props)

    this.state = {
      info: null,
      progress: 0,
      aftersalesAddress: {},
      remind: {}
    }
  }

  componentDidMount() {
    this.fetch()
  }

  async fetch() {
    const { aftersales_bn, item_id, order_id } = this.$instance?.router?.params
    // const { detail: info, order_info:orderInfo,progress,reason} = await api.aftersales.info({
    //   aftersales_bn,
    //   item_id,
    //   order_id
    // })
    const info = await api.aftersales.info({
      aftersales_bn,
      item_id,
      order_id
    })
    let prog = +info.progress
    info.status_str = REFUND_STATUS()[String(prog)]
    info.creat_time_str = formatTime(info.create_time * 1000, 'YYYY-MM-DD HH:mm')
    let remind = await api.aftersales.remindDetail()

    this.setState({
      remind,
      //orderInfo,
      info,
      progress: Number(prog),
      aftersalesAddress: info.aftersales_address
    })
  }

  handleBtnClick = async (type) => {
    const { aftersales_bn, order_id, item_id } = this.state.info

    if (type === 'cancel') {
      Taro.showLoading({
        mask: true
      })
      try {
        await api.aftersales.close({ aftersales_bn })
        this.fetch()
      } catch (e) {
        console.log(e)
      }

      Taro.hideLoading()
    }

    if (type === 'edit') {
      Taro.navigateTo({
        url: `/subpages/community/trade/refund?aftersales_bn=${aftersales_bn}&order_id=${order_id}&item_id=${item_id}`
      })
    }

    if (type === 'refund') {
      Taro.navigateTo({
        url: `/subpages/community/trade/refund?order_id=${order_id}&item_id=${item_id}`
      })
    }

    if (type === 'refund_send') {
      Taro.navigateTo({
        url: `/subpages/community/trade/refund-sendback?aftersales_bn=${aftersales_bn}`
      })
    }
  }
  onCopy = () => {
    const { aftersales_address, aftersales_contact, aftersales_mobile } =
      this.state.info.aftersales_address
    Taro.setClipboardData({
      data: aftersales_address + aftersales_contact + aftersales_mobile
    })
  }

  render() {
    const { info, remind, progress, aftersalesAddress } = this.state
    const meiqia = Taro.getStorageSync('meiqia')
    const echat = Taro.getStorageSync('echat')

    const status = progress >= 0 && progress <= 9 ? $t(REFUND_DETAIL_STATUS_KEYS[progress]) : ''

    if (!info) {
      return <Loading />
    }
    //console.log('orderorderInfo===>',orderInfo)

    return (
      <View className='trade-refund-detail'>
        <View className='refund-status'>
          <Text className='refund-status__text text-status'>{status}</Text>
          {(progress == 1 || progress == 2) && info.aftersales_address && (
            <View className='aftersalesAddress'>
              {info.aftersales_address.aftersales_address ? (
                <View className='contact'>
                  <View className='site'>
                    {ti('a2ba615a.00fe37', [info.aftersales_address.aftersales_address])}
                  </View>
                  <View className='copy' onClick={this.onCopy}>
                    {' '}
                    {$t('a2ba615a.79d3ab')}
                  </View>
                </View>
              ) : (
                <View className='address'>{$t('a2ba615a.516643')}</View>
              )}

              {info.aftersales_address.aftersales_address && (
                <View className='contact'>
                  <View>{ti('a2ba615a.0773f6', [info.aftersales_address.aftersales_contact])}</View>
                  <View>{ti('a2ba615a.b5e3f6', [info.aftersales_address.aftersales_mobile])}</View>
                </View>
              )}
            </View>
          )}
        </View>
        <View className='refund-detail'>
          {progress == 0 ? (
            <Text className='refund-detail__title'>{$t('a2ba615a.538bb2')}</Text>
          ) : null}
          {progress == 7 ? (
            <Text className='refund-detail__title'>{$t('a2ba615a.c93711')}</Text>
          ) : null}
          <Text className='refund-detail__descr'>{info.description || ''}</Text>
          {progress == 0 ? (
            <View>
              {/* <Text className='refund-detail__btn' onClick={this.handleBtnClick.bind(this, 'edit')}>修改申请</Text> */}
              <Text
                className='refund-detail__btn refund-detail__cancel'
                onClick={this.handleBtnClick.bind(this, 'cancel')}
              >
                {$t('a2ba615a.eaffc1')}
              </Text>
            </View>
          ) : null}
          {/* {
            (progress == 3 || progress == 5)
              ? <View>
                  <Text className='refund-detail__btn' onClick={this.handleBtnClick.bind(this, 'refund')}>再次申请</Text>

                </View>
              : null
          } */}
          {progress == 1 ? (
            <View>
              <Text
                className='refund-detail__btn'
                onClick={this.handleBtnClick.bind(this, 'refund_send')}
              >
                {$t('a2ba615a.f33f84')}
              </Text>
              <Text
                className='refund-detail__btn refund-detail__cancel'
                onClick={this.handleBtnClick.bind(this, 'cancel')}
              >
                {$t('a2ba615a.eaffc1')}
              </Text>
            </View>
          ) : null}
        </View>
        {/*<View className='refund-info'>
          <View className='refund-info__num'>
            <Text className='refund-info__text'>商品数量：</Text>
            <Text className='refund-info__text text-primary'>3</Text>
          </View>
          <View className='refund-info__num'>
            <Text className='refund-info__text'>退款金额：</Text>
            <View>
              <Text className='refund-info__text text-primary'>300</Text>
              <Text className='refund-info__text'>(含发货邮费￥300)</Text>
            </View>
          </View>
        </View>*/}
        <View className='refund-detail-info'>
          <View className='info-name'>
            {$t('a2ba615a.b2b6cd')}
            <Text className='info-value'>{info.reason}</Text>
          </View>
          <View className='info-name'>
            {$t('a2ba615a.402d96')}
            <Text className='info-value'>{info.creat_time_str}</Text>
          </View>
          <View className='info-name'>
            {$t('a2ba615a.fa26c2')}
            <Text className='info-value'>{info.aftersales_bn}</Text>
          </View>
          {info.refuse_reason && (
            <View className='info-name'>
              {$t('a2ba615a.2ece94')}
              <Text className='info-value'>{info.refuse_reason}</Text>
            </View>
          )}
          {progress === 1 ? (
            <View>
              {aftersalesAddress.contact ? (
                <View className='info-name'>
                  {$t('a2ba615a.4cce06')}
                  <Text className='info-value'>{aftersalesAddress.contact}</Text>
                </View>
              ) : null}
              {aftersalesAddress.mobile ? (
                <View className='info-name'>
                  {$t('a2ba615a.829cd2')}
                  <Text className='info-value'>{aftersalesAddress.mobile}</Text>
                </View>
              ) : null}
              {aftersalesAddress.address ? (
                <View className='info-name'>
                  {$t('a2ba615a.df89a7')}
                  <Text className='info-value'>{aftersalesAddress.address}</Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
        {remind && remind.is_open && (
          <View className='remind-wrap'>
            <Text className='biao-icon biao-icon-tishi'> {$t('a2ba615a.be1476')}</Text>

            <View className='remind-text'>
              <SpHtml className='goods-detail__content' content={remind.intro} />
            </View>
          </View>
        )}
        {(!isWeb && meiqia.is_open === 'true') || echat.is_open === 'true' ? (
          <FloatMenuMeiQia
            storeId={info.distributor_id}
            info={{ orderId: info.order_id }}
            isFloat={false}
          >
            <Button className='refund-detail-btn'>{$t('a2ba615a.b66060')}</Button>
          </FloatMenuMeiQia>
        ) : (
          <Button openType='contact' className='refund-detail-btn'>
            {$t('a2ba615a.b66060')}
          </Button>
        )}
        {/*
          <View className='refund-status'>
          {
            (progress == 0 || progress == 1 || progress == 3 || progress == 5)
              ? <Icon size='50' type='waiting'></Icon>
              : (progress == 2 || progress == 4)
                ? <Icon size='50' type='cancel'></Icon>
                : <Icon size='50' type='success'></Icon>
          }
          <View class='refund-reason'>{info.status_str}</View>
          <View class='trade-bn'>退款编号：{info.aftersales_bn}</View>
        </View>

        <View className='refund-detail'>
          {orderInfo.pay_type === 'point'
            ? (<SpCell title='退款积分'>
                <Price noSymbol noDecimal value={orderInfo.point}></Price>
              </SpCell>)
            : (<SpCell title='退款金额'>
                <Price value={orderInfo.item_fee} unit='cent'></Price>
              </SpCell>)
          }

          <SpCell title='退款类型'>
            <Text>{info.aftersales_type === 'ONLY_REFUND' ? '仅退款' : '退款退货'}</Text>
          </SpCell>
          <SpCell title='退款理由'>
            <Text>{info.reason}</Text>
          </SpCell>
          {(progress == 3 || progress == 5) && (
            <SpCell title='驳回原因'>
              <Text>{info.refuse_reason}</Text>
            </SpCell>
          )}
          <SpCell title='问题描述'>
            <Text>{info.description}</Text>
          </SpCell>
        </View>

        {progress == 0 && (
          <View className='toolbar'>
            <AtButton type='secondary' circle onClick={this.handleBtnClick.bind(this, 'cancel')}>撤销申请</AtButton>
            <AtButton type='primary' circle onClick={this.handleBtnClick.bind(this, 'edit')}>修改申请</AtButton>
          </View>
        )}
        {(progress == 3 || progress == 5) && (
          <View className='toolbar'>
            <AtButton type='secondary' circle onClick={this.handleBtnClick.bind(this, 'cancel')}>撤销申请</AtButton>
            <AtButton type='primary' circle onClick={this.handleBtnClick.bind(this, 'refund')}>再次申请</AtButton>
          </View>
        )}
        {progress == 1 && (
          <View className='toolbar'>
            <AtButton type='secondary' circle onClick={this.handleBtnClick.bind(this, 'cancel')}>撤销申请</AtButton>
            <AtButton type='primary' circle onClick={this.handleBtnClick.bind(this, 'refund_send')}>填写物流信息</AtButton>
          </View>
        )}*/}
        {/* <FloatMenus>
        {
          meiqia.is_open === 'meiqia'
            ? <FloatMenuMeiQia storeId={orderInfo.distributor_id} info={{orderId: orderInfo.order_id}} />
            : <FloatMenuItem
              iconPrefixClass='icon'
              icon='headphones'
              openType='contact'
            />
          }
        </FloatMenus> */}
      </View>
    )
  }
}

export default withTranslation()(TradeRefundDetail)
