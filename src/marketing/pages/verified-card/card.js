import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import {
  View,
  Text,
  Image,
  Navigator,
  Form,
  Button,
  Picker,
} from "@tarojs/components";
import { AtInput, AtButton, AtList, AtListItem } from "taro-ui";
import S from "@/spx";
import { connect } from "react-redux";
import { SpNavBar, SpToast } from "@/components";
import api from "@/api";
import req from "@/api/req";
import { pickBy, classNames } from "@/utils";
// import bankData from './hfpayBankData.json'

import "./verified.scss";

@connect(({ colors }) => ({
  colors: colors.current,
}))
export default class DistributionDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {},
      multiIndex: [],
      isTrue: false,
      areaList: [],
      selectorChecked: [],
      bankData: null,
    };
  }
  async componentDidMount() {
    const { colors } = this.props;
    Taro.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: colors.data[0].marketing,
    } );
    Taro.request({
      url: `${process.env.APP_IMAGE_CDN}/hfpayBankData.json`,
    }).then((res) => {
      this.setState({
        bankData: res.data,
      });
    });

    this.fetch();
  }

  handleInput(type, val) {
    let info = this.state.info;
    info[type] = val;
    this.setState({
      info,
    });
  }

  handleSubmit(e) {
    let { info } = this.state;
    if (!info.bank_id) {
      return S.toast("请选择银行");
    }

    if (!info.card_num || !/^[1-9]\d{9,29}$/.test(info.card_num)) {
      return S.toast("请输入正确的银行卡号");
    }

    let obj = {
      bank_name: info.bank_name,
      card_num: info.card_num,
      bank_id: info.bank_id,
    };
    api.member.hfpayBankSave(obj).then((res) => {
      Taro.showToast({
        title: "提交成功等待审核",
        icon: "success",
        duration: 2000,
      });
      this.setState({
        isTrue: true,
      });
    });
  }

  async fetch() {
    const res = await api.member.hfpayBankInfo();
    const info = pickBy(res, {
      card_num: "card_num",
      bank_id: "bank_id",
      bank_name: "bank_name",
    });
    if (info.card_num) {
      this.setState({
        info,
        isTrue: true,
      });
    }
  }

  handleChange( e ) {
    const { bankData } = this.state
    let bank_name = bankData[e.detail.value].bank_name;
    let bank_id = bankData[e.detail.value].bank_code;
    let { info } = this.state;
    info = { ...info, bank_name, bank_id };
    this.setState({
      info,
    });
  }

  render() {
    const { colors } = this.props;
    const { info, isTrue, bankData } = this.state;
    return (
      <View className="page-distribution-index">
        <SpNavBar title="绑定银行卡" leftIconType="chevron-left" />

        <View className="page-bd">
          <Form onSubmit={this.handleSubmit}>
            <View className="">
              <AtInput
                disabled={isTrue}
                title="银行卡号"
                type="number"
                placeholder="银行卡号"
                value={info.card_num}
                onChange={this.handleInput.bind(this, "card_num")}
              />
            </View>
            <View className="bt">
              {/* <AtInput
                                    
                                    title='银行'
                                    disabled={isTrue}
                                    type='text'
                                    placeholder='所属银行'
                                    value={info.bankName}
                                    onChange={this.handleInput.bind(this, 'bankName')}
                                /> */}
              <Picker
                mode="selector"
                range={bankData}
                rangeKey="bank_name"
                onChange={this.handleChange.bind(this)}
              >
                <View className="picker">
                  <View className="picker__title">银行</View>
                  <Text
                    className={classNames(
                      info.bank_id ? "pick-value" : "pick-value-null"
                    )}
                  >
                    {info.bank_name ? info.bank_name : `请选择`}
                  </Text>
                </View>
              </Picker>
            </View>

            {/* <View className=''>
                                <Picker mode='date' onChange={this.handleInput.bind(this, 'startDate',0)} >
                                    <AtList>
                                        <AtListItem title='证件起始日期' extraText={info.startDate}/>
                                    </AtList>
                                    
                                </Picker>
                            </View>
                            <View className=''>
                                <Picker mode='date' onChange={this.handleInput.bind(this, 'endDate',0)} required>
                                    <AtList>
                                        <AtListItem title='证件结束日期' extraText={info.endDate}/>
                                    </AtList>
                                </Picker>
                            </View>
                            <View className='bt'>
                                <Picker
                                    mode='multiSelector'
                                    onClick={this.handleClickPicker}
                                    onChange={this.bindMultiPickerChange}
                                    onColumnChange={this.bindMultiPickerColumnChange}
                                    value={multiIndex}
                                    range={areaList}
                                >
                                    <AtList>
                                        <AtListItem
                                            title='选择地区'
                                            extraText={this.state.selectorChecked}
                                        />
                                    </AtList>
                                   

                                </Picker>
                            </View> */}

            <View className="btn">
              {process.env.TARO_ENV === "weapp" ? (
                <View>
                  <Button
                    className="submit-btn"
                    type="primary"
                    formType="submit"
                    disabled={isTrue}
                    style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary}`}
                  >
                    提交
                  </Button>
                </View>
              ) : (
                <Button
                  type="primary"
                  disabled={isTrue}
                  onClick={this.handleSubmit}
                  formType="submit"
                  style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary}`}
                >
                  提交
                </Button>
              )}
              <SpToast />
            </View>
          </Form>
        </View>
      </View>
    );
  }
}
