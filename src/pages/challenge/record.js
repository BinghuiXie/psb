import { Image, View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import Taro, { Component } from "@tarojs/taro";
import {
  fetchChallengeRecord,
  showChallengeRecord
} from "../../actions/challenge";
import { formatTime } from "../../utils/time";
import "./record.scss";

@connect(
  ({ challenge }) => ({ challenge }),
  dispatch => ({
    onFetchChallengeRecord: () => dispatch(fetchChallengeRecord()),
    onShowChallengeRecord: data => dispatch(showChallengeRecord(data))
  })
)
class ChallengeRecord extends Component {
  config = {
    navigationBarTitleText: "反诈联盟",
    navigationBarTextStyle: "white",
    navigationBarBackgroundColor: "#14296a"
  };

  componentDidMount() {
    this.props.onFetchChallengeRecord();
  }

  isActiveChallenge(deadline) {
    if (new Date(deadline) - Date.now() > 0) {
      return true;
    }
    return false;
  }

  showChallengeRecord(record) {
    this.props.onShowChallengeRecord({
      challengeId: record.challengeId,
      deadline: record.deadline,
      message: record.remark,
      username: record.username
    });

    Taro.navigateTo({ url: "/pages/challenge/room" });
  }

  render() {
    const { records } = this.props.challenge;
    return (
      <View className="challenge-record">
        {/* banner */}
        <View className="banner-wrapper">
          <Image
            className="banner-image"
            src="https://fzlm.njupt.edu.cn/police/image/2x/挑战记录.png"
          />
        </View>

        {/* 挑战记录 */}
        <View className="record-list">
          {records.map(record => (
            <View
              className={`record ${
                this.isActiveChallenge(record.deadline) ? "active" : ""
              }`}
              onClick={this.showChallengeRecord.bind(this, record)}
              key={record.challengeId}
            >
              {/* 留言 */}
              <View className="remark-wrapper">
                <View className="left-triangle triangle" />
                <View className="remark">{record.remark}</View>
              </View>

              {/* deadline */}
              <View className="deadline-wrapper">
                <View className="deadline">
                  {this.isActiveChallenge(record.deadline)
                    ? "挑战中"
                    : formatTime(record.deadline, "MM.DD")}
                </View>
                <View className="right-triangle triangle" />
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }
}

export default ChallengeRecord;
