import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtModal, AtButton } from 'taro-ui'
import { Loading, SpHtmlContent } from '@/components'
import api from '@/api'

import './index.scss'

export default class MarketingIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
      info: null,
      rotateBg: 0,
      rotateGift: 0,
      loginNum: 0,
      prizeData: {}, //奖品信息
      dataForm: null, //转盘配置
      showPrize: false, //中奖提示
      showRegret: false, //没有中奖提示
      aniData: null,
      num: 1 //用在动画上，让用户在第二次点击的时候可以接着上次转动的角度继续转
    }
  }

  componentWillMount() {
    this.fetch()
    this.getLoginaddtimes()

    let aniData = Taro.createAnimation({
      //创建动画对象
      duration: 3000,
      timingFunction: 'ease-out'
    })
    this.aniData = aniData //将动画对象赋值给this的aniData属性
  }

  componentDidHide() {
    // clearInterval(this.timerID)
  }

  /**
   * 登陆赠送抽奖次数
   * */
  async getLoginaddtimes() {
    try {
      const data = await api.wheel.getLoginaddtimes()
      this.setState({
        loginNum: typeof data.result === 'number' ? data.result : Number(data.result)
      })
    } catch (err) {
      console.error('getLoginaddtimes', err)
    }
  }

  /**
   * 获取
   * */
  async fetch() {
    const data = await api.wheel.getTurntableconfig()

    let rotateBg = 360 / data.prizes.length / 2
    let rotateGift = -(360 / data.prizes.length - 45)

    let arr = data.prizes.map((item, index) => {
      item.rotate = (360 / data.prizes.length) * index
      item.index = index
      return item
    })

    let info = {
      ...data,
      list: arr
    }

    this.setState({
      info,
      rotateBg,
      rotateGift,
      dataForm: data.prizes[0].dataForm
    })
  }

  /**
   * 抽奖
   * */
  async handleClickLotteryDraw() {
    if (this.rollState) return
    this.rollState = true
    let { info, num } = this.state
    let { list } = info

    let aniData = this.aniData

    aniData.rotate(3600 * num - (360 / list.length) * 0).step() //设置转动的圈数
    this.setState({
      aniData: aniData.export(), //导出动画队列。export 方法每次调用后会清掉之前的动画操作。
      num
    })
    try {
      const data = await api.wheel.getTurntable()

      let nList = list.filter((item) => {
        if (item.prize_type === 'thanks') {
          return item
        } else if (item.prize_name === data.prize_name) {
          return item
        }
      })

      console.log('nList', nList)
      num++
      aniData.rotate(3600 * num - (360 / list.length) * nList[0].index).step() //设置转动的圈数

      this.setState({
        aniData: aniData.export() //导出动画队列。export 方法每次调用后会清掉之前的动画操作。
      })

      setTimeout(() => {
        this.rollState = false

        this.setState({
          prizeData: data,
          showPrize: data.prize_type !== 'thanks', //中奖提示
          showRegret: data.prize_type === 'thanks', //没有中奖提示
          num: num + 1,
          info: Object.assign({}, info, { surplus_times: info.surplus_times - 1 })
        })
      }, 3000)
    } catch (error) {
      this.rollState = false
    }
  }

  /**
   * 领取奖品
   * */
  handleClickGetPrize() {
    let { prizeData } = this.state

    if (prizeData.prize_type === 'coupon' && prizeData.prize_url) {
      Taro.redirectTo({
        url: `/pages/item/espier-detail?id=${prizeData.prize_url}`
      })
    }

    // Taro.redirectTo({
    //   url:`/pages/item/espier-detail?id=273`
    // })

    this.setState({
      showPrize: false
    })
  }

  render() {
    let {
      info,
      rotateBg,
      rotateGift,
      loginNum,
      prizeData,
      dataForm,
      showPrize,
      showRegret,
      aniData
    } = this.state

    if (!info && !dataForm) {
      return <Loading />
    }

    let { list } = info

    // console.log('prizeData', prizeData)
    // console.log('dataForm', dataForm)
    // console.log('info', info)
    // console.log('loginNum',loginNum)
    // console.log('Number(info.surplus_times)',Number(info.surplus_times))
    return (
      <View className='page-wheel-index'>
        <View className='background-img'>
          {dataForm.background_img ? <Image mode='widthFix' src={dataForm.background_img} /> : null}
        </View>
        <View className='wheel'>
          <View className='wheel-title'>{info.turntable_title}</View>

          <View className='wheel-msg'>
            <View>当前用户抽奖次数{Number(info.surplus_times) + loginNum}</View>
            {/* <View>
              当前活动一天可抽奖 {Number(info.max_times_day)} 次，
              剩余抽奖次数{Number(info.max_times_day) - Number(info.today_times)}
            </View> */}
          </View>

          <View className='wheel-turntable'>
            <View
              className='turntable'
              animation={aniData}
              style={{
                'box-shadow': `0px 0px 10rpx 10rpx ${dataForm.shadow_color}`,
                border: `10rpx solid ${dataForm.border_color}`
              }}
            >
              <View className='turntable-bg' style={{ transform: `rotate(${rotateBg}deg)` }}>
                {list.map((item, index) => {
                  return (
                    <View
                      key={`turntable${index}`}
                      style={{
                        transform: `rotate(${(360 / list.length) * (index + 1)}deg)`,
                        background: `${dataForm.line_color}`
                      }}
                    ></View>
                  )
                })}
              </View>
              <View className='turntable-gift' style={{ transform: `rotate(${rotateGift}deg)` }}>
                {list.map((item, index) => {
                  return (
                    <View
                      key={`gift${index}`}
                      style={{ transform: `rotate(${(360 / list.length) * (index + 1)}deg)` }}
                    >
                      <View className='div-text'>
                        <View>{item.prize_name}</View>
                        <Image src={item.prize_image} />
                      </View>
                    </View>
                  )
                })}
              </View>
            </View>

            <View className='wheel-turntable__pointer'>
              {dataForm.pointer_img ? (
                <Image
                  onClick={this.handleClickLotteryDraw.bind(this)}
                  mode='widthFix'
                  src={dataForm.pointer_img}
                />
              ) : null}
            </View>
          </View>

          <View className='wheel-describe'>
            <SpHtmlContent content={dataForm.describe} />
          </View>
        </View>

        <AtModal
          isOpened={showPrize}
          onClose={() => {
            this.setState({ showPrize: true })
          }}
          className='wheel-prize'
        >
          <View className='wheel-prize__modal'>
            <Image style='width:100%;' src={require('../../assets/wheel_modal_prize.png')} />

            <View className='wheel-prize__modal-con'>
              <View className='wheel-prize__modal-con__text'>
                您获得 {prizeData.prize_describe}
              </View>
              <AtButton onClick={this.handleClickGetPrize.bind(this)}>确定</AtButton>
            </View>
          </View>
        </AtModal>

        <AtModal
          isOpened={showRegret}
          onClose={() => {
            this.setState({ showRegret: true })
          }}
          className='wheel-prize'
        >
          <View className='wheel-prize__modal'>
            <Image style='width:100%;' src={require('../../assets/wheel_modal_regret.png')} />

            <View className='wheel-prize__modal-con'>
              <View className='wheel-prize__modal-con__text'>很遗憾您没有中奖</View>
              <AtButton
                className='button-regret'
                onClick={() => {
                  this.setState({ showRegret: false })
                }}
              >
                继续努力
              </AtButton>
            </View>
          </View>
        </AtModal>
      </View>
    )
  }
}
