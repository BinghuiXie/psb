import { Button, Image, View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import Taro, { Component } from "@tarojs/taro";

import {
  exitChallengeRoom,
  fetchChallengeInformation,
  setChallengeID
} from "../../actions/challenge";
import Footer from "../../components/Footer/Footer";
import "./room.scss";

const calcLeftTime = deadline => {
  const end = new Date(deadline);
  return (end - Date.now()) / 1000;
};

const formatDealine = leftTime => {
  if (leftTime > 60) {
    return `${Math.round(leftTime / 60)}分钟内`;
  } else if (leftTime > 0) {
    return `${Math.round(leftTime)}秒内`;
  }
};

const calcHasAnswered = (openId, rankings) => {
  return rankings.filter(ranking => ranking.openId === openId).length > 0;
};

@connect(
  ({ challenge, user }) => ({ challenge, user }),
  dispatch => ({
    onExitChallengeRoom: () => dispatch(exitChallengeRoom()),
    onFetchChallengeInformation: () => dispatch(fetchChallengeInformation()),
    onSetChallengeId: challengeId => dispatch(setChallengeID(challengeId))
  })
)
class ChallengeRoom extends Component {
  componentDidMount() {
    if (this.$router.params.challengeId) {
      this.props.onSetChallengeId(this.$router.params.challengeId);
    }

    this.props.onFetchChallengeInformation();
  }

  componentDidShow() {
    if (this.props.challenge.challengeId) {
      this.props.onFetchChallengeInformation();
    }
  }

  componentWillUnmount() {
    this.props.onExitChallengeRoom();
  }

  startChallenge() {
    Taro.navigateTo({
      url: "/pages/challenge/answer"
    });
  }

  onShareAppMessage() {
    const { challengeId, message } = this.props.challenge;
    return {
      title: message,
      path: `/pages/challenge/room?challengeId=${challengeId}`
    };
  }

  render() {
    const { openId } = this.props.user;
    const { username, message, deadline, ranking } = this.props.challenge;
    const leftTime = calcLeftTime(deadline);
    const hasAnswered = calcHasAnswered(openId, ranking);

    return (
      <View className="room">
        {/* 背景图 */}
        <Image
          className="background-image"
          src="https://fzlm.njupt.edu.cn/police/image/2x/%E8%83%8C%E6%99%AF1@2x.png"
        />

        {/* 姓名 */}
        <View className="text red username">{username}</View>
        <View className="text red">创建的房间</View>

        {/* 邀请留言 */}
        <View className="message-title title">· 邀请留言 ·</View>
        <View className="message">{message}</View>

        {/* 排名 */}
        {ranking.length > 0 ? (
          <View className="ranking-wrapper">
            <View className="ranking-title title">
              {leftTime > 0 ? "· 当前排名 ·" : "· 房间排名 ·"}
            </View>

            <View className={`ranking-list ${leftTime > 0 ? "active" : ""}`}>
              {ranking.map((rank, index) => (
                <View className="rank" key={rank.username}>
                  {leftTime < 0 ? (
                    <View className="rank-number vertical-align-center">
                      {index + 1}
                    </View>
                  ) : null}
                  <Image className="avatar" src={rank.avatar} />
                  <View className="username vertical-align-center">
                    {rank.username}
                  </View>
                  <View className="score vertical-align-center">
                    {rank.score}分
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {leftTime > 0 ? (
          <View>
            {/* 开始答题 */}
            {!hasAnswered ? (
              <Button
                className="start-challenge-button button"
                onClick={this.startChallenge}
              >
                开始答题
              </Button>
            ) : null}

            {/* 分享房间 */}
            <Button className="share-room-button button" openType="share">
              {"分享房间>>"}
            </Button>

            {/* 限时说明 */}
            <View className="limited-time-desc">
              房间有效时间：{formatDealine(leftTime)}
            </View>
          </View>
        ) : null}

        <Footer />
      </View>
    );
  }
}

export default ChallengeRoom;
