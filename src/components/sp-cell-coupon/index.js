import Taro, { useMemo, memo, useCallback } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { classNames } from '@/utils';
import { SpCell,SpNewCoupon } from '@/components';
import './index.scss';

const SpCellCoupon = (props) => {

    const {
        couponList:couponListProp = [],
        //展示多少个
        showCount=3,
        info
    } = props;
 

    const handleCouponClick = useCallback(() => {
        console.log("==info==",info)
        // return ;
        Taro.navigateTo({
            url: `/others/pages/home/coupon-home?distributor_id=${info.distributor_id}`
        })
    }, [info]);

    const couponList=useMemo(() => couponListProp.slice(0,showCount), [couponListProp,showCount]);

    if (couponList && couponList.length === 0) return null;

    return <SpCell
        title='领券'
        isLink
        onClick={handleCouponClick}
        commonStyle
    >
        {couponList &&
            couponList.map((item) => {
                return (
                    <SpNewCoupon 
                        text={item.title}  
                        hasStatus={false}
                        className={'margin-right-8'}
                    />
                )
            })}
    </SpCell>
}

SpCellCoupon.options={
    addGlobalClass:true
};

export default memo(SpCellCoupon);