
import React, { useEffect } from 'react'
import Taro, { getCurrentInstance, useRouter } from '@tarojs/taro'
import { Input, View, Image, MovableArea, MovableView, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { useImmer } from 'use-immer'
import { SpPage, SpImage } from '@/components'
import { useDebounce } from '@/hooks'

import './image-edit.scss'

const initialState = {
  movearry: [],
  imageWidth: 0,
  imageHeight: 0,
}

function UgcImageEdit(props) {
  const router = useRouter()
  const [state, setState] = useImmer(initialState)
  const { movearry, imageWidth, imageHeight } = state
  const { image, index } = router.params
  const imageSrc = decodeURIComponent(image)

  useEffect(() => {
    // initImage()
    Taro.eventCenter.on('onEventTopic', (item) => {
      console.log('onEventTopic:', item)

      let idx = 0
      const _item = item.map((val) => {
        if (movearry.find(topic => topic.topicId == val.topicId)) {
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
        draft.movearry = _item
      })
    })

    return () => {
      Taro.eventCenter.off('onEventTopic')
    }
  }, [])

  // const initImage = () => {
  //   const
  // }

  // 删除当前标签
  const deleteTag = (idx) => {
    const _movearry = JSON.parse(JSON.stringify(movearry))
    _movearry.splice(idx, 1)
    setState(draft => {
      draft.movearry = _movearry
    })
  }

  const onChangeMovable = useDebounce((idx, e) => {
    const { x, y } = e.detail
    setState(draft => {
      draft.movearry[idx] = {
        ...movearry[idx],
        x,
        y
      }
    })
  }, 200)

  const onLoadImage = (e) => {
    const { width, height } = e.detail
    setState(draft => {
      draft.imageWidth = width
      draft.imageHeight = height
    })
  }

  const drawImage = () => {
    const { windowWidth } = Taro.getSystemInfoSync()
    movearry.map(item => {
      return {
        ...item,
        x: parseFloat((item.x / (windowWidth - 32).toFixed(2))),
        y: parseFloat((item.x / ((windowWidth - 32) * imageHeight / imageWidth)).toFixed(2)),
      }
    })
    console.log('windowWidth:', windowWidth, movearry)
    Taro.eventCenter.trigger('onEventImageChange', { movearry, index })
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
            movearry.map((item, idx) => {
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
          const topicIds = movearry.map(item => item.topicId)

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
