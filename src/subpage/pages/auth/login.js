import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { AtForm, AtInput, AtButton } from "taro-ui";

import { SpNavBar, SpTimer } from "@/components";
import S from "@/spx";
import api from "@/api";
import {
  getThemeStyle,
  styleNames,
  tokenParse,
  navigateTo,
  validate
} from "@/utils";
import { Tracker } from "@/service";

import "./login.scss";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      info: {},
      isVisible: false
    };
  }

  componentDidMount() { }
  
  navigateTo = navigateTo

  handleTimerStart = async resolve => {
    const { mobile } = this.state.info;
    if (!validate.isMobileNum(mobile)) {
      showToast("请输入正确的手机号");
      return;
    }
    await api.operator.sendCode({
      mobile
    });
    showToast("验证码已发送");
    resolve();
  };

  handleTimerStop() {}

  handleInputChange(name, val) {
    const { info } = this.state;
    info[name] = val;
    this.setState({
      info
    });
  }

  handleNavLeftItemClick = () => {
    // const { redirect } = this.$router.params
    // if (redirect) {
    //   Taro.redirectTo({
    //     url: decodeURIComponent(redirect)
    //   })
    // }
    //
    // Taro.navigateBack()、
    Taro.redirectTo({
      url: process.env.APP_HOME_PAGE
    });
  };

  handleToggleLogin = () => {}

  async handleSubmit() {
    const { mobile, code } = this.state.info;
    if (!validate.isMobileNum(mobile)) {
      showToast("请输入正确的手机号");
      return;
    }
    if (!validate.isRequired(mobile)) {
      showToast("请输入验证码");
      return;
    }
    await api.operator.smsLogin({
      mobile,
      code,
      logintype: "smsstaff"
    });
  }

  render() {
    const { info, isVisible } = this.state;
    return (
      <View className="page-auth-login" style={styleNames(getThemeStyle())}>
        <SpNavBar onClickLeftIcon={this.handleNavLeftItemClick} title="登录" />
        <View className="auth-hd">
          <View className="title">欢迎登录</View>
          {/* <View className="desc">未注册的手机号验证后自动创建账号</View> */}
        </View>
        <View className="auth-bd">
          <View className="form-title">中国大陆 +86</View>
          <AtForm className="form">
            <View className="form-field">
              <AtInput
                clear
                name="mobile"
                maxLength={11}
                type="tel"
                value={info.mobile}
                placeholder="请输入您的手机号码"
                onChange={this.handleInputChange.bind(this, "mobile")}
              />
            </View>
            <View className="form-field">
              <View className="input-field">
                <AtInput
                  clear
                  name="vcode"
                  value={info.vcode}
                  placeholder="请输入验证码"
                  onChange={this.handleInputChange.bind(this, "vcode")}
                />
              </View>
              <View className="btn-field">
                <SpTimer
                  onStart={this.handleTimerStart.bind(this)}
                  onStop={this.handleTimerStop}
                />
              </View>
            </View>
            <View className="form-field">
              <View className="input-field">
                <AtInput
                  clear
                  name="vcode"
                  value={info.vcode}
                  placeholder="请输入验证码"
                  onChange={this.handleInputChange.bind(this, "vcode")}
                />
              </View>
              <View className="btn-field">
                <SpTimer
                  onStart={this.handleTimerStart.bind(this)}
                  onStop={this.handleTimerStop}
                />
              </View>
            </View>
            <View className="btn-text-group">
              <Text
                className="btn-text"
                onClick={this.handleToggleLogin.bind(this)}
              >
                密码登录
              </Text>
              <Text
                className="btn-text"
                onClick={this.navigateTo.bind(
                  this,
                  "`/subpage/pages/auth/reg`"
                )}
              >
                注册
              </Text>
            </View>
            <View className="form-submit">
              <AtButton
                circle
                type="primary"
                onClick={this.handleSubmit.bind(this)}
              >
                登录
              </AtButton>
            </View>
          </AtForm>
        </View>
        {/* <View className="auth-ft">
          <Image className="logo" mode="widthFix" src={LOGO} />
        </View> */}
      </View>
    );
  }
}
