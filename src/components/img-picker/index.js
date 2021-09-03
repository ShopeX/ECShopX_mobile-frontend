import {
    AtImagePicker,
} from 'taro-ui';
import { isAlipay } from '@/utils';
import { View } from '@tarojs/components';
import { useCallback } from '@tarojs/taro';
import imgUploader from '@/utils/upload'
import "./index.scss"

const ImgPicker = (props) => {

    const {
        onChange
    } = props;

    const handleClickImg = useCallback(
        () => {
            my.chooseImage({
                sourceType: ['camera', 'album'],
                count: 2,
                success: (res) => { 
                    const resultFiles=res.apFilePaths.map(item=>({
                        url:item,
                        file:item
                    }))
                    console.log("---Res--",res)
                    imgUploader.uploadImageFn(resultFiles)
                    .then(res => {
                      console.log("---uploadImageFn res---",res)
                      
                    })
                },
                fail: () => { 
                }
            })
        },
        [],
    )

    return (
        <View className={'sp-img-picker'}>
            <View className={'sp-img-picker__flexbox'}>
                <View className={'sp-img-picker__flexbox-item'} onClick={handleClickImg} >
                    <View className={'sp-img-picker-item choose-btn'}>
                        <View className={'add-bar'}></View>
                        <View className={'add-bar'}></View>
                    </View>
                </View>
            </View>
        </View>
    )
};


export default isAlipay ? ImgPicker : <View></View>