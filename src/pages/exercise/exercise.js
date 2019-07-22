import { Button, Image, Text, View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import Taro, { Component } from "@tarojs/taro";
import PropTypes from "prop-types";
import "./exercise.scss";

import {
  changeChoice,
  confirmChoice,
  fetchQuestions,
  showNextQuestion,
  startCountDown,
  stopCountDown,
  stopExam,
  submitUserAnswers
} from "../../actions/exercise";

@connect(
  ({ exercise, info }) => ({ exercise, info }),
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
class Exercise extends Component {
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

  navigateToIndex() {
    Taro.navigateBack();
  }

  handleChangeChoice(choice) {
    this.props.onChangeChoice(choice);
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
    } = this.props.exercise;
    const { knowledge } = this.props.info;

    return (
      <View className="exercise">
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
              <View className="score">{knowledge.score}</View>
              <View className="score-desc text">当前积分</View>
              {/* 300分封顶 */}
              {knowledge.score < 300 ? (
                <View>
                  <View className="origin-score text">
                    原积分：{knowledge.score - scoreGain}
                  </View>
                  <View className="add-score text">答对加分:+{scoreGain}</View>
                </View>
              ) : (
                <View>
                  <View className="text">积分题库可获得积分数已达上限</View>
                </View>
              )}
              <Button className="button" onClick={this.navigateToIndex}>
                确认
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

export default Exercise;
