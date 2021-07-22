import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtButton } from 'taro-ui'
import S from "@/spx";
import api from "@/api";
import { showToast, classNames, tokenParse } from "@/utils";
import { Tracker } from "@/service";
import "./index.scss";

@connect(
  () => ({}),
  dispatch => ({
    setMemberInfo: memberInfo =>
      dispatch({ type: "member/init", payload: memberInfo })
  })
)
export default class SpLogin extends Component {
  static options = {
    addGlobalClass: true
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  handleGetUserProfile = () => {
    wx.getUserProfile({
      desc: "用于完善会员资料",
      success: data => {
        this.handleGetUserInfo(data);
      }
    });
  };

  async handleBindPhone(e) {
    const { encryptedData, iv, cloudID } = e.detail;
    if (encryptedData && iv) {
      // 推广用户uid
      const uid = Taro.getStorageSync("distribution_shop_id");
      const trackParams = Taro.getStorageSync("trackParams");
      // 导购id
      const salesperson_id = Taro.getStorageSync("s_smid");
      // 新导购信息处理
      const work_userid = Taro.getStorageSync("work_userid");
      const { code } = await Taro.login();
      const params = {
        code,
        encryptedData,
        iv,
        cloudID,
        user_type: "wechat",
        auth_type: "wxapp"
      };

      if (salesperson_id) {
        params.distributor_id = Taro.getStorageSync("s_dtid");
        params.salesperson_id = salesperson_id;
      }

      if (work_userid) {
        params.channel = 1;
        params.work_userid = work_userid;
      }

      if (trackParams) {
        params.source_id = trackParams.source_id;
        params.monitor_id = trackParams.monitor_id;
      }

      if (uid) {
        params.inviter_id = uid;
        params.uid = uid;
      }

      const { token, is_new } = await api.wx.newlogin(params);
      if (token) {
        S.setAuthToken(token);
        if (work_userid) {
          api.user.uniquevisito({
            work_userid: work_userid
          });
          const gu_user_id = Taro.getStorageSync("gu_user_id");
          if (gu_user_id) {
            api.user.bindSaleperson({
              work_userid: work_userid
            });
          }
        }

        // 通过token解析openid
        const { user_id, openid, unionid } = tokenParse(token);
        Tracker.setVar({
          user_id: user_id,
          open_id: openid,
          union_id: unionid
        });

        // const memberInfo = await api.member.memberInfo();
        // this.props.setMemberInfo( memberInfo )
        this.props.onChange && this.props.onChange()
      }
    }
  }

  handleOnChange() {
    this.props.onChange();
  }

  render() {
    const token = S.getAuthToken();
    return (
      <View className={classNames("sp-login", this.props.className)}>
        {token && (
          <View onClick={this.handleOnChange.bind(this)}>
            {this.props.children}
          </View>
        )}

        {!token && (
          <AtButton
            className="login-btn"
            openType="getPhoneNumber"
            onGetPhoneNumber={this.handleBindPhone.bind(this)}
          >
            {this.props.children}
          </AtButton>
        )}

        {/* {!token && (
          <AtButton
            lang="zh_CN"
            className="userinfo-btn"
            onClick={this.handleGetUserProfile.bind(this)}
          >
            {this.props.children}
          </AtButton>
        )} */}
      </View>
    );
  }
}
