import { Image, View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import Taro, { Component } from "@tarojs/taro";
import "./answer.scss";

@connect(({ match }) => ({ match }))
class Answer extends Component {
  config = {
    navigationBarTitleText: "反诈联盟",
    navigationBarTextStyle: "white",
    navigationBarBackgroundColor: "#14296a"
  };

  getAnswer(question) {
    const { answer, choices } = question;
    for (let i of choices) {
      if (i.id === answer[0].choiceId) {
        return i.content;
      }
    }
  }

  render() {
    const {
      currentQuestion,
      questions,
      currentQuestionIndex
    } = this.props.match;
    const data =
      currentQuestionIndex === questions.length
        ? questions
        : new Array(currentQuestion);

    const single = data.map(i => {
      return (
        <View className="main" key={i.question.questionContent}>
          <View className="question">
            <View>Q: </View>
            <View>{i.question.questionContent}</View>
          </View>

          <View className="answer">
            <View>A: </View>
            <View>{this.getAnswer(i)}</View>
          </View>
        </View>
      );
    });

    return (
      <View className="challenge-index">
        {/* banner */}
        <View className="banner-wrapper">
          <Image
            className="banner-image"
            src="https://fzlm.njupt.edu.cn/police/image/2x/bgc.png"
          />
        </View>
        {single}
      </View>
    );
  }
}

export default Answer;
