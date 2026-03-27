/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { View, Text } from '@tarojs/components'
import { SpImage } from '@/components'
import { classNames } from '@/utils'
import ConsultModal from './consult-modal'

import './float-salesperson.scss'

/**
 * 悬浮导购组件
 * 用于 renderFloat，显示导购头像和名字，点击弹出联系顾问弹框
 * @param {string} layout - 布局方式：'vertical'（默认，上下布局）或 'horizontal'（左右布局）
 */
function FloatSalesperson({ layout = 'vertical' }) {
  const { salespersonInfo } = useSelector((state) => state.shop)
  const [showModal, setShowModal] = useState(false)

  // 无导购信息或无二维码不展示（show_float 用于控制小程序客服，不控制导购浮窗）
  // && !salespersonInfo?.work_qrcode_configid
  if (!salespersonInfo?.work_qrcode) {
    return null
  }

  const handleClick = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const modalData = {
    qrcodeUrl: salespersonInfo.work_qrcode,
    salespersonName: salespersonInfo.salesperson_name,
    salespersonAvatar: salespersonInfo.salesperson_avatar,
    bgAvatarUrl: salespersonInfo.bg_avatar_url
  }

  // 如果有 work_qrcode_configid，渲染 cell 组件
  // if (salespersonInfo?.work_qrcode_configid) {
  //   return (
  //     <View className='sp-float-salesperson-cell' style={{ marginBottom: '10rpx' }}>
  //       <cell plugid={salespersonInfo.work_qrcode_configid} styleType={2} />
  //     </View>
  //   )
  // }

  return (
    <>
      <View
        className={classNames('sp-float-salesperson', {
          'sp-float-salesperson--horizontal': layout === 'horizontal'
        })}
        onClick={handleClick}
      >
        <SpImage
          className='sp-float-salesperson__avatar'
          src={salespersonInfo.salesperson_avatar}
          width={60}
          height={60}
          mode='aspectFill'
        />
        <Text className='sp-float-salesperson__name'>{salespersonInfo.salesperson_common_name}</Text>
      </View>

      <ConsultModal
        visible={showModal}
        type='2'
        data={modalData}
        onClose={handleCloseModal}
      />
    </>
  )
}

export default FloatSalesperson
