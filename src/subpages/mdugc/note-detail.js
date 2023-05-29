import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import Taro, { useRouter, useShareAppMessage } from '@tarojs/taro'
import { View, Text, Video, Swiper, SwiperItem, } from '@tarojs/components'
import { AtButton, AtInput, AtActionSheet, AtActionSheetItem } from 'taro-ui'
import { FloatMenus, FloatMenuItem, SpPage, SpImage, SpLoading, SpLogin, SpScrollView } from '@/components'
import S from '@/spx'
import { WgtFloorImg } from '@/pages/home/wgts'
import { classNames, isWeb, isWeixin, showToast, pickBy, isNumber } from '@/utils'

import api from '@/api'
import doc from '@/doc'
import { useImmer } from 'use-immer'

import './note-detail.scss'

const initialState = {
  info: null,
  commentList: [],
  commentTotal: 0,
  comment: '',
  commentPlaceholder: '留言评论...',
  showCommentInput: false,
  parentCommentId: '',
  play: false,
  curImgIdx: 0
}

function UgcNoteDetail(props) {
  const [state, setState] = useImmer(initialState)
  const {
    info,
    commentList,
    commentTotal,
    comment,
    commentPlaceholder,
    showCommentInput,
    parentCommentId,
    play,
    curImgIdx
  } = state
  const { userInfo } = useSelector((state) => state.user)
  const router = useRouter()
  const pageRef = useRef()
  const listRef = useRef()
  const { windowWidth } = Taro.getSystemInfoSync()
  const { post_id } = router.params

  useEffect(() => {
    getPostDetail()
  }, [])

  useEffect(() => {
    let video
    if (isWeixin) {
      video = Taro.createVideoContext('goods-video')
    } else if (isWeb) {
      video = document.getElementById('goods-video')
    }

    if (!video) {
      return
    }

    if (play) {
      setTimeout(() => {
        console.log('video:', video)
        video.play()
      }, 200)
    } else {
      isWeixin ? video.stop() : video.pause()
    }
  }, [play])

  // 获取详情
  const getPostDetail = async () => {
    Taro.showLoading()
    const { post_info } = await api.mdugc.postdetail({
      post_id
    })
    Taro.hideLoading()
    // isoneself = memberData.memberInfo && memberData.memberInfo.user_id == res.post_info.user_id
    // if (old_isheart == -1) {
    //   old_isheart = res.post_info.like_status
    // }
    if (post_info.status != 1) {
      Taro.hideShareMenu()
    }
    const info = pickBy(post_info, doc.mdugc.UGC_DETAIL)
    setState((draft) => {
      draft.info = info
    })

    setTimeout(() => {
      listRef.current.reset()
    }, 100)
  }

  // 获取评论
  const fetchComment = async ({ pageIndex, pageSize }) => {
    let params = {
      page_no: pageIndex,
      page_size: pageSize,
      post_id
    }
    if (userInfo) {
      params = {
        ...params,
        user_id: userInfo.user_id
      }
    }
    const { list, total_count: total } = await api.mdugc.commentlist(params)
    const _commentList = pickBy(list, doc.mdugc.COMMENT_INFO)
    setState(draft => {
      draft.commentList = _commentList
      draft.commentTotal = _commentList.reduce((previous, current) => {
        return previous + current.child.length + 1
      }, 0)
    })
    return {
      total
    }
  }

  useShareAppMessage(async (res) => {
    if (S.getAuthToken()) {
      const shareInfo = await api.mdugc.postshare({
        post_id
      })
      setState((draft) => {
        draft.info['shareNums'] = shareInfo.share_nums
      })
    }
    console.log(`useShareAppMessage:`, `/subpages/mdugc/note-detail?post_id=${post_id}`)
    return {
      title: info.title,
      path: `/subpages/mdugc/note-detail?post_id=${post_id}`,
      imageUrl: info.cover
    }
  })

  const onChangeSwiper = (e) => {
    setState((draft) => {
      draft.curImgIdx = e.detail.current
    })
  }

  const isMyNote = () => {
    return userInfo.user_id == info.userId
  }

  // 关注|取消关注
  const handleFollower = async () => {
    const { action, followers } = await api.mdugc.followercreate({
      user_id: info.userId,
      follower_user_id: userInfo.user_id
    })
    if (action == 'unfollow') {
      showToast('取消关注')
    } else {
      showToast('关注成功')
    }

    setState(draft => {
      draft.info["followStatus"] = followers
    })
  }

  // 点赞
  const likeNote = async () => {
    const { action, likes } = await api.mdugc.postlike({
      user_id: userInfo.user_id,
      post_id
    })
    if (action == 'unlike') {
      showToast('取消点赞')
    } else {
      showToast('点赞成功')
    }
    setState(draft => {
      draft.info["likes"] = likes
      draft.info["likeStatus"] = action == 'unlike' ? 0 : 1
    })
  }

  // 收藏笔记
  const favoriteNote = async () => {
    const { action, likes } = await api.mdugc.postfavorite({
      post_id
    })
    if (action == 'unfavorite') {
      showToast('取消收藏')
    } else {
      showToast('收藏成功')
    }
    setState(draft => {
      draft.info["favoriteNums"] = likes
      draft.info["favoriteStatus"] = action == 'unfavorite' ? 0 : 1
    })
  }

  // 回复评论
  const handleCommitReply = () => {
    setState(draft => {
      draft.showCommentInput = true
      draft.parentCommentId = ''
      draft.commentPlaceholder = '请输入评论'
    })
  }

  // 点赞评论
  const handleCommentLike = async (comment_id, pindex, index) => {
    const { action, likes } = await api.mdugc.commentlike({
      user_id: userInfo.user_id,
      post_id,
      comment_id
    })

    // 判断是否二级评论，一级评论时index为点击事件
    const _commentList = JSON.parse(JSON.stringify(commentList))
    if (isNumber(index)) {
      _commentList[pindex].child[index].likeStatus = action == 'like' ? 1 : 0
      _commentList[pindex].child[index].likes = likes
    } else {
      _commentList[pindex].likeStatus = action == 'like' ? 1 : 0
      _commentList[pindex].likes = likes
    }

    setState(draft => {
      draft.commentList = _commentList
    })
  }

  // 提交回复
  const onSubmitComment = async (e) => {
    console.log('onSubmitComment:', e)
    let params = {
      user_id: userInfo.user_id,
      post_id,
      content: e
    }
    if (parentCommentId) {
      params.parent_comment_id = parentCommentId
    }
    const res = await api.mdugc.commentcreate(params)
    showToast(res.message)
    setState(draft => {
      draft.comment = ''
      draft.showCommentInput = false
    })
  }

  return (
    <SpPage
      className='page-ugc-detail'
      scrollToTopBtn
      ref={pageRef}
      renderFooter={
        <View className='action-container'>
          <View className='comment-input' onClick={handleCommitReply}>
            <Text className='iconfont icon-bianji1'></Text>
            <Text className="placeholder">留言评论...</Text>
          </View>
          <View className='btn-action-list'>
            <SpLogin className='action-item' onChange={likeNote}>
              <View className='btn-wrap'>
                <View
                  className={classNames('iconfont', {
                    'icon-dianzan': info?.likeStatus == 0,
                    'icon-dianzanFilled': info?.likeStatus == 1
                  })}
                ></View>
                <Text className="action-item-text">{`${info?.likes || 0}`}</Text>
              </View>
            </SpLogin>
            <SpLogin className='action-item' onChange={favoriteNote}>
              <View className='btn-wrap'>
                <View
                  className={classNames('iconfont', {
                    'icon-shoucang-01': info?.favoriteStatus == 0,
                    'icon-shoucanghover-01': info?.favoriteStatus == 1
                  })}
                ></View>
                <Text className="action-item-text">{`${info?.favoriteNums || 0}`}</Text>
              </View>
            </SpLogin>
            <AtButton className='action-item' openType='share'>
              <View
                className={classNames('iconfont', 'icon-fenxiang-01')}
              ></View>
              <Text className="action-item-text">{`${info?.shareNums || 0}`}</Text>
            </AtButton>
          </View>
        </ View>
      }
    >
      {!info && <SpLoading />}
      {info && <View className='note-contents'>
        {/* 轮播图 */}
        <View className='note-pic-container'>
          <Swiper
            className='note-swiper'
            // current={curImgIdx}
            onChange={onChangeSwiper}
          >
            {info.imgList?.map((item, idx) => (
              <SwiperItem key={`swiperitem__${idx}`}>
                <SpImage
                  mode='aspectFill'
                  src={item.url}
                  width={windowWidth * 2}
                  height={windowWidth * 2}
                ></SpImage>
              </SwiperItem>
            ))}
          </Swiper>

          {info.imgList?.length > 1 && (
            <View className='swiper-pagegation'>{`${curImgIdx + 1}/${info.imgList.length}`}</View>
          )}

          {info.video && play && (
            <View className='video-container'>
              <Video
                id='goods-video'
                className='item-video'
                src={info.video}
                showCenterPlayBtn={false}
              />
            </View>
          )}

          {info.video && (
            <View
              className={classNames('btn-video', {
                playing: play
              })}
              onClick={() => {
                setState((draft) => {
                  play ? (draft.play = false) : (draft.play = true)
                })
              }}
            >
              {!play && <SpImage className='play-icon' src='play2.png' width={50} height={50} />}
              {play ? '退出视频' : '播放视频'}
            </View>
          )}
        </View>
        <View className='ugc-author'>
          <View
            className='author-info'
            onClick={() => {

            }}
          >
            <SpImage circle src={info.headimgurl} width={88} height={88} />
            <Text className='author'>{info.username}</Text>
          </View>
          {
            !isMyNote() && <SpLogin
              className={classNames('btn-follow', {
                'follow': info.followStatus
              })}
              onChange={handleFollower}
            >
              {info.followStatus ? '已关注' : '+关注'}
            </SpLogin>
          }

        </View>

        <View className="ugc-content">
          <View className="title">{info.title}</View>
          <View className="content">
            {info.content}
          </View>

          <View className="topic-list">
            {info.topics?.map((item, index) => (
              <View className='topic-item' key={`topic-item__${index}`} onClick={() => {
                Taro.navigateTo({
                  url: `/subpages/mdugc/list?topic_id=${item.topic_id}&topic_name=${item.topic_name}`
                })
              }}>
                #{item.topic_name}
              </View>
            ))}
          </View>

          <View className="content-datetime">{info.created}</View>
        </View>

        <View className="remmend-goods">
          <WgtFloorImg info={{
            name: 'floorImg',
            base: {
              title: '推荐商品',
              subtitle: '',
              padded: true,
              WordColor: '#222',
              openBackImg: false,
              backgroundImg: ''
            },
            data: info.goods
          }} />
        </View>
        <SpScrollView className="comment-list"
          ref={listRef}
          auto={false}
          fetch={fetchComment}
          renderEmpty={
            <View className="comment-empty">
              <Text className="iconfont icon-pinglun"></Text>
              <View className="empty-text">
                <Text className="t1">还没有评论哦，</Text>
                <SpLogin onChange={handleCommitReply}>
                  <Text className="t2">点击评论</Text>
                </SpLogin>
              </View>
            </View>
          }>
          <View className="comment-body">
            <View className="comment-num">{`共${commentTotal}条评论`}</View>
            {
              commentList.map((item, index) => (
                <View className="comment-item" key={`comment-item__${index}`}>
                  <View className="item-hd">
                    <SpImage circle src={item.headimgurl} width={60} height={60} />
                  </View>
                  <View className="item-bd">
                    <View className="first-comment">
                      <View className="comment-info">
                        <View className="author">{item.username}</View>
                        <View className="comment-content" onClick={() => {
                          setState(draft => {
                            draft.showCommentInput = true
                            draft.parentCommentId = item.commentId
                            draft.commentPlaceholder = `回复 @${item.username}`
                          })
                        }}>{item.content}<Text className="create-time">{item.created}</Text></View>
                      </View>
                      <View className='comment-likes'>
                        <Text className={classNames("iconfont", {
                          'icon-dianzan': item.likeStatus == 0,
                          'icon-dianzanFilled': item.likeStatus == 1
                        })} onClick={handleCommentLike.bind(this, item.commentId, index)}></Text>
                        <Text className="like-num">{item.likes}</Text>
                      </View>
                    </View>
                    {
                      item?.child && <View className="sub-comment">
                        {
                          item?.child.map((citem, cindex) => (
                            <View className="sub-comment-item" key={`sub-comment-item__${cindex}`}>
                              <View className="sitem-hd">
                                <SpImage circle src={citem.headimgurl} width={40} height={40} />
                              </View>
                              <View className="sitem-bd">
                                <View className="author">{citem.username}</View>
                                <View className="comment-content">{citem.content}<Text className="create-time">{citem.created}</Text></View>
                              </View>
                              <View className="sitem-ft">
                                <Text className={classNames("iconfont", {
                                  'icon-dianzan': citem.likeStatus == 0,
                                  'icon-dianzanFilled': citem.likeStatus == 1
                                })} onClick={handleCommentLike.bind(this, citem.commentId, index, cindex)}></Text>
                                <Text className="like-num">{citem.likes}</Text>
                              </View>
                            </View>
                          ))
                        }
                      </View>

                    }
                  </View>
                </View>
              ))
            }
          </View>
        </SpScrollView>
      </View>}

      {
        showCommentInput && <View className="input-comment">
          <AtInput type="text" value={comment}
            placeholder={commentPlaceholder}
            adjustPosition
            autoFocus
            focus={showCommentInput}
            onChange={(e) => {
              setState(draft => {
                draft.comment = e
              })
            }}
            onBlur={() => {
              setState(draft => {
                draft.showCommentInput = false
              })
            }}
            onConfirm={onSubmitComment} />
        </View>
      }
    </SpPage>
  )
}

export default UgcNoteDetail
