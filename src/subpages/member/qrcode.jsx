import React, { useState, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import SpPage from '@/components/sp-page'
import SpImage from '@/components/sp-image'
import { useSelector } from 'react-redux'
import api from '@/api'
import { showToast, getMemberLevel, throttle } from '@/utils'
import './qrcode.scss'

const SpQrcode = () => {
  const [qrData, setQrData] = useState({
    qrcode: ''
  })
  const [gNavbarH, setGNavbarH] = useState(0)
  const [navigateMantle, setNavigateMantle] = useState(false)

  const userInfo = useSelector((state) => state.user.userInfo)
  const grade = userInfo?.gradeInfo?.grade_name || '6'

  useEffect(() => {
    fetchQrCodeData()
  }, [])

  const fetchQrCodeData = async (isShowToast = false) => {
    try {
      // 实际API调用
      const params = {
        content: userInfo?.user_card_code,
        code_type: 'CODE_TYPE_QRCODE'
      }
      const res = await api.groupBy.showMemberCode(params)
      if (res) {
        setQrData({
          qrcode: res.qrcode_url
        })
        if (isShowToast) {
          showToast('刷新成功')
        }
      }
    } catch (error) {
      console.error('获取二维码数据失败', error)
    }
  }

  const handleRefresh = () => {
    fetchQrCodeData(true)
  }

  const handleScroll = throttle(({ detail }) => {
    setNavigateMantle(detail.scrollTop > 20)
  }, 200)

  return (
    <SpPage
      className='sp-qrcode'
      navigationLeftBlockWidthFull
      immersive
      navigateMantle={navigateMantle}
      renderNavigation={
        <View className='sp-qrcode__navigation flex flex-1 justify-items-center items-center'>
          <Text className='sp-qrcode__navigation-text'>{grade}会员</Text>
        </View>
      }
      onReady={({ gNavbarH }) => {
        console.log('onReady', gNavbarH)
        setGNavbarH(gNavbarH)
      }}
    >
      <ScrollView scrollY style={{ height: '100%' }} onScroll={handleScroll}>
        <View className='sp-qrcode__body' style={{ paddingTop: `calc(44rpx + ${gNavbarH}px)` }}>
          <View className='sp-qrcode__container'>
            <View className='sp-qrcode__user-info'>
              <View className='sp-qrcode__avatar'>
                <SpImage
                  className='sp-qrcode__image'
                  src={userInfo?.avatar || 'fv_user.png'}
                  width={108}
                  height={108}
                />
              </View>
              <Text className='sp-qrcode__username'>{userInfo?.username}</Text>
            </View>
            <View className='sp-qrcode__qr-wrapper'>
              <SpImage src={qrData.qrcode} className='sp-qrcode__qr-img' />
              <Text className='sp-qrcode__member-id'>{userInfo?.user_card_code}</Text>
              <View className='sp-qrcode__tips'>
                <Text className='sp-qrcode__tips-text'>温馨提示：如商户无法识别二维码</Text>
                <View className='sp-qrcode__refresh' onClick={handleRefresh}>
                  <Text className='iconfont icon-a-iconautorenew'></Text>
                  <Text className='sp-qrcode__refresh-text'>您可以尝试刷新重试</Text>
                </View>
              </View>
            </View>
          </View>
          {userInfo?.gradeInfo?.description && (
            <View className='sp-qrcode__privileges'>
              <Text className='sp-qrcode__privileges-title'>等级权益</Text>
              <View className='sp-qrcode__privileges-list'>
                {userInfo?.gradeInfo?.description.split(/\n\n/)?.map((item, index) => (
                  <View key={index} className='sp-qrcode__privilege-item'>
                    <View className='sp-qrcode__privilege-item-index'>{index + 1}.</View>
                    <View className='sp-qrcode__privilege-item-text'>{item}</View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SpPage>
  )
}

export default SpQrcode
