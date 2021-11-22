import Taro, { Component } from '@tarojs/taro'
import { View,Text } from '@tarojs/components'
import { SpImg } from '@/components'
import { linkPage } from './helper'

import './imghot-zone.scss'

export default class WgtImgHotZone extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  constructor(props) {
    super(props)

    this.state = {
      curIdx: 0
    }
  }

  handleClickItem = linkPage

  render() {
    const { info } = this.props
    const { curIdx } = this.state

    if (!info) {
      return null
    }

    const { config, base, data } = info
    const curContent = (data[curIdx] || {}).content

    return (
      <View className={`wgt ${base.padded ? 'wgt__padded' : null}`}>
        {base.title && (
          <View className='wgt__header'>
            <View className='wgt__title'>
              <Text>{base.title}</Text>
              <View className='wgt__subtitle'>{base.subtitle}</View>
            </View>
          </View>
        )}
        <View className={`slider-wra img-hotzone ${config.padded ? 'padded' : ''}`}>
          <SpImg
            img-class='img-hotzone_img'
            src={config.imgUrl}
            mode='widthFix'
            width='750'
            lazyLoad
          />
          {data.map((item, index) => {
            return (
              <View
                key={`${index}1`}
                className='img-hotzone_zone'
                style={`width: ${item.widthPer * 100}%; height: ${item.heightPer *
                  100}%; top: ${item.topPer * 100}%; left: ${item.leftPer * 100}%`}
                onClick={this.handleClickItem.bind(this, item.linkPage, item)}
              ></View>
            )
          })}
        </View>
      </View>
    )
  }
}
