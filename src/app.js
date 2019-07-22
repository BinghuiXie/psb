import "@tarojs/async-await";
import Taro, { Component } from "@tarojs/taro";
import { Provider } from "@tarojs/redux";

import Index from "./pages/index";

import configStore from "./store";

import "./app.scss";

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore();

class App extends Component {
  config = {
    pages: [
      "pages/index/index",
      "pages/bindInfo/bindInfo",
      "pages/exercise/exercise",
      "pages/exercise/answer",
      "pages/rank/rank",
      "pages/rank/choose",
      "pages/rank/answer",
      "pages/rank/dial",
      "pages/rank/redPocket",
      "pages/rank/redPocketIndex",
      "pages/rank/redPocketHistory",
      "pages/titleList/titleList",
      "pages/profile/profile",
      "pages/rankList/rankList",
      "pages/news/news",
      "pages/news/detail",
      "pages/challenge/index",
      "pages/challenge/room",
      "pages/challenge/answer",
      "pages/challenge/record",
      "pages/challenge/checkAnswer",
      "pages/match/index",
      "pages/match/exercise",
      "pages/match/history",
      "pages/match/tree",
      "pages/match/answer",
      "pages/guide/guide"
    ],
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#14296a",
      navigationBarTitleText: "反诈联盟",
      navigationBarTextStyle: "white",
      backgroundColor: "#14296a"
    }
  };

  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentCatchError() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    );
  }
}

Taro.render(<App />, document.getElementById("app"));
