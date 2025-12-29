/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro, { Component } from '@tarojs/taro'
import api from '@/api'
import { getExtConfigData } from '@/utils'
import { drawText, drawImage, drawBlock } from './helper'

const canvasWidth = 620
const canvasHeight = 900

class GoodsDetailPoster {
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
    const { sharePic, enterprise_id, activity_id } = this.info

    const data = await api.purchase.getEmployeeInviteCode({ enterprise_id, activity_id })
    debugger
    const wxappCode = `${host}/wechatAuth/wxapp/qrcode.png?page=pages/share-land&appid=${appid}&company_id=${company_id}&code=${data.invite_code}&eid=${enterprise_id}&aid=${activity_id}&from_scene=poster_purchase_auth`
    console.log('wxappCode:', wxappCode)

    const pic = sharePic
    console.log('goods pic:', pic)
    // 商品图片
    this.goodsImg = await Taro.getImageInfo({ src: pic })
    // 太阳码
    this.codeImg = await Taro.getImageInfo({ src: wxappCode })
    const drawOptions = {
      ctx: this.ctx,
      toPx: this.toPx,
      toRpx: this.toRpx
    }
    this.drawOptions = drawOptions
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
        h: canvasHeight,
        sx: 0,
        sy: 0,
        sw: this.goodsImg.width,
        sh: this.goodsImg.height
      },
      drawOptions
    )
    // 太阳码
    drawImage(
      {
        imgPath: this.codeImg.path,
        x: 450,
        y: 732,
        w: 120,
        h: 120,
        sx: 0,
        sy: 0,
        sw: this.codeImg.width,
        sh: this.codeImg.height
      },
      drawOptions
    )
  }
}

export default GoodsDetailPoster
