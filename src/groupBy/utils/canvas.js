/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: canvas绘制
 * @FilePath: /unite-vshop/src/groupBy/utils/canvas.js
 * @Date: 2020-05-11 11:05:05
 * @LastEditors: Arvin
 * @LastEditTime: 2020-07-08 18:54:23
 */

export default class Canvas {
  constructor (ctx = null, taro) {
    if (ctx) {
      this.ctx = ctx,
      this.taro = taro
    } else {
      throw new Error('请传入canvas对象')
    }
  }

  /**
   * @description: 创建背板
   * @param 
   * {
   *  w: 宽，
   *  h: 高，
   *  x: x轴位置，
   *  y: y轴位置
   *  bgColor: 背景颜色值
   *  bgImg: 背景图,
   * } 
   */  
  async createBackground (w, h, x, y, r, bgColor = '#fff',  bgImg) {
    this.ctx.beginPath()
    this.ctx.setFillStyle(bgColor)
    // 左上角
    this.ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
    // border-top
    this.ctx.moveTo(x + r, y)
    this.ctx.lineTo(x + w - r, y)
    this.ctx.lineTo(x + w, y + r)
    // 右上角
    this.ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)
    // border-right
    this.ctx.lineTo(x + w, y + h - r)
    this.ctx.lineTo(x + w - r, y + h)
    // 右下角
    this.ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)
    // border-bottom
    this.ctx.lineTo(x + r, y + h)
    this.ctx.lineTo(x, y + h - r)
    // 左下角
    this.ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)
    // border-left
    this.ctx.lineTo(x, y + r)
    this.ctx.lineTo(x + r, y)
    
    this.ctx.fill()
    this.ctx.closePath()
    this.ctx.clip()
    if (bgImg) {
      await this.drawImage(bgImg, 0, 0, w, h)
    }
    this.ctx.restore()
    this.ctx.save()
  }

  // 创建圆图
  async createRoundImg (x, y, r, img, bgColor) {
    if (!img) return 
    this.ctx.beginPath()
    this.ctx.arc(x - r, y + r, r, 0, 2 * Math.PI)
    if (bgColor) {
      this.ctx.setFillStyle(bgColor)
    }
    this.ctx.fill()
    this.ctx.closePath()
    this.ctx.clip()
    if (img) {
      await this.drawImage(img, x, y, r * 2, r * 2, true)
    }
  }

  // 计算文字长度
  measureText (text) {
    const width = this.ctx.measureText(text).width
    return width
  }

  // 文字超长截取
  splitString (str, limitWidth) {
    if (!str) return null
    // 文字长度
    const width = this.measureText(str)
    // 文字个数
    const strLength = str.length
    // 单个文字长度
    const single = width / str.length
    // 可显示文字个数
    const num = limitWidth / single
    if (num >= (strLength + 4)) {
      return str
    } else {
      // 截取位置
      const splitIndex = Math.floor(num)
      const newStr = str.substr(0, splitIndex)
      return `${newStr}...`
    }
  }

  // 绘制文字
  drawText (x, y, text, color = '#333', fontSize = 11, textAlign = 'left', baseline = 'top') {
    if (!text) return
    this.ctx.setFontSize(`${fontSize}px Arial`)
    this.ctx.setFillStyle(color)
    this.ctx.setTextAlign(textAlign)
    this.ctx.setTextBaseline(baseline)
    this.ctx.fillText(text, x, y)
    this.ctx.restore()
    this.ctx.save()
  }

  /**
   * @description: 
   * @param {
   *  img: 图片路径
   *  x: 图片起始x位置
   *  y: 图片起始y位置
   *  w: 宽
   *  h: 高
   *  isClip: 是否裁剪
   * } 
   * @return: 
   */  
  // 绘制图片
  async drawImage (img, x, y, w, h, isClip = false) {
    if (!img) return null
    // 判断是否是网络图片
    const isHttps = img.indexOf('https://') !== -1 || img.indexOf('http://') !== -1
    let useImg = {
      img: img,
      w: 0,
      h: 0
    }
    // 环境判断
    if (process.env.TARO_ENV === 'h5') {
      const imgInfo = await this.insertImg(img) 
      useImg = {
        img: imgInfo,
        w: imgInfo.width,
        h: imgInfo.height
      }
    } else {
      const imgInfo = await this.taro.getImageInfo({src: img})
      useImg = {
        img: `${isHttps ? '' : '/'}${imgInfo.path}`,
        w: imgInfo.width,
        h: imgInfo.height
      }
    }
    if (!isClip) {
      this.ctx.drawImage(useImg.img, x, y, w, h)
    } else {
      this.ctx.drawImage(useImg.img, 0, 0, useImg.w, useImg.h, x - w, y, w, h)
    }
    this.ctx.restore()
    this.ctx.save()
  }
  
  // 插入H5图片
  insertImg (imgUrl) {
    const isHttps = imgUrl.indexOf('https://') !== -1 || imgUrl.indexOf('http://') !== -1
    const img = new Image()
    if (isHttps) {
      img.setAttribute('crossOrigin', 'Anonymous')
    }
    return new Promise (resolve => {
      img.onload = () => {
        resolve(img)
      }
      img.src = imgUrl + '?time=' + new Date().getTime()
    })
  }

  // 创建多个商品
