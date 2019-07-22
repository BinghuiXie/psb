import {
  Button,
  Image,
  OpenData,
  RichText,
  Text,
  View
} from "@tarojs/components";
import { connect } from "@tarojs/redux";
import Taro, { Component } from "@tarojs/taro";

import { getUserInfo, getWxCode } from "../../actions/user";
import { judgeClickTime } from "../../actions/news";
import BorderBox from "../../components/BorderBox/BorderBox";
import BorderBoxWithTriangle from "../../components/BorderBoxWithTriangle/BorderBoxWithTriangle";
import { formatTime } from "../../utils/time";
import "./index.scss";

@connect(
  ({ user, info, news }) => ({ user, info, news }),
  dispatch => ({
    onGetWxCode: () => dispatch(getWxCode()),
    onGetUserInfo: () => dispatch(getUserInfo()),
    setClickTime: () => dispatch(judgeClickTime())
  })
)

class Index extends Component {
  config = {
    navigationBarTitleText: "反诈联盟",
    navigationBarTextStyle: "white",
    navigationBarBackgroundColor: "#14296a"
  };

  componentDidMount() {
    this.props.onGetWxCode();
    this.props.onGetUserInfo();
  }

  componentWillReceiveProps(nextProp) {
    const { user } = nextProp;
    if (user.modified === false) {
      // 没绑定信息，跳转信息绑定页
      Taro.navigateTo({ url: "/pages/bindInfo/bindInfo" });
    }
  }

  onGetUserInfo({ detail }) {
    if (detail.errMsg === "getUserInfo:ok") {
      this.props.onGetUserInfo();
    }
  }

  showWaitToast() {
    Taro.showToast({
      title: "请耐心等待登录完成哟~",
      icon: "none",
      duration: 5000
    });
  }

  navigateTo(url) {
    // console.log('token: ', this.props.user.token);
    if (this.props.user.token) {
      Taro.navigateTo({ url });
    } else {
      this.showWaitToast();
    }
  }

  onClickRankBlock() {
    this.navigateTo("/pages/rank/rank");
  }

  onClickQuestionBank() {
    this.navigateTo("/pages/exercise/exercise");
  }

  onClickOnInfoBlock() {
    this.navigateTo("/pages/profile/profile");
  }

  onClickOnNewsBlock() {
    this.navigateTo("/pages/news/news");
  }

  onClickOnRankList() {
    this.navigateTo("/pages/rankList/rankList");
  }

  onClickOnSpecialExam() {
    this.props.setClickTime();
    this.navigateTo("/pages/match/index");
  }

  onClickOnChallenge() {
    this.navigateTo("/pages/challenge/index");
  }

  onClickOnGuide() {
    this.navigateTo("/pages/guide/guide");
  }

  formatDate(date) {
    return formatTime(date, "MM/DD");
  }

