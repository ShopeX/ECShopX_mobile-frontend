import { log } from '@/utils'
import throttle from 'lodash/throttle'

export default function withBackToTop (Component) {
  return class WithBackToTopComponent extends Component {
    constructor (props) {
      super(props)

      this.state = {
        ...this.state,
        scrollTop: null,
        showBackToTop: false
      }
    }

    scrollBackToTop = () => {
      // workaround
      this.setState({
        scrollTop: 1
      }, () => {
        // this.setState({
        //   scrollTop: null
        // })
      })
    }

    handleScroll = throttle((e) => {
      const { scrollTop, scrollHeight } = e.detail
      const offset = 300

      this.setState({
        scrollTop
      })

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
