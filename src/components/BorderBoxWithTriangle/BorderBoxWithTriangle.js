import { View } from "@tarojs/components";
import Taro, { Component } from "@tarojs/taro";
import PropTypes from "prop-types";
import "./BorderBoxWithTriangle.scss";

class BorderBoxWithTriangle extends Component {
  static options = {
    addGlobalClass: true
  };

  static propTypes = {
    children: PropTypes.element,
    className: PropTypes.string,
    triangle: PropTypes.bool
  };

  static defaultProps = {
    triangle: true
  };

  render() {
    return (
      <View className={`border-box ${this.props.className}`}>
        <View className="border-box-with-triangle">
          {this.props.children}
          {this.props.triangle ? <View className="triangle" /> : null}
        </View>
      </View>
    );
  }
}

export default BorderBoxWithTriangle;
