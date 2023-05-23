import React, { Component } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { classNames, linkPage } from '@/utils'
import { SpImage } from '@/components'
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
        className={classNames('wgt wgt-floor-img', {
          'wgt__padded': base.padded,
          'open-bgk': base.openBackImg
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
        <View className='wgt-bd'>
          <ScrollView scrollX className='img-list'>
            {data &&
              data.map((item, idx) => {
                return (
                  <View className='img-item' key={idx}>
                    <SpImage src={item.imgUrl} mode='widthFix' circle={16} onClick={this.onRoute.bind(this, item)} />
                    {item.ImgTitle && <View className='title' style={`color: ${base && base.WordColor}`}>
                      {item.ImgTitle}
                    </View>}
                  </View>
                )
              })}
          </ScrollView>
        </View>
      </View>
    )
  }
}
