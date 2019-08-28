import { Button, Image, Text, View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import Taro, { Component } from "@tarojs/taro";
import "./rank.scss";
import StatusBar from "../../components/StatusBar";
import ScoreBar from "../../components/ScoreBar";

import {
  changeChoice,
  changeType,
  confirmChoice,
  fetchQuestions,
  showNextQuestion,
  startCountDown,
  stopCountDown,
  stopExam,
  submitUserAnswers
} from "../../actions/rank";
import { getOpponentInfo, clearOpponentInfo } from "../../actions/user";
import { SCORE_GAIN_PER_QUESTION } from "../../constants/rank";

@connect(
  ({ rank, info, user }) => ({ rank, info, user }),
  dispatch => ({
    onStartCountDown: () => dispatch(startCountDown()),
    onStopCountDown: () => dispatch(stopCountDown()),
    onFetchQuestions: () => dispatch(fetchQuestions()),
    onShowNextQuestion: () => dispatch(showNextQuestion()),
    onChangeChoice: choice => dispatch(changeChoice(choice)),
    onStopExam: () => dispatch(stopExam()),
    onConfirmChoice: () => dispatch(confirmChoice()),
    onSubmitUserAnswers: () => dispatch(submitUserAnswers()),
    onChangeType: () => dispatch(changeType()),
    onGetOpponentInfo: () => dispatch(getOpponentInfo()),
    onClearOpponentInfo: () => dispatch(clearOpponentInfo())
  })
)
class Rank extends Component {
  config = {
    navigationBarTitleText: "反诈联盟",
    navigationBarTextStyle: "white",
    navigationBarBackgroundColor: "#14296a"
  };

  constructor(props) {
    super(props);
    this.state = {
      modal: "",
      shouldShowOpponentInfo: true
    };
  }

  componentDidMount() {
    const modal = this.$router.params.type;
    this.setState({ modal });

    // 对战
    this.props.onChangeType();
    this.fetchAvatar();
    setTimeout(() => {
      this.props.onFetchQuestions();
      this.setState({ shouldShowOpponentInfo: false });
    }, 3000);
  }

  fetchAvatar = () => {
    this.props.onGetOpponentInfo();
  };

  componentWillUnmount() {
    this.props.onStopExam();
    this.props.onStopCountDown();
    this.props.onClearOpponentInfo();
  }

  nextQuestion = () => {
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
    setTimeout(this.props.onShowNextQuestion, 300);
  };

  submitUserAnswers = () => {
    this.props.onConfirmChoice();
    this.props.onSubmitUserAnswers();
  };

  navigateToIndex() {
    Taro.navigateBack();
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
    console.log("------rank/rank.js------");
    console.log("this.props: ", this.props);
    console.log("this.props.rank: ", this.props.rank);
    const {
      countDown,
      questions,
      currentQuestion,
      currentQuestionIndex,
      answers,
      selectedChoices,
      scoreGain,
      confirmed,
      opponentScore
    } = this.props.rank;
    const {
      onChangeChoice,
      onConfirmChoice
    } = this.props;
    console.log("onConfirmChoice: ", onConfirmChoice);
    const { avatar, nickName, opponentInfo } = this.props.user;
    const { shouldShowOpponentInfo } = this.state;

    const percent =
      (scoreGain / (questions.length * SCORE_GAIN_PER_QUESTION)) * 100;

    return (
      <View className="rank">
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
          第<Text className="large">{Math.max(1, currentQuestionIndex)}</Text>/
          {questions.length}题
        </View>

        {/* 题目 */}
        <View className="question-title">
          {answers.length > 1 ? "（多选）" : ""}
          {currentQuestion.question.questionContent}
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
                    `${selectedChoices.includes(choice.id) ? "selected" : ""}`,
                    `${
                      confirmed && answers.includes(choice.id) ? "correct" : ""
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
              <Button className="button" onClick={onConfirmChoice.bind(null)}>
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
                {this.isSelectedChoicesEqualAnswers(selectedChoices, answers)
                  ? "正确 "
                  : "错误 "}
              </View>
              <Image
                src="https://fzlm.njupt.edu.cn/police/image/2x/coin.png"
                className="coin"
              />
              <View className="add-text">{` + ${
                this.isSelectedChoicesEqualAnswers(selectedChoices, answers)
                  ? SCORE_GAIN_PER_QUESTION
                  : 0
              }`}</View>
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

        {/* 比赛开始前弹窗 */}
        {shouldShowOpponentInfo ? (
          <View className="start-window-double">
            <View className="container">
              <View className="game-info">
                <View className="user-info">
                  <View className="avatar-wrapper">
                    <Image className="avatar-image" src={avatar} />
                  </View>
                  <View className="name">{nickName}</View>
                </View>
                <Image
                  src="https://fzlm.njupt.edu.cn/police/image/2x/vs.png"
                  className="vs"
                />
                <View className="user-info">
                  <View className="avatar-wrapper">
                    <Image className="avatar-image" src={opponentInfo.avatar} />
                  </View>
                  <View className="name">{opponentInfo.nick || ""}</View>
                </View>
              </View>
            </View>
          </View>
        ) : null}

        {/* 比赛结束弹窗 */}
        {currentQuestionIndex === questions.length && confirmed ? (
          <View className="complete-window-double">
            <View className="container">
              <Image
                // src="https://fzlm.njupt.edu.cn/police/image/2x/win.png"
                src={`https://fzlm.njupt.edu.cn/police/image/2x/${
                  scoreGain >= opponentScore ? "胜出" : "淘汰"
                }.png`}
                className="answer-type"
              />
              {/* <View className="game-step">{matchResult}</View> */}
              <View className="game-info">
                <View className="user-info">
                  <View className="avatar-wrapper">
                    <Image className="avatar-image" src={avatar} />
                  </View>
                  <View className="name">{nickName}</View>
                  <View className="score">{`${scoreGain}`}分</View>
                </View>
                <Image
                  src="https://fzlm.njupt.edu.cn/police/image/2x/vs.png"
                  className="vs"
                />
                <View className="user-info">
                  <View className="avatar-wrapper">
                    <Image className="avatar-image" src={opponentInfo.avatar} />
                  </View>
                  <View className="name">{opponentInfo.nick}</View>
                  <View className="score">{`${opponentScore}`}分</View>
                </View>
              </View>
              {/* 比赛结束 */}
              <Button
                className="button confirm-button"
                onClick={this.navigateToIndex}
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
    );
  }
}

export default Rank;
