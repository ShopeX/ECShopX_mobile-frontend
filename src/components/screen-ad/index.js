/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 全屏广告组件
 * @FilePath: /unite-vshop/src/components/screenAd/index.js
 * @Date: 2020-12-21 11:03:55
 * @LastEditors: Arvin
 * @LastEditTime: 2021-02-01 14:00:53
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Image, Video } from '@tarojs/components'
import api from '@/api'
import { connect } from '@tarojs/redux'
import { linkPage } from '@/pages/home/wgts/helper'

import './index.scss'

@connect(
  () => ({}),
  (dispatch) => ({
    onUpdateShowAdv: () => dispatch({ type: 'member/closeAdv' })
  })
)
export default class ScreenAd extends Component {
  constructor(props) {
    super(props)
    this.timeId = null
    this.state = {
      isShow: false,
      downTime: 10,
      // 是否为视频
      isVideo: true,
      // 按钮位置
      position: 'right_top',
      // 是否允许跳过
      isJump: true,
      // 跳转链接
      jumpUrl: {},
      // 图片/视频链接
      url: ''
    }
  }

  componentDidMount() {
    // 倒计时
    this.getSetting()
  }

  // 获取后端配置信息
  getSetting = async () => {
    // const isInit = Taro.getStorageSync('initAdv')
    const res = await api.promotion.getScreenAd()
    const env = process.env.TARO_ENV
    const client = {
      weapp: 'wapp',
      h5: 'h5'
    }
    const isHave = res.is_enable === 1 && (res.app === 'all' || res.app.indexOf(client[env]) !== -1)
    this.setState(
      {
        isShow: isHave,
        position: res.position,
        isVideo: res.material_type === 2,
        isJump: res.is_jump === 1,
        downTime: res.waiting_time,
        jumpUrl: res.ad_url,
        url: res.ad_material
      },
      () => {
        setTimeout(() => {
          this.countDown()
        }, 1000)
      }
    )
  }

  // 禁止触摸穿透
  disableTouch = (e) => {
    e.stopPropagation()
    return false
  }

  // 点击广告
  clickAd = (e) => {
    e && e.stopPropagation()
    const { jumpUrl } = this.state
    if (jumpUrl && jumpUrl.linkPage) {
      linkPage(jumpUrl.linkPage, jumpUrl)
      setTimeout(() => {
        this.jumpAd()
      })
    }
  }

  // 跳过广告
  jumpAd = (e) => {
    e && e.stopPropagation()
    const { isJump } = this.state
    if (e && !isJump) return false
    this.timeId && clearTimeout(this.timeId)
    this.setState(
      {
        isShow: false
      },
      () => {
        this.props.onUpdateShowAdv()
      }
    )
  }

  // 倒计时
  countDown = () => {
    const { downTime } = this.state
    const newTime = downTime - 1
    if (newTime > 0) {
      this.setState(
        {
          downTime: newTime
        },
        () => {
          this.timeId = setTimeout(() => {
            this.countDown()
          }, 1000)
        }
      )
    } else {
      this.jumpAd()
    }
  }

  render() {
    const { downTime, isShow, position, isVideo, isJump, url } = this.state

    return (
      <View
        className={`screenAd ${isShow && 'show'}`}
        onClick={this.clickAd.bind(this)}
        onTouchMove={this.disableTouch.bind(this)}
      >
        {/* 倒计时 */}
        <View className={`countDown ${position}`} onClick={this.jumpAd.bind(this)}>
          {isJump ? `跳过${downTime}s` : `${downTime}s`}
        </View>
        {!isVideo ? (
          <Image className='adImg' mode='widthFix' src={url} />
        ) : (
          <Video
            autoplay
            loop
            onTouchMove={this.disableTouch.bind(this)}
            className='adVideo'
            controls={false}
            showProgress={false}
            showFullscreenBtn={false}
            showPlayBtn={false}
            showCenterPlayBtn={false}
            src={url}
          />
        )}
      </View>
    )
  }
}
