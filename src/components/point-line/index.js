import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { classNames } from '@/utils'
import {
    customName
} from '@/utils/point';
import './index.scss';


export default class HomeCapsule extends Component {
    static defaultProps = {
        url: ''
    }

    render() {
        const { className, point, plus, isGoodCard, isStoreOut } = this.props
        const classes = classNames('point-line', className, { "plus": plus })

        return (
            <View className={classNames(classes, [
                { 'isGoodCard': isGoodCard },
                { 'isStoreOut': isStoreOut },
            ])}>
                <View class="number">
                    {point}
                </View>
                <View class="text">
                    {customName("积分")}
                </View>
            </View>
        )
    }
}
