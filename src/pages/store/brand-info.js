import React, { useEffect } from 'react'
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import { SpPage, SpLoading } from '@/components'
import { classNames } from '@/utils'
import api from '@/api'
import './brand-info.scss'

const PageBrandInfo = () => {
  const $instance = getCurrentInstance()
  const {
    params: { distributor_id }
  } = $instance.router

  useEffect(() => {
    console.log('===distributor_id==', distributor_id)
  }, [])

  return <SpPage className={classNames('page-store-brand')}></SpPage>
}

export default PageBrandInfo
