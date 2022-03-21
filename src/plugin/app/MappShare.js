import QRCode from 'qrcode'
import log, { showToast, addClass, removeClass } from './utils'

class MAPPShare {
  constructor() {
    if (!MAPPShare.instance) {
      this.shareServices = {}
      this._posterImg = ''
      this.defaultOptions = {
        title: null, // 主标题
        content: null, // 副标题
        pic: null,
        link: null,
        path: null,
        price: null,
        // weixin: true,
        weibo: true,
        miniApp: true,
        shareConfig: [
          {
            name: '分享链接',
            type: 'link',
            items: [
              {
                name: '朋友圈',
                icon: 'wx-moments'
              },
              {
                name: '微信',
                icon: 'weixin'
              },
              {
                name: '新浪微博',
                icon: 'weibo'
              },
              {
                name: '复制链接',
                icon: 'link'
              }
            ]
          },
          {
            name: '分享海报',
            type: 'poster',
            items: [
              {
                name: '朋友圈',
                icon: 'wx-moments'
              },
              {
                name: '微信',
                icon: 'weixin'
              },
              {
                name: '新浪微博',
                icon: 'weibo'
              },
              {
                name: '下载图片',
                icon: 'download'
              }
            ]
          },
          {
            name: '分享小程序',
            type: 'wxmini',
            items: [
              {
                name: '微信',
                icon: 'weixin'
              }
            ]
          }
        ]
      }
      MAPPShare.instance = this
    }
    return MAPPShare.instance
  }

  // 初始化
  init(options) {
    const __SAPP_CONFIG = plus.storage.getItem('SAPP_CONFIG')
    try {
      this.SAPP_CONFIG = JSON.parse(__SAPP_CONFIG)
    } catch (e) {
      return
    }
    this.options = Object.assign(this.defaultOptions, options)
    this._getShareService()
    this._renderDom()
    this._createPoster()
  }

  _renderDom() {
    debugger
    const eleId = document.getElementById('mapp-share')
    if (eleId) {
      eleId.remove()
    }

    const mappShareDiv = document.createElement('div')
    mappShareDiv.id = 'mapp-share'
    mappShareDiv.className = 'mapp-share close'
    // 背景
    const mappShareBgDiv = document.createElement('div')
    mappShareBgDiv.className = 'mapp-share__bg'
    // 海报
    const mappSharePosterDiv = document.createElement('div')
    mappSharePosterDiv.className = 'mapp-share__poster'
    // 分享
    const mappShareBodyDiv = document.createElement('div')
    mappShareBodyDiv.className = 'mapp-share__body'
    // 关闭按钮
    const mappShareClose = document.createElement('img')
    mappShareClose.className = 'mapp-share__close'
    mappShareClose.onclick = this._closeMappShare
    this._loadImg('file://' + plus.io.convertLocalFileSystemURL(`_www/img/close.png`)).then(
      (res) => {
        mappShareClose.src = res
        mappShareBodyDiv.appendChild(mappShareClose)
      }
    )

    const hdContainer = document.createElement('ul')
    hdContainer.className = 'mapp-share__hd'

    const bdContainer = document.createElement('div')
    bdContainer.className = 'mapp-share__bd'

    const { shareConfig, weibo, miniApp } = this.defaultOptions
    shareConfig.forEach((share, index) => {
      // 关闭小程序分享
      if (!miniApp && share.type == 'wxmini') {
        return
      }
      // 头部tab
      const liEle = document.createElement('li')
      liEle.innerText = share.name
      liEle.className = `share-hd ${index == 0 ? 'active' : ''}`
      liEle.onclick = this._toggleTab.bind(this, index, share.type)
      hdContainer.appendChild(liEle)

      const shareItemContainer = document.createElement('ul')
      shareItemContainer.className = `share-item__wrap ${index == 0 ? 'active' : ''}`
      share.items.forEach((item) => {
        // 关闭微博分享
        if (!weibo && item.icon == 'weibo') {
          return
        }
        // 分享内容
        const subLiEle = document.createElement('li')
        subLiEle.className = 'share-item'
        subLiEle.onclick = this._handleClickItem.bind(this, item, share.type)
        const imgEle = document.createElement('img')

        const localPath = 'file://' + plus.io.convertLocalFileSystemURL(`_www/img/${item.icon}.png`)
        this._loadImg(localPath).then((res) => {
          imgEle.className = 'share-image'
          imgEle.src = res
          const textEle = document.createElement('div')
          textEle.innerText = item.name
          subLiEle.appendChild(imgEle)
          subLiEle.appendChild(textEle)
          shareItemContainer.appendChild(subLiEle)
        })
      })
      bdContainer.appendChild(shareItemContainer)
    })
    mappShareBodyDiv.appendChild(hdContainer)
    mappShareBodyDiv.appendChild(bdContainer)

    mappShareDiv.appendChild(mappShareBgDiv)
    mappShareDiv.appendChild(mappSharePosterDiv)
    mappShareDiv.appendChild(mappShareBodyDiv)

    document.body.appendChild(mappShareDiv)
  }

