const canvasExp = {
  textFill: (ctx, text, x, y, size, color, bold, align, valign) => {
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
          ctx.fillText(text, _x+0.5, y+0.5)
        }
        if (lineThrough) {
          ctx.moveTo (_x, valign === 'center' ? y : valign === 'bottom' ? y - size/2 : y + size/2)
          ctx.lineTo (_x + w, valign === 'center' ? y : valign === 'bottom' ? y - size/2 : y + size/2)
          ctx.setLineWidth(1)
          ctx.setStrokeStyle(color)
          ctx.stroke()
        }
        _x += w/2 - 3
      } else if (align === 'right') {
        ctx.fillText(text, _x, y)
        if (bold) {
          ctx.fillText(text, _x+0.5, y+0.5)
        }
        if (lineThrough) {
          ctx.moveTo (_x, valign === 'center' ? y : valign === 'bottom' ? y - size/2 : y + size/2)
          ctx.lineTo (_x + w, valign === 'center' ? y : valign === 'bottom' ? y - size/2 : y + size/2)
          ctx.setLineWidth(1)
          ctx.setStrokeStyle(color)
          ctx.stroke()
        }
        _x -= w + 3
      } else {
        ctx.fillText(text, _x, y)
        if (bold) {
          ctx.fillText(text, _x+0.5, y+0.5)
        }
        if (lineThrough) {
          ctx.moveTo (_x, valign === 'center' ? y : valign === 'bottom' ? y - size/2 : y + size/2)
          ctx.lineTo (_x + w, valign === 'center' ? y : valign === 'bottom' ? y - size/2 : y + size/2)
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
      if (ctx.measureText(temp).width < w-50) {
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
    // chr.map(item =>{
    //   if(temp.length < num) {
    //     temp += item
    //   } else {
    //     row.push(temp)
    //     temp = ''
    //     temp += item
    //   }
    // })

    chr.map((item,index) =>{
      if(ctx.measureText(temp).width < w) {
        temp += item
      } else {
        row.push(temp)
        temp = ''
        temp += item
      }
    })

    // for (var a = 0; a < chr.length; a++) {
    //   if (ctx.measureText(temp).width < w) {
    //     temp += chr[a];
    //   } else {
    //     a--; //这里添加了a-- 是为了防止字符丢失
    //     row.push(temp);
    //     temp = "";
    //   }
    // }

   row.push(temp)
    let _y = y
    row.forEach((item, index) => {
      console.log('index',index,rows)
      if (index+1 < rows) {
        ctx.fillText(item, x, _y)
      }
      if (index+1 === rows) {
        canvasExp.textOverflowFill(ctx, item, x, _y, w, size, color)
        //this.textOverflowFill(ctx, item, x, _y, w, size, color)
      }
      _y = _y+24
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
    ctx.restore()
  },
  roundRect: (ctx, color, x, y, w, h, r) => {
    ctx.beginPath()
    ctx.setFillStyle(color)
    // ctx.setStrokeStyle(color)
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

export default canvasExp
