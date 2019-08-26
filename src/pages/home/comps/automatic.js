import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './automatic.scss'

export default class Automatic extends Component {
  static defaultProps = {
    info: null,
    onClick: () => {},
    onClose: () => {}
  }

  static options = {
    addGlobalClass: true
  }

  render () {
    const { info, onClick, onClose, isShow } = this.props

    if (!info) {
      return null
    }

    return (
      <View>
        {
          isShow &&
            <View className="gift-wrap">
              <View className="gift">
                <Image
                  className="gift-bg"
                  src={info.adPic}
                  mode="widthFix"
                  />
                <Button className="btn-primary gift-btn" onClick={onClick}>{info.title}</Button>
                <View className="zoom-btn icon-close" onClick={onClose}></View>
              </View>
            </View>
        }
      </View>
    )
  }
}
