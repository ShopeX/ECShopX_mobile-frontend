const guideCanvasExp = {
  textFill: (ctx, text, x, y, size, color, bold, align, valign) => {
    ctx.setFontSize(size)
    ctx.setFillStyle(color)
    if (align) ctx.setTextAlign(align)
    if (valign) ctx.setTextBaseline(valign)
    if (bold) {
      ctx.fillText(text, x, y)
      ctx.fillText(text, x + 0.5, y + 0.5)
    } else {
      ctx.fillText(text, x, y)
    }
  },
  textSpliceFill: (ctx, arr, align, x, y) => {
    let _x = x
    let _w = 0
    if (align === 'center') {
      arr.map((item) => {
        const width = ctx.measureText(item.text).width
        _w += width
      })
      _x = x - _w / 2
    }

    arr.map((item) => {
      const { text, size, color, bold, lineThrough, valign } = item
      ctx.setFontSize(size)
      ctx.setFillStyle(color)
      if (align) ctx.setTextAlign(align)
      if (valign) ctx.setTextBaseline(valign)
      const width = ctx.measureText(text).width
      const w = Math.ceil(width)
      if (align === 'center') {
        ctx.fillText(text, _x, y)
        if (bold) {
          ctx.fillText(text, _x + 0.5, y + 0.5)
        }
        if (lineThrough) {
          ctx.moveTo(
            _x,
            valign === 'center' ? y : valign === 'bottom' ? y - size / 2 : y + size / 2
          )
          ctx.lineTo(
            _x + w,
            valign === 'center' ? y : valign === 'bottom' ? y - size / 2 : y + size / 2
          )
          ctx.setLineWidth(1)
          ctx.setStrokeStyle(color)
          ctx.stroke()
        }
        _x += w / 2 - 3
      } else if (align === 'right') {
        ctx.fillText(text, _x, y)
        if (bold) {
          ctx.fillText(text, _x + 0.5, y + 0.5)
        }
        if (lineThrough) {
          ctx.moveTo(
            _x,
            valign === 'center' ? y : valign === 'bottom' ? y - size / 2 : y + size / 2
          )
          ctx.lineTo(
            _x + w,
            valign === 'center' ? y : valign === 'bottom' ? y - size / 2 : y + size / 2
          )
          ctx.setLineWidth(1)
          ctx.setStrokeStyle(color)
          ctx.stroke()
        }
        _x -= w + 3
      } else {
        ctx.fillText(text, _x, y)
        if (bold) {
          ctx.fillText(text, _x + 0.5, y + 0.5)
        }
        if (lineThrough) {
          ctx.moveTo(
            _x,
            valign === 'center' ? y : valign === 'bottom' ? y - size / 2 : y + size / 2
          )
          ctx.lineTo(
            _x + w,
            valign === 'center' ? y : valign === 'bottom' ? y - size / 2 : y + size / 2
          )
          ctx.setLineWidth(1)
          ctx.setStrokeStyle(color)
          ctx.stroke()
        }
        _x += w + 3
      }
    })
  },
  textOverflowFill: (ctx, text, x, y, w, size, color) => {
    ctx.setFontSize(size)
    ctx.setFillStyle(color)
    let chr = text.split('')
    let temp = ''
    for (let a = 0; a < chr.length; a++) {
      if (ctx.measureText(temp).width < w - 50) {
        temp += chr[a]
      } else {
        temp += '...'
        break
      }
    }
    ctx.fillText(temp, x, y)
  },

  textMultipleOverflowFill: (ctx, text, num, rows, x, y, w, size, color) => {
    ctx.setFontSize(size)
    ctx.setFillStyle(color)
    let chr = text.split('')
    let temp = ''
    let row = []
    chr.map((item) => {
      if (temp.length < num) {
        temp += item
      } else {
        row.push(temp)
        temp = ''
        temp += item
      }
    })
    row.push(temp)
    let _y = y
    row.forEach((item, index) => {
      if (index + 1 < rows) {
        ctx.fillText(item, x, _y)
      }
      if (index + 1 === rows) {
        canvasExp.textOverflowFill(ctx, item, x, _y, w, size, color)
      }
      _y = _y + 22
    })
  },
  textNameFlow(ctx, text, rows, x, y, w) {
    let chr = text.split('')
    let temp = ''
    let row = []
    chr.map((item) => {
      if (temp.length < 9) {
        temp += item
      } else {
        row.push(temp)
        temp = ''
      }
    })
    row.push(temp)
    let _y = y
    row.forEach((item, index) => {
      _y = _y + 20
      if (index < rows - 1) {
        ctx.fillText(item, x, _y, w)
      }
      if (index === rows - 1) {
        canvasExp.textOverflowFill(ctx, item, x, _y, w)
      }
    })
  },
  drawImageFill: (ctx, img, x, y, w, h) => {
    ctx.drawImage(img, x, y, w, h)
    ctx.save()
  },
  circleClip: (ctx, x, y, w, h) => {
    ctx.beginPath()
    ctx.arc(w / 2 + x, h / 2 + y, w / 2, 0, Math.PI * 2, false)
    ctx.clip()
    ctx.restore()
  },
  imgCircleClip: (ctx, img, x, y, w, h) => {
    ctx.beginPath()
    ctx.arc(w / 2 + x, h / 2 + y, w / 2, 0, Math.PI * 2, false)
    ctx.clip()
    ctx.drawImage(img, x, y, w, h)
    // ctx.restore()
  },
  roundRect(ctx, x, y, w, h, r, color) {
    // 开始绘制
    ctx.beginPath()
    // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
    // 这里是使用 fill 还是 stroke都可以，二选一即可
    if (color) {
      ctx.setFillStyle(color)
      ctx.setStrokeStyle(color)
    } else {
      ctx.setFillStyle('#ffffff')
      ctx.setStrokeStyle('#ffffff')
    }
    // 左上角
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)

    // border-top
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.lineTo(x + w, y + r)
    // 右上角
    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)

    // border-right
    ctx.lineTo(x + w, y + h - r)
    ctx.lineTo(x + w - r, y + h)
    // 右下角
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

    // border-bottom
    ctx.lineTo(x + r, y + h)
    ctx.lineTo(x, y + h - r)
    // 左下角
    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

    // border-left
    ctx.lineTo(x, y + r)
    ctx.lineTo(x + r, y)

    // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
    ctx.fill()
    // ctx.stroke()
    ctx.closePath()
    // 剪切
    ctx.clip()
  },
  drawDashLine: (ctx, x1, y1, x2, y2, color, dashLen) => {
    ctx.beginPath()
    dashLen = dashLen === undefined ? 5 : dashLen
    let beveling = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
    //得到斜边的总长度

    //计算有多少个线段
    var num = Math.floor(beveling / dashLen)

    for (var i = 0; i < num; i++) {
      ctx[i % 2 == 0 ? 'moveTo' : 'lineTo'](x1 + ((x2 - x1) / num) * i, y1 + ((y2 - y1) / num) * i)
    }
    ctx.strokeStyle = color
    ctx.stroke()
  }
}

export default guideCanvasExp
