import React, { useEffect } from 'react'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import { useSelector } from 'react-redux'
import { pickBy } from '@/utils'
import { useImmer } from 'use-immer'
import api from '@/api'
import imgUploader from '@/utils/upload'
import { AtInput, AtTextarea, AtActionSheet, AtActionSheetItem, AtButton } from 'taro-ui'
import { View, Text, Block } from '@tarojs/components'
import { SpPage, SpImg, SpUpload } from '@/components'
import { TagsBar, NavBar, Popups } from '../../components'

import './note.scss'

const initialState = {
  list: [],
  oddList: [],
  evenList: [],
  curTagId: [], //标签
  istag: 1, //时间、热度
  val: '', //搜索框
  tagsList: [],
  refresherTriggered: false,
  page: {
    page_no: 1,
    page_size: 10
  },
  file_text: {},
  file_word: [],
  file_commodity: [],
  file_img: [],
  file_video: {},
  isPopups: false,
  videoenable: 0,
  elastic: {
    title: '使用您的摄像头，将会上传你摄录的照片及视频',
    closetext: '拒绝',
    showtext: '允许',
    type: 0
  },
  isGrant: false, //是否授权
  isOpened: false, //是否显示上传按钮
  uploadtype: [],
  upload_choice: [
    {
      text: '添加视频',
      type: 'video'
    },
    {
      text: '添加图片',
      type: 'img'
    }
  ],
  upload_img: [
    {
      text: '拍照',
      type: 'camera_i'
    },
    {
      text: '从相册选择',
      type: 'album_i'
    }
  ],
  upload_video: [
    {
      text: '拍摄',
      type: 'camera_v'
    },
    {
      text: '从相册选择',
      type: 'album_v'
    }
  ],

  imageList: [],
  remmendItems: []
}

