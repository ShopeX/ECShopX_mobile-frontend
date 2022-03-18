import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './index.scss'

export default class BaShareMenu extends Component {
  static options = {
    addGlobalClass: true
  }
  static defaultProps = {
    showPosterBtn: true,
    onClick: () => {}
  }
  constructor(props) {
    super(props)
    this.state = {
      ...this.state
    }
  }
  handlePoster(e) {
    const { onCreatePoster } = this.props
    onCreatePoster()
  }

  render() {
    const { showPosterBtn, entry_form } = this.props
    return (
      <View className='share-menu__mask'>
        <View className='share-menu__option'>
          <View className='close-share'>
            <View
              className='in-icon in-icon-close'
              onClick={() => this.props.onClick(false)}
            ></View>
          </View>
          <View className='option-btn'>
            <View className='option-btn__item'>
              <View className='share-menu'>
                <Image
                  mode='widthFix'
                  className='share-menu__img'
                  src='https://bbc-espier-images.amorepacific.com.cn/image/2/2020/12/14/fcdd2ee967312c2add90fd6eb10acb1eF2Tt2Awa44mgXPiVViVTxwjthVPLZK1o'
                />
                {entry_form &&
                ['single_chat_tools', 'group_chat_tools'].includes(entry_form.entry) ? (
                  <Button onClick={this.props.onShareMessage} className='share-friend'>
                    {' '}
                  </Button>
                ) : (
                  <Button open-type='share' className='share-friend'>
                    {' '}
                  </Button>
                )}
              </View>
              <View className='text'>分享给好友</View>
            </View>
            {showPosterBtn && (
              <View className='option-btn__item'>
                <View className='share-menu' onClick={this.handlePoster}>
                  <Image
                    mode='widthFix'
                    className='share-menu__img'
                    src='https://bbc-espier-images.amorepacific.com.cn/image/2/2020/12/14/fcdd2ee967312c2add90fd6eb10acb1eavvEiC6QtSODTxH6qmXR9TtGCT8XOcGG'
                  />
                </View>
                <View className='text'>生成分享图片</View>
              </View>
            )}
          </View>
        </View>
      </View>
    )
  }
}
