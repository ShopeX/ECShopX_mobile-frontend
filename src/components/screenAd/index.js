/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 全屏广告组件
 * @FilePath: /unite-vshop/src/components/screenAd/index.js
 * @Date: 2020-12-21 11:03:55
 * @LastEditors: Arvin
 * @LastEditTime: 2020-12-24 12:04:18
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Image, Video } from '@tarojs/components'
import api from '@/api'

import './index.scss'

export default class ScreenAd extends Component {

  constructor (props) {
    super(props)
    this.timeId = null
    this.state = {
      isShow: false,
      downTime: 10,
      // 是否为视频
      isVideo: true,
      // 按钮位置
      position: 'bottom'
    }
  }

  componentDidMount () {
    // 倒计时
    this.getSetting()
  }

  // 获取后端配置信息
  getSetting = async () => {
    // const isInit = Taro.getStorageSync('initAdv')
    const res = await api.promotion.getScreenAd()
    console.log('%c ------------------------res-----------------', 'font-size: 24px; color: red')
    console.log(res)
    this.setState({
      isShow: true
    }, () => {
      // this.countDown()
    })
  }
  
  // 禁止触摸穿透
  disableTouch = (e) => {
    e.stopPropagation()
    return false
  }
  
  // 点击广告
  clickAd = (e) => {
    e && e.stopPropagation()
    this.timeId && clearTimeout(this.timeId)
  }

  // 跳过广告
  jumpAd = (e) => {
    e && e.stopPropagation()
    this.timeId && clearTimeout(this.timeId)
    this.setState({
      isShow: false
    }, () => {
      // Taro.setStorageSync('initAdv', true)
    })
  }

  // 倒计时
  countDown = () => {
    const { downTime } = this.state
    const newTime = downTime - 1
    if (newTime > 0) {
      this.setState({
        downTime: newTime
      }, () => {
        this.timeId = setTimeout(() => {
          this.countDown()
        }, 1000)
      })
    } else {
      this.jumpAd()
    }
  }

  render () {
    const { downTime, isShow, position, isVideo } = this.state

    return (
      <View
        className={`screenAd ${isShow && 'show'}`}
        onClick={this.clickAd.bind(this)}
        onTouchMove={this.disableTouch.bind(this)}
      >
        {/* 倒计时 */}
        <View className={`countDown ${position}`} onClick={this.jumpAd.bind(this)}>
          跳过 { downTime }s
        </View>
        {
          !isVideo ? <Image className='adImg' src='https://img.zcool.cn/community/018b575b57d793a801206a35e88b26.jpg@1280w_1l_2o_100sh.jpg' />
          : <Video
            autoplay
            loop
            onTouchMove={this.disableTouch.bind(this)}
            className='adVideo'
            controls={false}
            showProgress={false}
            showFullscreenBtn={false}
            showPlayBtn={false}
            showCenterPlayBtn={false}
            src='http://vfx.mtime.cn/Video/2019/02/04/mp4/190204084208765161.mp4'
          /> 
        }
      </View>
    )
  }
}