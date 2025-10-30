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
import { useRef } from 'react'
import Taro from '@tarojs/taro'
import { render, unmountComponentAtNode } from '@tarojs/react'
import { SpModal } from '@/components'

const useModal = () => {
  const dom = useRef()
  const showModal = (props) => {
    return new Promise((resolve, reject) => {
      if (!dom.current) {
        const view = document.createElement('view')
        const pages = Taro.getCurrentPages()
        const currentPage = pages[pages.length - 1] // 获取当前页面对象
        const path = currentPage.$taroPath
        const pageElement = document.getElementById(path)

        render(
          <SpModal
            {...props}
            visible
            onCancel={() => {
              resolve({ confirm: false })
              closeModal()
            }}
            onConfirm={() => {
              resolve({ confirm: true })
              closeModal()
            }}
          />,
          view
        )
        dom.current = view
        pageElement?.appendChild(view)
      }
    })
  }

  const closeModal = () => {
    dom.current.remove()
    dom.current = null
  }

  return {
    showModal,
    closeModal
  }
}

export default useModal
