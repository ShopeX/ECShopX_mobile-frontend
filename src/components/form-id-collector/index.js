/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /unite-vshop/src/components/form-id-collector/index.js
 * @Date: 2020-04-17 15:25:48
 * @LastEditors: Arvin
 * @LastEditTime: 2020-04-27 10:58:12
 */
import Taro, { Component } from '@tarojs/taro'
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
      const { children } = this.props
      return (
        {children}
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
