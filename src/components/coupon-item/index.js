import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { classNames } from '@/utils'
import './index.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
export default class CouponItem extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    onClick: () => {},
    info: null,
    isShowCheckout: false,
    isDisabled: false,
    showDetail: false
  }

  constructor (props) {
    super(props)
    //this.transitionCloseDetail=null;
    this.state = {
      isItemChecked: false,
      isExpanded:false, 
    }
  }

  handleClickChecked = (index) => {
    if(this.props.curKey === index) {
      this.setState({
        isItemChecked: !this.state.isItemChecked
      })
    } else {
      this.setState({
        isItemChecked: true
      })
    }
    this.props.onClickBtn(index)
  }

  // 切换详情状态
  changeDetail = (e) => {
    e.stopPropagation()
    const { showDetail } = this.state
    this.setState({
      showDetail: !showDetail
    })
  }

  changeExpand=(e)=>{
    e.stopPropagation()
    const { isExpanded }=this.state; 
    this.setState({
      isExpanded:!isExpanded
    })
  }

  handleType (e) {
    let type = [
      {
        tag: '兑换券', 
        bg: 'linear-gradient(122deg, #F4C486 0%, #D4A570 100%)', 
        fc: '#AC8050',
        invalidBg: 'linear-gradient(122deg, #D8D8D8 0%, #A9A9A9 100%)',  
        invalidFc: '#888888',
        opacity: '0.4'
      },
      {
        tag: '满减券', 
        bg: 'linear-gradient(299deg, #679BDD 0%, #9AC5FF 100%)', 
        fc: '#4979B7',
        invalidBg: 'linear-gradient(122deg, #D8D8D8 0%, #A9A9A9 100%)',  
        invalidFc: '#888888',
        opacity: '0.4'
      },
      {
        tag: '折扣券', 
        bg: 'linear-gradient(126deg, #CCC0EF 0%, #7E6FA9 100%)', 
        fc: '#64578D',
        invalidBg: 'linear-gradient(122deg, #D8D8D8 0%, #A9A9A9 100%)',  
        invalidFc: '#888888',
        opacity: '0.4'
      }
    ]
    switch(e) {
      case 'new_gift':
      return type[0]
      case 'cash':
      return type[1]
      case 'discount':
      return type[2]
      default: 
      return null
    }
  }

  handleClickChecked1 = () => {
    this.props.onHandleClick && this.props.onHandleClick()
  }

  render () {
    const { info, isShowCheckout, isChoosed, onClick, colors, isExist, invalidCouponColor, count } = this.props
    const { isItemChecked, showDetail, isExpanded } = this.state

    if (!info) {
      return null
    }

    const isDisabled = info.status === '2' || info.tagClass === 'overdue' || this.props.isDisabled
    const req = new RegExp("-","g")
    const obj = this.handleType(info.card_type)
    const content = info.description.split('\n') || []
    const begin_date = info.begin_date.replace(req, '.')
    const end_date = info.end_date.replace(req, '.')
    const time = parseInt(new Date().getTime() / 1000)
    return (
      <View
        className='coupon-item-index'
        onClick={this.props.onClick}
      >
        <View className='content'>
          {
            isShowCheckout && isDisabled && <View className='coupon-item__check' onClick={this.handleClickChecked.bind(this, info.id)}>
              {

                isChoosed === info.id && isItemChecked
                  ? <Text className='icon-check coupon-item__checked'> </Text>
                  : <Text className='coupon-item__unchecked'> </Text>
              }
            </View>
          }
          <View className='coupon-item'>
            <View className='coupon-item__content'>
                <View className='coupon-item___description'>
                  <View>
                    <View className='tag'
                      style={`background: ${(info.tagClass === 'used' || info.tagClass === 'overdue')  ? obj.invalidBg : obj.bg}`}
                    >
                      {obj.tag}
                    </View>
                    {info.title}
                  </View>
                  {/* {
                    (info.tagClass === 'used' || info.tagClass === 'overdue')
                      ? <View className='coupon-item___used'>
                          <Text className={`sp-icon sp-icon-yishiyong icon-${info.tagClass === 'used' ? 'used' : 'yiguoqi'}`}></Text>
                        </View>
                        : null
                  } */}
                </View>
                {info.end_date && (
                    <View className='coupon-item___time'><Text>有效期{begin_date} - {end_date}</Text></View>
                  )}
                <View className='radius-view radius-right-top'> </View>
                <View className='coupon-item__content__bf'>
                  <View className='coupon-item__content__bottom' onClick={this.changeExpand}>
                      <View className='text'>详细信息</View>
                      <Image className='arrow' src={`${APP_IMAGE_CDN}${isExpanded ? '/coupon_arrow_up.png' : '/coupon_arrow_down.png'}`} />
                  </View>
                  <View className='coupon-item__content__count'>{count}</View>
                </View>
              </View>
            {
              info.card_type === 'cash'
                ? <View
                  className={classNames('coupon-item__name', isDisabled ? 'coupon-item__name-not' : null)}
                  style={
                    isDisabled ?
                    `background: #d7d7d7` :
                    `background: ${(info.tagClass === 'used' || info.tagClass === 'overdue')  ? obj.invalidBg : obj.bg}`
                  }
                >
                    <View className='coupon-item___number'>￥<Text className='coupon-item___number_text'>{info.reduce_cost/100}</Text></View>
                    <View className='coupon-item___info'>满{info.least_cost > 0 ? info.least_cost/100 : 0.01}可用</View>
                    <View
                      className={`${!isExist && 'coupon-item___status'}`}
                      style={
                        `color: ${(info.tagClass === 'used' || info.tagClass === 'overdue')  ? obj.invalidFc : obj.fc}; opacity: ${(info.tagClass === 'used' || info.tagClass === 'overdue')  ? obj.opacity : 1}`
                      }
                      onClick={this.handleClickChecked1.bind(this)}
                    >
                      {this.props.children}
                    </View>
                    <View className='radius-view radius-left-top'> </View>
                    <View className='radius-view radius-left-bottom'> </View>
                  </View>
                  : null
            }
            {
              info.card_type === 'gift'
                ? <View
                  className={classNames('coupon-item__name', isDisabled ? 'coupon-item__name-not' : null)}
                  style={isDisabled ? `background: #d7d7d7` : `background: ${colors.data[0].primary}`}
                >
                    <View className='coupon-item___number'>兑换券</View>
                    <View className='radius-view radius-left-top'> </View>
                    <View className='radius-view radius-left-bottom'> </View>
                  </View>
                  : null
            }
            {
              info.card_type === 'new_gift'
                ? <View
                  className={classNames('coupon-item__name', isDisabled ? 'coupon-item__name-not' : null)}
                  style={
                    isDisabled ?
                    `background: #d7d7d7` :
                    `background: ${(info.tagClass === 'used' || info.tagClass === 'overdue')  ? obj.invalidBg : obj.bg}`
                  }
                >
                    <View className='coupon-item___number'>兑换券</View>
                    <View
                      className={`${!isExist && 'coupon-item___status'}`}
                      style={
                        `color: ${(info.tagClass === 'used' || info.tagClass === 'overdue')  ? obj.invalidFc : obj.fc}; opacity: ${(time < info.send_begin_time || info.tagClass === 'used' || info.tagClass === 'overdue' || info.tagClass === 'notstarted')  ? obj.opacity : 1}`
                      }
                      onClick={this.handleClickChecked1.bind(this)}
                    >
                      {this.props.children}
                    </View>
                    <View className='radius-view radius-left-top'> </View>
                    <View className='radius-view radius-left-bottom'> </View>
                  </View>
                  : null
            }
            {
              info.card_type === 'discount'
                ? <View
                  className={classNames('coupon-item__name', isDisabled ? 'coupon-item__name-not' : null)}
                  style={
                    isDisabled ?
                    `background: #d7d7d7` :
                    `background: ${(info.tagClass === 'used' || info.tagClass === 'overdue')  ? obj.invalidBg : obj.bg}`
                  }
                >
                  <View className='coupon-item___number'><Text className='coupon-item___number_text'>{(100-info.discount)/10}</Text>折</View>
                  <View className='coupon-item___info'>
                    满{info.least_cost > 0 ? info.least_cost/100 : 0.01}可用
                  </View>
                  <View
                    className={`${!isExist && 'coupon-item___status'}`}
                    style={
                      `color: ${(info.tagClass === 'used' || info.tagClass === 'overdue')  ? obj.invalidFc : obj.fc}; opacity: ${(info.tagClass === 'used' || info.tagClass === 'overdue')  ? obj.opacity : 1}`
                    }
                    onClick={this.handleClickChecked1.bind(this)}
                  >
                    {this.props.children}
                  </View>
                  <View className='radius-view radius-left-top'> </View>
                  <View className='radius-view radius-left-bottom'> </View>
                </View>
                : null
            }
            {
              info.card_type === 'member' && (
                <View
                  className={classNames('coupon-item__name', info.status === '2' ? 'coupon-item__name-not' : null)}
                  style={isDisabled ? `background: #d7d7d7` : `background: ${colors.data[0].primary}`}
                >
                  <View className='coupon-item___number'><Text className='coupon-item___number_text'>会员折扣</Text></View>
                  <View className='radius-view radius-left-top'> </View>
                  <View className='radius-view radius-left-bottom'> </View>
                </View>
              )
            }
            {this.props.renderFooter}
          </View>
        </View>
        <View className={`detail ${isExpanded && 'show'} `}> 
            {content.length && content.map((item, index) =>{
              return (
                <View key={index}>
                  {item}
                </View>
              )
            })}
          { info.use_bound!=='0' && info.use_bound=='1' && <View>{'此优惠券仅适合指定商品使用。'}</View>}
          { info.use_bound!=='0' && (info.use_bound=='2' || info.use_bound=='3') && <View>{'此优惠券仅适合指定分类商品使用。'}</View>}
          { info.use_bound!=='0' && info.use_bound=='4' && <View>{'此优惠券仅适合指定品牌商品使用。'}</View>}
        </View> 

        
      </View>
    )
  }
}
