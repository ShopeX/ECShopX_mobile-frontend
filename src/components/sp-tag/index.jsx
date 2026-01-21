import React from 'react'
import { View, Text } from '@tarojs/components'
import { classNames } from '@/utils'
import './index.scss'

/**
 * SpTag 标签组件
 *
 * @description 用于标记和分类的标签组件
 *
 * @property {string} [type='default'] - 标签类型，可选值：
 *   - default: 默认灰色标签
 *   - secondary: 次要标签
 *   - primary: 主色调标签
 *   - warning: 警告色标签
 *   - success: 成功色标签
 *   - danger: 危险色标签
 *   - info: 信息色标签
 * @property {string} [className=''] - 自定义类名
 * @property {string} [label=''] - 标签文本内容
 * @property {Object} [style={}] - 自定义样式对象
 * @property {string} [color] - 自定义文字颜色
 * @property {string} [backgroundColor] - 自定义背景颜色
 * @property {string} [borderColor] - 自定义边框颜色
 * @property {Function} [onClick=()=>{}] - 点击标签时的回调函数
 *
 * @example
 * // 基础用法
 * <SpTag label="标签" />
 *
 * // 不同类型
 * <SpTag type="primary" label="主要标签" />
 * <SpTag type="warning" label="警告标签" />
 * <SpTag type="success" label="成功标签" />
 * <SpTag type="danger" label="危险标签" />
 * <SpTag type="info" label="信息标签" />
 *
 * // 自定义样式
 * <SpTag
 *   label="自定义标签"
 *   color="#fff"
 *   backgroundColor="#8a2be2"
 *   borderColor="#8a2be2"
 * />
 */

const SpTag = (props, ref) => {
  const { type = 'default', className, style, color, backgroundColor, borderColor } = props

  const handleClick = (e) => {
    props.onClick(e)
  }

  const customStyle = {}
  if (color) customStyle.color = color
  if (backgroundColor) customStyle.backgroundColor = backgroundColor
  if (borderColor) customStyle.borderColor = borderColor

  return (
    <View
      ref={ref}
      className={classNames('sp-tag', `sp-tag--${type}`, className)}
      style={{ ...customStyle, ...style }}
      onClick={handleClick}
    >
      <Text className='sp-tag__text'>{props.label}</Text>
    </View>
  )
}

SpTag.options = {
  addGlobalClass: true
}

SpTag.defaultProps = {
  className: '',
  label: '',
  style: {},
  type: 'default',
  onClick: () => {}
}

export default SpTag
