import Vue from "vue";
/**
 * @Description: 对象数组去重
 * @author Wish
 * @date 2020/3/23
*/
Vue.prototype.$ObjArr =(objArray) => {
  const result = [];//去重后返回的结果数组
  const temp = {};//临时对象
  //将对象数组中每一项的name值作为属性，若temp不拥有此属性时则为temp添加此属性且将其值赋为true，并将这一项push到结果数组中
  for (let i = 0; i < objArray.length; i++) {
    const myname = objArray[i].name;
    if (temp[myname]) {//如果temp中已经存在此属性名，则说明遇到重复项
      continue;//不继续执行接下来的代码，跳转至循环开头
    }
    temp[myname] = true;//为temp添加此属性（myname）且将其值赋为true
    result.push(objArray[i]);//将这一项复制到结果数组result中去
  }
  return result;
}
/**
 * @Description: 时间戳转换
 * @author Wish
 * @date 2020/3/23
*/
Vue.prototype.$getTime = (data) =>{
  if(data){
    let date = new Date(data);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    return year
      + "-" + (month < 10 ? "0" + month : month)
      + "-" + (day < 10 ? "0" + day : day)
      + " " + (hour < 10 ? "0" + hour : hour)
      + ":" + (minute < 10 ? "0" + minute : minute)
      + ":" + (second < 10 ? "0" + second : second);
  }else {
    return null
  }
}