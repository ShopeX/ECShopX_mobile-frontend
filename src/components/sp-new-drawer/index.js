import Taro, { useState, memo,useEffect } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { classNames } from '@/utils';
import { SpPopup } from '@/components';
import './index.scss'; 

const SpNewDrawer = (props) => {

    const {
        className,
        visible,
        width = '84%',
        children,
        onClose=()=>{}
    } = props;

    const [loaded,setLoaded]=useState(false); 
    
    useEffect(() => {
        setLoaded(true);
    }, [])

    return loaded ? (
        <SpPopup
            visible={visible}
            right
            width={width}
            borderRadius
            onClose={onClose}
        >
            <View
                className={
                    classNames(
                        'sp-component-newdrawer',
                        className
                    )
                }
            >
                {children}
            </View>
        </SpPopup>
    ) : null;
}

export default memo(SpNewDrawer);