// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import React, { Component, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpImage, SpPoint, SpPrice, SpVipLabel, SpLogin } from '@/components'
import { classNames } from '@/utils'
import api from '@/api'

import './comp-noteitem.scss'

const initialState = {
  likes: 0,
  likeStatus: false
}

function CompNoteItem(props) {
  const { info = null, mode = 'widthFix' } = props
  const [state, setState] = useImmer(initialState)
  const { likes, likeStatus } = state
  const { userInfo = {} } = useSelector((state) => state.user)

  useEffect(() => {
    setState((draft) => {
      draft.likes = info.likes
      draft.likeStatus = info.likeStatus
    })
  }, [info])

  const handleClick = () => {
    const { postId, status } = info
    if (status != '4') {
      Taro.navigateTo({
        url: `/subpages/mdugc/note-detail?post_id=${postId}`
      })
    } else {
      Taro.navigateTo({
        url: `/subpages/mdugc/note?post_id=${postId}`
      })
    }
  }

  const handleCollection = async () => {
    const { postId } = info
    const { action, likes } = await api.mdugc.postlike({
      user_id: userInfo.user_id,
      post_id: postId
    })
    setState((draft) => {
      draft.likes = likes
      draft.likeStatus = action === 'like'
    })
  }

  return (
    <View className='comp-note-item'>
      <View className='badges-list'>
        {info.badges.map((item, index) => (
          <View className='badge-item' key={`badge-item__${index}`}>
            {item.badge_name}
          </View>
        ))}
      </View>
      <View className='note-item__hd' onClick={handleClick}>
        <SpImage lazyLoad src={info.image_url} mode={mode} />
        {info.status == '4' && (
          <View className='verify-fail'>
            <View className='message'>
              <Text className='iconfont icon-jingshiFilled'></Text>
              审核未通过
            </View>
            <View className='btn-edit'>重新编辑</View>
          </View>
        )}
      </View>
      <View className='note-item__bd'>
        <View className='note-info'>
          <View className='note-title'>{info.title}</View>
        </View>
        <View className='ugc-author'>
          <View className='author-info' onClick={() => {}}>
            <SpImage circle src={info.headimgurl} width={32} height={32} />
            <View className='author'>{info.username}</View>
          </View>
          <SpLogin className='likes-num' onChange={handleCollection}>
            <Text
              className={classNames('iconfont', {
                'icon-dianzan': !likeStatus,
                'icon-dianzanFilled': likeStatus
              })}
            ></Text>
            <Text className='like-num'>{likes}</Text>
          </SpLogin>
        </View>
      </View>
    </View>
  )
}

CompNoteItem.options = {
  addGlobalClass: true
}

export default CompNoteItem
