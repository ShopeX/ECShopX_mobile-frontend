import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text, Image, Button, Canvas } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { useAsyncCallback } from '@/hooks'
import { classNames, authSetting, showToast, isAlipay } from '@/utils'
import GoodsDetailPoster from './dw-goodsdetail'
import GuideGoodsDetailPoster from './dw-guidegoodsdetail'
import GuideCheckout from './dw-guidecheckout'
import Distribution from './dw-distribution'

import './index.scss'

const initialState = {
  poster: null,
  pxWidth: 200,
  pxHeight: 200,
  factor: 1,
  eleId: 'poster-canvas',
  ctx: null
}

function SpPoster(props) {
  const { info, type, onClose = () => {} } = props
  console.log('SpPoster:props', props)
  const { userInfo } = useSelector((state) => state.user)
  const { userInfo: guideInfo } = useSelector((state) => state.guide)
  const [state, setState] = useAsyncCallback(initialState)

  const { poster, pxWidth, pxHeight, eleId, ctx } = state
  console.log('SpPoster:state', state)
  useEffect(() => {
    !isAlipay ? handleCreatePoster() : handleCreatePoster3()
  }, [])

  /**
   * @description rpx => px 基础方法
   * @param { number } rpx - 需要转换的数值
   * @param { boolean} int - 是否为 int
   * @param { number } [factor] - 转化因子
   * @returns { number }
   */
  const toPx = (rpx, int, factor = 1) => {
    if (int) {
      return parseInt(rpx * factor)
    }
    return rpx * factor
  }
  /**
   * @description px => rpx
   * @param { number } px - 需要转换的数值
   * @param { boolean} int - 是否为 int
   * @param { number } [factor] - 转化因子
   * @returns { number }
   */
  const toRpx = (px, int, factor = 1) => {
    if (int) {
      return parseInt(px / factor)
    }
    return px / factor
  }

  const handleCreatePoster = async () => {
    Taro.showLoading({
      title: '海报生成中...'
    })
    const ctx = Taro.createCanvasContext(eleId, Taro.getCurrentInstance().page)
    let canvasObj
    switch (type) {
      case 'goodsDetial':
        canvasObj = new GoodsDetailPoster({
          ctx,
          info,
          userInfo,
          toPx,
          toRpx
        })
        break
      case 'guideGoodsDetial':
        canvasObj = new GuideGoodsDetailPoster({
          ctx,
          info,
          userInfo: guideInfo,
          toPx,
          toRpx
        })
        break
      case 'guideCheckout':
        canvasObj = new GuideCheckout({
          ctx,
          info,
          userInfo: guideInfo,
          toPx,
          toRpx
        })
        break
      case 'distribution':
        canvasObj = new Distribution({
          ctx,
          info,
          userInfo,
          toPx,
          toRpx
        })
        break
      default:
        break
    }
    const { canvasWidth, canvasHeight } = canvasObj.getCanvasSize()
    setState(
      (draft) => {
        draft.pxWidth = canvasWidth
        draft.pxHeight = canvasHeight
        draft.ctx = ctx
      },
      async (_state) => {
        console.log('handleCreatePoster-setState:_state', _state)
        await canvasObj.drawPoster()
        const poster = await getPoster(_state)
        Taro.hideLoading()
        setState((draft) => {
          draft.poster = poster
        })
      }
    )
  }
  const handleCreatePoster2 = () => {
    Taro.showLoading({
      title: '海报生成中...'
    })
    console.log('handleCreatePoster run')
    let ctx = null
    // 通过 SelectorQuery 获取 Canvas 实例
    Taro.createSelectorQuery()
      .select('#poster-canvas')
      .node()
      .exec((res) => {
        console.log('alipay:res', res)
        const canvas = res[0].node
        ctx = canvas.getContext('2d')
        console.log('canvas', canvas)
        console.log('alipay:ctx1', ctx)
        // 开始绘画
        // ctx.fillRect(0, 100, 50, 50)
        console.log('alipay:ctx2', ctx)
        let canvasObj
        switch (type) {
          case 'goodsDetial':
            canvasObj = new GoodsDetailPoster({
              canvas,
              ctx,
              info,
              userInfo,
              toPx,
              toRpx
            })
            break
          case 'guideGoodsDetial':
            canvasObj = new GuideGoodsDetailPoster({
              ctx,
              info,
              userInfo: guideInfo,
              toPx,
              toRpx
            })
            break
          case 'guideCheckout':
            canvasObj = new GuideCheckout({
              ctx,
              info,
              userInfo: guideInfo,
              toPx,
              toRpx
            })
            break
          case 'distribution':
            canvasObj = new Distribution({
              ctx,
              info,
              userInfo,
              toPx,
              toRpx
            })
            break
          default:
            break
        }
        console.log('handleCreatePoster:canvasObj', canvasObj)
        const { canvasWidth, canvasHeight } = canvasObj.getCanvasSize()
        console.log('handleCreatePoster:canvasWidth', canvasWidth)
        console.log('handleCreatePoster:canvasHeight', canvasHeight)
        setState(
          (draft) => {
            draft.pxWidth = canvasWidth
            draft.pxHeight = canvasHeight
            draft.ctx = ctx
            draft.canvas = res[0].node
          },
          async (_state) => {
            console.log('handleCreatePoster-setState:_state', _state)
            await canvasObj.drawPoster()
            const poster = await getPoster(_state)
            Taro.hideLoading()
            setState((draft) => {
              draft.poster = poster
            })
          }
        )
      })
  }
  const handleCreatePoster3 = () => {
    Taro.showLoading({
      title: '海报生成中...'
    })
    console.log('handleCreatePoster run')
    let ctx = null
    // 通过 SelectorQuery 获取 Canvas 实例
    const query = my.createSelectorQuery()
    console.log('query', query)
    query
      .select('#poster-canvas')
      .node()
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        let canvasObj
        switch (type) {
          case 'goodsDetial':
            canvasObj = new GoodsDetailPoster({
              canvas,
              ctx,
              info,
              userInfo,
              toPx,
              toRpx
            })
            break
          case 'guideGoodsDetial':
            canvasObj = new GuideGoodsDetailPoster({
              ctx,
              info,
              userInfo: guideInfo,
              toPx,
              toRpx
            })
            break
          case 'guideCheckout':
            canvasObj = new GuideCheckout({
              ctx,
              info,
              userInfo: guideInfo,
              toPx,
              toRpx
            })
            break
          case 'distribution':
            canvasObj = new Distribution({
              ctx,
              info,
              userInfo,
              toPx,
              toRpx
            })
            break
          default:
            break
        }
        console.log('handleCreatePoster:canvasObj', canvasObj)
        const { canvasWidth, canvasHeight } = canvasObj.getCanvasSize()
        console.log('handleCreatePoster:canvasWidth', canvasWidth)
        console.log('handleCreatePoster:canvasHeight', canvasHeight)
        setState(
          (draft) => {
            draft.pxWidth = canvasWidth
            draft.pxHeight = canvasHeight
            draft.ctx = ctx
            draft.canvas = res[0].node
          },
          async (_state) => {
            console.log('handleCreatePoster-setState:_state', _state)
            console.log('canvas.toDataURL("image/png")', canvas.toDataURL("image/png"))
            await canvasObj.drawPoster()
            const poster = await getPoster(_state)
            Taro.hideLoading()
            setState((draft) => {
              draft.poster = poster
            })
          }
        )
      })

    // Taro.createSelectorQuery()
    //   .select('#poster-canvas')
    //   .node()
    //   .exec((res) => {
    //     console.log('alipay:res', res)
    //     const canvas = res[0].node
    //     ctx = canvas.getContext('2d')
    //     console.log('canvas', canvas)
    //     console.log('alipay:ctx1', ctx)
    //     // 开始绘画
    //     // ctx.fillRect(0, 100, 50, 50)
    //     console.log('alipay:ctx2', ctx)

    //   })
  }
  const getPoster = ({ ctx, pxWidth, pxHeight, eleId, canvas }) => {
    console.log('handleCreatePoster-getPoster:canvas1', canvas)
    return new Promise(async (resolve, reject) => {
      console.log('handleCreatePoster-getPoster:ctx', ctx)
      console.log('handleCreatePoster-getPoster:canvas2', canvas)
      // ctx.fillRect(0, 0, 50, 50)
      // ctx.draw(false, async () => {
      //   try{
      //     const { tempFilePath: poster } = await Taro.canvasToTempFilePath(
      //       {
      //         x: 0,
      //         y: 0,
      //         width: pxWidth,
      //         height: pxHeight,
      //         canvasId: eleId
      //       },
      //       Taro.getCurrentInstance().page
      //     )
      //     console.log('handleCreatePoster-getPoster:poster:resolve', poster)
      //     resolve(poster)
      //   }catch(err){
      //     console.log('handleCreatePoster-getPoster:poster:reject', err)
      //     reject(err)
      //   }
      // })
      try {
        const { tempFilePath: poster } = await Taro.canvasToTempFilePath(
          {
            x: 0,
            y: 0,
            width: pxWidth,
            height: pxHeight,
            canvasId: eleId,
            canvas: ctx
          },
          Taro.getCurrentInstance().page
        )
        canvas.toDataURL("image/png")
        console.log('handleCreatePoster-getPoster:poster:resolve', poster)
        resolve(poster)
      } catch (err) {
        console.log('handleCreatePoster-getPoster:poster:reject', err)
        reject(err)
      }
      console.log('handleCreatePoster-getPoster:end')
    })
  }

  const saveToAlbum = () => {
    authSetting(
      'writePhotosAlbum',
      () => {
        savePoster()
      },
      () => {
        showToast('请设置允许保存到相册')
      }
    )
  }

  const savePoster = () => {
    Taro.saveImageToPhotosAlbum({
      filePath: poster
    })
      .then((res) => {
        showToast('保存成功')
      })
      .catch((res) => {
        showToast('保存失败')
      })
  }

  // const onCanvasReady = () => {
  //   console.log('onCanvasReady2222')
  //   // 通过 SelectorQuery 获取 Canvas 实例
  //   Taro.createSelectorQuery().select('#canvas1').node().exec((res) => {
  //     console.log('canvas1:Res', res)
  //       const canvas = res[0].node;
  //       const ctx = canvas.getContext('2d');
  //       console.log('canvas 宽高', canvas.width, canvas.height)
  //       // 开始绘画
  //       ctx.fillRect(0, 0, 50, 50);
  //   });
  // }
  return (
    <View className={classNames('sp-poster')}>
      2333
      {/* <Canvas id="canvas1" type="2d" onReady={onCanvasReady} /> */}
      <View className='share-panel__overlay'></View>
      {poster && (
        <View className='share-panel__poster'>
          <View className='poster-container'>
            <Image className='poster' src={poster} mode='widthFix' />
          </View>
          <View className='poster-ft'>
            <Text className='iconfont icon-guanbi' onClick={onClose}></Text>
            <View className='poster-save' onClick={saveToAlbum}>
              <Text className='iconfont icon-download'></Text>
              保存图片
            </View>
          </View>
        </View>
      )}
      <Canvas
        className='canvasbox'
        type='2d'
        id='poster-canvas'
        canvasId='poster-canvas'
        style={`width:${pxWidth}px; height:${pxHeight}px;`}
        onReady={handleCreatePoster2}
      />
      666
    </View>
  )
}

export default SpPoster
