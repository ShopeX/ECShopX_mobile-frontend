import Taro, { Component } from '@tarojs/taro'
import { View, Form, Button } from '@tarojs/components'
import { classNames } from '@/utils'
import { FormIds } from '@/service'

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
          plain
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
