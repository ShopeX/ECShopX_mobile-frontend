import { useRef } from 'react'
import Taro from '@tarojs/taro'
import { render, unmountComponentAtNode } from '@tarojs/react'
import { View } from '@tarojs/components'
import { Provider } from 'react-redux'
import { SpLogin } from '@/components'
import configStore from '@/store'
import { useThemsColor } from '@/hooks'
import { styleNames } from '@/utils'

const useModalLogin = () => {
  const { themeColor } = useThemsColor()
  const dom = useRef()
  const { store } = configStore()

  const showLoinModal = (props) => {
    return new Promise((resolve, reject) => {
      if (!dom.current) {
        const view = document.createElement('view')
        const pages = Taro.getCurrentPages()
        const currentPage = pages[pages.length - 1] // 获取当前页面对象
        const path = currentPage.$taroPath
        const pageElement = document.getElementById(path)

        // 将 SpLogin 包装在 Provider 中
        render(
          <Provider store={store}>
            <View style={styleNames({ ...themeColor() })}>
              <SpLogin
                {...props}
                visible
                onChange={() => {
                  resolve()
                  closeModal()
                }}
                onClose={() => {
                  closeModal()
                  reject()
                }}
              />
            </View>
          </Provider>,
          view
        )
        dom.current = view
        pageElement?.appendChild(view)
      }
    })
  }

  const closeModal = () => {
    if (dom.current) {
      dom.current.remove()
      dom.current = null
    }
  }

  return {
    showLoinModal,
    closeModal
  }
}

export default useModalLogin
