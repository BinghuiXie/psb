import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./ScoreBar.scss";

class ScoreBar extends Component {
  static options = { addGlobalClass: true };

  render() {
    const { score, percent, color } = this.props;
    return (
      <View className={`score-bar ${this.props.className}`}>
        <View className="score" style={{ color }}>
          {score}
        </View>
        <View className="score-column">
          <View
            className="color-column"
            style={{ background: color, height: percent + "%" }}
          />
        </View>
      </View>
    );
  }
}

export default ScoreBar;
