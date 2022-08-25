import React, { Component } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { classNames, linkPage } from '@/utils'
import './floor-img.scss'

export default class WgtFloorImg extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: {}
  }

  constructor(props) {
    super(props)
  }
  onRoute = linkPage

  render() {
    const { info } = this.props
    if (!info) {
      return null
    }
    const { base, data } = info

    return (
      <View
        className={classNames('wgt', {
          floor__padded: base.padded,
          wgt_floor_img: base.openBackImg
        })}
        style={base && base.openBackImg ? `background: url(${base && base.backgroundImg});` : null}
      >
        {base.title && (
          <View className='wgt-head'>
            <View className='wgt-hd'>
              <Text className='wgt-title'>{base.title}</Text>
              <Text className='wgt-subtitle'>{base.subtitle}</Text>
            </View>
          </View>
        )}
        <View className={classNames('exclusive_list_two', 'exclusive_list')}>
          <ScrollView scrollX className='img_list'>
            {data &&
              data.map((item, idx) => {
                return (
                  <View className='lis' key={idx}>
                    <View className='imgbox' key={item.id} onClick={this.onRoute.bind(this, item)}>
                      <Image lazyLoad className='img' src={item.imgUrl}></Image>
                    </View>
                    <View className='title' style={`color: ${base && base.WordColor}`}>
                      {item.ImgTitle}
                    </View>
                  </View>
                )
              })}
          </ScrollView>
        </View>
      </View>
    )
  }
}
