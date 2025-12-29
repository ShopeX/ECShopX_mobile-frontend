/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Text, Swiper, Video, SwiperItem } from '@tarojs/components'

import './index.scss'

export default class Swiperugc extends Component {
  static defaultProps = {
    file_detailss: {}
  }

  constructor(props) {
    super(props)

    this.state = {
      sizearry: [],
      currentIndex: 0,
      list: [],
      file_details: { images: [] },
      maxh: 0
    }
  }
  componentDidMount() {
    // this.setspot(this.props)
  }
  componentWillReceiveProps(nextProps) {
    this.setspot(nextProps)
  }
  setspot = (propss) => {
    console.log('propss', propss)
    if (propss.file_detailss && propss.file_detailss.images) {
      let { file_detailss } = propss
      let { video, video_ratio, images } = file_detailss
      let file_video = {
        url: video,
        proportion: video_ratio
      }
      file_detailss.file_video = file_video
      let { windowWidth, windowHeight } = Taro.getSystemInfoSync()
      windowHeight = windowHeight * 0.8

      let list = []
      if (file_video && file_video.url) {
        let h =
          file_video.proportion * windowWidth >= windowHeight
            ? windowHeight
            : file_video.proportion * windowWidth
        list.push(h)
      } else {
        list = []
      }
      // console.log("这是list--1",list)

      images.forEach((item) => {
        // console.log("这是数据比例",windowHeight,item.proportion,item.proportion*windowWidth,windowHeight)
        let ih = item.proportion * windowWidth
        let h = ih >= windowHeight ? windowHeight : ih
        list.push(h)
      })
      // console.log("这是list--2",list)
      let maxh = [...list]
      maxh = maxh.sort().reverse()[0]
      this.setState({
        maxh,
        list,
        file_details: file_detailss
      })
    }
  }
  getsize = () => {
    let that = this
    let { sizearry } = this.state
    let { file_detailss } = this.props
    console.log('进入缩放函数')
    setTimeout(() => {
      Taro.nextTick(() => {
        Taro.createSelectorQuery()
          .in(this.$scope)
          .selectAll('.slider_swiper_img')
          .boundingClientRect()
          .exec((res) => {
            let obj = res[0]
            let arry = []
            file_detailss.images.forEach((item, idx) => {
              let sizei = 1
              if (item.tags && item.tags.length > 0) {
                if (item.tags[0].movearray.than_x > 0) {
                  sizei =
                    (obj[idx].width * item.tags[0].movearray.than_x) / item.tags[0].movearray.x
                } else if (item.tags[0].movearray.than_y > 0) {
                  sizei =
                    (obj[idx].height * item.tags[0].movearray.than_y) / item.tags[0].movearray.y
                }
              }
              arry.push(sizei)
            })
            console.log('这是arry', arry)
            that.setState({
              sizearry: arry
            })
          })
      })
    }, 1000)
  }
  // 获取图片宽高
  ongetImageInfo = (idx, images) => {
    if (idx == images.length - 1) {
      this.getsize()
    }
  }
  onChange(e) {
    this.setState({ currentIndex: e.detail.current })
  }
  render() {
    let { sizearry, currentIndex, file_details, maxh, list } = this.state
    let { file_video, images } = file_details

    return file_details ? (
      <View className='slider'>
        <Swiper
          className='slider_swiper'
          style={{ height: `${maxh}px` }}
          current={currentIndex}
          onChange={this.onChange.bind(this)}
        >
          {file_video && file_video.url ? (
            <SwiperItem className='slider_swiper_i'>
              <Video
                src={file_video.url}
                className='slider_swiper_video'
                autoplay
                style={{ height: `${list[0]}px` }}
                showMuteBtn
                poster={file_video.cover}
                ObjectFit='contain'
                enableProgressGesture={false}
              ></Video>
            </SwiperItem>
          ) : null}

          {images.map((item, idx) => {
            return (
              <SwiperItem className='slider_swiper_i'>
                <View className='slider_swiper_imgs'>
                  <Image
                    src={item.url}
                    className='slider_swiper_img'
                    style={{ height: `${file_video.url ? list[idx - 0 + 1] : list[idx]}px` }}
                    mode='heightFix'
                    onload={this.ongetImageInfo.bind(this, idx, images)}
                  >
                    <View className='slider_swiper_i_word'>
                      {item.tags > 0 &&
                        item.tags.map((wordi) => {
                          return (
                            <View
                              className='slider_swiper_i_word_text'
                              style={{
                                top: `${wordi.movearray.than_y * 100}%`,
                                left: `${wordi.movearray.than_x * 100}%`,
                                transform: `scale(${sizearry[idx]})`
                              }}
                            >
                              <View className='slider_swiper_i_word_text_i'>{wordi.tag_name}</View>
                            </View>
                          )
                        })}
                    </View>
                  </Image>
                </View>
              </SwiperItem>
            )
          })}
        </Swiper>
        <View className='slider_spot'>
          {list.length > 1
            ? list.map((item, index) => (
                <View
                  key={index}
                  className={
                    'slider_spot_i ' + (currentIndex == index ? 'slider_spot_i_active' : '')
                  }
                ></View>
              ))
            : null}
        </View>
      </View>
    ) : null
  }
}
