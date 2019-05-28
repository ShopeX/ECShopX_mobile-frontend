import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import api from '@/api'
import { SpHtmlContent } from '@/components'
import { formatTime } from '@/utils'

import './detail.scss'

export default class ArticleIndex extends Component {
  constructor (props) {
    super(props)

    this.state = {
      info: {}
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
    const { id } = this.$router.params
    // const info = await api.article.detail(id)

    // info.updated_str = formatTime(info.updated * 1000, 'YYYY-MM-DD HH:mm')
    // this.setState({
    //   info
    // })
  }

  handleClickBar = (type) => {
    console.log(type)
  }

  render () {
    const { info } = this.state

    if (!info) {
      return null
    }

    return (
      <View className='page-recommend-detail'>
        <View className='recommend-detail__title'>最in的5月</View>
        <View className='recommend-detail-info'>
          <View className='recommend-detail-info__time'>
            <Text className={`in-icon in-icon-shijian ${info.is_like ? '' : ''}`}> </Text>
            2019-5-28
          </View>
          <View className='recommend-detail-info__time'>
            <Text className={`in-icon in-icon-xingzhuang ${info.is_like ? '' : ''}`}> </Text>
            4026关注
          </View>
        </View>
        <View className='recommend-detail__content'>
          <SpHtmlContent
            content='电风扇的发热管他人萨芬是'
          />
        </View>
        <View className='recommend-detail__bar'>
          <View className='recommend-detail__bar-item' onClick={this.handleClickBar.bind(this, 'like')}>
            <Text className={`in-icon in-icon-like ${info.is_like ? '' : ''}`}> </Text>
            <Text>已赞·380</Text>
          </View>
          <View className='recommend-detail__bar-item' onClick={this.handleClickBar.bind(this, 'mark')}>
            <Text className={`in-icon in-icon-jiarushoucang ${info.is_like ? '' : ''}`}> </Text>
            <Text>加入心愿</Text>
          </View>
          <View className='recommend-detail__bar-item' onClick={this.handleClickBar.bind(this, 'share')}>
            <Text className={`in-icon in-icon-fenxiang ${info.is_like ? '' : ''}`}> </Text>
            <Text>分享</Text>
          </View>
        </View>
      </View>
    )
  }
}
