const getWxCode = state => state.user.wxCode;
const getUserAvatar = state => state.user.avatar;
const getUserNickName = state => state.user.nickName;

const userSelector = {
  getWxCode,
  getUserAvatar,
  getUserNickName
};

export default userSelector;
