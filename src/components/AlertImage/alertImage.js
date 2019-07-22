import { View, Image } from "@tarojs/components";
import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import './alertImage.scss'

import {
  closeModel
} from "../../actions/match";

@connect(
  ({ match }) => ({ match }),
  dispatch => ({
    onCloseModel: () => dispatch(closeModel())
  })
)

class AlertImage extends Component{

  constructor (props) {
    super(props);
  }

  closeComponent () {
    this.props.onCloseModel()
  }

  render () {
    return (
      <View className="alert-image-box">
        <View className="content-container">
          <View className="content-inner-container">
            <View className="closeHeader">
              <Image
                className="closeComponent"
                src="http://fzlm.njupt.edu.cn/police/image/close.png"
                onClick={() => {this.closeComponent()}}
              />
            </View>
            <View>
              <Image
                className="model-content"
                src="https://cheat-league.oss-cn-beijing.aliyuncs.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20190707132200.jpg"
              />
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default AlertImage