  _getShareService() {
    this.shareServices = {}
    plus.share.getServices(
      (data) => {
        log.info('shareServcies: ' + JSON.stringify(data))
        data.forEach((item) => {
          this.shareServices[item.id] = item
        })
      },
      (err) => {
        showToast('获取分享服务列表失败：' + err.message)
      }
    )
  }

  // 加载图片
  _loadImg(localPath) {
    return new Promise((resolve, reject) => {
      let bitmap = new plus.nativeObj.Bitmap('test')
      bitmap.load(
        localPath,
        () => {
          const base4 = bitmap.toBase64Data()
          resolve(base4)
        },
        (error) => {
          reject(error)
        }
      )
    })
  }

  /**
   * 关闭
   */
  _closeMappShare(e) {
    addClass(document.getElementsByClassName('mapp-share')[0], 'close')
    e.stopPropagation()
    e.preventDefault()
    removeClass(document.body, 'lock')
  }

  /**
   * 切换tab
   */
  _toggleTab(index, type) {
    const eles = document.getElementsByClassName('share-hd')
    Array.from(eles).forEach((ele) => {
      removeClass(ele, 'active')
    })
    addClass(document.getElementsByClassName('share-hd')[index], 'active')
    const shareWrap = document.getElementsByClassName('share-item__wrap')
    Array.from(shareWrap).forEach((ele) => {
      removeClass(ele, 'active')
    })
    addClass(document.getElementsByClassName('share-item__wrap')[index], 'active')
    if (type == 'poster') {
      addClass(document.getElementsByClassName('mapp-share__poster')[0], 'active')
    } else {
      removeClass(document.getElementsByClassName('mapp-share__poster')[0], 'active')
    }
  }

  _handleClickItem(item, type) {
    let shareContent
    const { title, pic, content, link, price, path } = this.options
    const href = link + `${/\?/.test(link) ? '&' : '?'}` + `msource=${item.icon}&mtype=${type}`
    switch (type) {
      case 'link':
        shareContent = {
          type: 'web',
          title,
          content,
          thumbs: [pic],
          href,
          price
        }
        this._handleShareByType(item, shareContent)
        break
      case 'poster':
        this._cachPoster()
          .then((res) => {
            shareContent = {
              type: 'image',
              pictures: ['_doc/poster.jpg'],
              title,
              content,
              thumbs: ['_doc/poster.jpg'],
              href
            }
            this._handleShareByType(item, shareContent)
          })
          .catch((e) => {
            plus.nativeUI.toast(JSON.stringify(e), {
              duration: 'short',
              verticalAlign: 'center'
            })
            log.error('加载图片失败：' + JSON.stringify(e))
          })
        break
      case 'wxmini':
        shareContent = {
          type: 'miniProgram',
          title,
          content,
          thumbs: [pic],
          miniProgram: {
            id: this.SAPP_CONFIG.miniApp.id, // 小程序的原始ID
            path,
            webUrl: href
          }
        }
        this._handleShareByType(item, shareContent)
        break
      default:
        break
    }
  }

