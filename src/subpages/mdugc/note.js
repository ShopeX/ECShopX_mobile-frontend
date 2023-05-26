import React, { useEffect, useState } from 'react'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import { useSelector } from 'react-redux'
import { pickBy, styleNames, getThemeStyle, showToast } from '@/utils'
import { useImmer } from 'use-immer'
import api from '@/api'
import imgUploader from '@/utils/upload'
import { AtInput, AtTextarea, AtActionSheet, AtActionSheetItem, AtButton } from 'taro-ui'
import { View, Text, Block } from '@tarojs/components'
import { SpPage, SpImage, SpUpload } from '@/components'

import './note.scss'

const initialState = {
  videoEnable: false,
  videoList: [],
  imageList: [],
  noteTitle: '',
  noteBody: '',
  subjectList: [],
  remmendItemList: []
}

function UgcNote(props) {
  const [state, setState] = useImmer(initialState)
  const { userInfo = {} } = useSelector((state) => state.user)
  const router = useRouter()
  const { videoEnable, videoList, imageList, noteTitle, noteBody, subjectList, remmendItemList } = state

  useEffect(() => {
    getNoteSetting()
    getNoteDetail()
    Taro.eventCenter.on('onEventSubjectTalk', (item) => {
      console.log('onEventSubjectTalk:', item)
      setState(draft => {
        draft.subjectList = item
      })
    })

    Taro.eventCenter.on('onEventRemmendItems', (item) => {
      console.log('onEventRemmendItems:', item)
      setState(draft => {
        draft.remmendItemList = item
      })
    })

    return () => {
      Taro.eventCenter.off('onEventSubjectTalk')
      Taro.eventCenter.off('onEventRemmendItems')
    }
  }, [])

  const getNoteSetting = async () => {
    const res = await api.mdugc.postsetting({ type: 'video' })
    setState(draft => {
      draft.videoEnable = true
    })
  }

  const getNoteDetail = async () => {
    const { post_id } = router.params
    if (post_id) {
      const { post_info } = await api.mdugc.postdetail({
        post_id
      })
      const { images, title, content, topics } = post_info
      setState(draft => {
        draft.imageList = images.map(item => {
          return {
            url: item.url
          }
        })
        draft.noteTitle = title
        draft.noteBody = content
        draft.subjectList = pickBy(topics, {
          topicId: 'topic_id',
          topicName: 'topic_name'
        })
      })
    }
  }

  const onEditImage = () => {
    Taro.navigateTo({
      url: `/subpages/mdugc/image-edit?`
    })
  }

  // 删除话题
  const handleDeleteSubject = (index) => {
    const _subjectList = [...subjectList]
    _subjectList.splice(index, 1)
    setState((draft) => {
      draft.subjectList = _subjectList
    })
  }

  // 删除商品
  const handleDeleteItem = (index) => {
    const _remmendItemList = [...remmendItemList]
    _remmendItemList.splice(index, 1)
    setState((draft) => {
      draft.remmendItemList = _remmendItemList
    })
  }

  // 发布笔记|草稿
  const releaseNote = async (type) => {
    const { md_drafts, post_id } = router.params
    if (type == 1) { // 保存草稿
      if (imageList.length == 0 && !noteTitle && !noteBody && subjectList.length == 0 && remmendItemList.length == 0) {
        showToast('笔记不能为空!')
        return
      }
    } else { // 发布笔记
      if (!videoEnable && imageList.length == 0) {
        showToast('请上传图片!')
        return
        // } else if (videoenable == 1 && imageList.length == 0 && !file_video.cover) {
        //   showToast('请上传视频或图片!')
        //   return
      } else if (!noteTitle) {
        showToast('请填写标题!')
        return
      } else if (!noteBody) {
        showToast('请填写内容文字!')
        return
      }
    }
    Taro.showLoading()
    const params = {
      user_id: userInfo.user_id,
      title: noteTitle,
      content: noteBody,
      cover: imageList[0],
      images: imageList,
      image_path: imageList,
      topics: subjectList.map(item => item.topicId),
      goods: remmendItemList.map(item => item.itemId),
      // image_tag,
      is_draft: type,
      // video: '',
      // video_ratio: '',
      // video_place: ''
    }

    // if (video) {
    //   data.video = video
    //   data.video_ratio = video_ratio
    //   data.video_place = video_place
    // }
    if (post_id) {
      if (md_drafts) {
        if (is_draft) {
          data.post_id = post_id
        }
      } else {
        if (!is_draft) {
          data.post_id = post_id
        }
      }
    }
    const { message } = await api.mdugc.create(params)
    Taro.hideLoading()
    showToast(message)
    Taro.disableAlertBeforeUnload()
    setTimeout(() => {
      Taro.navigateBack()
    }, 1000)
  }

  return (
    <SpPage className='page-ugc-note' renderFooter={
      <View className='action-container'>
        <View className='save-draft' onClick={releaseNote.bind(this, 1)}>
          <Text className='iconfont icon-caogaoxiang'></Text>
          <Text className='text'>保存草稿</Text>
        </View>
        <View className='release-note'>
          <AtButton circle type='primary' onClick={releaseNote.bind(this, 0)}>发布笔记</AtButton>
        </View>
      </View>
    }>
      <View className='container-body'>
        <View className='note-ad'>
          <SpUpload
            value={videoList}
            max={1}
            mediaType='video'
            placeholder="上传视频"
            onChange={(val) => {
              debugger
              setState((draft) => {
                draft.videoList = val
              })
            }}
          />

          <SpUpload
            value={imageList}
            max={9}
            placeholder="上传图片"
            onChange={(val) => {
              setState((draft) => {
                draft.imageList = val
              })
            }}
            onEdit={onEditImage}
          />
        </View>

        <View className='note-title'>
          <AtInput
            type='text'
            placeholder='填写标题会有更多关注哦～'
            maxLength='20'
            value={noteTitle}
            onChange={(val) => {
              setState((draft) => {
                draft.noteTitle = val
              })
            }}
          />
        </View>
        <View className='note-body'>
          <AtTextarea
            value={noteBody}
            maxLength={1000}
            height={300}
            placeholder='添加正文......'
            onChange={(val) => {
              setState((draft) => {
                draft.noteBody = val
              })
            }}
          />
        </View>

        <View className='subject-list'>
          <View className='subject'>
            {
              subjectList.map((item, index) => (
                <View className='subject-item' key={`subject-item__${index}`}>
                  {`#${item.topicName}`}
                  <Text className="iconfont icon-guanbi" onClick={handleDeleteSubject.bind(this, index)}></Text>
                </View>
              ))
            }
          </View>
          <AtButton circle className='btn-talk' onClick={() => {

            Taro.navigateTo({
              url: `/subpages/mdugc/subject-talk?`
            })
          }}>#添加话题</AtButton>
        </View>

        <View className="recommend-goods">
          <View className="label">推荐商品</View>
          <View className="goods-list">
            <View className='select-goods'>
              {
                remmendItemList.map((item, index) => (
                  <View className='file-item' key={`file-item__${index}`}>
                    <SpImage mode='aspectFit' src={item.pic} width={160} height={160} circle={16} />
                    <Text
                      className='iconfont icon-guanbi'
                      onClick={handleDeleteItem.bind(this, index)}
                    ></Text>
                  </View>
                ))
              }
              {remmendItemList.length == 0 && (
                <View className='btn-upload' onClick={() => {
                  Taro.navigateTo({
                    url: `/subpages/mdugc/item-list`
                  })
                }}>
                  <Text className='iconfont icon-tianjia1'></Text>
                  <Text className='btn-upload-txt'>选择商品</Text>
                  <Text className='files-length'>{`(${remmendItemList.length}/9)`}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </SpPage>
  )
}

export default UgcNote
