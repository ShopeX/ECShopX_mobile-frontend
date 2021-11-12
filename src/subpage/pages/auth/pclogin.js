import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import api from '@/api'
import './pclogin.scss'

function parseUrlStr(urlStr) {
  var keyValuePairs = []
  if (urlStr) {
    for (var i = 0; i < urlStr.split('&').length; i++) {
      keyValuePairs[i] = urlStr.split('&')[i]
    }
  }
  var kvObj = []
  for (var j = 0; j < keyValuePairs.length; j++) {
    var tmp = keyValuePairs[j].split('=')
    kvObj[tmp[0]] = decodeURI(tmp[1])
  }
  return kvObj
}

export default class PcAuth extends Component {
  state = {
    checkStatus: false
  }

  async componentDidMount() {
    if (this.$router.params.scene) {
      const query = decodeURIComponent(this.$router.params.scene)
      const queryStr = decodeURIComponent(query)
      const res = parseUrlStr(queryStr)
      this.query = res
    }
    setTimeout(async () => {
      if (this.query) {
        const extConfig = Taro.getExtConfigSync ? Taro.getExtConfigSync() : {}
        const { code } = await Taro.login()
        let check_params = {
          code: code,
          appid: extConfig.appid,
          token: this.query.t
        }
        const { status } = await api.user.checkpclogin(check_params)
        this.setState({
          checkStatus: status
        })
      }
    }, 200)
  }

  handleLogin = async (val) => {
    const extConfig = Taro.getExtConfigSync ? Taro.getExtConfigSync() : {}

    try {
      if (this.state.checkStatus == true) {
        const login_code = await Taro.login()
        let params = {
          token: this.query.t,
          status: val,
          code: login_code.code,
          appid: extConfig.appid,
          company_id: this.query.cid
        }
        try {
          const login_res = await api.user.pclogin(params)
          if (login_res) {
            Taro.redirectTo({
              url: '/pages/index'
            })
          }
          console.log(login_res)
        } catch (e) {
          console.log(e)
        }
      } else {
        Taro.redirectTo({
          url: '/subpage/pages/auth/reg'
        })
      }
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    const extConfig = Taro.getExtConfigSync ? Taro.getExtConfigSync() : {}

    return (
      <View className='page-wxauth'>
        <View className='sec-auth'>
          <View className='icon-pc icon-style'></View>
          <View className='auth-title'>{extConfig.wxa_name}登录确认</View>
          <Text className='auth-hint'>请不要扫描来源不明的二维码</Text>
          <View className='auth-btns'>
            <AtButton type='primary' onClick={this.handleLogin.bind(this, 1)}>
              确认登录
            </AtButton>
            <AtButton className='back-btn' onClick={this.handleLogin.bind(this, 0)}>
              取消登录
            </AtButton>
          </View>
        </View>
      </View>
    )
  }
}
