import React, { Component, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
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
    const { postId } = info
    Taro.navigateTo({
      url: `/subpages/mdugc/note-detail?post_id=${postId}`
    })
  }

  const handleCollection = async () => {
    console.log(likeStatus);
    if(!likeStatus){
     changeLike()
      return
    }
    Taro.showModal({
      title: '提示',
      content: '确定要取消关注吗？',
      confirmText: '确定',
      cancelText: '暂不',
      success: async (res) => {
        if (res.confirm) {
          changeLike()
        }
      }
    })
  }

  if (!info) {
    return null
  }
  const changeLike = async() =>{
    const { postId } = info
    const { action, likes } = await api.mdugc.postlike({
      user_id: userInfo.user_id,
      post_id: postId
    })
console.log( action === 'like');
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
