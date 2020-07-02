/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 底部菜单栏
 * @FilePath: /feat-Unite-group-by/src/groupBy/component/navBar/index.js
 * @Date: 2020-04-29 17:00:48
 * @LastEditors: Arvin
 * @LastEditTime: 2020-04-29 18:14:35
 */
import Taro, { Component } from '@tarojs/taro'
import { AtTabBar } from 'taro-ui'

export default class NavBar extends Component {

  static defaultProps = {
    current: 0
  }

  constructor (props) {
    super(props)
  }

  handleTab = (current) => {
    const tabList = [
      '/groupBy/pages/home/index',
      '/groupBy/pages/cart/index'
    ]
    Taro.redirectTo({
      url: tabList[current]
    })
  }
  
  render () {
    const { current } = this.props
    return (
      <AtTabBar 
        fixed
        current={current}
        selectedColor='#ffd000'
        onClick={this.handleTab}
        backgroundColor='#fafafa'
        tabList={[
          { title: '首页', iconType: 'home' },
          { title: '购物车', iconType: 'shopping-cart', text: '' },
        ]}
      />
    )
  }
}