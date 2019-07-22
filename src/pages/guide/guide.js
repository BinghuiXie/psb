import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, Button } from "@tarojs/components";
import "./guide.scss";

class Exercise extends Component {
  config = {
    navigationBarTitleText: "反诈联盟",
    navigationBarTextStyle: "white",
    navigationBarBackgroundColor: "#14296a"
  };

  toExercise() {
    Taro.navigateTo({ url: "/pages/exercise/exercise" });
  }

  toRank() {
    Taro.navigateTo({ url: "/pages/rank/rank" });
  }

  toMatch() {
    Taro.navigateTo({ url: "/pages/match/index" });
  }

  toChallenge() {
    Taro.navigateTo({ url: "/pages/challenge/index" });
  }

  render() {
    return (
      <View className="guide">
        <View className="title">反诈联盟 入门手册</View>
        <Text className="notic">反诈新手入门指引</Text>
        <View className="item">
          <Text className="name">积分学习模式</Text>
          <Text className="text">
            刷题库，强化反诈骗意识，为参与挑战和排位赛、专题竞赛做足准备！
          </Text>
          <Image
            className="image"
            src="https://fzlm.njupt.edu.cn/police/image/2x/%E9%A6%96%E9%A1%B51-%E6%94%B9@2x.png"
          />
          <Button className="but" onClick={this.toExercise}>
            开始学习
          </Button>
        </View>

        <View className="item">
          <Text className="name">排位赛模式</Text>
          <Text className="text">
            通过PK,验证反诈知识的掌握度，胜者即可获取升级，晋升排行榜！
          </Text>
          <Image
            className="image"
            src="https://fzlm.njupt.edu.cn/police/image/2x/%E9%A6%96%E9%A1%B52-%E6%94%B9@2x.png"
          />
          <Button className="but" onClick={this.toRank}>
            开始对战
          </Button>
        </View>

        <View className="item">
          <Text className="name">专题竞赛模式</Text>
          <Text className="text">
            官方定期、不定期举办挑战送红包送奖品的专题赛事，答题耗时少，正确率高的同学们，红包奖品拿到手软！
          </Text>
          <Image
            className="image"
            src="https://fzlm.njupt.edu.cn/police/image/2x/%E9%A6%96%E9%A1%B53-%E6%94%B9@2x.png"
          />
          <Button className="but" onClick={this.toMatch}>
            参加竞赛
          </Button>
        </View>

        <View className="item">
          <Text className="name">好友pk模式</Text>
          <Text className="text">
            谁的反诈骗意识强，跟你的朋友们一起挑战试试看？
          </Text>
          <Image
            className="image"
            src="https://fzlm.njupt.edu.cn/police/image/2x/%E9%A6%96%E9%A1%B54-%E6%94%B9@2x.png"
          />
          <Button className="but" onClick={this.toChallenge}>
            邀请好友
          </Button>
        </View>
      </View>
    );
  }
}

export default Exercise;
