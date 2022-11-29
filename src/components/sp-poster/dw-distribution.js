import Taro, { Component } from '@tarojs/taro'
import api from '@/api'
import { getExtConfigData, isAlipay } from '@/utils'
import { drawText, drawImage, drawBlock } from './helper'
// const canvasWidth = 750
// const canvasHeight = 1335


const UI_Width = 750
//同步获取设备系统信息
const info = Taro.getSystemInfoSync()
//设备像素密度
const dpr = info.pixelRatio;
//计算比例
const scale = info.screenWidth / UI_Width
console.log('scale', scale)
//计算canvas实际渲染尺寸
let width = parseInt(scale * 335)
let height = parseInt(scale * 596)
//计算canvas画布尺寸
let canvasWidth = width * dpr
let canvasHeight = height * dpr

let alipayScaleW = 1.5
let alipayScaleH = 1.2

class DistributionPoster {
  constructor(props) {
    const { ctx, info, userInfo, toPx, toRpx } = props
    this.ctx = ctx
    ctx.scale(dpr, dpr)
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
    const host = process.env.APP_BASE_URL.replace('/api/h5app/wxapp', '')
    const { appid, company_id } = getExtConfigData()
    const { isOpenShop, shop_status, qrcode_bg_img } = this.info
    const { user_id, avatar } = this.userInfo
    // const wxappCode = `${host}/wechatAuth/wxapp/qrcode.png?page=${`pages/item/espier-detail`}&appid=${appid}&company_id=${company_id}&id=${itemId}&uid=${user_id}`
    const url = (isOpenShop && shop_status == 1) ? `marketing/pages/distribution/shop-home` : `pages/index`
    let wxappCode
    // TODO 获取微信二维码的接口，需要换alipay  https://ecshopx1.shopex123.com/api/h5app/alipaymini/qrcode.png?company_id=1&page=page/index
    if(isAlipay){
      // const res = await api.alipay.alipay_qrcode(`page=${`pages/item/espier-detail`}&appid=${appid}&company_id=${company_id}&id=${itemId}&uid=${user_id}`)
      const res = await Taro.request({
        url: `${host}/api/h5app/alipaymini/qrcode.png?path=${url}&appid=${appid}&company_id=${company_id}&user_id=${user_id}`, //仅为示例，并非真实的接口地址
        header: {
          'content-type': 'application/json' // 默认值
        },
      })
      wxappCode = res.data.data.qr_code_url
    }else{
      wxappCode = `${process.env.APP_BASE_URL}/promoter/qrcode.png?path=${url}&appid=${appid}&company_id=${company_id}&user_id=${user_id}`
    }

    console.log('DistributionPoster-wxappCode:', wxappCode)

    const pic = qrcode_bg_img || `${process.env.APP_IMAGE_CDN}/fenxiao_bk.png`
    console.log('goods pic1:', pic)
    // 背景图片
    this.bkg = await Taro.getImageInfo({ src: pic })
    // 太阳码
    this.codeImg = await Taro.getImageInfo({ src: wxappCode })
    // 头像
    this.avatar = await Taro.getImageInfo({ src: avatar || `${process.env.APP_IMAGE_CDN}/user_icon.png` })

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
        w: isAlipay ? canvasWidth / alipayScaleW : canvasWidth,
        h: isAlipay ? canvasHeight / alipayScaleH : canvasHeight,
        sx: 0,
        sy: 0,
        sw: isAlipay ? this.bkg.width : this.bkg.width,
        sh: isAlipay ? this.bkg.height :  this.bkg.height,
        // borderRadius: 80
      },
      drawOptions
    )
    // 头像
    drawImage(
      {
        imgPath: this.avatar.path,
        x: isAlipay ? 40  : 220,
        y: isAlipay ? 20 : 60,
        w: isAlipay ? 30 : 80,
        h: isAlipay ? 30 : 80,
        sx: 0,
        sy: 0,
        sw: isAlipay ? 30 : this.avatar.width,
        sh: isAlipay ? 30 : this.avatar.height,
        borderRadius: isAlipay ? 30 : 80
      },
      drawOptions
    )
    // 姓名
    drawText(
      {
        x: isAlipay ? 76 : 310,
        y: isAlipay ? 34 : 110,
        fontSize: isAlipay ? 10 : 30,
        color: '#000',
        text: username
      },
      drawOptions
    )
    // 太阳码
    drawImage(
      {
        imgPath: this.codeImg.path,
        x: isAlipay ? 30 : 120,
        y: isAlipay ? 90 : 620,
        w: isAlipay ? 220 : 480,
        h: isAlipay ? 240 : 480,
        sx: 0,
        sy: 0,
        sw:this.codeImg.width,
        sh:this.codeImg.width
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
