import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text, Image, Button, Canvas } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { useAsyncCallback } from '@/hooks'
import { classNames, authSetting, showToast } from '@/utils'
import GoodsDetailPoster from './dw-goodsdetail'

import './index.scss'

const initialState = {
  poster: null,
  pxWidth: 200,
  pxHeight: 200,
  factor: 1,
  eleId: 'poster-canvas',
  ctx: null
}

function SpPoster (props) {
  const { info, type, onClose = () => {} } = props
  const { userInfo } = useSelector((state) => state.user)
  const [state, setState] = useAsyncCallback(initialState)

  const { poster, pxWidth, pxHeight, eleId, ctx } = state

  useEffect(() => {
    handleCreatePoster()
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
        const { canvasWidth, canvasHeight } = canvasObj.getCanvasSize()

        setState(
          (draft) => {
            draft.pxWidth = canvasWidth
            draft.pxHeight = canvasHeight
            draft.ctx = ctx
          },
          async (_state) => {
            await canvasObj.drawPoster()
            const poster = await getPoster(_state)
            Taro.hideLoading()
            setState((draft) => {
              draft.poster = poster
            })
          }
        )
        break
      default:
        break
    }
  }

  const getPoster = ({ ctx, pxWidth, pxHeight, eleId }) => {
    return new Promise((resolve, reject) => {
      ctx.draw(false, async () => {
        const { tempFilePath: poster } = await Taro.canvasToTempFilePath(
          {
            x: 0,
            y: 0,
            width: pxWidth,
            height: pxHeight,
            canvasId: eleId
          },
          Taro.getCurrentInstance().page
        )
        resolve(poster)
      })
    })
  }

  const saveToAlbum = () => {
    debugger
    authSetting(
      'writePhotosAlbum',
      () => {
        debugger
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

  return (
    <View className={classNames('sp-poster')}>
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
        canvasId='poster-canvas'
        style={`width:${pxWidth}px; height:${pxHeight}px;`}
      />
    </View>
  )
}

export default SpPoster
