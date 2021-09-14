import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtButton, AtFloatLayout } from "taro-ui";
import S from "@/spx";
import api from "@/api";
import { isWeixin, isAlipay, classNames, showToast, navigateTo } from "@/utils";
import { Tracker } from "@/service";
import "./index.scss";

@connect(
  () => ({}),
  dispatch => ({
    setMemberInfo: memberInfo =>
      dispatch({ type: "member/init", payload: memberInfo })
  })
)
export default class SpFloatPrivacy extends Component {
  static options = {
    addGlobalClass: true
  };

  static defaultProps = {
    isOpened: false,
    wxUserInfo: true,
    callback: () => { },
    onClose: () => { },
    onConfirm: () => { },
    onChange: () => { }
  };

  constructor(props) {
    super(props);
    this.state = {
      info: null
    };
  }

  componentDidMount() {
    this.fetch();
  }

  async fetch() {
    const data = await api.shop.getStoreBaseInfo();
    this.setState({
      info: data
    });
  }

  navigateTo = navigateTo;

  handleCancel() {
    this.props.onClose();
  }

  handleValidate = (fn) => {
    this.handleCancel();
    if (this.props.wxUserInfo) {
      fn && fn();
    } else {
      this.props.onChange();
    }
    Taro.setStorageSync('Privacy_agress', "1")
  }

  handleConfirm() {
    this.handleValidate(() => {
      S.OAuthWxUserProfile(() => {
        this.props.onChange();
      }, true);
    });
  }

  handleConfirmAlipay = (e) => {
    this.handleValidate(() => {
      if (!S.getAuthToken()) {
        showToast('请先登录')
        return
      }
      my.getOpenUserInfo({
        fail: (res) => {
        },
        success: async (res) => {
          let userInfo = JSON.parse(res.response).response;
          await api.member.updateMemberInfo({
            username: userInfo.nickName,
            avatar: userInfo.avatar
          });
          await S.getMemberInfo();
          this.props.onChange();
        }
      });
    });
  }

  render() {
    const { isOpened } = this.props;
    const { info } = this.state;
    if (!info) {
      return null;
    }
    return (
      <View
        className={classNames(
          "sp-float-privacy",
          {
            "sp-float-privacy__active": isOpened
          },
          this.props.className
        )}
      >
        <View className="sp-float-privacy__overlay"></View>
        <View className="sp-float-privacy__wrap">
          <View className="privacy-hd">个人隐私保护指引</View>

          {isWeixin && <View className="privacy-bd">
            请您务必审慎阅读、充分理解“服务协议”和“隐私政策”各条款，包括但不限于：为了向您提供更好的服务，我们须向您收集设备信息、操作日志等个人信息。您可以在“设置”中查看、变更、删除个人授权信息。
            您可阅读
            <Text
              className="privacy-txt"
              onClick={this.navigateTo.bind(
                this,
                "/subpage/pages/auth/reg-rule?type=member_register"
              )}
            >
              《{info.protocol.member_register}》
            </Text>
            、
            <Text
              className="privacy-txt"
              onClick={this.navigateTo.bind(
                this,
                "/subpage/pages/auth/reg-rule?type=privacy"
              )}
            >
              《{info.protocol.privacy}》
            </Text>
            了解详细信息。如您同意，请点击“同意”开始接受我们的服务。

            您可以在“设置”中查看、变更、删除个人授权信息。
            如您同意，请点击“同意”开始接受我们的服务。
          </View>}

          {isAlipay && <View className="privacy-bd">
            您可以在“设置”中查看、变更、删除个人授权信息。
            如您同意，请点击“同意”开始接受我们的服务。
          </View>}
          
          <View className="privacy-ft">
            <View className="btn-wrap">
              <AtButton onClick={this.handleCancel.bind(this)}>不同意</AtButton>
            </View>
            <View className="btn-wrap">
              {isWeixin && <AtButton type="primary" onClick={this.handleConfirm.bind(this)}>同意</AtButton>}
              {isAlipay && <Button className='ali-button' openType="getAuthorize" scope='userInfo' onGetAuthorize={this.handleConfirmAlipay}>同意</Button>}
            </View>
          </View>
        </View>
      </View>
    );
  }
}
