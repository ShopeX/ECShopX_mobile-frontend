export default function withPointitem(Component) {
  return class WithPointitemComponent extends Component {
    constructor(props) {
      super(props)
    }

    isPointitem() {
      const options = getCurrentInstance().params
      return options.type === 'pointitem'
    }

    transformUrl(url, isPointitem = false) {
      if (isPointitem) {
        return `${url}&type=pointitem`
      }
      return url
    }
  }
}
