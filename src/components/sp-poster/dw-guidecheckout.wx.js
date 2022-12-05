import Taro, { Component } from '@tarojs/taro'
import api from '@/api'
import { getExtConfigData } from '@/utils'
import { drawText, drawImage, drawBlock, drawLine } from './helper'

const canvasWidth = 600
const canvasHeight = 960

class GuideCheckoutPoster {
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
    const { list, price, salesPromotionId, cartTotalNum, totalFee, discountFee, itemFee } =
      this.info
    const { salesperson_id, avatar, company_id, work_userid, shop_code, distributor_id } =
      this.userInfo
    const gu = `${work_userid}_${shop_code}`
    /**
     * 导购参数
     * page: pages/cart/espier-checkout
     * company_id: 1,
     * cxdid: 159,//营销活动
     * smid: 78,//导购id
     * distributor_id: 103,//门店id
     */
    const wxappCode = `${host}/wechatAuth/wxapp/qrcode.png?page=${`pages/cart/espier-checkout`}&
    appid=${appid}&company_id=${company_id}&cxdid=${salesPromotionId}&smid=${salesperson_id}&distributor_id=${distributor_id}&gu=${gu}`
    console.log('wxappCode:', wxappCode)

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

    // 头像背景
    drawBlock(
      {
        x: 24,
        y: 24,
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
        y: 24,
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
        y: 56,
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
        y: 88,
        fontSize: 22,
        color: '#999',
        text: '推荐一个好物给你'
      },
      drawOptions
    )
    // 商品背景
    drawBlock(
      {
        x: 24,
        y: 128,
        width: 552,
        height: 590,
        backgroundColor: '#f5f5f5',
        borderRadius: 0
      },
      drawOptions
    )
    // 商品信息
    drawText(
      {
        x: 44,
        y: 172,
        fontSize: 24,
        color: '#666',
        text: '商品'
      },
      drawOptions
    )
    drawText(
      {
        x: 380,
        y: 172,
        fontSize: 24,
        color: '#666',
        text: '单价'
      },
      drawOptions
    )
    drawText(
      {
        x: 500,
        y: 172,
        fontSize: 24,
        color: '#666',
        text: '数量'
      },
      drawOptions
    )
    drawLine(
      {
        startX: 44,
        startY: 194,
        endX: 556,
        endY: 194,
        color: '#ddd',
        width: 1
      },
      drawOptions
    )

    for (let n = 0; n < list.length; n++) {
      const item = list[n]
      const { price, activityPrice, memberPrice, packagePrice } = item
      let _price
      if (!isNaN(activityPrice)) {
        _price = activityPrice
      } else if (!isNaN(packagePrice)) {
        _price = packagePrice
      } else if (!isNaN(memberPrice)) {
        _price = memberPrice
      } else {
        _price = price
      }
      const y = 230 + n * 40

      if (n > 9) {
        drawText(
          {
            x: 44,
            y,
            fontSize: 24,
            color: '#666',
            text: '······'
          },
          drawOptions
        )
        break
      }

      drawText(
        {
          x: 44,
          y,
          fontSize: 24,
          color: '#666',
          text: `${item.itemName} ${item.itemSpecDesc}`,
          width: 300,
          lineNum: 1
        },
        drawOptions
      )
      const initPrice = _price.toFixed(2).split('.')[0]
      const floatPrice = `.${_price.toFixed(2).split('.')[1]}`
      drawText(
        {
          x: 380,
          y,
          text: [
            {
              text: '¥',
              fontSize: 20,
              color: '#666'
            },
            {
              text: initPrice,
              fontSize: 24,
              color: '#666'
            },
            {
              text: floatPrice,
              fontSize: 20,
              color: '#666'
            }
          ]
        },
        drawOptions
      )
      drawText(
        {
          x: 500,
          y,
          fontSize: 24,
          color: '#666',
          text: item.num
        },
        drawOptions
      )
    }
    // 统计信息
    drawText(
      {
        x: 44,
        y: 766,
        fontSize: 24,
        color: '#666',
        text: `共${cartTotalNum}件商品`
      },
      drawOptions
    )
    drawText(
      {
        x: 44,
        y: 806,
        fontSize: 24,
        color: '#666',
        text: `合计: `
      },
      drawOptions
    )
    const totalInitPrice = totalFee.toFixed(2).split('.')[0]
    const totalFloatPrice = `.${totalFee.toFixed(2).split('.')[1]}`
    drawText(
      {
        x: 110,
        y: 806,
        text: [
          {
            text: '¥',
            fontSize: 20,
            color: '#666'
          },
          {
            text: totalInitPrice,
            fontSize: 24,
            color: '#666'
          },
          {
            text: totalFloatPrice,
            fontSize: 20,
            color: '#666'
          }
        ]
      },
      drawOptions
    )
    drawText(
      {
        x: 44,
        y: 846,
        fontSize: 24,
        color: '#666',
        text: `优惠: `
      },
      drawOptions
    )
    const discountInitPrice = discountFee.toFixed(2).split('.')[0]
    const discountFloatPrice = `.${discountFee.toFixed(2).split('.')[1]}`
    drawText(
      {
        x: 110,
        y: 846,
        text: [
          {
            text: '-¥',
            fontSize: 20,
            color: '#666'
          },
          {
            text: discountInitPrice,
            fontSize: 24,
            color: '#666'
          },
          {
            text: discountFloatPrice,
            fontSize: 20,
            color: '#666'
          }
        ]
      },
      drawOptions
    )
    drawText(
      {
        x: 44,
        y: 886,
        fontSize: 24,
        color: '#666',
        text: `实付: `
      },
      drawOptions
    )
    const itemInitPrice = itemFee.toFixed(2).split('.')[0]
    const itemFloatPrice = `.${itemFee.toFixed(2).split('.')[1]}`
    drawText(
      {
        x: 110,
        y: 886,
        text: [
          {
            text: '¥',
            fontSize: 20,
            color: '#666'
          },
          {
            text: itemInitPrice,
            fontSize: 24,
            color: '#666'
          },
          {
            text: itemFloatPrice,
            fontSize: 20,
            color: '#666'
          }
        ]
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

export default GuideCheckoutPoster
