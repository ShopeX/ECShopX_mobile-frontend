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
    // 优先使用本地/网络绝对路径或Base64
    if (props.src) {
      if (/^http/.test(props.src) || isBase64(props.src)) {
        return props.src
      }
    }

    // 构造OSS路径（固定参数顺序避免URL重复）
    const base = process.env.APP_IMAGE_CDN
    let url = `${base}/${props.src || 'default_img.png'}`

    // OSS图片处理参数（按固定顺序拼接）
    if (!isBase64(url) && props.isOss && props.width && props.height) {
      const { width, height } = props
      // 按w/h顺序拼接参数（关键优化点）
      url += `?x-oss-process=image/resize,m_fill,w_${width},h_${height}`
    }

    return url
  }, [props.src, props.isOss, props.width, props.height])

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
      style={containerStyle}
    >
      {/* 加载占位区域（未加载时显示） */}
      {!state.loadSuccess && (
        <View
          className='sp-image-placeholder'
          style={{
            width: '100%',
            height: '100%',
            borderRadius: Taro.pxTransform(props.circle || props.radius),
            backgroundColor: props.placeholderColor
          }}
        ></View>
      )}

      {/* 实际图片组件 */}
      <Image
        className={classNames('sp-image-content', {
          'sp-image--loaded': state.loadSuccess // 加载成功标记
        })}
        src={imgUrl}
        mode={props.mode || 'widthFix'}
        onLoad={handleLoad}
        onError={handleError}
        showMenuByLongpress={props.isShowMenuByLongpress ?? true}
        onClick={props.onClick}
        lazyLoad={props.lazyLoad ?? false}
        style={{
          ...imageStyle,
          opacity: state.loadSuccess ? 1 : 0 // 关键：通过透明度过渡实现平滑显示
        }}
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
  placeholderColor: 'transparent',
  onClick: () => {},
  onError: () => {},
  onLoad: () => {}
}

export default React.memo(SpImage)
