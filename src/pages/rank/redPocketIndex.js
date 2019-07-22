import { Button, Image, View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import Taro, { Component } from "@tarojs/taro";

import { getExistTimes } from "../../actions/rank";
import rankApi from "../../api/rank";
import Footer from "../../components/Footer/Footer";
import "./redPocketIndex.scss";

@connect(
  ({ rank }) => ({ rank }),
  dispatch => ({
    onGetExistTimes: () => dispatch(getExistTimes())
  })
)
class redPoetIndex extends Component {
  config = {
    navigationBarTitleText: "反诈联盟",
    navigationBarTextStyle: "white",
    navigationBarBackgroundColor: "#14296a"
  };

  constructor(props) {
    super(props);
    this.state = {
      money: 0
    };

    this.getOwnMoney = this.getOwnMoney.bind(this);
  }

  componentDidShow() {
    this.props.onGetExistTimes();
    this.getOwnMoney();
  }

  async getOwnMoney() {
    const {
      data: { data }
    } = await rankApi.getOwnMoney();
    const { sum: money } = data;
    this.setState({ money });
  }

  goToExercise() {
    if (this.props.rank.existTimes >= 0) {
      Taro.navigateTo({ url: "/pages/rank/redPocket" });
    } else {
      Taro.showToast({
        title: "本赛季的红包答题次数已用完",
        icon: "none",
        duration: 5000
      });
    }
  }

  navigateToHistory() {
    Taro.navigateTo({ url: "/pages/rank/redPocketHistory" });
  }

  render() {
    return (
      <View className='red-pocket-index'>
        {/* banner */}
        <View className='banner-wrapper'>
          <Image
            className='banner-image'
            src='https://fzlm.njupt.edu.cn/police/image/2x/banner@2x.png'
          />
        </View>

        {/* slogan */}
        <View className='slogan first'>当前红包积分</View>
        <View className='slogan number'>{this.state.money}分</View>

        {/* choose */}
        <Button className='button' onClick={this.goToExercise}>
          答题领红包
        </Button>
        <Button className='button' onClick={this.navigateToHistory}>
          红包记录
        </Button>

        <Footer />
      </View>
    );
  }
}

export default redPoetIndex;
