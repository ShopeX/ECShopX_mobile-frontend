// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Form, Button } from '@tarojs/components'
import { classNames } from '@/utils'
import { FormIds } from '@/service'
import S from '@/spx'

import './index.scss'

export default class FormIdCollector extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    sync: false,
    onClick: () => {}
  }

  static externalClasses = ['classes']

  handleSubmit = (e) => {
    if (!S.getAuthToken()) {
      return
    }
    const { formId } = e.detail
    const { sync } = this.props
    FormIds.collectFormIds(formId, sync)
  }

  render() {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      return (
        <Button
          hoverClass='none'
          className='form-id-collector__btn'
          formType='submit'
          onClick={this.props.onClick}
        >
          {this.props.children}
        </Button>
      )
    }

    return (
      <Form
        reportSubmit
        onSubmit={this.handleSubmit}
        className={classNames('form-id-collector', 'classes')}
      >
        <Button
          hoverClass='none'
          className='form-id-collector__btn'
          formType='submit'
          onClick={this.props.onClick}
        >
          {this.props.children}
        </Button>
      </Form>
    )
  }
}
