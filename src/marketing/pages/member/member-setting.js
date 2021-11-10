import Taro, { Component } from "@tarojs/taro";
import { View, Button } from "@tarojs/components";
import req from "@/api/req";
import { SpCell } from "@/components";
import S from "@/spx";
import DestoryConfirm from './comps/destory-comfirm-modal';

import "./member-setting.scss";

export default class SettingIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectInfo: {},
      visible: false,
      title: '',
      content: '',
      confirmBtnContent: ''
    }
  }

  componentDidShow() {
    this.fetchRedirect();
  }

  config = {
    navigationBarTitleText: '设置'
  }

  // 获取积分个人信息跳转
  async fetchRedirect() {
    const url = `/pageparams/setting?template_name=yykweishop&version=v1.0.1&page_name=member_center_redirect_setting`;
    const { list = [] } = await req.get(url);
    if (list[0] && list[0].params) {
      this.setState({
        redirectInfo: list[0].params
      });
    }
    // this.setState({
    //   memberBanner:list
    // })
  }

  handleClickWxOAuth = (url, isLogin = false) => {
    if (!S.getAuthToken() && isLogin) {
      Taro.showToast({
        title: "请先登录",
        icon: "none"
      });
      return false;
    }
    Taro.navigateTo({ url });
  }

  handleClickInfo = () => {
    const { redirectInfo } = this.state;
    if (!S.getAuthToken()) {
      Taro.showToast({
        title: "请先登录",
        icon: "none"
      });
      return false;
    }
    if (redirectInfo.data && redirectInfo.data.info_url_is_open) {
      Taro.navigateToMiniProgram({
        appId: redirectInfo.data.info_app_id,
        path: redirectInfo.data.info_page
      });
    } else {
      this.handleClickWxOAuth("/marketing/pages/member/userinfo", true)
    }
  }

  async handleCancelMenber() {
    req.delete('/member', { is_delete: '0' }).then((res) => {
      if (!res.status) {
        this.setState({
          visible: true,
          title: '注销账号',
          content: res.msg,
          confirmBtnContent: '我知道了'
        })
      } else {
        this.handleClickWxOAuth(`/marketing/pages/member/destroy-member?phone=${res.msg}`, true)
      }
    })
  }

  handCancel = () => {
    // if (parmas === 'confirm') {
    //   // 我知道了
    //   this.handleClickWxOAuth("/marketing/pages/member/destroy-member", true)
    // }
    this.setState({ visible: false })
  }

  render() {
    const { visible, content, title, confirmBtnContent } = this.state
    return (
      <View className='member-setting'>
        <View className='page-member-section'>
          <SpCell
            title='个人信息'
            isLink
            onClick={this.handleClickInfo.bind(this)}
          ></SpCell>
          <SpCell
            title='地址管理'
            isLink
            onClick={this.handleClickWxOAuth.bind(
              this,
              '/marketing/pages/member/address',
              true
            )}
          ></SpCell>
          {S.getAuthToken() && (
            <Button className='button' onClick={this.handleCancelMenber.bind(this)}>
              注销账号
            </Button>
          )}
        </View>
        <DestoryConfirm visible={visible} content={content} title={title} confirmBtn={confirmBtnContent} onCancel={this.handCancel} />
      </View>
    );
  }
}
