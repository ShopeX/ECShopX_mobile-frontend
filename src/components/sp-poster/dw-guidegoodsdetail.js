import Taro, { Component } from '@tarojs/taro'
import api from '@/api'
import { getExtConfigData } from '@/utils'
import { drawText, drawImage, drawBlock } from './helper'

const canvasWidth = 600
const canvasHeight = 960

class GuideGoodsDetailPoster {
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
    const { appid } = getExtConfigData()
    const { itemId, imgs, price, subtaskId } = this.info
    const { salesperson_id, avatar, company_id, work_userid, shop_code } = this.userInfo
    const gu = `${work_userid}_${shop_code}`
    const wxappCode = `${host}/wechatAuth/wxapp/qrcode.png?page=${`pages/item/espier-detail`}&appid=${appid}&company_id=${company_id}&id=${itemId}&smid=${salesperson_id}&subtask_id=${subtaskId}&gu=${gu}`
    console.log('wxappCode:', wxappCode)

    const pic = imgs[0].replace('http:', 'https:')
    console.log('goods pic:', pic)
    // 商品图片
    this.goodsImg = await Taro.getImageInfo({ src: pic })
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
    const { salesperson_name } = this.userInfo
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
        height: 80,
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
      drawOptions
    )
    // 姓名
    drawText(
      {
        x: 112,
        y: 656,
        fontSize: 24,
        color: '#000',
        text: salesperson_name
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
        h: 160,
        sx: 0,
        sy: 0,
        sw: this.codeImg.width,
        sh: this.codeImg.height
      },
      drawOptions
    )
    drawText(
      {
        x: 433,
        y: 928,
        fontSize: 18,
        // width: this.canvasImgWidth - 60 - this.miniCodeHeight,
        color: '#999',
        text: '长按或扫描查看'
      },
      drawOptions
    )
  }
}

export default GuideGoodsDetailPoster
