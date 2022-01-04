import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import api from '@/api'
import { SpHtmlContent } from '@/components'
import { formatTime } from '@/utils'

import './index.scss'

export default class ArticleIndex extends Component {
  $instance = getCurrentInstance()
  constructor (props) {
    super(props)

    this.state = {
      info: null
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
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

  render () {
    const { info } = this.state

    if (!info) {
      return null
    }

    return (
      <View className='article-index'>
        {info.image_url && <Image className='article-brand' src={info.image_url} mode='widthFix' />}
        <View className='article-info'>
          <Text className='article-title'>{info.title}</Text>
          <Text className='article-time'>{info.updated_str}</Text>
          <SpHtmlContent content={info.content}></SpHtmlContent>
        </View>
      </View>
    )
  }
}
