// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { hex2rgb } from '@/utils'
import { useSelector } from 'react-redux'

function useThemsColor() {
  const sys = useSelector((state) => state.sys)
  const { colorPrimary, colorMarketing, colorAccent, rgb } = sys

  const $instance = getCurrentInstance()

  const themeColor = () => {
    const { page, router } = $instance
    let res = router?.path

    // 使用对象来定义路由前缀和对应的主题色
    const prefixes = {
      '/subpages/delivery/': {
        primary: '#4980FF',
        marketing: '#4980FF',
        accent: '#4980FF'
      },
      '/subpages/salesman/': {
        primary: '#4980FF',
        marketing: '#4980FF',
        accent: '#4980FF'
      },
      '/subpages/dianwu/': {
        primary: '#4980FF',
        marketing: '#4980FF',
        accent: '#4980FF'
      }
    }

    // 使用正则表达式匹配路由前缀
    const regex =
      res.split('/').length >= 4 ? res.match(/(?:[^\/]*\/){2}([^\/]+)(?:\/|$)/)[0] : null

    // 检查是否找到匹配项
    const status = regex !== null && prefixes[regex]
    const newPrefixes = prefixes[regex]

    // 查找与给定路由匹配的主题
    const theme = {
      // 如果没有找到匹配项，则使用默认主题
      '--color-primary': status ? newPrefixes.primary : colorPrimary,
      '--color-marketing': status ? newPrefixes.marketing : colorMarketing,
      '--color-accent': status ? newPrefixes.accent : colorAccent,
      '--color-rgb': status ? hex2rgb(newPrefixes.primary).join(',') : rgb,
      '--color-dianwu-primary': '#4980FF',
      '--color-dianwu-rgb': hex2rgb('#4980FF').join(',')
    }
    return theme
  }

  return {
    themeColor
  }
}

export default useThemsColor
