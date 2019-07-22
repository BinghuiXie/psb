import { Image, View } from "@tarojs/components";
import Taro, { Component } from "@tarojs/taro";

import matchApi from "../../api/match";
import "./tree.scss";

class Tree extends Component {
  config = {
    navigationBarTitleText: "反诈联盟",
    navigationBarTextStyle: "white",
    navigationBarBackgroundColor: "#14296a",
    backgroundColor: "#14296a"
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      name: "",
      deadline: ""
    };
  }

  componentDidMount() {
    const { matchId, name, deadline } = this.$router.params;
    matchApi.getGameInfo(matchId).then(res => {
      this.setState({
        data: res.data.data,
        name: name,
        deadline: deadline
      });
    });
  }

  dataFilter = () => {
    const allTrees = this.state.data;
    const allRound = Math.log2(allTrees.filter(i => i.round === 1).length * 2);
    let tree = [];
    for (let i = 1; i <= allRound; i++) {
      let temp = [];
      for (let j of allTrees) {
        if (j.round === i) {
          temp.push(j);
        }
      }
      tree.push(temp);
    }
    return tree;
  };

  render() {
    const { data, name, deadline } = this.state;
    const tree = this.dataFilter();
    let winner = {};
    if (data.length) {
      const last = tree.slice(-1)[0][0];
      winner = {
        name: last.winner,
        score:
          last.firstScore > last.secondScore
            ? last.firstScore
            : last.secondScore,
        avatar:
          last.firstScore > last.secondScore
            ? last.avatarFirst
            : last.avatarSecond
      };
    }

    const main =
      tree.length === 0
        ? null
        : tree.map((item, index) => {
            return (
              <View key={index} className="tree">
                {item.map((branch, branchIndex) => {
                  return (
                    <View key={branchIndex}>
                      <View className="branch">
                        <View>
                          <View className="name">{branch.first}</View>
                          <View className="score">{branch.firstScore}分</View>
                        </View>
                        <View className="avatar-wrapper">
                          <Image
                            className="avatar-image"
                            src={branch.avatarFirst}
                          />
                        </View>
                      </View>
                      <View className="branch">
                        <View>
                          <View className="name">{branch.second}</View>
                          <View className="score">{branch.secondScore}分</View>
                        </View>
                        <View className="avatar-wrapper">
                          <Image
                            className="avatar-image"
                            src={branch.avatarSecond}
                          />
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            );
          });

    const last = (
      <View className="tree">
        <View className="branch">
          <View>
            <View className="name">{winner.name}</View>
            <View className="score">{winner.score}分</View>
          </View>
          <View className="avatar-wrapper">
            <Image className="avatar-image" src={winner.avatar} />
          </View>
        </View>
      </View>
    );

    return (
      <View class="container">
        <View className="gameName">{name}</View>
        <View className="deadline">{"截止时间：" + deadline}</View>
        <Image
          src="https://fzlm.njupt.edu.cn/police/image/2x/lefttop.png"
          className="top"
        />
        <Image
          src="https://fzlm.njupt.edu.cn/police/image/2x/rightbottom.png"
          className="bottom"
        />
        <Image
          src="https://fzlm.njupt.edu.cn/police/image/2x/%E9%A6%96%E9%A1%B50@2x.png"
          className="center"
        />
        {data.length ? main : null}
        {data.length ? last : null}
      </View>
    );
  }
}

export default Tree;
