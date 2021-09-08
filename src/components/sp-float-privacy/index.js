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
          let userInfo = JSON.parse(res.response).response ;
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
          <View className="privacy-bd">
            您可以在“设置”中查看、变更、删除个人授权信息。
            如您同意，请点击“同意”开始接受我们的服务。
          </View>
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
