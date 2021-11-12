import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtAvatar, AtTextarea } from 'taro-ui'
import { formatDataTime } from '@/utils'

import './complaint-record-item.scss'

export default class ComplaintRecordItem extends Component {
  static defaultProps = {
    isOpened: false
  }

  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {}

  render() {
    let { info, onClick } = this.props

    if (!info) return null

    let replyList = info.reply_content ? JSON.parse(info.reply_content) : []

    console.log('render', info)

    return (
      <View className='complaint-record-item'>
        <View className='item-header'>
          <View className='item-header__avatar'>
            <AtAvatar image={info.saleman_avatar} size='small' circle />
          </View>
          <View className='item-header__info'>
            <View className='item-header__info-name'>{info.saleman_name}</View>
            <View className='item-header__info-store_name'>{info.saleman_distribution_name}</View>
          </View>
        </View>

        <View className='item-info'>
          <View>投诉理由：</View>
          <View className='item-info__con'>
            <View className='triangle-box'>
              <View className='triangle'>
                <View></View>
              </View>
            </View>
            <View className='item-info__con-text'>
              <AtTextarea
                className='item-info__con-textarea'
                value={info.complaints_content}
                maxLength={200}
                height={200}
                disabled
              />
            </View>
          </View>

          <View className='item-info__img'>
            {info.imgList.map((item, idx) => {
              return (
                <View onClick={() => onClick(item)} key={`${idx}1`} className='item-info__img-box'>
                  <Image mode='aspectFit' src={item} />
                </View>
              )
            })}
          </View>
          <View className='item-info__date'>{formatDataTime(info.created * 1000)}</View>
        </View>

        {replyList.map((item, idx) => {
          return (
            <View key={`${idx}1`} className='item-reply'>
              <View className='item-reply__title'>商家回复：</View>

              <View className='item-reply__con'>
                <View className='item-reply__con-text'>
                  <AtTextarea
                    className='item-reply__con-textarea'
                    value={item.reply_content}
                    maxLength={200}
                    height={100}
                    disabled
                  />
                </View>

                <View className='triangle-box'>
                  <View className='triangle'>
                    <View></View>
                  </View>
                </View>
              </View>

              <View className='item-reply__date'>{formatDataTime(item.reply_time * 1000)}</View>
            </View>
          )
        })}
      </View>
    )
  }
}
