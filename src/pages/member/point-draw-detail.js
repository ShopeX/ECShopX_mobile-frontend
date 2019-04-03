import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Swiper, SwiperItem, Image, Button, Progress } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtDivider, AtCountdown, AtNoticebar } from 'taro-ui'
import { Loading, Price, BackToTop, SpHtmlContent, SpToast, NavBar, SpCell } from '@/components'
import api from '@/api'
import { withBackToTop } from '@/hocs'
import { styleNames, log, formatDataTime } from '@/utils'
import S from '@/spx'

import './point-draw-detail.scss'

@connect(({ cart }) => ({
  cart
}), (dispatch) => ({
  onFastbuy: (item) => dispatch({ type: 'cart/fastbuy', payload: { item } }),
  onAddCart: (item) => dispatch({ type: 'cart/add', payload: { item } })
}))
@withBackToTop
export default class PointDrawDetail extends Component {
  static options = {
    addGlobalClass: true
  }

  constructor (props) {
    super(props)

    this.state = {
      info: null,
      windowWidth: 320,
      curImgIdx: 0,
      // timer: null,
      // luckName: '',
      intro: '',
      isShowDesc: false,
      totalRecord: 0,
      isLogin: false,
      luckyInfo: {},
      isLucky: false,
      trade_id: '',
    }
  }

  componentDidMount () {
    this.handleResize()
    this.fetch()
  }

  calcTimer (totalSec) {
    let remainingSec = totalSec
    const dd = Math.floor(totalSec / 24 / 3600)
    remainingSec -= dd * 3600 * 24
    const hh = Math.floor(remainingSec / 3600)
    remainingSec -= hh * 3600
    const mm = Math.floor(remainingSec / 60)
    remainingSec -= mm * 60
    const ss = Math.floor(remainingSec)

    return {
      dd,
      hh,
      mm,
      ss
    }
  }

  handleResize () {
    const { windowWidth } = Taro.getSystemInfoSync()
    this.setState({
      windowWidth
    })
  }

  async fetch () {
    const { luckydraw_id, item_id } = this.$router.params
    const info = await api.member.pointDrawDetail(luckydraw_id)
    const { intro } = await api.member.pointDrawIntro(item_id)
    // let info, intro
    // const promises = [await api.member.pointDrawDetail(luckydraw_id), await api.member.pointDrawIntro(item_id)]
    //
    // await Promise.all(promises).then(function(values) {
    //   console.log(values, 81);
    //   info = values[0]
    //   intro = values[1]
    // })

    if(info.open_status === 'success') {
      const data = await api.member.pointCompute(luckydraw_id)
      this.setState({
        luckyInfo: data
      })
    }

    if(info.open_status === 'success' && S.getAuthToken()) {
      const res = await api.member.pointCheckLucky(luckydraw_id)
      console.log(res, 78)
      if(res.luckydraw_id) {
        this.setState({
          isLucky: true,
          trade_id: res.luckydraw_trade_id
        })
      }
    }

    // let timer
    // timer = this.calcTimer(info.remaining_time)
    if (S.getAuthToken()) {
      const { total_count } = await api.member.pointMyOrder({luckydraw_id: luckydraw_id})
      this.setState({
        isLogin: true,
        totalRecord: total_count
      })
    }
    Taro.setNavigationBarTitle({
      title: info.goods_info.itemName
    })
    if(process.env.TARO_ENV === 'weapp') {
      Taro.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#C40000',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
    }
    this.setState({
      info,
      intro,
      // luckName: luckuser.str_lucky || '',
    })
    log.debug('fetch: done', info)
  }

  handleSwiperChange = (e) => {
    const { detail: { current } } = e
    this.setState({
      curImgIdx: current
    })
  }

  handleBuyClick = async () => {

    Taro.showLoading({
      title: '生成订单中',
      mask: true
    });
    try {
      const res = await api.member.pointDrawPay(this.$router.params)
      Taro.hideLoading()
      Taro.navigateTo({
        url: `/pages/cashier/index?order_id=${res.luckydraw_trade_id}`
      })
    } catch (error) {
      Taro.hideLoading()
      console.log(error)
    }
  }
  handleClickCompute = () => {
    Taro.navigateTo({
      url: `/pages/member/point-draw-compute?luckydraw_id=`+this.$router.params.luckydraw_id
    })
  }

  handleClickToOrder = () => {
    Taro.navigateTo({
      url: `/pages/member/point-order-detail?id=`+this.state.trade_id
    })
  }

