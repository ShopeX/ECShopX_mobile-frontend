import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { Tracker } from '@/service'
import api from '@/api'
import './index.scss'

export default class Meiqia extends Component {
  static defaultProps = {
    storeId: '',
    info: {},
    isFloat: true
  }

  static options = {
    addGlobalClass: true
  }

  constructor(props) {
    super(props)

    this.state = {
      meiqia_id: '',
      meiqia_token: '',
      clientid: '',
      groupid: ''
    }
  }

  async componentDidMount() {
    const meiqia = Taro.getStorageSync('meiqia') || {}
    if (meiqia.is_open === 'true') {
      this.meiQiaInt()
    }
  }

  // 美洽初始化
  meiQiaInt = async () => {
    const info = Taro.getStorageSync('curStore')
    const meiqia = Taro.getStorageSync('meiqia') || {}
    const { enterprise_id, group_id, persion_ids, is_distributor_open } = meiqia
    let id = info.distributor_id
    const { storeId } = this.props
    // 如果不是标准版
    if (process.env.APP_PLATFORM !== 'standard' && (storeId || storeId === 0)) {
      id = storeId
    }

    if (is_distributor_open === 'true' && id !== 0) {
      const { meiqia_id, meiqia_token, clientid = '', groupid = '' } = await api.user.im(id)
      this.setState({
        meiqia_id,
        meiqia_token,
        clientid,
        groupid
      })
    } else {
      if (enterprise_id) {
        this.setState({
          meiqia_id: enterprise_id,
          meiqia_token: persion_ids,
          groupid: group_id
        })
      }
    }
  }

  // 美恰客服
  contactMeiQia = async () => {
    const meiqia = Taro.getStorageSync('meiqia') || {}
    if (meiqia.is_open === 'true') {
      const userInfo = Taro.getStorageSync('userinfo') || {}
      const metadata = {
        ...this.props.info,
        userId: userInfo.userId || '',
        userName: userInfo.username || '',
        mobile: userInfo.mobile || ''
      }
      const { meiqia_id, meiqia_token, clientid, groupid } = this.state
      Tracker.dispatch('START_CONSULT', { type: 'meiqia' })
      Taro.navigateTo({
        url: '/others/pages/meiqia/index',
        success: function(res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', {
            id: meiqia_id,
            agentid: meiqia_token,
            metadata: metadata,
            clientid,
            groupid
          })
        }
      })
    } else {
      Tracker.dispatch('START_CONSULT', { type: 'echat' })
      Taro.navigateTo({
        url: '/others/pages/echat/index'
      })
    }
  }

  render() {
    const { isFloat } = this.props
    const { meiqia_id } = this.state
    const echat = Taro.getStorageSync('echat')

    return meiqia_id || echat.is_open === 'true' ? (
      <View>
        {isFloat ? (
          <Button className='float-menu__item' onClick={this.contactMeiQia.bind(this)}>
            <View className='icon icon-headphones'></View>
          </Button>
        ) : (
          <View onClick={this.contactMeiQia.bind(this)} className='refund-detail-btn'>
            {this.props.children}
          </View>
        )}
      </View>
    ) : (
      ''
    )
  }
}
