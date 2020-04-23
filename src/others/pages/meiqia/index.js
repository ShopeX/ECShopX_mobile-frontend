/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 美恰客服接入
 * @FilePath: /unite-vshop/src/others/pages/meiqia/index.js
 * @Date: 2020-04-20 10:54:05
 * @LastEditors: Arvin
 * @LastEditTime: 2020-04-23 14:46:35
 */

import Taro, { Component } from '@tarojs/taro'
import { WebView } from '@tarojs/components'

export default class MeiQia extends Component {
  constructor (props) {
    super(props)
    this.state = {
      metadata: '',
      clientid: '',
      agentid: ''
    }
  }

  componentDidMount () {
    const that = this
    const eventChannel = that.$scope.getOpenerEventChannel()
    eventChannel.emit('acceptDataFromOpenedPage', { data2: 'test',dd:'55' })
    eventChannel.emit('someEvent', { data: 'test' })
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      that.setState({
        agentid: data.agentid,
        metadata: data.metadata,
        clientid: data.clientid
      })
    })
  }
  
  render () {
    const {metadata, clientid, agentid} = this.state
    return (
      // <WebView src={`http://localhost:10086/others/pages/meiqia/index?metadata=${metadata}&clientid=${clientid}&agentid=${agentid}`}></WebView>
      <WebView src={`http://ecshopx-wap.shopex123.com/others/pages/meiqia/index?metadata=${metadata}&clientid=${clientid}&agentid=${agentid}`}></WebView>
      )
  }
}