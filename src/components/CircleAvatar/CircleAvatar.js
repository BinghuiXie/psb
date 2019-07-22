import { OpenData, View } from "@tarojs/components";
import Taro, { Component } from "@tarojs/taro";

class CircleAvatar extends Component {
  render() {
    return (
      <View className="avatar-image">
        <OpenData className="avatar-image" type="userAvatarUrl" />
      </View>
    );
  }
}

export default CircleAvatar;
