import Taro, { Component } from '@tarojs/taro'
import api from '@/api'
import { getExtConfigData } from '@/utils'
import { drawText, drawImage, drawBlock } from './helper'

const canvasWidth = 650
const canvasHeight = 960

class PrescriptionCode {
  constructor(props) {
    const { ctx, info, userInfo, toPx, toRpx } = props
    this.ctx = ctx
    this.info = info
    this.userInfo = userInfo
    this.toPx = toPx
    this.toRpx = toRpx
  }

  getCanvasSize() {
    return {
      canvasWidth: canvasWidth,
      canvasHeight: canvasHeight
    }
  }

  async drawPoster() {
    const { appid, company_id } = getExtConfigData()
    const path = `pages/share-land`
    const wxappCode = `${process.env.APP_BASE_URL}/promoter/qrcode.png?path=${path}&appid=${appid}&company_id=${company_id}&prescription_order_id=${this.info}`

    const pic = `${process.env.APP_IMAGE_CDN}/bg_fxhb.png`
    console.log('goods pic:', pic)
    // 背景图片
    this.bkg = await Taro.getImageInfo({ src: pic })
    // 太阳码
    this.codeImg = await Taro.getImageInfo({ src: wxappCode })
    // 头像
    // const _avatar = avatar || `${process.env.APP_IMAGE_CDN}/user_icon.png`
    // this.avatar = await Taro.getImageInfo({ src: _avatar })

    console.log('this.codeImg:', this.codeImg)
    const drawOptions = {
      ctx: this.ctx,
      toPx: this.toPx,
      toRpx: this.toRpx
    }
    this.drawOptions = drawOptions
    // const { name } = '扫码填写处方信息'
    // this.ctx.font = '30px'
    // this.ctx.textBaseline = 'middle'
    // const textWidth = this.ctx.measureText(name).width * 3
    drawBlock(
      {
        x: 0,
        y: 0,
        width: canvasWidth,
        height: canvasHeight,
        backgroundColor: '#fff'
      },
      drawOptions
    )
    // 背景
    drawImage(
      {
        imgPath: this.bkg.path,
        x: 0,
        y: 0,
        w: canvasWidth,
        h: canvasHeight,
        sx: 0,
        sy: 0,
        sw: this.bkg.width,
        sh: this.bkg.height
      },
      drawOptions
    )
    // 头像
    // drawImage(
    //   {
    //     imgPath: this.avatar.path,
    //     x: 145,
    //     y: 50,
    //     w: 80,
    //     h: 80,
    //     sx: 0,
    //     sy: 0,
    //     sw: this.avatar.width,
    //     sh: this.avatar.height,
    //     borderRadius: 80
    //   },
    //   drawOptions
    // )
    // 店铺名称
    drawText(
      {
        x:180,
        y: 150,
        fontSize: 36,
        w: canvasWidth,
        color: '#111A34',
        text: '扫码填写处方信息'
      },
      drawOptions
    )
    // 太阳码
    drawImage(
      {
        imgPath: this.codeImg.path,
        x: 100,
        y: 260,
        w: 450,
        h: 450,
        sx: 0,
        sy: 0,
        sw: this.codeImg.width,
        sh: this.codeImg.height,
        borderRadius: 24
      },
      drawOptions
    )
    // drawText(
    //   {
    //     x: 433,
    //     y: 928,
    //     fontSize: 18,
    //     // width: this.canvasImgWidth - 60 - this.miniCodeHeight,
    //     color: '#999',
    //     text: '长按或扫描查看'
    //   },
    //   drawOptions
    // )
  }
}

export default PrescriptionCode
