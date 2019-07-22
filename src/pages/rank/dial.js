import { Button, Image, Text, View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import Taro, { Component } from "@tarojs/taro";

import Footer from "../../components/Footer/Footer";
import "./dial.scss";

// const RADIUS = 640;

// const getDistance = deg => 2 * RADIUS * Math.sin()

const randomPoint = () => Math.floor(Math.random() * 15 + 1);
// const calcTop = (deg) =>

@connect(({ match }) => ({ match }))
class Dial extends Component {
  config = {
    navigationBarTitleText: "反诈联盟",
    navigationBarTextStyle: "white",
    navigationBarBackgroundColor: "#14296a"
  };

  constructor(props) {
    super(props);
    this.state = {
      rotateDeg: 1680,
      mockPoints: Array.from({ length: 11 }).map(() => randomPoint()),
      shouldDialogVisible: false
    };

    this.setDegToZero = this.setDegToZero.bind(this);
  }

  setDegToZero() {
    this.setState({ rotateDeg: 0 });
    setTimeout(() => {
      this.setState({ shouldDialogVisible: true });
    }, 5500);
  }

  toggleDialogVisible() {
    const { shouldDialogVisible } = this.state;
    this.setState({ shouldDialogVisible: !shouldDialogVisible });
  }

  stopPropagation(event) {
    event.stopPropagation();
  }

  navigateToRedIndex() {
    Taro.navigateBack({ delta: 2 });
  }

  render() {
    const { rotateDeg, mockPoints, shouldDialogVisible } = this.state;
    const { questions } = this.props.match;
    return (
      <View className="dial">
        <View className="dial-container">
          <View
            className="dial-wrapper"
            style={`transform: rotate(${rotateDeg}deg)`}
          >
            <Image
              className="dial-image"
              src="https://fzlm.njupt.edu.cn/police/image/2x/转盘2.png"
            />

            <View className="text-wrapper text-1 main">
              <View className="text big number">{questions[0].num}</View>
              <View className="text">积分</View>
            </View>

            {mockPoints.map((point, index) => (
              <View
                className={`text-wrapper text-${index + 2}`}
                key={`${index}00${point}`}
                style={{ transform: `rotate(${(index + 1) * 30}deg)` }}
              >
                <View className="text big number">{point}</View>
                <View className="text">积分</View>
              </View>
            ))}
          </View>

          <Image
            className="dial-pointer"
            src="https://fzlm.njupt.edu.cn/police/image/2x/指针.png"
          />
        </View>

        <Button className="button" onClick={this.setDegToZero}>
          点击抽奖
        </Button>

        <View className="desc">奖励说明：该积分仅用于XXXXXXXXXXXXXXXX</View>

        {shouldDialogVisible ? (
          <View className="dialog-wrapper" onClick={this.toggleDialogVisible}>
            <View className="desc-dialog" onClick={this.stopPropagation}>
              <Image
                className="background-image"
                src="https://fzlm.njupt.edu.cn/police/image/2x/弹出框1@2x.png"
              />
              <View className="text-wrapper">
                <View className="text">
                  喜提 <Text className="number">{questions[0].num}</Text> 积分~
                </View>
              </View>

              <Button
                className="confirm-button button"
                onClick={this.navigateToRedIndex}
              >
                确认
              </Button>
            </View>
          </View>
        ) : null}

        <Footer />
      </View>
    );
  }
}

export default Dial;
