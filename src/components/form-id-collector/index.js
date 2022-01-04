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

  render () {
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
