import { Button, Image, Text, View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import Taro, { Component } from "@tarojs/taro";
import PropTypes from "prop-types";
import "./answer.scss";

import {
  changeChoice,
  confirmChoice,
  fetchQuestions,
  showNextQuestion,
  startCountDown,
  stopCountDown,
  stopExam,
  submitUserAnswers
} from "../../actions/challenge";

@connect(
  ({ challenge, info }) => ({ challenge, info }),
  dispatch => ({
    onStartCountDown: () => dispatch(startCountDown()),
    onStopCountDown: () => dispatch(stopCountDown()),
    onFetchQuestions: () => dispatch(fetchQuestions()),
    onShowNextQuestion: () => dispatch(showNextQuestion()),
    onChangeChoice: choice => dispatch(changeChoice(choice)),
    onStopExam: () => dispatch(stopExam()),
    onConfirmChoice: () => dispatch(confirmChoice()),
    onSubmitUserAnswers: () => dispatch(submitUserAnswers())
  })
)
class ChallengeAnswer extends Component {
  config = {
    navigationBarTitleText: "反诈联盟",
    navigationBarTextStyle: "white",
    navigationBarBackgroundColor: "#14296a"
  };

  static propTypes = {
    exercise: PropTypes.object,
    onStartCountDown: PropTypes.func,
    onStopCountDown: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.submitUserAnswers = this.submitUserAnswers.bind(this);
  }

  componentDidMount() {
    this.props.onFetchQuestions();
  }

  componentWillUnmount() {
    this.props.onStopExam();
    this.props.onStopCountDown();
  }

  nextQuestion() {
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
    setTimeout(this.props.onShowNextQuestion, 300);
  }

  submitUserAnswers() {
    this.props.onConfirmChoice();
    this.props.onSubmitUserAnswers();
  }

  navigateBack() {
    Taro.navigateBack();
  }

  navigateToIndex() {
    Taro.reLaunch({ url: "/pages/index/index" });
  }

  handleChangeChoice(choice) {
    this.props.onChangeChoice(choice);
  }

  navigateToAnswer() {
    Taro.navigateTo({ url: "./checkAnswer" });
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
    const {
      countDown,
      questions,
      currentQuestion,
      currentQuestionIndex,
      answers,
      selectedChoices,
      scoreGain,
      confirmed,
      onChangeChoice,
      onConfirmChoice
    } = this.props.challenge;

    return (
      <View className="challenge-answer">
        {/* banner */}
        <View className="banner-wrapper">
          <Image
            className="banner-image"
            src="https://fzlm.njupt.edu.cn/police/image/2x/banner@2x.png"
          />
        </View>

        {/* 倒计时 */}
        <View className="count-down">
          <View className="radial-timer time">{countDown}</View>
        </View>

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
                  {/* <Image
                    className="icon icon-right"
                    src="https://fzlm.njupt.edu.cn/police/image/2x/icon_right.png"
                  />
                  <Image
                    className="icon icon-wrong"
                    src="https://fzlm.njupt.edu.cn/police/image/2x/icon_wrong.png"
                  /> */}
                </Button>
              ))
            : null}
        </View>

        <View className="button-wrapper">
          {currentQuestionIndex !== 0 ? (
            currentQuestionIndex !== questions.length ? (
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
            )
          ) : null}
        </View>

        {currentQuestionIndex !== questions.length ? (
          !confirmed ? null : (
            <View className="add-score">
              <View className="add-text">
                {this.isSelectedChoicesEqualAnswers(selectedChoices, answers)
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

        {/* 页脚 */}
        <View className="footer">
          <View className="line" />
          <View className="text">南京市公安局栖霞分局</View>
          <View className="line" />
        </View>

        {/* 答题完成弹窗 */}
        {currentQuestionIndex === questions.length && confirmed ? (
          <View className="complete-window">
            <View className="container">
              <View className="score">{scoreGain}</View>
              <View className="score-desc text">你的分数</View>
              <Button className="button" onClick={this.navigateBack}>
                查看排行
              </Button>
              <Button className="button" onClick={this.navigateToIndex}>
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

export default ChallengeAnswer;
