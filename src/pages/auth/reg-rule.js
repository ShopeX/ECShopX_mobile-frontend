
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
    const { type } = this.$router.params
    if (type) {
      this.topUpRule()
    } else {
      this.fetch()
    }
  }

  async fetch () {
    const { content } = await api.user.regRule()
    this.setState({
      info: content
    })
    console.log(content)
  }

  // 充值协议
  async topUpRule () {
    const { content } = await api.member.depositPayRule()
    this.setState({
      info: content
    })
  }

  render () {
    const { info } = this.state
    const { type } = this.$router.params

    return (
      <View className='page-member-integral'>
        <NavBar
          title={`${type === '1' ? '充值协议' : '注册协议'}`}
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
