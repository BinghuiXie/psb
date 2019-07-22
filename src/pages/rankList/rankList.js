import { Image, View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import Taro, { Component } from "@tarojs/taro";

import {
  fetchCollegeRank,
  fetchSchoolRank,
  fetchTotalRank
} from "../../actions/info";
import "./rankList.scss";

const TOTAL_RANK = "TOTAL_RANK";
const SCHOOL_RANK = "SCHOOL_RANK";
const COLLEDGE_RANK = "COLLEDGE_RANK";

@connect(
  ({ info, user }) => ({ info, user }),
  dispatch => ({
    onFetchTotalRank: n => dispatch(fetchTotalRank(n)),
    onFetchSchoolRank: () => dispatch(fetchSchoolRank()),
    onFetchCollegeRank: () => dispatch(fetchCollegeRank())
  })
)
class RankList extends Component {
  config = {
    navigationBarTitleText: "反诈联盟",
    navigationBarTextStyle: "white",
    navigationBarBackgroundColor: "#14296a"
  };

  constructor(props) {
    super(props);
    this.state = {
      rankType: SCHOOL_RANK
    };
  }

  componentDidMount() {
    // 还是更新一下排行榜吧…
    this.props.onFetchTotalRank(10);
    this.props.onFetchSchoolRank();
    this.props.onFetchCollegeRank();
  }

  onClickOnRankType(type) {
    this.setState({ rankType: type });
  }

  render() {
    const { rankType } = this.state;
    const {
      rankList: { total, school, college }
    } = this.props.info;
    const userProps = this.props.user;

    return (
      <View className="rank-list">
        {/* 顶部标签栏 */}
        <View className="tab-bar">
          <View
            className={`tab school-rank ${
              rankType === SCHOOL_RANK ? "active" : ""
            }`}
            onClick={this.onClickOnRankType.bind(this, SCHOOL_RANK)}
          >
            学校榜
          </View>
          <View
            className={`tab college-rank ${
              rankType === COLLEDGE_RANK ? "active" : ""
            }`}
            onClick={this.onClickOnRankType.bind(this, COLLEDGE_RANK)}
          >
            学院榜
          </View>
          <View
            className={`tab world-rank ${
              rankType === TOTAL_RANK ? "active" : ""
            }`}
            onClick={this.onClickOnRankType.bind(this, TOTAL_RANK)}
          >
            个人榜
          </View>
        </View>

        {/* 排名列表，世界榜、学校榜、学院榜 */}
        <View className="list">
          {/* 世界榜 */}
          {rankType === TOTAL_RANK && total
            ? total.list.map((user, index) => (
                <View className="rank-item" key={user.userRankDO.openId}>
                  <View className={`ranking rank-${index}`}>{index + 1}</View>
                  <Image className="avatar" src={user.avatar} />
                  <View className="info">
                    <View className="name big-text">{user.nickName}</View>
                    <View className="school small-text">
                      {user.userRankDO.school}
                    </View>
                  </View>
                  <View className="score-wrapper">
                    <View className="text">积分</View>
                    <View className="score">{user.userRankDO.totalScore}</View>
                  </View>
                </View>
              ))
            : null}

          {/* 学校榜 */}
          {rankType === SCHOOL_RANK && school
            ? school.list.map((schoolItem, index) => (
                <View className="rank-item" key={schoolItem.name}>
                  <View className={`ranking rank-${index}`}>{index + 1}</View>
                  <Image className="avatar" src={schoolItem.avatar} />
                  <View className="info">
                    <View className="name big-text">{schoolItem.name}</View>
                  </View>
                  <View className="score-wrapper">
                    <View className="text">人均积分</View>
                    <View className="score">
                      {Number.parseFloat(schoolItem.score).toFixed(2)}
                    </View>
                  </View>
                </View>
              ))
            : null}

          {/* 学院榜 */}
          {rankType === COLLEDGE_RANK && college
            ? college.list.map((colledgeItem, index) => (
                <View className="rank-item" key={colledgeItem.name}>
                  <View className={`ranking rank-${index}`}>{index + 1}</View>
                  <View className="info">
                    <View className="name big-text">{colledgeItem.name}</View>
                  </View>
                  <View className="score-wrapper">
                    <View className="text">人均积分</View>
                    <View className="score">
                      {Number.parseFloat(colledgeItem.score).toFixed(2)}
                    </View>
                  </View>
                </View>
              ))
            : null}
        </View>
        {/* 自己的信息 */}
        <View className="personal-info">
          {rankType == TOTAL_RANK ? (
            <View className="rank-item">
              <View className={`ranking rank-${total.rankNum - 1}`}>
                {total.rankNum}
              </View>
              <Image className="avatar" src={userProps.avatar} />
              <View className="info">
                <View className="name">{userProps.nickName}</View>
                <View className="school">{userProps.school}</View>
              </View>
              <View className="score-wrapper">
                <View className="text">积分</View>
                <View className="score">{total.my.userRankDO.totalScore}</View>
              </View>
            </View>
          ) : null}

          {/* 学校 */}
          {rankType == SCHOOL_RANK ? (
            <View className="rank-item">
              <View className={`ranking rank-${school.rankNum - 1}`}>
                {school.rankNum}
              </View>
              <Image className="avatar" src={school.my.avatar} />
              <View className="info">
                <View className="name big-text">{school.my.name || ""}</View>
              </View>
              <View className="score-wrapper">
                <View className="text">人均积分</View>
                <View className="score">
                  {school.my.score
                    ? Number.parseFloat(school.my.score).toFixed(2)
                    : 0}
                </View>
              </View>
            </View>
          ) : null}

          {/* 学院 */}
          {rankType == COLLEDGE_RANK ? (
            <View className="rank-item">
              <View className={`ranking rank-${college.rankNum - 1}`}>
                {college.rankNum}
              </View>
              <View className="info">
                <View className="name big-text">{college.my.name || ""}</View>
              </View>
              <View className="score-wrapper">
                <View className="text">人均积分</View>
                <View className="score">
                  {college.my.score
                    ? Number.parseFloat(college.my.score).toFixed(2)
                    : 0}
                </View>
              </View>
            </View>
          ) : null}
        </View>
      </View>
    );
  }
}

export default RankList;
