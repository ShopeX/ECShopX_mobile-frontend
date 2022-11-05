/*
 * @Author: error: git config user.email & please set dead value or install git
 * @Date: 2022-11-04 16:41:24
 * @LastEditors: error: git config user.email & please set dead value or install git
 * @LastEditTime: 2022-11-05 16:17:04
 * @FilePath: /ecshopxx-vshop/src/components/recommend-item/index.js
 * @Description: 
 * 
 * Copyright (c) 2022 by error: git config user.name && git config user.email & please set dead value or install git, All Rights Reserved. 
 */
import React, { Component } from 'react'
import { View, Text, Image, Progress } from '@tarojs/components'
import { Price, SpImg } from '@/components'
import { isObject, classNames } from '@/utils'
import api from '@/api'

import './index.scss'
import { info } from '@/api/aftersales'

export default class RecommendItem extends Component {
  static defaultProps = {
    onClick: () => {},
    showMarketPrice: true,
    noCurSymbol: false,
    type: 'item'
  }

  static options = {
    addGlobalClass: true
  }
  constructor(props) {
    super(props)
    this.state = {
      info:JSON.parse(JSON.stringify(props.info))
    }
  }
  handleLikeClick = async (e) => {
    e.stopPropagation()
    const { info } = this.state
    const { item_id, isPraise } = info
    const { count } = await api.article.praise(item_id)
    console.log(info)
    this.setState({
      info:{
        ...info,
        isPraise: !isPraise,
        articlePraiseNum: count
      }
    })
  }

  render () {
    const {
      // info,
      noCurSymbol,
      noCurDecimal,
      onClick,
      appendText,
      className,
      isPointDraw,
      type,
      noShowZan
    } = this.props
    const {
      info,
    } = this.state
    if (!info) {
      return null
    }

    const img = info.img || info.image_default_id
    const img_head = info.head_portrait || info.image_default_id

    return (
      <View className={classNames('recommend-item', className)}>
        <View className='recommend-item__hd'>{this.props.children}</View>
        <View className='recommend-item__bd' onClick={onClick}>
          <View className='recommend-item__img-wrap'>
            <SpImg img-class='recommend-item__img' src={img} mode='widthFix' width='400' lazyLoad />
          </View>
          <View className='recommend-item__cont'>
            <View className='recommend-item__caption'>
              <Text className='recommend-item__title'>{info.title}</Text>
              <Text className='recommend-item__desc'>{info.summary}</Text>
            </View>
            <View className='recommend-item__extra'>
              <View className='recommend-item__author'>
                {img_head && (
                  <Image
                    className='recommend-item__author-avatar'
                    src={img_head}
                    mode='aspectFill'
                  />
                )}
                {info.author && (
                  <Text
                    className={
                      !noShowZan
                        ? 'recommend-item__author-name'
                        : 'recommend-item__author-name recommend-item__author-long'
                    }
                  >
                    {info.author}
                  </Text>
                )}
              </View>
              {!noShowZan && (
                <View
                  className={`recommend-item__actions ${info.isPraise ? 'is_like__active' : ''}`}
                  onClick={this.handleLikeClick.bind(this)}
                >
                  <View className='iconfont icon-like'>
                    <Text>{info.articlePraiseNum}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
        <View className='recommend-item__ft'>{this.props.renderFooter}</View>
      </View>
    )
  }
}
