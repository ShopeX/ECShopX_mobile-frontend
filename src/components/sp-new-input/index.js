import Taro,{ useState,memo } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { classNames,getNavbarHeight } from '@/utils';
import './index.scss'; 

const SpNewInput=(props)=>{

    const {
        placeholder='输入商家、商品'
    }=props; 
    
    return (
        <View 
            className={classNames('sp-component-newinput')} 
        > 
            <View className={classNames('sp-component-newinput-icon')}>
                <View className='iconfont icon-sousuo-01'></View>
            </View>
            <View className={classNames('sp-component-newinput-placeholder')}>
                <View className={'text'}>{placeholder}</View>
            </View>
        </View>
    )
}

export default memo(SpNewInput);