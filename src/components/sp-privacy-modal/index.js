import Taro, { useState, useEffect } from '@tarojs/taro'
import { View, Image, Button, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpImage } from '@/components'
import api from '@/api'
import { classNames, styleNames } from '@/utils'

import './index.scss'

const initState = {
  logo: '',
  member_register: '',
  privacy: ''
}

function SpPrivacyModal(props) {
  const { open = false, onCancel = () => {}, onConfirm = () => {} } = props
  const [info, setInfo] = useState(initState)
  useEffect(async () => {
    const { logo, protocol } = await api.shop.getStoreBaseInfo()
    const { member_register, privacy } = protocol

    setInfo({
      logo,
      member_register,
      privacy
    })
    
  }, [])

  const handleConfirm = () => {
    onConfirm()
  }

  const handleCancel = () => {
    onCancel()
  }

  return (
    <View
      className={classNames('sp-privacy-modal', {
        'is-hide': !open
      })}
    >
      <View
        className='modal-container'
        style={styleNames({
          'background-image': `url(${process.env.APP_IMAGE_CDN}/bg.png)`
        })}
      >
        <View className='modal-hd'>
          <SpImage src='privacy_tips.png' width='40' />
          <Text className='title'>个人隐私保护指引</Text>
        </View>
        <View className='modal-bd'>
          <Text>
            请您务必谨慎阅读，充分理解“用户协议”和“隐私政策”各条款。包括但不限于：为了向您提供更好的服务，我们须向您收集相关的个人信息。您可以在“个人信息”中查看、变更、删除、个人授权信息。您可阅读
          </Text>
          <Text className='policy-txt'>《{info.member_register}》</Text>、
          <Text className='policy-txt'>《{info.privacy}》</Text>
          <Text>了解详细信息。如您同意，请点击”同意“开始接受我们的服务。</Text>
        </View>
        <View className='modal-ft'>
          <View className='btn-wrap'>
            <AtButton onClick={handleCancel}>拒绝</AtButton>
          </View>
          <View className='btn-wrap'>
            <AtButton type='primary' onClick={handleConfirm}>
              同意
            </AtButton>
          </View>
        </View>
      </View>
    </View>
  )
}

SpPrivacyModal.options = {
  addGlobalClass: true
}

export default SpPrivacyModal
