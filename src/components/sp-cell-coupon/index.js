import Taro, { useMemo, memo, useCallback } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { classNames } from '@/utils';
import { SpCell,SpNewCoupon } from '@/components'
import './index.scss';

const SpCellCoupon = (props) => {

    const {
        couponList:couponListProp = [],
        //展示多少个
        showCount=3
    } = props;

   

    const handleCouponClick = useCallback(() => {

    }, []);

    const couponList=useMemo(() => couponListProp.slice(0,showCount), [couponListProp,showCount]);

    if (couponList && couponList.length === 0) return null;

    return <SpCell
        title='领券'
        isLink
        onClick={handleCouponClick}
        className={'sp-components-cellcoupon'}
    >
        {couponList &&
            couponList.map((item) => {
                return (
                    <SpNewCoupon 
                        text={item.title}  
                        hasStatus={false}
                    />
                )
            })}
    </SpCell>
}

SpCellCoupon.options={
    addGlobalClass:true
}

export default memo(SpCellCoupon);