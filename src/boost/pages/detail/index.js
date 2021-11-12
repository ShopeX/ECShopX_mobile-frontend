import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Button, Progress, Canvas } from '@tarojs/components'
import { SpNavBar, SpHtmlContent } from '@/components'
import { pickBy, calcTimer } from '@/utils'
import { AtCountdown, AtIcon } from 'taro-ui'
import api from '@/api'
import { connect } from '@tarojs/redux'
import { WgtFilm, WgtSlider, WgtWriting, WgtGoods, WgtHeading } from '../../../pages/home/wgts'

import './index.scss'

@connect(
  () => ({}),
  (dispatch) => ({
    onFastbuy: (item) => dispatch({ type: 'cart/fastbuy', payload: { item } })
  })
)
export default class Detail extends Component {
  constructor (props) {
    super(props)
    this.state = {
      adPic: '',
      info: {
        item_name: '',
        item_pics: '',
        item_intro: '',
        bargain_rules: '',
        mkt_price: '0.00',
        timeDown: {
          dd: 1,
          hh: 1,
          mm: 1,
          ss: 1
        },
        isSaleOut: false,
        isOver: false
      },
      userInfo: {},
      isJoin: false,
      boostList: [],
      orderInfo: {},
      purchasePrice: '0.00',
      cutPercent: 0,
      showPoster: false,
      posterImg: ''
    }
  }

  componentDidMount () {
    this.getBoostDetail()
  }

  onShareAppMessage () {
    const { userInfo, info } = this.state
    const userId = userInfo.user_id

    return {
      title: info.share_msg,
      imageUrl: info.item_pics,
      path: `/boost/pages/flop/index?bargain_id=${info.bargain_id}&user_id=${userId}`
    }
  }

  config = {
    navigationBarTitleText: '助力详情'
  }

  // 获取助力详情wechat-taroturntable
  getBoostDetail = async () => {
    Taro.showLoading({ mask: true })
    const { bargain_id } = this.$router.params

    const {
      bargain_info = {},
      user_bargain_info = {},
      bargain_order = {},
      bargain_log = {},
      user_info = {}
    } = await api.boost.getUserBargain({
      bargain_id,
      has_order: true
    })

    const { mkt_price: mPrice, price: pPrice } = bargain_info
    const { user_id, cutdown_amount } = user_bargain_info
    let purchasePrice = mPrice
    const discount = mPrice - pPrice
    const cutPercent = cutdown_amount / (mPrice - pPrice)
    if (user_id && discount >= cutdown_amount) {
      purchasePrice = mPrice - cutdown_amount
    }

    this.setState(
      {
        adPic: bargain_info ? bargain_info.ad_pic : '',
        info: pickBy(bargain_info, {
          item_id: 'item_id',
          bargain_id: 'bargain_id',
          item_name: 'item_name',
          item_pics: 'item_pics',
          item_intro: 'item_intro',
          bargain_rules: 'bargain_rules',
          share_msg: 'share_msg',
          mkt_price: ({ mkt_price }) => (mkt_price / 100).toFixed(2),
          price: ({ price }) => (price / 100).toFixed(2),
          timeDown: ({ left_micro_second }) => calcTimer(left_micro_second / 1000),
          isSaleOut: ({ limit_num, order_num }) => limit_num <= order_num,
          isOver: ({ left_micro_second }) => left_micro_second <= 0
        }),
        orderInfo: bargain_order,
        boostList: bargain_log.list || [],
        userInfo: user_info,
        isJoin: !!user_bargain_info.user_id,
        purchasePrice: (purchasePrice / 100).toFixed(2),
        cutPercent
      },
      () => {
        Taro.hideLoading()
      }
    )
  }

  // 显示规则
  showRule = () => {
    const { info } = this.state
    Taro.showModal({
      title: '活动',
      content: info.bargain_rules,
      showCancel: false
    })
  }

  base64Tosrc = (base64data) => {
    const fsm = Taro.getFileSystemManager()
    const FILE_BASE_NAME = `tmp_base64src_${new Date().getTime()}`
    return new Promise((resolve, reject) => {
      const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || []
      if (!format) {
        reject(new Error('ERROR_BASE64SRC_PARSE'))
      }
      const filePath = `${Taro.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`
      // const buffer = Taro.base64ToArrayBuffer(bodyData)
      fsm.writeFile({
        filePath,
        data: bodyData,
        encoding: 'base64',
        success () {
          Taro.getImageInfo({
            src: filePath,
            success (res) {
              resolve(res.path)
            },
            fail (e) {
              console.log(e)
            }
          })
        },
        fail () {
          reject(new Error('ERROR_BASE64SRC_WRITE'))
        }
      })
    })
  }

