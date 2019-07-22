import { View } from "@tarojs/components";
import Taro, { Component } from "@tarojs/taro";
import PropTypes from "prop-types";
import "./BorderBox.scss";

class BorderBox extends Component {
  static options = { addGlobalClass: true };

  render() {
    return (
      <View className={`border-box ${this.props.className}`}>
        {this.props.children}
      </View>
    );
  }
}

BorderBox.propTypes = {
  children: PropTypes.element,
  className: PropTypes.string
};

export default BorderBox;
