/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { withTranslation } from 'react-i18next'
import { $t } from '@/i18n'
import './index.scss'

class Index extends Component {
  componentWillMount() {}

  componentDidMount() {
    this.syncNavTitle()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.i18n?.language !== this.props.i18n?.language) {
      this.syncNavTitle()
    }
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  syncNavTitle = () => {
    Taro.setNavigationBarTitle({ title: $t('937b0b69.db1c89') })
  }

  render() {
    return (
      <View className='index'>
        <Text>Hello world!</Text>
      </View>
    )
  }
}

export default withTranslation()(Index)
