import Taro, { Component } from '@tarojs/taro'
import { Image } from '@tarojs/components'
import { classNames } from '@/utils'
import './index.scss'

export default class AtTabslist extends Component {
    static options = {
        addGlobalClass: true
      }

    static defaultProps = {
        tabList: [],
        onClick: () => { }
    }
    constructor(props) {
        super(props)
        this.state = {
            current: 0,
        }
    }

    handleClick(value) {
        this.setState({
            current: value
        }, () => {
            this.props.onClick(value)
        })
    }

    render() {
        const { current } = this.state
        const { tabList } = this.props
        return (
            <View className='outer'>
                {tabList.map((item, index) => {
                    return (
                        <View
                            key={index}
                            className={classNames('tab_li', current === index ? 'checked' : '')}
                            onClick={this.handleClick.bind(this, index)}>
                            {item.tabTitle}
                        </View>
                    )
                })}
            </View>
        )
    }
}
