/*
 * @Author: your name
 * @Date: 2021-02-25 13:14:46
 * @LastEditTime: 2021-02-25 17:48:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/work/ecshopx-vshop/src/pages/pointitem/comps/header.js
 */
import Taro ,{ Component } from '@tarojs/taro';
import { View,Image } from '@tarojs/components';

import './goods_item.scss';


export default class GoodsItem extends Component{

    static defaultProps = {
        onClick: () => {}, 
    }

    constructor(props){
        super(props);

        this.state={

        }
    }
    
    handleClick=()=>{ 
        const { onClick }=this.props;
        if(onClick){
            onClick()
        }
    }

    render(){
        const { info }=this.props;
        
        return (
            <View class="goods_item" onClick={this.handleClick}>
                <View class="goods_item_image" >
                    <Image src={info.imgUrl} />
                </View>
                <View class="goods_item_name">
                    {info.item_name}
                </View>
                <View class="goods_item_score">
                    <View class="number">{info.point}</View>
                    <View class="title">积分</View>
                </View>
            </View>
        )
    }
 
    
}