  // 绘制海报
  drawPoster = async () => {
    const { info, adPic, userInfo } = this.state
    const codeUrl = await api.boost.getCodeUrl({
      bargain_id: info.bargain_id,
      user_id: userInfo.user_id
    })
    // const file = await this.base64Tosrc(codeUrl.base64Image)
    const adImg = await Taro.getImageInfo({ src: adPic })
    const codeImg = await this.base64Tosrc(codeUrl.base64Image)
    const context = Taro.createCanvasContext('poster', this)
    context.drawImage(adImg.path, 0, 0, 375, 380)
    context.save()
    const bgBox = context.createLinearGradient(0, 0, 0, 600)
    bgBox.addColorStop(0, '#f4eee3')
    bgBox.addColorStop(1, 'white')
    context.setFillStyle(bgBox)
    context.fillRect(0, 380, 375, 220)
    // context.restore()
    context.save()
    context.setFillStyle('Azure')
    context.setShadow(26, 26, 50, 'Black')
    context.fillRect(127, 340, 70, 60)
    context.restore()
    context.save()
    context.drawImage(codeImg, 127, 320, 121, 121)
    // context.restore()
    context.save()
    context.setFontSize(14)
    context.setFillStyle('#333333')
    context.setTextAlign('center')
    context.fillText(`我是${userInfo.nickname}邀请您一起帮我砍价`, 187, 480)
    context.save()
    context.setFillStyle('#a2564c')
    context.fillText(info.item_name, 187, 504)
    context.restore()
    context.draw(true, () => {
      Taro.canvasToTempFilePath({
        x: 0,
        y: 0,
        canvasId: 'poster'
      })
        .then((res) => {
          this.setState({
            posterImg: res.tempFilePath
          })
        })
        .catch((err) => console.log(err))
    })
  }

  // 显示海报
  showPoster = () => {
    Taro.showLoading({
      title: '海报生成中',
      mask: true
    })
    if (this.posterImg) {
      this.setState({
        showPoster: true
      })
      Taro.hideLoading()
      return false
    }
    this.drawPoster()
      .then(() => {
        this.setState({
          showPoster: true
        })
        Taro.hideLoading()
      })
      .catch(() => {
        Taro.hideLoading()
        Taro.showToast({
          title: '生成海报错误',
          icon: 'none',
          mask: true
        })
      })
  }

  // 预览海报
  previewImage = (posterImg) => {
    Taro.previewImage({
      urls: [posterImg]
    })
  }

  handleSubmit = async () => {
    const { info, isJoin, orderInfo } = this.state

    const isDisabled =
      info.isOver ||
      info.isSaleOut ||
      orderInfo.order_status === 'DONE' ||
      orderInfo.order_status === 'CANCEL'
    if (isDisabled) return false
    if (isJoin) {
      let url = `/pages/cart/espier-checkout?bargain_id=${info.bargain_id}&cart_type=fastbuy`
      if (orderInfo.order_id) {
        url = `/subpage/pages/trade/detail?id=${orderInfo.order_id}?bargain_id=${info.bargain_id}`
      } else {
        try {
          await api.cart.fastBuy({
            item_id: info.item_id,
            num: 1,
            bargain_id: info.bargain_id
          })
        } catch (e) {
          return false
        }
      }
      this.props.onFastbuy(info.item_id, 1)
      Taro.navigateTo({ url })
    } else {
      const res = await api.boost.postUserBargain({
        bargain_id: info.bargain_id
      })
      if (res) {
        Taro.showToast({
          title: '发起成功',
          icon: 'none',
          mask: true,
          duration: 1500
        })
        setTimeout(() => {
          this.getBoostDetail()
        }, 1500)
      }
    }
  }

