/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, Navigator, Button } from '@tarojs/components'
import { connect } from 'react-redux'
import { Loading, SpPage, SpPoster } from '@/components'
import api from '@/api'
import { pickBy, classNames, isArray } from '@/utils'
import { withTranslation } from 'react-i18next'
import { $t } from '@/i18n'
import './index.scss'

const ADAPAY_STATUS_I18N = {
  unverified: 'd13c0ad1.e1fcc6',
  auditing: 'd13c0ad1.b720a6',
  failed: 'd13c0ad1.b11996',
  verified: 'd13c0ad1.6eaa14'
}

class DistributionDashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      info: null,
      showPoster: false,
      poster: null,
      posterImgs: null,
      adapay_status_key: null
    }
  }

  componentDidMount() {
    const { colors } = this.props
    Taro.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: colors.data[0].marketing
    })
    this.syncNavTitle()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.i18n?.language !== this.props.i18n?.language) {
      this.syncNavTitle()
    }
  }

  syncNavTitle = () => {
    Taro.setNavigationBarTitle({ title: $t('d13c0ad1.ed7e63') })
  }

  componentDidShow() {
    this.getAdapayInfo()
    this.fetch()
  }

  async fetch() {
    const resUser = Taro.getStorageSync('userinfo')
    const { username, avatar } = resUser

    const res = await api.distribution.dashboard()
    const base = pickBy(res, {
      itemTotalPrice: 'itemTotalPrice',
      cashWithdrawalRebate: 'cashWithdrawalRebate',
      promoter_order_count: 'promoter_order_count',
      promoter_grade_order_count: 'promoter_grade_order_count',
      rebateTotal: 'rebateTotal',
      isbuy_promoter: 'isbuy_promoter',
      notbuy_promoter: 'notbuy_promoter',
      taskBrokerageItemTotalFee: 'taskBrokerageItemTotalFee',
      pointTotal: 'pointTotal',
      taskBrokerageItemTotalPoint: 'taskBrokerageItemTotalPoint'
    })

    const promoter = await api.distribution.info()
    const pInfo = pickBy(promoter, {
      shop_name: 'shop_name',
      shop_pic: 'shop_pic',
      is_open_promoter_grade: 'is_open_promoter_grade',
      promoter_grade_name: 'promoter_grade_name',
      isOpenShop: 'isOpenShop',
      shop_status: 'shop_status',
      reason: 'reason',
      qrcode_bg_img: 'qrcode_bg_img',
      disabled: 'disabled'
    })
    const res2 = await api.member.hfpayUserApply()
    const userInfo = pickBy(res2, {
      applyStatus: 'status'
    })
    const res3 = await api.member.getIsHf()
    let isHf = res3.hfpay_version_status
    const info = { username, avatar, ...base, ...pInfo, ...userInfo, isHf }

    this.setState({ info })
  }

  async getAdapayInfo() {
    const { cert_status } = await api.distribution.adapayCert()
    let adapay_status_key = null
    if (isArray(cert_status)) {
      adapay_status_key = 'unverified'
    } else if (cert_status.audit_state == 'A') {
      adapay_status_key = 'auditing'
    } else if (
      cert_status.audit_state == 'B' ||
      cert_status.audit_state == 'C' ||
      cert_status.audit_state == 'D'
    ) {
      adapay_status_key = 'failed'
    } else if (cert_status.audit_state == 'E') {
      adapay_status_key = 'verified'
    }
    this.setState({ adapay_status_key })
  }

  handleOpenApply() {
    Taro.showModal({
      title: $t('d13c0ad1.073e6a'),
      content: $t('d13c0ad1.fd5b1d'),
      cancelText: $t('d13c0ad1.625fb2'),
      confirmText: $t('d13c0ad1.38cf16')
    }).then((res) => {
      if (res.confirm) {
        api.distribution.update({ shop_status: 2 }).then((res) => {
          if (res.status) {
            Taro.showToast({
              title: $t('d13c0ad1.de0136'),
              icon: 'none',
              duration: 2000
            }).then((res) => this.fetch())
          }
        })
      }
    })
  }

  onShareAppMessage() {
    const extConfig = wx.getExtConfigSync
      ? wx.getExtConfigSync()
      : { wxa_name: process.env.APP_MAP_NAME }
    const { userId } = Taro.getStorageSync('userinfo')
    const { info } = this.state
    return {
      title: extConfig.wxa_name,
      imageUrl: info.shop_pic,
      path: `/pages/index?uid=${userId}`
    }
  }

  handleClick = async () => {
    this.setState({
      showPoster: true
    })
  }

  render() {
    const { colors } = this.props
    const { info, showPoster, adapay_status_key } = this.state
    if (!info) {
      return <Loading />
    }
    return (
      <SpPage className='page-distribution-index'>
        <View className='header' style={'background: ' + colors.data[0].marketing}>
          <View className='view-flex view-flex-middle'>
            <Image
              className='header-avatar'
              src={info.avatar || `${process.env.APP_IMAGE_CDN}/user_icon.png`}
              mode='aspectFill'
            />
            <View className='header-info view-flex-item'>
              {info.username}
              {info.is_open_promoter_grade && <Text>（{info.promoter_grade_name}）</Text>}
            </View>
            <Navigator
              className='view-flex view-flex-middle'
              url='/marketing/pages/distribution/setting'
            >
              <Text className='iconfont icon-info'></Text>
            </Navigator>
          </View>
          {info.isOpenShop && info.shop_status === 0 ? (
            <View className='mini-store-apply' onClick={this.handleOpenApply.bind(this)}>
              {$t('c63b7c0f.64a566')}
            </View>
          ) : null}
          {info.isOpenShop && info.shop_status === 4 ? (
            <View>
              <View className='mini-store-apply' onClick={this.handleOpenApply.bind(this)}>
                {$t('c63b7c0f.8ac7a8')}
              </View>
              <View className='mini-store-reason'>
                {$t('c63b7c0f.94903e')}
                {info.reason}
              </View>
            </View>
          ) : null}
          {info.isOpenShop && info.shop_status === 2 && (
            <View className='mini-store-apply'>{$t('c63b7c0f.50cae9')}</View>
          )}
        </View>
        {info.applyStatus != 3 && info.isHf ? (
          <View className='bandCardInfo'>
            <View className='iconfont icon-info'></View>
            <View className='info'>
              <View className='title'>{$t('d13c0ad1.d7078c')}</View>
              <View className='content'>{$t('d13c0ad1.541e74')}</View>
            </View>
          </View>
        ) : null}
        <View className='section achievement'>
          <View className='section-body view-flex'>
            <View className='view-flex-item content-center'>
              <View className='amount'>
                <Text className='count'>{info.itemTotalPrice / 100}</Text>
                {$t('c63b7c0f.c16655')}
              </View>
              <View>{$t('c63b7c0f.422c8d')}</View>
            </View>
            <View className='view-flex-item content-center'>
              <View className='amount'>
                <Text className='count'>{info.cashWithdrawalRebate / 100}</Text>
                {$t('c63b7c0f.c16655')}
              </View>
              <View>{$t('c63b7c0f.f7e761')}</View>
            </View>
          </View>
        </View>
        <View className='section analysis'>
          <View className='section-body view-flex content-center'>
            <Navigator
              className='view-flex-item'
              hover-class='none'
              url='/marketing/pages/distribution/trade?type=order'
            >
              <View className='iconfont icon-list3 icon-fontsize' />
              <View className='label'>{$t('c63b7c0f.793dd6')}</View>
              <View>{info.promoter_order_count}</View>
            </Navigator>
            <Navigator
              className='view-flex-item'
              hover-class='none'
              url='/marketing/pages/distribution/trade?type=order_team'
            >
              <View className='iconfont icon-list2 icon-fontsize' />
              <View className='label'>{$t('c63b7c0f.59ff88')}</View>
              <View>{info.promoter_grade_order_count}</View>
            </Navigator>
            <Navigator
              className='view-flex-item'
              hover-class='none'
              url='/marketing/pages/distribution/statistics'
            >
              <View className='iconfont icon-money icon-fontsize' />
              <View className='label'>{$t('c63b7c0f.b11898')}</View>
              <View className='mark'>{info.rebateTotal / 100}</View>
            </Navigator>
          </View>
        </View>
        <View className='section'>
          <Navigator
            className='section-title with-border view-flex view-flex-middle'
            url={`/marketing/pages/distribution/subordinate?hasBuy=${info.isbuy_promoter}&noBuy=${info.notbuy_promoter}`}
          >
            <View className='view-flex-item'>{$t('d13c0ad1.fed338')}</View>
            <View className='iconfont icon-arrowRight icon-right'></View>
          </Navigator>
          <View className='content-padded-b view-flex content-center member'>
            <View className='view-flex-item'>
              {$t('c63b7c0f.20566a')} <Text className='mark'>{info.isbuy_promoter}</Text>{' '}
              {$t('c63b7c0f.465afe')}
            </View>
            <View className='view-flex-item'>
              {$t('c63b7c0f.9a3819')} <Text className='mark'>{info.notbuy_promoter}</Text>{' '}
              {$t('c63b7c0f.465afe')}
            </View>
          </View>
        </View>
        <View className='section list share'>
          {info.disabled == 0 && (
            <View className='list-item' onClick={this.handleClick}>
              <View className='iconfont icon-qrcode1 icon-fontsize' />
              <View className='list-item-txt'>{$t('c63b7c0f.4a86cd')}</View>
              <View className='iconfont icon-arrowRight icon-right' />
            </View>
          )}
          <Navigator
            className='list-item'
            open-type='navigateTo'
            url={`/marketing/pages/distribution/goods?status=${
              info.isOpenShop && info.shop_status === 1
            }`}
          >
            <View className='iconfont icon-weChat icon-fontsize' />
            <View className='list-item-txt'>{$t('155381a3.7f8121')}</View>
            <View className='iconfont icon-arrowRight icon-right' />
          </Navigator>
          {info.isOpenShop && info.shop_status === 1 && (
            <Navigator
              className='list-item'
              open-type='navigateTo'
              url={`/marketing/pages/distribution/shop?turnover=${info.taskBrokerageItemTotalFee}&point=${info.taskBrokerageItemTotalPoint}&disabled=${info.disabled}`}
            >
              <View className='iconfont icon-shop icon-fontsize' />
              <View className='list-item-txt'>{$t('d13c0ad1.c41892')}</View>
              <View className='iconfont icon-arrowRight icon-right' />
            </Navigator>
          )}
          {Taro.getEnv() !== 'WEB' && info.shop_status !== 1 && (
            <Button className='share-btn list-item' open-type='share'>
              <View className='iconfont icon-share1 icon-fontsize' />
              <View className='list-item-txt'>{$t('d13c0ad1.2f8efe')}</View>
              <View className='iconfont icon-arrowRight icon-right' />
            </Button>
          )}
          {info.isHf && (
            <Navigator
              className='list-item'
              open-type='navigateTo'
              url='/marketing/pages/verified-card/index'
            >
              <View className='iconfont item-icon icon-weChart' />
              <View className='list-item-txt'>{$t('d13c0ad1.638e8c')}</View>
              <View className='iconfont icon-arrowRight icon-right' />
            </Navigator>
          )}
          <Navigator
            className='list-item'
            open-type='navigateTo'
            url='/subpages/marketing/certification'
          >
            <View className='iconfont item-icon icon-shimingrenzheng' />
            <View className='list-item-txt'>{$t('d13c0ad1.5197d0')}</View>
            <View
              className={classNames(
                'cicle',
                (adapay_status_key === 'auditing' && 'approve') ||
                  (adapay_status_key === 'unverified' && 'NotCertified') ||
                  (adapay_status_key === 'failed' && 'fail') ||
                  (adapay_status_key === 'verified' && 'success')
              )}
            />
            <View style={{ marginRight: '15rpx' }}>
              {adapay_status_key ? $t(ADAPAY_STATUS_I18N[adapay_status_key]) : ''}
            </View>
            <View className='iconfont icon-arrowRight icon-right' />
          </Navigator>
        </View>

        {showPoster && (
          <SpPoster
            info={info}
            type='distribution'
            onClose={() => {
              this.setState({
                showPoster: false
              })
            }}
          />
        )}
      </SpPage>
    )
  }
}

export default connect(({ colors }) => ({
  colors: colors.current
}))(withTranslation()(DistributionDashboard))
