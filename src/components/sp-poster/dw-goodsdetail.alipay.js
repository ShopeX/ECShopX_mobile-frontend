import Taro, { Component } from '@tarojs/taro'
import api from '@/api'
import { getExtConfigData, isAlipay, } from '@/utils'
import { drawText, drawImage, drawBlock } from './helper'


//计算canvas画布尺寸
let canvasWidth = 600
let canvasHeight = 960


class GoodsDetailPoster {
  constructor(props) {
    const { ctx, info, userInfo, toPx, toRpx, canvas } = props

    this.ctx = ctx
    this.info = info
    this.userInfo = userInfo
    this.toPx = toPx
    this.toRpx = toRpx
    // ctx.scale(dpr, dpr)
    // // alipay2.0 兼容
    // this.canvas = canvas
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
    const { itemId, imgs, price } = this.info
    const { user_id, avatar } = this.userInfo
    let wxappCode
    // TODO 获取微信二维码的接口，需要换alipay  https://ecshopx1.shopex123.com/api/h5app/alipaymini/qrcode.png?company_id=1&page=page/index
    // const res = await api.alipay.alipay_qrcode(`page=${`pages/item/espier-detail`}&appid=${appid}&company_id=${company_id}&id=${itemId}&uid=${user_id}`)
    const res = await Taro.request({
      url: `${host}/api/h5app/alipaymini/qrcode.png?page=${`pages/item/espier-detail`}&appid=${appid}&company_id=${company_id}&id=${itemId}&uid=${user_id}`, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
    })
    wxappCode = res.data.data.qr_code_url

    const pic = imgs[0].replace('http:', 'https:')
    // 商品图片
    this.goodsImg = await Taro.getImageInfo({ src: pic })
    // 太阳码
    this.codeImg = await Taro.getImageInfo({ src: wxappCode })
    // 头像
    const _avatar = avatar || `${process.env.APP_IMAGE_CDN}/user_icon.png`
    this.avatar = await Taro.getImageInfo({ src: _avatar })

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
    console.log('海报商品图:', this.goodsImg)
    console.log('太阳码:', this.codeImg)
    console.log('头像:', this.avatar, avatar)
    // 海报商品图
    drawImage(
      {
        imgPath: this.goodsImg.path,
        x: 0,
        y: 0,
        w: canvasWidth,
        h: canvasWidth,
        sx: 0,
        sy: 0,
        sw: this.goodsImg.width,
        sh: this.goodsImg.height
      },
      drawOptions
    )
    // 头像背景
    drawBlock(
      {
        x: 24,
        y: 624,
        width: 312,
        height: 40 * 2,
        backgroundColor: '#efefef',
        borderRadius: 80
      },
      drawOptions
    )
    // 头像
    drawImage(
      {
        imgPath: this.avatar.path,
        x: 24,
        y: 624,
        w: 80,
        h: 80,
        sx: 0,
        sy: 0,
        sw: this.avatar.width,
        sh: this.avatar.height,
        borderRadius: 80
      },
      drawOptions,
    )
    // 姓名
    drawText(
      {
        x: 112,
        y: 656,
        fontSize: 24,
        color: '#000',
        text: username
      },
      drawOptions
    )
    //
    drawText(
      {
        x: 112,
        y: 688,
        fontSize: 22,
        color: '#999',
        text: '推荐一个好物给你'
      },
      drawOptions
    )
    // 商品金额
    const initPrice = price.toFixed(2).split('.')[0]
    const floatPrice = `.${price.toFixed(2).split('.')[1]}`
    drawText(
      {
        x: 24,
        y: 815,
        color: '#222',
        text: [
          {
            text: '¥',
            fontSize: 28,
            color: '#222'
          },
          {
            text: initPrice,
            fontSize: 46,
            color: '#222'
          },
          {
            text: floatPrice,
            fontSize: 32,
            color: '#222'
          }
        ]
      },
      drawOptions
    )
    // 商品名称
    drawText(
      {
        x: 24,
        y: 887,
        fontSize: 24,
        width: 312,
        color: '#666',
        text: this.info.itemName,
        lineNum: 2
      },
      drawOptions
    )
    // 太阳码
    drawImage(
      {
        imgPath: this.codeImg.path,
        x: 416,
        y: 742,
        w: 160,
        h: 195,
        sx: 0,
        sy: 0,
        sw: this.codeImg.width,
        sh: this.codeImg.height
      },
      drawOptions,
    )
  }
}

export default GoodsDetailPoster
