/*
 * @Author: PrendsMoi
 * @GitHub: https://github.com/PrendsMoi
 * @Blog: https://liuhgxu.com
 * @Description: 编辑分享
 * @FilePath: /unite-vshop/src/subpage/pages/editShare/index.js
 * @Date: 2021-04-14 15:06:18
 * @LastEditors: PrendsMoi
 * @LastEditTime: 2021-04-23 13:55:44
 */
import React, { Component } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { Textarea, View, Image, Canvas, Button } from '@tarojs/components'
import { AtModal, AtModalContent, AtModalAction } from 'taro-ui'
import api from '@/api'
import req from '@/api/req'
import { connect } from 'react-redux'

import './index.scss'

// canvas宽高
const canvsW_H = 200
// 小程序码宽高
const wxCodeW_H = 70

const steps = [
  {
    title: '打开微信'
  },
  {
    title: '粘贴文案/上传图片'
  },
  {
    title: '发送朋友圈'
  }
]

@connect(({ colors }) => ({
  colors: colors.current
}))
export default class EditShare extends Component {
  $instance = getCurrentInstance();
  constructor(...props) {
    super(...props)

    this.state = {
      insertData: [],
      info: '',
      selectPics: [],
      wxappCode: '',
      showPoster: [],
      showSuccess: false
    }

    this.copyPoster = []
    this.goodInfo = {}
  }

  componentDidMount() {
    this.getShareSettingInfo()
  }

  // 获取分享信息
  async getShareSettingInfo() {
    Taro.showLoading()
    const { id, dtid, company_id } = this.$instance.router.params
    const data = await api.item.getShareSetting(id)
    const insertData = [
      {
        name: '商品名称',
        value: data.item_name
      },
      {
        name: '商品简介',
        value: data.brief
      },
      {
        name: '销售价',
        value: (data.price / 100).toFixed(2)
      }
    ]

    const { userId } = Taro.getStorageSync('userinfo')
    const host = req.baseURL.replace('/api/h5app/wxapp/', '')
    const extConfig =
      Taro.getEnv() === 'WEAPP' && Taro.getExtConfigSync ? Taro.getExtConfigSync() : {}

    const wxappCode = `${host}/wechatAuth/wxapp/qrcode.png?page=${`pages/item/espier-detail`}&appid=${
      extConfig.appid
    }&company_id=${company_id}&id=${id}&dtid=${dtid}&uid=${userId}`

    this.goodInfo = data
    this.setState(
      {
        wxappCode,
        insertData,
        selectPics: data.pics
      },
      () => {
        this.generateCanvas()
      }
    )
  }

  // 输入分享信息
  inputInfo = (res = {}) => {
    const { detail = {} } = res
    const val = detail.value
    this.setState({
      info: val
    })
  }

  // 插入信息
  insertInfo = (item) => {
    let { info } = this.state
    const { name, value } = item
    const newInsertData = `${name}: ${value}\n`
    if (info.indexOf(newInsertData) === -1) {
      info += newInsertData
      this.setState({
        info: info
      })
    }
  }

  // 生成图片canvas
  generateCanvas = async () => {
    const { selectPics, wxappCode } = this.state
    const showPoster = []
    const codeImg = await Taro.getImageInfo({ src: wxappCode.replace('http://', 'https://') })
    if (selectPics.length < 1) return false
    // 处理draw
    const draw = (ctx) => {
      return new Promise((resolve) => {
        ctx.draw(true, () => {
          resolve()
        })
      })
    }
    for (let i = 0; i < selectPics.length; i++) {
      const { url, isCode } = selectPics[i]
      const canvas = Taro.createCanvasContext(`canvas${i}`)
      const { path } = await Taro.getImageInfo({ src: url.replace('http://', 'https://') })
      canvas.drawImage(path, 0, 0, canvsW_H, canvsW_H)
      canvas.restore()
      canvas.save()
      if (isCode) {
        canvas.drawImage(
          codeImg.path,
          canvsW_H - wxCodeW_H - 5,
          canvsW_H - wxCodeW_H - 5,
          wxCodeW_H,
          wxCodeW_H
        )
        canvas.restore()
        canvas.save()
      }
      await draw(canvas)
      const imgData = await Taro.canvasToTempFilePath({
        x: 0,
        y: 0,
        canvasId: `canvas${i}`
      })
      showPoster.push(imgData.tempFilePath)
    }
    // 备份海报图片资源信息
    this.copyPoster = [...showPoster]
    this.setState(
      {
        showPoster
      },
      () => Taro.hideLoading()
    )
  }

