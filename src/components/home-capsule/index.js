import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { classNames } from '@/utils'

import './index.scss';

 
export default class HomeCapsule extends Component {
  static defaultProps = {
    url: ''
  }
 

  componentDidMount () {
    if (process.env.TARO_ENV === 'weapp') {
      
    }
  }

  handleClick(){
    const { url }=this.props;
    Taro.navigateTo({
      url:url||'/pages/index'
    })
  }

  render () {
    const { className,style } = this.props
    const classes = classNames('home-capsule', className)

    return  <View className={classes} style={style} onClick={this.handleClick}>
            <View className='iconfont icon-home'></View> 
        </View> 
  }
}
