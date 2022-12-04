import Taro, { Component } from '@tarojs/taro'
import api from '@/api'
import { getExtConfigData } from '@/utils'
import { drawText, drawImage, drawBlock } from './helper'

const canvasWidth = 750
const canvasHeight = 1335

class DistributionPoster {
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
    // const host = process.env.APP_BASE_URL.replace('/api/h5app/wxapp', '')
    const { appid, company_id } = getExtConfigData()
    const { isOpenShop, shop_status, qrcode_bg_img } = this.info
    const { user_id, avatar } = this.userInfo
    // const { dtid } =

    // const wxappCode = `${host}/wechatAuth/wxapp/qrcode.png?page=${`pages/item/espier-detail`}&appid=${appid}&company_id=${company_id}&id=${itemId}&uid=${user_id}`
    const url = (isOpenShop && shop_status == 1) ? `marketing/pages/distribution/shop-home` : `pages/index`
    const wxappCode = `${process.env.APP_BASE_URL}/promoter/qrcode.png?path=${url}&appid=${appid}&company_id=${company_id}&user_id=${user_id}`
    console.log('wxappCode:', wxappCode)

    const pic = qrcode_bg_img || `${process.env.APP_IMAGE_CDN}/fenxiao_bk.png`
    console.log('goods pic:', pic)
    // 背景图片
    this.bkg = await Taro.getImageInfo({ src: pic })
    // 太阳码
    this.codeImg = await Taro.getImageInfo({ src: wxappCode })
    // 头像
    this.avatar = await Taro.getImageInfo({ src: avatar })

    const drawOptions = {
      ctx: this.ctx,
      toPx: this.toPx,
      toRpx: this.toRpx
    }
    this.drawOptions = drawOptions
    const { username } = this.userInfo
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
        sh: this.bkg.height,
        borderRadius: 80
      },
      drawOptions
    )
    // 头像
    drawImage(
      {
        imgPath: this.avatar.path,
        x: 220,
        y: 60,
        w: 80,
        h: 80,
        sx: 0,
        sy: 0,
        sw: this.avatar.width,
        sh: this.avatar.height,
        borderRadius: 80
      },
      drawOptions
    )
    // 姓名
    drawText(
      {
        x: 310,
        y: 110,
        fontSize: 30,
        color: '#000',
        text: username
      },
      drawOptions
    )
    // 太阳码
    drawImage(
      {
        imgPath: this.codeImg.path,
        x: 120,
        y: 620,
        w: 480,
        h: 480,
        sx: 0,
        sy: 0,
        sw: this.codeImg.width,
        sh: this.codeImg.height
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

export default DistributionPoster
