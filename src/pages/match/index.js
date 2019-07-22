import { Image, Text, View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import Taro, { Component } from "@tarojs/taro";

import {
  resetMatch,
  showLoading,
  stopCountDown,
  hideLoading,
  fetchMatchHistory,
  initCloseStatus
} from "../../actions/match";
import { getExistTimes } from "../../actions/rank";
import Footer from "../../components/Footer/Footer";
import Loading from "../../components/Loading/Loading";
import AlertImage from "../../components/AlertImage/alertImage";
import "./index.scss";

const showToast = message =>
  Taro.showToast({ title: message, icon: "none", duration: 5000 });

@connect(
  ({ match, user, info, rank }) => ({ match, user, info, rank }),
  dispatch => ({
    onResetMatch: () => dispatch(resetMatch()),
    onStopCountDown: () => dispatch(stopCountDown()),
    onShowLoading: () => dispatch(showLoading()),
    onHideLoading: () => dispatch(hideLoading()),
    onFetchMatchHistory: () => dispatch(fetchMatchHistory()),
    onGetExistTimes: () => dispatch(getExistTimes()),
    onInitCloseStatus: () => dispatch(initCloseStatus())
  })
)
class MatchIndex extends Component {
  config = {
    navigationBarTitleText: "反诈联盟",
    navigationBarTextStyle: "white",
    navigationBarBackgroundColor: "#14296a"
  };

  componentWillMount () {
    this.props.onInitCloseStatus()
  }

  componentWillUnmount() {
    this.props.onResetMatch();
    this.props.onStopCountDown();
  }

  componentDidMount() {
    this.props.onFetchMatchHistory();
    this.props.onGetExistTimes();
  }

  goToHistory() {
    Taro.navigateTo({ url: "/pages/match/history" });
  }

  joinMatch = () => {
    let { existTimes } = this.props.rank;
    console.log('existTimes', existTimes);
    let {
      knowledge: { score },
      season
    } = this.props.info;
    console.log('season: ', season);
    console.log('this.props.info: ', this.props.info);
    let {seasonScore, seasonEnd} =  season  || 0;

    if (score < seasonScore) {
      showToast(`请在「积分学习」获得 ${seasonScore} 分再进入专题竞赛哟`);
    } else if (Date.now() > seasonEnd) {
      showToast(`当前赛季已结束，请下次再加油哟`);
    } else if (existTimes <= 0) {
      showToast(`赛季剩余次数已用完`);
    } else {
      this.props.onShowLoading();
      setTimeout(() => {
        this.props.onHideLoading();
        this.goToExercise();
      }, 1000);
    }
  };

  goToExercise = () => {
    const { status } = this.props.match;
    if (!status.loading) {
      Taro.navigateTo({ url: "/pages/match/exercise" });
    } else {
      setTimeout(this.goToExercise.bind(this), 300);
    }
  };

  render() {
    const { avatar } = this.props.user;
    const { season } = this.props.info;
    const { existTimes } = this.props.rank;
    console.log('this.props.rank', this.props.rank);
    const {
      status: { loading, message },
      records
    } = this.props.match;
    const { list } = this.state;
    const notic = (
      <View className="container">
        {list.map((item, index) => (
          <View className="item" key={index}>
            {`${index}.${item}`}
          </View>
        ))}
        <View className="sure" onClick={this.toggleShow}>
          确认
        </View>
      </View>
    );
    const main = (
      <View className="specialList">
        <Image
          className="logo"
          src="https://static.airbob.org/psb/2x/banner@2x.png"
        />
        <Text className="name">当前赛季:{season.seasonId ? season.seasonId : '当前没有赛季'}</Text>
        <Text className="name">剩余次数:{season.seasonId ? existTimes : 0}</Text>
        <View className="circle">
          <Text className="score">{records[0].sum ? records[0].sum : 0}</Text>
          <Text className="text">当前积分</Text>
        </View>
        <View className="join" onClick={this.joinMatch}>
          开始对战
        </View>
        <View className="history" onClick={this.goToHistory}>
          历史赛季
        </View>
        <Text className="notic">专题竞赛：沉着冷静 细心守纪 :）</Text>

        <Footer />

        {this.state.show ? notic : null}
      </View>
    );
    return (
      <View>
        {
          this.props.match.isClose ? null : <AlertImage />
        }
        {loading ? <Loading avatar={avatar} message={message} /> : main}
      </View>
    );
  }
}

export default MatchIndex;
