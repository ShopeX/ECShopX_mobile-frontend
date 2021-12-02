import Taro,{ useState,memo } from '@tarojs/taro';
import { View ,Text} from '@tarojs/components';
import { classNames,getNavbarHeight } from '@/utils';
import './index.scss'; 

const SpNewPrice=(props)=>{

    const {
        title='我是标题'
    }=props;
 
    
    return (
        <View 
            className={classNames('sp-component-newprice')}
        >
             
        </View>
    )
}

export default memo(SpNewPrice);