import { View } from "@tarojs/components";
import Taro, { Component } from "@tarojs/taro";
import "./Footer.scss";

class Footer extends Component {
  static options = {
    addGlobalClass: true
  };

  render() {
    return (
      <View className="footer">
        {/* 页脚 */}
        <View className="line" />
        <View className="text">南京市公安局栖霞分局</View>
        <View className="line" />
      </View>
    );
  }
}

export default Footer;