async createGoodList (data, x, y, w) {
  const marginTop = 20
  const marginLeft = x + 50
  const top = y + 10
  const imgWidth = 60
  // 限制宽度
  const limtWidth = (w + x * 2) - (marginLeft * 2 + imgWidth + 10)
  // 字体大小
  const fontSize = 16
  // 创建标题
  this.drawText((w + x * 2)/ 2, top, '1月1日推荐', '#333', 23, 'center')
  for (let i = 0; i < 5; i++) {
    const toTop = top + marginTop * 2 + (marginTop + imgWidth) * i
    this.ctx.setFontSize(fontSize)
    const name = this.splitString('澳大利亚澳大利亚澳大利亚澳大利亚澳大利亚', limtWidth)
    await this.drawImage('https://img12.360buyimg.com/n7/jfs/t25312/134/1983666171/147642/a17b1b62/5bc19e2eNf9565de8.jpg', marginLeft, toTop, imgWidth, imgWidth)
    this.drawText(marginLeft + imgWidth + 10, toTop + 5, name, '#333', fontSize)
    this.createShowPrice('10.00', '14.00', marginLeft + imgWidth + 10, toTop + 40, fontSize)
  }
}

  // 创建单个商品
  async creatSingleGood (data, x, y, sw, sh, sr) {
    const imgX = x
    const imgY = y
    const r = sr
    const w = sw
    const h = sh
    this.ctx.beginPath()
    // 左上角
    this.ctx.arc(imgX + r, imgY + r, r, Math.PI, Math.PI * 1.5)
    // border-top
    this.ctx.moveTo(imgX + r, imgY)
    this.ctx.lineTo(imgX + w - r, imgY)
    this.ctx.lineTo(imgX + w, imgY + r)
    // 右上角
    this.ctx.arc(imgX + w - r, imgY + r, r, Math.PI * 1.5, Math.PI * 2)
    // border-right
    this.ctx.lineTo(imgX + w, imgY + h)
    this.ctx.lineTo(imgX, imgY + h)
    this.ctx.lineTo(imgX, imgY + h)
    this.ctx.lineTo(imgX, imgY + h)
    this.ctx.lineTo(imgX, imgY + r)
    this.ctx.lineTo(imgX + r, imgY)
    this.ctx.fill()
    this.ctx.closePath()
    this.ctx.clip()
    await this.drawImage(data.img, imgX, imgY, w, h)
    this.ctx.setFontSize(`23px Arial`)
    const splitName = this.splitString(data.name, w)
    this.drawText((w + imgX * 2) / 2, imgY + h + 15, splitName, '#333', 23, 'center')
    this.createShowPrice(data.symbol, data.nPrice, data.oPrice, (w + imgX * 2) / 2, imgY + h + 80, 22, true)
    this.ctx.restore()
    this.ctx.save()
  }

  // 创建价格展示
  createShowPrice(symbol = '¥', nPrice, oPrice, x, y, fontSize, isCenter = false, align = 'left') {
    const diff = 4
    const otherFontSize = fontSize - (diff + 1)
    const marignLeft = 2
    this.ctx.setFontSize(otherFontSize)
    const symbolWidth = this.measureText(symbol)
    const oPriceWidth = this.measureText(oPrice)
    this.ctx.setFontSize(fontSize)
    const nPriceWidth = this.measureText(nPrice)
    const sumWidth = isCenter ? (symbolWidth + oPriceWidth + nPriceWidth + marignLeft * 4) / 2 : 0
    this.drawText(x - sumWidth, y + diff, symbol, '#928869', otherFontSize, align)
    this.drawText(x - sumWidth + symbolWidth + marignLeft, y, nPrice, '#928869', fontSize, align)
    this.drawText(x - sumWidth + symbolWidth + nPriceWidth + marignLeft * 3, y + diff, oPrice, '#666', otherFontSize, align)
    this.ctx.beginPath()
    this.ctx.moveTo(x - sumWidth + symbolWidth + nPriceWidth + marignLeft * 3, y + diff + otherFontSize / 1.8)
    this.ctx.lineTo(x - sumWidth + symbolWidth + nPriceWidth + marignLeft * 3 + oPriceWidth, y + diff + otherFontSize / 1.8)
    this.ctx.setLineWidth(1)
    this.ctx.setStrokeStyle('#666')
    this.ctx.stroke()
    this.ctx.closePath()
    this.ctx.clip()
    this.ctx.restore()
    this.ctx.save()
  }
  
  // 创建底部内容
  async createBottom (width, x, y, data) {
    const sx = x
    const sy = y + 18
    const marginLeft = 10
    const marginTop = 24
    const list = [
      {
        name: '小区团长:', 
        content: data.leaderName
      }, {
        name: '预计送达:', 
        content: data.deliveryDate
      }, {
        name: '提货地址:',   
        content: data.address
      }
    ]
    // 重置文字大小
    this.ctx.setFontSize(`11px Arial`)
    for (let i =0; i < list.length; i++) {
      const top = sy + marginTop * i
      const nameWidth = this.measureText(list[i].name)
      const limtWidth = (width - 2 * sx - 100 - nameWidth - marginLeft )
      const text = this.splitString(list[i].content, limtWidth)
      this.drawText(sx, top, list[i].name)
      this.drawText(sx + nameWidth + marginLeft, top, text, '#000', 11, 'left')
    }
    this.drawText(sx, sy + marginTop * list.length + 8, '点击放大，长按转发，优惠拼团扫一扫', '#000', 13)
    await this.createRoundImg(width - sx, sy, 50, data.img, '#fff')
  }

  // 绘制
  async drawCanvas (width, height, goodInfo, cb = null) {
    const goodTop = 60
    const goodLeft = 15
    const goodWidth = width - (goodLeft * 2)
    const goodheight = 450
    // 绘制背景
    await this.createBackground(width, height, 0, 0, 10, '#fff')
    // 绘制商品内容框
    await this.createBackground(goodWidth, goodheight, goodLeft, goodTop, 10)
    await this.creatSingleGood({
      img: goodInfo.pics[0],
      name: goodInfo.goodName,
      nPrice: goodInfo.activityPrice,
      oPrice: goodInfo.price,
      symbol: goodInfo.symbol
    }, goodLeft, goodTop, goodWidth, 340, 10)
    // await this.createGoodList({
    // }, goodLeft, goodTop, goodWidth)
    await this.createBottom(width, goodLeft, goodTop + goodheight, {
      img: goodInfo.qrCode,
      leaderName: goodInfo.leaderName,
      address: goodInfo.address,
      deliveryDate: goodInfo.deliveryDate
    })
    this.ctx.draw(true, () => {
      if (cb) {
        cb()
      }
    })
  }
}
