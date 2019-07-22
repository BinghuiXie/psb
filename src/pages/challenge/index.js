import { Button, Image, Textarea, View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import Taro, { Component } from "@tarojs/taro";
import { createRoom } from "../../actions/challenge";
import Footer from "../../components/Footer/Footer";
import "./index.scss";

@connect(
  ({ challenge }) => ({ challenge }),
  dispatch => ({
    onCreateRoom: message => dispatch(createRoom(message))
  })
)
class ChallengeIndex extends Component {
  config = {
    navigationBarTitleText: "反诈联盟",
    navigationBarTextStyle: "white",
    navigationBarBackgroundColor: "#14296a"
  };

  constructor(props) {
    super(props);
    this.state = {
      shouldDialogVisible: false
    };

    this.toggleDialogVisible = this.toggleDialogVisible.bind(this);
    this.goToChallengeRoom = this.goToChallengeRoom.bind(this);
  }

  toggleDialogVisible() {
    const { shouldDialogVisible } = this.state;
    this.setState({
      shouldDialogVisible: !shouldDialogVisible,
      message: ""
    });

    this.createChallengeRoom = this.createChallengeRoom.bind(this);
    this.handleMessageInput = this.handleMessageInput.bind(this);
  }

  stopPropagation(event) {
    event.stopPropagation();
  }

  async createChallengeRoom() {
    this.props.onCreateRoom(
      this.state.message || "看谁更厉害，答题越快分数越高"
    );
    this.goToChallengeRoom();
  }

  goToChallengeRoom() {
    if (!this.props.challenge.challengeId) {
      setTimeout(this.goToChallengeRoom.bind(this), 300);
      return;
    }
    Taro.navigateTo({ url: "/pages/challenge/room" });
  }

  goToChallengeRecord() {
    Taro.navigateTo({ url: "/pages/challenge/record" });
  }

  handleMessageInput({ detail: { value: message } }) {
    this.setState({ message });
  }

  render() {
    const { shouldDialogVisible, message } = this.state;
    return (
      <View className='challenge-index'>
        {/* banner */}
        <View className='banner-wrapper'>
          <Image
            className='banner-image'
            src='https://fzlm.njupt.edu.cn/police/image/2x/banner@2x.png'
          />
        </View>

        {/* slogan */}
        <View className='slogan first'>邀请好友</View>
        <View className='slogan'>逐鹿中原</View>

        {/* 留言 */}
        <View className='message-title'>· 邀请留言 ·</View>
        <View className='message'>
          {!shouldDialogVisible ? (
            <Textarea
              className='message-board'
              placeholder='看谁更厉害，答题越快分数越高'
              placeholderStyle='color: rgba(211, 240, 255, 0.5);'
              value={message}
              onInput={this.handleMessageInput}
            />
          ) : null}
        </View>

        {/* 生成房间 */}
        <Button
          className='generate-room-button button'
          onClick={this.createChallengeRoom}
        >
          生成房间
        </Button>

        {/* 挑战记录 */}
        <Button
          className='challenge-record-button button'
          onClick={this.goToChallengeRecord}
        >
          {"挑战记录>>"}
        </Button>

        {/* 限时说明 */}
        <View className='limited-time-desc'>挑战有效时间：20分钟内</View>

        {/* 问号 */}
        <View className='more-desc-wrapper'>
          <View className='more-desc' onClick={this.toggleDialogVisible}>
            ?
          </View>
        </View>

        {/* 更多描述的弹出框 */}
        {shouldDialogVisible ? (
          <View className='dialog-wrapper' onClick={this.toggleDialogVisible}>
            <View className='desc-dialog' onClick={this.stopPropagation}>
              <Image
                className='background-image'
                src='https://fzlm.njupt.edu.cn/police/image/2x/弹出框1@2x.png'
              />
              <View className='text-wrapper'>
                <View className='text'>1.生成挑战相关内容说明</View>
                <View className='text'>2.生成挑战相关内容说明</View>
                <View className='text'>生成挑战相关内容说明</View>
                <View className='text'>生成挑战相关内容说明</View>
                <View className='text'>3.生成挑战相关内容说明</View>
                <View className='text'>3.生成挑战相关内容说明</View>
                <View className='text'>3.生成挑战相关内容说明</View>
                <View className='text'>3.生成挑战相关内容说明</View>
                <View className='text'>3.生成挑战相关内容说明</View>
                <View className='text'>3.生成挑战相关内容说明</View>
                <View className='text'>3.生成挑战相关内容说明</View>
                <View className='text'>3.生成挑战相关内容说明</View>
                <View className='text'>3.生成挑战相关内容说明</View>
                <View className='text'>3.生成挑战相关内容说明</View>
                <View className='text'>3.生成挑战相关内容说明</View>
                <View className='text'>3.生成挑战相关内容说明</View>
                <View className='text'>3.生成挑战相关内容说明</View>
                <View className='text'>3.生成挑战相关内容说明</View>
                <View className='text'>3.生成挑战相关内容说明</View>
                <View className='text'>3.生成挑战相关内容说明</View>
              </View>

              <Button className='confirm-button button'>确认</Button>
            </View>
          </View>
        ) : null}

        <Footer />
      </View>
    );
  }
}

export default ChallengeIndex;
