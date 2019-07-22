import { View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import Taro, { Component } from "@tarojs/taro";

import { fetchAllInformation } from "../../actions/info";
import { fetchMatchHistory, showMatchHistory } from "../../actions/match";
import { formatDateTime } from "../../utils/time";
import "./history.scss";

@connect(
  ({ match, info }) => ({ match, info }),
  dispatch => ({
    onFetchMatchHistory: () => dispatch(fetchMatchHistory()),
    onShowMatchHistory: data => dispatch(showMatchHistory(data)),
    onFetchAllInformation: () => dispatch(fetchAllInformation())
  })
)
class MatchHistory extends Component {
  config = {
    navigationBarTitleText: "反诈联盟",
    navigationBarTextStyle: "white",
    navigationBarBackgroundColor: "#14296a"
  };

  componentDidMount() {
    this.props.onFetchMatchHistory();
    this.props.onFetchAllInformation();
  }

  isActiveMatch(deadline) {
    return new Date(deadline) - Date.now() > 0;
  }

  render() {
    const { seasons } = this.props.info;
    console.log('match/history => seasons: ', seasons);
    return (
      <View className="match-history">
        {seasons.map(match => (
          <View className="match" key={match.seasonId}>
            {/* 留言 */}
            <View className="left">
              <View className="name">{match.seasonId}</View>
              <View className="time">{`${formatDateTime(
                match.seasonStart
              )}~${formatDateTime(match.seasonEnd)}`}</View>
            </View>

            {/* deadline */}
            <View
              className={`last ${
                this.isActiveMatch(match.seasonEnd) ? "active" : ""
              }`}
            >
              {this.isActiveMatch(match.seasonEnd) ? "未结束" : "已结束"}
            </View>
            <View
              className={`footer ${
                this.isActiveMatch(match.seasonEnd) ? "active-footer" : ""
              }`}
            >
              ◢
            </View>
          </View>
        ))}
      </View>
    );
  }
}

export default MatchHistory;