function UgcNote(props) {
  const [state, setState] = useImmer(initialState)
  const memberData = useSelector((member) => member.member)
  const colors = useSelector((state) => state.sys)
  const router = useRouter()
  const {
    file_video,
    file_img,
    occupy,
    file_text,
    file_word,
    curTagId,
    file_commodity,
    isPopups,
    isGrant,
    elastic,
    isOpened,
    uploadtype,
    imageList,
    remmendItems
  } = state

  useEffect(() => {
    iniData()

    Taro.eventCenter.on('onEventSubjectTalk', (item) => {
      console.log('onEventSubjectTalk:', item)
      setState(draft => {
        draft.refundStore = item
      })
    })

    Taro.eventCenter.on('onEventRemmendItems', (item) => {
      console.log('onEventRemmendItems:', item)
      setState(draft => {
        draft.refundStore = item
      })
    })

    return () => {
      Taro.eventCenter.off('onEventSubjectTalk')
      Taro.eventCenter.off('onEventRemmendItems')
    }

  }, [])

  const iniData = async () => {
    console.log(router.params) // 页面参数获取
    let { post_id } = router.params
    let res = await api.mdugc.postsetting({ type: 'video' })
    console.log('视频是否开启上传', res['video.enable'])
    setState((draft) => {
      draft.videoenable = res['video.enable']
    })

    if (post_id) {
      Taro.showLoading({
        title: '加载中',
        mask: true
      })
      let { file_video, file_img, file_text, file_commodity, file_word } = state
      let data = {
        post_id
      }
      let { post_info } = await api.mdugc.postdetail(data)
      if (post_info) {
        console.log('这是详情', post_info)
        // 视频
        if (post_info.video) {
          file_video.url = post_info.video
          file_video.proportion = post_info.video_ratio
          file_video.cover = post_info.cover
          file_video.video_idx = post_info.video_place ? post_info.video_place : -1
        }
        // 推荐商品
        if (post_info.goods && post_info.goods.length > 0) {
          let goods = pickBy(post_info.goods)
          file_commodity = [...goods]
        }
        // 话题
        if (post_info.topics && post_info.topics.length > 0) {
          file_word = post_info.topics
        }
        // 标题|文本
        file_text.title = post_info.title
        file_text.attextarea = post_info.content
        // 图片|tag
        if (post_info.images && post_info.images.length > 0) {
          let imgs = []

          post_info.images.forEach((item, idx) => {
            let imgi = {
              bg_shareImg: item.url,
              imge_id: post_info.images_origin[idx],
              proportion: item.proportion,
              ugcwidth: item.ugcwidth,
              movearry: []
            }
            item.tags.forEach((itemi) => {
              let movearryi = {
                than_x: itemi.movearray.than_x,
                than_y: itemi.movearray.than_y,
                value: {
                  tag_id: itemi.tag_id,
                  tag_name: itemi.tag_name
                },
                x: itemi.movearray.x,
                y: itemi.movearray.y
              }
              imgi.movearry.push(movearryi)
            })
            imgs.push(imgi)
          })
          file_img = [...imgs]
        }
        setState(
          (draft) => {
            ; (draft.file_video = file_video),
              (draft.file_img = file_img),
              (draft.file_text = file_text),
              (draft.file_commodity = file_commodity),
              (draft.file_word = file_word)
          },
          () => {
            Taro.hideLoading()
          }
        )
      }
    }
  }

  useDidShow(() => {
    let file_word = JSON.parse(JSON.stringify(state.file_word))
    let file_commodity = JSON.parse(JSON.stringify(state.file_commodity))

    console.log('触发')
    Taro.enableAlertBeforeUnload({
      message: '返回上一页将不会保存该编辑页内容',
      success: function (res) {
        console.log('成功：', res)
      },
      fail: function (err) {
        console.log('失败：', err)
      }
    })
    // Taro.setNavigationBarColor({
    //   frontColor: '#000000',
    //   backgroundColor: '#ffffff',
    // })

    let pages = Taro.getCurrentPages()
    let currentPage = pages[pages.length - 1] // 获取当前页面
    if (currentPage.__data__.img) {
      // 获取值
      console.log('这是图片编辑页传递的数据', currentPage.__data__.img)
      let img = currentPage.__data__.img
      addfileimg(img)
      currentPage.setData({
        //清空上一页面传递值
        img: ''
      })
    } else if (currentPage.__data__.word) {
      console.log('这是添加话题页传递的数据', currentPage.__data__.word, file_word)
      let word = currentPage.__data__.word
      let is = file_word?.findIndex((item) => {
        return item.topic_id == word.topic_id
      })
      console.log('isisis', is)
      if (is < 0) {
        file_word.push(word)
      } else {
        Taro.showToast({
          icon: 'none',
          title: '该话题已选择！'
        })
      }

      setState((draft) => {
        draft.file_word = file_word
      })
      currentPage.setData({
        //清空上一页面传递值
        word: ''
      })
    } else if (currentPage.__data__.complete) {
      console.log('这是添加推荐商品页传递的数据', currentPage.__data__.complete)
      let complete = currentPage.__data__.complete
      // item_id
      let is = file_commodity.findIndex((item) => {
        return item.item_id == complete.item_id
      })
      console.log('isisis', is)
      if (is < 0) {
        file_commodity.push(complete)
      } else {
        Taro.showToast({
          icon: 'none',
          title: '该商品已选择！'
        })
      }
      setState((draft) => {
        draft.file_commodity = file_commodity
      })
      currentPage.setData({
        //清空上一页面传递值
        complete: ''
      })
    }
  })

  // 上传视频
  const chooseVideo = async (type) => {
    wx.chooseMedia({
      count: 1,
      mediaType: ['video'],
      sourceType: [type],
      camera: 'back',
      success: function (res) {
        let videos = res.tempFiles[0]
        console.log(res, videos)
        if (videos.size <= 51200000) {
          if (videos.tempFilePath.slice(-4) == '.mp4') {
            console.log('视频及第一帧图片', videos)
            addvideos(videos)
          } else {
            Taro.showToast({
              icon: 'none',
              title: '视频格式应为mp4！'
            })
          }
        } else {
          Taro.showToast({
            icon: 'none',
            title: '视频不能大于50mb，请压缩后重试！'
          })
        }
      }
    })
  }
  const addvideos = async (item) => {
    Taro.showLoading({
      title: '加载中',
      mask: true
    })
    let { file_video } = state
    let video = [
      {
        file: {
          path: item.tempFilePath
        },
        url: item.tempFilePath
      }
    ]
    let cover = [
      {
        file: {
          path: item.thumbTempFilePath
        },
        url: item.thumbTempFilePath
      }
    ]
    let videos = await imgUploader.uploadImageFn(video, 'videos', {
      image_type: 'video/mp4',
      storage: 'videos'
    })
    let covers = await imgUploader.uploadImageFn(cover, 'image', {
      image_type: 'image/jpeg',
      storage: 'image'
    })
    console.log('videos---covers', videos, covers)
    file_video.url = videos[0].url.split('ugcimgid')[0]
    // file_video.urlimge_id=videos[0].url.split("ugcimgid")[1]

    file_video.cover = covers[0].url.split('ugcimgid')[0]
    // file_video.coverimge_id=covers[0].url.split("ugcimgid")[1]

    file_video.proportion = item.height / item.width
    etState(
      (draft) => {
        draft.file_video = file_video
      },
      () => {
        Taro.hideLoading()
      }
    )
  }
  // 图片上传
  const handleImageChange = (type) => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: async (res) => {
        let tempFilePaths = res.tempFilePaths[0]
        if (res.tempFiles[0].size <= 5120000) {
          if (
            tempFilePaths.slice(-4) == '.jpeg' ||
            tempFilePaths.slice(-4) == '.jpg' ||
            tempFilePaths.slice(-4) == '.png' ||
            tempFilePaths.slice(-4) == '.gif'
          ) {
            Taro.showLoading({
              title: '加载中',
              mask: true
            })

            let file = ''
            let imgs = [
              {
                file: {
                  path: tempFilePaths
                },
                url: tempFilePaths
              }
            ]
            let files = await imgUploader.uploadImageFn(imgs, 'image', {
              image_type: 'image/jpeg',
              storage: 'image'
            })
            console.log('图片上传', res, files)

            Taro.getImageInfo({
              src: tempFilePaths,
              success: function (resimg) {
                console.log(resimg.width)
                console.log(resimg.height)
                let proportion = resimg.height / resimg.width
                file = {
                  imgurl: files[0].url.split('ugcimgid')[0],
                  imge_id: files[0].url.split('ugcimgid')[1],
                  proportion
                }
                file = JSON.stringify(file)
                Taro.hideLoading()
                Taro.navigateTo({
                  url: `/subpages/mdugc/pages/make_img/index?imgurl=${file}`
                })
              }
            })
          } else {
            Taro.showToast({
              icon: 'none',
              title: '图片格式仅支持jpgpnggif'
            })
          }
        } else {
          Taro.showToast({
            icon: 'none',
            title: '图片不能大于5mb，请压缩后重试!'
          })
        }
      }
    })
  }
  // 转base64
  const fileToBase64 = (filePath) => {
    return new Promise((resolve) => {
      let fileManager = Taro.getFileSystemManager()
      fileManager.readFile({
        filePath,
        encoding: 'base64',
        success: (e) => {
          resolve(`data:image/jpg;base64,${e.data}`)
        }
      })
    })
  }
  // 添加图片
  const addfileimg = (imgs) => {
    console.log('这是图片详细信息', imgs)
    let img = JSON.parse(JSON.stringify(imgs))
    let file_img = JSON.parse(JSON.stringify(state.file_img))
    if (img.indexpages !== '' && img.indexpages >= 0) {
      let idx = img.indexpages
      delete img.indexpages
      file_img[idx].movearry = img.movearry
      file_img[idx].ugcwidth = img.ugcwidth
    } else {
      file_img.push(img)
    }

    setState((draft) => {
      draft.file_img = file_img
    })
  }
  // 删除
  const deletefile = (i, isfile) => {
    const file_video = JSON.parse(JSON.stringify(state.file_video))
    const file_img = JSON.parse(JSON.stringify(state.file_img))
    if (isfile == 'video') {
      file_video = {
        url: '',
        // urlimge_id:'',
        cover: '',
        // coverimge_id:'',
        proportion: '',
        video_idx: -1
      }
      setState((draft) => {
        draft.file_video = file_video
      })
    } else if (isfile == 'img') {
      file_img.splice(i, 1)
      if (0 <= i && i <= file_video.video_idx) {
        file_video.video_idx -= 1
      }
      setState((draft) => {
        ; (draft.file_img = file_img), (draft.file_video = file_video)
      })
    }
  }
  // 删除商品
  const deletecommodity = (i) => {
    let file_commodity = JSON.parse(JSON.stringify(state.file_commodity))
    file_commodity.splice(i, 1)
    setState((draft) => {
      draft.file_commodity = file_commodity
    })
  }
  // 删除话题
  const deleteword = (i) => {
    let nfile_word = JSON.parse(JSON.stringify(state.file_word))
    nfile_word.splice(i, 1)
    setState((draft) => {
      draft.file_word = nfile_word
    })
  }
  // 编辑
  const editimg = (i) => {
    let { file_img } = state
    let imgurls = {
      ietms: file_img[i],
      idx: i
    }
    imgurls = JSON.stringify(imgurls)
    Taro.navigateTo({
      url: `/subpages/mdugc/pages/make_img/index?imgurls=${imgurls}`
    })
  }
  // 输入框
  const handleChangetext = (val) => {
    let file_text = JSON.parse(JSON.stringify(state.file_text))
    file_text.title = val
    setState((draft) => {
      draft.file_text = file_text
    })
  }
  const handleChangeattextarea = (val) => {
    let file_text = JSON.parse(JSON.stringify(state.file_text))
    file_text.attextarea = val
    setState((draft) => {
      draft.file_text = file_text
    })
  }
  // 点击话题
  const handleTagChange = (id) => {
    setState((draft) => {
      draft.curTagId = id
    })
  }

  // 推荐商品
  const addcommodity = () => {
    Taro.navigateTo({
      url: `/subpages/mdugc/pages/make_complete/index`
    })
  }
  const ischeck = (is_draft) => {
    let { file_video, file_img, file_text, file_commodity, file_word, videoenable } = state
    let emoji = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g
    let idx = 1
    console.log('触发')
    if (is_draft) {
      // 保存草稿判断
      idx = 0
      if (
        file_img.length > 0 ||
        file_video.cover ||
        file_text.title ||
        file_text.attextarea ||
        file_word.length > 0 ||
        file_commodity.length > 0
      ) {
        idx = 1
        console.log('草稿通过')
      } else {
        Taro.showToast({
          icon: 'none',
          title: '笔记不能为空!'
        })
      }
    } else {
      // 发布笔记判断
      if (videoenable != 1 && file_img.length == 0) {
        Taro.showToast({
          icon: 'none',
          title: '请上传图片！'
        })
        idx = 0
      } else if (videoenable == 1 && file_img.length == 0 && !file_video.cover) {
        Taro.showToast({
          icon: 'none',
          title: '请上传视频或图片！'
        })
        idx = 0
      } else if (!file_text.title) {
        Taro.showToast({
          icon: 'none',
          title: '请填写标题！'
        })
        idx = 0
      } else if (!file_text.attextarea) {
        Taro.showToast({
          icon: 'none',
          title: '请添加正文'
        })
        idx = 0
      } else if (emoji.test(file_text.title)) {
        Taro.showToast({
          icon: 'none',
          title: '请删除标题中表情!'
        })
        idx = 0
      }
    }

    return idx
  }

  // 上传笔记|草稿
  const oncreate = async (is_draft) => {
    let { md_drafts, post_id } = router.params

    console.log('memberData', memberData)
    let { file_video, file_img, file_text, file_commodity, file_word } = state
    let is = ischeck(is_draft)
    if (is != 1) {
      return
    }
    Taro.showLoading({
      title: '加载中',
      mask: true
    })
    // 封面/视频
    let cover = ''
    let video = ''
    let video_ratio = ''
    let video_place = ''
    if (file_video.cover) {
      cover = 'image/' + file_video.cover.split('/image/')[1]
      // 有视频则
      video = 'image/' + file_video.url.split('/image/')[1]
      video_ratio = file_video.proportion
      video_place = file_video.video_idx
    } else if (file_img.length > 0) {
      cover = 'image/' + file_img[0].bg_shareImg.split('/image/')[1]
    }
    // 推荐商品
    let goods = []
    file_commodity.forEach((item) => {
      goods.push(item.item_id)
    })
    // 话题
    let topics = []
    file_word.forEach((item) => {
      topics.push(item.topic_id)
    })
    // 图片id及相对路径
    let images = []
    file_img.forEach((item) => {
      images.push(item.imge_id)
    })
    let image_path = []
    file_img.forEach((item) => {
      let pushs = 'image/' + item.bg_shareImg.split('/image/')[1]
      image_path.push(pushs)
    })
    // 图片tag信息
    let image_tag = []
    file_img.forEach((item) => {
      let tagi = {
        'image_id': '',
        'proportion': '',
        'ugcwidth': '',
        'tags': []
      }
      tagi.image_id = item.imge_id
      tagi.proportion = item.proportion
      tagi.ugcwidth = item.ugcwidth
      item.movearry.forEach((mi) => {
        let mis = {
          'tag_id': '',
          'tag_name': 'lv',
          'movearray': {}
        }
        mis.tag_id = mi.value.tag_id
        mis.tag_name = mi.value.tag_name
        let movearrays = JSON.parse(JSON.stringify(mi))
        delete movearrays.value
        mis.movearray = movearrays
        tagi.tags.push(mis)
      })
      image_tag.push(tagi)
    })

    let data = {
      user_id: memberData.memberInfo.user_id,
      title: file_text.title,
      content: file_text.attextarea,
      cover,
      images,
      image_path,
      topics,
      goods,
      image_tag,
      is_draft: 0,
      video: '',
      video_ratio: '',
      video_place: ''
    }
    if (video) {
      data.video = video
      data.video_ratio = video_ratio
      data.video_place = video_place
    }
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
    if (is_draft) {
      data.is_draft = 1
    }

    console.log('传递参数', data)
    let res = await api.mdugc.create(data)
    if (res.message) {
      Taro.hideLoading()
      Taro.showToast({
        icon: 'none',
        title: res.message,
        duration: 1000,
        mask: true
      })
      Taro.disableAlertBeforeUnload()
      setTimeout(() => {
        Taro.navigateBack({
          delta: 1
        })
      }, 1000)
    }
    console.log('这是信息', res)
  }

  // 返回上一页
  const onugcBack = async () => {
    console.log('返回上一页')
    // setState((draft) => {
    //   draft.isPopups = true
    // })
    const { confirm } = await Taro.showModal({
      title: '提示',
      content: '是否退出当前编辑,退出内容不可保存哦～',
      confirmText: '确认退出',
      cancelText: '继续编辑',
      confirmColor: colors.colorPrimary
    })

    if (confirm) {
      setState((draft) => {
        draft.isback = false
      })
      wx.disableAlertBeforeUnload()
      Taro.navigateBack({
        delta: 1
      })
    }
  }
  // const onLast = (isLast) => {
  //   console.log('这是遮罩层数据', isLast)
  //   if (isLast == 1) {
  //     setState((draft) => {
  //       draft.isback = false
  //     })
  //     wx.disableAlertBeforeUnload()
  //     Taro.navigateBack({
  //       delta: 1
  //     })
  //   }
  //   setState((draft) => {
  //     draft.isPopups = false
  //   })
  // }
  // 是否授权摄像头
  const isallowcamera = (type) => {
    let { elastic } = state
    Taro.showLoading({
      title: '加载中',
      mask: true
    })
    wx.getSetting({
      success(res) {
        // console.log("授权信息",res.authSetting['scope.camera'])
        Taro.hideLoading()
        if (!res.authSetting['scope.camera']) {
          wx.authorize({
            scope: 'scope.camera',
            success() {
              if (type) {
                chooseVideo('camera')
              } else {
                handleImageChange('camera')
              }
            },
            fail: () => {
              //用户拒绝授权，然后就引导授权（这里的话如果用户拒绝，不会立马弹出引导授权界面，坑就是上边所说的官网原因）
              console.log('用户无授权')
              elastic = {
                title: '使用您的摄像头，将会上传你摄录的照片及视频',
                closetext: '拒绝',
                showtext: '允许',
                type: 0
              }
              setState((draft) => {
                ; (draft.isGrant = true), (draft.elastic = elastic)
              })
            }
          })
        } else {
          if (type) {
            chooseVideo('camera')
          } else {
            handleImageChange('camera')
          }
        }
      }
    })
  }

  // 是否授权用户选中图片
  const isalbum = (type) => {
    // 获取是否授权选中的图片或视频
    let { elastic } = state
    var isselect = wx.getStorageSync('isselect')
    if (!isselect) {
      elastic = {
        title: '使用你的相册，将会读取你相册中的照片及视频',
        closetext: '拒绝',
        showtext: '允许',
        type: 1
      }
      setState((draft) => {
        ; (draft.elastic = elastic), (draft.isGrant = true)
      })
    } else {
      if (type) {
        chooseVideo('album')
      } else {
        handleImageChange('album')
      }
    }
  }

  // 点击添加
  const openpush = () => {
    let { file_video, file_img, videoenable, upload_choice, upload_img } = state
    if (file_video.url || videoenable != 1) {
      setState((draft) => {
        ; (draft.uploadtype = upload_img), (draft.isOpened = true)
      })
    } else {
      setState((draft) => {
        ; (draft.uploadtype = upload_choice), (draft.isOpened = true)
      })
    }
  }
  const onupload = (type) => {
    let { file_video, file_img, upload_img, upload_video, uploadtype } = state
    console.log('这是类型', type)
    if (type == 'img') {
      uploadtype = upload_img
    } else if (type == 'video') {
      file_video.video_idx = file_img.length - 1
      console.log('这是图片数组长度：', file_img.length)
      setState((draft) => {
        draft.file_video = file_video
      })
      uploadtype = upload_video
    } else {
      if (type == 'album_i') {
        isalbum(0)
      } else if (type == 'camera_i') {
        isallowcamera(0)
      } else if (type == 'album_v') {
        isalbum(1)
      } else if (type == 'camera_v') {
        isallowcamera(1)
      }
      setState((draft) => {
        draft.isOpened = false
      })
    }

    setState((draft) => {
      draft.uploadtype = uploadtype
    })
  }
  // 是否授权
  const ongrant = (isLast) => {
    let { elastic, uploadtype } = state
    if (isLast == 2) {
      if (elastic.type == 1) {
        wx.setStorageSync('isselect', true)
        if (uploadtype[1].type == 'album_v') {
          chooseVideo('album')
        } else {
          handleImageChange('album')
        }
      } else {
        wx.openSetting({
          success(res) {
            console.log(res.authSetting)
          }
        })
      }
    }
    setState((draft) => {
      draft.isGrant = false
    })
  }
  // 关闭上传按钮
  const closesheet = () => {
    let { isOpened } = state
    if (isOpened) {
      setState((draft) => {
        draft.isOpened = false
      })
    }
  }



  return (
    <SpPage className='page-ugc-note' renderFooter={<View className='action-container'>
      <View className='save-draft'>
        <Text className='iconfont icon-caogaoxiang'></Text>
        <Text className='text'>保存草稿</Text>
      </View>
      <View className='release-note'>
        <AtButton circle type='primary'>发布笔记</AtButton>
      </View>
    </View>}>
      <View className='container-body'>
        <View className='note-ad'>
          <SpUpload
            value={imageList}
            max={5}
            onChange={(val) => {
              setState((draft) => {
                draft.imageList = val
              })
            }}
          />
        </View>

        <View className='note-title'>
          <AtInput
            type='text'
            placeholder='填写标题会有更多关注哦～'
            maxLength='20'
            value={file_text?.title}
            onChange={handleChangetext}
          />
        </View>
        <View className='note-body'>
          <AtTextarea
            value={file_text?.attextarea}
            onChange={handleChangeattextarea}
            maxLength={1000}
            height={300}
            placeholder='添加正文......'
          />
        </View>

        <View className='subject-list'>
          <View className='subject'>
            {
              subjectList.map((item, index) => (
                <View>{`#${item}`}</View>
              ))
            }
          </View>
          <AtButton circle className='' onClick={() => {
            Taro.navigateTo({
              url: `/subpages/mdugc/subject-talk`
            })
          }}>#添加话题</AtButton>
        </View>

        <View className="recommend-goods">
          <View className="label">推荐商品</View>
          <View className="goods-list">
            <View className='select-goods'>
              {
                remmendItems.map((item, index) => (
                  <View className='file-item' key={`file-item__${index}`}>
                    <SpImage mode='aspectFit' src={item} width={160} height={160} circle={16} />
                    <Text
                      className='iconfont icon-guanbi'
                      // onClick={handleDeletePic.bind(this, index)}
                    ></Text>
                  </View>
                ))
              }
              {remmendItems.length == 0 && (
                <View className='btn-upload' onClick={() => {
                  Taro.navigateTo({
                    url: `/subpages/mdugc/item-list`
                  })
                }}>
                  <Text className='iconfont icon-tianjia1'></Text>
                  <Text className='btn-upload-txt'>选择商品</Text>
                  <Text className='files-length'>{`(${remmendItems.length}/${max})`}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>


      <View className='makeindexs'>
        {/* <View className='makeindex_upload'>
          <View className='makeindex_upload_img'>
            {file_img?.map((item, idx) => {
              return (
                <Block key={idx}>
                  <View className='makeindex_upload_img_i'>
                    <SpImg
                      img-class='makeindex_upload_img_i_img'
                      src={item.bg_shareImg}
                      mode='widthFix'
                      lazyLoad
                    />
                    <View
                      className='makeindex_upload_delete'
                      onClick={deletefile.bind(this, idx, 'img')}
                    >
                      <Text className='makeindex_upload_delete_i iconfont icon-tianjia1'></Text>
                    </View>
                    <View className='makeindex_upload_edit' onClick={editimg.bind(this, idx)}>
                      编辑
                    </View>
                  </View>
                  {file_video.video_idx == idx && file_video?.url ? (
                    <View className='makeindex_upload_img_i'>
                      <SpImg
                        img-class='makeindex_upload_img_i_img'
                        src={file_video.cover}
                        mode='aspectFill'
                        lazyLoad
                      />
                      <View
                        className='makeindex_upload_delete'
                        onClick={deletefile.bind(this, 0, 'video')}
                      >
                        <Text className='makeindex_upload_delete_i icon-jiahao'></Text>
                      </View>
                    </View>
                  ) : null}
                </Block>
              )
            })}
            {file_img?.length < 9 ? (
              <View onClick={openpush.bind(this)} className='makeindex_upload_occupy '>
                <View className='iconfont icon-xiangji'></View>
                <View>添加图片</View>
                <View>({file_img?.length}/9)</View>
              </View>
            ) : null}
            {occupy?.map(() => (
              <View className='makeindex_upload_img_occupy'></View>
            ))}
          </View>
        </View> */}

        {/* <View className='makeindex_word'>
          <View className='makeindex_word_scroll'>
            <View className='makeindex_word_scroll_left'>
              {file_word?.length > 0 && (
                <TagsBar
                  current={curTagId}
                  list={file_word}
                  onChange={handleTagChange}
                  isedit={true}
                  delete={deleteword}
                />
              )}
            </View>
          </View>
        </View> */}
        {/* <View className='makeindex_commodity'>
          <View className='makeindex_commodity_title'>推荐商品</View>
          <View className='makeindex_commodity_list'>
            {file_commodity?.map((item, idx) => {
              return (
                <View className='makeindex_commodity_list_i' key={idx}>
                  <SpImg
                    img-class='makeindex_commodity_list_i_img'
                    src={item.img}
                    mode='widthFix'
                    lazyLoad
                  />
                  <View
                    className='makeindex_upload_delete'
                    onClick={deletecommodity.bind(this, idx)}
                  >
                    <Text className='makeindex_upload_delete_i iconfont icon-tianjia1'></Text>
                  </View>
                </View>
              )
            })}
            {file_commodity?.length < 9 ? (
              <View onClick={addcommodity} className='makeindex_upload_occupy '>
                <View className='iconfont icon-tianjia1'></View>
                <View>选择商品</View>
                <View>({file_commodity?.length}/9)</View>
              </View>
            ) : null}
            {occupy?.map(() => (
              <View className='makeindex_upload_img_occupy'></View>
            ))}
          </View>
        </View> */}
      </View>

      {/* {isGrant ? (
        <Popups
          title='申请'
          text={elastic?.title}
          closetext={elastic?.closetext}
          showtext={elastic?.showtext}
          Last={ongrant}
        ></Popups>
      ) : null} */}

      <AtActionSheet isOpened={isOpened} cancelText='关闭' title='' onClose={closesheet}>
        {uploadtype?.map((item) => {
          return (
            <AtActionSheetItem onClick={onupload.bind(this, item.type)} key={item.text}>
              {item.text}
            </AtActionSheetItem>
          )
        })}
      </AtActionSheet>
    </SpPage>
  )
}

export default UgcNote
