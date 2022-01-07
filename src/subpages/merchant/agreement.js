import Taro, { useRouter } from '@tarojs/taro'
import { ScrollView, View, RichText } from '@tarojs/components'
import { SpPage } from '@/components'
import { isWeb, classNames, styleNames, getThemeStyle } from '@/utils'
import { useState, useEffect } from 'react'
import api from '@/api'
import { MNavBar } from './comps'
import './agreement.scss'

const Agreement = () => {
  const [content, setContent] = useState(0)

  const getContent = async () => {
    const { content } = await api.merchant.getSetting()
    setContent(content)
  }

  useEffect(() => {
    getContent()
  }, [])

  let nodes = [
    {
      name: 'div',
      attrs: {
        class: 'content'
      },
      children: [
        {
          type: 'text',
          text: content
        }
      ]
    }
  ]

  return (
    <SpPage className={classNames('page-merchant-agreement')} needNavbar={false}>
      <MNavBar canLogout={false} />

      <ScrollView className='page-merchant-agreement-content'>
        <View className='title'>商家入驻协议</View>

        {isWeb && <View className='main' dangerouslySetInnerHTML={{ __html: content }} />}
      </ScrollView>
    </SpPage>
  )
}

export default Agreement
