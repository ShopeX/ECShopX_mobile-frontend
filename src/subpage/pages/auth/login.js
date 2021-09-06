import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { AtForm, AtInput, AtButton } from "taro-ui";

import { SpNavBar, SpTimer } from "@/components";
import api from "@/api";
import {
  getThemeStyle,
  styleNames,
  tokenParse,
  navigateTo,
  validate,
  showToast
} from "@/utils";
import { Tracker } from "@/service";

import "./login.scss";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      info: {},
      isVisible: false,
      imgInfo: null,
      loginType: 1 // 1=密码; 2=验证码
    };
  }

  componentDidMount() {
    this.getImageVcode();
  }

  navigateTo = navigateTo;

  handleTimerStart = async resolve => {
    const { imgInfo } = this.state;
    const { mobile, vcode } = this.state.info;
    if (!validate.isMobileNum(mobile)) {
      showToast("请输入正确的手机号");
      return;
    }
    if (!validate.isRequired(vcode)) {
      showToast("请输入图形验证码");
      return;
    }
    try {
      await api.user.regSmsCode({
        type: "login",
        mobile: mobile,
        yzm: vcode,
        token: imgInfo.imageToken
      });
      showToast("验证码已发送");
      resolve();
    } catch ( e ) {
      this.getImageVcode()
    }
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

  handleToggleLogin = () => {
    const { loginType } = this.state;
    this.setState({
      loginType: loginType == 1 ? 2 : 1
    });
  };

  getImageVcode = async () => {
    const img_res = await api.user.regImg({ type: "login" });
    this.setState({
      imgInfo: img_res
    });
  };

  async handleSubmit() {
    const { loginType } = this.state;
    const { mobile, password, vcode } = this.state.info;
    let params = {
      username: mobile
    };
    if (!validate.isMobileNum(mobile)) {
      showToast("请输入正确的手机号");
      return;
    }
    if (loginType == 1) {
      if (!validate.isRequired(password)) {
        showToast("请输入密码");
        return;
      }
      params["password"] = password;
    } else {
      if (!validate.isRequired(vcode)) {
        showToast("请输入验证码");
        return;
      }
      params["vcode"] = vcode;
      params["check_type"] = "mobile";
    }

    const { token } = await api.user.login(params);
  }

  render() {
    const { info, isVisible, loginType, imgInfo } = this.state;
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
            {/* 密码登录 */}
            {loginType == 1 && (
              <View className="form-field">
                <View className="input-field">
                  <AtInput
                    clear
                    name="password"
                    value={info.password}
                    placeholder="请输入密码"
                    onChange={this.handleInputChange.bind(this, "password")}
                  />
                </View>
              </View>
            )}
            {/* 验证码登录，验证码超过1次，显示图形验证码 */}
            {loginType == 2 && (
              <View className="form-field">
                <View className="input-field">
                  <AtInput
                    clear
                    name="vcode"
                    value={info.vcode}
                    placeholder="请输入图形验证码"
                    onChange={this.handleInputChange.bind(this, "vcode")}
                  />
                </View>
                <View className="btn-field">
                  {imgInfo && (
                    <Image
                      className="image-vcode"
                      src={imgInfo.imageData}
                      onClick={this.getImageVcode.bind(this)}
                    />
                  )}
                </View>
              </View>
            )}
            {loginType == 2 && (
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
            )}
            <View className="btn-text-group">
              <Text
                className="btn-text"
                onClick={this.handleToggleLogin.bind(this)}
              >
                {loginType == 1 ? "验证码登录" : "密码登录"}
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
