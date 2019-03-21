import Taro from '@tarojs/taro'
import S from '@/spx'

const LIFE_CYCLE_TYPES = {
  WILL_MOUNT: 0,
  DID_MOUNT: 1,
  DID_SHOW: 2
}

export default function withLogin (next, lifeCycle = LIFE_CYCLE_TYPES.WILL_MOUNT) {
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
          const res = await this.__autoLogin()
          if (!res) return

          if (super.componentWillMount) {
            super.componentWillMount()
          }
        }
      }

      async componentDidMount () {
        if (lifeCycle === LIFE_CYCLE_TYPES.DID_MOUNT) {
          const res = await this.__autoLogin()
          if (!res) return

          if (super.componentDidMount) {
            super.componentDidMount()
          }
        }
      }

      async componentDidShow () {
        if (lifeCycle === LIFE_CYCLE_TYPES.DID_SHOW) {
          const res = await this.__autoLogin()
          if (!res) return

          if (super.componentDidShow) {
            super.componentDidShow()
          }
        }
      }

      async __autoLogin () {
        return await S.autoLogin(this)
      }
    }
  }
}
