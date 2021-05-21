/*
 * @Author: PrendsMoi
 * @GitHub: https://github.com/PrendsMoi
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /unite-vshop/src/pages/item/comps/share-panel.js
 * @Date: 2021-04-01 17:21:58
 * @LastEditors: PrendsMoi
 * @LastEditTime: 2021-04-22 13:56:53
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Button, Image } from '@tarojs/components'
import { AtFloatLayout } from 'taro-ui'

import './share-panel.scss';

export default class SharePanel extends Component {
  static defaultProps = {
    info: null,
    onClose: () => {},
    onClick: () => {}
  }

  static options = {
    addGlobalClass: true
  }

  onClickShareTimeline = () => {
    console.log('onClickShareTimeline')
  }

  render () {
    const { isOpen, onClose, onClick, onEditShare } = this.props

    return (
      <AtFloatLayout
        isOpened={isOpen}
        title=''
        onClose={onClose}
        scrollX={false}
        scrollY={false}
        className='AtFlayout'
      >
        <View className='share-panel'>
          {/* <View className='share-panel__item' >
            <Button
              onClick={this.onClickShareTimeline.bind(this)}
              className='icon-weChart'
            >
            </Button>
            <View className='title'>分享到朋友圈</View>
          </View> */}
          <Button className='share-panel__item' openType='share'>
            <View className='imgBtn'>
              <Image className='img' mode='aspectFit' src={require('../../../assets/imgs/weixin.png')} />
            </View>
            <View className='title'>分享给好友</View>
          </Button>
          <View className='share-panel__item' onClick={onClick}>
            <View className='imgBtn'>
              <Image className='img' mode='aspectFit' src={require('../../../assets/imgs/poster.png')} />
            </View>
            <View className='title'>海报分享</View>            
          </View>
          <View className='share-panel__item' onClick={onEditShare}>  
            <View className='imgBtn'>
              <Image className='img' mode='aspectFit' src={require('../../../assets/imgs/editshare.png')} />
            </View>
            <View className='title'>分享编辑</View>            
          </View>
        </View>
        <View className='cancel' onClick={onClose}>取消</View>
      </AtFloatLayout>
    )
  }
}
