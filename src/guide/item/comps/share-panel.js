import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { AtFloatLayout } from 'taro-ui'

import './share-panel.scss'

export default class SharePanel extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null,
    onClose: () => {},
    onClick: () => {}
  }
  render() {
    const { info, isOpen, onClose, onClick } = this.props

    return (
      <AtFloatLayout isOpened={isOpen} title=' ' onClose={onClose} scrollX={false} scrollY={false}>
        <View className='share-panel'>
          <View className='share-panel__item'>
            <Button openType='share' className='icon-weChart'></Button>
            <View>分享给微信好友</View>
          </View>
          <View className='share-panel__item' onClick={onClick}>
            <View className='icon-picture1'></View>
            <View>生成分享图片</View>
          </View>
        </View>
      </AtFloatLayout>
    )
  }
}
