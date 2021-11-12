/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /unite-vshop/src/others/pages/echat/index.js
 * @Date: 2020-11-17 15:49:21
 * @LastEditors: Arvin
 * @LastEditTime: 2020-11-17 16:08:22
 */
import Taro, { Component } from '@tarojs/taro'
import { WebView } from '@tarojs/components'

export default class MeiQia extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {}

  handleClose = () => {
    Taro.navigateBack()
  }

  render() {
    const echat = Taro.getStorageSync('echat')

    return echat && echat.echat_url && <WebView src={echat.echat_url}></WebView>
  }
}
