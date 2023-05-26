import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import Taro, { useRouter, useShareAppMessage } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, Swiper, SwiperItem, } from '@tarojs/components'
import { AtActionSheet, AtActionSheetItem } from 'taro-ui'
import { FloatMenus, FloatMenuItem, SpPage, SpImage, SpLoading } from '@/components'
import S from '@/spx'
import { WgtFloorImg } from '@/pages/home/wgts'
import { classNames, isWeb, isWeixin, showLoading, pickBy } from '@/utils'

import api from '@/api'
import doc from '@/doc'
import { useImmer } from 'use-immer'

import './note-detail.scss'

const initialState = {
  isoneself: false,
  file_details: {
    user_id: '123',
    follow_status: true,
    title: 'ZzzzZ',
    content: 'dayugdwauhbdwajhdwahdpwuahdwa',
    userInfo: {
      headimgurl:
        'https://bbc-espier-images.amorepacific.com.cn/image/2/2022/05/10/bae3541a7470e305133303fd8463289anybc3XWcf3hTmdVy5VCMRmBNKi9xesKY',
      nickname: 'jhon asd'
    },
    imgs: [
      'https://bbc-espier-images.amorepacific.com.cn/image/2/2022/05/10/bae3541a7470e305133303fd8463289anybc3XWcf3hTmdVy5VCMRmBNKi9xesKY',
      'https://bbc-espier-images.amorepacific.com.cn/image/2/2022/05/10/bae3541a7470e305133303fd8463289anybc3XWcf3hTmdVy5VCMRmBNKi9xesKY',
      'https://bbc-espier-images.amorepacific.com.cn/image/2/2022/05/10/bae3541a7470e305133303fd8463289anybc3XWcf3hTmdVy5VCMRmBNKi9xesKY',
      'https://bbc-espier-images.amorepacific.com.cn/image/2/2022/05/10/bae3541a7470e305133303fd8463289anybc3XWcf3hTmdVy5VCMRmBNKi9xesKY'
    ],
    video:
      'https://ecshopx1.yuanyuanke.cn/videos/35/2022/05/27/1dc847cbf9d73a5281cf8b8c7896970ahwKqT4DAWI0mDWxatWvW9izucYk6uWXc',
    topics: [
      { topic_name: '香薰' },
      { topic_name: '水晶石' },
      { topic_name: '水晶石精油' },
      { topic_name: '火香薰' },
      { topic_name: '精油' },
      { topic_name: '话题跳转模板' }
    ],
    created: 1678185237,
    goods: {
      'name': 'floorImg',
      'base': {
        'title': '推荐商品',
        'subtitle': '看看大家都在买什么',
        'padded': true,
        'WordColor': '#222',
        'openBackImg': false,
        'backgroundImg': ''
      },
      'data': [
        {
          'imgUrl':
            'https://ecshopx1.yuanyuanke.cn/image/35/2022/05/27/9271b4c965ad206f2d17e1a9d58a4643YTT1ycKVjaGJN3IG9LRWsDX8YiPpIQpM',
          'title': '口红',
          'id': '751',
          'linkPage': 'sale_category',
          'linkType': 0,
          'ImgTitle': '123adadadaawdwafwfwafawsdswdawdwadwafwsdw'
        },
        {
          'ImgTitle': '334',
          'imgUrl':
            'https://ecshopx1.yuanyuanke.cn/image/35/2023/02/17/509930acbe53b6a18061d41d845ff210ufGM8HslZpfeWu5oxSybj4QCH5xlBMdJ',
          'linkPage': 'goods',
          'title': '02-13-01',
          'id': '1426'
        },
        {
          'ImgTitle': '5454',
          'imgUrl':
            'https://ecshopx1.yuanyuanke.cn/image/35/2023/02/07/ed285f4b49efb77cf43a4bdc6a9c9166H5dMdAdwbtOOZBrssuAs4kprohpzOUA1',
          'linkPage': 'goods',
          'title': '23-01-09',
          'id': '1337'
        },
        {
          'ImgTitle': '2123',
          'imgUrl':
            'https://ecshopx1.yuanyuanke.cn/image/35/2022/11/10/140445f4f4d4e7508cdbe6394a9cc681q0N8mmRcF53P27nkexGRc0LSNERCsUyw'
        }
      ]
    }
  },
  isOpened: false,
  inputtext: '',
  isfocus: false,
  input_bottom: 0,
  isPopups: false,
  poptitle: '',
  comment_act: {
    parent: '',
    reply: ''
  },
  commentlist: {
    2: {
      list: [
        {
          headimgurl:
            'https://bbc-espier-images.amorepacific.com.cn/image/2/2022/05/10/bae3541a7470e305133303fd8463289anybc3XWcf3hTmdVy5VCMRmBNKi9xesKY',
          nickname: '青蛙王子commentlist',
          content: '真好吃12w4d6w46d4pw',
          created: '2022-06-03 09:02',
          comment_id: '111',
          like_status: true,
          likes: 23,
          reply_nickname: '小蛙'
        }
      ]
    }
  },
  old_isheart: -1,
  commoditynum: 0,
  totalnum: 0,
  page: {
    total: 0
  },
  curImgIdx: 0,
  play: false,
  theory: [
    {
      headimgurl:
        'https://bbc-espier-images.amorepacific.com.cn/image/2/2022/05/10/bae3541a7470e305133303fd8463289anybc3XWcf3hTmdVy5VCMRmBNKi9xesKY',
      nickname: '小蛙',
      content: '真好吃12w4d6w46d4pw',
      created: '2022-06-03 09:02',
      comment_id: '1',
      like_status: true,
      likes: 23,
      child: [
        {
          headimgurl:
            'https://bbc-espier-images.amorepacific.com.cn/image/2/2022/05/10/bae3541a7470e305133303fd8463289anybc3XWcf3hTmdVy5VCMRmBNKi9xesKY',
          nickname: '青蛙王子child',
          content: '真好吃12w4d6w46d4pw',
          created: '2022-06-03 09:02',
          comment_id: '111',
          like_status: true,
          likes: 23,
          reply_nickname: '小蛙'
        }
      ]
    },
    {
      headimgurl:
        'https://bbc-espier-images.amorepacific.com.cn/image/2/2022/05/10/bae3541a7470e305133303fd8463289anybc3XWcf3hTmdVy5VCMRmBNKi9xesKY',
      nickname: '小蛙',
      content: '真好吃的那段难忘就啊等你回我的空间啊我看到结尾',
      created: '2022-02-03 09:02',
      comment_id: '2',
      like_status: false,
      likes: 23
    }
  ],

  info: null
}

