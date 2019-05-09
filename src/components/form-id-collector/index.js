import Taro, { Component } from '@tarojs/taro'
import { Form, Button } from '@tarojs/components'

import './index.scss'

export default class FormIdCollector extends Component {
  static options = {
    addGlobalClass: true
  }

  handleSubmit = (e) => {
    const { formId } = e.detail
    console.log(formId, e.detail)
  }

  render () {
    return (
      <Form
        reportSubmit
        onSubmit={this.handleSubmit}
      >
        <Button
          className='form-id-collector__btn'
          formType='submit'
        >
          <slot></slot>
        </Button>
      </Form>
    )
  }
}
