/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /unite-vshop/src/components/float-menus/meiqia.h5.js
 * @Date: 2020-04-20 16:57:55
 * @LastEditors: Arvin
 * @LastEditTime: 2020-11-17 16:18:22
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { Tracker } from "@/service";
import './item.scss'

export default class Index extends Component {

  static defaultProps = {
    storeId: '',
    info: {},
    isFloat: true
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
      const { enterprise_id, group_id, persion_ids } = meiqia
      const info = Taro.getStorageSync('curStore')
      let id = info.distributor_id
      const { storeId } = this.props
      // 如果不是标准版
      if (APP_PLATFORM !== 'standard' && (storeId || storeId === 0)) {
        id = storeId
      }
      console.log(id)
      if (enterprise_id) {
        this.setState({
          meiqia_id: enterprise_id,
          meiqia_token: persion_ids,
          groupid: group_id
        })
        // if (type) {        
        //   const { meiqia_id, meiqia_token, clientid = '', groupid = '' } = await api.user.im(id)
        //   this.setState({
        //     meiqia_id,
        //     meiqia_token,
        //     clientid,
        //     groupid
        //   })
        // } else {
        //   this.setState({
        //     meiqia_id: enterprise_id,
        //     meiqia_token: persion_ids,
        //     groupid: group_id
        //   })
        // }
      }      
    }
  }

  static options = {
    addGlobalClass: true
  }

  meiqiaInit = () => {
    const meiqiajs = document.getElementById('meiqiajs')
    if (!meiqiajs) {
      try {
        (function (m, ei, q, i, a, j, s) {
          m[i] = m[i] || function () {
            (m[i].a = m[i].a || []).push(arguments)
          };
          j = ei.createElement(q),
            s = ei.getElementsByTagName(q)[0];
          j.async = true;
          j.charset = 'UTF-8';
          j.id = 'meiqiajs';
          j.src = 'https://static.meiqia.com/dist/meiqia.js?_=t';
          s.parentNode.insertBefore(j, s);
        })(window, document, 'script', '_MEIQIA');
      } catch (err) {
        console.log(err)
      }
    }
  }


  // 美恰客服
  contactMeiQia = async () => {
    const { meiqia_id, meiqia_token, clientid, groupid } = this.state
    const userInfo = Taro.getStorageSync('userinfo') || {}
    const metadata = {
      ...this.props.info,
      userId: userInfo.userId || '',
      userName: userInfo.username || '',
      mobile: userInfo.mobile || ''
    }
    Tracker.dispatch("START_CONSULT", { type: 'meiqia' });
    this.meiqiaInit()
    if (_MEIQIA) {
      // 设置企业id
      if (meiqia_id) {
        _MEIQIA('entId', meiqia_id)
      }
      _MEIQIA('withoutBtn')
      // 无客服模式
      _MEIQIA('fallback', 1)
      try {
        _MEIQIA('init')
      } catch (err) {
        console.log(err)
      }
      if (clientid) {
        _MEIQIA('clientId', clientid)
      }
      _MEIQIA('metadata', metadata)
      if (meiqia_token || groupid) {
        _MEIQIA('assign', {
          agentToken: meiqia_token || null,
          groupToken: groupid || null
        })
      }
      _MEIQIA('showPanel')
    }
  }


  render() {
    const { isFloat } = this.props
    const { meiqia_id } = this.state
    return (
      meiqia_id ? <View>
        {
          isFloat ? <Button
            className='float-menu__item'
            onClick={this.contactMeiQia.bind(this)}
          >
            <View className='icon icon-headphones'></View>
          </Button>
          : <View onClick={this.contactMeiQia.bind(this)} className='refund-detail-btn'>
            { this.props.children }
          </View>
        }
      </View> : ''
    )
  }
}
