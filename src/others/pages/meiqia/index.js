/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 美恰客服接入
 * @FilePath: /unite-vshop/src/others/pages/meiqia/index.js
 * @Date: 2020-04-20 10:54:05
 * @LastEditors: Arvin
 * @LastEditTime: 2020-04-29 14:11:34
 */

import Taro, { Component } from '@tarojs/taro'
import { WebView } from '@tarojs/components'

export default class MeiQia extends Component {
  constructor (props) {
    super(props)
    this.state = {
      metadata: '',
      clientid: '',
      agentid: '',
      id: ''
    }
  }

  componentDidMount () {
    const that = this
    const eventChannel = that.$scope.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      let metadata = data.metadata
      if (metadata) {
        metadata = JSON.stringify(data.metadata)
      }
      that.setState({
        id: data.id || '',
        agentid: data.agentid || '',
        metadata: encodeURIComponent(metadata) || '',
        clientid: data.clientid || '',
        groupid: data.groupid || ''
      })
    })
  }

  handleClose = () => {
    Taro.navigateBack()
  }
  
  render () {
    const {metadata, clientid, agentid, id, groupid} = this.state
    return (
      id && <WebView src={`${APP_CUSTOM_SERVER}/others/pages/meiqia/index?metadata=${metadata}&clientid=${clientid}&agentid=${agentid}&id=${id}&groupid=${groupid}`}></WebView>
    )
  }
}