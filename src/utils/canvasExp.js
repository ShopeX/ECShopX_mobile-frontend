const canvasExp = {
  textFill: (ctx, text, size, color, bold, align, valign, x, y) => {
    ctx.setFontSize(size)
    ctx.setFillStyle(color)
    if (align) ctx.setTextAlign(align)
    if (valign) ctx.setTextBaseline(valign)
    if (bold) {
      ctx.fillText(text, x, y)
      ctx.fillText(text, x+0.5, y+0.5)
    } else {
      ctx.fillText(text, x, y)
    }
  },
  textSpliceFill: (ctx, arr, align, x, y) => {
    let _x = x
    let _w = 0
    if (align === 'center') {
      arr.map(item => {
        const width = ctx.measureText(item.text).width
        _w += width
      })
      _x = x - _w/2
    }

    arr.map(item => {
      const { text, size, color, bold, valign } = item
      ctx.setFontSize(size)
      ctx.setFillStyle(color)
      if (align) ctx.setTextAlign(align)
      if (valign) ctx.setTextBaseline(valign)
      const width = ctx.measureText(text).width
      if (align === 'center') {
        _x += width/2
        ctx.fillText(text, _x, y)
      } else if (align === 'right') {
        _x -= width
        ctx.fillText(text, _x, y)
      } else {
        _x += width
        ctx.fillText(text, _x, y)
      }
    })
  },
  textOverflowFill: (ctx, text, x, y, w) => {
    let chr = text.split('')
    let temp = ''
    for (let a = 0; a < chr.length; a++) {
      if (ctx.measureText(temp).width < w-50) {
        temp += chr[a]
      } else {
        temp += '...'
        break
      }
    }
    ctx.fillText(temp, x, y, w)
  },
  textMultipleOverflowFill: (ctx, text, num, rows, x, y, w) => {
    let chr = text.split('')
    let temp = ''
    let row = []
    chr.map(item =>{
      if(temp.length < num+1) {
        temp += item
      } else {
        row.push(temp)
        temp = ''
      }
    })
    row.push(temp)
    let _y = y
    row.forEach((item, index) => {
      _y = _y+20
      if (index < rows-1) {
        ctx.fillText(item, x, _y, w)
      }
      if (index === rows-1) {
        this.textOverflowFill(ctx, item, x, _y, w)
      }
    })
  },
  drawImageFill: (ctx, img, x, y, w, h) => {
    ctx.drawImage(img, x, y, w, h)
    ctx.save()
  },
  imgCircleClip: (ctx, img, w, h, x, y) => {
    ctx.beginPath()
    ctx.arc(w / 2 + x, h / 2 + y, w / 2, 0, Math.PI * 2, false)
    ctx.clip()
  },
  roundRect: (ctx, color, x, y, w, h, r) => {
    ctx.beginPath()
    ctx.setFillStyle(color)
    ctx.setStrokeStyle(color)
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)

    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.lineTo(x + w, y + r)
    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)

    ctx.lineTo(x + w, y + h - r)
    ctx.lineTo(x + w - r, y + h)
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

    ctx.lineTo(x + r, y + h)
    ctx.lineTo(x, y + h - r)
    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

    ctx.lineTo(x, y + r)
    ctx.lineTo(x + r, y)

    ctx.fill()
    // ctx.stroke()
    ctx.closePath()

    ctx.clip()
    ctx.restore()
  }
}

export default {
  canvasExp
}
