import Taro,{ useState,memo } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { classNames,getNavbarHeight } from '@/utils';
import './index.scss'; 

const SpNewNavbar=(props)=>{

    const {
        title='我是标题'
    }=props;

    const { navbarHeight,statusBarHeight }=getNavbarHeight();
    
    return (
        <View 
            className={classNames('sp-component-newnavbar')}
            style={{height:`${navbarHeight}px`,paddingTop:`${statusBarHeight}px`}}
        >
            <View className={classNames('sp-component-newnavbar-back')}>
                <Text className={'iconfont icon-fanhui'}></Text>
            </View>
            <View className={classNames('sp-component-newnavbar-title')}>
                {title}
            </View>
        </View>
    )
}

export default memo(SpNewNavbar);