  handleClickMyRecord = () => {
    Taro.navigateTo({
      url: `/pages/member/point-draw-record?luckydraw_id=`+this.$router.params.luckydraw_id
    })
  }

  handleClickAllRecord = () => {
    Taro.navigateTo({
      url: `/pages/member/point-all-record?luckydraw_id=`+this.$router.params.luckydraw_id
    })
  }

  handleClickShowDesc = () => {
    this.setState({
      isShowDesc: true
    })
  }

  render () {
    const { info, windowWidth, curImgIdx, scrollTop, showBackToTop, isLogin, intro, isShowDesc, totalRecord, luckyInfo, isLucky } = this.state
    if (!info) {
      return (
        <Loading />
      )
    }
    const rate = Number(((info.sales_num/info.luckydraw_store)*100).toFixed(0))
    const { pics: imgs } = info.goods_info
    const isBuyBtnDisabled = info.luckydraw_store - info.sales_num <= 0

    return (
      <View className='page-goods-detail'>
        <NavBar
          title={info.goods_info.itemName}
          leftIconType='chevron-left'
          fixed='true'
        />
        <ScrollView
          className='goods-detail__wrap'
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
        >
          {
            info.open_status === 'success'
              ? <View className='lucky__wrap'>
                  <View className='lucky__wrap-info'>
                    <View className='lucky__wrap-info-item lucky__wrap-info-img'>
                      <Image mode='aspectFill' src={luckyInfo.avatar} className='luck-avator' />
                      <Text className='luck-phone'>{luckyInfo.mobile}</Text>
                      <Text className='luck-title'>中奖者</Text>
                    </View>
                    <View className='lucky__wrap-info-item'>
                      <Text className='item-name'>总共购买</Text>
                      <Text>{luckyInfo.buy_num}</Text>
                      <Text className='item-name'>人次</Text>
                    </View>
                    <View className='lucky__wrap-info-item'>
                      <Text className='item-name'>获得时间</Text>
                      <Text>{formatDataTime(luckyInfo.updated *1000)}</Text>
                    </View>
                    <View className='lucky__wrap-info-item'>
                      <Text className='item-name'>购买时间</Text>
                      <Text>{formatDataTime(luckyInfo.created *1000)}</Text>
                    </View>
                  </View>
                  <View className='lucky-code'>
                    <View>
                      <Text className='item-name'>幸运码：</Text>
                      <Text className='code-num'>{luckyInfo.lucky_code}</Text>
                    </View>
                    <View className='code-btn' onClick={this.handleClickCompute.bind(this)}>查看计算结果</View>
                  </View>
                </View>
              : null
          }
          <View className='goods-imgs__wrap'>
            <Swiper
              className='goods-imgs__swiper'
              style={`height: ${windowWidth}px`}
              current={curImgIdx}
              onChange={this.handleSwiperChange.bind(this)}
            >
              {
                imgs.map((img, idx) => {
                  return (
                    <SwiperItem key={idx}>
                      <Image
                        src={img}
                        mode='aspectFill'
                        style={styleNames({ width: windowWidth + 'px', height: windowWidth + 'px' })}
                      />
                    </SwiperItem>
                  )
                })
              }
            </Swiper>
            {
              imgs.length > 1
              && <Text className='goods-imgs__text'>{curImgIdx + 1} / {imgs.length}</Text>
            }
          </View>

          {/*{timer && (*/}
            {/*<View className='goods-timer'>*/}
              {/*<View className='goods-timer__hd'>*/}
                {/*<View className='goods-prices'>*/}
                  {/*<View className='goods-prices-point'>已筹集{info.luckydraw_point*info.sales_num}积分</View>*/}
                  {/*<Progress*/}
                    {/*strokeWidth={6}*/}
                    {/*percent={rate}*/}
                    {/*showInfo*/}
                    {/*activeColor='#13CE66'*/}
                  {/*/>*/}
                {/*</View>*/}
              {/*</View>*/}
              {/*<View className='goods-timer__bd'>*/}
                {/*<Text className='goods-timer__label'>距{info.show_status === 'nostart' ? '开始' : '结束'}还剩</Text>*/}
                {/*<AtCountdown*/}
                  {/*isShowDay*/}
                  {/*day={timer.dd}*/}
                  {/*hours={timer.hh}*/}
                  {/*minutes={timer.mm}*/}
                  {/*seconds={timer.ss}*/}
                {/*/>*/}
              {/*</View>*/}
            {/*</View>*/}
          {/*)}*/}

          <View className='goods-hd'>
            <View className='goods-title__wrap'>
              <Text className='goods-title'>{info.goods_info.itemName}</Text>
              <View className='goods-prices'>
                价值：
                <Price
                  primary
                  noSymbol
                  noDecimal
                  appendText='积分'
                  value={info.luckydraw_point}
                />
              </View>
              {
                info.open_status !== 'success'
                ? <Progress
                  strokeWidth={6}
                  percent={rate}
                  showInfo
                  activeColor='#C40000'
                />
                : null
              }
            </View>
            {
              info.open_status === 'success'
                ? <View className='person-num__wrap'>
                  <Button
                    disabled={info.open_status === 'success' ? true : false}
                    className='goods-buy-toolbar__btn btn-fast-buy'
                  >本期已揭晓</Button>
                  </View>
                : <View className='person-num__wrap'>
                    <View className='person-num'>
                      <Text>{info.sales_num}</Text>
                      <Text>已参与</Text>
                    </View>
                    <View className='person-num'>
                      <Text>{info.luckydraw_store}</Text>
                      <Text>总需人次</Text>
                    </View>
                    <View className='person-num'>
                      <Text>{info.luckydraw_store-info.sales_num}</Text>
                      <Text>剩余</Text>
                    </View>
                  </View>
            }

          </View>

          {/*{*/}
            {/*luckName*/}
              {/*? <View className='notice-bar-hd'>*/}
                  {/*<AtNoticebar marquee>*/}
                    {/*{luckName}*/}
                  {/*</AtNoticebar>*/}
                {/*</View>*/}
              {/*: null*/}
          {/*}*/}

          <View className='point-record__wrap'>
            {
              isLucky ? <SpCell title='中奖订单信息' isLink onClick={this.handleClickToOrder.bind(this)}> </SpCell> : null
            }
            {
              isLogin
                ?  <SpCell title='我的记录' isLink onClick={this.handleClickMyRecord.bind(this)}>
                      <Text className='text-value'>已参与{totalRecord}次</Text>
                    </SpCell>
                : null
            }
            <SpCell title='所有参与记录' isLink onClick={this.handleClickAllRecord.bind(this)}> </SpCell>
            <SpCell title='图文详情' value='（建议Wifi下使用）' onClick={this.handleClickShowDesc.bind(this)}> </SpCell>
          </View>

          {
            isShowDesc
              ? <View>
                  <View className='sec goods-sec-props'>
                    <View className='sec-hd'>
                      <Text className='sec-title'>商品参数</Text>
                    </View>
                    <View className='sec-bd'>
                      <View className='goods-props__wrap'>
                        <View className='prop-item'>
                          <Text className='prop-item__label'>品牌：</Text>
                          <Text className='prop-item__cont'>{info.goods_info.goods_brand || '--'}</Text>
                        </View>
                        <View className='prop-item'>
                          <Text className='prop-item__label'>颜色：</Text>
                          <Text className='prop-item__cont'>{info.goods_info.goods_color || '--'}</Text>
                        </View>
                        <View className='prop-item'>
                          <Text className='prop-item__label'>功能：</Text>
                          <Text className='prop-item__cont'>{info.goods_info.goods_function || '--'}</Text>
                        </View>
                        <View className='prop-item'>
                          <Text className='prop-item__label'>材质：</Text>
                          <Text className='prop-item__cont'>{info.goods_info.goods_series || '--'}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View className='goods-sec-detail'>
                    <AtDivider content='宝贝详情'></AtDivider>
                    <SpHtmlContent
                      className='goods-detail__content'
                      content={intro}
                    />
                  </View>
                </View>
              : null
          }

        </ScrollView>

        <BackToTop
          bottom={150}
          show={showBackToTop}
          onClick={this.scrollBackToTop}
        />

        {
          info.open_status === 'success'
            ? <View className='goods-buy-toolbar'>
                <View  className='goods-buy-toolbar__btns' >
                  <Button
                    disabled={isBuyBtnDisabled}
                    className='goods-buy-toolbar__btn btn-fast-buy'
                    onClick={this.handleBuyClick.bind(this)}
                  >立即抽奖</Button>
                </View>
              </View>
            : null
        }

        <SpToast />
      </View>
    )
  }
}
