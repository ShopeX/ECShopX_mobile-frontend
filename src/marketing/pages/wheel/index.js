import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { Loading } from '@/components'
import api from '@/api'

import './index.scss'

const DIAL_POINTER_IMG = '/assets/imgs/dial_pointer.png'

export default class MarketingIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      rotateBg:0,
      rotateGift: 0,
      rotate: 0, //转盘选中角度
      speed: 1, //转盘选中速度
      prizeIfon:null,
    }
  }


  componentWillMount() {
    this.fetch()
  }

  componentDidHide() {
    clearInterval(this.timerID)
  }

  isButton = true

  /**
   * 获取
   * */
  async fetch() {
    const data = await api.wheel.getTurntableconfig()

    console.log(1, data)

    let rotateBg = 360 / data.prizes.length / 2;
    let rotateGift = -(360 / data.prizes.length - 45)

    let arr = data.prizes.map((item,index)=>{
      item.rotate = (360 / data.prizes.length) * index;
      return item
    })

    // this.turntableRotate()

    this.setState({
      list: arr,
      rotateBg,
      rotateGift
    })
  }

  // 大转盘旋转
  turntableRotate() {
    clearInterval(this.timerID)
    this.timerID = setInterval(() => {
      let { rotate, speed } = this.state
      rotate = rotate + speed
      this.setState({
        rotate
      })
    }, 0)
  }

  /**
   * 抽奖
   * */
  async handleClickLotteryDraw(){

    if(!this.isButton)return

    this.isButton = false
    let { list } = this.state

    try{
      const data = await api.wheel.getTurntable()

      this.setState({
        speed:20
      },()=>{
        this.turntableRotate()
      })

      let nList = list.filter(item => {
        if(item.prize_name === data.prize_name){
          return item
        }
      })

      console.log(nList[0].prize_name,nList[0].rotate,nList[0])

      setTimeout(() => {
        this.isButton = true
        clearInterval(this.timerID)
        this.setState({
          prizeIfon:data,
          rotate:-nList[0].rotate
        })
      },4000)
    }catch(error){
      this.isButton = true
    }
  }

  render() {
    let { list,rotateBg, rotateGift, rotate, prizeIfon } = this.state
    return (
      <View className='page-wheel-index'>
        <View className='wheel'>
          <View className='turntable' style={{ transform: `rotate(${rotate}deg)` }}>
            <View className='turntable-bg' style={{ transform: `rotate(${rotateBg}deg)` }}>
              {
                list.map((item, index) => {
                  return (<View
                    key={index}
                    style={{ transform: `rotate(${(360 / list.length) * (index + 1)}deg)` }}
                  ></View>)
                })
              }

            </View>
            <View className='turntable-gift' style={{ transform: `rotate(${rotateGift}deg)` }}>
              {
                list.map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={{ transform: `rotate(${(360 / list.length) * (index + 1)}deg)` }}
                    >
                      <View className='div-text'>
                        <View>{item.prize_name}</View>
                        <Image src={item.prize_image} />
                      </View>
                    </View>
                  )
                })
              }
            </View>
          </View>
          <View className='wheel-pointer'>
            <Image onClick={this.handleClickLotteryDraw.bind(this)} mode='widthFix' src={DIAL_POINTER_IMG} />
          </View>
        </View>
      </View>
    )
  }
}
