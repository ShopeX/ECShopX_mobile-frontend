import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpCell, NavBar } from '@/components'
import { goToPage } from '@/utils'
import { withLogin } from '@/hocs'
import S from '@/spx'

@withLogin()
export default class MemberSetting extends Component {

  handleClickSetting = () => {
    Taro.navigateTo({
      url: '/pages/member/userinfo'
    })
  }

  handleClickLogout = async () => {
    S.logout()
    if (process.env.TARO_ENV === 'h5') {
      // eslint-disable-next-line
      goToPage(APP_HOME_PAGE)
    } else {
      Taro.redirectTo({
        url: APP_HOME_PAGE
      })
    }
  }

  render () {
    return (
      <View class='page-member-setting'>
        <NavBar
          title='设置'
        />

        <View className='sec'>
          <SpCell title='用户设置' isLink onClick={this.handleClickSetting}> </SpCell>
          <SpCell title='版本' value={APP_VERSION}> </SpCell>
        </View>

        <View className='btns'>
          <AtButton
            type='primary'
            onClick={this.handleClickLogout}
          >退出登录</AtButton>
        </View>
      </View>
    )
  }
}
