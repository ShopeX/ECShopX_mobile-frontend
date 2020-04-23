/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /unite-vshop/src/components/float-menus/meiqia.js
 * @Date: 2020-04-20 16:57:55
 * @LastEditors: Arvin
 * @LastEditTime: 2020-04-23 14:46:12
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'

import './item.scss'

export default class Index extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    onClick: null,
    iconPrefixClass: 'sp-icon',
    icon: '',
    openType: null,
    hide: false
  }

  // 美恰客服
  contactMeiQia = () => {
    Taro.navigateTo({
      url: '/others/pages/meiqia/index',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (data) {
          console.log(data)
        },
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { agentid: "", metadata: '%7b%22name%22%3a%22%e8%80%81%e7%8e%8b%22%2c%22tel%22%3a%2213888888888%22%2c%22address%22%3a%22%e6%b9%96%e5%8d%97%e9%95%bf%e6%b2%99%22%2c%22gender%22%3a%22%e7%94%b7%22%2c%22goodsName%22%3a%22%e5%8f%8c%e6%b0%af%e8%8a%ac%e9%85%b8%e9%92%a0%22%2c%22goodsNumber%22%3a%221112%22%2c%22goodsType%22%3a%22%e5%a4%84%e6%96%b9%e8%8d%af%22%2c%22target%22%3a%22%e5%8c%bb%e7%94%9f%22%7d', clientid:"123"})
      }
    });
  }
  

  render () {
  
    return (
      <Button
        className='float-menu__item'
        onClick={this.contactMeiQia}
      >
        <View className='icon icon-headphones'></View>
      </Button>
    )
  }
}
