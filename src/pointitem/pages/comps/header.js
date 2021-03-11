/*
 * @Author: your name
 * @Date: 2021-02-25 13:14:46
 * @LastEditTime: 2021-02-25 19:32:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/work/ecshopx-vshop/src/pages/pointitem/comps/header.js
 */
import Taro ,{ Component } from '@tarojs/taro';
import { View,Image } from '@tarojs/components';

import './header.scss';


export default class Header extends Component{

    constructor(props){
        super(props);

        this.state={

        }
    }
    

    render(){
        const {useInfo:{username,avatar,point}}=this.props;
        
        return (
            <View class="header">
                <View class='avatar'>
                    <Image src={avatar} />
                </View>
                <View class='name'>{username}</View>
                <View class='score'>
                    <View class='score_num'>{point}</View>
                    <View class='score_description'>积分</View>
                </View>
            </View>
        )
    }
 
    
}