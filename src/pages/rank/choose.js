import { Button, Image, View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import Taro, { Component } from "@tarojs/taro";

import { getExistTimes } from "../../actions/rank";
import Footer from "../../components/Footer/Footer";
import Loading from "../../components/Loading/Loading";
import "./choose.scss";

@connect(
  ({ user }) => ({ user }),
  dispatch => ({
    onGetExistTimes: () => dispatch(getExistTimes())
  })
)
class ChallengeChoose extends Component {
  config = {
    navigationBarTitleText: "反诈联盟",
    navigationBarTextStyle: "white",
    navigationBarBackgroundColor: "#14296a"
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  componentDidMount() {
    this.props.onGetExistTimes();
  }

  goSingle() {
    this.setState({
      loading: true
    });
    setTimeout(() => {
      this.setState({
        loading: false
      });
      Taro.navigateTo({ url: "./rank?type=single" });
    }, Math.random() * 2000);
  }

  goDouble() {
    this.setState({
      loading: true
    });
    setTimeout(() => {
      this.setState({
        loading: false
      });
      Taro.navigateTo({ url: "./rank?type=double" });
    }, Math.random() * 5000);
  }

  goToRedPocket() {
    Taro.navigateTo({ url: "/pages/rank/redPocketIndex" });
  }

  render() {
    const { loading } = this.state;
    const { avatar } = this.props.user;
    const main = (
      <View className="challenge-index">
        {/* banner */}
        <View className="banner-wrapper">
          <Image
            className="banner-image"
            src="https://fzlm.njupt.edu.cn/police/image/2x/banner@2x.png"
          />
        </View>

        {/* slogan */}
        <View className="slogan first">旗鼓相当</View>
        <View className="slogan">积分考场</View>

        {/* choose */}
        <View className="choose-text">· 选择模式 ·</View>
        <Button className="modal" onClick={this.goSingle}>
          单人模式
        </Button>
        <Button className="modal" onClick={this.goDouble}>
          对战模式
        </Button>
        {/* <Button className='modal' onClick={this.goToRedPocket}>
          红包模式
        </Button> */}
        <Footer />
      </View>
    );

    return (
      <View>
        {loading ? <Loading avatar={avatar} message="匹配中..." /> : main}
      </View>
    );
  }
}

export default ChallengeChoose;
