
import React, { useEffect } from 'react'
import Taro, { getCurrentInstance, useRouter } from '@tarojs/taro'
import { Input, View, Image, MovableArea, MovableView, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { useImmer } from 'use-immer'
import { SpPage, SpImage } from '@/components'
import { useDebounce } from '@/hooks'

import './image-edit.scss'

const initialState = {
  movearray: [],
  imageWidth: 0,
  imageHeight: 0,
}

function UgcImageEdit(props) {
  const router = useRouter()
  const [state, setState] = useImmer(initialState)
  const { movearray, imageWidth, imageHeight } = state
  const { image, index, topics } = router.params
  const imageSrc = decodeURIComponent(image)

  useEffect(() => {
    Taro.eventCenter.on('onEventTopic', (item) => {
      console.log('onEventTopic:', item)

      let idx = 0
      const _item = item.map((val) => {
        if (movearray.find(topic => topic.topicId == val.topicId)) {
          return topic
        } else {
          const _idx = idx++
          return {
            ...val,
            x: 50 + 20 * _idx,
            y: 50 + 20 * _idx,
          }
        }
      })

      setState(draft => {
        draft.movearray = _item
      })
    })

    return () => {
      Taro.eventCenter.off('onEventTopic')
    }
  }, [])

  // 删除当前标签
  const deleteTag = (idx) => {
    const _movearray = JSON.parse(JSON.stringify(movearray))
    _movearray.splice(idx, 1)
    setState(draft => {
      draft.movearray = _movearray
    })
  }

  const onChangeMovable = useDebounce((idx, e) => {
    const { x, y } = e.detail
    setState(draft => {
      draft.movearray[idx] = {
        ...movearray[idx],
        x,
        y
      }
    })
  }, 200)

  const onLoadImage = (e) => {
    const { width, height } = e.detail
    const { windowWidth } = Taro.getSystemInfoSync()

    setState(draft => {
      draft.imageWidth = width
      draft.imageHeight = height
      draft.movearray = JSON.parse(topics).map(item => {
        return {
          ...item,
          x: (windowWidth - 16) * item.x,
          y: (windowWidth - 16) * height / width * item.y
        }
      })
    })
  }

  const drawImage = () => {
    const { windowWidth } = Taro.getSystemInfoSync()
    const _movearray = JSON.parse(JSON.stringify(movearray))
    _movearray.forEach(item => {
      item.x = parseFloat((item.x / (windowWidth - 16)).toFixed(2))
      item.y = parseFloat((item.y / ((windowWidth - 16) * imageHeight / imageWidth)).toFixed(2))
    })
    Taro.eventCenter.trigger('onEventImageChange', { movearray: _movearray, index })
    setTimeout(() => {
      Taro.navigateBack()
    }, 200)
  }


  return (
    <SpPage className='page-ugc-image-edit'>
      <View className='title'>点击下方图片或下方按钮添加标签</View>
      <View className='image-container'>
        <SpImage src={imageSrc} onLoad={onLoadImage} />
        <MovableArea className='movable-area'>
          {
            movearray.map((item, idx) => {
              return (
                <MovableView
                  style='height: auto; width:auto;'
                  direction='all'
                  x={item.x}
                  y={item.y}
                  className="movable-view"
                  onChange={onChangeMovable.bind(this, idx)}
                  animation={false}
                >
                  <View className='movable-item'>
                    {item.topicName}
                    <Text className='iconfont icon-guanbi' onClick={deleteTag.bind(this, idx)}></Text>
                  </View>
                </MovableView>
              )
            })
          }
        </MovableArea>
      </View>
      <View className="btn-container">
        <AtButton circle className='btn btn-add' onClick={() => {
          const topicIds = movearray.map(item => item.topicId)

          Taro.navigateTo({
            url: `/subpages/mdugc/subject-talk?topic_ids=${topicIds.toString()}&event=onEventTopic`
          })
        }}>添加标签</AtButton>
        <AtButton circle className='btn btn-confirm' type='primary' onClick={drawImage}>确认</AtButton>
      </View>
    </SpPage>
  )
}

export default UgcImageEdit
