import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { REFUND_STATUS } from '@/consts'
import { formatTime } from '@/utils'
import { Loading, FloatMenuMeiQia } from '@/components'
import api from '@/api'

import './refund-detail.scss'

export default class TradeRefundDetail extends Component {
  constructor (props) {
    super(props)

    this.state = {
      info: null,
      progress: 0,
      aftersalesAddress: {}
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
    const { aftersales_bn, item_id, order_id } = this.$router.params
    const { aftersales: info, orderInfo } = await api.aftersales.info({
      aftersales_bn,
      item_id,
      order_id
    })

    const progress = +info.progress
    info.status_str = REFUND_STATUS[String(progress)]
    info.creat_time_str = formatTime(info.create_time * 1000)
    this.setState({
      orderInfo,
      info,
      progress,
      aftersalesAddress: info.aftersales_address
    })
  }

  handleBtnClick = async (type) => {
    const { aftersales_bn, order_id, item_id } = this.state.info

    if (type === 'cancel') {
      Taro.showLoading({
        mask: true
      })
      try {
        await api.aftersales.close({ aftersales_bn })
        this.fetch()
      } catch (e) {
        console.log(e)
      }

      Taro.hideLoading()
    }

    if (type === 'edit') {
      Taro.navigateTo({
        url: `/subpage/pages/trade/refund?aftersales_bn=${aftersales_bn}&order_id=${order_id}&item_id=${item_id}`
      })
    }

    if (type === 'refund') {
      Taro.navigateTo({
        url: `/subpage/pages/trade/refund?order_id=${order_id}&item_id=${item_id}`
      })
    }

    if (type === 'refund_send') {
      Taro.navigateTo({
        url: `/subpage/pages/trade/refund-sendback?aftersales_bn=${aftersales_bn}`
      })
    }
  }

  render () {
    const { info, orderInfo, progress, aftersalesAddress } = this.state
    const meiqia = Taro.getStorageSync('meiqia')
    const echat = Taro.getStorageSync('echat')
    if (!info) {
      return <Loading />
    }

    return (
      <View className='trade-refund-detail'>
        <View className='refund-status'>
          <Text className='refund-status__text text-status'>{info.status_str}</Text>
          {progress == 0 ? <Text className='refund-status__text'>正在审核订单</Text> : null}
          {progress == 1 ? <Text className='refund-status__text'>已接受申请，等回寄</Text> : null}
          {progress == 2 ? <Text className='refund-status__text'>客户已回寄，等待商家收货确认</Text> : null}
          {progress == 3 ? <Text className='refund-status__text'>申请已驳回</Text> : null}
          {progress == 4 ? <Text className='refund-status__text'>物流信息：已发货</Text> : null}
          {progress == 5 ? <Text className='refund-status__text'>退款驳回</Text> : null}
          {progress == 6 ? <Text className='refund-status__text'>退款已处理</Text> : null}
          {progress == 7 ? <Text className='refund-status__text'>售后关闭</Text> : null}

        </View>
        <View className='refund-detail'>
          {progress == 0 ?  <Text className='refund-detail__title'>您已成功发起退款申请，请耐心等待商家处理</Text> : null}
          <Text className='refund-detail__descr'>{info.description}</Text>
          {
            progress == 0
              ? <View>
                  <Text className='refund-detail__btn' onClick={this.handleBtnClick.bind(this, 'edit')}>修改申请</Text>
                  <Text className='refund-detail__btn refund-detail__cancel' onClick={this.handleBtnClick.bind(this, 'cancel')}>撤销申请</Text>
                </View>
              : null
          }
          {
            (progress == 3 || progress == 5)
              ? <View>
                  <Text className='refund-detail__btn' onClick={this.handleBtnClick.bind(this, 'refund')}>再次申请</Text>
                  <Text className='refund-detail__btn refund-detail__cancel' onClick={this.handleBtnClick.bind(this, 'cancel')}>撤销申请</Text>
                </View>
              : null
          }
          {
            progress == 1
              ? <View>
                  <Text className='refund-detail__btn' onClick={this.handleBtnClick.bind(this, 'refund_send')}>填写物流信息</Text>
                  <Text className='refund-detail__btn refund-detail__cancel' onClick={this.handleBtnClick.bind(this, 'cancel')}>撤销申请</Text>
                </View>
              : null
          }
        </View>
        {/*<View className='refund-info'>
          <View className='refund-info__num'>
            <Text className='refund-info__text'>商品数量：</Text>
            <Text className='refund-info__text text-primary'>3</Text>
          </View>
          <View className='refund-info__num'>
            <Text className='refund-info__text'>退款金额：</Text>
            <View>
              <Text className='refund-info__text text-primary'>300</Text>
              <Text className='refund-info__text'>(含发货邮费￥300)</Text>
            </View>
          </View>
        </View>*/}
        <View className='refund-detail-info'>
          <View className='info-name'>退款原因：<Text className='info-value'>{info.reason}</Text></View>
          <View className='info-name'>申请时间：<Text className='info-value'>{info.creat_time_str}</Text></View>
          <View className='info-name'>退款编号：<Text className='info-value'>{info.aftersales_bn}</Text></View>
          <View className='info-name'>驳回原因：<Text className='info-value'>{info.refuse_reason}</Text></View>
          {
            progress === 1 ?
            <View>
              {
                aftersalesAddress.contact ?
                <View className='info-name'>售后联系人：<Text className='info-value'>{aftersalesAddress.contact}</Text></View> : null
              }
              {
                aftersalesAddress.mobile ?
                <View className='info-name'>售后电话：<Text className='info-value'>{aftersalesAddress.mobile}</Text></View> : null
              }
              {
                aftersalesAddress.address ?
                <View className='info-name'>售后地址：<Text className='info-value'>{aftersalesAddress.address}</Text></View> : null
              }
            </View> : null
          }

        </View>
        {
          meiqia.is_open === 'true' || echat.is_open === 'true'
            ? <FloatMenuMeiQia storeId={orderInfo.distributor_id} info={{orderId: orderInfo.order_id}} isFloat={false}> 
              <Button className='refund-detail-btn'>联系客服</Button>
            </FloatMenuMeiQia>
            : <Button openType='contact' className='refund-detail-btn'>联系客服</Button>
        }
        {/*
          <View className='refund-status'>
          {
            (progress == 0 || progress == 1 || progress == 3 || progress == 5)
              ? <Icon size='50' type='waiting'></Icon>
              : (progress == 2 || progress == 4)
                ? <Icon size='50' type='cancel'></Icon>
                : <Icon size='50' type='success'></Icon>
          }
          <View class='refund-reason'>{info.status_str}</View>
          <View class='trade-bn'>退款编号：{info.aftersales_bn}</View>
        </View>

        <View className='refund-detail'>
          {orderInfo.pay_type === 'point'
            ? (<SpCell title='退款积分'>
                <Price noSymbol noDecimal value={orderInfo.point}></Price>
              </SpCell>)
            : (<SpCell title='退款金额'>
                <Price value={orderInfo.item_fee} unit='cent'></Price>
              </SpCell>)
          }

          <SpCell title='退款类型'>
            <Text>{info.aftersales_type === 'ONLY_REFUND' ? '仅退款' : '退款退货'}</Text>
          </SpCell>
          <SpCell title='退款理由'>
            <Text>{info.reason}</Text>
          </SpCell>
          {(progress == 3 || progress == 5) && (
            <SpCell title='驳回原因'>
              <Text>{info.refuse_reason}</Text>
            </SpCell>
          )}
          <SpCell title='问题描述'>
            <Text>{info.description}</Text>
          </SpCell>
        </View>

        {progress == 0 && (
          <View className='toolbar'>
            <AtButton type='secondary' circle onClick={this.handleBtnClick.bind(this, 'cancel')}>撤销申请</AtButton>
            <AtButton type='primary' circle onClick={this.handleBtnClick.bind(this, 'edit')}>修改申请</AtButton>
          </View>
        )}
        {(progress == 3 || progress == 5) && (
          <View className='toolbar'>
            <AtButton type='secondary' circle onClick={this.handleBtnClick.bind(this, 'cancel')}>撤销申请</AtButton>
            <AtButton type='primary' circle onClick={this.handleBtnClick.bind(this, 'refund')}>再次申请</AtButton>
          </View>
        )}
        {progress == 1 && (
          <View className='toolbar'>
            <AtButton type='secondary' circle onClick={this.handleBtnClick.bind(this, 'cancel')}>撤销申请</AtButton>
            <AtButton type='primary' circle onClick={this.handleBtnClick.bind(this, 'refund_send')}>填写物流信息</AtButton>
          </View>
        )}*/}
        {/* <FloatMenus>
        {
          meiqia.is_open === 'meiqia'
            ? <FloatMenuMeiQia storeId={orderInfo.distributor_id} info={{orderId: orderInfo.order_id}} /> 
            : <FloatMenuItem
              iconPrefixClass='icon'
              icon='headphones'
              openType='contact'
            />
          }
        </FloatMenus> */}
      </View>
    )
  }
}