  _handleShareByType(item, content) {
    switch (item.icon) {
      // 朋友圈
      case 'wx-moments':
        this._share(this.shareServices['weixin'], content, {
          title: '朋友圈',
          extra: { scene: 'WXSceneTimeline' }
        })
        break
      // 微信好友
      case 'weixin':
        this._share(this.shareServices['weixin'], content, {
          title: '我的好友',
          extra: { scene: 'WXSceneSession' }
        })
        break
      // 微博
      case 'weibo':
        this._share(this.shareServices['sinaweibo'], content)
        break
      // 复制链接
      case 'link':
        this.copyToClip(content.href)
        break
      // 下载
      case 'download':
        // 通过URL参数获取目录对象或文件对象
        plus.io.resolveLocalFileSystemURL('_doc/poster.jpg', function (entry) {
          plus.io.resolveLocalFileSystemURL('_doc/', function (root) {
            var newName = 'poster_' + new Date().getTime() + '.jpg'
            entry.copyTo(
              root,
              newName,
              function (nentry) {
                plus.gallery.save('_doc/' + newName, function () {
                  plus.nativeUI.toast('保存图片到相册成功', {
                    duration: 'short',
                    verticalAlign: 'center'
                  })
                  // 删除缓存图片
                  nentry.remove()
                })
              },
              function (e) {
                plus.nativeUI.toast('错1误' + JSON.stringify(e), {
                  duration: 'short',
                  verticalAlign: 'center'
                })
                log.error('错1误' + JSON.stringify(e))
              }
            )
          })
        })
        break
      default:
        break
    }
  }

  // 复制到剪贴板
  copyToClip(content) {
    switch (plus.os.name) {
      case 'iOS':
        var UIPasteboard = plus.ios.importClass('UIPasteboard')
        var generalPasteboard = UIPasteboard.generalPasteboard()
        // 设置文本内容
        generalPasteboard.setValueforPasteboardType(content, 'public.utf8-plain-text')
        break
      case 'Android':
        var context = plus.android.importClass('android.content.Context')
        var main = plus.android.runtimeMainActivity()
        var clip = main.getSystemService(context.CLIPBOARD_SERVICE)
        plus.android.invoke(clip, 'setText', content)
        break
    }
    showToast('复制成功')
  }

  _share(srv, msg, button) {
    if (!srv) {
      showToast('无效的分享服务！')
      return
    }
    button && (msg.extra = button.extra)
    // 发送分享
    if (srv.authenticated) {
      log.info('---已授权---')
      this._doShare(srv, msg)
    } else {
      showToast('---未授权---')
      srv.authorize(
        () => {
          this._doShare(srv, msg)
        },
        (e) => {
          showToast('认证授权失败：' + JSON.stringify(e))
          if (e.code == '-8') {
            showToast('客户端未安装')
          }
        }
      )
    }
  }

  _doShare(srv, msg) {
    log.info(JSON.stringify(msg))
    srv.send(
      msg,
      () => {
        log.info('分享到"' + srv.description + '"成功！')
      },
      (e) => {
        if (e.message.indexOf('User canceled') > -1) {
        } else {
          showToast('分享到"' + srv.description + '"失败: ' + JSON.stringify(e))
        }
      }
    )
  }

  // 缓存海报
  _cachPoster() {
    return new Promise((resolve, reject) => {
      const bitmap = new plus.nativeObj.Bitmap('test')
      bitmap.loadBase64Data(
        this._posterImg,
        () => {
          bitmap.save(
            '_doc/poster.jpg',
            {
              overwrite: true,
              quality: 100
            },
            () => {
              resolve()
            },
            (e) => {
              reject(e)
            }
          )
        },
        (e) => {
          reject(e)
        }
      )
    })
  }

  /**
   * 生成海报
   */
  _createPoster() {
    const { title, pic, content, link, price, path } = this.options
    const href = link + `${/\?/.test(link) ? '&' : '?'}` + `msource=poster`
    let canvasHtml = document.createElement('canvas')
    canvasHtml.width = 600
    canvasHtml.height = 900
    canvasHtml.id = 'myCanvas'

    let ctx = canvasHtml.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, 600, 900)

