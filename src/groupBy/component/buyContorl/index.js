/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 购买按钮
 * @FilePath: /unite-vshop/src/groupBy/component/buyContorl/index.js
 * @Date: 2020-04-26 16:01:13
 * @LastEditors: Arvin
 * @LastEditTime: 2020-07-08 17:26:06
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import S from '@/spx'

import './index.scss'

export default class buyContorl extends Component {

  static defaultProps = {
    // 是否结束
    isEnd: false,
    // 限购数量
    limit: 99,
    // 库存
    store: 99,
    quantity: 0,
    isCanReduce: false,
    addQuantity: () => {},
    reduceQuantity: () => {}
  }

  handleClick = (type = 'add', e) => {
    e.stopPropagation()
    if (!S.getAuthToken()) {
      Taro.showToast({
        icon: 'none',
        title: '请登录'
      })
      setTimeout(() => {
        S.login(this, true)
      }, 1000)
      return
    }
    const { addQuantity, reduceQuantity, quantity, isCanReduce, limit, store } = this.props
    if (type === 'add') {
      if (limit > 0 && quantity >= limit) {
        Taro.showToast({
          title: '超出限购数量',
          icon: 'none',
          mask: true
        })
      } else if (quantity >= store) {
        Taro.showToast({
          title: '库存不足',
          icon: 'none',
          mask: true
        })
      } else {
        addQuantity && addQuantity()
      }
    } else {
      if (!isCanReduce || quantity > 1) {
        reduceQuantity && reduceQuantity()
      }
    }
  }

  render () {
    const { isEnd, quantity, isCanReduce } = this.props
    return (
      <View className='buyContorl'>
        {
          !isEnd && quantity > 0 
            ? <View className='content'>
              <Button className={`reduceBtn ${isCanReduce && quantity <= 1 && 'disable'}`} onClick={this.handleClick.bind(this, 'reduce')}>
                <AtIcon value='subtract' size='12'></AtIcon>
              </Button>
              <View className='num'>{ quantity }</View>
              <Button className='addBtn'onClick={this.handleClick.bind(this, 'add')}>
                <AtIcon value='add' size='12'></AtIcon>
              </Button>
            </View>
            : <Button className='buyButton' onClick={this.handleClick.bind(this, 'add')}>{isEnd ? '活动结束' : '立即抢购'}</Button>
        }
      </View>
    )
  }
}