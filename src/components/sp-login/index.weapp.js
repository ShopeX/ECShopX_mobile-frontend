import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtButton } from 'taro-ui'
import S from '@/spx'
import api from '@/api'
import { isWeixin, isAlipay, classNames, tokenParse } from '@/utils'
import { Tracker } from '@/service'
import { PrivacyConfirmModal } from '@/components'

import './index.scss'

@connect(
  () => ({}),
  (dispatch) => ({
    setMemberInfo: (memberInfo) => dispatch({ type: 'member/init', payload: memberInfo })
  })
)
export default class SpLogin extends Component {
  static options = {
    addGlobalClass: true
  }

  constructor (props) {
    super(props)
    this.state = {
      token: S.getAuthToken(),
      privacyVisible: false,
      update_time: null
    }
  }

  componentWillMount () {
    this.onGetTimes()
  }

  onGetTimes = async () => {
    const { update_time } = await api.wx.getPrivacyTime()
    this.setState({ update_time })
  }

  /** 设置导购id */
  setSalespersonId = (params) => {
    // 导购id
    const salesperson_id = Taro.getStorageSync('s_smid')
    if (salesperson_id) {
      params.distributor_id = Taro.getStorageSync('s_dtid')
      params.salesperson_id = salesperson_id
    }
  }

  afterNewLogin = async ({ token, work_userid }) => {
    if (token) {
      S.setAuthToken(token)
      if (work_userid) {
        api.user.uniquevisito({
          work_userid: work_userid
        })
        const gu_user_id = Taro.getStorageSync('gu_user_id')
        if (gu_user_id) {
          api.user.bindSaleperson({
            work_userid: work_userid
          })
        }
      }

      // 通过token解析openid
      if (isWeixin) {
        const { user_id, openid, unionid } = tokenParse(token)
        Tracker.setVar({
          user_id: user_id,
          open_id: openid,
          union_id: unionid
        })
      }

      await S.getMemberInfo()
      // const memberInfo = await api.member.memberInfo();
      // this.props.setMemberInfo( memberInfo )

      this.setState({
        token
      })

      const { switch_first_auth_force_validation } = await api.user.getIsMustOauth({
        module_type: 1
      })
      if (switch_first_auth_force_validation == 1) {
        Taro.navigateTo({
          url: '/marketing/pages/member/userinfo'
        })
      }
      this.props.onChange && this.props.onChange()
    }
  }

  wexinBindPhone = async (e) => {
    const { encryptedData, iv, cloudID } = e.detail

    if (encryptedData && iv) {
      // 推广用户uid
      const uid = Taro.getStorageSync('distribution_shop_id')
      const trackParams = Taro.getStorageSync('trackParams')

      // 新导购信息处理
      const work_userid = Taro.getStorageSync('work_userid')
      const { code } = await Taro.login()
      const params = {
        code,
        encryptedData,
        iv,
        cloudID,
        user_type: 'wechat',
        auth_type: 'wxapp'
      }

      this.setSalespersonId(params)

      if (work_userid) {
        params.channel = 1
        params.work_userid = work_userid
      }

      if (trackParams) {
        params.source_id = trackParams.source_id
        params.monitor_id = trackParams.monitor_id
      }

      if (uid) {
        params.inviter_id = uid
        params.uid = uid
      }

      const { token, is_new } = await api.wx.newlogin(params)
      this.afterNewLogin({ token, work_userid })
    }
  }

  alipayBindPhone = async (e) => {
    const extConfig = Taro.getExtConfigSync ? Taro.getExtConfigSync() : {}
    console.log('--alipayBindPhone--', extConfig)
    my.getPhoneNumber({
      protocols: {
        // 小程序模板所属的三方应用appId
        isvAppId: extConfig.ali_isvid
      },
      success: async (res) => {
        const encryptedData = res.response
        const { authCode } = await my.getAuthCode({ scopes: ['auth_base'] })
        const params = {
          encryptedData,
          code: authCode
        }
        this.setSalespersonId(params)
        const { token } = await api.alipay.newlogin(params)
        this.afterNewLogin({ token, work_userid: '' })
      },
      fail: (res) => {
        console.log(res)
        console.log('getPhoneNumber_fail')
      }
    })
  }

  async handleBindPhone (e) {
    if (isWeixin) {
      this.wexinBindPhone(e)
    } else if (isAlipay) {
      this.alipayBindPhone(e)
    }
  }

  handleOnChange () {
    this.props.onChange && this.props.onChange()
  }

  onPrivateChange = async (type, e) => {
    if (type == 'agree' && e) {
      this.wexinBindPhone(e)
    }
    if (type === 'reject') {
      Taro.removeStorageSync('PrivacyUpdate_time')
    }
    this.setState({ privacyVisible: false })
  }

  onClickChange = () => {
    this.setState({ privacyVisible: true })
  }

  render () {
    const { token, privacyVisible, update_time } = this.state
    let pritecy_time = Taro.getStorageSync('PrivacyUpdate_time')
    let policy = true
    console.log(pritecy_time, update_time, '-----')
    if (!pritecy_time || pritecy_time != update_time) {
      policy = false
    }
    return (
      <View className={classNames('sp-login', this.props.className)}>
        {token && <View onClick={this.handleOnChange.bind(this)}>{this.props.children}</View>}

        {!token && policy && isWeixin && (
          <AtButton
            className='login-btn'
            openType='getPhoneNumber'
            onGetPhoneNumber={this.handleBindPhone.bind(this)}
          >
            {this.props.children}
          </AtButton>
        )}

        {!token && !policy && isWeixin && (
          <View onClick={this.onClickChange.bind(this)}>{this.props.children}</View>
        )}

        {!token && isAlipay && (
          <Button
            className='login-btn ali-button'
            onGetAuthorize={this.handleBindPhone}
            openType='getAuthorize'
            scope='phoneNumber'
          >
            {this.props.children}
          </Button>
        )}

        <PrivacyConfirmModal
          isPhone={privacyVisible}
          visible={privacyVisible}
          onChange={this.onPrivateChange}
        />
      </View>
    )
  }
}
