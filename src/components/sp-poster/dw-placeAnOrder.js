// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import Taro, { Component } from '@tarojs/taro'
import api from '@/api'
import { getExtConfigData } from '@/utils'
import { drawText, drawImage, drawBlock } from './helper'

const canvasWidth = 650
const canvasHeight = 960

class StoreCode {
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
    const { orderId, detailInfo, totalInfo } = this.info
    const { appid, company_id } = getExtConfigData()
    const path = `subpages/trade/detail`
    // const path = `subpages/member/index`
    const wxappCode = `${process.env.APP_BASE_URL}/promoter/qrcode.png?page=${path}&appid=${appid}&company_id=${company_id}&order_id=${orderId}`

    const pic = `${process.env.APP_IMAGE_CDN}/bg_fxhb.png`
    // 背景图片
    this.bkg = await Taro.getImageInfo({ src: pic })
    // 太阳码
    this.codeImg = await Taro.getImageInfo({ src: wxappCode })
    // 头像

    let newNetailInfo = JSON.parse(JSON.stringify(detailInfo))
    //处理数据
    newNetailInfo.unshift({
      itemName: '商品',
      num: '数量',
      price: '单价'
    })

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

    // 商品列表
    // let yOffset = 80 // 初始y坐标
    // newNetailInfo.map((item, index) => {
    //   const text1 = drawText(
    //     {
    //       x: yOffset,
    //       y: yOffset + (index + 1) * 50,
    //       fontSize: 30,
    //       width: canvasWidth,
    //       height: canvasHeight,
    //       color: '#111A34',
    //       text: item.itemName,
    //       backgroundColor: '#858b9c',
    //       borderbottom:'1px solid red'
    //     },
    //     drawOptions
    //   )

    //   const text2 = drawText(
    //     {
    //       x: yOffset + 300,
    //       y: yOffset + (index + 1) * 50, // 调整y坐标，增加间距
    //       fontSize: 30,
    //       w: canvasWidth,
    //       color: '#111A34',
    //       text: item.price+'/元',
    //       backgroundColor: '#858b9c'
    //     },
    //     drawOptions
    //   )

    //   const text3 = drawText(
    //     {
    //       x: yOffset + 450,
    //       y: yOffset + (index + 1) * 50, // 调整y坐标，增加间距
    //       fontSize: 30,
    //       w: canvasWidth,
    //       color: '#111A34',
    //       text: item.num,
    //       backgroundColor: '#858b9c'
    //     },
    //     drawOptions
    //   )

    //   return [text1, text2, text3]
    // })

    // 支付信息
    // drawText(
    //   {
    //     x: yOffset,
    //     y: yOffset + (newNetailInfo.length + 1) * 50, // 调整y坐标，增加间距
    //     fontSize: 30,
    //     w: canvasWidth,
    //     color: '#111A34',
    //     text: '商品金额：' + totalInfo.market_fee/100,
    //     backgroundColor: '#858b9c',
    //     zIndex: 99
    //   },
    //   drawOptions
    // )

    // drawText(
    //   {
    //     x: yOffset + 300,
    //     y: yOffset + (newNetailInfo.length + 1) * 50, // 调整y坐标，增加间距
    //     fontSize: 30,
    //     w: canvasWidth,
    //     color: '#111A34',
    //     text: '优惠：' + (totalInfo.market_fee-totalInfo.item_fee_new)/100,
    //     backgroundColor: '#858b9c'
    //   },
    //   drawOptions
    // )

    // drawText(
    //   {
    //     x: yOffset,
    //     y: yOffset + (newNetailInfo.length + 2) * 50, // 调整y坐标，增加间距
    //     fontSize: 30,
    //     w: canvasWidth,
    //     color: '#111A34',
    //     text: '运费：' + totalInfo.freight_fee/100,
    //     backgroundColor: '#858b9c'
    //   },
    //   drawOptions
    // )

    // drawText(
    //   {
    //     x: yOffset + 300,
    //     y: yOffset + (newNetailInfo.length + 2) * 50, // 调整y坐标，增加间距
    //     fontSize: 30,
    //     w: canvasWidth,
    //     color: '#111A34',
    //     text: '实付：' + totalInfo.total_fee/100,
    //     backgroundColor: '#858b9c'
    //   },
    //   drawOptions
    // )

    // 支付信息
    drawText(
      {
        x: 100,
        y: 100, // 调整y坐标，增加间距
        fontSize: 30,
        w: canvasWidth,
        color: '#666',
        text: '原价：¥ ' + totalInfo.market_fee / 100
      },
      drawOptions
    )
    drawText(
      {
        x: 400,
        y: 100, // 调整y坐标，增加间距
        fontSize: 30,
        w: canvasWidth,
        color: '#666',
        text: '总价：¥ ' + totalInfo.item_fee_new / 100
      },
      drawOptions
    )
    drawText(
      {
        x: 100,
        y: 200, // 调整y坐标，增加间距
        fontSize: 30,
        w: canvasWidth,
        color: '#666',
        text: '运费：¥ ' + totalInfo.freight_fee / 100
      },
      drawOptions
    )
    drawText(
      {
        x: 400,
        y: 200, // 调整y坐标，增加间距
        fontSize: 30,
        w: canvasWidth,
        color: '#666',
        text: '促销：¥ ' + totalInfo.promotion_discount / 100
      },
      drawOptions
    )
    drawText(
      {
        x: 100,
        y: 300, // 调整y坐标，增加间距
        fontSize: 30,
        w: canvasWidth,
        color: '#666',
        text: '优惠券：¥ ' + totalInfo.coupon_discount / 100
      },
      drawOptions
    )

    // 太阳码
    drawImage(
      {
        imgPath: this.codeImg.path,
        x: 100,
        y: 370,
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

export default StoreCode
