import Taro, { useMemo, memo, useState, useCallback, useEffect } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { classNames, JumpStoreIndex, JumpGoodDetail } from '@/utils';
import { DistributionLabel } from './comps';
import { SpNewCoupon, SpNewPrice } from '@/components';
import api from '@/api'
import './index.scss';
const NoImageSRC = 'https://shopex-ecshopx.oss-cn-beijing.aliyuncs.com/ecshopx-vshop/shop_default_logo.png'

const SpNewShopItem = (props) => {

    const {
        className = '',
        info = {
            discountCardList: [],
            marketingActivityList: [],
            scoreList: {}
        },
        //在订单列表
        inOrderList = false,
        //在订单详情
        inOrderDetail = false,
        //默认优惠券展示3条
        discountCount = 3,
        //优惠券最多展示多少条
        maxDiscountCount = 6,
        //营销活动默认展示多少条
        activityCount = 1,
        //营销活动最多展示多少条
        maxActivityCount = 10,
        //组件在店铺首页里
        inStore = false,
        //点击店铺是否可跳转
        canJump = false,
        //点击logo是否可以跳转
        logoCanJump = false,
        //是否有店铺logo
        hasLogo = true,
        //是否展示产品
        isShowGoods: isShowGoodsProps = true,
        //显示几个产品
        goodCount = 3
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

    //是否收藏
    const [fav, setFav] = useState();

    //是否展开
    const [expand, setExpand] = useState(false);

    const discountCardList = useMemo(() => {
        if (expand) {
            return (info.discountCardList || []).slice(0, maxDiscountCount);
        } else {
            return (info.discountCardList || []).slice(0, discountCount);
        }
    }, [info.discountCardList, expand, discountCount, maxDiscountCount]);

    const marketingActivityList = useMemo(() => {
        if (expand) {
            return (info.marketingActivityList || []).slice(0, maxActivityCount);
        } else {
            return (info.marketingActivityList || []).slice(0, activityCount);
        }
    }, [info.marketingActivityList, expand, activityCount, maxActivityCount]);

    const handleExpand = useCallback(
        () => {
            setExpand(!expand)
        },
        [expand],
    );

    const rate = !!(info.scoreList || {}).avg_star ? <Text>评分：{(info.scoreList || {}).avg_star}</Text> : '';

    const logo = inStore ? info.brand ? info.brand : NoImageSRC : info.logo ? info.logo : NoImageSRC;

    const title = info.name;

    const isShowGoods = isShowGoodsProps && info.itemList && info.itemList.length > 0;

    const handleClickLogo = useCallback(
        () => {
            if (logoCanJump) {
                JumpStoreIndex(info)
            }
        },
        [logoCanJump, info]
    );

    const handleClickName = useCallback(
        () => {
            if (canJump) {
                JumpStoreIndex(info)
            }
        },
        [canJump],
    )

    useEffect(() => {
        if (inStore) {
            api.member.storeIsFav(info.distributor_id).then(res => {
                setFav(res.is_fav)
            })
        }
    }, [inStore, info]);

    const handleFocus = (flag) => async () => {
        let data = {};
        if (flag) {
            data = await api.member.storeFav(info.distributor_id);
        } else {
            data = await api.member.storeFavDel(info.distributor_id);
        }
        if (Object.keys(data).length > 0) {
            Taro.showToast({
                icon: 'none',
                title: flag ? '关注成功' : '取消关注成功'
            })
        }
        setFav(flag)
    }

    const hasMore = useMemo(() => {
        //如果优惠券数量大于默认数量/活动数量大于默认数量  即还有更多
        return ((info.discountCardList||[]).length > discountCount) || ((info.marketingActivityList||[]).length > activityCount)
    }, [info.discountCardList, info.marketingActivityList, discountCount, activityCount])

    return (inStore || inOrderList || inOrderDetail) ? (
        <View
            className={classNames('sp-component-newshopitem', className)}
        >
            <View className={'sp-component-newshopitem-header'}>
                {hasLogo && <View className={'left'} onClick={handleClickLogo}>
                    <Image src={logo} className={'img'} ></Image>
                </View>}
                <View className={'center'}>
                    <View className={'name'} onClick={handleClickName}>
                        <View className={'text'}>{title}</View>
                        {canJump && <Text className={'iconfont icon-qianwang-01'} ></Text>}
                    </View>
                    <View className={'rate'}>
                        {rate}
                    </View>
                </View>
                {inStore && <View className={'right'}>
                    <View className={'button'}>
                        {fav ? <View onClick={handleFocus(false)}>{'取消关注'}</View> : <View className={'text'} onClick={handleFocus(true)}><Text className={'iconfont icon-plus'}></Text><Text>{'关注'}</Text></View>}
                    </View>
                </View>}
            </View>
        </View>
    ) : (
        <View
            className={classNames('sp-component-newshopitem', className)}
        >
            <View className={'sp-component-newshopitem-top'}>
                {hasLogo && <View className={'sp-component-newshopitem-left'} onClick={handleClickLogo}>
                    <Image src={logo} className={'img'} />
                </View>}
                <View className={'sp-component-newshopitem-right'}>
                    <View className={'sp-component-newshopitem-right-top'}>
                        <View className={'lineone'}>
                            <View className={'title'} onClick={handleClickName}>
                                {info.store_name}
                            </View>
                            <View className={'distance'}>{distance}</View>
                        </View>
                        <View className={'linetwo'}>
                            <View className={'info'}>
                                {rate}
                                <Text class='sale'>月销：{info.sales_count}</Text>
                            </View>
                            <View className={'distribute'}>
                                {info.is_dada && <DistributionLabel>达达配送</DistributionLabel>}
                            </View>
                        </View>
                    </View>
                    <View className={'sp-component-newshopitem-right-bottom'}>
                        {discountCardList.length !== 0 && <View className={'activity-line-one'}>
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
                                {hasMore && <View className={'right-arrow'} onClick={handleExpand}>
                                    <Text className={classNames('iconfont icon-arrowDown', {
                                        ['expand']: expand
                                    })}></Text>
                                </View>}
                            </View>
                        </View>}
                        {
                            marketingActivityList.map((item,index) => (
                                <View className={classNames('activity-line-two discount',{
                                    'noDiscount':discountCardList.length===0 && index===0
                                })}>
                                    <View className={'left'}>
                                        <View className={'label'}>
                                            <Text className={'name'}>{item.promotion_tag}</Text>
                                            <Text className={'msg'}>{item.marketing_name}</Text>
                                        </View>
                                    </View>
                                    <View className={'right'}>
                                        {hasMore && index===0 && discountCardList.length===0 && <View className={'right-arrow'} onClick={handleExpand}>
                                            <Text className={classNames('iconfont icon-arrowDown', {
                                                ['expand']: expand
                                            })}></Text>
                                        </View>}
                                    </View>
                                </View>
                            ))
                        }

                    </View>
                </View>
            </View>
            {isShowGoods && <View className={classNames('sp-component-newshopitem-good-list', { 'fill': info.itemList.length === goodCount })}>
                {
                    info.itemList.slice(0, goodCount).map(item => {
                        return (
                            <View className={classNames('good-item')} onClick={() => JumpGoodDetail(item.item_id, info.distributor_id)}>
                                <Image className='img' src={item.pics}></Image>
                                <View className='name' >
                                    {item.item_name}
                                </View>
                                <View className='price'>
                                    <SpNewPrice price={item.price} />
                                    <View className={'margin'}></View>
                                    <SpNewPrice price={item.market_price} discount equal size={'small'} />
                                </View>
                            </View>
                        )
                    })
                }
            </View>}
        </View>
    )
}

export default memo(SpNewShopItem);