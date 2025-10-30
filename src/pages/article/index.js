// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import api from '@/api'
import { SpPage, SpImage, SpHtml } from '@/components'
import { formatTime } from '@/utils'

import './index.scss'

export default class ArticleIndex extends Component {
  $instance = getCurrentInstance()
  constructor(props) {
    super(props)

    this.state = {
      info: null
    }
  }

  componentDidMount() {
    this.fetch()
  }

  async fetch() {
    const { id } = this.$instance.router.params
    const info = await api.article.detail(id)

    info.updated_str = formatTime(info.updated * 1000, 'YYYY-MM-DD HH:mm')
    Taro.setNavigationBarTitle({
      title: info.title
    })
    this.setState({
      info
    })
  }

  render() {
    const { info } = this.state

    if (!info) {
      return null
    }

    return (
      <SpPage className='page-article-index' scrollToTopBtn>
        {info.image_url && <SpImage className='article-brand' src={info.image_url} />}
        <View className='article-info'>
          <Text className='article-title'>{info.title}</Text>
          <Text className='article-time'>{info.updated_str}</Text>
          <SpHtml content={info.content}></SpHtml>
        </View>
      </SpPage>
    )
  }
}
