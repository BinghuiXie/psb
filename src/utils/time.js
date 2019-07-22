/**
 * @param  {number} str
 */
export const padStartWithZero = num => num.toString().padStart(2, "0");

/**
 * @param  {number} timestamp 13位时间戳
 * @param  {string} format 时间格式
 */
export const formatTime = (timestamp, format) => {
  const date = new Date(Number.parseInt(timestamp));
  if (format.includes("YYYY")) {
    // 年
    format = format.replace("YYYY", date.getFullYear());
  }
  if (format.includes("MM")) {
    // 月
    format = format.replace("MM", date.getMonth() + 1);
  }
  if (format.includes("DD")) {
    // 日
    format = format.replace("DD", date.getDate());
  }
  if (format.includes("HH")) {
    // 小时，0 - 24
    format = format.replace("HH", date.getHours());
  }
  if (format.includes("hh")) {
    // 小时，0 - 12
    format = format.replace("hh", padStartWithZero(date.getHours() % 12));
  }
  if (format.includes("mm")) {
    // 分
    format = format.replace("mm", padStartWithZero(date.getMinutes()));
  }
  if (format.includes("ss")) {
    // 秒
    format = format.replace("ss", padStartWithZero(date.getSeconds()));
  }
  return format;
};

export const formatDateTime = function(inputTime) {
  var date = new Date(inputTime);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  var d = date.getDate();
  d = d < 10 ? "0" + d : d;
  return y + "-" + m + "-" + d;
};
