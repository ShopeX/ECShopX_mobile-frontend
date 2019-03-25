import Taro from '@tarojs/taro'
import S from '@/spx'

const LIFE_CYCLE_TYPES = {
  WILL_MOUNT: 0,
  DID_MOUNT: 1,
  DID_SHOW: 2
}

export default function withLogin (nextFn, lifeCycle = LIFE_CYCLE_TYPES.WILL_MOUNT) {
  if (LIFE_CYCLE_TYPES[lifeCycle] !== undefined) {
    console.warn(`lifeCycle is not in defined types: ${lifeCycle}`)
    return Component => Component
  }

  return function withLoginComponent (Component) {
    return class WithLogin extends Component {
      constructor (props) {
        super(props)
      }

      async componentWillMount () {
        if (lifeCycle === LIFE_CYCLE_TYPES.WILL_MOUNT) {
          const res = await this.$__autoLogin()
          if (!res) return

          if (super.componentWillMount) {
            super.componentWillMount()
          }
        } else {
          const done = await this.$__autoLoginDone()
          if (super.componentWillMount && done) {
            super.componentWillMount()
          }
        }
      }

      async componentDidMount () {
        if (lifeCycle === LIFE_CYCLE_TYPES.DID_MOUNT) {
          const res = await this.$__autoLogin()
          if (!res) return

          if (super.componentDidMount) {
            super.componentDidMount()
          }
        } else {
          const done = await this.$__autoLoginDone()
          if (super.componentDidMount && done) {
            super.componentDidMount()
          }
        }
      }

      async componentDidShow () {
        if (lifeCycle === LIFE_CYCLE_TYPES.DID_SHOW) {
          const res = await this.$__autoLogin()
          if (!res) return

          if (super.componentDidShow) {
            super.componentDidShow()
          }
        } else {
          const done = await this.$__autoLoginDone()
          if (super.componentDidShow && done) {
            super.componentDidShow()
          }
        }
      }

      async $__autoLogin () {
        this.$__autoLogin_state = 'pending'
        let res
        try {
          res = this.$__autoLogin_res = await S.autoLogin(this)
          this.$__autoLogin_state = !res ? 'fail' : 'success'
        } catch (e) {
          this.$__autoLogin_state = 'fail'
        }

        return res
      }

      $__autoLoginDone () {
        // if (this.$__autoLogin_state === 'success') return Promise.resolve(true)
        // if (this.$__autoLogin_state === 'fail') return Promise.resolve(false)
        let timer
        let cnt = 8

        return new Promise((resolve) => {
          const next = () => {
            if (timer) clearTimeout(timer)
            timer = setTimeout(() => {
              const state = this.$__autoLogin_state
              if (state === 'success' || state === 'fail') {
                clearTimeout(timer)
                timer = null
                resolve(state === 'success' ? true : false)
              } else if (cnt > 0) {
                cnt--
                next()
              } else {
                resolve(false)
              }
            }, 70)
          }

          next()
        })
      }
    }
  }
}
