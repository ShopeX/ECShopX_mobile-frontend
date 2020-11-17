
import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView } from '@tarojs/components'
import { classNames } from '@/utils'
import { linkPage } from './helper'
import './floor-img.scss'

export default class WgtFloorImg extends Component {
  static options = {
    addGlobalClass: true
  }

    static defaultProps = {
        info: {}
    }

    constructor(props) {
        super(props)
    }
    onRoute = linkPage


    render() {

        const { info } = this.props
        const { name, base, data } = info

        return (
            <View className={`index ${info.base.padded ? 'wgt__padded' : null}`}>

                {/* 1 */}
                {name === 'floorImg' && <View>
                    <View className={classNames('exclusive_list_one', 'exclusive_list')}>
                        <View className='img_list'>
                            <Image
                                className='img'
                                src={base.backgroundImg}
                                style='width:100%;height:100%;'></Image>
                            {data.map((item, idx) => {
                                return (
                                    <View className='lis' key={idx} onClick={this.onRoute.bind(this, item.linkPage, item.id)}>
                                        <Image
                                            src={item.imgUrl}
                                            style='width:100%;height:100%;'
                                        ></Image>
                                        <View className='title' style={'color:' + base.WordColor}>{item.ImgTitle}</View>
                                    </View>
                                )
                            })}</View>
                    </View>
                </View>
                }

                {/* 2 */}
                {name === 'floorImg-two' && <View>
                    <View className={classNames('exclusive_list_two', 'exclusive_list', base.padded ? 'wgt__padded' : null)}>
                        <ScrollView scrollX className='img_list'>
                            {data.map((item, idx) => {
                                return (
                                    <View className='lis' key={idx} onClick={this.onRoute.bind(this, item.linkPage, item.id)}>
                                        <Image
                                            className='img'
                                            src={item.imgUrl}
                                        ></Image>
                                        <View className='title' style={'color:' + base.WordColor}>{item.ImgTitle}</View>
                                    </View>
                                )
                            })}</ScrollView>
                    </View>
                </View>}

            </View>
        )
    }
}
