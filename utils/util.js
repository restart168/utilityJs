const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

function formatDate(number, format) {
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];
  var date = new Date(number);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));
  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));
  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

function formatWeek(number) {
  var date = new Date(number);
  let year = parseInt(date.getFullYear());
  let month = parseInt(date.getMonth()) + 1;
  var day = parseInt(date.getDay());
  let mydate = new Date(year, month - 1, day);
  let weekday = mydate.getDay();
  let weekno = Math.ceil((day + 6 - weekday) / 7);
  return weekno;
}

function getStartDayOfWeek(number) {
  var now = new Date();
  var nowDayOfWeek = now.getDay(); // 今天本周的第几天
  var nowDay = now.getDate(); // 当前日
  var nowMonth = now.getMonth(); // 当前月
  var nowYear = now.getYear(); // 当前年
  var day = nowDayOfWeek || 7;
  return formatDate2(new Date(now.getFullYear(), nowMonth, nowDay + 1 - day));
}

function getEndDayOfWeek(number) {
  var now = new Date();
  var nowDayOfWeek = now.getDay(); // 今天本周的第几天
  var nowDay = now.getDate(); // 当前日
  var nowMonth = now.getMonth(); // 当前月
  var nowYear = now.getYear(); // 当前年
  var day = nowDayOfWeek || 7;
  return formatDate2(new Date(now.getFullYear(), nowMonth, nowDay + 7 - day));
}

const formatDate2 = date => {
  var myyear = date.getFullYear();
  var mymonth = date.getMonth() + 1;
  var myweekday = date.getDate();
  if (mymonth < 10) {
    mymonth = "0" + mymonth;
  }
  if (myweekday < 10) {
    myweekday = "0" + myweekday;
  }
  return (myyear + "年" + mymonth + "月" + myweekday + '日');
}

const formatToTimeSpane = dateStr => {
  var date = new Date(dateStr);
  console.log(date);
  var time = date.getTime();
  return time;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
const formatNumber1 = n => {
  return parseInt(n) > 9 ? n : '0' + n
}
const formatterDate = (type = "YYYY-MM-DD", time = new Date().getTime()) => {
  let date = new Date(time)
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()
  return type.replace('YYYY', year)
    .replace('MM', month < 10 ? '0' + month : month)
    .replace('M', month)
    .replace('DD', day < 10 ? '0' + day : day)
    .replace('D', day)
    .replace('hh', hour < 10 ? '0' + hour : hour)
    .replace('h', hour)
    .replace('mm', minute < 10 ? '0' + minute : minute)
    .replace('m', minute)
    .replace('ss', second < 10 ? '0' + second : second)
    .replace('s', second)
}
const debounce = function(fn,time=500){
  let timer = null
  return function (...val){
    let self = this
    if(timer){
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(self,val)
    }, time);
  }
}
const throttle = function(fn,time=500,errFn){
  let timer = null
  return function (...val){
    let self = this
    if(timer!==null){
      if(typeof errFn === 'function'){
        errFn()
      }
      return
    }
    fn.apply(self,val)
    timer = setTimeout(() => {
      clearTimeout(timer)
      timer = null
    }, time);
  }
}
export default {
  formatterDate,
  formatNumber1,
  formatTime,
  formatDate,
  formatToTimeSpane,
  formatWeek: formatWeek,
  getStartDayOfWeek: getStartDayOfWeek,
  getEndDayOfWeek: getEndDayOfWeek,
  debounce,
  throttle
}