import { Image, View } from "@tarojs/components";
import Taro, { Component } from "@tarojs/taro";
import Footer from "../Footer/Footer";
import "./Loading.scss";

class Loading extends Component {
  render() {
    return (
      <View className='loading'>
        <View className='round round_1' />
        <View className='round round_2' />
        <View className='round round_3'>
          <Image
            className='ball_3'
            src='https://fzlm.njupt.edu.cn/police/image/2x/11.png'
          />
        </View>
        <View className='round round_4'>
          <Image
            className='ball_4'
            src='https://fzlm.njupt.edu.cn/police/image/2x/22.png'
          />
        </View>
        <View className='avatar-wrapper round round_5'>
          <Image className='avatar-image' src={this.props.avatar} />
        </View>
        <View class='waiting_text'>{this.props.message}</View>
        <Footer />
      </View>
    );
  }
}

export default Loading;