  render() {
    const { nickName, shouldShowAuthorizationWindow, level } = this.props.user;
    const {
      rank,
      rankList: { total: totalRank }
    } = this.props.info;
    const { news } = this.props.news;

    return (
      <View className="index">
        {/* 信息 */}
        <BorderBox className="info-outer-wrapper">
          <View
            className="info-inner-wrapper"
            onClick={this.onClickOnInfoBlock}
          >
            {/* 警徽图片 */}
            <Image
              className="jin-hui-image"
              src="https://fzlm.njupt.edu.cn/police/image/2x/%E9%A6%96%E9%A1%B50@2x.png"
            />
            {/* 用户名文字 */}
            <View className="username-wrapper">
              <Text className="username-text">{nickName}</Text>
            </View>
            {/* 其它信息 */}
            <View className="other-info-wrapper">
              {/* 头像 */}
              <View className="avatar-wrapper">
                <View className="avatar-image">
                  <OpenData className="avatar-image" type="userAvatarUrl" />
                </View>
              </View>
              {/* 称号、积分、赛季、日期信息 */}
              <View className="info-wrapper">
                <View className="title-and-score">
                  <View className="title">当前称号: {level}</View>
                  <View className="score">当前积分: {rank.score}</View>
                </View>
              </View>
            </View>
          </View>
        </BorderBox>

        {/* 诈骗案例 */}
        <View className="fraud-case-wrapper" onClick={this.onClickOnNewsBlock}>
          <BorderBoxWithTriangle className="fraud-case" triangle={false}>
            <View className="container">
              <View className="title">警方说骗</View>
              <View className="content">
                <RichText
                  nodes={
                    news[0] && news[0].content
                      ? news[0].content.slice(0, 80) + "..."
                      : "同学们请注意最新诈骗案例哟~"
                  }
                />
              </View>
            </View>
          </BorderBoxWithTriangle>
        </View>

        {/* 排行榜和各种入口 */}
        <View className="rank-and-exam-wrapper">
          <BorderBoxWithTriangle className="rank-wrapper">
            <View className="container" onClick={this.onClickOnRankList}>
              <View className="title">排行榜</View>
              <View className="full-list">点击查看完整排名</View>
              {/* 前三名排名 */}
              <View className="ranking-item-wrapper">
                {totalRank.list.slice(0, 5).map((item, index) => (
                  <View className="ranking-item" key={item.name}>
                    <View className="ranking">{index + 1}</View>
                    <View className="avatar">
                      <Image className="avatar-image" src={item.avatar} />
                    </View>
                    <View className="info-wrapper">
                      <View className="score">
                        {item.userRankDO.totalScore > 10000
                          ? `${(item.userRankDO.totalScore / 10000).toFixed(
                              1
                            )}万分`
                          : `${item.userRankDO.totalScore}分`}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </BorderBoxWithTriangle>

          <View className="box-list">
            {/* 积分考场 */}
            <BorderBoxWithTriangle className="box">
              <View
                className="score-exam container"
                onClick={this.onClickRankBlock}
              >
                <View className="title">排位赛</View>
                <View className="image-wrapper">
                  <Image
                    className="image"
                    src="https://fzlm.njupt.edu.cn/police/image/2x/%E9%A6%96%E9%A1%B51-%E6%94%B9@2x.png"
                  />
                </View>
              </View>
            </BorderBoxWithTriangle>
            {/* 专题考场 */}
            <BorderBoxWithTriangle className="box">
              <View
                className="special-subject-exam container"
                onClick={this.onClickOnSpecialExam}
              >
                {
                  this.props.news.isFirstTimeClick ? null :
                    <Image
                      className="new-info"
                      src="https://cheat-league.oss-cn-beijing.aliyuncs.com/new.png"
                      style={{width: '25px', height: '12px', position: 'absolute', marginLeft: '24px', marginTop: '-11px'}}
                    />
                }
                <View className="title">专题竞赛</View>
                <View className="image-wrapper">
                  <Image
                    className="image"
                    src="https://fzlm.njupt.edu.cn/police/image/2x/%E9%A6%96%E9%A1%B52-%E6%94%B9@2x.png"
                  />
                </View>
              </View>
            </BorderBoxWithTriangle>
            {/* 练习题库 */}
            <BorderBoxWithTriangle className="box margin-top">
              <View
                className="score-quesiton-bank container"
                onClick={this.onClickQuestionBank}
              >
                <View className="title">积分学习</View>
                <View className="image-wrapper">
                  <Image
                    className="image"
                    src="https://fzlm.njupt.edu.cn/police/image/2x/%E9%A6%96%E9%A1%B53-%E6%94%B9@2x.png"
                  />
                </View>
              </View>
            </BorderBoxWithTriangle>
            {/* 好友 PK */}
            <BorderBoxWithTriangle className="box margin-top">
              <View
                className="challenge container"
                onClick={this.onClickOnChallenge}
              >
                <View className="title">好友PK</View>
                <View className="image-wrapper">
                  <Image
                    className="image"
                    src="https://fzlm.njupt.edu.cn/police/image/2x/%E9%A6%96%E9%A1%B54-%E6%94%B9@2x.png"
                  />
                </View>
              </View>
            </BorderBoxWithTriangle>
            {/* 新手入门 */}
            <BorderBoxWithTriangle className="bar margin-top">
              <View className="guide container" onClick={this.onClickOnGuide}>
                <Image
                  className="image"
                  src="https://fzlm.njupt.edu.cn/police/image/2x/%E9%A6%96%E9%A1%B55@2x.png"
                />
                <Text className="title">新手入门</Text>
              </View>
            </BorderBoxWithTriangle>
          </View>
        </View>

        {/* 页脚 */}
        <View className="footer">
          <View className="line" />
          <View className="text">南京市公安局栖霞分局</View>
          <View className="line" />
        </View>

        {/* 用户授权弹窗 */}
        {shouldShowAuthorizationWindow ? (
          <View className="authorization-window">
            <View className="container">
              <View className="title">反诈</View>
              <View className="title">联盟</View>
              <Button
                openType="getUserInfo"
                onGetUserInfo={this.onGetUserInfo}
                className="button"
              >
                确认授权
              </Button>
            </View>
          </View>
        ) : null}
      </View>
    );
  }
}

export default Index;
