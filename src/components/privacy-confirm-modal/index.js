import Taro, { Component } from "@tarojs/taro";
import { View, Image, Button, Text } from "@tarojs/components";
import api from "@/api"

import "./index.scss"

export default class PrivacyConfirmModal extends Component {
  static defaultProps = {};
  constructor(props) {
    super(props)
    this.state = {
      info: null
    }
  }

  componentDidMount() {
    this.fetch()
  }

  handleClickAgreement = type => {
    Taro.navigateTo({
      url: "/subpage/pages/auth/reg-rule?type=" + type
    });
  };

  async fetch() {
    const data = await api.shop.getStoreBaseInfo()
    this.setState({
      info: data
    })
  }

  wexinBindPhone = async (e) => {
    const { encryptedData, iv } = e.detail
    const { onChange } = this.props
    if (encryptedData && iv) {
      Taro.setStorageSync("PrivacyUpdate_time", true)
    }
    onChange && onChange("agree", e);
  };

  render() {
    const { info } = this.state
    const { visible, onChange, isPhone } = this.props

    return (
      <View>
        {visible && (
          <View className='privacy-confirm-modal'>
            <View className='block'>
              <Image
                src={`${APP_IMAGE_CDN}/privacy_bck.png`}
                className='background'
              />
              <View className='container'>
                <View className='top'>
                  <Image
                    src={`${APP_IMAGE_CDN}/privacy_tips.png`}
                    className='tips'
                  />
                  <View>个人隐私保护指引</View>
                </View>
                <View className='content'>
                  <Text>
                    请您务必谨慎阅读，充分理解“用户协议”和“隐私政策”各条款。包括但不限于：为了向您提供更好的服务，我们须向您收集相关的个人信息。您可以在“个人信息”中查看、变更、删除、个人授权信息。您可阅读
                  </Text>
                  <Text
                    className='link'
                    onClick={this.handleClickAgreement.bind(this, 'privacy')}
                  >
                    《{info.protocol.member_register}》
                  </Text>
                  <Text>、</Text>
                  <Text
                    className='link'
                    onClick={this.handleClickAgreement.bind(this, 'privacy')}
                  >
                    《{info.protocol.privacy}》
                  </Text>
                  <Text>
                    了解详细信息。如您同意，请点击”同意“开始接受我们的服务。
                  </Text>
                </View>
                <View className='bottom'>
                  <Button className='cancel' onClick={() => onChange('reject')}>
                    拒绝
                  </Button>
                  {isPhone ? (
                    <Button
                      className='agree'
                      openType='getPhoneNumber'
                      onGetPhoneNumber={this.wexinBindPhone}
                    >
                      同意
                    </Button>
                  ) : (
                    <Button onClick={() => onChange('agree')}  className='agree'>
                      同意
                    </Button>
                  )}

                  {/* <Button onClick={() => onChange('agree')}>
                    <View className='agree'>同意</View>
                  </Button> */}
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}
