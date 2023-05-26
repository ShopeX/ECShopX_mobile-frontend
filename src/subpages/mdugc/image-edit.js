
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Input, View, Image, MovableArea, MovableView, Text } from '@tarojs/components'
import './index.scss'

function UgcImageEdit(props) {

  const { movearry, bg_shareImg } = this.state
  return (
    <SpPage className='page-ugc-image-edit'>
      <View className='makeimgindex_title'>
        <Text>点击下方图片或下方按钮添加标签</Text>
      </View>
      <View className='makeimgindex_img'>
        {
          bg_shareImg && (
            <Image id='dom_img' src={bg_shareImg} mode='widthFix' onload={this.ongetImageInfo.bind(this)} />
          )
        }
        <MovableArea className='MovableArea'>
          {
            movearry.map((element, idx) => {
              return (
                <MovableView
                  style='height: auto; width:auto;'
                  direction='all'
                  x={element.x}
                  y={element.y}
                  className="MovableView"
                  onChange={this.debounce_ins.bind(this, 500, false, idx)}
                  animation={false}
                >
                  <View className='MovableView_i'>
                    {element.value.tag_name}
                    <View className='MovableView_i_icon' onClick={this.deletetag.bind(this, idx)}>
                      <View className='icon-jiahao'></View>
                    </View>
                  </View>
                </MovableView>
              )
            })
          }
        </MovableArea>
      </View>
      <View className='makeimgindex_btn makeimgindex_btn_label' onClick={this.topages.bind(this, "/subpages/mdugc/pages/make_label/index")}>添加标签</View>
      <View className='makeimgindex_btn makeimgindex_btn_complete' onClick={this.drawImage.bind(this)}>确认</View>

    </SpPage>
  )
}



export default UgcImageEdit
