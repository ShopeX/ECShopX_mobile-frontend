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
    info: {},
    isShowDistributor: false
  }

  constructor(props) {
    super(props)
  }

  onRoute = (item) => {
    if (this.props?.onClick) {
      this.props.onClick(item)
    } else {
      return linkPage
    }
  }

  render() {
    const { info, isShowDistributor } = this.props
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
          <ScrollView scrollX className='img-list' enhanced show-scrollbar={false}>
            {data &&
              data.map((item, idx) => {
                return (
                  <View className='img-item' key={idx}>
                    <SpImage
                      src={item.imgUrl}
                      mode='widthFix'
                      circle={16}
                      onClick={this.onRoute.bind(this, item)}
                    />
                    {item.ImgTitle && (
                      <View className='title' style={`color: ${base && base.WordColor}`}>
                        {item.ImgTitle}
                      </View>
                    )}
                    { isShowDistributor && !Array.isArray(item.distributor_info) && (
                      <View className='distributor'>
                        <SpImage circle src={item.distributor_info.logo} width={32} height={32} />
                        <View className='distributor-name'>{item.distributor_info.name}</View>
                      </View>
                    )}
                  </View>
                )
              })}
          </ScrollView>
        </View>
      </View>
    )
  }
}
