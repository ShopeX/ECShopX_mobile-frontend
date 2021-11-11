
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { NavBar, SpHtmlContent } from '@/components'
import { withPager } from '@/hocs'
import api from '@/api'

import './reg.scss'

@withPager
export default class RegRule extends Component {
  constructor (props) {
    super(props)

    this.state = {
      info: null
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
    let data = ''
    let navBarTitle = '协议'
    const { type } = this.$router.params
    Taro.showLoading()
    if (type === '1') {
      // 充值协议
      const { content, title = '充值协议' } = await api.member.depositPayRule()
      data = content
      navBarTitle = title
    } else if (type === 'privacyAndregister') { // 隐私和注册协议
      const { content: registerContent, title: registerTitle } = await api.shop.getRuleInfo({ type: 'member_register' })
      const { content: privacyContent, title: privactTitle } = await api.shop.getRuleInfo({ type: 'privacy' })
      data = registerContent + privacyContent
      navBarTitle = `${registerTitle}和${privactTitle}`
    } else if (type) {
      // 隐私政策
      const { content, title = '充值协议' } = await api.shop.getRuleInfo({
        type
      })
      data = content
      navBarTitle = title
    } else {
      // 注册协议
      const { content, title = '注册协议' } = await api.user.regRule()
      data = content
      navBarTitle = title
    }
    Taro.hideLoading()
    Taro.setNavigationBarTitle({
      title: navBarTitle
    })
    this.setState({
      info: data,
      title: navBarTitle
    })
  }


  render () {
    const { info, title } = this.state

    return (
      <View className='page-member-integral'>
        <NavBar
          title={title}
          leftIconType='chevron-left'
        />
        {
          info &&
            <SpHtmlContent
              className='pay-rule-style'
              content={info}
            />
        }
      </View>
    )
  }
}