    Promise.all([
      // 海报主图
      new Promise((relove, reject) => {
        let mainPic = new Image()
        mainPic.setAttribute('crossOrigin', 'anonymous')
        mainPic.src = pic
        mainPic.onload = () => {
          relove(mainPic)
        }
      }),
      // 海报二维码
      new Promise((relove, reject) => {
        QRCode.toDataURL(href)
          .then((url) => {
            let qrCode = new Image()
            qrCode.src = url
            qrCode.onload = () => {
              relove(qrCode)
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
    ])
      .then((values) => {
        const picInfo = values[0]
        const qrcodeInfo = values[1]
        // 绘制图片
        ctx.drawImage(picInfo, 0, 0, picInfo.width, picInfo.height, 75, 75, 450, 450)
        // 绘制二维码
        ctx.drawImage(qrcodeInfo, 0, 0, qrcodeInfo.width, qrcodeInfo.height, 40, 680, 200, 200)
        // 价格
        if (price) {
          ctx.font = '42px Helvetica Neue'
          ctx.fillStyle = '#cc0000'
          ctx.fillText('¥' + price, 300 - Math.round(ctx.measureText('¥' + price).width / 2), 570)
        }
        // 主标题
        if (title) {
          ctx.font = '30px Helvetica Neue'
          ctx.fillStyle = '#000'
          // 获取行数
          const row = this._transformContentToMultiLineText(ctx, title, 360, 1)
          // 只绘制第一行
          ctx.fillText(row[0].trim(), 300 - ctx.measureText(row[0]).width / 2, 620)
        }
        // 副标题
        if (content) {
          ctx.font = '30px Helvetica Neue'
          ctx.fillStyle = '#555'
          const row = this._transformContentToMultiLineText(ctx, content, 500, 1)
          if (row.length == 1) {
            ctx.fillText(row[0].trim(), 300 - ctx.measureText(row[0]).width / 2, 660)
          } else {
            for (var i = 0; i < row.length; i++) {
              ctx.fillText(row[i].trim(), 120, 660 + i * 30)
            }
          }
        }
        // 海报说明
        ctx.font = '30px Helvetica Neue'
        ctx.fillStyle = '#666'
        ctx.fillText('长按识别二维码立即前往', 240, 760)

        ctx.font = '30px Helvetica Neue'
        ctx.fillStyle = '#999'
        ctx.fillText(`分享自${this.SAPP_CONFIG.project}APP`, 240, 820)

        const postWrap = document.createElement('div')
        postWrap.className = 'poster-img__wrap'

        const postImg = document.createElement('img')
        postImg.src = canvasHtml.toDataURL()
        postImg.style.width = '100%'
        // 缓存
        this._posterImg = postImg.src

        postWrap.appendChild(postImg)
        document.querySelector('.mapp-share__poster').appendChild(postWrap)
      })
      .catch((err) => {
        log.error(err)
      })
  }

  // 文本多行分割
  _transformContentToMultiLineText(ctx, text, contentWidth, lineNumber) {
    var textArray = text.split('') // 分割成字符串数组
    var temp = ''
    var row = []

    for (var i = 0; i < textArray.length; i++) {
      if (ctx.measureText(temp).width < contentWidth) {
        temp += textArray[i]
      } else {
        i-- // 这里添加i--是为了防止字符丢失
        row.push(temp)
        temp = ''
      }
    }
    row.push(temp)

    // 如果数组长度大于2，则截取前两个
    if (row.length > lineNumber) {
      var rowCut = row.slice(0, lineNumber)
      var rowPart = rowCut[1]
      var test = ''
      var empty = []
      for (var a = 0; a < rowCut.length; a++) {
        if (ctx.measureText(test).width < contentWidth) {
          test += rowCut[a]
        } else {
          break
        }
      }
      empty.push(test) // 处理后面加省略号
      var group = empty[0] + '...'
      rowCut.splice(lineNumber - 1, 1, group)
      row = rowCut
    }
    return row
  }

  open() {
    removeClass(document.getElementsByClassName('mapp-share')[0], 'close')
    addClass(document.body, 'lock')
  }
}

export default new MAPPShare()
