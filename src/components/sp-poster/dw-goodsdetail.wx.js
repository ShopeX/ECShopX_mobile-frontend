import Taro, { Component } from '@tarojs/taro'
import api from '@/api'
import { getExtConfigData,isAlipay, } from '@/utils'
import { drawText, drawImage, drawBlock } from './helper'


const UI_Width = 750
//同步获取设备系统信息
const info = Taro.getSystemInfoSync()
//设备像素密度
const dpr = info.pixelRatio;
//计算比例
const scale = info.screenWidth / UI_Width
//计算canvas实际渲染尺寸
let width = parseInt(scale * 335)
let height = parseInt(scale * 536)
//计算canvas画布尺寸
let canvasWidth = width * dpr
let canvasHeight = height * dpr


console.log('systemInfo', info)
console.log('dpr', dpr)

class GoodsDetailPoster {
  constructor(props) {
    const { ctx, info, userInfo, toPx, toRpx, canvas } = props

    this.ctx = ctx
    this.info = info
    this.userInfo = userInfo
    this.toPx = toPx
    this.toRpx = toRpx
    ctx.scale(dpr, dpr)
    // alipay2.0 兼容
    this.canvas = canvas
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
    if(isAlipay){
      // const res = await api.alipay.alipay_qrcode(`page=${`pages/item/espier-detail`}&appid=${appid}&company_id=${company_id}&id=${itemId}&uid=${user_id}`)      
      const res = await Taro.request({
        url: `${host}/api/h5app/alipaymini/qrcode.png?page=${`pages/item/espier-detail`}&appid=${appid}&company_id=${company_id}&id=${itemId}&uid=${user_id}`, //仅为示例，并非真实的接口地址
        header: {
          'content-type': 'application/json' // 默认值
        },        
      })
      wxappCode = res.data.data.qr_code_url
    }else{
      wxappCode = `${host}/wechatAuth/wxapp/qrcode.png?page=${`pages/item/espier-detail`}&appid=${appid}&company_id=${company_id}&id=${itemId}&uid=${user_id}`    
    }
    const pic = imgs[0].replace('http:', 'https:')
    wxappCode = imgs[0].replace('http:', 'https:')
    // 商品图片
    this.goodsImg = await Taro.getImageInfo({ src: pic })
    // 太阳码
    this.codeImg = await Taro.getImageInfo({ src: wxappCode })
    // 头像
    if(avatar) this.avatar = await Taro.getImageInfo({ src: avatar })

    // console.log('GoodsDetailPoster-wxappCode:', wxappCode)
    // console.log('GoodsDetailPoster-this.goodsImg:', this.goodsImg)
    // console.log('GoodsDetailPoster-this.codeImg:', this.codeImg)
    // console.log('GoodsDetailPoster-this.avatar:', this.avatar)
    const drawOptions = {
      ctx: this.ctx,
      toPx: this.toPx,
      toRpx: this.toRpx
    }
    // console.log('GoodsDetailPoster-this.userInfo:', this.userInfo)
    // console.log('GoodsDetailPoster-drawOptions:', drawOptions)
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

    const drawImageOpt = isAlipay ? {
      imgPath: this.goodsImg.path,
      x: 0,
      y: 0,
      w: canvasWidth - 160,
      h: canvasWidth - 90,
      sx: 0,
      sy: 0,
      sw: this.goodsImg.width ,
      sh: this.goodsImg.height,
      desc:'海报商品图'
    }:{
      imgPath: this.goodsImg.path,
      x: 0,
      y: 0,
      w: canvasWidth,
      h: canvasWidth,
      sx: 0,
      sy: 0,
      sw: this.goodsImg.width,
      sh: this.goodsImg.height
    }

    // 海报商品图
    drawImage(
      drawImageOpt,
      drawOptions,
      this.canvas
    )
    // 头像背景
    drawBlock(
      {
        x: isAlipay ? 10 : 24,
        y: isAlipay ? 170 : 624,
        width: isAlipay ? 90 : 312,
        height: isAlipay ? 12 :80,
        backgroundColor: '#efefef',
        borderRadius: isAlipay ? 30 :80
      },
      drawOptions
    )
    // 头像
    avatar && drawImage(
      {
        imgPath: this.avatar.path,
        x: isAlipay ? 10 : 24,
        y: isAlipay ? 172 : 624,
        w: isAlipay ? 26 : 80,
        h: isAlipay ? 26 : 80,
        sx: 0,
        sy: 0,
        sw: isAlipay ? 26 : this.avatar.width,
        sh: isAlipay ? 26 : this.avatar.height,
        borderRadius: isAlipay ? 26 : 80
      },
      drawOptions,
      this.canvas
    )
    // 姓名
    drawText(
      {
        x:isAlipay ? 40 :  112,
        y:isAlipay ? 180 :  656,
        fontSize:isAlipay ? 6 : 24,
        color: '#000',
        text: username
      },
      drawOptions
    )
    //
    drawText(
      {
        x: isAlipay ? 40 : 112,
        y: isAlipay ? 190 : 688,
        fontSize: isAlipay ? 6 :22,
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
        x: isAlipay ? 10 : 24,
        y: isAlipay ? 226 :815,
        color: '#222',
        text: [
          {
            text: '¥',
            fontSize: isAlipay ? 12 :  28,
            color: '#222'
          },
          {
            text: initPrice,
            fontSize:isAlipay ? 18 : 46,
            color: '#222'
          },
          {
            text: floatPrice,
            fontSize:isAlipay ? 12 : 32,
            color: '#222'
          }
        ]
      },
      drawOptions
    )
    // 商品名称
    drawText(
      {
        x: isAlipay ? 10 : 24,
        y: isAlipay ? 246 : 887,
        fontSize:isAlipay ? 6 : 24,
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
        x: isAlipay ? 114 : 416,
        y: isAlipay ? 210 : 742,
        // x: 0,
        // y: 0,
        w: isAlipay ? 90 : 180,
        h: isAlipay ? 100 : 180,
        sx: 0,
        sy: 0,
        sw: this.codeImg.width,
        sh: this.codeImg.height,
        desc:'太阳码'
      },
      drawOptions,
      this.canvas
    )
    !isAlipay && drawText(
      {
        x: isAlipay ? 220 : 433,
        y: isAlipay ? 214 : 928,
        // x: 433,
        // y: 828,
        fontSize: isAlipay ? 8 : 18,
        // width: this.canvasImgWidth - 60 - this.miniCodeHeight,
        color: '#999',
        text: '长按或扫描查看'
      },
      drawOptions
    )
  }
}

export default GoodsDetailPoster