function UgcNoteDetail(props) {
  const [state, setState] = useImmer(initialState)
  const {
    info
  } = state
  const memberData = useSelector((member) => member.member)
  const router = useRouter()
  const pageRef = useRef()

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

    if (state.play) {
      setTimeout(() => {
        console.log('video:', video)
        video.play()
      }, 200)
    } else {
      isWeixin ? video.stop() : video.pause()
    }
  }, [state.play])

  // 获取详情
  const getPostDetail = async () => {
    Taro.showLoading()
    const { post_id } = router.params
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
    setState((draft) => {
      draft.info = pickBy(post_info, doc.mdugc.UGC_DETAIL)
    })
  }

  useShareAppMessage(async (res) => {
    let { item_id } = router.params
    let { file_details } = state
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    } else if (res.from === 'menu') {
      // 来自右上角转发
    }
    let data = {
      post_id: item_id
    }
    const isAuth = S.getAuthToken()
    if (isAuth) {
      let share = await api.mdugc.postshare(data)
      if (share.post_id == item_id) {
        console.log('share', share.share_nums)
        file_details.share_nums = share.share_nums
        setState((draft) => {
          draft.file_details = file_details
        })
      }
    }

    return {
      title: file_details.title,
      path: `/mdugc/pages/make_details/index?item_id=${item_id}`,
      imageUrl: file_details.cover
    }
  })

  // 浮动按钮跳转
  const topages = (url) => {
    console.log('url', url)
    Taro.navigateTo({ url })
  }

  // 获取二级评论列表
  const getcommentlist = async (item) => {
    let { item_id } = router.params
    let { commentlist } = state
    let comment_id = item.comment_id
    let data = {}
    if (commentlist[comment_id]) {
      data = {
        page_no: commentlist[comment_id].page_no,
        page_size: commentlist[comment_id].page_size,
        post_id: commentlist[comment_id].post_id,
        parent_comment_id: commentlist[comment_id].parent_comment_id
      }
    } else {
      data = {
        page_no: 1,
        page_size: 10,
        post_id: item_id,
        parent_comment_id: item.comment_id
      }
    }
    if (memberData.memberInfo) {
      data.user_id = memberData.memberInfo.user_id
    }

    const { list, total_count: total } = await api.mdugc.commentlist(data)

    data.page_no += 1
    if (commentlist[comment_id]) {
      data.list = [...commentlist[comment_id].list, ...list]
    } else {
      data.list = [...list]
    }
    data.total = total
    commentlist[comment_id] = data
    setState((draft) => {
      draft.commentlist = commentlist
    })
  }
  // 商品点击
  const handleClickItem = (item) => {
    let url
    if (item.item_type === 'pointsmall') {
      //积分商城
      url = `/pages/item/espier-detail?id=${item.item_id}&dtid=${item.distributor_id}&type=pointitem`
    } else {
      url = `/pages/item/espier-detail?id=${item.item_id}&dtid=${item.distributor_id}`
    }
    Taro.navigateTo({
      url
    })
  }
  // 点击评论
  const onopen = (parent = '', reply = '') => {
    console.log('这是点击评论详情')
    let { comment_act } = state
    comment_act.parent = parent
    comment_act.reply = reply
    setState((draft) => {
      ; (draft.isOpened = true), (draft.comment_act = comment_act)
    })
  }
  // 关闭弹窗
  const closesheet = () => {
    let { isOpened, comment_act } = state
    if (isOpened) {
      setState((draft) => {
        draft.isOpened = false
      })
    }
  }
  // 回复评论
  const reply = (type) => {
    const isAuth = S.getAuthToken()
    if (!isAuth) {
      Taro.showToast({
        icon: 'none',
        title: '请先登录'
      })
      // setTimeout(() => {
      //   Taro.redirectTo({
      //     url:"/pages/member/index"
      //   })
      // }, 1000)

      return
    }
    let comment_act = JSON.parse(JSON.stringify(state.comment_act))
    if (type == 'one') {
      console.log('一级评论')
      comment_act.parent = ''
      comment_act.reply = ''
      setState((draft) => {
        ; (draft.inputtext = '请输入'), (draft.isfocus = true), (draft.comment_act = comment_act)
      })
    } else {
      console.log('二级评论_回复')
      closesheet()
      let name = ''

      if (comment_act.reply) {
        // 回复二级评论
        name = comment_act.reply.nickname
      } else if (comment_act.parent) {
        // 回复一级评论
        name = comment_act.parent.nickname
      }
      setState((draft) => {
        ; (draft.inputtext = `回复 @${name}：`), (draft.isfocus = true)
      })
    }
  }
  // 删除评论
  const deletecomment = () => {
    setState((draft) => {
      ; (draft.isPopups = true), (draft.poptitle = '确认要删除该评论吗？')
    })
    closesheet()
  }
  // 输入完成
  const setinput = async (e) => {
    console.log('这是文本', e, e.detail.value)
    let { theory, comment_act, commentlist, page, totalnum } = state
    let { item_id } = router.params
    let data = {
      user_id: memberData.memberInfo.user_id,
      post_id: item_id,
      content: e.detail.value
    }
    console.log('这是选中信息', comment_act)

    if (comment_act.reply) {
      // 回复二级评论
      console.log('回复二级评论')
      data.reply_comment_id = comment_act.reply.comment_id
      data.parent_comment_id = comment_act.parent.comment_id
    } else if (comment_act.parent) {
      // 回复一级评论
      console.log('回复一级评论')
      data.parent_comment_id = comment_act.parent.comment_id
    } else {
      console.log('生成一级评论')
    }
    let res = await api.mdugc.commentcreate(data)
    console.log('这是发布评论', res)
    Taro.showToast({
      icon: 'none',
      title: res.message
    })
    if (res && res.status == 1) {
      let itemi = {
        nickname: memberData.memberInfo.nickname,
        headimgurl: memberData.memberInfo.avatar,
        user_id: res.user_id,
        likes: 0,
        comment_id: res.comment_id,
        content: res.content,
        reply_user_id: res.reply_user_id,
        created: '刚刚',
        company_id: res.company_id
      }
      if (comment_act.reply) {
        // 回复二级评论
        itemi.reply_nickname = comment_act.reply.nickname
        if (commentlist[comment_act.parent.comment_id]) {
          commentlist[comment_act.parent.comment_id].list.unshift(itemi)
        } else {
          theory.forEach((theoryi) => {
            if (theoryi.comment_id == comment_act.parent.comment_id) {
              if (theoryi.child) {
                theoryi.child.unshift(itemi)
              } else {
                theoryi.child = []
                theoryi.child.unshift(itemi)
              }
            }
          })
        }
      } else if (comment_act.parent) {
        // 回复一级评论
        itemi.reply_nickname = comment_act.parent.nickname
        if (commentlist[comment_act.parent.comment_id]) {
          commentlist[comment_act.parent.comment_id].list.unshift(itemi)
        } else {
          theory.forEach((theoryi) => {
            if (theoryi.comment_id == comment_act.parent.comment_id) {
              if (theoryi.child) {
                theoryi.child.unshift(itemi)
              } else {
                theoryi.child = []
                theoryi.child.unshift(itemi)
              }
            }
          })
        }
      } else {
        if (totalnum) {
          totalnum = totalnum - 0 + 1
        } else {
          totalnum = page.total - 0 + 1
        }
        theory.unshift(itemi)
      }
    }
    setState((draft) => {
      ; (draft.theory = theory), (draft.commentlist = commentlist), (draft.totalnum = totalnum)
    })
  }
  // 失去焦点
  const onBlurinput = () => {
    setState((draft) => {
      ; (draft.inputtext = ''), (draft.isfocus = false)
    })
  }
  // 键盘高度变化
  const setinputtop = (e) => {
    console.log('键盘高度变化', e, e.detail.height)
    let het = e.detail.height - 0
    setState((draft) => {
      draft.input_bottom = het
    })
  }
  // 跳转话题列表
  const wordlist = (item) => {
    let items = JSON.stringify(item)
    console.log(123, items)
    Taro.navigateTo({
      url: `/subpages/mdugc/pages/list/index2?item=${items}`
    })
  }
  // 遮罩层
  const onLast = async (ispup) => {
    let { poptitle, theory, comment_act, commentlist, totalnum, page } = state
    if (ispup == 2 && poptitle) {
      if (poptitle.indexOf('评论') > 0) {
        console.log('确认删除评论')
        let data = {
          user_id: memberData.memberInfo.user_id,
          comment_id: ''
        }
        if (comment_act.reply) {
          // 删除二级评论
          data.comment_id = comment_act.reply.comment_id
        } else if (comment_act.parent) {
          // 删除一级评论
          data.comment_id = comment_act.parent.comment_id
          if (totalnum) {
            totalnum = totalnum - 1
          } else {
            totalnum = page.total - 1
          }
        }
        let res = await api.mdugc.commentdelete(data)
        if (res.comment_id) {
          try {
            theory.forEach((theoryi, idx) => {
              if (theoryi.comment_id == data.comment_id) {
                theory.splice(idx, 1)
                console.log('hahaha1', theory)
                throw new Error('阻止')
              }
              if (theoryi.child) {
                theoryi.child.forEach((childi, cidx) => {
                  if (childi.comment_id == data.comment_id) {
                    theoryi.child.splice(cidx, 1)
                    console.log('hahaha2', theory)
                    throw new Error('阻止')
                  }
                })
              }
            })
          } catch (error) {
            console.log('error_阻止成功', error)
          }
          console.log('删除测试', theory)
          if (commentlist[comment_act.parent.comment_id]) {
            commentlist[comment_act.parent.comment_id].list.forEach((listi, i) => {
              if (listi.comment_id == data.comment_id) {
                commentlist[comment_act.parent.comment_id].list.splice(i, 1)
              }
            })
          }
          setState((draft) => {
            ; (draft.theory = theory), (draft.commentlist = commentlist), (draft.totalnum = totalnum)
          })
        }
      } else {
        console.log('确认删除作品')
        let { item_id } = that.$router.params
        let data = {
          post_id: [item_id]
        }
        let res = await api.mdugc.postdelete(data)
        if (res.message) {
          Taro.showToast({
            icon: 'none',
            title: res.message,
            duration: 1000
          })
          let pages = Taro.getCurrentPages() // 获取当前的页面栈
          if (pages.length > 1) {
            let prevPage = pages[pages.length - 2] // 获取上一页面
            console.log('这是详情页', pages)

            prevPage.setData({
              //设置上一个页面的值
              delete: item_id
            })
            setTimeout(() => {
              Taro.navigateBack({
                delta: 1
              })
            }, 500)
          } else {
            Taro.redirectTo({
              url: '/mdugc/pages/index/index'
            })
          }
        }
      }
    }
    setState((draft) => {
      draft.isPopups = false
    })
  }
  // 删除笔记
  const deletenotes = () => {
    setState((draft) => {
      ; (draft.isPopups = true), (draft.poptitle = '确认要删除这条笔记吗？')
    })
  }
  // 点赞评论
  const commentlike = async (comment_id) => {
    const isAuth = S.getAuthToken()
    if (!isAuth) {
      Taro.showToast({
        icon: 'none',
        title: '请先登录'
      })
      // setTimeout(() => {
      //   Taro.redirectTo({
      //     url:"/pages/member/index"
      //   })
      // }, 1000)

      return
    }
    let { item_id } = router.params
    let { theory, comment_act, commentlist } = state
    let data = {
      user_id: memberData.memberInfo.user_id,
      post_id: item_id,
      comment_id
    }
    let res = await api.mdugc.commentlike(data)
    console.log('点赞返回', res)

    if (res.action) {
      try {
        theory.forEach((theoryi, idx) => {
          if (theoryi.comment_id == data.comment_id) {
            theoryi.like_status = res.action == 'like' ? 1 : 0
            // console.log("theoryi.like_statustheoryi.like_status",theoryi.like_status)
            theoryi.likes = res.likes
            throw new Error('阻止')
          }
          if (theoryi.child) {
            theoryi.child.forEach((childi, cidx) => {
              if (childi.comment_id == data.comment_id) {
                childi.like_status = res.action == 'like' ? 1 : 0
                childi.likes = res.likes
                throw new Error('阻止')
              }
            })
          }
        })
      } catch (error) {
        console.log('error_阻止成功', error)
      }
      console.log('点赞', theory)

      // commentlist.forEach((lists)=>{
      for (let key in commentlist) {
        commentlist[key].list.forEach((listi) => {
          if (listi.comment_id == data.comment_id) {
            listi.like_status = res.action == 'like' ? 1 : 0
            listi.likes = res.likes
          }
        })
      }

      setState((draft) => {
        ; (draft.theory = theory), (draft.commentlist = commentlist)
      })
    }
  }
  // 点赞笔记
  const postlike = async () => {
    const isAuth = S.getAuthToken()
    if (!isAuth) {
      Taro.showToast({
        icon: 'none',
        title: '请先登录'
      })
      // setTimeout(() => {
      //   Taro.redirectTo({
      //     url:"/pages/member/index"
      //   })
      // }, 1000)

      return
    }
    let { item_id } = router.params
    let { file_details } = state
    let data = {
      user_id: memberData.memberInfo.user_id,
      post_id: item_id
    }
    let message = ''
    let res = await api.mdugc.postlike(data)
    if (res.action) {
      if (res.action == 'unlike') {
        file_details.like_status = 0
        message = '取消点赞'
      } else if ((res.action = 'like')) {
        file_details.like_status = 1
        message = '点赞成功'
      }
      Taro.showToast({
        icon: 'none',
        title: message,
        duration: 1000
      })
      file_details.likes = res.likes
      setState((draft) => {
        draft.file_details = file_details
      })
    }
  }
  // 收藏笔记
  const postfavorite = async () => {
    const isAuth = S.getAuthToken()
    if (!isAuth) {
      Taro.showToast({
        icon: 'none',
        title: '请先登录'
      })
      // setTimeout(() => {
      //   Taro.redirectTo({
      //     url:"/pages/member/index"
      //   })
      // }, 1000)

      return
    }
    let { item_id } = router.params
    let { file_details } = state
    let data = {
      post_id: item_id
    }
    let message = ''
    let res = await api.mdugc.postfavorite(data)
    if (res.action) {
      if (res.action == 'unfavorite') {
        message = '取消收藏'
        file_details.favorite_status = 0
      } else if ((res.action = 'favorite')) {
        message = '收藏成功'
        file_details.favorite_status = 1
      }
      Taro.showToast({
        icon: 'none',
        title: message,
        duration: 1000
      })
      file_details.favorite_nums = res.likes
      setState((draft) => {
        draft.file_details = file_details
      })
    }
  }
  // 关注|取消关注
  const followercreate = async () => {
    const isAuth = S.getAuthToken()
    if (!isAuth) {
      Taro.showToast({
        icon: 'none',
        title: '请先登录'
      })
      // setTimeout(() => {
      //   Taro.redirectTo({
      //     url:"/pages/member/index"
      //   })
      // }, 1000)

      return
    }
    let { file_details } = state
    let data = {
      user_id: file_details.user_id,
      follower_user_id: memberData.memberInfo.user_id
    }
    let res = await api.mdugc.followercreate(data)
    if (res.action == 'unfollow') {
      // 取消关注
      file_details.follow_status = 0
      Taro.showToast({
        icon: 'none',
        title: '取消关注'
      })
    } else if (res.action == 'follow') {
      // 关注
      file_details.follow_status = 1
      Taro.showToast({
        icon: 'none',
        title: '关注成功'
      })
    }
    setState((draft) => {
      draft.file_details = file_details
    })
  }
  // 收起评论
  const stowcommentlist = (comment_id) => {
    let { commentlist } = state
    delete commentlist[comment_id]
    setState((draft) => {
      draft.commentlist = commentlist
    })
  }
  // 时间戳转化
  const formatDate = (now) => {
    if (!now) {
      return ''
    }
    now = now * 1000
    const date = new Date(now)
    const new_data = new Date()
    // let new_y = new_data.getFullYear() //当前年份
    let y = date.getFullYear() // 年份
    let m = date.getMonth() + 1 // 月份，注意：js里的月要加1
    let d = date.getDate() // 日
    // let h = date.getHours() // 小时
    // let min = date.getMinutes() // 分钟
    // let s = date.getSeconds() // 秒
    // 返回值，根据自己需求调整，现在已经拿到了年月日时分秒了
    let time = m + '月' + d + '日'
    // if (new_y > y) {
    time = y + '年' + time
    // }
    return time
  }

  // 商品组件滚动
  const oncommoditynum = () => {
    setState(
      (draft) => {
        draft.commoditynum = 1
      },
      () => {
        if (process.env.TARO_ENV === 'weapp') {
          // workaround for weapp
          setState((draft) => {
            draft.commoditynum = null
          })
        }
      }
    )
  }
  // onscrollcommodity=(e)=>{
  //   console.log("这是滚动距离",e)
  // }

  const onChangeSwiper = (e) => {
    setState((draft) => {
      draft.curImgIdx = e.detail.current
    })
  }

  const { windowWidth } = Taro.getSystemInfoSync()


  // console.log("这是下拉",page)
  return (
    <SpPage
      className='page-ugc-detail'
      scrollToTopBtn
      ref={pageRef}
      renderFooter={
        <View className='action-container'>
          <View className='comment-input'>
            <Text className='iconfont icon-bianji1'></Text>
            <Text className="placeholder">留言评论...</Text>
          </View>
          <View className='btn-action-list'>
            <View className='action-item'>
              <View
                className={classNames('iconfont', {
                  'icon-dianzan': info?.favoriteStatus,
                  'icon-dianzanFilled': !info?.favoriteStatus
                })}
              ></View>
              <Text className="action-item-text">{`${info?.likes}`}</Text>
            </View>
            <View className='action-item'>
              <View
                className={classNames('iconfont', {
                  'icon-shoucanghover-01': info?.favoriteStatus,
                  'icon-shoucang-01': !info?.favoriteStatus
                })}
              ></View>
              <Text className="action-item-text">{`${info?.favoriteNums}`}</Text>
            </View>
            <View className='action-item'>
              <View
                className={classNames('iconfont', {
                  'icon-shoucanghover-01': info?.favoriteStatus,
                  'icon-shoucang-01': !info?.favoriteStatus
                })}
              ></View>
              <Text className="action-item-text">{`${info?.shareNums}`}</Text>
            </View>
          </View>

          {/* <Button openType='share' className='ugcdetailsr_footer_icon ugcdetailsr_footer_btn'>
            <View className='iconfont icon-fenxiang-01 share'></View>
            <Text>{file_details.share_nums ? file_details.share_nums : 0}</Text>
          </Button> */}
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

          {/* {file_details?.imgs?.length > 1 && (
            <View className='swiper-pagegation'>{`${curImgIdx + 1}/${file_details.imgs.length}`}</View>
          )}

          {file_details.video && play && (
            <View className='video-container'>
              <Video
                id='goods-video'
                className='item-video'
                src={file_details.video}
                showCenterPlayBtn={false}
              />
            </View>
          )}

          {file_details.video && (
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
          )} */}
        </View>
        <View className='ugc-author'>
          <View
            className='author-info'
            onClick={() => {

            }}
          >
            <SpImage circle src={info.headimgurl} width={88} height={88} />
            <Text className='author'>{info.nickname || '商派ECshopx-淘宝店'}</Text>
          </View>
          <View
            className={classNames('btn-follow', {
              'follow': info.followStatus
            })}
            onClick={followercreate.bind(this)}
          >
            {info.followStatus ? '已关注' : '+关注'}
          </View>
        </View>

        <View className="ugc-content">
          <View className="title">{info.title}</View>
          <View className="content">
            {info.content}
          </View>

          <View className="topic-list">
            {info.topics?.map((item, index) => (
              <View className='topic-item' key={`topic-item__${index}`}>
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

        <View className="comment-list"></View>

      </View>}
    </SpPage>
  )
}

export default UgcNoteDetail
