import Taro, { Component } from "@tarojs/taro";
import { View, Text, Input } from "@tarojs/components";
import { classNames } from "@/utils";
import api from "@/api";
import "./index.scss";

export default class BaStoreList extends Component {
  static options = {
    addGlobalClass: true
  };

  static defaultProps = {
    currentIndex: 0
  };
  constructor(props) {
    super(props);
    this.state = {
      keyWord: "",
      storeList: [],
      setIdx:0
    };
  }
  //点击门店item
  handleClick = index => {
    console.log("点击门店item-----", index);
    this.setState({
      setIdx:index
    })

  };
  async componentWillMount() {
    // this.setState({
    //   storeList: await api.guide.distributorlist()
    // },()=>{
    //   console.log('componentWillMount-获取门店list',this.state.storeList)
    // })
  }
  //搜索门店
  hanldeConfirm = () => {
    const { keyWord } = this.state;

    const { onSearchStore, onChangeCurIndex } = this.props;
    onSearchStore({ store_name: keyWord });
    onChangeCurIndex(0);
  };
  //搜索框
  hanldeInput = e => {
    const {
      detail: { value }
    } = e;
    this.setState({
      keyWord: value
    });
  };
  //重制搜索框
  handleReset = () => {
    //   debugger
    this.setState({
      keyWord: ""
    });
  };
  //提交当前选择
  hanldeStore = () => {
    const { onStoreConfirm } = this.props;
    const {setIdx} = this.state
    onStoreConfirm(setIdx);
  };

  render() {
    const { shopList, currentIndex } = this.props;
    const { keyWord } = this.state;
    console.log("门店list-storeList", shopList);
    if(!shopList) return
    return (
      <View className="mask">
        <View className="ba-store-list">
          <View className="store-head">
            <View className="store-head__strname">切换门店</View>
            <Text
              className="in-icon in-icon-close"
              onClick={() => this.props.onClose(false)}
            ></Text>
          </View>
          <Input
            className="store-search"
            value={keyWord}
            type="text"
            placeholder="搜索门店"
            onConfirm={this.hanldeConfirm}
            onInput={this.hanldeInput}
          />
          <View className="store-main">
            {shopList.map((item, index) => {
              return (
                <View
                  className="store-item"
                  key="index"
                  onClick={this.handleClick.bind(this, index)}
                >
                  <View
                    className={classNames(
                      "store-item__name",
                      currentIndex === index ? "active" : ""
                    )}
                  >
                    {item.store_name + item.address}
                  </View>
                </View>
              );
            })}
          </View>
          <View className="store-ft">
            <View className="btn reset_btn" onClick={this.handleReset}>
              重置
            </View>
            <View className="btn confirm_btn" onClick={this.hanldeStore}>
              确定
            </View>
          </View>
        </View>
      </View>
    );
  }
}