  render () {
    const {
      adPic,
      info,
      isJoin,
      boostList,
      orderInfo,
      purchasePrice,
      userInfo,
      cutPercent,
      showPoster,
      posterImg
    } = this.state

    const isDisabled =
      info.isOver ||
      info.isSaleOut ||
      orderInfo.order_status === 'DONE' ||
      orderInfo.order_status === 'CANCEL'

    return (
      <View className='detail'>
        <SpNavBar
          title={this.config.navigationBarTitleText}
          leftIconType='chevron-left'
          fixed='true'
        />
        <View className='header'>
          <Image className='adPic' src={adPic} mode='aspectFill' />
        </View>
        <View className='rule'>
          <View className='actBtn' onClick={this.showRule.bind(this)}>
            活动规则
          </View>
        </View>
        <View className='main'>
          <View className='good'>
            <Image src={info.item_pics} mode='aspectFill' className='img' />
            <View className='info'>
              <View className='title'>{info.item_name}</View>
              <View className='price'>¥{info.mkt_price}</View>
              {!info.isOver && info.timeDown && (
                <View className='timedown'>
                  <View className='tip'>活动仅剩:</View>
                  <AtCountdown
                    className='countdown__time'
                    format={{ day: '天', hours: ':', minutes: ':', seconds: '' }}
                    isShowDay
                    day={info.timeDown.dd}
                    hours={info.timeDown.hh}
                    minutes={info.timeDown.mm}
                    seconds={info.timeDown.ss}
                    onTimeUp={this.getBoostDetail.bind(this)}
                  />
                </View>
              )}
            </View>
          </View>
          {isJoin && (
            <View>
              {cutPercent !== 1 && !isDisabled && (
                <View className='share'>
                  <Button openType='share' className='item'>
                    邀请好友助力
                  </Button>
                  <View className='item' onClick={this.showPoster.bind(this)}>
                    朋友圈海报
                  </View>
                </View>
              )}
              <View className='boost'>
                <Image src={userInfo.headimgurl} class='avatar'></Image>
                <View className='content'>
                  我正在邀请好友助力领取
                  <Text class='strong-txt'>{info.item_name}</Text>的折价优惠！
                  <View className='progress'>
                    <Progress
                      percent={cutPercent * 100}
                      activeColor='#a2564c'
                      backgroundColor='#f0eeed'
                      strokeWidth={6}
                      active
                    />
                    <View className='price'>
                      <Text>¥{info.mkt_price}</Text>
                      <Text>¥{info.price}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View className='boostMain'>
                <View className='title'>好友助力榜</View>
                {boostList.length > 0 ? (
                  <View className='boostList'>
                    {boostList.map((item, index) => (
                      <View key={`${item.nickname}${index}`} className='boostItem'>
                        <View className='left'>
                          <Image src={item.headimgurl} mode='aspectFill' className='img' />
                        </View>
                        <View className='right'>
                          <View className='name'>{item.nickname}</View>
                          <View>
                            {item.cutdown_num >= 0 ? `减掉` : '增加'} ¥
                            {(item.cutdown_num / 100).toFixed(2)}
                          </View>
                        </View>
                        {item.cutdown_num < 0 && <View className='tag'>帮了倒忙</View>}
                      </View>
                    ))}
                  </View>
                ) : (
                  <View className='boostList noHelp'>暂无好友相助~</View>
                )}
              </View>
            </View>
          )}
          {info.item_intro && (
            <View className='goodDetail'>
              <View className='h5'>
                <Text className='text'>商品详情</Text>
              </View>
              {!Array.isArray(info.item_intro) ? (
                <SpHtmlContent content={info.item_intro} className='richText' />
              ) : (
                <View className='wgt'>
                  {info.item_intro.map((item, idx) => {
                    return (
                      <View className='wgt-wrap' key={`${item.name}${idx}`}>
                        {item.name === 'film' && <WgtFilm info={item} />}
                        {item.name === 'slider' && <WgtSlider info={item} />}
                        {item.name === 'writing' && <WgtWriting info={item} />}
                        {item.name === 'heading' && <WgtHeading info={item} />}
                        {item.name === 'goods' && <WgtGoods info={item} />}
                      </View>
                    )
                  })}
                </View>
              )}
            </View>
          )}
        </View>
        <Button
          disabled={isDisabled}
          className={`showBtn ${isDisabled && 'disabled'}`}
          onClick={this.handleSubmit.bind(this)}
        >
          {isDisabled ? (
            <Text>
              {info.isOver ? '已过期' : ''}
              {info.isSaleOut ? '已售罄' : ''}
              {orderInfo.order_status === 'DONE' ? '已购买' : ''}
              {orderInfo.order_status === 'CANCEL' ? '已参与' : ''}
            </Text>
          ) : (
            <Text>{isJoin ? `¥${purchasePrice} 优惠购买` : '发起助力'}</Text>
          )}
        </Button>
        {/* 海报 */}
        <Canvas canvasId='poster' style='width: 375px; height: 640px;' className='posterCanvas' />
        {showPoster && (
          <View className='imgContent' onTouchMove={this.stopTouch}>
            <Image
              className='posterImg'
              mode='widthFix'
              onClick={this.previewImage.bind(this, posterImg)}
              src={posterImg}
            />
            <View
              className='closePoster'
              onClick={() => {
                this.setState({ showPoster: false })
              }}
            >
              <AtIcon value='close-circle' size='30' color='#fff' />
            </View>
          </View>
        )}
      </View>
    )
  }
}
