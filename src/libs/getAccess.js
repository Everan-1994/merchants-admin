/**
 * Created by mll on 2018/10/29.
 */
import { getLocalStorage,setLocalStorage } from '@/libs/util'
var arry = getLocalStorage('access').split(',');
export const getAccess = (arr) => {
  const b = ["*"];
  if (arry.toString() === b.toString()){
    return arry
  }else {
    const a = arry.filter(item => arr.some(ele => ele === item));
    if (a.length === 0){
      return ['#']
    }else {
      return a
    }
  }
}