  // 移除item
  removeItem = (index) => {
    const { showPoster } = this.state
    showPoster.splice(index, 1)
    this.setState({
      showPoster
    })
  }

  // 重置分享海报
  resetShare = () => {
    this.setState({
      showPoster: [...this.copyPoster]
    })
  }

  // 保存分享
  saveShare = () => {
    const saveToPhone = async () => {
      const { showPoster, info } = this.state
      const length = showPoster.length
      // 复制到剪切板
      for (let i = 0; i < length; i++) {
        await Taro.saveImageToPhotosAlbum({ filePath: showPoster[i] })
        Taro.showLoading({
          title: `保存进度：${i + 1}/${length}`
        })
      }
      Taro.hideLoading()
      await Taro.setClipboardData({
        data: info
      })
      this.setState({
        showSuccess: true
      })
    }
    Taro.getSetting().then((res) => {
      if (!res.authSetting['scope.writePhotosAlbum']) {
        Taro.authorize({
          scope: 'scope.writePhotosAlbum',
          success: async () => {
            saveToPhone()
          },
          fail: () => {
            Taro.showModal({
              title: '提示',
              content: '请打开保存到相册权限',
              success: async (resConfirm) => {
                if (resConfirm.confirm) {
                  await Taro.openSetting()
                  const setting = await Taro.getSetting()
                  if (setting.authSetting['scope.writePhotosAlbum']) {
                    saveToPhone()
                  } else {
                    Taro.showToast({ title: '保存失败', icon: 'none' })
                  }
                }
              }
            })
          }
        })
      } else {
        saveToPhone()
      }
    })
  }

  closeModal = () => {
    Taro.navigateBack()
  }

  render() {
    const { insertData, info, selectPics, showPoster, showSuccess } = this.state
    const { colors } = this.props

    return (
      <View className='editShare'>
        <View className='content'>
          <Textarea
            value={info}
            className='textarea'
            maxlength='-1'
            placeholder='我想要分享'
            onInput={this.inputInfo.bind(this)}
          ></Textarea>
          <View className='textData'>
            <View className='title'>插入数据</View>
            <View className='insertData'>
              {insertData.map((item, index) => (
                <View
                  className={`item ${info.indexOf(`${item.name}: ${item.value}\n`) !== -1 &&
                    'disabled'}`}
                  key={`goodInfo${index}`}
                  onClick={this.insertInfo.bind(this, item)}
                >
                  {item.name}
                </View>
              ))}
            </View>
          </View>
        </View>
        <View className='images'>
          {showPoster.map((item, index) => (
            <View className='item' key={`poster${index}`}>
              <View
                className='iconfont icon-close'
                onClick={this.removeItem.bind(this, index)}
              ></View>
              <Image src={item} className='img' mode='widthFix' />
            </View>
          ))}
        </View>
        <View className='btns'>
          <View
            className='btn'
            style={`background: ${colors.data[0].accent}`}
            onClick={this.resetShare.bind(this)}
          >
            重置
          </View>
          <View
            className='btn'
            style={`background: ${colors.data[0].primary}`}
            onClick={this.saveShare.bind(this)}
          >
            保存
          </View>
        </View>
        {selectPics.map((item, index) => (
          <Canvas
            className='canvas'
            key={`canvas${index}`}
            canvas-id={`canvas${index}`}
            style={`width: ${canvsW_H}px; height: ${canvsW_H}px`}
          />
        ))}

        <AtModal isOpened={showSuccess} closeOnClickOverlay={false} className='successModal'>
          <AtModalContent>
            <View className='tip'>
              <View className='iconfont icon-check'></View>
              文字内容已经复制到剪切板
            </View>
            <View className='tip'>
              <View className='iconfont icon-check'></View>
              图片已保存到相册
            </View>
            <View className='sharetip'>
              <View className='line'></View>
              <View className='text'>去朋友圈分享</View>
              <View className='line'></View>
            </View>
            <View className='steps'>
              {steps.map((item, index) => (
                <View className='item' key={`step${index}`}>
                  <View className='title'>{item.title}</View>
                  <View className={`stepIcon ${index === 1 && 'second'}`}>
                    <View className='num'>{index + 1}</View>
                  </View>
                </View>
              ))}
            </View>
          </AtModalContent>
          <AtModalAction>
            <Button className='btn' onClick={this.closeModal.bind(this)}>
              我知道了
            </Button>
          </AtModalAction>
        </AtModal>
      </View>
    )
  }
}
