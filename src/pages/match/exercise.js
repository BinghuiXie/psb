import { Button, Image, Text, View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import Taro, { Component } from "@tarojs/taro";
import "./exercise.scss";

import {
  changeChoice,
  confirmChoice,
  fetchQuestions,
  hideLoading,
  resetExercise,
  showNextQuestion,
  startCountDown,
  stopCountDown,
  stopExam,
  submitUserAnswers
} from "../../actions/match";
import { clearOpponentInfo, getOpponentInfo } from "../../actions/user";
import Loading from "../../components/Loading/Loading";
import ScoreBar from "../../components/ScoreBar";
import StatusBar from "../../components/StatusBar";
import { SCORE_GAIN_PER_QUESTION } from "../../constants/match";

@connect(
  ({ match, user }) => ({ match, user }),
  dispatch => ({
    onStartCountDown: () => dispatch(startCountDown()),
    onStopCountDown: () => dispatch(stopCountDown()),
    onFetchQuestions: () => dispatch(fetchQuestions()),
    onShowNextQuestion: () => dispatch(showNextQuestion()),
    onChangeChoice: choice => dispatch(changeChoice(choice)),
    onStopExam: () => dispatch(stopExam()),
    onConfirmChoice: () => dispatch(confirmChoice()),
    onSubmitUserAnswers: () => dispatch(submitUserAnswers()),
    onResetExercise: () => dispatch(resetExercise()),
    onHideLoading: () => dispatch(hideLoading()),
    onGetOpponentInfo: () => dispatch(getOpponentInfo()),
    onClearOpponentInfo: () => dispatch(clearOpponentInfo())
  })
)
class MatchExercise extends Component {
  config = {
    navigationBarTitleText: "反诈联盟",
    navigationBarTextStyle: "white",
    navigationBarBackgroundColor: "#14296a"
  };

  constructor(props) {
    super(props);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.submitUserAnswers = this.submitUserAnswers.bind(this);
    this.calcResultImageType = this.calcResultImageType.bind(this);
    this.navigateToExercise = this.navigateToExercise.bind(this);
  }

  componentDidMount() {
    this.props.onGetOpponentInfo();
    this.props.onFetchQuestions();
  }

  componentWillUnmount() {
    this.props.onResetExercise();
    this.props.onStopCountDown();
    this.props.onClearOpponentInfo();
  }

  nextQuestion() {
    Taro.pageScrollTo({ scrollTop: 0, duration: 300 });
    setTimeout(this.props.onShowNextQuestion, 300);
  }

  submitUserAnswers() {
    this.props.onConfirmChoice();
    this.props.onSubmitUserAnswers();
    this.props.onHideLoading();
    this.goToDial();
  }

  goToDial() {
    const { scoreGain, opponentScore } = this.props.match;
    if (scoreGain >= opponentScore) {
      Taro.navigateTo({ url: "/pages/rank/dial" });
    }
  }

  relaunchToIndex() {
    Taro.reLaunch({ url: "/pages/index/index" });
  }

  handleChangeChoice(choice) {
    this.props.onChangeChoice(choice);
  }

  navigateToExercise() {
    this.props.onResetExercise();
    this.props.onStopCountDown();
    Taro.redirectTo({ url: "/pages/match/exercise" });
  }

  navigateToTree() {
    Taro.navigateTo({ url: "/pages/match/tree" });
  }

  calcResultImageType() {
    const { openId } = this.props.user;
    const {
      status: { matchResult, winnerId }
    } = this.props.match;
    if (matchResult === "冠军" || matchResult === "亚军") {
      return matchResult;
    } else if (winnerId !== openId) {
      return "淘汰";
    } else {
      return "胜出";
    }
  }

  navigateToAnswer() {
    Taro.navigateTo({ url: "./answer" });
  }

  isSelectedChoicesEqualAnswers(selected, answers) {
    if (selected.length === 0) {
      return false;
    }
    for (let i = 0; i < selected.length; i++) {
      if (selected[i] !== answers[i]) {
        return false;
      }
    }
    return true;
  }

  render() {
    // 专题比赛结果需要的数据
    const {
      countDown,
      questions,
      scoreGain,
      currentQuestion,
      currentQuestionIndex,
      answers,
      selectedChoices,
      confirmed,
      onChangeChoice,
      onConfirmChoice,
      status: { loading, message },
      opponentScore
    } = this.props.match;
    const { avatar, nickName, opponentInfo } = this.props.user;

    const percent =
      (scoreGain / (questions.length * SCORE_GAIN_PER_QUESTION)) * 100;

    return (
      <View>
        {loading ? (
          <Loading avatar={avatar} message={message} />
        ) : (
          <View className="match-exercise">
            {/* banner */}
            <View className="banner-wrapper">
              <Image
                className="banner-image"
                src="https://fzlm.njupt.edu.cn/police/image/2x/banner@2x.png"
              />
            </View>

            {/* 状态栏 */}
            <StatusBar
              countDown={countDown}
              avatar={avatar}
              name={nickName}
              opponentAvatar={opponentInfo.avatar}
              opponentName={opponentInfo.nick}
            />

            {/* 完成度指示 */}
            <View className="completed-question">
              第
              <Text className="large">{Math.max(1, currentQuestionIndex)}</Text>
              /{questions.length}题
            </View>

            {/* 题目 */}
            <View className="question-title">
              {answers.length > 1 ? "（多选）" : ""}
              {currentQuestion.question
                ? currentQuestion.question.questionContent
                : null}
            </View>

            {/* 选项 */}
            <View className="question-options">
              {currentQuestion
                ? currentQuestion.choices.map(choice => (
                    <Button
                      key={choice.id}
                      onClick={onChangeChoice.bind(null, choice)}
                      className={[
                        "option",
                        `${
                          selectedChoices.includes(choice.id) ? "selected" : ""
                        }`,
                        `${
                          confirmed && answers.includes(choice.id)
                            ? "correct"
                            : ""
                        }`,
                        `${
                          confirmed &&
                          selectedChoices.includes(choice.id) &&
                          !answers.includes(choice.id)
                            ? "wrong"
                            : ""
                        }`
                      ].join(" ")}
                    >
                      <View className="text">{choice.content}</View>
                    </Button>
                  ))
                : null}
            </View>

            <View className="button-wrapper">
              {currentQuestionIndex !== questions.length ? (
                !confirmed ? (
                  <Button
                    className="button"
                    onClick={onConfirmChoice.bind(null)}
                  >
                    确认
                  </Button>
                ) : (
                  <Button className="button" onClick={this.nextQuestion}>
                    下一题
                  </Button>
                )
              ) : (
                <Button className="button" onClick={this.submitUserAnswers}>
                  完成
                </Button>
              )}
            </View>

            {currentQuestionIndex !== questions.length ? (
              !confirmed ? null : (
                <View className="add-score">
                  <View className="add-text">
                    {this.isSelectedChoicesEqualAnswers(
                      selectedChoices,
                      answers
                    )
                      ? "正确 "
                      : "错误 "}
                  </View>
                </View>
              )
            ) : null}

            <View className="look-answer" onClick={this.navigateToAnswer}>
              {currentQuestionIndex !== questions.length
                ? !confirmed
                  ? null
                  : "查看答案>>"
                : null}
            </View>

            {/* 我的分数指示 */}
            <ScoreBar
              className="left-score-bar"
              score={scoreGain}
              percent={percent}
              color="#e27b74"
            />

            {/* 对手的分数指示 */}
            <ScoreBar
              className="right-score-bar"
              score={opponentScore}
              percent={
                (opponentScore / (SCORE_GAIN_PER_QUESTION * questions.length)) *
                  100 || 0
              }
              color="#60a6d0"
            />

            {/* 页脚 */}
            <View className="footer">
              <View className="line" />
              <View className="text">南京市公安局栖霞分局</View>
              <View className="line" />
            </View>

            {/* 比赛结束弹窗 */}
            {!loading &&
            currentQuestionIndex === questions.length &&
            confirmed ? (
              <View className="complete-window">
                <View className="container">
                  <Text className="game-text">
                    {scoreGain >= opponentScore
                      ? "恭喜你获得了积分抽奖机会"
                      : "只有达到 60% 以上的正确率才能得分"}
                  </Text>
                  <View className="game-info">
                    <View className="user-info">
                      <View className="avatar-wrapper">
                        <Image className="avatar-image" src={avatar} />
                      </View>
                      <View className="name">{nickName}</View>
                      <View className="score">{scoreGain}</View>
                    </View>
                    <Image
                      src="https://fzlm.njupt.edu.cn/police/image/2x/vs.png"
                      className="vs"
                    />
                    <View className="user-info">
                      <View className="avatar-wrapper">
                        <Image
                          className="avatar-image"
                          src={opponentInfo.avatar}
                        />
                      </View>
                      <View className="name">{opponentInfo.nick}</View>
                      <View className="score">{opponentScore}</View>
                    </View>
                  </View>
                  {/* 比赛结束 */}
                  <Button
                    className="button confirm-button"
                    onClick={this.relaunchToIndex}
                  >
                    返回大厅
                  </Button>
                  <View
                    className="look-answer"
                    onClick={this.navigateToAnswer}
                  >{`查看答案>>`}</View>
                </View>
              </View>
            ) : null}
          </View>
        )}
      </View>
    );
  }
}

export default MatchExercise;
