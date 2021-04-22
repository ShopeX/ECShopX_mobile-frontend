import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import api from '@/api'
import { withLogin, withPager } from "@/hocs";
import { BaNavBar } from '../components'
import { connect } from '@tarojs/redux'
import { formatTime, log } from '@/utils'
import S from '@/spx'
import { Tracker } from "@/service";
import { WgtFilm, WgtSlider, WgtWriting, WgtGoods, WgtHeading } from '../components/wgts'
import './detail.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
@withLogin()
@withPager
export default class recommendDetail extends Component {
  constructor(props) {
    props = props || {};
    props.pageSize = 50;
    super(props);

    this.state = {
      ...this.state,
      info: null,
      item_id_List: [],
      screenWidth: 0,
      jumpType: "home"
    };
  }

  componentDidMount() {
    Taro.getSystemInfo().then(res => {
      this.setState({
        screenWidth: res.screenWidth
      });
    });

    const options = this.$router.params;
    //判断小程序跳转
    let jumpType = "home";
    const { salesperson_id, sence } = options;
    if (salesperson_id || sence) {
      jumpType = "home";
    } else {
      jumpType = "";
    }
    this.setState({
      jumpType
    });
  }

  componentDidShow() {
    Taro.hideShareMenu({
      //禁用胶囊分享
      menus: ["shareAppMessage", "shareTimeline"]
    });
    this.fetchContent();
  }

  config = {
    navigationStyle: "custom",
    navigationBarTitleText: "种草详情"
  };

  onShareAppMessage() {
    const { info } = this.state;
    const { salesperson_id, distributor_id } = S.get("GUIDE_INFO", true);
    // const { userId } = Taro.getStorageSync("userinfo");
    // const query = userId ? `&uid=${userId}` : "";
    // const QwUserInfo = S.get("GUIDE_INFO", true);
    // const { salesperson_id } = QwUserInfo;
    // const guideid = salesperson_id ? `&salesperson_id=${salesperson_id}` : "";
    

    Tracker.dispatch("GOODS_SHARE_TO_CHANNEL_CLICK", {
      ...info,
      shareType: "分享给好友"
    } );
    const sharePath = `/subpage/pages/recommend/detail?id=${info.article_id}&smid=${salesperson_id}&dtid=${distributor_id}`;
    log.debug(`【guide/recommend/detail】onShareAppMessage path: ${sharePath}` )
    return {
      title: info.title,
      path: sharePath,
      imageUrl: info.share_image_url || info.image_url
    };
  }

  // 拉取详情
  detailInfo = async id => {
    const info = await api.article.detail(id);
    info.updated_str = formatTime(info.updated * 1000, "yyyy-MM-dd");
    this.setState({
      info
    });
  };

  async fetchContent() {
    const { id } = this.$router.params;

    // 关注数加1
    const resFocus = await api.article.focus(id);

    if (resFocus) {
      this.detailInfo(id);
    }
  }

  handleClickGoods = () => {
    const { id } = this.$router.params;
    this.detailInfo(id);
  };

  render() {
    const { colors } = this.props;
    const { info, screenWidth, jumpType } = this.state;
    const navbar_height = S.get("navbar_height", true);

    if (!info) {
      return null;
    }

    return (
      <View
        className="guide-recommend-detail"
        style={`padding-top:${navbar_height}PX`}
      >
        <BaNavBar title="种草详情" fixed jumpType={jumpType} />
        <View className="recommend-detail__title">{info.title}</View>
        <View className="recommend-detail-info">
          <View className="recommend-detail-info__time">
            <Text className={`icon-time ${info.is_like ? "" : ""}`}> </Text>
            {info.updated_str}
          </View>
          <View className="recommend-detail-info__time">
            <Text className={`icon-eye ${info.is_like ? "" : ""}`}> </Text>
            {info.articleFocusNum.count ? info.articleFocusNum.count : 0}关注
          </View>
        </View>
        <View className="recommend-detail__content" scrollY>
          <View className="wgts-wrap__cont">
            {info.content.map((item, idx) => {
              return (
                <View className="wgt-wrap" key={`${item.name}${idx}`}>
                  {item.name === "film" && <WgtFilm info={item} />}
                  {item.name === "slider" && (
                    <WgtSlider info={item} width={screenWidth} />
                  )}
                  {item.name === "writing" && <WgtWriting info={item} />}
                  {item.name === "heading" && <WgtHeading info={item} />}
                  {item.name === "goods" && (
                    <WgtGoods
                      onClick={this.handleClickGoods.bind("goods")}
                      info={item}
                    />
                  )}
                </View>
              );
            })}
          </View>
        </View>

        <View className="recommend-detail__bar">
          <Button
            openType="share"
            style={"background: " + colors.data[0].primary}
          >
            分享给顾客
          </Button>
        </View>
      </View>
    );
  }
}
