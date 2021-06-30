import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtButton } from 'taro-ui'
import S from "@/spx";
import api from "@/api";
import { showToast, classNames } from "@/utils";
import "./index.scss";

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

  async handleBindPhone( e ) {
    const { encryptedData, iv, cloudID } = e.detail;
    if (!encryptedData || !iv) {
      Taro.showModal({
        title: "授权提示",
        content: `需要您的授权才能购物`,
        showCancel: false,
        confirmText: "知道啦"
      });
      return false;
    }
    debugger
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
