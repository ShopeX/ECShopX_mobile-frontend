/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import { View, ScrollView } from '@tarojs/components'
import { AtNavBar } from 'taro-ui'
import { GoodsItem } from '@/components'
import { classNames } from '@/utils'
import { connect } from 'react-redux'
import { ti, i18n } from '@/i18n'

import './checkout-items.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
export default class CheckoutItems extends Component {
  static defaultProps = {
    isOpened: false,
    list: [],
    onClickBack: () => {}
  }

  static options = {
    addGlobalClass: true
  }

  componentDidMount() {
    this._onLanguageChanged = () => this.forceUpdate()
    i18n.on('languageChanged', this._onLanguageChanged)
  }

  componentWillUnmount() {
    if (this._onLanguageChanged) {
      i18n.off('languageChanged', this._onLanguageChanged)
    }
  }

  render() {
    const { isOpened, list, onClickBack } = this.props

    return (
      <View className={classNames('checkout-items', isOpened ? 'checkout-items__active' : null)}>
        <AtNavBar
          leftIconType='chevron-left'
          title={ti('f09fe5a7.44f3e3', [list.length])}
          onClickLeftIcon={onClickBack}
        />
        <ScrollView class='checkout-items__scroll'>
          <View className='checkout-items__list'>
            {list.map((item) => {
              return <GoodsItem key={item.item_id} info={item} />
            })}
          </View>
        </ScrollView>
      </View>
    )
  }
}
