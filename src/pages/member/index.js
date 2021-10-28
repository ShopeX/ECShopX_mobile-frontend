import Taro, { Component } from "@tarojs/taro";
import { View, ScrollView, Text, Image, Button } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import {
  TabBar,
  SpCell,
  AccountOfficial,
  SpLogin,
  SpFloatPrivacy,
  CouponModal
} from "@/components";
// import ExclusiveCustomerService from './comps/exclusive-customer-service'
import api from "@/api";
import S from "@/spx";
import req from "@/api/req";
import { withLogin } from "@/hocs";
import {
  navigateTo,
  getThemeStyle,
  classNames,
  showModal,
  isWeixin,
  platformTemplateName,
  transformPlatformUrl
} from "@/utils";
import qs from 'qs';
import {
  customName
} from '@/utils/point';
import userIcon from '@/assets/imgs/user-icon.png'
import MemberBanner from "./comps/member-banner";
import "./index.scss";

@connect(
  ({ colors, member }) => ({
    colors: colors.current,
    memberData: member.member
  }),
  dispatch => ({
    onFetchFavs: favs => dispatch({ type: "member/favs", payload: favs }),
    setMemberInfo: memberInfo =>
      dispatch({ type: "member/init", payload: memberInfo })
  })
)
@withLogin()
export default class MemberIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      turntable_open: 0,
      redirectInfo: {},
      orderCount: null,
      memberDiscount: null,
      isOpenPopularize: false,
      salespersonData: null,
      memberAssets: null,
      // 是否开启储值
      rechargeStatus: true,
      // banner配置
      bannerSetting: {},
      // 菜单配置
      menuSetting: {
        activity: false,
        offline_order: false,
        boost_activity: false,
        boost_order: false,
        complaint: false,
        community_order: false,
        ext_info: false,
        group: false,
        member_code: false,
        recharge: false,
        ziti_order: false,
        //是否开启积分链接
        score_menu: false,
        share_enable: false,
        memberinfo_enable: false
      },
      imgUrl: "",
      // 积分商城菜单
      score_menu_open: false,
      // 是否显示隐私协议
      showPrivacy: false,
      showTimes: 0,
      all_card_list: [],
      visible: false
    };
  }

  config = {
    navigationBarTitleText: "",
    enablePullDownRefresh: true,
    onReachBottomDistance: 50,
    backgroundTextStyle: "dark",
    navigationStyle: "custom"
  };

  componentWillMount() {
    this.fetch();
    this.getSetting();
    // this.getWheel();
    // this.fetchBanner();
    // this.fetchRedirect();

    // this.getSettingCenter();
    // this.getConfigPointitem();
  }

  componentDidShow () {
    if (S.getAuthToken()) {
      this.fetchCouponCardList()
    }
  }

  async onShareAppMessage() {
    const {
      share_title = "震惊！这店绝了！",
      share_pic_wechatapp
    } = await req.get(`/memberCenterShare/getInfo`);
    const { logo } = await req.get(
      `/distributor/getDistributorInfo?distributor_id=0`
    );
    return {
      title: share_title,
      imageUrl: share_pic_wechatapp || logo,
      path: "/pages/index"
    };
  }

  onPullDownRefresh() {
    this.fetch();
  }

  onRefresh() {
    Taro.showNavigationBarLoading();
    //显示 loading 提示框。需主动调用 wx.hideLoading 才能关闭提示框
    Taro.showLoading({
      title: "刷新中..."
    });
  }

  navigateTo = navigateTo;

  async fetch() {
    if (S.getAuthToken()) {
      const [
        salesPerson,
        orderCount,
        { list: memberDiscount },
        assets,
        wheelData
      ] = await Promise.all([
        api.member.getSalesperson(),
        api.trade.getCount(),
        api.vip.getList(),
        api.member.memberAssets(),
        // 大转盘
        api.wheel.getTurntableconfig()
      ]);
      const { memberData } = this.props;
      this.setState({
        salespersonData: salesPerson,
        orderCount,
        memberDiscount:
          memberDiscount.length > 0
            ? memberDiscount[memberDiscount.length - 1].privileges.discount_desc
            : "",
        memberAssets: {
          ...assets,
          deposit: memberData.deposit
        },
        turntable_open: wheelData.turntable_open
      });
      await S.getMemberInfo();
      // this.props.setMemberInfo(memberInfo);
    }
    Taro.stopPullDownRefresh();
  }

  async getSetting() {
    const [bannerSetting, menuSetting, pointItemSetting] = await Promise.all([
      // 会员中心banner
      await api.shop.getPageParamsConfig({
        page_name: "member_center_setting"
      }),
      // 菜单自定义
      await api.shop.getPageParamsConfig({
        page_name: "member_center_menu_setting"
      }),
      // 积分商城
      await api.pointitem.getPointitemSetting()
    ] );

    this.setState({
      bannerSetting: bannerSetting.list[0].params.data,
      menuSetting: menuSetting.list[0].params.data,
      score_menu_open: pointItemSetting.entrance.mobile_openstatus
    });
  }

  onChangeLoginSuccess = () => {
    this.fetch();
  };

  // 获取积分个人信息跳转
  async fetchRedirect() {
    const pathparams=qs.stringify({
      template_name:platformTemplateName,
      version:'v1.0.1',
      page_name:'member_center_redirect_setting'
    })
    const url = transformPlatformUrl(`/alipay/pageparams/setting?${pathparams}`);
    const { list = [] } = await req.get(url);
    if (list[0].params) {
      this.setState({
        redirectInfo: list[0].params
      });
    }
  }

  handleClickRecommend = async () => {
    const { info } = this.state;
    if (!info.is_open_popularize) {
      Taro.showToast({
        title: "未开启推广",
        icon: "none"
      });
      return;
    }

    if (info.is_open_popularize && !info.is_promoter) {
      await api.member.promoter();
    }

    Taro.navigateTo({
      url: "/pages/member/recommend"
    });
  };

  beDistributor = async () => {
    const { is_promoter } = this.props.memberData;
    if (is_promoter) {
      Taro.navigateTo({
        url: "/marketing/pages/distribution/index"
      });
      return;
    }
    const { confirm } = await Taro.showModal({
      title: "邀请推广",
      content: "确定申请成为推广员？",
      showCancel: true,
      cancel: "取消",
      confirmText: "确认",
      confirmColor: "#0b4137"
    });
    if (!confirm) return;

    const res = await api.distribution.become();
    const { status } = res;
    if (status) {
      Taro.showModal({
        title: "恭喜",
        content: "已成为推广员",
        showCancel: false,
        confirmText: "好"
      });
    }
  };

  // 订单查看
  async handleTradeClick(type) {
    Taro.navigateTo({
      url: `/subpage/pages/trade/list?status=${type}`
    });
  }

  // 积分查看
  handleClickPoint = () => {
    const { redirectInfo } = this.state;
    if (redirectInfo.data && redirectInfo.data.point_url_is_open) {
      Taro.navigateToMiniProgram({
        appId: redirectInfo.data.point_app_id,
        path: redirectInfo.data.point_page
      });
    }
  };

  handleClickInfo = () => {
    const { redirectInfo } = this.state;
    if (redirectInfo.data && redirectInfo.data.info_url_is_open) {
      Taro.navigateToMiniProgram({
        appId: redirectInfo.data.info_app_id,
        path: redirectInfo.data.info_page
      });
    } else {
      Taro.navigateTo({
        url: "/marketing/pages/member/userinfo"
      });
    }
  };

  handleClickWxOAuth( fn,need=true ) {
    if ( this.state.showTimes >= 1 ) {
      if(need){
        fn && fn();
      } 
    } else { 
      const { avatar, username } = this.props.memberData.memberInfo;
      if (avatar && username) {
        if(need){
          fn && fn();
        }
      } else {
        this.setState({
          showPrivacy: true
        });
      }
    }  
  }

  fetchCouponCardList () {
    api.vip.getShowCardPackage({ receive_type: 'grade' })
    .then(({ all_card_list }) => {
      if (all_card_list && all_card_list.length > 0) {
        this.setState({ visible: true })
      }
      this.setState({ all_card_list })
    })
  }

  handleCouponChange = (visible, type) => {
    if (type === 'jump') {
      Taro.navigateTo({
        url: `/marketing/pages/member/coupon`
      })
    }
    this.setState({ visible })
  }

  render() {
    const { colors, memberData } = this.props;
    const {
      score_menu_open,
      gradeInfo,
      orderCount,
      memberDiscount,
      memberAssets,
      isOpenPopularize,
      salespersonData,
      turntable_open,
      bannerSetting,
      menuSetting,
      rechargeStatus,
      showPrivacy,
      showTimes,
      visible,
      all_card_list
    } = this.state;
    let memberInfo = null,
      vipgrade = null;
    if (memberData) {
      memberInfo = memberData.memberInfo;
      vipgrade = memberData.vipgrade;
    }

    return (
      <View className="page-member-index" style={getThemeStyle()}>
        {S.getAuthToken() ? (
          <View
            className={classNames("page-member-header", {
              "no-card": !memberDiscount
            })}
          >
            <View className="user-info">
              <View
                className="view-flex view-flex-middle"
                onClick={() => {
                  this.handleClickWxOAuth(this.handleClickInfo.bind(this));
                }}
              >
                <View className="avatar">
                  <Image
                    className="avatar-img"
                    src={memberInfo.avatar || userIcon}
                    mode="aspectFill"
                  />
                </View>
                <View>
                  <View className="nickname">
                    Hi, {memberInfo.username || memberInfo.mobile}
                  </View>
                  <View className="gradename">{`${
                    !vipgrade.is_vip
                      ? memberInfo.gradeInfo.grade_name
                      : vipgrade.grade_name || "会员"
                  }`}</View>
                </View>
              </View>
              {menuSetting.member_code && (
                <View
                  className="icon-qrcode"
                  onClick={() => {
                    this.handleClickWxOAuth(
                      this.navigateTo.bind(
                        this,
                        "/marketing/pages/member/member-code"
                      )
                    );
                  }}
                ></View>
              )}
            </View>

            <View className="member-assets view-flex">
              <View
                className="view-flex-item"
                onClick={() => {
                  this.handleClickWxOAuth(
                    this.navigateTo.bind(this, "/marketing/pages/member/coupon")
                  );
                }}
              >
                <View className="member-assets__label">优惠券</View>
                <View className="member-assets__value">
                  {memberAssets.discount_total_count || 0}
                </View>
              </View>

              <View
                className="view-flex-item"
                onClick={() => {
                  this.handleClickWxOAuth(this.handleClickPoint.bind(this));
                }}
              >
                <View className="member-assets__label">
                  {customName("积分")}
                </View>
                <View className="member-assets__value">
                  {memberAssets.point_total_count || 0}
                </View>
              </View>

              {rechargeStatus && (
                <View
                  className="view-flex-item"
                  onClick={() => {
                    this.handleClickWxOAuth(
                      this.navigateTo.bind(
                        this,
                        "/others/pages/recharge/index"
                      ),
                      isWeixin
                    );
                  }}
                >
                  <View className="member-assets__label">储值</View>
                  <View className="member-assets__value">
                    {(memberAssets.deposit || 0) / 100}
                  </View>
                </View>
              )}

              <View
                className="view-flex-item"
                onClick={() => {
                  this.handleClickWxOAuth(
                    this.navigateTo.bind(this, "/pages/member/item-fav")
                  );
                }}
              >
                <View className="member-assets__label">收藏</View>
                <View className="member-assets__value">
                  {memberAssets.fav_total_count || 0}
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View className="page-member-header view-flex view-flex-vertical view-flex-middle view-flex-center">
            <Image className="user-icon" src={userIcon} mode="widthFix" />
            <SpLogin onChange={this.onChangeLoginSuccess.bind(this)}>
              <View className="unlogin">请登录</View>
            </SpLogin>
          </View>
        )}

        {(vipgrade.is_open || (!vipgrade.is_open && vipgrade.is_vip)) &&
          memberDiscount !== "" && (
            <View
              className="member-card"
              onClick={() => {
                this.handleClickWxOAuth(
                  this.navigateTo.bind(this, "/subpage/pages/vip/vipgrades")
                );
              }}
            >
              {vipgrade.is_open && !vipgrade.is_vip && (
                <View className="vip-btn">
                  <View className="vip-btn__title">
                    开通VIP会员 <Text className="icon-arrowRight"></Text>
                  </View>
                  {memberDiscount && (
                    <View className="vip-btn__desc">
                      即可享受最高{memberDiscount}折会员优惠
                    </View>
                  )}
                </View>
              )}
              {vipgrade.is_vip && (
                <View className="grade-info">
                  <View className="member-card-title">
                    <Text className="vip-sign">
                      {vipgrade.vip_type === "svip" ? (
                        <Text>SVIP</Text>
                      ) : (
                        <Text>VIP</Text>
                      )}
                    </Text>
                    会员卡
                  </View>
                  <View className="member-card-no">
                    NO. {memberInfo.user_card_code}
                  </View>
                  <View className="member-card-period">
                    {vipgrade.end_time} 到期
                  </View>
                </View>
              )}
              {vipgrade.is_vip && (
                <Image
                  className="member-info-bg"
                  src={vipgrade.background_pic_url}
                  mode="widthFix"
                />
              )}
              {vipgrade.is_open && !vipgrade.is_vip && (
                <Image
                  className="member-info-bg"
                  src={memberInfo.gradeInfo.background_pic_url}
                  mode="widthFix"
                />
              )}
            </View>
          )}

        {/* {is_open_official_account === 1 && (
          <View className="page-member-section">
            <AccountOfficial
              onHandleError={this.handleOfficialError.bind(this)}
              onClick={this.handleOfficialClose.bind(this)}
              isClose={false}
            />
          </View>
        )} */}

        <View className="page-member-section order-box">
          <View className="section-title view-flex view-flex-middle">
            <View className="view-flex-item">订单</View>
            <View
              class="section-more"
              onClick={() => {
                this.handleClickWxOAuth(this.handleTradeClick.bind(this));
              }}
            >
              全部订单<Text className="forward-icon icon-arrowRight"></Text>
            </View>
          </View>

          {menuSetting.ziti_order && (
            <View
              className="member-trade__ziti"
              onClick={() => {
                this.handleClickWxOAuth(
                  this.navigateTo.bind(
                    this,
                    "/subpage/pages/trade/customer-pickup-list"
                  )
                );
              }}
            >
              <View className="view-flex-item">
                <View className="member-trade__ziti-title">自提订单</View>
                <View className="member-trade__ziti-desc">
                  您有
                  <Text className="mark">
                    {orderCount.normal_payed_daiziti || 0}
                  </Text>
                  个等待自提的订单
                </View>
              </View>
              <View className="icon-arrowRight item-icon-go"></View>
            </View>
          )}

          <View className="member-trade">
            <View
              className="member-trade__item"
              onClick={() =>
                this.handleClickWxOAuth(this.handleTradeClick.bind(this, 5))
              }
            >
              <View className="icon-wallet">
                {orderCount.normal_notpay_notdelivery > 0 && (
                  <View className="trade-num">
                    {orderCount.normal_notpay_notdelivery}
                  </View>
                )}
              </View>
              <Text>待支付</Text>
            </View>
            <View
              className="member-trade__item"
              onClick={() => {
                this.handleClickWxOAuth(this.handleTradeClick.bind(this, 1));
              }}
            >
              <View className="icon-delivery">
                {orderCount.normal_payed_notdelivery > 0 && (
                  <View className="trade-num">
                    {orderCount.normal_payed_notdelivery}
                  </View>
                )}
              </View>
              <Text>待收货</Text>
            </View>
            <View
              className="member-trade__item"
              onClick={() => {
                this.handleClickWxOAuth(this.handleTradeClick.bind(this, 3));
              }}
            >
              <View className="icon-office-box">
                {orderCount.normal_payed_delivered > 0 && (
                  <View className="trade-num">
                    {orderCount.normal_payed_delivered}
                  </View>
                )}
              </View>
              <Text>已完成</Text>
            </View>
            {orderCount.rate_status && (
              <View
                className="member-trade__item"
                onClick={() => {
                  this.handleClickWxOAuth(this.handleTradeClick.bind(this, 3));
                }}
              >
                <View className="icon-message"></View>
                <Text className="trade-status">待评价</Text>
              </View>
            )}
            <View
              className="member-trade__item"
              onClick={() =>
                this.handleClickWxOAuth(
                  this.navigateTo.bind(this, "/subpage/pages/trade/after-sale")
                )
              }
            >
              <View className="icon-repeat">
                {orderCount.aftersales > 0 && (
                  <View className="trade-num">{orderCount.aftersales}</View>
                )}
              </View>
              <Text>售后</Text>
            </View>
          </View>
        </View>

        {/* {bannerSetting && bannerSetting.is_show && (
          <View className="page-member-section">
            <MemberBanner info={bannerSetting} />
          </View>
        )} */}

        <View className="page-member-section">
          {memberData.is_open_popularize && isWeixin && (
            <SpCell
              title={!memberData.is_promoter ? "我要推广" : "推广管理"}
              isLink
              img={require("../../assets/imgs/store.png")}
              onClick={() =>
                this.handleClickWxOAuth(this.beDistributor.bind(this))
              }
            ></SpCell>
          )}

          {Taro.getEnv() !== "WEB" && (
            <View>
              {menuSetting.group && (
                <SpCell
                  title="我的拼团"
                  isLink
                  img={require("../../assets/imgs/group.png")}
                  onClick={() =>
                    this.handleClickWxOAuth(
                      this.navigateTo.bind(
                        this,
                        "/marketing/pages/member/group-list"
                      )
                    )
                  }
                ></SpCell>
              )}
              {menuSetting.community_order && (
                <SpCell
                  title="我的社区团购"
                  isLink
                  img={require("../../assets/imgs/group.png")}
                  onClick={() =>
                    this.handleClickWxOAuth(
                      this.navigateTo.bind(
                        this,
                        "/groupBy/pages/orderList/index"
                      )
                    )
                  }
                ></SpCell>
              )}
            </View>
          )}

          {Taro.getEnv() !== "WEB" && (
            <View>
              {menuSetting.boost_activity && (
                <SpCell
                  title="助力活动"
                  isLink
                  img={require("../../assets/imgs/group.png")}
                  onClick={() =>
                    this.handleClickWxOAuth(
                      this.navigateTo.bind(this, "/boost/pages/home/index")
                    )
                  }
                ></SpCell>
              )}
              {menuSetting.boost_order && (
                <SpCell
                  title="助力订单"
                  isLink
                  img={require("../../assets/imgs/group.png")}
                  onClick={() =>
                    this.handleClickWxOAuth(
                      this.navigateTo.bind(this, "/boost/pages/order/index")
                    )
                  }
                ></SpCell>
              )}
            </View>
          )}
          {menuSetting.offline_order && (
            <SpCell
              title="线下订单关联"
              isLink
              img={require("../../assets/imgs/group.png")}
              onClick={() =>
                this.handleClickWxOAuth(
                  this.navigateTo.bind(this, "/others/pages/bindOrder/index")
                )
              }
            ></SpCell>
          )}
          {menuSetting.complaint &&
            salespersonData &&
            salespersonData.distributor && (
              <SpCell
                title="投诉记录"
                isLink
                img={require("../../assets/imgs/group.png")}
                onClick={() =>
                  this.handleClickWxOAuth(
                    this.navigateTo.bind(
                      this,
                      "/marketing/pages/member/complaint-record"
                    )
                  )
                }
              ></SpCell>
            )}
          {menuSetting.activity && (
            <SpCell
              title="活动预约"
              isLink
              img={require("../../assets/imgs/buy.png")}
              onClick={() =>
                this.handleClickWxOAuth(
                  this.navigateTo.bind(
                    this,
                    "/marketing/pages/member/item-activity"
                  )
                )
              }
            ></SpCell>
          )}
          {score_menu_open && (
            <SpCell
              title={customName("积分商城")}
              isLink
              img={require("../../assets/imgs/score.png")}
              onClick={() =>
                this.handleClickWxOAuth(
                  this.navigateTo.bind(this, "/pointitem/pages/list")
                )
              }
            ></SpCell>
          )}
          {/* {
            menuSetting.activity && <SpCell
              title='活动预约'
              isLink
              img={require('../../assets/imgs/buy.png')}
              onClick={this.handleClick.bind(this, '/marketing/pages/member/coupon')}
            >
            </SpCell>
          }  */}
          {/* <SpCell
            title='入驻申请'
            isLink
            img='/assets/imgs/buy.png'
            onClick={this.handleClick.bind(this, '/subpage/pages/auth/store-reg')}
          >
          </SpCell>*/}
        </View>

        <View className="page-member-section">
          {Taro.getEnv() !== "WEB" && menuSetting.share_enable && (
            <SpCell title="我要分享" isLink>
              <Button className="btn-share" open-type="share"></Button>
            </SpCell>
          )}
          <SpCell
            title="地址管理"
            isLink
            onClick={() =>
              this.handleClickWxOAuth(
                this.navigateTo.bind(this, "/marketing/pages/member/address")
              )
            }
          ></SpCell>
          {menuSetting.memberinfo_enable && (
            <SpCell
              title="个人信息"
              isLink
              onClick={() =>
                this.handleClickWxOAuth(this.handleClickInfo.bind(this))
              }
            ></SpCell>
          )}
          {process.env.TARO_ENV === "h5" && (
            <SpCell
              title="设置"
              isLink
              onClick={() =>
                this.handleClickWxOAuth(
                  this.navigateTo.bind(this, "/marketing/pages/member/setting")
                )
              }
            ></SpCell>
          )}
        </View>

        {turntable_open === "1" ? (
          <View
            className="wheel-to"
            onClick={() =>
              this.handleClickWxOAuth(
                this.navigateTo.bind(this, "/marketing/pages/wheel/index")
              )
            }
          >
            <Image src={`${APP_IMAGE_CDN}/wheel_modal_icon.png`} />
          </View>
        ) : null}
        <TabBar />

        <SpFloatPrivacy
          isOpened={showPrivacy}
          onClose={() =>
            this.setState({
              showPrivacy: false,
              showTimes: this.state.showTimes + 1
            })
          }
        />
        <CouponModal visible={visible} list={all_card_list} onChange={this.handleCouponChange} />
      </View>
    );
  }
}
