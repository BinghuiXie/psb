import { Image, View } from "@tarojs/components";
import Taro, { Component } from "@tarojs/taro";

import rankApi from "../../api/rank";
import "./redPocketHistory.scss";

class RedPocketHistory extends Component {
  config = {
    navigationBarTitleText: "反诈联盟",
    navigationBarTextStyle: "white",
    navigationBarBackgroundColor: "#14296a"
  };

  constructor(props) {
    super(props);

    this.state = {
      records: []
    };
    this.fetchHistory = this.fetchHistory.bind(this);
  }

  componentDidMount() {
    this.fetchHistory();
  }

  async fetchHistory() {
    const {
      data: { data }
    } = await rankApi.getOwnMoneyLog();
    this.setState({ records: data });
  }

  render() {
    const { records } = this.state;
    return (
      <View className="red-pocket-history">
        {/* banner */}
        <View className="banner-wrapper">
          <Image
            className="banner-image"
            src="https://fzlm.njupt.edu.cn/police/image/2x/banner@2x.png"
          />
        </View>

        {/* 挑战记录 */}
        <View className="record-list">
          {records.map(record => (
            <View className="record" key={record.num}>
              {/* 留言 */}
              <View className="remark-wrapper">
                <View className="left-triangle triangle" />
                <View className="remark">获得 {record.num} 积分</View>
              </View>

              {/* deadline */}
              {/* <View className="deadline-wrapper">
                <View className="result deadline">{record.result}</View>
                <View className="right-triangle triangle" />
              </View> */}
            </View>
          ))}
        </View>
      </View>
    );
  }
}

export default RedPocketHistory;
