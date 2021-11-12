import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { SpCheckbox } from '@/components'
import req from '@/api/req'
import DestoryConfirm from './comps/destory-comfirm-modal'
import './destroy-member.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
export default class SettingIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checked: false,
      visible: false,
      title: '',
      content: '',
      confirmBtnContent: '',
      cancelBtnContent: ''
    }
  }

  config = {
    navigationBarTitleText: '注销账号',
    navigationBarBackgroundColor: '#F5F5F5'
  }

  handleSelect = () => {
    this.setState({
      checked: !this.state.checked
    })
  }

  handleNextStep = (checked) => {
    if (checked) {
      console.log('下一步弹框')
      this.setState({
        visible: true,
        title: '注销账户',
        content: '请确保您已充分了解账号注销的风险，并认可账号注销协议。',
        confirmBtnContent: '放弃注销继续使用',
        cancelBtnContent: '确认注销账号'
      })
    } else {
      Taro.showToast({ title: '请勾选《用户注销协议》', icon: 'none' })
    }
  }

  handCancel = (parmas) => {
    if (parmas === 'cancel') {
      // 确认注销账号
      req.delete('/member', { is_delete: '1' }).then((res) => {
        if (res.status) {
          Taro.removeStorageSync('auth_token')
          Taro.removeStorageSync('PrivacyUpdate_time')
          Taro.reLaunch({
            url: '/pages/index'
          })
        }
      })
    }
    this.setState({ visible: false })
  }

  render() {
    const { checked, visible, content, title, cancelBtnContent, confirmBtnContent } = this.state
    const { colors } = this.props
    return (
      <View className='destory-member'>
        <View className='title'>将{this.$router.params.phone}的账号注销</View>
        <View className='content'>
          <View className='margin fonts'>
            账号注销后，你在相关产品/服务留存的的信息将被清空且无法找回，具体包括：
          </View>
          <View className='fonts'>· 个人资料、实名认证等身份信息。</View>
          <View className='fonts'>· 各产品/服务的会员及权益（积分，可提现佣金等）信息。</View>
          <View className='fonts'>· 业务订单和交易信息。</View>
          <View className='fonts'>· 您在使用各产品、服务时留存的其他信息。</View>
          <View className='fonts'>· 以及《用户注销协议》中包含的所有信息。</View>
          <View className='bottom fonts'>
            请确保所有交易已完结且无纠纷，账号删除后的历史交易可能产生的资金退回权益等将视作自动放弃。
          </View>
        </View>
        <View
          className='button'
          style={`background: ${colors.data[0].primary}`}
          onClick={this.handleNextStep.bind(this, checked)}
        >
          下一步
        </View>
        <View className='check-box'>
          <SpCheckbox checked={checked} colors={colors} onChange={this.handleSelect.bind(this)} />
          <View>
            阅读并同意
            <Text
              onClick={() =>
                Taro.navigateTo({ url: '/subpage/pages/auth/reg-rule?type=member_logout' })
              }
              style={`color: ${colors.data[0].primary}`}
            >
              《用户注销协议》
            </Text>
          </View>
        </View>
        <DestoryConfirm
          visible={visible}
          content={content}
          title={title}
          cancelBtn={cancelBtnContent}
          confirmBtn={confirmBtnContent}
          onCancel={this.handCancel}
        />
      </View>
    )
  }
}
