import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { classNames } from '@/utils'

import './index.scss';


export default class HomeCapsule extends Component {
    static defaultProps = {
        url: ''
    } 

    render() {
        const { className,point,plus,isGoodCard } = this.props
        const classes = classNames('point-line', className,{"plus":plus})

        return (
            <View className={classNames(classes,[
                {'isGoodCard':isGoodCard}
            ])}>
                <View class="number">
                    {point}
                </View>
                <View class="text">
                    积分
                  </View>
            </View>
        )
    }
}
