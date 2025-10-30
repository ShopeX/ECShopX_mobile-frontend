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
import { log } from '@/utils'
import throttle from 'lodash/throttle'

export default function withBackToTop(Component) {
  return class WithBackToTopComponent extends Component {
    constructor(props) {
      super(props)

      this.state = {
        ...this.state,
        scrollTop: null,
        showBackToTop: false
      }
    }

    scrollBackToTop = () => {
      // workaround
      this.setState(
        {
          scrollTop: 1
        },
        () => {
          if (process.env.TARO_ENV === 'weapp') {
            // workaround for weapp
            this.setState({
              scrollTop: null
            })
          }
        }
      )
    }

    handleScroll = throttle((e) => {
      const { scrollTop, scrollHeight } = e.detail
      const offset = 300
      // this.setState({
      //   scrollTop
      // })

      if (scrollHeight < 600) return
      if (scrollTop > offset && !this.state.showBackToTop) {
        log.debug(`[BackToTop] showBackToTop, scrollTop: ${scrollTop}`)
        this.setState({
          showBackToTop: true
        })
      } else if (this.state.showBackToTop && scrollTop <= offset) {
        log.debug(`[BackToTop] hideBackToTop, scrollTop: ${scrollTop}`)
        this.setState({
          showBackToTop: false
        })
      }
    }, 70)
  }
}
