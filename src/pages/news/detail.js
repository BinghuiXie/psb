import { RichText, View, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import Taro, { Component } from "@tarojs/taro";

import { formatTime } from "../../utils/time";
import "./detail.scss";

@connect(({ news }) => ({ newsList: news }))
class NewsDetail extends Component {
  config = {
    navigationBarTitleText: "反诈联盟",
    navigationBarTextStyle: "black",
    navigationBarBackgroundColor: "#ffffff"
  };

  constructor(props) {
    super(props);
    this.state = {
      news: { title: "", content: "" }
    };
  }

  componentWillMount() {
    const { id } = this.$router.params;
    const news = this.props.newsList.news.find(
      ({ id: newsId }) => Number.parseInt(newsId) === Number.parseInt(id)
    );
    this.setState({ news });
  }

  render() {
    const { news } = this.state;
    return (
      <View className="news-detail">
        <View className="title">{news.title}</View>
        <View className="author">发布者:{news.author}</View>
        <View className="date">
          日期:
          {formatTime(news.date, "YYYY-MM-DD HH:mm:ss")}
        </View>
        <View className="content">
          {news.mainPic ? (
            <Image src={news.mainPic} mode="widthFix" />
          ) : (
            <RichText nodes={news.content} />
          )}
        </View>
      </View>
    );
  }
}

export default NewsDetail;
