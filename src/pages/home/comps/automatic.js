import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

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
    const { info, onClick, onClose } = this.props

    if (!info) {
      return null
    }

    return (
      <View>
        {
          info.isOpen && (!info.isVip && !info.isHadVip && info.isSetVip) &&
            (<View className="gift-wrap">
              {
                info.gift &&
                  <View className="gift">
                    <Image
                      className="gift-bg"
                      src={info.adPic}
                      mode="aspectFit"
                      />
                    <Button className="btn-primary gift-btn" onClick={onClick}>立即领取</Button>
                    <View className="zoom-btn icon-close" onClick={onClose}></View>
                  </View>
              }
            </View>)
        }
      </View>
    )
  }
}
