/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpImage, SpPoint, SpPrice, SpVipLabel, SpLogin } from '@/components'
import { classNames } from '@/utils'
import * as mdugcApi from '@/api/mdugc'
import { useTranslation, $t } from '@/i18n'

import './comp-noteitem.scss'

const initialState = {
  likes: 0,
  likeStatus: false
}

function CompNoteItem(props) {
  useTranslation()
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
    const { action, likes } = await mdugcApi.postlike({
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
              <Text>{$t('9c45fd09.f50e9d')}</Text>
            </View>
            <View className='btn-edit'>{$t('9c45fd09.d04b2f')}</View>
          </View>
        )}
      </View>
      <View className='note-item__bd'>
        <View className='note-info'>
          <View className='note-title'>{info.title}</View>
        </View>
        <View className='ugc-author'>
          <View className='author-info' onClick={() => {}}>
            <SpImage circle src={info.headimgurl} width={32} height={32} mode='aspectFill' />
            <View className='author'>{info.username || info.nickname}</View>
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
