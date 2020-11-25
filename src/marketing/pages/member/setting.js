/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /unite-vshop/src/marketing/pages/member/setting.js
 * @Date: 2020-03-25 16:31:52
 * @LastEditors: Arvin
 * @LastEditTime: 2020-07-14 18:01:19
 */
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpCell, NavBar } from '@/components'
import { goToPage } from '@/utils'
import { connect } from '@tarojs/redux'
import { withLogin } from '@/hocs'
import S from '@/spx'

@connect(() => ({}), (dispatch) => ({
  onUpdateCart: (list) => dispatch({ type: 'cart/update', payload: list }),
  onUpdateCartCount: (count) => dispatch({ type: 'cart/updateCount', payload: count }),
  onFetchFavs: (favs) => dispatch({ type: 'member/favs', payload: favs })
}))
@withLogin()
export default class MemberSetting extends Component {

  handleClickSetting = () => {
    Taro.navigateTo({
      url: '/marketing/pages/member/userinfo'
    })
  }

  handleClickLogout = async () => {
    S.logout()
    this.props.onFetchFavs([])
    this.props.onUpdateCart([])
    this.props.onUpdateCartCount(0)
    if (process.env.TARO_ENV === 'h5' && Taro.getEnv() !== 'SAPP') {
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
      <View className='page-member-setting'>
        <NavBar
          title='设置'
          fixed={false}
        />

        <View className='sec'>
          {/* <SpCell title='用户设置' isLink onClick={this.handleClickSetting}> </SpCell> */}
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
