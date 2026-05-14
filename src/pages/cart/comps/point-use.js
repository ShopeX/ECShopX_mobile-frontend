/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import { View, Text, Button } from '@tarojs/components'
import { connect } from 'react-redux'
import { AtFloatLayout, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import { SpCheckbox, SpInput as AtInput } from '@/components'
import { DEFAULT_POINT_NAME } from '@/consts'
import { $t, ti, i18n } from '@/i18n'
import './point-use.scss'

@connect(({ sys, colors }) => ({
  colors: colors.current,
  pointName: sys.pointName
}))
export default class PointUse extends Component {
  static defaultProps = {
    isOpened: false,
    disabledPoint: false
  }

  constructor(props) {
    super(props)

    this.state = {
      isOpenRule: false,
      point: null,
      localType: props.type
    }
  }

  componentDidMount() {
    this._onLanguageChanged = () => this.forceUpdate()
    i18n.on('languageChanged', this._onLanguageChanged)
  }

  componentWillUnmount() {
    if (this._onLanguageChanged) {
      i18n.off('languageChanged', this._onLanguageChanged)
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.type !== this.props.type) {
      this.setState({
        localType: nextProps.type
      })
    }
  }

  static options = {
    addGlobalClass: true
  }

  handleCancel = () => {
    this.setState({
      localType: this.props.type
      //point:null
    })
    this.props.onClose()
  }

  handleRuleOpen = () => {
    this.setState({
      isOpenRule: true
    })
  }

  handleRuleClose = () => {
    this.setState({
      isOpenRule: false
    })
  }
  handlePointChange = (value) => {
    const { info, defalutPaytype } = this.props
    const max_point = Number(info.max_point)
    if (value >= max_point) {
      this.setState({
        localType: info.deduct_point_rule.full_amount ? 'point' : defalutPaytype,
        point: max_point
      })
      return max_point
    }
    this.setState({
      point: Number(value) > max_point ? max_point : value,
      localType: info.deduct_point_rule.full_amount
        ? Number(value) === max_point
          ? 'point'
          : defalutPaytype
        : defalutPaytype
    })
  }

  handleUseFullAmount = (checked) => {
    const { info } = this.props
    const { localType } = this.state
    this.setState({
      point: checked ? info.max_point : '',
      disabledPoint: checked ? true : false,
      localType: checked ? 'point' : localType
    })
  }

  handleChange = (point, pay_type) => {
    this.props.onChange(point, pay_type)
  }

  render() {
    const { info, isOpened, loading, colors, pointName } = this.props
    const { point, isOpenRule, disabledPoint, localType } = this.state
    if (!info) {
      return null
    }
    const { deduct_point_rule = {} } = info
    return (
      <View>
        <AtFloatLayout isOpened={isOpened}>
          <View className='point-use'>
            <View className='point-use__hd'>
              <Text>{pointName}</Text>
              <Text className='rule-title' onClick={this.handleRuleOpen}>
                {$t('b232790d.1ebbd6')}
              </Text>
              <View className='iconfont icon-close' onClick={this.handleCancel}></View>
            </View>
            <View className='point-use__bd'>
              <View className='point-item'>
                <View className='point-item__title'>{ti('b232790d.21e511', [pointName])}</View>
                <View className='point-item__desc'>{info.user_point}</View>
              </View>
              <View className='point-item border'>
                <View className='point-item__title'>{ti('b232790d.85cbb1', [pointName])}</View>
                <View className='point-item__desc'>{info.max_point}</View>
              </View>
              <View className='point-item'>
                <View className='point-item__title'>{ti('b232790d.39033b', [pointName])}</View>
                <View className='point-item__desc'>
                  <AtInput
                    type='number'
                    title=''
                    value={
                      info.real_use_point
                        ? info.real_use_point < info.point_use
                          ? info.real_use_point
                          : info.point_use
                        : null
                    }
                    //disabled={localType === 'point' ? true :false}
                    onChange={this.handlePointChange.bind(this)}
                  />
                </View>
              </View>

              {deduct_point_rule && deduct_point_rule.full_amount && info.max_point > 0 && (
                <View className='point-item'>
                  <View className='point-item__title'>
                    <SpCheckbox
                      colors={colors}
                      checked={localType === 'point'}
                      onChange={this.handleUseFullAmount}
                    >
                      {$t('b232790d.a23745')}
                    </SpCheckbox>
                  </View>
                </View>
              )}
            </View>
            <Button
              type='primary'
              className='btn-submit'
              style={`background: ${colors}; border-color: ${colors};`}
              loading={loading}
              onClick={this.handleChange.bind(this, point, localType)}
            >
              {$t('b232790d.38cf16')}
            </Button>
          </View>
        </AtFloatLayout>
        <AtModal isOpened={isOpenRule}>
          <AtModalHeader>{$t('b232790d.117486')}</AtModalHeader>
          <AtModalContent>
            <View>{$t('b232790d.2f99a3')}</View>
            <View>
              {ti('b232790d.1daa7a', [
                DEFAULT_POINT_NAME(),
                deduct_point_rule.deduct_proportion_limit
              ])}
            </View>
            <View>{$t('b232790d.9b017d')}</View>
            <View>{ti('b232790d.73401f', [deduct_point_rule.deduct_point, pointName])}</View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.handleRuleClose}>{$t('b232790d.fe0337')}</Button>
          </AtModalAction>
        </AtModal>
      </View>
    )
  }
}
