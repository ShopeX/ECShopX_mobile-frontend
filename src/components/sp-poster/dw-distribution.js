import Taro, { Component } from '@tarojs/taro'
import api from '@/api'
import { getExtConfigData, isAlipay } from '@/utils'
import { drawText, drawImage, drawBlock } from './helper'
import userIcon from '@/assets/imgs/user-icon.png'
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
    debugger
    // 背景图片
    this.bkg = await Taro.getImageInfo({ src: pic })
    // 太阳码
    this.codeImg = await Taro.getImageInfo({ src: wxappCode })
    // 头像
    this.avatar = await Taro.getImageInfo({ src: avatar || userIcon })

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
        w: isAlipay ? 320 : canvasWidth,
        h: isAlipay ? 320 : canvasHeight,
        sx: 0,
        sy: 0,
        sw: isAlipay ? 220 : this.bkg.width,
        sh: isAlipay ? 220 :  this.bkg.height,
        borderRadius: 80
      },
      drawOptions
    )
    // 头像
    drawImage(
      {
        imgPath: this.avatar.path,
        x: isAlipay ? 80 : 220,
        y: isAlipay ? 10 : 60,
        w: isAlipay ? 40 : 80,
        h: isAlipay ? 40 : 80,
        sx: 0,
        sy: 0,
        sw: isAlipay ? 40 : this.avatar.width,
        sh: isAlipay ? 40 : this.avatar.height,
        borderRadius: isAlipay ? 40 : 80
      },
      drawOptions
    )
    // 姓名
    drawText(
      {
        x: isAlipay ? 130 : 310,
        y: isAlipay ? 30 : 110,
        fontSize: isAlipay ? 15 : 30,
        color: '#000',
        text: username
      },
      drawOptions
    )
    // 太阳码
    drawImage(
      {
        imgPath: this.codeImg.path,
        x: isAlipay ? 100 : 120,
        y: isAlipay ? 80 : 620,
        w: isAlipay ? 120 : 480,
        h: isAlipay ? 120 : 480,
        sx: 0,
        sy: 0,
        sw:isAlipay ? 120: this.codeImg.width,
        sh:isAlipay ? 110: this.codeImg.height
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
