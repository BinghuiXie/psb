import { Button, Image, Input, Picker, Text, View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import Taro, { Component } from "@tarojs/taro";
import { fetchAllInformation, fetchSchoolRank } from "../../actions/info";
import { fetchNews } from "../../actions/news";
import { updateInfo } from "../../actions/user";
import { bindInfo, getSchoolList } from "../../api/bindInfo";
import "./bindInfo.scss";

@connect(
  ({ user }) => ({ user }),
  dispatch => ({
    onFetchAllInformation: () => dispatch(fetchAllInformation()),
    onFetchSchoolRank: () => dispatch(fetchSchoolRank()),
    onFetchNews: () => dispatch(fetchNews()),
    onUpdateInfo: userInfo => dispatch(updateInfo(userInfo))
  })
)
class BindInfo extends Component {
  config = {
    navigationBarTitleText: "反诈联盟",
    navigationBarTextStyle: "white",
    navigationBarBackgroundColor: "#14296a"
  };

  constructor(props) {
    super(props);
    this.state = {
      schoolList: null,
      schoolRange: [],
      collegeRange: [],
      name: "",
      school: "",
      college: "",
      year: "",
      studentId: "",
      phoneNumber: ""
    };

    this.handleNameInput = this.handleNameInput.bind(this);
    this.handlePhoneInput = this.handlePhoneInput.bind(this);
    this.handleSchoolSelect = this.handleSchoolSelect.bind(this);
    this.handleCollegeSelect = this.handleCollegeSelect.bind(this);
    this.handleStudentIdInput = this.handleStudentIdInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.mountSchoolList = this.mountSchoolList.bind(this);
    this.handleYearInput = this.handleYearInput.bind(this);
  }

  componentDidMount() {
    this.mountSchoolList();
  }

  async mountSchoolList() {
    try {
      const {
        data: { data, success, ...err }
      } = await getSchoolList();
      if (success) {
        const schoolList = JSON.parse(data);
        this.setState({
          schoolList,
          schoolRange: Object.keys(schoolList)
        });
      } else {
        throw new Error(JSON.stringify(err));
      }
    } catch (e) {
      console.error(e);
    }
  }

  handleNameInput({ detail: { value } }) {
    this.setState({ name: value });
  }

  handlePhoneInput({ detail: { value } }) {
    this.setState({ phoneNumber: value });
  }

  handleSchoolSelect({ detail: { value } }) {
    const { schoolList } = this.state;
    const [school, collegeRange] = Object.entries(schoolList)[value];
    this.setState({ school, collegeRange: Object.keys(collegeRange) });
  }

  handleCollegeSelect({ detail: { value } }) {
    const { schoolList, school } = this.state;
    const collegeOfSchool = schoolList[school];
    const college = Object.keys(collegeOfSchool)[value];
    this.setState({ college });
  }

  handleStudentIdInput({ detail: { value } }) {
    this.setState({ studentId: value });
  }

  handleYearInput({ detail: { value } }) {
    this.setState({ year: value });
  }

  async handleSubmit() {
    const {
      studentId,
      name,
      phoneNumber,
      school,
      college,
      major,
      year
    } = this.state;
    const { gender } = this.props.user;
    if (
      [studentId, name, gender, phoneNumber, school, college, year].every(
        item => item !== ""
      )
    ) {
      try {
        const {
          data: { data: userInfo, success, ...err }
        } = await bindInfo({
          studentId,
          name,
          gender,
          school,
          college,
          major,
          year,
          phonenumber: phoneNumber
        });
        if (!success) {
          throw new Error(JSON.stringify(err));
        }
        this.props.onUpdateInfo(userInfo);
        this.props.onFetchAllInformation();
        this.props.onFetchNews();
        this.props.onFetchSchoolRank();
        Taro.navigateBack();
      } catch (e) {
        console.error(e);
      }
    }
  }

  render() {
    const {
      name,
      school,
      college,
      year,
      studentId,
      phoneNumber,
      schoolRange,
      collegeRange
    } = this.state;

    return (
      <View className="bind-info">
        <Image
          className="background-image"
          src="https://fzlm.njupt.edu.cn/police/image/2x/%E8%83%8C%E6%99%AF1@2x.png"
        />

        <View className="container">
          {/* 标题 */}
          <View className="title red-text">反诈联盟</View>
          <View className="title">信息绑定</View>

          {/* 个人信息的表单 */}
          <View className="input-wrapper">
            <Input
              className="input"
              onInput={this.handleNameInput}
              value={name}
              placeholder="姓名"
              placeholderClass="input-placeholder"
            />
          </View>
          {/* 学校 */}
          <View className="input-wrapper">
            <Picker
              mode="selector"
              onChange={this.handleSchoolSelect}
              range={schoolRange}
            >
              <View className="input select ellipsis">
                {school ? (
                  <Text className="text">{school}</Text>
                ) : (
                  <Text class="text default">学校</Text>
                )}
                <View className="triangle" />
              </View>
            </Picker>
          </View>
          {/* 学院 */}
          <View className="input-wrapper">
            <Picker
              mode="selector"
              onChange={this.handleCollegeSelect}
              range={collegeRange}
            >
              <View className="input select ellipsis">
                {college ? (
                  <Text className="text">{college}</Text>
                ) : (
                  <Text class="text default">学院</Text>
                )}
                <View className="triangle" />
              </View>
            </Picker>
          </View>
          <View className="input-wrapper">
            <Input
              onInput={this.handleStudentIdInput}
              value={studentId}
              className="input"
              placeholder="学号"
              placeholderClass="input-placeholder"
            />
          </View>
          {/* 手机号 */}
          <View className="input-wrapper">
            <Input
              onInput={this.handlePhoneInput}
              className="input"
              value={phoneNumber}
              placeholder="手机号"
              placeholderClass="input-placeholder"
            />
          </View>
          <View className="input-wrapper">
            <Input
              onInput={this.handleYearInput}
              className="input"
              value={year}
              placeholder="入学年份"
              placeholderClass="input-placeholder"
            />
          </View>
          {/* 绑定须知 */}
          <View className="know-before">
            绑定须知：绑定须知绑定须知绑定须知绑定须知绑定须知绑定须知绑定须知绑定须知绑定须知绑定须知绑定须知绑定须知绑定须知
          </View>

          {/* 确认按钮 */}
          <Button className="button confirm-button" onClick={this.handleSubmit}>
            确认
          </Button>
        </View>
      </View>
    );
  }
}

export default BindInfo;
