import Taro, { useMemo, memo, useState,useCallback } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { classNames } from '@/utils';
import { DistributionLabel } from './comps';
import { SpNewCoupon, SpNewPrice } from '@/components';
import './index.scss';
const ImageSRC = 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg'

const SpNewShopItem = (props) => {

    const {
        title = 'ShopX徐汇区田尚坊钦州北路店ShopX徐汇区田尚坊钦州北路店', 
        className = '', 
        inSearch = false,
        goodList = [
            { img: ImageSRC, originPrice: 4, price: 3 },
            { img: ImageSRC, price: 12 },
            { img: ImageSRC, originPrice: 9.8, price: 10 },
            { img: ImageSRC, originPrice: 4, price: 3 },
            { img: ImageSRC, price: 12 },
            { img: ImageSRC, originPrice: 9.8, price: 10 },
        ],
        info = {
            discountCardList: [],
            marketingActivityList: [],
            scoreList:{}
        },
        //默认优惠券展示3条
        discountCount = 3,
        //优惠券最多展示多少条
        maxDiscountCount = 6,
        //营销活动默认展示多少条
        activityCount = 1,
        //营销活动最多展示多少条
        maxActivityCount = 10
    } = props;

    const distance = useMemo(() => {
        const dis = info.distance
        //km为单位米
        if (dis < 1) {
            return `${Math.round(dis * Math.pow(10, 3))}m`
        } else {
            return `${Number(dis).toFixed(2)}km`
        }
    }, [info.distance]);

    //是否展开
    const [expand, setExpand] = useState(false);

    const discountCardList = useMemo(() => {
        if (expand) {
            return info.discountCardList.slice(0, maxDiscountCount);
        } else {
            return info.discountCardList.slice(0, discountCount);
        }
    }, [info.discountCardList, expand, discountCount, maxDiscountCount]);

    const marketingActivityList = useMemo(() => {
        if (expand) {
            return info.marketingActivityList.slice(0, maxActivityCount);
        } else {
            return info.marketingActivityList.slice(0, activityCount);
        }
    }, [info.marketingActivityList, expand, activityCount, maxActivityCount]);

    const handleExpand=useCallback(
        () => {
            setExpand(!expand)
        },
        [expand],
    );

    console.log("==discountCardList==",discountCardList)

    return inSearch ? (
        <View
            className={classNames('sp-component-newshopitem', className)}
        >
            <View className={'sp-component-newshopitem-header'}>
                <View className={'left'}>
                    <Image src={info.logo} className={'img'} ></Image>
                </View>
                <View className={'center'}>
                    <View className={'name'}>{title}</View>
                    <View className={'rate'}>
                        {!!(info.scoreList||{}).avg_star && <Text>评分：{(info.scoreList||{}).avg_star}</Text>}
                        <Text className={'sale'}>月销：{info.sales_count}</Text>
                    </View>
                </View>
                <View className={'right'}>1000m</View>
            </View>
            <View className={'sp-component-newshopitem-logo'}>
                <Image src={ImageSRC} className={'img'} />
            </View>
            <View className={'sp-component-newshopitem-good-list'}>
                {
                    goodList.map(item => {
                        return (
                            <View className={'good-item'}>
                                <Image className='img' src={item.img}></Image>
                                <View className='price'>
                                    <SpNewPrice price={item.price} />
                                    <View className={'margin'}></View>
                                    <SpNewPrice price={item.originPrice} discount equal size={'small'} />
                                </View>
                            </View>
                        )
                    })
                }
            </View>
        </View>
    ) : (
        <View
            className={classNames('sp-component-newshopitem', className)}
        >
            <View className={'sp-component-newshopitem-left'}>
                <Image src={info.logo} className={'img'} />
            </View>
            <View className={'sp-component-newshopitem-right'}>
                <View className={'sp-component-newshopitem-right-top'}>
                    <View className={'lineone'}>
                        <View className={'title'}>{info.store_name}</View>
                        <View className={'distance'}>{distance}</View>
                    </View>
                    <View className={'linetwo'}>
                        <View className={'info'}>
                            {!!info.rate && <Text>评分：{info.rate}</Text>}
                            <Text class='sale'>月销：{info.sales_count}</Text>
                        </View>
                        <View className={'distribute'}>
                            {info.is_dada && <DistributionLabel>达达配送</DistributionLabel>}
                        </View>
                    </View>
                </View>
                <View className={'sp-component-newshopitem-right-bottom'}>
                    {discountCardList.length!==0 && <View className={'activity-line-one'}>
                        <View className={'left'}>
                            {
                                discountCardList.map((item) => {
                                    return (
                                        <SpNewCoupon
                                            text={item.title}
                                            className={'in-new-shop-item'}
                                            isReceive={false}
                                        />
                                    )
                                })
                            }
                        </View>
                        <View className={'right'}>
                            <View className={'right-arrow'} onClick={handleExpand}>
                                <Text className={classNames('iconfont icon-arrowDown',{
                                    ['expand']:expand
                                })}></Text>
                            </View>
                        </View>
                    </View>}
                    {
                        marketingActivityList.map((item) => (
                            <View className={'activity-line-two discount'}>
                                <View className={'left'}>
                                    <View className={'label'}>
                                        <Text className={'name'}>{item.promotion_tag}</Text>
                                        <Text className={'msg'}>{item.marketing_name}</Text>
                                    </View>
                                </View>
                            </View>
                        ))
                    }

                </View>
            </View>
        </View>
    )
}

export default memo(SpNewShopItem);