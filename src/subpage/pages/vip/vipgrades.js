import Taro, { Component } from "@tarojs/taro";
import { View, Image, Button, Text, ScrollView } from "@tarojs/components";
import { Price, NavBar, SpCell } from "@/components";
import { connect } from "@tarojs/redux";
import { AtTabs, AtTabsPane } from "taro-ui";
import api from "@/api";
import S from "@/spx";
import { pickBy, showLoading, hideLoading, isAlipay, formatTime } from "@/utils";
import PaymentPicker from "@/pages/cart/comps/payment-picker";
import { customName } from "@/utils/point";
import userIcon from "@/assets/imgs/user-icon.png"

import FloatModal from './com'

import "./vipgrades.scss";

@connect(({ colors }) => ({
  colors: colors.current
}))
export default class VipIndex extends Component {
  static config = {
    navigationBarTitleText: "会员购买",
    backgroundColor: "#2f3030",
    backgroundTextStyle: "light"
  }
  constructor(props) {
    super(props);

    this.state = {
      userInfo: {},
      userVipInfo: {},
      curTabIdx: 0,
      curCellIdx: 0,
      tabList: [],
      list: [],
      cur: null,
      payType: "",
      isPaymentOpend: false,
      visible: false,
      couponList: []
    }
  }

  componentDidMount() {
    const { colors } = this.props;
    Taro.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: colors.data[0].marketing
    });
    const userInfo = Taro.getStorageSync("userinfo");
    this.setState(
      {
        userInfo
      },
      () => {
        this.fetchInfo();
        this.fetchUserVipInfo();
        this.fetchCouponList()
      }
    );
  }

  async fetchInfo() {
    const { cur, list } = await api.vip.getList();
    const { grade_name } = this.$router.params;

    const tabList = pickBy(list, {
      title: ({ grade_name }) => grade_name
    });

    const curTabIdx = tabList.findIndex(item => item.title === grade_name);

    this.setState({
      tabList,
      cur,
      list,
      curTabIdx: curTabIdx === -1 ? 0 : curTabIdx
    });
  }

  async fetchCouponList () {
    let list = [
      {
        status: 'status',
        reduce_cost: '0',
        least_cost: '10000',
        begin_date: formatTime(1634572800 * 1000),
        end_date: formatTime(1638201600 * 1000),
        fixed_term: null,
        card_type: 'discount',
        tagClass: 'tagClass',
        title: '三联折扣活动',
        discount: '10',
        get_limit: '1',
        user_get_num: 0,
        quantity: '100',
        get_num: 2,
        card_id: '841',
        description:'三联折扣活动description',
        use_bound:'0',
        send_begin_time: null,
        send_end_time: null
      },
      {
        status: 'status',
        reduce_cost: '0',
        least_cost: '10000',
        begin_date: formatTime(1634572800 * 1000),
        end_date: formatTime(1638201600 * 1000),
        fixed_term: null,
        card_type: 'discount',
        tagClass: 'tagClass',
        title: '三联折扣活动',
        discount: '10',
        get_limit: '1',
        user_get_num: 0,
        quantity: '100',
        get_num: 2,
        card_id: '841',
        description:'三联折扣活动description',
        use_bound:'0',
        send_begin_time: null,
        send_end_time: null
      },
      {
        status: 'status',
        reduce_cost: '0',
        least_cost: '10000',
        begin_date: formatTime(1634572800 * 1000),
        end_date: formatTime(1638201600 * 1000),
        fixed_term: null,
        card_type: 'discount',
        tagClass: 'tagClass',
        title: '三联折扣活动',
        discount: '10',
        get_limit: '1',
        user_get_num: 0,
        quantity: '100',
        get_num: 2,
        card_id: '841',
        description:'三联折扣活动description',
        use_bound:'0',
        send_begin_time: null,
        send_end_time: null
      },
      {
        status: 'status',
        reduce_cost: '0',
        least_cost: '10000',
        begin_date: formatTime(1634572800 * 1000),
        end_date: formatTime(1638201600 * 1000),
        fixed_term: null,
        card_type: 'discount',
        tagClass: 'tagClass',
        title: '三联折扣活动',
        discount: '10',
        get_limit: '1',
        user_get_num: 0,
        quantity: '100',
        get_num: 2,
        card_id: '841',
        description:'三联折扣活动description',
        use_bound:'0',
        send_begin_time: null,
        send_end_time: null
      },
      {
        status: 'status',
        reduce_cost: '0',
        least_cost: '10000',
        begin_date: formatTime(1634572800 * 1000),
        end_date: formatTime(1638201600 * 1000),
        fixed_term: null,
        card_type: 'discount',
        tagClass: 'tagClass',
        title: '三联折扣活动',
        discount: '10',
        get_limit: '1',
        user_get_num: 0,
        quantity: '100',
        get_num: 2,
        card_id: '841',
        description:'三联折扣活动description',
        use_bound:'0',
        send_begin_time: null,
        send_end_time: null
      },
      {
        status: 'status',
        reduce_cost: '0',
        least_cost: '10000',
        begin_date: formatTime(1634572800 * 1000),
        end_date: formatTime(1638201600 * 1000),
        fixed_term: null,
        card_type: 'discount',
        tagClass: 'tagClass',
        title: '三联折扣活动',
        discount: '10',
        get_limit: '1',
        user_get_num: 0,
        quantity: '100',
        get_num: 2,
        card_id: '841',
        description:'三联折扣活动description',
        use_bound:'0',
        send_begin_time: null,
        send_end_time: null
      },
      {
        status: 'status',
        reduce_cost: '0',
        least_cost: '10000',
        begin_date: formatTime(1634572800 * 1000),
        end_date: formatTime(1638201600 * 1000),
        fixed_term: null,
        card_type: 'discount',
        tagClass: 'tagClass',
        title: '三联折扣活动',
        discount: '10',
        get_limit: '1',
        user_get_num: 0,
        quantity: '100',
        get_num: 2,
        card_id: '841',
        description:'三联折扣活动description',
        use_bound:'0',
        send_begin_time: null,
        send_end_time: null
      }
    ]
    this.setState({ couponList: list })
    // const [one, two] = await Promise.all([api.member.memberInfo(), api.vip.getBindCardList({ type: 'vip_grade', grade_id: 12 })])
    const res = await api.vip.getBindCardList({ type: 'vip_grade', grade_id: 12 })

    console.log(res, list, '----')
  }

  handleClickTab = idx => {
    this.setState({
      curTabIdx: idx
    });
  };

  checkHandle = index => {
    this.setState({
      curCellIdx: index
    });
  };

  async handleCharge() {
    if (!S.getAuthToken()) {
      Taro.showToast({
        title: "请先登录再购买",
        icon: "none"
      });

      setTimeout(() => {
        S.login(this);
      }, 2000);

      return;
    }

    const { list, curTabIdx, curCellIdx, payType } = this.state;
    const vip_grade = list[curTabIdx];
    const params = {
      vip_grade_id: vip_grade.vip_grade_id,
      card_type: vip_grade.price_list[curCellIdx].name,
      distributor_id: Taro.getStorageSync("trackIdentity").distributor_id || "",
      pay_type: payType
    };

    showLoading({ mask: true });

    const data = await api.vip.charge(params);

    hideLoading();

    var config = data;
    var that = this;
    wx.requestPayment({
      timeStamp: "" + config.timeStamp,
      nonceStr: config.nonceStr,
      package: config.package,
      signType: config.signType,
      paySign: config.paySign,
      success: function(res) {
        wx.showModal({
          content: "支付成功",
          showCancel: false,
          success: function(res) {
            console.log("success");
          }
        });
      },
      fail: function(res) {
        wx.showModal({
          content: "支付失败",
          showCancel: false
        });
      }
    });
  }

  async fetchUserVipInfo() {
    const userVipInfo = await api.vip.getUserVipInfo();
    this.setState({
      userVipInfo
    });
  }
  handlePaymentShow = () => {
    this.setState({
      isPaymentOpend: true
    });
  };
  handleLayoutClose = () => {
    this.setState({
      isPaymentOpend: false
    });
  };
  handlePaymentChange = async payType => {
    this.setState(
      {
        payType,
        isPaymentOpend: false
      },
      () => {}
    );
  }

  handleChange = (visible) => {
    this.setState({ visible })
  }

  render() {
    const { colors } = this.props;
    const {
      userInfo,
      list,
      cur,
      curTabIdx,
      userVipInfo,
      tabList,
      curCellIdx,
      payType,
      isPaymentOpend,
      visible,
      couponList
    } = this.state;
    const payTypeText = {
      point: customName("积分支付"),
      wxpay: process.env.TARO_ENV === "weapp" ? "微信支付" : "现金支付",
      deposit: "余额支付",
      delivery: "货到付款",
      hfpay: "微信支付"
    };
    return (
      <View className='vipgrades'>
        <NavBar title='会员购买' leftIconType='chevron-left' fixed='true' />
        <View
          className='header'
          style={'background: ' + colors.data[0].marketing}
        >
          <View className='header-isauth'>
            <Image
              className='header-isauth__avatar'
              src={userInfo.avatar || userIcon}
              mode='aspectFill'
            />
            <View className='header-isauth__info'>
              <View className='nickname'>
                {userInfo.username}
                <Image className='icon-vip' src='/assets/imgs/svip.png' />
              </View>
              <View className='mcode'>
                {userVipInfo.end_time} 到期，购买后有效期将延续
              </View>
            </View>
          </View>
          <AtTabs
            className='header-tab'
            current={curTabIdx}
            tabList={tabList}
            onClick={this.handleClickTab}
          >
            {tabList.map((panes, pIdx) => (
              <AtTabsPane
                current={curTabIdx}
                key={panes.title}
                index={pIdx}
              ></AtTabsPane>
            ))}
          </AtTabs>
        </View>
        <View className='pay-box'>
          {cur && cur.rate && cur.rate != 1 && (
            <View className='text-muted'>
              <text className='icon-info'></text> 货币汇率：1{cur.title} ={' '}
              {cur.rate}RMB
            </View>
          )}
          <ScrollView
            scrollX
            className='grade-list'
          >
            {list[curTabIdx] &&
              list[curTabIdx].price_list.map((item, index) => {
                return (
                  item.price != 0 &&
                  item.price != null && (
                    <View
                      className={`grade-item ${index == curCellIdx &&
                        'active'}`}
                      key={`${index}1`}
                      onClick={this.checkHandle.bind(this, index)}
                    >
                      <View className='item-content'>
                        <View className='desc'>{item.name === 'monthly' && '连续包月' || item.name === 'quarter' && '连续包季' || item.name === 'year' && '连续包年'}（{item.desc}）</View>
                        <View className='amount'>
                          <Price primary value={Number(item.price)} />
                        </View>
                      </View>
                    </View>
                  )
                );
              })}
          </ScrollView>

          <PaymentPicker
            isOpened={isPaymentOpend}
            type={payType}
            isShowPoint={false}
            isShowBalance={false}
            isShowDelivery={false}
            // disabledPayment={disabledPayment}
            onClose={this.handleLayoutClose}
            onChange={this.handlePaymentChange}
          ></PaymentPicker>
          {!isAlipay && <SpCell
            isLink
            border={false}
            title='支付方式'
            onClick={this.handlePaymentShow}
            className='cus-sp-cell'
          >
            <Text>{payTypeText[payType]}</Text>
          </SpCell>}
          <View className='pay-btn' onClick={this.handleCharge}>
          立即支付
          </View>
        </View>
        <View  onClick={this.handleChange.bind(this, true)} className='coupon-box' style={{ boxShadow: '0rpx 2rpx 16rpx 0rpx #DDDDDD' }}>
          <Text className='content-v-padded'>会员专享券包</Text>
          <Text className='content-v-subtitle'>优惠券共计102张</Text>
          <ScrollView scrollX className='scroll-box'>
            <View className='coupon'>
              <Image className='img' src='/assets/imgs/coupon_bck.png' />
              <View className='coupon-price'>
                <Price primary value={Number(220.00)} noDecimal />
              </View>
              <View className='coupon-desc'>满99元可用</View>
              <View className='coupon-quan'>满减券</View>
              <View className='coupon-mark'>X2</View>
            </View>
            <View className='coupon'>
              <Image className='img' src='/assets/imgs/coupon_bck.png' />
              <View className='coupon-price'>
                <View className='coupon-font'>兑换券</View>
              </View>
              <View className='coupon-desc'>会员使用</View>
              <View className='coupon-quan'>兑换券</View>
            </View>
            <View className='coupon'>
              <Image className='img' src='/assets/imgs/coupon_bck.png' />
              <View className='coupon-price'>
                <Text className='coupon-font'>8.5</Text>
                <Text className='coupon-size'>折</Text>
              </View>
              <View className='coupon-desc'>满2件使用</View>
              <View className='coupon-quan'>折扣券</View>
              <View className='coupon-mark'>X22</View>
            </View>
            <View className='coupon'>
              <Image className='img' src='/assets/imgs/coupon_bck.png' />
              <View className='coupon-price'>
                <Price primary value={Number(220.00)} noDecimal />
              </View>
              <View className='coupon-desc'>满99元可用</View>
              <View className='coupon-quan'>满减券</View>
              <View className='coupon-mark'>X2</View>
            </View>
          </ScrollView>
        </View>
        <View className='section' style={{ boxShadow: '0rpx 2rpx 16rpx 0rpx #DDDDDD' }}>
          <View className='section-body'>
            <View className='content-v-padded'>会员权益</View>
            <View className='text-muted'>
              {list[curTabIdx] &&
                list[curTabIdx].description &&
                list[curTabIdx].description.split("\n").map((item, index) => {
                  return <View key={`${index}1`}>{item}</View>;
                })}
            </View>
          </View>
        </View>
        <FloatModal visible={visible} list={couponList} onChange={this.handleChange} />
      </View>
    )
  }
}
