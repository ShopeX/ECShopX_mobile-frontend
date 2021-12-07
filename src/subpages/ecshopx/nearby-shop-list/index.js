import Taro, { useState, useEffect, useCallback } from '@tarojs/taro';
import { View, ScrollView,Image } from '@tarojs/components';
import { SpNavBar, SpNewInput, SpNewFilterbar, SpNewShopItem, SpNewFilterDrawer, SpLoadMore } from '@/components'
import { classNames, isNavbar,JumpPageIndex } from '@/utils';
import { FILTER_DATA, FILTER_DRAWER_DATA, DEFAULT_SORT_VALUE, fillFilterTag } from '../consts/index';
import api from '@/api'
import { usePage, useFirstMount } from '@/hooks';
import './index.scss';

const NavbarTitle = '附近商家';

// const { navbarHeight }=getNavbarHeight();

//微信小程序顶部距离=导航栏距离+输入框距离+筛选tab距离
// const top=`${pxTransform(navbarHeight)+ 92 + 92}rpx`;

const lnglat = ()=>Taro.getStorageSync('lnglat') || {}; 

const NearbyShopList = (props) => {

    const [filterValue, setFilterValue] = useState(DEFAULT_SORT_VALUE);

    const [filterVisible, setFilterVisible] = useState(false);

    //筛选名称
    const [name, setName] = useState('');

    const [dataList, setDataList] = useState([]);

    //物流
    const [logistics, setLogistics] = useState({
        //自提
        is_ziti: undefined,
        //快递
        is_delivery: undefined,
        //达达
        is_dada: undefined
    });

    //标签id
    const [tag, setTag] = useState('');

    const handleClickFilterLabel = useCallback(
        (item) => {
            setFilterValue(item);
        },
        [],
    );

    const handleDrawer = useCallback(
        (flag) => (selectedValue) => {
            setFilterVisible(flag);
            if (!selectedValue.tag && !Array.isArray(selectedValue.tag)) return;
            setTag(selectedValue.tag.length ? selectedValue.tag.join(',') : '');
            const is_ziti = selectedValue.logistics.includes('ziti') ? 1 : undefined;
            const is_delivery = selectedValue.logistics.includes('delivery') ? 1 : undefined;
            const is_dada = selectedValue.logistics.includes('dada') ? 1 : undefined;
            setLogistics({
                is_ziti,
                is_delivery,
                is_dada
            });
        },
        [],
    );

    const mounted = useFirstMount();

    const fetch = async ({ pageIndex, pageSize }) => {
        const params = {
            page: pageIndex,
            pageSize,
            province: lnglat().province,
            city: lnglat().city ? lnglat().city : lnglat().province,
            area: lnglat().district,
            type: 0,
            show_discount: 1,
            show_marketing_activity: 1,
            is_ziti: logistics.is_ziti,
            is_delivery: logistics.is_delivery,
            is_dada: logistics.is_dada,
            distributor_tag_id: tag,
            lng: lnglat().longitude,
            lat: lnglat().latitude,
            //是否展示积分
            show_score: 1,
            sort_type: filterValue,
            show_items: 1,
            name
        }
        const {
            list,
            total_count,
            tagList
        } = await api.shop.list(params);

        setDataList([
            ...dataList,
            ...list
        ]);
        setTotal(total_count);
        fillFilterTag(tagList);
    };

    const { loading, hasNext, total, setTotal, nextPage, resetPage } = usePage({
        fetch
    });

    //点击搜索框搜索
    const handleConfirm = useCallback(
        (item) => {
            setName(item);
        },
        [],
    );

    useEffect(() => {
        if (mounted) {
            resetPage();
            setDataList([]);
        }
    }, [filterValue]);

    useEffect(() => {
        if (mounted) {
            resetPage();
            setDataList([]);
        }
    }, [tag, logistics]);

    useEffect(() => {
        if (mounted) {
            resetPage();
            setDataList([]);
        }
    }, [name]);

    //没有物流
    const noLogistics = Object.values(logistics).every(item => !item);

    //表示没有数据
    const noData = dataList.length === 0;

    //表示没有筛选也没有数据
    const noCompleteData = noData && !name && noLogistics && !tag;  

    return (
        <View className={classNames(
            'sp-page-nearbyshoplist',
            {
                'has-navbar': isNavbar(),
                'has-filterbar':!noCompleteData
            }
        )}>

            <SpNavBar
                title={NavbarTitle}
                leftIconType='chevron-left'
                fixed='true'
            />

            <View className={'sp-page-nearbyshoplist-input'}>
                <SpNewInput
                    placeholder={'输入商家、商品'}
                    onConfirm={handleConfirm}
                />
            </View>

            {!noCompleteData && <SpNewFilterbar
                filterData={FILTER_DATA}
                value={filterValue}
                onClickLabel={handleClickFilterLabel}
                onClickFilter={handleDrawer(true)}
            />}


            <ScrollView
                className={classNames('sp-page-nearbyshoplist-scrollview')}
                scrollY
                scrollWithAnimation
                onScrollToLower={nextPage}
            >
                {
                    dataList.map((item, index) => (
                        <SpNewShopItem
                            className={classNames(
                                'in-shoplist',
                                { 'in-shoplist-last': index === 99 }
                            )}
                            info={item}
                            isShowGoods={!!name}
                            logoCanJump
                        />
                    ))
                }
                {/* 分页loading */}
                <SpLoadMore loading={loading} hasNext={hasNext} total={total} />
                {!loading && noData && <View className={'sp-page-nearbyshoplist-nodata'}>
                    <Image className="img"  src={`${process.env.APP_IMAGE_CDN}/empty_data.png`}></Image>
                    <View className="tips">更多商家接入中，尽情期待</View>
                    <View className="button" onClick={()=>JumpPageIndex()}>去首页逛逛</View>
                </View>}
            </ScrollView>

            <SpNewFilterDrawer
                visible={filterVisible}
                filterData={FILTER_DRAWER_DATA}
                onCloseDrawer={handleDrawer(false)}
            />

        </View>
    )
}

export default NearbyShopList;

NearbyShopList.config = { 
    navigationBarTitleText: NavbarTitle
}
