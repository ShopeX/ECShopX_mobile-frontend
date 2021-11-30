import Taro,{ useState,memo } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { classNames } from '@/utils';
import './index.scss'; 

const SpNewShopItem=(props)=>{

    const {
        title='我是标题'
    }=props;
 
    
    return (
        <View 
            className={classNames('sp-component-newshopitem')} 
        >
            
        </View>
    )
}

export default memo(SpNewShopItem);