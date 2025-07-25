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
