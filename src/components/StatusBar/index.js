import { Image, View } from "@tarojs/components";
import Taro, { Component } from "@tarojs/taro";
import "./StatusBar.scss";

class StatusBar extends Component {
  render() {
    const {
      avatar,
      opponentAvatar,
      countDown,
      name,
      opponentName
    } = this.props;
    return (
      <View className="status-bar">
        <View className="count-down">
          <View className="radial-timer time">{countDown}</View>
        </View>
        <View className="decoration">
          <Image
            className="decoration-image"
            src="http://fzlm.njupt.edu.cn/police/image/2x/%E7%9F%A9%E5%BD%A2.png"
          />
        </View>
        <View className="avatar-wrapper">
          <Image className="avatar" src={avatar} />
          <Image className="avatar" src={opponentAvatar} />
        </View>
        <View className="name-wrapper">
          <View className="name">{name}</View>
          <View className="name">{opponentName}</View>
        </View>
      </View>
    );
  }
}

export default StatusBar;
