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
      // 构造OSS路径（固定参数顺序避免URL重复）
      const base = process.env.APP_IMAGE_CDN
      url = `${base}/${props.src || 'default_img.png'}`
      isOssUrl = props.isOss
    }

    // OSS 图片处理：缩放 + 质量 + 格式（按固定顺序）；已有 x-oss-process 则不再追加
    if (!isBase64(url) && isOssUrl && url.indexOf('x-oss-process') === -1) {
      const ossParams = []
      if (props.width && props.height) {
        ossParams.push(`resize,m_fill,w_${props.width},h_${props.height}`)
      } else if (props.ossMaxWidth) {
        // 未指定宽高时限制最长边，避免大图原图（体积主要来源）
        ossParams.push(`resize,m_lfit,w_${props.ossMaxWidth}`)
      }
      const quality = props.quality != null ? props.quality : 80
      ossParams.push(`quality,q_${quality}`)
      // WebP 体积通常比 JPEG 小 25–35%，小程序/H5 均支持
      if (props.ossWebp !== false) {
        ossParams.push('format,webp')
      }
      const ossQuery = `x-oss-process=image/${ossParams.join('/')}`
      url += url.indexOf('?') >= 0 ? `&${ossQuery}` : `?${ossQuery}`
    }

    return url
  }, [props.src, props.isOss, props.width, props.height, props.quality, props.ossMaxWidth, props.ossWebp])

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
  ossMaxWidth: 750, // 未传 width/height 时限制最长边（px），避免大图原图
  ossWebp: true, // 输出 WebP 减小体积，设为 false 可关闭
  placeholderColor: 'transparent',
  onClick: () => { },
  onError: () => { },
  onLoad: () => { }
}

export default React.memo(SpImage)
