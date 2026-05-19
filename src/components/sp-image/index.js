/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useMemo } from 'react'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { classNames, isBase64 } from '@/utils'
import './index.scss'

function getDiskDriver() {
  try {
    return Taro.getStorageSync('otherSetting')?.disk_driver || 'qiniu'
  } catch {
    return 'qiniu'
  }
}

/** 仅质量 + WebP，不缩放；需与 otherSetting.disk_driver 一致，否则 CDN 400 */
function appendImageProcess(url, { quality, ossWebp }) {
  if (
    url.indexOf('x-oss-process') >= 0 ||
    url.indexOf('imageView2') >= 0 ||
    url.indexOf('imageMogr2') >= 0
  ) {
    return url
  }
  const q = quality != null ? quality : 80
  const sep = url.indexOf('?') >= 0 ? '&' : '?'
  const disk = getDiskDriver()

  if (disk === 'oss') {
    const ossParams = [`quality,Q_${q}`]
    if (ossWebp !== false) {
      ossParams.push('format,webp')
    }
    return `${url}${sep}x-oss-process=image/${ossParams.join('/')}`
  }

  if (disk === 'qiniu') {
    let fop = `imageMogr2/quality/${q}`
    if (ossWebp !== false) {
      fop += '/format/webp'
    }
    return `${url}${sep}${fop}`
  }

  return url
}

function SpImage(props) {
  // 状态管理：加载成功/失败状态
  const [state, setState] = useImmer({
    loadSuccess: false,
    isError: false
  })

  // 计算最终图片URL（关键：避免OSS参数乱序导致重复请求）
  const imgUrl = useMemo(() => {
    let url
    let isOssUrl = false

    // 优先使用本地/网络绝对路径或Base64
    if (props.src) {
      if (isBase64(props.src)) {
        return props.src
      }
      if (/^http/.test(props.src)) {
        url = props.src
        isOssUrl = props.isOss
      }
    }

    if (url === undefined) {
      const base =
        typeof process !== 'undefined' && process.env ? process.env.APP_IMAGE_CDN : ''
      url = `${base}/${props.src || 'default_img.png'}`
      isOssUrl = props.isOss
    }

    // 与 sp-img 一致：仅当前存储为 oss/qiniu 时追加处理参数（七牛 URL 拼 x-oss-process 会 400）
    if (!isBase64(url) && isOssUrl) {
      url = appendImageProcess(url, {
        quality: props.quality,
        ossWebp: props.ossWebp
      })
    }

    return url
  }, [props.src, props.isOss, props.quality, props.ossWebp])

  // 计算容器高度（基于宽高比）
  const containerHeight = useMemo(() => {
    if (props.ratio?.length === 2) {
      const [wRatio, hRatio] = props.ratio
      return (props.width * hRatio) / wRatio
    }
    return props.height
  }, [props.ratio, props.width, props.height])

  // 容器样式（确保尺寸稳定，避免布局抖动）
  const containerStyle = useMemo(() => {
    const style = {}
    if (props.width) style.width = Taro.pxTransform(props.width)
    if (containerHeight) style.height = Taro.pxTransform(containerHeight)
    return style
  }, [props.width, containerHeight])

  // 图片加载成功回调
  const handleLoad = (e) => {
    props.onLoad?.(e)
    setState((draft) => {
      draft.loadSuccess = true
      draft.isError = false
    })
  }

  // 图片加载失败回调
  const handleError = (e) => {
    props.onError?.(e)
    setState((draft) => {
      draft.loadSuccess = false
      draft.isError = true
    })
  }

  // 最终渲染的样式（合并基础样式和用户自定义样式）
  const imageStyle = useMemo(
    () => ({
      ...computedStyle(props), // 基础尺寸/圆角样式
      ...props.style, // 用户自定义样式
      borderRadius: Taro.pxTransform(props.circle || props.radius) // 圆角优先级：circle > radius
    }),
    [props.width, props.height, props.radius, props.style, props.circle]
  )

  return (
    <View
      className={classNames('sp-image-container sp-image', props.className)}
      style={{ ...containerStyle, ...props.style }}
    >
      {/* 加载占位区域（加载完成后淡出，与图片淡入过渡衔接） */}
      <View
        className={classNames('sp-image-placeholder', {
          'sp-image-placeholder--hidden': state.loadSuccess
        })}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: Taro.pxTransform(props.circle || props.radius),
          backgroundColor: props.placeholderColor
        }}
      />

      {/* 实际图片组件（加载完成后淡入） */}
      <Image
        className={classNames('sp-image-content', {
          'sp-image--loaded': state.loadSuccess
        })}
        src={imgUrl}
        mode={props.mode || 'widthFix'}
        onLoad={handleLoad}
        onError={handleError}
        showMenuByLongpress={props.isShowMenuByLongpress ?? true}
        onClick={props.onClick}
        lazyLoad={props.lazyLoad ?? false}
        style={imageStyle}
      />
    </View>
  )
}

// 计算基础尺寸样式（宽高/圆角）
const computedStyle = (props) => {
  const style = {}
  if (props.width) style.width = Taro.pxTransform(props.width)
  if (props.height) style.height = Taro.pxTransform(props.height)
  if (props.radius) style.borderRadius = Taro.pxTransform(props.radius)
  return style
}

SpImage.options = {
  addGlobalClass: true
}

SpImage.defaultProps = {
  radius: 0,
  className: '',
  circle: false,
  height: '',
  lazyLoad: false,
  isOss: true,
  isShowMenuByLongpress: true,
  mode: 'widthFix',
  ratio: [],
  src: '',
  width: '',
  quality: 80, // OSS 质量 1–100
  ossWebp: true, // 输出 WebP 减小体积，设为 false 可关闭
  placeholderColor: 'transparent',
  onClick: () => {},
  onError: () => {},
  onLoad: () => {}
}

export default React.memo(SpImage)
