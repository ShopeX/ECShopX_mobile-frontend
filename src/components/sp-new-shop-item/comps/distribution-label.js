import Taro,{ useState,memo } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { classNames } from '@/utils';
import './distribution-label.scss'; 

const DistributionLabel=(props)=>{

    const {
        children
    }=props;
 
    
    return (
        <View 
            className={classNames('distribution-label')} 
        >
            {children}
        </View>
    )
}

export default memo(DistributionLabel);