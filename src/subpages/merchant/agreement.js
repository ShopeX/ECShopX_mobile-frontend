import Taro, { useRouter } from '@tarojs/taro'
import { ScrollView, View } from '@tarojs/components'
import { SpPage } from '@/components'
import { isWeb, classNames } from '@/utils'
import { useState, useEffect } from 'react'
import api from '@/api'
import { MNavBar } from './comps'
import './agreement.scss'

const Agreement = () => {
  const [content, setContent] = useState('')

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

  console.log('==isWeb==>', isWeb)

  return (
    <SpPage className={classNames('page-merchant-agreement')} navbar={false}>
      <MNavBar canLogout={false} />

      <ScrollView className='page-merchant-agreement-content'>
        <View className='title'>商家入驻协议</View>

        <View className='main' dangerouslySetInnerHTML={{ __html: content }} />
      </ScrollView>
    </SpPage>
  )
}

export default Agreement
