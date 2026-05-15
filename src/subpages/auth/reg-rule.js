/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, ScrollView, RichText } from '@tarojs/components'
import { SpNavBar, SpHtml, SpPage } from '@/components'
import { SpHtmlContent } from '@/subpages/components'
import { withPager } from '@/hocs'
import api from '@/api'
import { $t, ti, i18n } from '@/i18n'
import './reg-rule.scss'

@withPager
export default class RegRule extends Component {
  $instance = getCurrentInstance() || {}
  constructor(props) {
    super(props)

    this.state = {
      info: null
    }
  }

  componentDidMount() {
    this._onRegRuleLang = () => this.fetch()
    i18n.on('languageChanged', this._onRegRuleLang)
    this.fetch()
  }

  componentWillUnmount() {
    if (this._onRegRuleLang) {
      i18n.off('languageChanged', this._onRegRuleLang)
    }
  }

  async fetch() {
    let data = ''
    let navBarTitle = $t('30790878.faa1ad')
    const { type } = this.$instance?.router?.params
    Taro.showLoading({ title: '' })
    if (type === '1') {
      // 充值协议
      const { content, title } = await api.member.depositPayRule()
      data = content
      navBarTitle = title || $t('30790878.0de4fa')
    } else if (type === 'privacyAndregister') {
      // 隐私和注册协议
      const { content: registerContent, title: registerTitle } = await api.shop.getRuleInfo({
        type: 'member_register'
      })
      const { content: privacyContent, title: privactTitle } = await api.shop.getRuleInfo({
        type: 'privacy'
      })
      data = registerContent + privacyContent
      navBarTitle = ti('30790878.88b61e', [registerTitle, privactTitle])
    } else if (type === 'x') {
      // 隐私和注册协议
      const { salesman_service } = await api.salesman.shopsProtocolsaleman({
        type: 'x'
      })
      const { content: privacyContent, title: privactTitle } = salesman_service
      data = privacyContent
      navBarTitle = privactTitle
    } else if (type === 'y') {
      // 隐私和注册协议
      const { salesman_privacy } = await api.salesman.shopsProtocolsaleman({
        type: 'x'
      })
      const { content: privacyContent, title: privactTitle } = salesman_privacy
      data = privacyContent
      navBarTitle = privactTitle
    } else if (type == 'invoice_protocol') {
      // 隐私政策
      const { content, title } = await api.trade.getInvoiceProtocol({
        type
      })
      data = content
      navBarTitle = title || $t('30790878.0a10b1')
    } else if (type) {
      // 隐私政策
      const { content, title } = await api.shop.getRuleInfo({
        type
      })
      data = content
      navBarTitle = title || $t('30790878.0de4fa')
    } else {
      // 注册协议
      const { content, title } = await api.user.regRule()
      data = content
      navBarTitle = title || $t('30790878.3c0397')
    }
    Taro.hideLoading()
    Taro.setNavigationBarTitle({
      title: navBarTitle
    })
    this.setState({
      info: data,
      title: navBarTitle
    })
  }

  render() {
    const { info, title } = this.state
    return (
      <ScrollView enhanced scrollY showScrollbar={false} className='page-auth-reg-rule'>
        {info && <SpHtml content={info} />}
      </ScrollView>
    )
  }
}
