import { Image, Text, View } from "@tarojs/components";
import Taro, { Component } from "@tarojs/taro";

import BorderBoxWithTriangle from "../../components/BorderBoxWithTriangle/BorderBoxWithTriangle";
import "./titleList.scss";

class TitleList extends Component {
  config = {
    navigationBarTitleText: "反诈联盟",
    navigationBarTextStyle: "white",
    navigationBarBackgroundColor: "#14296a"
  };

  render() {
    return (
      <View className="title-list">
        <BorderBoxWithTriangle className="rank-item">
          <View className="container">
            <Image
              className="rank-image"
              src="https://fzlm.njupt.edu.cn/police/image/2x/%E6%AE%B5%E4%BD%8D1@2x.png"
            />
            <Text className="rank-text">初出茅庐</Text>
            <Text className="score-interval">100-500</Text>
          </View>
        </BorderBoxWithTriangle>
        <BorderBoxWithTriangle className="rank-item gap">
          <View className="container">
            <Image
              className="rank-image"
              src="https://fzlm.njupt.edu.cn/police/image/2x/%E6%AE%B5%E4%BD%8D2@2x.png"
            />
            <Text className="rank-text">轻车熟路</Text>
            <Text className="score-interval">500-1500</Text>
          </View>
        </BorderBoxWithTriangle>
        <BorderBoxWithTriangle className="rank-item gap">
          <View className="container">
            <Image
              className="rank-image"
              src="https://fzlm.njupt.edu.cn/police/image/2x/%E6%AE%B5%E4%BD%8D3@2x.png"
            />
            <Text className="rank-text">炉火纯青</Text>
            <Text className="score-interval">1500-2500</Text>
          </View>
        </BorderBoxWithTriangle>
        <BorderBoxWithTriangle className="rank-item gap">
          <View className="container">
            <Image
              className="rank-image"
              src="https://fzlm.njupt.edu.cn/police/image/2x/%E6%AE%B5%E4%BD%8D4@2x.png"
            />
            <Text className="rank-text">超凡大师</Text>
            <Text className="score-interval">2500+</Text>
          </View>
        </BorderBoxWithTriangle>
      </View>
    );
  }
}

export default TitleList;
