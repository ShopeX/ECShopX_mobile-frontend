import React from 'react'
import { SpPage , SpLoading } from '@/components'
import { classNames } from '@/utils'
import './auth-loading.scss'

const AuthLoading = () => {
  return (
    <SpPage className={classNames('page-auth-loading')}>
      <SpLoading>加载中...</SpLoading>
    </SpPage>
  )
}

export default AuthLoading
