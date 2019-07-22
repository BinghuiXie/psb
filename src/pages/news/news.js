import { Image, RichText, View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import Taro, { Component } from "@tarojs/taro";

import { nextPage } from "../../actions/news";
import { formatTime } from "../../utils/time";
import "./news.scss";

@connect(
  ({ news }) => ({ news }),
  dispathc => ({
    onNextPage: () => dispathc(nextPage())
  })
)
class News extends Component {
  config = {
    navigationBarTitleText: "反诈联盟",
    navigationBarTextStyle: "black",
    navigationBarBackgroundColor: "#ffffff"
  };

  onReachBottom() {
    this.props.onNextPage();
  }

  showNewsDetail(id) {
    Taro.navigateTo({ url: `/pages/news/detail?id=${id}` });
  }

  render() {
    return (
      <View className="news">
        {/* banner */}
        <View className="banner-wrapper">
          <Image
            className="banner-image"
            src="https://fzlm.njupt.edu.cn/police/image/2x/banner@2x.png"
          />
        </View>

        <View className="news-list">
          {this.props.news.news.map(item => (
            <View
              className="news-item"
              key={item.id}
              onClick={this.showNewsDetail.bind(null, item.id)}
            >
              <View className="info">
                <View className="title">{item.title}</View>
                <View className="content">
                  {item.content ? (
                    <RichText
                      nodes={
                        item.content.length < 26
                          ? item.content
                          : item.content.slice(0, 26) + "..."
                      }
                    />
                  ) : null}
                </View>
                <View className="date">
                  {formatTime(item.date, "YYYY-MM-DD")}
                </View>
              </View>
              {item.subPic ? (
                <View
                  className={`image-wrapper ${item.subPic ? "has-image" : ""}`}
                >
                  <Image className="image" src={item.subPic} />
                </View>
              ) : null}
            </View>
          ))}
        </View>
      </View>
    );
  }
}

export default News;
