import { Image, OpenData, View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import Taro, { Component } from "@tarojs/taro";

import { fetchTotalRank } from "../../actions/info";
import BorderBoxWithTriangle from "../../components/BorderBoxWithTriangle/BorderBoxWithTriangle";
import "./profile.scss";

@connect(
  ({ user, info }) => ({ user, info }),
  dispatch => ({
    onFetchTotalRank: () => dispatch(fetchTotalRank())
  })
)
class Profile extends Component {
  config = {
    navigationBarTitleText: "反诈联盟",
    navigationBarTextStyle: "white",
    navigationBarBackgroundColor: "#14296a"
  };

  componentDidMount() {
    this.props.onFetchTotalRank();
  }

  onClickOnTitle() {
    Taro.navigateTo({ url: "/pages/titleList/titleList" });
  }

  render() {
    const { nickName, school, college, studentId, level } = this.props.user;
    const { knowledge, rank, rankList } = this.props.info;

    return (
      <View className="profile">
        {/* 背景图 */}
        <Image
          className="background-image"
          src="https://fzlm.njupt.edu.cn/police/image/2x/%E8%83%8C%E6%99%AF1@2x.png"
        />

        {/* 顶部 */}
        <View className="header">
          {/* 头像和昵称 */}
          <View className="avatar-and-name">
            <View className="avatar-wrapper">
              {/* <CircleAvatar /> */}
              <View className="avatar-image">
                <OpenData className="avatar-image" type="userAvatarUrl" />
              </View>
            </View>
            <View className="name">{nickName}</View>
          </View>
          {/* 学校信息 */}
          <View className="school-info">
            <View className="school">{school}</View>
            <View className="college">{college}</View>
            <View className="student-id">{studentId}</View>
          </View>
        </View>

        <View className="box-list">
          <BorderBoxWithTriangle className="box score" triangle={false}>
            <View className="container">
              <View className="text big">{rank.score}</View>
              <View className="text small">当前积分</View>
            </View>
          </BorderBoxWithTriangle>
          <BorderBoxWithTriangle className="box rank" triangle={false}>
            <View className="container">
              <View className="text big">{rankList.total.rankNum}</View>
              <View className="text small">总榜排行</View>
            </View>
          </BorderBoxWithTriangle>
          <BorderBoxWithTriangle className="box title">
            <View className="container" onClick={this.onClickOnTitle}>
              <View className="text big">{level}</View>
              <View className="text small">当前称号</View>
            </View>
          </BorderBoxWithTriangle>
          <BorderBoxWithTriangle className="box accuracy" triangle={false}>
            <View className="container">
              <View className="text big">
                {Math.round(knowledge.accuracy * 100) || 0}%
              </View>
              <View className="text small">正确率</View>
            </View>
          </BorderBoxWithTriangle>
          {/* <BorderBoxWithTriangle className="box history" triangle={false}>
            <View className="container">
              <View className="text-wrapper">
                <View className="season">S1</View>
                <View className="score-and-rank">
                  <View className="score">3000分</View>
                  <View className="score">超凡脱俗</View>
                </View>
              </View>
            </View>
          </BorderBoxWithTriangle> */}
        </View>
      </View>
    );
  }
}

export default Profile;
