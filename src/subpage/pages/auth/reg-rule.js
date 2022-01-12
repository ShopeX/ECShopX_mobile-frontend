import Taro, { useRouter } from '@tarojs/taro'
import { ScrollView, View } from '@tarojs/components'
import { SpPage } from '@/components'
import { classNames } from '@/utils'
import { useState, useEffect } from 'react'
import api from '@/api'
import './reg-rule.scss'

const PageRegRule = () => {
  const [content, setContent] = useState('')

  const getContent = async () => {
    const { content } = await await api.shop.getRuleInfo({
      type: 'member_register'
    })
    setContent(content)
  }

  useEffect(() => {
    getContent()
  }, [])

  return (
    <SpPage className={classNames('page-auth-reg-rule')}>
      <ScrollView className='page-auth-reg-rule-content'>
        <View className='main' dangerouslySetInnerHTML={{ __html: content }} />
      </ScrollView>
    </SpPage>
  )
}

export default PageRegRule
