import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtButton } from 'taro-ui'
import S from '@/spx'
import api from '@/api'
import { showToast, classNames, navigateTo } from '@/utils'
import qs from 'qs';
import './index.scss'

// @connect(
//   () => ( {} ),
//   dispatch => ( {
//     setMemberInfo: memberInfo =>
//       dispatch( { type: "member/init", payload: memberInfo } )
//   } )
// )

function SpLogin(props) {
  const { className, children, size = 'normal', circle = false, onChange } = this.props
  const isLogin = S.getAuthToken()

  /**
   *
   */

  const handleOnChange = () => {
    onChange && onChange()
  }

  /**
   *
   */
  const handleOAuthLogin = () => { 
    const { path,params} = this.$router 
    let pathC=`${path}?${qs.stringify(params)}`
    let url=`/subpage/pages/auth/login?redirect=${encodeURIComponent(pathC)}`
  
    Taro.navigateTo({
      url
    })
  }

  return (
    <View
      className={classNames(
        {
          'sp-login': true
        },
        className
      )}
    >
      {isLogin && children}
      {!isLogin && (
        <AtButton
          className='login-btn'
          type='primary'
          size={size}
          circle={circle}
          onClick={handleOAuthLogin}
        >
          {children}
        </AtButton>
      )}
    </View>
  )
}

export default SpLogin
