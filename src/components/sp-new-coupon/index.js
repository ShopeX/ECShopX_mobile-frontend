import Taro,{ useState,memo } from '@tarojs/taro';
import { View,Text } from '@tarojs/components';
import { classNames } from '@/utils';
import './index.scss'; 

const SpNewCoupon=(props)=>{

    const { 
        receiveText={ 
            unreceiveText:'领取',
            receiveText:'已领'
        },
        isReceive=false,
        text='',
        className
    }=props;

    //设置领取和未领取的文字
    const statusText=isReceive?receiveText.receiveText:receiveText.unreceiveText;
  
    return (
        <View 
            className={
                classNames(
                    'sp-component-newcoupon',
                    {
                        'receiveed':isReceive
                    },
                    className
                )} 
        >
            <View className={'border'}></View>
            <View className={'radius'}></View>
            <View className={'text'}>{text}</View>
            <View className={'status-text'}>{statusText}</View>
        </View>
    )
}

export default memo(SpNewCoupon);