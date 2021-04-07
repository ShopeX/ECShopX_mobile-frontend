import Taro, { Component } from '@tarojs/taro'
import { View} from '@tarojs/components'
import { SearchBar } from '@/components'
import { classNames } from '@/utils'
import { toggleTouchMove } from '@/utils/dom'
import './search-home.scss'

export default class WgtSearchHome extends Component {
  static defaultProps = {
    isOpened: false
  }

  constructor(props) {
    super(props)

    this.state = {
     
    }
  }

  static options = {
    addGlobalClass: true
  }

  componentDidMount() {
    if (process.env.TARO_ENV === 'h5') {
      toggleTouchMove(this.refs.container)
    }
  }

  handleConfirm = (val) => {
    const url = `/guide/item/list?keywords=${val}&source=首页`
    Taro.navigateTo({
      url
    })


  }

  handleFocusSearchHistory = (e) => {
    e.stopPropagation()

  
    
  }

  render() {
    const { isShow } = this.props
  
    return (
      <View className={classNames(`'home-search__bar' ${!isShow ? 'hidden' : ''} `)}>
        
        <SearchBar
          focus={isShow}
          onConfirm={this.handleConfirm.bind(this)}
        />
       
      </View>




    )
  }
}
